import { Stack, Redirect, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAdmin } from '../../src/core/contexts/AdminContext';
import { useSidebar } from '../../src/core/contexts/SidebarContext';
import { Sidebar } from '../../src/presentation/admin/components/Sidebar';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdmin();
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  if (!isAuthenticated && pathname !== '/admin/login') {
    return <Redirect href="/admin/login" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
      <Sidebar visible={open} onClose={() => setOpen(false)} onLogout={logout} />
    </>
  );
}
