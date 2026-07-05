import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import i18n from '../src/core/i18n';
import { UserProvider } from '../src/core/contexts/UserContext';
import { AdminProvider } from '../src/core/contexts/AdminContext';

export default function Layout() {
  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <AdminProvider>
          <Stack />
        </AdminProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
