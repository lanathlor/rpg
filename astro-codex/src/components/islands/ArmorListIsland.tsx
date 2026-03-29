import { useState, useMemo } from 'react';

interface ArmorItem {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  RMEC: string;
  RRAD: string;
  RINT: string;
  defensebonus: string;
  cost: string;
  costNum: number;
}

interface Props {
  armors: ArmorItem[];
  base: string;
}

const categoryColors: Record<string, string> = {
  'légère': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'intermédiaire': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'lourde': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'bouclier': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'accessoire': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
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

export function ArmorListIsland({ armors, base }: Props) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const categories = useMemo(() => [...new Set(armors.map(a => a.category).filter(Boolean))].sort(), [armors]);
  const subcategories = useMemo(() => {
    const source = filterCategory ? armors.filter(a => a.category === filterCategory) : armors;
    return [...new Set(source.map(a => a.subcategory).filter(Boolean))].sort();
  }, [armors, filterCategory]);

  const filtered = useMemo(() => {
    const result = armors.filter(a => {
      const matchSearch = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filterCategory || a.category === filterCategory;
      const matchSubcategory = !filterSubcategory || a.subcategory === filterSubcategory;
      return matchSearch && matchCategory && matchSubcategory;
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
  }, [armors, search, filterCategory, filterSubcategory, sortBy]);

  const hasFilters = search || filterCategory || filterSubcategory;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une armure..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(''); }} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">Toutes les catégories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">Toutes les sous-catégories</option>
            {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">Nom A-Z</option>
            <option value="name-desc">Nom Z-A</option>
            <option value="cost-asc">Coût croissant</option>
            <option value="cost-desc">Coût décroissant</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterCategory(''); setFilterSubcategory(''); }}
              className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} sur {armors.length} {armors.length === 1 ? 'armure' : 'armures'}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(armor => (
          <a
            key={armor.slug}
            href={`${base}equipements/${armor.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{armor.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {armor.category && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryColor(armor.category)}`}>
                    {armor.category}
                  </span>
                )}
                {armor.subcategory && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {armor.subcategory}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 pt-0 space-y-2">
              {/* Resistance badges */}
              <div className="flex gap-2 flex-wrap">
                {armor.RMEC && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-600">
                    RMEC {armor.RMEC}
                  </span>
                )}
                {armor.RRAD && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-600">
                    RRAD {armor.RRAD}
                  </span>
                )}
                {armor.RINT && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-600">
                    RINT {armor.RINT}
                  </span>
                )}
              </div>
              {armor.defensebonus && (
                <div className="text-sm"><strong>Bonus de défense:</strong> {armor.defensebonus}</div>
              )}
              {armor.cost && (
                <div className="text-sm"><strong>Coût:</strong> {armor.cost}</div>
              )}
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun résultat ne correspond aux critères de recherche.
        </div>
      )}
    </div>
  );
}
