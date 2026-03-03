import React, { useState } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,StatusBar,KeyboardAvoidingView,Platform,ScrollView,} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ phone, setPhone] = useState('');

  const handleRegister = async () => {
    // Implémenter l'API d'inscription
    // Pour l'instant, on simule une inscription réussie
    try {
      await AsyncStorage.setItem('userToken', 'fake-token-123');
      router.replace('../(tabs)/home');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez la communauté CleanCity</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom complet</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                value={name}
                onChangeText={setName}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                placeholder="Numero de telephone"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.push('../Login')}>
              <Text style={styles.buttonPrimaryText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.xl,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: Sizes.titleMd,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.sm,
    textAlign: 'center',
    marginTop: 35,
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
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
    marginTop: Sizes.sm,
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
  loginText: {
    fontSize: Sizes.textMd,
    color: Colors.primary,
    fontWeight: '600',
  },
});