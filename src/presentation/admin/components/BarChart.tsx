import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface BarChartProps {
  data: { category: string; count: number; color: string }[];
}

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <View style={styles.container}>
      {data.map((d, idx) => {
        const pct = (d.count / max) * 100;
        return (
          <Animated.View
            key={d.category}
            entering={FadeInRight.delay(idx * 60).springify().damping(16)}
            style={styles.row}
          >
            <Text style={styles.label}>{d.category}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: d.color }]} />
              <View style={[styles.barGlow, { width: `${pct}%`, backgroundColor: d.color }]} />
            </View>
            <Text style={styles.value}>{d.count}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { width: 90, fontSize: 11, fontWeight: '600', color: '#94A3B8', letterSpacing: 0.2 },
  barTrack: {
    flex: 1, height: 20, borderRadius: 6,
    backgroundColor: '#1A2340', overflow: 'hidden', position: 'relative',
  },
  barFill: {
    position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 6, opacity: 0.85,
  },
  barGlow: {
    position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 6, opacity: 0.15,
  },
  value: { width: 36, fontSize: 12, fontWeight: '700', color: '#F1F5F9', textAlign: 'right', fontVariant: ['tabular-nums'] },
});
