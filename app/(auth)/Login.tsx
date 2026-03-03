import React, { useState } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,StatusBar,KeyboardAvoidingView,Platform,} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Implémenter l'API de connexion
    // Pour l'instant, on simule une connexion réussie
    try {
      await AsyncStorage.setItem('userToken', 'fake-token-123');
      router.replace('../(tabs)/Home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenue sur CleanCity</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          <TouchableOpacity onPress={() => router.push('../(auth)/ForgotPassword')}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleLogin}
          >
            <Text style={styles.buttonPrimaryText}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vous n'avez pas de compte ? </Text>
          <TouchableOpacity onPress={() => router.push('../(auth)/Register')}>
            <Text style={styles.registerText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.xl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: Sizes.titleMd,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  subtitle: {
    fontSize: Sizes.textLg,
    color: Colors.textSecondary,
  },
  form: {
    marginBottom: Sizes.xl,
  },
  inputContainer: {
    marginBottom: Sizes.lg,
  },
  label: {
    fontSize: Sizes.textMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: Sizes.md,
    paddingVertical: 14,
    fontSize: Sizes.textLg,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },
  forgotText: {
    color: Colors.primary,
    fontSize: Sizes.textMd,
    textAlign: 'right',
    marginBottom: Sizes.lg,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: Colors.white,
    fontSize: Sizes.textLg,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: Sizes.textMd,
    color: Colors.textSecondary,
  },
  registerText: {
    fontSize: Sizes.textMd,
    color: Colors.primary,
    fontWeight: '600',
  },
});