import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function Details() {
  const { name } = useLocalSearchParams<{ name?: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Details' }} />
      <Text style={styles.title}>
        {name ? `Showing details for user ${name}` : 'No user specified'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});
