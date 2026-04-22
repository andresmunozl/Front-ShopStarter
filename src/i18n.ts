import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// LandingPage
import enTranslations from 'src/views/LandingPage/locales/en/translation.json';
import esTranslations from 'src/views/LandingPage/locales/es/translation.json';

// LanguageSelector
import enLangSel from 'src/components/LanguageSelector/locales/en.json';
import esLangSel from 'src/components/LanguageSelector/locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
        languageSelector: enLangSel,
      },
      es: {
        translation: esTranslations,
        languageSelector: esLangSel,
      },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });

export default i18n;