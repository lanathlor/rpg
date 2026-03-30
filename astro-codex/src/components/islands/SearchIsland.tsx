import { useState, useMemo } from 'react';
import { t } from '@/lib/i18n';

interface SearchItem {
  name: string;
  type: string;
  description?: string;
  href: string;
}

interface Props {
  items: SearchItem[];
  initialQuery?: string;
}

const typeColors: Record<string, string> = {
  sort: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  arme: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  equipement: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300',
  competence: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  consommable: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  classe: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  entite: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  scenario: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export function SearchIsland({ items, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState('');

  const typeLabels: Record<string, string> = {
    sort: t('search.type.sort'),
    arme: t('search.type.arme'),
    equipement: t('search.type.equipement'),
    competence: t('search.type.competence'),
    consommable: t('search.type.consommable'),
    classe: t('search.type.classe'),
    entite: t('search.type.entite'),
    scenario: t('search.type.scenario'),
  };

  const results = useMemo(() => {
    if (!query && !filterType) return [];
    const q = query.toLowerCase();
    return items.filter(item => {
      const matchQuery = !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
      const matchType = !filterType || item.type === filterType;
      return matchQuery && matchType;
    }).slice(0, 50);
  }, [items, query, filterType]);

  const types = useMemo(() => [...new Set(items.map(i => i.type))].sort(), [items]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">{t('search.allTypes')}</option>
          {types.map(tp => <option key={tp} value={tp}>{typeLabels[tp] || tp}</option>)}
        </select>
      </div>

      {(query || filterType) && (
        <div className="text-sm text-muted-foreground">{`${results.length} ${results.length > 1 ? t('common.results') : t('common.result')}`}</div>
      )}

      <div className="grid gap-3">
        {results.map((item, idx) => (
          <a
            key={`${item.href}-${idx}`}
            href={item.href}
            className="block p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{item.name}</h3>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${typeColors[item.type] || ''}`}>
                {typeLabels[item.type] || item.type}
              </span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            )}
          </a>
        ))}
      </div>

      {!query && !filterType && (
        <p className="text-muted-foreground text-center py-8">
          {t('search.emptyState')}
        </p>
      )}
    </div>
  );
}
