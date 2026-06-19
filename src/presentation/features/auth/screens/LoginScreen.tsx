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

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simuler une connexion (Firebase plus tard)
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
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
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Image source={require('../../../../../assets/logo.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>
            Sign in to continue cleaning your city
          </Text>
        </View>

        <View style={styles.form}>
          <AuthInput
            label="Email"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />

          <AuthInput
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={22} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
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
