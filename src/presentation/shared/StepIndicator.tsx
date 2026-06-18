import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  total: number;
  current: number;
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        {current + 1} / {total}
      </Text>
      <View style={styles.dotsRow}>
        {Array.from({ length: total }).map((_, index) => (
          <View key={index} style={styles.dotWrapper}>
            {index > 0 && (
              <View
                style={[
                  styles.line,
                  index <= current ? styles.lineActive : styles.lineInactive,
                ]}
              />
            )}
            <View
              style={[
                styles.dot,
                index < current && styles.dotCompleted,
                index === current && styles.dotActive,
                index > current && styles.dotInactive,
              ]}
            >
              <Text
                style={[
                  styles.dotText,
                  index <= current ? styles.dotTextActive : styles.dotTextInactive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  counter: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: '#FFFFFF',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  dotInactive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dotTextActive: {
    color: '#2E7D32',
  },
  dotTextInactive: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  line: {
    width: 24,
    height: 2,
  },
  lineActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  lineInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
