import { useState, useEffect } from 'react';
import { getLang, type Lang } from '@/lib/i18n';

export function LangToggle() {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    setLangState(getLang());
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'fr' ? 'en' : 'fr';
    // Replace /en/ or /fr/ in current path with the other locale
    const path = window.location.pathname;
    const newPath = path.replace(/\/(en|fr)(\/|$)/, `/${next}$2`);
    window.location.href = newPath;
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-2"
      title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
