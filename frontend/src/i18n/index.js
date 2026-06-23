import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import en from './locales/en.json';

export const LANGUAGES = [
  { code: 'fr', label: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Apply direction and lang to <html> on language change
const applyDirection = (lng) => {
  const langConfig = LANGUAGES.find((l) => l.code === lng);
  if (langConfig) {
    document.documentElement.lang = langConfig.code;
    document.documentElement.dir = langConfig.dir;
  }
};

// Apply on init
applyDirection(i18n.language);

// Apply on every language change
i18n.on('languageChanged', applyDirection);

export default i18n;
