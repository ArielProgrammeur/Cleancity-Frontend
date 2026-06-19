import { Stack } from 'expo-router';
import { ReportScreen } from '../../src/presentation/features/reporting';

export default function ReportTab() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ReportScreen />
    </>
  );
}
