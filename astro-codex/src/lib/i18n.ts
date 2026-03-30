import { fr, type TranslationKey } from '@/i18n/fr';
import { en } from '@/i18n/en';

export type Lang = 'fr' | 'en';

const translations: Record<Lang, Record<string, string>> = { fr, en };

let currentLang: Lang = 'en';

// Client-side: detect locale from URL path
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  if (path.match(/\/fr(\/|$)/)) {
    currentLang = 'fr';
  } else if (path.match(/\/en(\/|$)/)) {
    currentLang = 'en';
  }
}

export function t(key: TranslationKey): string {
  return translations[currentLang][key] || key;
}

export function setLang(lang: Lang) {
  currentLang = lang;
}

export function getLang(): Lang {
  return currentLang;
}

export type { TranslationKey };
