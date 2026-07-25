import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth, app } from '../../../../core/firebase';
import { signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { OtpInput } from '../components/OtpInput';
import { api } from '../../../../core/api/api';

type Method = 'phone' | 'email';

export default function OtpVerificationScreen() {
  const { t } = useTranslation();
  const [method, setMethod] = useState<Method>('email');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const user = auth?.currentUser;
  const phone = user?.phoneNumber || '';
  const email = user?.email || '';

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendPhoneOtp = async () => {
    if (!auth || !user?.phoneNumber) {
      Alert.alert(t('auth.error'), t('otp.noPhone'));
      return;
    }
    if (!recaptchaVerifier.current) {
      Alert.alert(t('auth.error'), t('otp.loading'));
      return;
    }
    setIsLoading(true);
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        user.phoneNumber,
        recaptchaVerifier.current,
      );
      setConfirmationResult(confirmation);
      setCodeSent(true);
      setCountdown(60);
    } catch (e: any) {
      Alert.alert(t('auth.error'), e.message || t('otp.sendSmsError'));
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailOtp = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${api.baseUrl}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid: user.uid, method: 'email' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || t('otp.sendError'));
      setCodeSent(true);
      setCountdown(60);
      Alert.alert(t('common.success'), data.message || t('otp.codeSent'));
    } catch (e: any) {
      Alert.alert(t('auth.error'), e.message || t('otp.sendEmailError'));
    } finally {
      setIsLoading(false);
    }
  };

  const sendCode = () => {
    setCode('');
    if (method === 'phone') {
      sendPhoneOtp();
    } else {
      sendEmailOtp();
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      Alert.alert(t('auth.error'), t('otp.enterSixDigits'));
      return;
    }
    if (!user) return;

    setIsLoading(true);
    try {
      if (method === 'phone') {
        if (!confirmationResult) {
          Alert.alert(t('auth.error'), t('otp.enterCodeFirst'));
          setIsLoading(false);
          return;
        }
        await confirmationResult.confirm(code);
        const token = await user.getIdToken();
        await fetch(`${api.baseUrl}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ uid: user.uid, code: '000000', method: 'phone' }),
        });
      } else {
        const token = await user.getIdToken();
        const res = await fetch(`${api.baseUrl}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ uid: user.uid, code, method: 'email' }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || t('otp.invalidCode'));
      }

      Alert.alert(t('common.success'), t('otp.success'), [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    } catch (e: any) {
      Alert.alert(t('auth.error'), e.message || t('otp.invalidCode'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{t('otp.noUser')}</Text>
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.linkText}>{t('otp.backToLogin')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app ? app.options : undefined}
        attemptInvisibleVerification
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={40} color="#2E7D32" />
          </View>
          <Text style={styles.title}>{t('otp.title')}</Text>
          <Text style={styles.subtitle}>
            {t('otp.subtitle')}
          </Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, method === 'email' && styles.tabActive]}
            onPress={() => { setMethod('email'); setCodeSent(false); setCode(''); }}
          >
            <Ionicons name="mail-outline" size={20} color={method === 'email' ? '#FFF' : '#6B7280'} />
            <Text style={[styles.tabText, method === 'email' && styles.tabTextActive]}>{t('otp.emailTab')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, method === 'phone' && styles.tabActive]}
            onPress={() => { setMethod('phone'); setCodeSent(false); setCode(''); }}
          >
            <Ionicons name="call-outline" size={20} color={method === 'phone' ? '#FFF' : '#6B7280'} />
            <Text style={[styles.tabText, method === 'phone' && styles.tabTextActive]}>{t('otp.phoneTab')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons
            name={method === 'email' ? 'mail' : 'call'}
            size={20}
            color="#2E7D32"
          />
          <Text style={styles.infoText}>
            {method === 'email'
              ? t('otp.emailDesc', { email })
              : phone
                ? t('otp.phoneDesc', { phone })
                : t('otp.noPhone')}
          </Text>
        </View>

        {!codeSent ? (
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.buttonDisabled]}
            onPress={sendCode}
            disabled={isLoading || countdown > 0}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color="#FFF" />
                <Text style={styles.sendButtonText}>{t('otp.sendCode')}</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>{t('otp.enterCode')}</Text>
              <OtpInput code={code} onChangeCode={setCode} autoFocus />
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, (isLoading || code.length !== 6) && styles.buttonDisabled]}
              onPress={verifyCode}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                  <Text style={styles.verifyButtonText}>{t('otp.verify')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resendButton, countdown > 0 && styles.buttonDisabled]}
              onPress={sendCode}
              disabled={countdown > 0 || isLoading}
            >
              <Text style={[styles.resendText, countdown > 0 && { color: '#9CA3AF' }]}>
                {countdown > 0
                  ? t('otp.resendTimer', { seconds: countdown })
                  : t('otp.resend')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', gap: 12 },
  errorText: { fontSize: 16, color: '#6B7280' },
  linkText: { fontSize: 15, color: '#2E7D32', fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  tabs: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6 },
  tabActive: { backgroundColor: '#2E7D32' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#FFF' },
  infoCard: { flexDirection: 'row', backgroundColor: '#F0FDF4', padding: 14, borderRadius: 12, gap: 10, alignItems: 'center', marginBottom: 24 },
  infoText: { fontSize: 13, color: '#374151', flex: 1 },
  sendButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2E7D32', paddingVertical: 16, borderRadius: 12, gap: 8, marginBottom: 16 },
  sendButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  verifyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2E7D32', paddingVertical: 16, borderRadius: 12, gap: 8, marginBottom: 12 },
  verifyButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  buttonDisabled: { opacity: 0.5 },
  otpSection: { alignItems: 'center', marginBottom: 24 },
  otpLabel: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 16 },
  resendButton: { alignItems: 'center', paddingVertical: 12, marginBottom: 16 },
  resendText: { fontSize: 14, fontWeight: '600', color: '#2E7D32' },
});
