import { fr } from './fr';
import { en } from './en';
import { ar } from './ar';

export type Locale = 'fr' | 'en' | 'ar';

export const locales: Locale[] = ['fr', 'en', 'ar'];

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

export const rtlLocales: Locale[] = ['ar'];

export const translations = { fr, en, ar };

export type Translation = typeof fr;

// Deep merge utility for nested translation objects
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function useTranslation(locale: Locale) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(translations[locale], key) as string;
    if (!value) {
      // Fallback to French
      value = getNestedValue(translations.fr, key) as string;
    }
    if (!value) return key;

    // Replace params like {count} in the string
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  };

  return { t, locale };
}
