import React, { useState } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,StatusBar,} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Implémenter l'API de réinitialisation
    console.log('Reset password for:', email);
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        <Text style={styles.subtitle}>
          Entrez votre email pour recevoir un lien de réinitialisation
        </Text>

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

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleResetPassword}
        >
          <Text style={styles.buttonPrimaryText}>Envoyer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  title: {
    fontSize: Sizes.titleMd,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  subtitle: {
    fontSize: Sizes.textLg,
    color: Colors.textSecondary,
    marginBottom: 40,
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
    marginBottom: Sizes.md,
  },
  buttonPrimaryText: {
    color: Colors.white,
    fontSize: Sizes.textLg,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backText: {
    color: Colors.primary,
    fontSize: Sizes.textLg,
  },
});