import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, RefreshControl,
  TextInput, KeyboardAvoidingView, Platform, Alert, Keyboard, Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ExpoImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ProfileMockDatasource } from '../../../../data/datasources/ProfileMockDatasource';
import { ProfileRepositoryImpl } from '../../../../data/repositories/ProfileRepositoryImpl';
import { useProfile } from '../hooks/useProfile';
import { useUser } from '../../../../core/contexts/UserContext';
import { StatsGrid } from '../components/StatsGrid';
import { AchievementSection } from '../components/AchievementSection';
import type { UserProfile } from '../../../../domain/entities/Profile';

const datasource = new ProfileMockDatasource();
const repository = new ProfileRepositoryImpl(datasource);

const SETTINGS_ROWS: { icon: string; label: string; color: string; action: () => void }[] = [
  { icon: 'notifications-outline', label: 'Notifications', color: '#2563EB', action: () => router.push('/notifications') },
  { icon: 'shield-outline', label: 'Privacy', color: '#059669', action: () => router.push('/settings') },
  { icon: 'color-palette-outline', label: 'Theme', color: '#7C3AED', action: () => router.push('/settings') },
  { icon: 'language-outline', label: 'Language', color: '#D97706', action: () => router.push('/language') },
  { icon: 'information-circle-outline', label: 'About', color: '#6B7280', action: () => Alert.alert('About', 'CleanCity v1.0.0\n\nBuilding a cleaner community together.') },
];

function ProfileHeader({ profile, avatarUri, onAvatarPress }: { profile: UserProfile; avatarUri?: string; onAvatarPress?: () => void }) {
  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <View style={ph.container}>
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8} style={ph.avatarWrap}>
        <View style={ph.avatarRing}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={ph.avatarImage} />
          ) : (
            <View style={ph.avatar}>
              <Text style={ph.avatarText}>{initial}</Text>
            </View>
          )}
        </View>
        <View style={ph.cameraBadge}>
          <Ionicons name="camera" size={12} color="#FFFFFF" />
        </View>
        <View style={ph.levelBadge}>
          <Ionicons name="trophy" size={10} color="#FFFFFF" />
          <Text style={ph.levelText}>{profile.totalRewards}</Text>
        </View>
      </TouchableOpacity>

      <Text style={ph.name}>{profile.name}</Text>
      <Text style={ph.email}>{profile.email}</Text>

      <View style={ph.statsRow}>
        <View style={ph.statItem}>
          <Text style={ph.statValue}>{profile.totalPoints.toLocaleString()}</Text>
          <View style={ph.statLabelRow}>
            <Ionicons name="star" size={10} color="#FCD34D" />
            <Text style={ph.statLabel}>Points</Text>
          </View>
        </View>
        <View style={ph.statDivider} />
        <View style={ph.statItem}>
          <Text style={ph.statValue}>{profile.totalReports}</Text>
          <View style={ph.statLabelRow}>
            <Ionicons name="flag" size={10} color="#93C5FD" />
            <Text style={ph.statLabel}>Reports</Text>
          </View>
        </View>
        <View style={ph.statDivider} />
        <View style={ph.statItem}>
          <Text style={ph.statValue}>{profile.impact?.co2Saved ?? 0} kg</Text>
          <View style={ph.statLabelRow}>
            <Ionicons name="leaf" size={10} color="#86EFAC" />
            <Text style={ph.statLabel}>CO₂ Saved</Text>
          </View>
        </View>
      </View>

      <Text style={ph.joinDate}>
        <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.5)" /> Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </Text>
    </View>
  );
}

const ph = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 8, paddingBottom: 20, paddingHorizontal: 20 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatarRing: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 74, height: 74, borderRadius: 37 },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  cameraBadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2E7D32' },
  levelBadge: { position: 'absolute', top: -4, left: -4, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 2, borderColor: '#FFFFFF', gap: 3 },
  levelText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 16, marginTop: 18, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statLabel: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.3 },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },
  joinDate: { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 14, fontWeight: '500' },
});

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { profile, badges, isLoading, error, updateProfile, refresh } = useProfile(repository);
  const { avatarUri, setAvatarUri, setUserName } = useUser();
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

  const pickImage = useCallback(async (useCamera: boolean) => {
    const permission = useCamera
      ? await ExpoImagePicker.requestCameraPermissionsAsync()
      : await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow access to your media library to set a profile picture.');
      return;
    }

    const result = useCamera
      ? await ExpoImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ExpoImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }, []);

  const handleAvatarPress = useCallback(() => {
    Keyboard.dismiss();
    Alert.alert('Profile Picture', '', [
      { text: 'Take Photo', onPress: () => pickImage(true) },
      { text: 'Choose from Gallery', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [pickImage]);

  useEffect(() => {
    if (profile) setUserName(profile.name);
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
        <View style={styles.skel}>
          <View style={styles.skelAvatar} />
          <View style={styles.skelTitle} />
          <View style={styles.skelSub} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 12 }, styles.errorWrap]}>
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Animated.ScrollView
        entering={FadeInDown.duration(400)}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#FFFFFF" colors={['#FFFFFF']} />}
      >
        <LinearGradient colors={['#1B5E20', '#2E7D32']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={{ paddingTop: insets.top + 12 }}>
            <View style={styles.topBar}>
              <Text style={styles.topTitle}>{t('profile.title')}</Text>
              <TouchableOpacity style={styles.topBtn} onPress={handleEdit} activeOpacity={0.7}>
                <Ionicons name="pencil" size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ProfileHeader profile={profile} avatarUri={avatarUri} onAvatarPress={handleAvatarPress} />
          </View>
        </LinearGradient>

        <StatsGrid impact={profile.impact} />
        <AchievementSection badges={badges} />

        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>{t('profile.settings')}</Text>
          <View style={styles.settingsCard}>
            {SETTINGS_ROWS.map((row, idx) => (
              <TouchableOpacity
                key={row.label}
                style={[styles.settingRow, idx < SETTINGS_ROWS.length - 1 && styles.settingRowBorder]}
                activeOpacity={0.6}
                onPress={row.action}
              >
                <View style={[styles.settingIcon, { backgroundColor: row.color + '12' }]}>
                  <Ionicons name={row.icon as any} size={18} color={row.color} />
                </View>
                <Text style={styles.settingLabel}>{row.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {showEdit && (
        <TouchableOpacity activeOpacity={1} onPress={() => { Keyboard.dismiss(); setShowEdit(false); }} style={styles.overlay}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} placeholder="Your name" placeholderTextColor="#9CA3AF" autoFocus />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowEdit(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveEdit}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFB' },
  errorWrap: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  errorDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', paddingHorizontal: 32 },
  retryBtn: { flexDirection: 'row', backgroundColor: '#2563EB', paddingHorizontal: 24, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  retryText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  skel: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  skelAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6' },
  skelTitle: { width: 120, height: 20, borderRadius: 4, backgroundColor: '#F3F4F6' },
  skelSub: { width: 160, height: 14, borderRadius: 4, backgroundColor: '#F3F4F6' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 4,
  },
  topTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.4 },
  topBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  settingsSection: { paddingHorizontal: 20, marginTop: 24 },
  settingsTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 14 },
  settingsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F1F3' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' },

  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '85%', gap: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center' },
  modalInput: { backgroundColor: '#F9FAFB', borderRadius: 14, paddingHorizontal: 16, height: 48, fontSize: 16, fontWeight: '600', color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  modalSave: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB' },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
