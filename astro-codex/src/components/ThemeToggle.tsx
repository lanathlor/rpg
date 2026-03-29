import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'dark' | 'light' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const stored = localStorage.getItem('vite-ui-theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('vite-ui-theme', newTheme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (newTheme === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(sys);
    } else {
      root.classList.add(newTheme);
    }
  };

  const cycle = () => {
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    applyTheme(next);
  };

  return (
    <button
      onClick={cycle}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
      title={`Thème: ${theme}`}
    >
      {theme === 'light' && <Sun className="h-4 w-4" />}
      {theme === 'dark' && <Moon className="h-4 w-4" />}
      {theme === 'system' && <Monitor className="h-4 w-4" />}
      <span className="sr-only">Changer de thème</span>
    </button>
  );
}
