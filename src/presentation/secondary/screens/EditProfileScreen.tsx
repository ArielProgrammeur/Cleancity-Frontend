import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

export default function EditProfileScreen() {
  const [name, setName] = useState('Ariel');
  const [email, setEmail] = useState('ariel@ecocitizen.com');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [bio, setBio] = useState('Passionate about keeping our city clean!');

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your changes have been saved successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleChangeAvatar = () => {
    Alert.alert('Change Avatar', 'Choose a source', [
      { text: 'Take Photo' },
      { text: 'Choose from Gallery' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: 'Edit Profile',
        headerTintColor: colors.primary,
        headerRight: () => (
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        ),
      }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={colors.white} />
            </View>
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={18} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
          />
          <InputField
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />
          <View style={styles.field}>
            <Text style={styles.label}>Bio</Text>
            <View style={styles.inputRow}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={colors.divider}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function InputField({ label, value, onChangeText, icon, keyboardType }: {
  label: string; value: string; onChangeText: (v: string) => void;
  icon: keyof typeof Ionicons.glyphMap; keyboardType?: 'email-address' | 'phone-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.divider}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  saveText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.surfaceVariant },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface },
  avatarHint: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm },
  form: { paddingHorizontal: spacing.md },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.sm, borderRadius: borderRadius.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, fontSize: 16, color: colors.textPrimary, paddingVertical: 14 },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.lg, marginTop: spacing.md, gap: spacing.sm },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
  cancelButton: { alignItems: 'center', marginTop: spacing.sm, paddingVertical: spacing.sm },
  cancelButtonText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
});
