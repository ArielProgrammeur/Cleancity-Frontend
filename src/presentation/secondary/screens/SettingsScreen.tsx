import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Settings', headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingsRow icon="notifications-outline" label="Push Notifications" color={colors.info}>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: '#D1D5DB', true: colors.primaryLight }} thumbColor={pushEnabled ? colors.primary : '#F9FAFB'} />
          </SettingsRow>
          <SettingsRow icon="mail-outline" label="Email Notifications" color="#7C3AED" last>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} trackColor={{ false: '#D1D5DB', true: colors.primaryLight }} thumbColor={emailEnabled ? colors.primary : '#F9FAFB'} />
          </SettingsRow>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingsRow icon="moon-outline" label="Dark Mode" color="#6B7280">
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#D1D5DB', true: colors.primaryLight }} thumbColor={darkMode ? colors.primary : '#F9FAFB'} />
          </SettingsRow>
          <SettingsRow icon="language-outline" label="Language" value="English" color={colors.primary} last />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingsRow icon="person-outline" label="Personal Info" color={colors.success} onPress={() => router.push('/profile/edit')} />
          <SettingsRow icon="lock-closed-outline" label="Privacy" color="#DC2626" />
          <SettingsRow icon="shield-checkmark-outline" label="Security" color="#059669" last />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingsRow icon="information-circle-outline" label="Version" value="1.0.0" color={colors.info} />
          <SettingsRow icon="document-text-outline" label="Terms of Service" color={colors.textSecondary} />
          <SettingsRow icon="hand-left-outline" label="Privacy Policy" color={colors.textSecondary} last />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SettingsRow({ icon, label, value, color, last, onPress, children }: {
  icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; color: string;
  last?: boolean; onPress?: () => void; children?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowBorder]}
      onPress={onPress}
      disabled={!onPress && !children}
    >
      <View style={[styles.rowIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {children}
      {!children && !value && <Ionicons name="chevron-forward" size={18} color={colors.divider} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  section: { marginTop: spacing.md, marginHorizontal: spacing.md },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm, marginLeft: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 14, gap: spacing.sm },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  rowValue: { fontSize: 14, color: colors.textSecondary, marginRight: spacing.xs },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, marginHorizontal: spacing.md, paddingVertical: 14, backgroundColor: '#FEF2F2', borderRadius: borderRadius.lg, gap: spacing.sm },
  logoutText: { fontSize: 16, fontWeight: '700', color: colors.error },
});
