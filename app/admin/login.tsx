import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../src/core/contexts/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('root');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.replace('/admin' as any);
    } else {
      setError(result.error || 'Erreur de connexion');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Ionicons name="shield-checkmark" size={44} color="#2E7D32" />
        </View>
        <Text style={styles.title}>CleanCity</Text>
        <Text style={styles.subtitle}>Panneau d'administration</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            placeholder="Email administrateur"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            placeholder="Mot de passe"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="log-in" size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Se connecter</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', padding: 24 },
  bgCircle1: { position: 'absolute', top: -80, right: -80, width: 240, height: 240, borderRadius: 120, backgroundColor: '#2E7D3220' },
  bgCircle2: { position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#1B5E2015' },
  content: { gap: 16 },
  logoWrap: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  title: { fontSize: 32, fontWeight: '800', color: '#F1F5F9', textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 8 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#450A0A', borderRadius: 12, padding: 12, gap: 8, borderWidth: 1, borderColor: '#7F1D1D' },
  errorText: { color: '#FCA5A5', fontSize: 13, fontWeight: '500', flex: 1 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 14, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 14, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#F1F5F9', fontWeight: '500' },
  button: { flexDirection: 'row', height: 52, backgroundColor: '#2E7D32', borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
