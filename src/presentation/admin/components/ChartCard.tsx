import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, icon, accentColor = '#10B981', children }: ChartCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: accentColor + '15' }]}>
            <Ionicons name={icon as any} size={14} color={accentColor} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, { backgroundColor: accentColor }]} />
          <Text style={[styles.liveText, { color: accentColor }]}>Live</Text>
        </View>
      </View>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16, marginBottom: 14,
    backgroundColor: '#131A2E', borderRadius: 20,
    padding: 20,
    borderWidth: 1, borderColor: '#1E2A4A',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.2 },
  subtitle: { fontSize: 11, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1A2340', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: '#1E2A4A',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: '#1E2A4A', marginBottom: 16 },
});
