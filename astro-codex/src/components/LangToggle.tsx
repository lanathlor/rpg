import { useState, useEffect } from 'react';
import { getLang, setStoredLocale, getStoredLocale, type Lang } from '@/lib/i18n';
import { dispatchLocaleChange, useLocale } from '@/lib/useLocale';

interface Props {
  basePath: string;
}

/** Check if current page is a root page (not /en/ or /fr/) */
function isRootPage(basePath: string): boolean {
  const path = window.location.pathname;
  const pathAfterBase = path.startsWith(basePath) ? path.slice(basePath.length) : path;
  return !pathAfterBase.match(/^(en|fr)(\/|$)/);
}

/** Rewrite links to stay on root path (remove /fr/ prefix) */
function rewriteLinks(container: Element, basePath: string): void {
  container.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith(basePath + 'fr/')) {
      a.setAttribute('href', href.replace(basePath + 'fr/', basePath));
    }
  });
}

/** Swap main content by fetching the other locale's page */
async function swapContent(targetLocale: Lang, basePath: string): Promise<boolean> {
  const path = window.location.pathname;
  const pathAfterBase = path.startsWith(basePath) ? path.slice(basePath.length) : path;
  let targetPath: string;

  if (targetLocale === 'fr') {
    // Insert /fr/ after base path: /base/rules/... → /base/fr/rules/...
    targetPath = `${basePath}fr/${pathAfterBase}`;
  } else {
    // For English, fetch root path (remove /fr/): /base/fr/rules/... → /base/rules/...
    targetPath = `${basePath}${pathAfterBase.replace(/^fr\//, '')}`;
  }

  try {
    const response = await fetch(targetPath);
    if (!response.ok) return false;

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Swap main content
    const targetMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');
    if (targetMain && currentMain) {
      currentMain.innerHTML = targetMain.innerHTML;
      // Rewrite links if swapping to French (keep URLs on root path)
      if (targetLocale === 'fr') {
        rewriteLinks(currentMain, basePath);
      }
    }

    // Swap sidebar content
    const targetAside = doc.querySelector('aside');
    const currentAside = document.querySelector('aside');
    if (targetAside && currentAside) {
      currentAside.innerHTML = targetAside.innerHTML;
      // Rewrite links if swapping to French
      if (targetLocale === 'fr') {
        rewriteLinks(currentAside, basePath);
      }
    }

    document.documentElement.lang = targetLocale;

    // Notify React components of locale change
    dispatchLocaleChange(targetLocale);

    return !!(targetMain && currentMain);
  } catch {
    // Silently fail
  }
  return false;
}

export function LangToggle({ basePath }: Props) {
  // Subscribe to locale changes (from hydration script or other toggles)
  const lang = useLocale();
  const [isSwapping, setIsSwapping] = useState(false);

  const toggle = async () => {
    const newLang: Lang = lang === 'fr' ? 'en' : 'fr';

    // Always save preference
    setStoredLocale(newLang);

    // On root pages, swap content instead of navigating
    if (isRootPage(basePath)) {
      setIsSwapping(true);
      const success = await swapContent(newLang, basePath);
      setIsSwapping(false);

      if (success) {
        return;
      }
      // If swap failed, fall through to navigation
    }

    // Navigate to explicit locale path
    const path = window.location.pathname;
    const pathAfterBase = path.startsWith(basePath) ? path.slice(basePath.length) : path;

    if (newLang === 'fr') {
      // Go to /fr/ version
      const cleanPath = pathAfterBase.replace(/^en\//, '');
      window.location.href = `${basePath}fr/${cleanPath}`;
    } else {
      // Go to root (English)
      const cleanPath = pathAfterBase.replace(/^fr\//, '');
      window.location.href = `${basePath}${cleanPath}`;
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isSwapping}
      className="inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-2 disabled:opacity-50"
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {isSwapping ? '...' : lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
