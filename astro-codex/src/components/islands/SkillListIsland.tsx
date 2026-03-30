import { useState, useMemo } from 'react';
import { t } from '@/lib/i18n';

interface SkillItem {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  pointCost: number;
  tier: string;
  tierColor: string;
  effectsPreview: string;
}

interface Props {
  skills: SkillItem[];
  base: string;
}

const tierConfig: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
  'S': { bg: 'bg-red-100 dark:bg-red-900', border: 'border-red-400 dark:border-red-600', text: 'text-red-700 dark:text-red-300', activeBg: 'bg-red-500 dark:bg-red-600 text-white' },
  'A': { bg: 'bg-orange-100 dark:bg-orange-900', border: 'border-orange-400 dark:border-orange-600', text: 'text-orange-700 dark:text-orange-300', activeBg: 'bg-orange-500 dark:bg-orange-600 text-white' },
  'B': { bg: 'bg-amber-100 dark:bg-amber-900', border: 'border-amber-400 dark:border-amber-600', text: 'text-amber-700 dark:text-amber-300', activeBg: 'bg-amber-500 dark:bg-amber-600 text-white' },
  'C': { bg: 'bg-yellow-100 dark:bg-yellow-900', border: 'border-yellow-400 dark:border-yellow-600', text: 'text-yellow-700 dark:text-yellow-300', activeBg: 'bg-yellow-500 dark:bg-yellow-600 text-white' },
  'D': { bg: 'bg-blue-100 dark:bg-blue-900', border: 'border-blue-400 dark:border-blue-600', text: 'text-blue-700 dark:text-blue-300', activeBg: 'bg-blue-500 dark:bg-blue-600 text-white' },
  'E': { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-400 dark:border-gray-600', text: 'text-gray-700 dark:text-gray-300', activeBg: 'bg-gray-500 dark:bg-gray-600 text-white' },
};

const allTiers = ['S', 'A', 'B', 'C', 'D', 'E'];

function getTierBadgeColor(tier: string): string {
  const conf = tierConfig[tier];
  if (!conf) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  return `${conf.bg} ${conf.text}`;
}

function truncate(str: string | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function SkillListIsland({ skills, base }: Props) {
  const [search, setSearch] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [activeTiers, setActiveTiers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('name-asc');

  const subcategories = useMemo(() => [...new Set(skills.map(s => s.subcategory).filter(Boolean))].sort(), [skills]);

  const toggleTier = (tier: string) => {
    setActiveTiers(prev => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const result = skills.filter(s => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase());
      const matchSubcategory = !filterSubcategory || s.subcategory === filterSubcategory;
      const matchTier = activeTiers.size === 0 || activeTiers.has(s.tier);
      return matchSearch && matchSubcategory && matchTier;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'points-asc': return (a.pointCost ?? 0) - (b.pointCost ?? 0);
        case 'points-desc': return (b.pointCost ?? 0) - (a.pointCost ?? 0);
        default: return a.name.localeCompare(b.name);
      }
    });
    return result;
  }, [skills, search, filterSubcategory, activeTiers, sortBy]);

  const hasFilters = search || filterSubcategory || activeTiers.size > 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('skills.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <select value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="">{t('skills.allSubcategories')}</option>
            {subcategories.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2 bg-background text-sm">
            <option value="name-asc">{t('common.sort.nameAZShort')}</option>
            <option value="name-desc">{t('common.sort.nameZAShort')}</option>
            <option value="points-asc">{t('common.sort.pointsAsc')}</option>
            <option value="points-desc">{t('common.sort.pointsDesc')}</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterSubcategory(''); setActiveTiers(new Set()); }}
              className="border rounded px-3 py-2 bg-background text-sm hover:bg-accent"
            >
              {t('common.reset')}
            </button>
          )}
        </div>
      </div>

      {/* Tier toggle badges */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-muted-foreground mr-1">{t('skills.tier')}</span>
        {allTiers.map(tier => {
          const conf = tierConfig[tier];
          const isActive = activeTiers.has(tier);
          return (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold cursor-pointer transition-colors ${
                isActive
                  ? `${conf.activeBg} ${conf.border}`
                  : `bg-transparent ${conf.border} ${conf.text} hover:${conf.bg}`
              }`}
            >
              {tier}
            </button>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground">
        {filtered.length} {t('common.of')} {skills.length} {skills.length === 1 ? t('common.skill') : t('common.skills')}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(skill => (
          <a
            key={skill.slug}
            href={`${base}competences/${skill.slug}/`}
            className="block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full"
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{skill.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {skill.tier && (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getTierBadgeColor(skill.tier)}`}>
                    {skill.tier}
                  </span>
                )}
                {skill.category && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    {skill.category}
                  </span>
                )}
                {skill.subcategory && (
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {skill.subcategory}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 pt-0 space-y-2">
              {skill.effectsPreview && (
                <p className="text-sm text-muted-foreground line-clamp-2">{truncate(skill.effectsPreview, 120)}</p>
              )}
              {skill.pointCost != null && (
                <div className="text-sm">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                    {`${skill.pointCost} ${t('common.pts')}`}
                  </span>
                </div>
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
