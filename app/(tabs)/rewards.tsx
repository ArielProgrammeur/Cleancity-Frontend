import { Stack } from 'expo-router';
import { RewardsScreen } from '../../src/presentation/features/rewards';

export default function RewardsTab() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RewardsScreen />
    </>
  );
}
