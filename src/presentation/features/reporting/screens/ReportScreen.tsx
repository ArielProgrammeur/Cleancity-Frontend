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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
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
  const insets = useSafeAreaInsets();
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
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[styles.container, { opacity: contentOpacity }]}>
        <LinearGradient
          colors={['#C62828', '#E53935']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <StatusBar barStyle="light-content" backgroundColor="#C62828" />
          <View style={[styles.headerContainer, { paddingTop: insets.top + spacing.md }]}>
            <View style={styles.headerRow}>
              <View style={styles.headerTitleRow}>
                <View style={styles.headerIconWrap}>
                  <Ionicons name="trash-bin" size={18} color="#C62828" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>{t('report.heading')}</Text>
                  <Text style={styles.headerSub}>{t('report.subheading')}</Text>
                </View>
              </View>
              <View style={styles.stepsWrap}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.stepRow}>
                    {i > 0 && (
                      <View style={[styles.stepLine, i <= completedCount && styles.stepLineDone]} />
                    )}
                    <View
                      style={[
                        styles.stepDot,
                        i < completedCount && styles.stepDotDone,
                        i === completedCount && styles.stepDotCurrent,
                      ]}
                    >
                      {i < completedCount ? (
                        <Ionicons name="checkmark" size={10} color="#C62828" />
                      ) : (
                        <Text style={[styles.stepDotNum, i === completedCount && styles.stepDotNumCurrent]}>
                          {i + 1}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="camera-outline" size={18} color={'#C62828'} />
              </View>
              <Text style={styles.sectionTitle}>Photo</Text>
              {imageUri && (
                <TouchableOpacity onPress={handleRemoveImage} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <View style={styles.retakeChip}>
                    <Ionicons name="refresh-outline" size={14} color={'#C62828'} />
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
                <Ionicons name="layers-outline" size={18} color={'#C62828'} />
              </View>
              <Text style={styles.sectionTitle}>Category</Text>
            </View>
            <CategorySelector selected={selectedCategory} onSelect={handleSelectCategory} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons name="document-text-outline" size={18} color={'#C62828'} />
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
              <Ionicons name="locate" size={18} color={'#C62828'} />
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

  headerContainer: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 1,
  },
  stepsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepLine: {
    width: 16,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepLineDone: {
    backgroundColor: '#FFFFFF',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: {
    backgroundColor: '#FFFFFF',
  },
  stepDotCurrent: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  stepDotNum: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  stepDotNumCurrent: {
    color: '#FFFFFF',
  },

  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
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
    backgroundColor: '#FFEBEE',
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
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  retakeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C62828',
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
    borderColor: '#C62828',
    backgroundColor: '#FFF5F5',
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
    backgroundColor: '#FFEBEE',
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
    backgroundColor: '#FFCDD2',
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
    backgroundColor: '#C62828',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 14,
    shadowColor: '#C62828',
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
