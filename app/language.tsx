import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18n from '../src/core/i18n';

const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'fr', native: 'Français' },
  { code: 'es', native: 'Español' },
  { code: 'de', native: 'Deutsch' },
  { code: 'it', native: 'Italiano' },
  { code: 'pt', native: 'Português' },
  { code: 'ar', native: 'العربية' },
  { code: 'zh', native: '中文' },
] as const;

export default function LanguageScreen() {
  const { t } = useTranslation();
  const currentLang = i18n.language.split('-')[0];

  const switchLanguage = (code: string) => {
    i18n.changeLanguage(code);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>{t('language.title')}</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.list}>
          {LANGUAGES.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.row, isActive && styles.rowActive]}
                onPress={() => switchLanguage(lang.code)}
                activeOpacity={0.6}
              >
                <Text style={[styles.langLabel, isActive && styles.langLabelActive]}>
                  {lang.native}
                </Text>
                {isActive && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F3',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  list: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowActive: {
    backgroundColor: '#F0FDF4',
  },
  langLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  langLabelActive: {
    color: '#059669',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
