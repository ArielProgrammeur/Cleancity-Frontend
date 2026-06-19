import { Stack } from 'expo-router';
import { ForgotPasswordScreen } from '../src/presentation/features/auth';

export default function ForgotPassword() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ForgotPasswordScreen />
    </>
  );
}
