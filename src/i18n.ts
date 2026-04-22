import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// LandingPage
import enTranslations from 'src/views/LandingPage/locales/en/translation.json';
import esTranslations from 'src/views/LandingPage/locales/es/translation.json';

// LanguageSelector
import enLangSel from 'src/components/LanguageSelector/locales/en.json';
import esLangSel from 'src/components/LanguageSelector/locales/es.json';

import TradHeaderES from 'src/layouts/full/header/locales/es.json';
import TradHeaderEN from 'src/layouts/full/header/locales/en.json';

import TradSidebarES from 'src/layouts/full/sidebar/Locales/es.json';
import TradSidebarEN from 'src/layouts/full/sidebar/Locales/en.json';

import TradHomeUserES from 'src/views/cliente/locales/es.json';
import TradHomeUserEN from 'src/views/cliente/locales/en.json';

import TradrRoleMAPiES from 'src/views/shared/locales/es.json';
import TradrRoleMAPiEN from 'src/views/shared/locales/en.json';

import TradSamplePageEN from 'src/views/sample-page/locales/en.json';
import TradSamplePageES from 'src/views/sample-page/locales/es.json';

import TradLoginAndRegisterES from 'src/views/shared/locales/es.json';
import TradLoginAndRegisterEN from 'src/views/shared/locales/en.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
        languageSelector: enLangSel,
        headerTrad: TradHeaderEN,
        sidebarTrad: TradSidebarEN,
        homeUserTrad: TradHomeUserEN,
        tradRoleMAPi: TradrRoleMAPiEN,
        samplePageTrad: TradSamplePageEN,
        loginAndRegisterTrad: TradLoginAndRegisterEN

      },
      es: {
        translation: esTranslations,
        languageSelector: esLangSel,
        headerTrad: TradHeaderES,
        sidebarTrad: TradSidebarES,
        homeUserTrad: TradHomeUserES,
        tradRoleMAPi: TradrRoleMAPiES,
        samplePageTrad: TradSamplePageES,
        loginAndRegisterTrad: TradLoginAndRegisterES

      },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: { escapeValue: false }
  });

export default i18n;