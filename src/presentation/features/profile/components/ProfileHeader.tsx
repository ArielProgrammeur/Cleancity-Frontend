import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { UserProfile } from '../../../../domain/entities/Profile';

interface ProfileHeaderProps {
  profile: UserProfile;
  avatarUri?: string;
  onAvatarPress?: () => void;
}

export function ProfileHeader({ profile, avatarUri, onAvatarPress }: ProfileHeaderProps) {
  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.container}>
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8} style={styles.avatarRing}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}
        <View style={styles.cameraOverlay}>
          <Ionicons name="camera" size={14} color="#FFFFFF" />
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{profile.totalRewards}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#F59E0B" />
          <Text style={styles.statValue}>{profile.totalPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Ionicons name="flag" size={16} color="#2563EB" />
          <Text style={styles.statValue}>{profile.totalReports}</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Ionicons name="leaf" size={16} color="#059669" />
          <Text style={styles.statValue}>{profile.impact?.co2Saved ?? 0}kg</Text>
          <Text style={styles.statLabel}>CO₂ Saved</Text>
        </View>
      </View>

      <Text style={styles.joinDate}>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F3',
    backgroundColor: '#FFFFFF',
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  joinDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 18,
  },
});
