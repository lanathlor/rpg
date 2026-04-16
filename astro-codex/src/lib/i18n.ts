import { fr, type TranslationKey } from '@/i18n/fr';
import { en } from '@/i18n/en';

export type Lang = 'fr' | 'en';

const translations: Record<Lang, Record<string, string>> = { fr, en };

let currentLang: Lang = 'en';

// === localStorage-based locale preference ===
export const LOCALE_STORAGE_KEY = 'rpg-locale-preference';

/** Get user's language preference from localStorage */
export function getStoredLocale(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCALE_STORAGE_KEY);
}

/** Save user's language preference to localStorage */
export function setStoredLocale(locale: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/** Get browser's preferred language (e.g., 'fr', 'en', 'es') */
export function getBrowserLocale(): string {
  if (typeof window === 'undefined') return 'en';
  return navigator.language?.split('-')[0] || 'en';
}

/** Initialize locale preference: use stored, or detect from browser and save */
export function initLocalePreference(): string {
  const stored = getStoredLocale();
  if (stored) return stored;
  const browser = getBrowserLocale();
  setStoredLocale(browser);
  return browser;
}

/** Convert URL locale param to actual Lang */
export function paramToLang(param: string | undefined): Lang {
  if (param === 'fr') return 'fr';
  return 'en';
}

/** Check if this is the root English version (no locale prefix) */
export function isRootLocale(pathname: string, baseUrl: string): boolean {
  const pathAfterBase = pathname.replace(baseUrl, '');
  return !pathAfterBase.match(/^(en|fr)\//);
}

/** Get static paths for French-only locale pages */
export function getFrenchPaths() {
  return [{ params: { locale: 'fr' } }];
}

/** Get base URL for links based on whether we're in French or English (root) */
export function getLocaleBase(isFrench: boolean, baseUrl: string): string {
  return isFrench ? `${baseUrl}fr/` : baseUrl;
}

/** Detect locale from URL path */
export function detectLocaleFromPath(pathname: string, baseUrl: string): { locale: Lang; isFrench: boolean; isExplicitEnglish: boolean } {
  const pathAfterBase = pathname.replace(baseUrl, '');
  const isFrench = pathAfterBase.startsWith('fr/') || pathAfterBase === 'fr';
  const isExplicitEnglish = pathAfterBase.startsWith('en/') || pathAfterBase === 'en';
  return { locale: isFrench ? 'fr' : 'en', isFrench, isExplicitEnglish };
}

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

// Locale-dependent URL section names
// Key = internal/EN name, value = localized URL segment
const sectionRoutes: Record<Lang, Record<string, string>> = {
  en: {
    spells: 'spells', weapons: 'weapons', equipment: 'equipment',
    skills: 'skills', consumables: 'consumables', classes: 'classes',
    entities: 'entities', scenarios: 'scenarios', rules: 'rules',
    history: 'history', characters: 'characters', search: 'search',
  },
  fr: {
    spells: 'sorts', weapons: 'armes', equipment: 'equipements',
    skills: 'competences', consumables: 'consommables', classes: 'classes',
    entities: 'entites', scenarios: 'scenarios', rules: 'regles',
    history: 'histoire', characters: 'personnages', search: 'search',
  },
};

/** Get the localized URL section name */
export function section(key: string, locale?: Lang): string {
  const lang = locale || currentLang;
  return sectionRoutes[lang][key] || key;
}

/** Get all section route entries for a locale (for getStaticPaths) */
export function getSectionRoutes(locale: Lang): Record<string, string> {
  return sectionRoutes[locale];
}

/** Reverse lookup: from a localized section name, get the internal key */
export function sectionKeyFromRoute(route: string, locale: Lang): string | undefined {
  const routes = sectionRoutes[locale];
  return Object.keys(routes).find(k => routes[k] === route);
}

export type { TranslationKey };
