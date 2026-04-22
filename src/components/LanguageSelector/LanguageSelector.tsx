import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'src/components/LanguageSelector/LenguajeSelector.css';

const LanguageSelector: React.FC = () => {
  
  const { i18n, t } = useTranslation('languageSelector');
  const [open, setOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  const languages = [
    { code: 'es', label: t('es_label', 'Español') },
    { code: 'en', label: t('en_label', 'English') }
  ];

  return (
    <div className="language-selector-root">
      <button
        className="language-selector-button"
        onClick={() => setOpen((prev) => !prev)}
        key={i18n.language} 
      >
        🌐 {t('language')}
      </button>
      {open && (
        <ul className="language-selector-list">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                className="language-selector-option"
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;