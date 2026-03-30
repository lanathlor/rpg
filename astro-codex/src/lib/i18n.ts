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
