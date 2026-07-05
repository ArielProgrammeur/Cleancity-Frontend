import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedCounter } from './AnimatedCounter';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
  suffix?: string;
  index: number;
  onPress?: () => void;
}

export function StatCard({ icon, label, value, color, suffix, index, onPress }: StatCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify().damping(15)}
      style={{ width: '47%' }}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.top}>
          <View style={[styles.iconRing, { borderColor: color + '30' }]}>
            <View style={[styles.iconBg, { backgroundColor: color + '15' }]}>
              <Ionicons name={icon as any} size={16} color={color} />
            </View>
          </View>
          <View style={[styles.trendDot, { backgroundColor: color }]} />
        </View>
        <AnimatedCounter
          value={value}
          suffix={suffix ? ` ${suffix}` : ''}
          delay={index * 120}
          style={styles.value}
          precision={suffix === 'k' ? 1 : 0}
        />
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.glowBar, { backgroundColor: color + '15' }]}>
          <View style={[styles.glowFill, { backgroundColor: color, width: '100%' }]} />
        </View>
        <View style={styles.drillHint}>
          <Text style={[styles.drillText, { color: color }]}>Détails</Text>
          <Ionicons name="chevron-forward" size={10} color={color} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131A2E',
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1E2A4A',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  top: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  iconRing: {
    width: 38, height: 38, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBg: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  trendDot: {
    width: 8, height: 8, borderRadius: 4, opacity: 0.6,
  },
  value: {
    fontSize: 26, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 11, fontWeight: '600', color: '#6B7AA8',
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  glowBar: {
    height: 2, borderRadius: 1, overflow: 'hidden',
  },
  glowFill: {
    height: '100%', borderRadius: 1, opacity: 0.5,
  },
  drillHint: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    marginTop: 2,
  },
  drillText: {
    fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },
});
