import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAdmin } from '../../src/core/contexts/AdminContext';

export default function AdminLayout() {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Redirect href="/admin/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
});
