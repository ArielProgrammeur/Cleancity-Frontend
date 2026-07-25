import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

let lng = 'fr';
try {
  const ExpoLocalization = require('expo-localization');
  lng = ExpoLocalization.getLocales?.()?.[0]?.languageCode ?? 'fr';
} catch {
  // expo-localization not available, default to French
}

i18n.use(initReactI18next).init({
  resources,
  lng,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
