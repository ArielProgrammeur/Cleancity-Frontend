import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { UserImpact } from '../../../../domain/entities/Profile';

interface StatsGridProps {
  impact: UserImpact;
}

const STATS = [
  { key: 'co2Saved' as const, label: 'CO₂ Saved', icon: 'leaf', unit: 'kg', color: '#059669' },
  { key: 'energySaved' as const, label: 'Energy', icon: 'flash', unit: 'kWh', color: '#D97706' },
  { key: 'wasteDiverted' as const, label: 'Waste Diverted', icon: 'trash', unit: 'kg', color: '#2563EB' },
  { key: 'waterSaved' as const, label: 'Water Saved', icon: 'water', unit: 'L', color: '#7C3AED' },
] as const;

export function StatsGrid({ impact }: StatsGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Impact</Text>
      <View style={styles.grid}>
        {STATS.map((stat, idx) => {
          const value = impact[stat.key];
          return (
            <Animated.View
              key={stat.key}
              entering={FadeInUp.delay(idx * 70).springify().damping(14)}
              style={styles.card}
            >
              <View style={[styles.iconWrap, { backgroundColor: stat.color + '12' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.value}>
                {typeof value === 'number' ? value.toLocaleString() : value}
                <Text style={styles.unit}> {stat.unit}</Text>
              </Text>
              <Text style={styles.label}>{stat.label}</Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  unit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
