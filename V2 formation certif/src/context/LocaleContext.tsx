'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, locales, rtlLocales, useTranslation, translations } from '@/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('smartcodai-locale') as Locale;
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('smartcodai-locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = rtlLocales.includes(newLocale) ? 'rtl' : 'ltr';
  }, []);

  const { t } = useTranslation(locale);
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
