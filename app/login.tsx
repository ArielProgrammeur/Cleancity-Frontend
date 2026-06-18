import { Stack } from 'expo-router';
import { LoginScreen } from '../src/presentation/features/auth';

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  );
}
