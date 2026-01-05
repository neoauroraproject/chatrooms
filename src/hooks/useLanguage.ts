import { useState, useEffect } from 'react';
import { Language, getTranslation, isRTL } from '../utils/i18n';

const LANGUAGE_STORAGE_KEY = 'securechat_language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (saved as Language) || 'en';
  });

  const t = getTranslation(language);
  const rtl = isRTL(language);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, rtl]);

  return {
    language,
    t,
    rtl,
    changeLanguage
  };
};