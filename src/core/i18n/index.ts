import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as ExpoLocalization from 'expo-localization';
import en from './en.json';
import fr from './fr.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

i18n.use(initReactI18next).init({
  resources,
  lng: ExpoLocalization.getLocales()?.[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
