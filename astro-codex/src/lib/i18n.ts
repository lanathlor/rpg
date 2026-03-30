import { fr, type TranslationKey } from '@/i18n/fr';
import { en } from '@/i18n/en';

export type Lang = 'fr' | 'en';

const translations: Record<Lang, Record<string, string>> = { fr, en };

let currentLang: Lang = 'fr';

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
