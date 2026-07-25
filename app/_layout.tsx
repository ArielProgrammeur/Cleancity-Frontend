import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { UserProvider } from '../src/core/contexts/UserContext';
import { AdminProvider } from '../src/core/contexts/AdminContext';
import { SidebarProvider } from '../src/core/contexts/SidebarContext';

import '../src/core/firebase';

let i18n: any = null;
try {
  i18n = require('../src/core/i18n').default;
} catch (e) {
  console.warn('[CLEANCITY] i18n init failed:', e);
}

export default function Layout() {
  useEffect(() => {
    if (i18n && !i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <UserProvider>
        <AdminProvider>
          <SidebarProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SidebarProvider>
        </AdminProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
