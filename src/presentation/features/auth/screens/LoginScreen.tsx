import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AuthInput } from '../components/AuthInput';
import { useAdmin } from '../../../../core/contexts/AdminContext';
import { useUser } from '../../../../core/contexts/UserContext';
import { auth } from '../../../../core/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { api } from '../../../../core/api/api';

export function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const admin = useAdmin();
  const { setUserId, setUserName, setIsLoggedIn } = useUser();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('auth.error'), t('auth.fillAllFields'));
      return;
    }

    setIsLoading(true);

    try {
      if (!auth) {
        Alert.alert(t('auth.error'), t('auth.firebaseNotReady'));
        setIsLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role;

      if (role === 'admin') {
        setIsLoading(false);
        router.replace('/admin');
        return;
      }

      if (role === 'driver') {
        setIsLoading(false);
        router.replace('/driver');
        return;
      }

      const token = await user.getIdToken();
      const statusRes = await fetch(`${api.baseUrl}/api/auth/verification-status/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statusRes.ok) {
        const status = await statusRes.json();
        if (!status.phoneVerified && !status.emailVerified) {
          setIsLoading(false);
          router.replace('/otp-verification');
          return;
        }
      }

      setUserId(user.uid);
      setUserName(user.displayName || user.email || '');
      setIsLoggedIn(true);
      router.replace('/(tabs)');
    } catch (error: any) {
      let message = t('auth.genericError');
      switch (error.code) {
        case 'auth/user-not-found':
          message = t('auth.userNotFound');
          break;
        case 'auth/wrong-password':
          message = t('auth.wrongPassword');
          break;
        case 'auth/invalid-email':
          message = t('auth.invalidEmail');
          break;
        case 'auth/invalid-credential':
          message = t('auth.wrongEmailOrPassword');
          break;
        case 'auth/too-many-requests':
          message = t('auth.tooManyRequests');
          break;
      }
      Alert.alert(t('auth.error'), message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image source={require('../../../../../assets/logo.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.welcomeTitle}>{t('auth.loginTitle')}</Text>
          <Text style={styles.welcomeSubtitle}>
            {t('auth.loginSubtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label={t('common.email')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />

          <AuthInput
            label={t('common.password')}
            placeholder={t('auth.emailPlaceholder')}
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>{t('auth.signIn')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.footerLink}>{t('auth.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '700',
  },
});
