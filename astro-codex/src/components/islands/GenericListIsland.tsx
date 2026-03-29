import { useState, useMemo } from 'react';

interface ListItem {
  slug: string;
  name: string;
  category?: string;
  subcategory?: string;
  description?: string;
  extra?: string;
  stats?: Record<string, string>;
  costNum?: number;
}

interface Props {
  items: ListItem[];
  base: string;
  basePath: string;
  searchPlaceholder?: string;
  categoryLabel?: string;
  itemLabel?: string;
}

function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function GenericListIsland({ items, base, basePath, searchPlaceholder = 'Rechercher...', categoryLabel = 'Catégorie', itemLabel = 'résultat' }: Props) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const categories = useMemo(() => [...new Set(items.map(i => i.category).filter(Boolean))].sort() as string[], [items]);

  const filtered = useMemo(() => {
    const result = items.filter(item => {
      const matchSearch = !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filterCategory || item.category === filterCategory;
      return matchSearch && matchCategory;
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
  }, [items, search, filterCategory, sortBy]);

  const hasFilters = search || filterCategory;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          {categories.length > 1 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded px-3 py-2 bg-background text-sm"
            >
              <option value="">{`${categoryLabel}: Tous`}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">Nom (A-Z)</option>
            <option value="name-desc">Nom (Z-A)</option>
            <option value="cost-asc">Coût (croissant)</option>
            <option value="cost-desc">Coût (décroissant)</option>
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setFilterCategory(''); }} className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent">
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} sur {items.length} {itemLabel}{filtered.length > 1 ? 's' : ''}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <a
            key={item.slug}
            href={`${base}${basePath}${item.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {item.category && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {item.category}
                  </span>
                )}
                {item.subcategory && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {item.subcategory}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{truncate(item.description, 120)}</p>
              )}
            </div>
            {(item.extra || (item.stats && Object.keys(item.stats).length > 0)) && (
              <div className="p-6 pt-0">
                {item.stats && Object.entries(item.stats).map(([key, value]) => (
                  <div key={key} className="text-sm"><strong>{key}:</strong> {value}</div>
                ))}
                {item.extra && (
                  <div className="text-sm text-muted-foreground mt-1">{item.extra}</div>
                )}
              </div>
            )}
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
