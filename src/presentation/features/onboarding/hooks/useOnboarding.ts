import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_KEY = '@cleancity/hasSeenOnboarding';

export async function hasSeenOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function markOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
