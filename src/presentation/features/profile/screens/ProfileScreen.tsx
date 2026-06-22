import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileMockDatasource } from '../../../../data/datasources/ProfileMockDatasource';
import { ProfileRepositoryImpl } from '../../../../data/repositories/ProfileRepositoryImpl';
import { useProfile } from '../hooks/useProfile';
import { ProfileHeader } from '../components/ProfileHeader';
import { StatsGrid } from '../components/StatsGrid';
import { AchievementSection } from '../components/AchievementSection';

const datasource = new ProfileMockDatasource();
const repository = new ProfileRepositoryImpl(datasource);

const SETTINGS_ROWS: { icon: string; label: string; color: string }[] = [
  { icon: 'notifications-outline', label: 'Notifications', color: '#2563EB' },
  { icon: 'shield-outline', label: 'Privacy', color: '#059669' },
  { icon: 'color-palette-outline', label: 'Theme', color: '#7C3AED' },
  { icon: 'language-outline', label: 'Language', color: '#D97706' },
  { icon: 'information-circle-outline', label: 'About', color: '#6B7280' },
];

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, badges, isLoading, error, updateProfile, refresh } = useProfile(repository);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');

  const handleEdit = () => {
    if (!profile) return;
    setEditName(profile.name);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !profile) return;
    await updateProfile({ name: editName.trim() });
    setShowEdit(false);
  };

  if (isLoading || !profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerSkeleton}>
          <View style={styles.skelAvatar} />
          <View style={styles.skelTitle} />
          <View style={styles.skelSubtitle} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }, styles.errorContainer]}>
        <Ionicons name="cloud-offline-outline" size={56} color="#D1D5DB" />
        <Text style={styles.errorTitle}>Failed to load profile</Text>
        <Text style={styles.errorDesc}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refresh} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryText}>  Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      entering={FadeInDown.duration(400)}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#2563EB" colors={['#2563EB']} />}
    >
      <View style={[styles.headerSection, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.7}>
            <Ionicons name="pencil" size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      <ProfileHeader profile={profile} />
      <StatsGrid impact={profile.impact} />
      <AchievementSection badges={badges} />

      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {SETTINGS_ROWS.map((row, idx) => (
            <TouchableOpacity key={row.label} style={[styles.settingRow, idx < SETTINGS_ROWS.length - 1 && styles.settingRowBorder]} activeOpacity={0.6}>
              <View style={[styles.settingIcon, { backgroundColor: row.color + '12' }]}>
                <Ionicons name={row.icon as any} size={18} color={row.color} />
              </View>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {showEdit && (
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown.duration(200)} style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowEdit(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFB' },
  errorContainer: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  errorDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { flexDirection: 'row', backgroundColor: '#2563EB', paddingHorizontal: 24, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  retryText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  headerSection: { paddingBottom: 4, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F1F3' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.4 },
  editBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
  headerSkeleton: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  skelAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6' },
  skelTitle: { width: 120, height: 20, borderRadius: 4, backgroundColor: '#F3F4F6' },
  skelSubtitle: { width: 160, height: 14, borderRadius: 4, backgroundColor: '#F3F4F6' },
  settingsSection: { paddingHorizontal: 20, marginTop: 24 },
  settingsTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 14 },
  settingsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F1F3' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '85%', gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center' },
  modalInput: { backgroundColor: '#F9FAFB', borderRadius: 14, paddingHorizontal: 16, height: 48, fontSize: 16, fontWeight: '600', color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  modalSave: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB' },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
