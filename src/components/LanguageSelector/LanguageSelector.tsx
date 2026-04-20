// name=src/components/LanguageSelector.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  // Etiquetas traducibles si lo deseas
  const languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #AAA',
          background: '#fff',
          cursor: 'pointer',
          fontWeight: 500
        }}
      >
        🌐 {t('language', 'Idioma')}
      </button>
      {open && (
        <ul
          style={{
            position: 'absolute',
            margin: '4px 0 0 0',
            padding: 0,
            left: 0,
            listStyle: 'none',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            zIndex: 999
          }}
        >
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => changeLanguage(lang.code)}
                style={{
                  padding: '8px 16px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
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