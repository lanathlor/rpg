import { useState, useMemo } from 'react';
import { RangeSlider } from '@/components/ui/range-slider';
import { t } from '@/lib/i18n';

interface ClassItem {
  slug: string;
  name: string;
  description: string;
  health: number;
  speed: number;
  fluxReserve: number;
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
  classes: ClassItem[];
  base: string;
}

function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function ClassListIsland({ classes, base }: Props) {
  const globalMin = useMemo(() => Math.min(...classes.map(c => c.points)), [classes]);
  const globalMax = useMemo(() => Math.max(...classes.map(c => c.points)), [classes]);

  const [search, setSearch] = useState('');
  const [pointMin, setPointMin] = useState(globalMin);
  const [pointMax, setPointMax] = useState(globalMax);
  const [sortBy, setSortBy] = useState('name-asc');

  const filtered = useMemo(() => {
    const result = classes.filter(c => {
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchPoints = c.points >= pointMin && c.points <= pointMax;
      return matchSearch && matchPoints;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'points-asc': return a.points - b.points;
        case 'points-desc': return b.points - a.points;
        default: return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [classes, search, pointMin, pointMax, sortBy]);

  const hasFilters = search || pointMin !== globalMin || pointMax !== globalMax;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('classes.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-center">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">{t('common.sort.nameAZShort')}</option>
            <option value="name-desc">{t('common.sort.nameZAShort')}</option>
            <option value="points-asc">{t('common.sort.pointsAsc')}</option>
            <option value="points-desc">{t('common.sort.pointsDesc')}</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setPointMin(globalMin); setPointMax(globalMax); }}
              className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent"
            >
              {t('common.reset')}
            </button>
          )}
        </div>
      </div>

      {/* Point Range Slider */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium whitespace-nowrap">{t('classes.points')}</span>
        <RangeSlider
          min={globalMin}
          max={globalMax}
          value={[pointMin, pointMax]}
          onChange={([lo, hi]) => { setPointMin(lo); setPointMax(hi); }}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {`${filtered.length} ${t('common.of')} ${classes.length} ${classes.length === 1 ? t('common.class') : t('common.classes')}`}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(cls => (
          <a
            key={cls.slug}
            href={`${base}classes/${cls.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{truncate(cls.description, 150)}</p>
            </div>
            <div className="p-6 pt-0 space-y-2">
              {/* Core stats */}
              <div className="flex gap-3 flex-wrap text-sm">
                <span><strong>{t('common.pvLabel')}</strong> {cls.health}</span>
                <span><strong>{t('common.speedLabel')}</strong> {cls.speed}</span>
                {cls.highestStatName && (
                  <span><strong>{cls.highestStatName}:</strong> {cls.highestStat}</span>
                )}
              </div>

              {/* Points badge */}
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                  {`${cls.points} ${t('common.pts')}`}
                </span>
              </div>

              {/* Resistance badges */}
              {(cls.rmec > 0 || cls.rrad > 0 || cls.rint > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {cls.rmec > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-600">
                      {`RMEC +${cls.rmec}`}
                    </span>
                  )}
                  {cls.rrad > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-600">
                      {`RRAD +${cls.rrad}`}
                    </span>
                  )}
                  {cls.rint > 0 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-600">
                      {`RINT +${cls.rint}`}
                    </span>
                  )}
                </div>
              )}

              {/* Ability counts */}
              <div className="flex gap-2 flex-wrap">
                {cls.spellCount > 0 && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                    {`${cls.spellCount} ${cls.spellCount > 1 ? t('common.spells') : t('common.spell')}`}
                  </span>
                )}
                {cls.skillCount > 0 && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400">
                    {`${cls.skillCount} ${t('common.comp')}`}
                  </span>
                )}
                {cls.weaponCount > 0 && (
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400">
                    {`${cls.weaponCount} ${cls.weaponCount > 1 ? t('common.weapons') : t('common.weapon')}`}
                  </span>
                )}
              </div>
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
