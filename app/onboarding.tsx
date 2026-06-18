import { Stack } from 'expo-router';
import { OnboardingScreen } from '../src/presentation/features/onboarding';

export default function Onboarding() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreen />
    </>
  );
}
