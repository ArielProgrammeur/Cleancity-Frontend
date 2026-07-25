import { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AdminHeaderProps {
  totalReports: number;
  activeUsers: number;
  totalPoints: number;
  onMenuPress: () => void;
}

export function AdminHeader({ totalReports, activeUsers, totalPoints, onMenuPress }: AdminHeaderProps) {
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const pointsDisplay = totalPoints > 1000 ? `${Math.round(totalPoints / 1000)}k` : `${totalPoints}`;

  return (
    <LinearGradient
      colors={['#0D1520', '#0A0F1E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.wrapper}
    >
      <View style={styles.accentLine} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoWrap}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.logoGradient}>
                <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.statusDot} />
            </View>
            <View>
              <Text style={styles.brandName}>CleanCity</Text>
              <View style={styles.brandSubRow}>
                <RNAnimated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
                <Text style={styles.liveLabel}>Administration</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress} activeOpacity={0.7}>
            <Ionicons name="menu" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsCard}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{totalReports}</Text>
            <Text style={styles.metricLabel}>Signalements</Text>
          </View>
          <View style={styles.metricDiv} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{activeUsers}</Text>
            <Text style={styles.metricLabel}>Actifs</Text>
          </View>
          <View style={styles.metricDiv} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricValue, { color: '#FCD34D' }]}>{pointsDisplay}</Text>
            <Text style={styles.metricLabel}>Points</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  accentLine: { height: 3, backgroundColor: '#10B981' },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoWrap: { position: 'relative' },
  logoGradient: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  statusDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#10B981', borderWidth: 2, borderColor: '#0D1520',
  },
  brandName: { fontSize: 18, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.3 },
  brandSubRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#10B981' },
  liveLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', letterSpacing: 0.3 },
  menuBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  metricsCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#131A2E', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 8,
    borderWidth: 1, borderColor: '#1E2A4A',
  },
  metricItem: { flex: 1, alignItems: 'center', gap: 2 },
  metricValue: { fontSize: 16, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.3, fontVariant: ['tabular-nums'] },
  metricLabel: { fontSize: 9, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  metricDiv: { width: 1, height: 24, backgroundColor: '#1E2A4A' },
});
