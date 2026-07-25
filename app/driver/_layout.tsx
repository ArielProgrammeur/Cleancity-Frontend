import { Stack, Redirect, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DriverProvider, useDriver } from '../../src/core/contexts/DriverContext';

function DriverNavigator() {
  const { isAuthenticated } = useDriver();
  const pathname = usePathname();

  if (!isAuthenticated && pathname !== '/driver/login') {
    return <Redirect href="/driver/login" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}

export default function DriverLayout() {
  return (
    <DriverProvider>
      <DriverNavigator />
    </DriverProvider>
  );
}
