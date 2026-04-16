import { useState, useEffect, useSyncExternalStore } from 'react';
import { getLang, setLang, getStoredLocale, type Lang } from './i18n';

// Simple external store for locale that React can subscribe to
let listeners: Set<() => void> = new Set();
let currentLocale: Lang = 'en';

// Initialize from module
if (typeof window !== 'undefined') {
  // On root pages, use stored preference; otherwise use URL-detected locale
  const path = window.location.pathname;
  const isRootPage = !path.match(/\/(en|fr)(\/|$)/);
  if (isRootPage) {
    const stored = getStoredLocale();
    currentLocale = stored === 'fr' ? 'fr' : 'en';
  } else {
    currentLocale = getLang();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return currentLocale;
}

function getServerSnapshot() {
  return 'en' as Lang;
}

/** Update the locale and notify all subscribers */
export function updateLocale(locale: Lang) {
  currentLocale = locale;
  setLang(locale);
  listeners.forEach(l => l());
}

/** React hook to get current locale - re-renders when locale changes */
export function useLocale(): Lang {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Also listen for the custom event (dispatched by hydration scripts)
  useEffect(() => {
    function handleLocaleChange(e: CustomEvent<{ locale: Lang }>) {
      updateLocale(e.detail.locale);
    }
    window.addEventListener('locale-changed', handleLocaleChange as EventListener);
    return () => window.removeEventListener('locale-changed', handleLocaleChange as EventListener);
  }, []);

  return locale;
}

/** Dispatch locale change event (call this after content swap) */
export function dispatchLocaleChange(locale: Lang) {
  updateLocale(locale);
  window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }));
}
