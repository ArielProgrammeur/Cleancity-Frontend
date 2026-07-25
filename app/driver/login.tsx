import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../src/core/contexts/DriverContext';

export default function DriverLogin() {
  const { login } = useDriver();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }
    if (!password.trim()) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/driver' as any);
    } else {
      setError(result.error || 'Identifiants incorrects');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Ionicons name="car" size={44} color="#10B981" />
        </View>
        <Text style={styles.title}>CleanCity</Text>
        <Text style={styles.subtitle}>Espace conducteur</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputWrap}>
          <Ionicons name="mail" size={18} color="#6B7AA8" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Email conducteur"
            placeholderTextColor="#4A5A7A"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed" size={18} color="#6B7AA8" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#4A5A7A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginBtnText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color="#6B7AA8" />
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.hintBox}>
          <Ionicons name="information-circle" size={14} color="#3B82F6" />
          <Text style={styles.hintText}>
            Utilisez votre email professionnel (ex: mamadou.diop@cleancity.sn)
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  bgCircle1: { position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: 120, backgroundColor: '#10B98104' },
  bgCircle2: { position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: '#10B98108' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logoWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#10B98115', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#10B98125' },
  title: { fontSize: 28, fontWeight: '800', color: '#F1F5F9', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#6B7AA8', textAlign: 'center', marginTop: 4, fontWeight: '500', marginBottom: 36 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#DC262615', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#DC262620' },
  errorText: { fontSize: 12, color: '#EF4444', fontWeight: '600', flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131A2E', borderRadius: 14, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: '#1E2A4A', marginBottom: 16 },
  input: { flex: 1, fontSize: 14, color: '#F1F5F9', fontWeight: '500' },
  loginBtn: { height: 52, backgroundColor: '#10B981', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  backBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  backBtnText: { fontSize: 13, fontWeight: '600', color: '#6B7AA8' },
  hintBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#3B82F610', borderRadius: 10, padding: 10, marginTop: 16 },
  hintText: { fontSize: 11, color: '#6B7AA8', fontWeight: '500', flex: 1, lineHeight: 16 },
});
