import { useState, useMemo } from 'react';
import { t } from '@/lib/i18n';

interface WeaponItem {
  slug: string;
  name: string;
  category: string;
  type: string;
  subcategory: string;
  description: string;
  damage: string;
  attackType: string;
  range: string;
  cost: string;
  costNum: number;
}

interface Props {
  weapons: WeaponItem[];
  base: string;
}

const categoryColors: Record<string, string> = {
  'corps à corps': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'distance': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'lourde': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'légère': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'exotique': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'improvised': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

function getCategoryColor(category: string): string {
  const key = category.toLowerCase();
  for (const [k, v] of Object.entries(categoryColors)) {
    if (key.includes(k)) return v;
  }
  return 'bg-secondary text-secondary-foreground';
}

function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function WeaponListIsland({ weapons, base }: Props) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const categories = useMemo(() => [...new Set(weapons.map(w => w.category).filter(Boolean))].sort(), [weapons]);
  const types = useMemo(() => [...new Set(weapons.map(w => w.type).filter(Boolean))].sort(), [weapons]);

  const filtered = useMemo(() => {
    const result = weapons.filter(w => {
      const matchSearch = !search ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filterCategory || w.category === filterCategory;
      const matchType = !filterType || w.type === filterType;
      return matchSearch && matchCategory && matchType;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'cost-asc': return (a.costNum ?? 0) - (b.costNum ?? 0);
        case 'cost-desc': return (b.costNum ?? 0) - (a.costNum ?? 0);
        default: return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [weapons, search, filterCategory, filterType, sortBy]);

  const hasFilters = search || filterCategory || filterType;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('weapons.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">{t('weapons.allCategories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">{t('weapons.allTypes')}</option>
            {types.map(tp => <option key={tp} value={tp}>{tp}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">{t('common.sort.nameAZShort')}</option>
            <option value="name-desc">{t('common.sort.nameZAShort')}</option>
            <option value="cost-asc">{t('common.sort.costAscShort')}</option>
            <option value="cost-desc">{t('common.sort.costDescShort')}</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterType(''); }}
              className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent"
            >
              {t('common.reset')}
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} {t('common.of')} {weapons.length} {weapons.length === 1 ? t('common.weapon') : t('common.weapons')}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(weapon => (
          <a
            key={weapon.slug}
            href={`${base}weapons/${weapon.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{weapon.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {weapon.category && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryColor(weapon.category)}`}>
                    {weapon.category}
                  </span>
                )}
                {weapon.type && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {weapon.type}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 pt-0 space-y-1">
              {weapon.damage && (
                <div className="text-sm"><strong className="text-red-600 dark:text-red-400">{t('common.damage')}</strong> {weapon.damage}</div>
              )}
              {weapon.attackType && (
                <div className="text-sm"><strong>{t('common.attackType')}</strong> {weapon.attackType}</div>
              )}
              {weapon.range && (
                <div className="text-sm"><strong>{t('common.range')}</strong> {weapon.range}</div>
              )}
              {weapon.cost && (
                <div className="text-sm"><strong>{t('common.cost')}</strong> {weapon.cost}</div>
              )}
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('common.noResult')}
        </div>
      )}
    </div>
  );
}
