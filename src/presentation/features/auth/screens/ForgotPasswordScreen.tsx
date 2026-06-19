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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AuthInput } from '../components/AuthInput';

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image source={require('../../../../../assets/logo.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        {sent ? (
          <View style={styles.sentContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#2E7D32" />
            <Text style={styles.sentTitle}>Email sent</Text>
            <Text style={styles.sentText}>
              Check your inbox for the password reset link
            </Text>
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <AuthInput
              label="Email"
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
            />

            <TouchableOpacity
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.sendButtonText}>Send reset link</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerLink}>Sign In</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  sendButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sentContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  sentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  sentText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  backToLoginButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
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
