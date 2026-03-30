import { useState, useMemo } from 'react';
import { t } from '@/lib/i18n';

interface SpellLevel {
  conditions?: { flux_cost?: number; recharge?: string };
  recharge_time?: string;
  effects?: any;
}

interface SpellItem {
  slug: string;
  name: string;
  school: string;
  type: string;
  description: string;
  levelCount: number;
  firstLevel?: SpellLevel;
  powerScore: number;
  accessibilityScore: number;
  valueRating: number;
  tierName: string;
  tierColor: string;
}

interface Props {
  spells: SpellItem[];
  base: string;
}

const schoolColors: Record<string, string> = {
  'feu': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'givre': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  'électricité': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'quantique': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'bioarcanotechnique': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  'biométabolique': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'magnétique': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'chronodynamique': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  'gravitonique': 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
  'aérocinétique': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  'hydrodynamique': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'sonique': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'illusion': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'martial': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
  'balistique': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'kinesthésique': 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300',
  'lumière': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'ombre': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  'pure': 'bg-white text-gray-800 dark:bg-gray-200 dark:text-gray-800',
};

const typeColors: Record<string, string> = {
  'destruction': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'protection': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'alteration': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'amelioration': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'deplacement': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'arme': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'affliction': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function SpellListIsland({ spells, base }: Props) {
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const schools = useMemo(() => [...new Set(spells.map(s => s.school).filter(Boolean))].sort(), [spells]);
  const types = useMemo(() => [...new Set(spells.map(s => s.type).filter(Boolean))].sort(), [spells]);

  const filtered = useMemo(() => {
    const result = spells.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
      const matchSchool = !filterSchool || s.school === filterSchool;
      const matchType = !filterType || s.type === filterType;
      return matchSearch && matchSchool && matchType;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'power-desc': return b.powerScore - a.powerScore;
        case 'power-asc': return a.powerScore - b.powerScore;
        case 'value-desc': return b.valueRating - a.valueRating;
        case 'value-asc': return a.valueRating - b.valueRating;
        default: return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [spells, search, filterSchool, filterType, sortBy]);

  const hasFilters = search || filterSchool || filterType;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('spells.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <select value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">{t('spells.allSchools')}</option>
            {schools.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">{t('spells.allTypes')}</option>
            {types.map(tp => <option key={tp} value={tp}>{tp}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">{t('common.sort.nameAZ')}</option>
            <option value="name-desc">{t('common.sort.nameZA')}</option>
            <option value="power-desc">{t('spells.sort.powerDesc')}</option>
            <option value="power-asc">{t('spells.sort.powerAsc')}</option>
            <option value="value-desc">{t('spells.sort.valueDesc')}</option>
            <option value="value-asc">{t('spells.sort.valueAsc')}</option>
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setFilterSchool(''); setFilterType(''); }} className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent">
              {t('common.reset')}
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {`${filtered.length} ${t('common.of')} ${spells.length} ${spells.length === 1 ? t('common.spell') : t('common.spells')}`}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(spell => (
          <a
            key={spell.slug}
            href={`${base}spells/${spell.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{spell.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {spell.school && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${schoolColors[spell.school] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {spell.school}
                  </span>
                )}
                {spell.type && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeColors[spell.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {spell.type}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{truncate(spell.description, 120)}</p>
            </div>
            <div className="p-6 pt-0 space-y-2">
              <div className="text-sm"><strong>{t('spells.levels')}</strong> {spell.levelCount}</div>
              {/* Ratings */}
              <div className="flex gap-2 py-1 flex-wrap">
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                  {`Pwr ${spell.powerScore.toFixed(0)}`}
                </span>
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                  {`Acc ${spell.accessibilityScore.toFixed(0)}`}
                </span>
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400">
                  {`Val ${spell.valueRating.toFixed(1)}`}
                </span>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${spell.tierColor}`}>
                  {spell.tierName}
                </span>
              </div>
              {/* Key effects preview */}
              {spell.firstLevel && (
                <div className="text-sm space-y-1">
                  {spell.firstLevel.conditions?.flux_cost ? (
                    <div><strong>{t('spells.fluxCost')}</strong> {spell.firstLevel.conditions.flux_cost}</div>
                  ) : (spell.firstLevel.conditions?.recharge || spell.firstLevel.recharge_time) ? (
                    <div className="font-semibold text-blue-600 dark:text-blue-400">{t('spells.recharge')} {spell.firstLevel.conditions?.recharge || spell.firstLevel.recharge_time}</div>
                  ) : null}
                  {spell.firstLevel.effects?.damage && (
                    <div><strong className="text-red-600 dark:text-red-400">{t('common.damage')}</strong> {spell.firstLevel.effects.damage}</div>
                  )}
                  {spell.firstLevel.effects?.protection && (
                    <div><strong className="text-green-600 dark:text-green-400">{t('common.protection')}</strong> {truncate(spell.firstLevel.effects.protection, 40)}</div>
                  )}
                  {spell.firstLevel.effects?.movement && (
                    <div><strong className="text-blue-600 dark:text-blue-400">{t('spells.movement')}</strong> {truncate(spell.firstLevel.effects.movement, 40)}</div>
                  )}
                  {spell.firstLevel.effects?.debuff && (
                    <div><strong className="text-purple-600 dark:text-purple-400">{t('spells.debuff')}</strong> {truncate(spell.firstLevel.effects.debuff, 40)}</div>
                  )}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('spells.noResult')}
        </div>
      )}
    </div>
  );
}
