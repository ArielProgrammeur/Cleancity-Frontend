import { Stack } from 'expo-router';
import { SignUpScreen } from '../src/presentation/features/auth';

export default function SignUp() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SignUpScreen />
    </>
  );
}
