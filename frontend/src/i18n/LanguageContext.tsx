import React, { createContext, useContext, useState } from 'react';
import { translations, Lang, TranslationKey } from './translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('deepecg-lang');
    return (stored === 'fr' || stored === 'en') ? stored : 'en';
  });

  const setLang = (newLang: Lang) => {
    localStorage.setItem('deepecg-lang', newLang);
    setLangState(newLang);
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    let str: string =
      (translations[lang] as Record<string, string>)[key] ??
      (translations.en as Record<string, string>)[key] ??
      key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
