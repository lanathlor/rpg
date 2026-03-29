import { useState, useMemo } from 'react';
import { RangeSlider } from '@/components/ui/range-slider';

interface EntityItem {
  slug: string;
  name: string;
  description: string;
  faction: string;
  alignement: string;
  type: string;
  health: number;
  speed: number;
  highestStat: number;
  highestStatName: string;
  points: number;
  rmec: number;
  rrad: number;
  rint: number;
  spellCount: number;
  skillCount: number;
  weaponCount: number;
}

interface Props {
  entities: EntityItem[];
  base: string;
}

function getAlignementColor(alignement: string): string {
  const lower = alignement?.toLowerCase() || '';
  if (lower.includes('amical') || lower.includes('allié')) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  }
  if (lower.includes('hostile') || lower.includes('ennemi')) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }
  if (lower.includes('neutre')) {
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
  return 'bg-secondary text-secondary-foreground';
}

function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function EntityListIsland({ entities, base }: Props) {
  const [search, setSearch] = useState('');
  const [filterFaction, setFilterFaction] = useState('');
  const [filterAlignement, setFilterAlignement] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const factions = useMemo(() => [...new Set(entities.map(e => e.faction).filter(Boolean))].sort(), [entities]);
  const alignements = useMemo(() => [...new Set(entities.map(e => e.alignement).filter(Boolean))].sort(), [entities]);

  const absoluteMin = useMemo(() => Math.min(...entities.map(e => e.points)), [entities]);
  const absoluteMax = useMemo(() => Math.max(...entities.map(e => e.points)), [entities]);
  const [minPoints, setMinPoints] = useState(absoluteMin);
  const [maxPoints, setMaxPoints] = useState(absoluteMax);

  const filtered = useMemo(() => {
    const result = entities.filter(e => {
      const matchSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase()) ||
        e.type?.toLowerCase().includes(search.toLowerCase()) ||
        e.faction?.toLowerCase().includes(search.toLowerCase()) ||
        e.alignement?.toLowerCase().includes(search.toLowerCase());
      const matchFaction = !filterFaction || e.faction === filterFaction;
      const matchAlignement = !filterAlignement || e.alignement === filterAlignement;
      const matchPoints = e.points >= minPoints && e.points <= maxPoints;
      return matchSearch && matchFaction && matchAlignement && matchPoints;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'health-asc': return (a.health ?? 0) - (b.health ?? 0);
        case 'health-desc': return (b.health ?? 0) - (a.health ?? 0);
        case 'points-asc': return (a.points ?? 0) - (b.points ?? 0);
        case 'points-desc': return (b.points ?? 0) - (a.points ?? 0);
        default: return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [entities, search, filterFaction, filterAlignement, minPoints, maxPoints, sortBy]);

  const hasFilters = search || filterFaction || filterAlignement || minPoints !== absoluteMin || maxPoints !== absoluteMax;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une entité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <select value={filterFaction} onChange={(e) => setFilterFaction(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">Toutes les factions</option>
            {factions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select value={filterAlignement} onChange={(e) => setFilterAlignement(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">Tous les alignements</option>
            {alignements.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">Nom A-Z</option>
            <option value="name-desc">Nom Z-A</option>
            <option value="health-asc">PV croissant</option>
            <option value="health-desc">PV décroissant</option>
            <option value="points-asc">Points croissant</option>
            <option value="points-desc">Points décroissant</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterFaction(''); setFilterAlignement(''); setMinPoints(absoluteMin); setMaxPoints(absoluteMax); }}
              className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Point Range Slider */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium whitespace-nowrap">Points:</span>
        <RangeSlider
          min={absoluteMin}
          max={absoluteMax}
          value={[minPoints, maxPoints]}
          onChange={([lo, hi]) => { setMinPoints(lo); setMaxPoints(hi); }}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} sur {entities.length} {entities.length === 1 ? 'entité' : 'entités'}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(entity => (
          <a
            key={entity.slug}
            href={`${base}entites/${entity.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{entity.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {entity.type && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {entity.type}
                  </span>
                )}
                {entity.faction && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    {entity.faction}
                  </span>
                )}
                {entity.alignement && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getAlignementColor(entity.alignement)}`}>
                    {entity.alignement}
                  </span>
                )}
              </div>
              {entity.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{truncate(entity.description, 150)}</p>
              )}
            </div>
            <div className="p-6 pt-0 space-y-2">
              {/* Core stats */}
              <div className="flex gap-3 flex-wrap text-sm">
                {entity.health != null && <span><strong>PV:</strong> {entity.health}</span>}
                {entity.speed != null && <span><strong>Vit:</strong> {entity.speed}</span>}
                {entity.highestStatName && (
                  <span><strong>{entity.highestStatName}:</strong> {entity.highestStat}</span>
                )}
              </div>

              {/* Points badge */}
              {entity.points != null && (
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                    {entity.points} pts
                  </span>
                </div>
              )}

              {/* Resistance badges */}
              {(entity.rmec > 0 || entity.rrad > 0 || entity.rint > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {entity.rmec > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-600">
                      RMEC +{entity.rmec}
                    </span>
                  )}
                  {entity.rrad > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-600">
                      RRAD +{entity.rrad}
                    </span>
                  )}
                  {entity.rint > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-600">
                      RINT +{entity.rint}
                    </span>
                  )}
                </div>
              )}

              {/* Ability counts */}
              {(entity.spellCount > 0 || entity.skillCount > 0 || entity.weaponCount > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {entity.spellCount > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                      {entity.spellCount} sort{entity.spellCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {entity.skillCount > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400">
                      {entity.skillCount} comp.
                    </span>
                  )}
                  {entity.weaponCount > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400">
                      {entity.weaponCount} arme{entity.weaponCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
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
