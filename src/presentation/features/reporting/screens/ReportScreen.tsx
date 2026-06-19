import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImagePicker } from '../components/ImagePicker';
import { CategorySelector } from '../components/CategorySelector';
import type { ReportCategory } from '../data/categories';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';

const MAX_DESC_LENGTH = 280;

const sections = [
  { key: 'photo', icon: 'camera-outline', label: 'Photo' },
  { key: 'category', icon: 'apps-outline', label: 'Category' },
  { key: 'description', icon: 'document-text-outline', label: 'Description' },
] as const;

export function ReportScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const submitScale = useRef(new Animated.Value(1)).current;

  useState(() => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  });

  const completedCount = [imageUri, selectedCategory, description.trim()].filter(Boolean).length;

  const handlePickImage = useCallback((uri: string) => setImageUri(uri), []);
  const handleRemoveImage = useCallback(() => setImageUri(null), []);
  const handleSelectCategory = useCallback((cat: ReportCategory) => setSelectedCategory(cat.id), []);

  const canSubmit = imageUri && selectedCategory && description.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    Animated.sequence([
      Animated.timing(submitScale, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(submitScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.back();
    }, 1500);
  };

  const descRemaining = MAX_DESC_LENGTH - description.length;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[styles.container, { opacity: contentOpacity }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle}>New Report</Text>
            <Text style={styles.topBarSub}>
              {completedCount}/3 completed
            </Text>
          </View>

          <View style={styles.stepIndicator}>
            {sections.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i < completedCount && styles.stepDotDone,
                  i === completedCount && completedCount < 3 && styles.stepDotCurrent,
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Report Waste</Text>
          <Text style={styles.subheading}>
            Help us keep the city clean. Fill in the details below.
          </Text>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="camera-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Photo</Text>
              {imageUri && (
                <TouchableOpacity onPress={handleRemoveImage} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <View style={styles.retakeChip}>
                    <Ionicons name="refresh-outline" size={14} color={colors.primary} />
                    <Text style={styles.retakeText}>Retake</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <ImagePicker imageUri={imageUri} onPick={handlePickImage} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="layers-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Category</Text>
            </View>
            <CategorySelector selected={selectedCategory} onSelect={handleSelectCategory} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={[styles.charCount, descRemaining < 20 && styles.charCountWarn]}>
                {descRemaining}
              </Text>
            </View>
            <TextInput
              style={[
                styles.textArea,
                focusedField === 'desc' && styles.textAreaFocused,
                descRemaining < 20 && styles.textAreaWarn,
              ]}
              placeholder="Describe what you see..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={(t) => setDescription(t.slice(0, MAX_DESC_LENGTH))}
              multiline
              textAlignVertical="top"
              onFocus={() => setFocusedField('desc')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.locationCard}>
            <View style={styles.locationDot}>
              <Ionicons name="locate" size={18} color={colors.primary} />
            </View>
            <View style={styles.locationBody}>
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationValue}>Auto-detected on submit</Text>
            </View>
            <View style={styles.locationBadge}>
              <Ionicons name="checkmark" size={16} color={colors.white} />
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.bottomBarRow}>
            <View style={styles.bottomBarInfo}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.bottomBarInfoText}>Your report is anonymous</Text>
            </View>
            <Animated.View style={{ transform: [{ scale: submitScale }] }}>
              <TouchableOpacity
                style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                activeOpacity={0.9}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="send" size={16} color={colors.white} />
                    <Text style={styles.submitBtnText}>Submit</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  container: {
    flex: 1,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F3',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarCenter: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  topBarSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  stepDotDone: {
    backgroundColor: colors.primary,
    width: 20,
  },
  stepDotCurrent: {
    backgroundColor: colors.primaryLight,
  },

  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },

  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  retakeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  retakeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  textArea: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 15,
    color: colors.textPrimary,
    height: 124,
    lineHeight: 22,
  },
  textAreaFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FAFFFB',
  },
  textAreaWarn: {
    borderColor: '#FCA5A5',
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  charCountWarn: {
    color: '#EF4444',
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  locationDot: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBody: {
    flex: 1,
    marginLeft: spacing.md,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationValue: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  locationBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 32 : spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F1F3',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomBarInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
