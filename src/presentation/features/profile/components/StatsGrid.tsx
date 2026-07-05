import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { UserImpact } from '../../../../domain/entities/Profile';

interface StatsGridProps { impact: UserImpact }

const STATS = [
  { key: 'co2Saved' as const, label: 'CO₂ Saved', icon: 'leaf', unit: 'kg', color: '#059669', gradient: ['#059669', '#34D399'] as const },
  { key: 'energySaved' as const, label: 'Energy Saved', icon: 'flash', unit: 'kWh', color: '#D97706', gradient: ['#D97706', '#FBBF24'] as const },
  { key: 'wasteDiverted' as const, label: 'Waste Diverted', icon: 'trash', unit: 'kg', color: '#2563EB', gradient: ['#2563EB', '#60A5FA'] as const },
  { key: 'waterSaved' as const, label: 'Water Saved', icon: 'water', unit: 'L', color: '#7C3AED', gradient: ['#7C3AED', '#A78BFA'] as const },
];

export function StatsGrid({ impact }: StatsGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your Impact</Text>
        <View style={styles.impactBadge}>
          <Ionicons name="trending-up" size={12} color="#059669" />
          <Text style={styles.impactBadgeText}>Eco Score</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {STATS.map((stat, idx) => {
          const value = impact[stat.key];
          return (
            <Animated.View
              key={stat.key}
              entering={FadeInUp.delay(idx * 70).springify().damping(14)}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
              </View>
              <Text style={styles.value}>
                {typeof value === 'number' ? value.toLocaleString() : value}
                <Text style={styles.unit}> {stat.unit}</Text>
              </Text>
              <Text style={styles.label}>{stat.label}</Text>
              <View style={[styles.miniBar, { backgroundColor: stat.color + '15' }]}>
                <View style={[styles.miniBarFill, { backgroundColor: stat.color, width: `${Math.min((typeof value === 'number' ? value : 0) / 500 * 100, 100)}%` }]} />
              </View>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  impactBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 4 },
  impactBadgeText: { fontSize: 11, fontWeight: '700', color: '#059669' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '47%', flexGrow: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#F0F1F3', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.4 },
  unit: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  label: { fontSize: 11, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3 },
  miniBar: { height: 3, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  miniBarFill: { height: '100%', borderRadius: 2 },
});
