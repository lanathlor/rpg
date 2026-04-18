import { getCollection } from 'astro:content';
import type { Spell } from '@/types/spells';
import type { Weapon } from '@/types/weapons';
import type { Armor } from '@/types/armor';
import type { Skill } from '@/types/skills';
import type { Consumable } from '@/types/consumables';
import type { CharacterClass } from '@/types/classes';
import type { Entity } from '@/types/entities';
import type { Scenario } from '@/types/scenarios';
import { buildTree, type TreeNode } from '@/lib/treeUtils';
import type { Lang } from '@/lib/i18n';

/** Extract slug from a locale-prefixed ID: "fr/destruction/boule_de_feu" -> "destruction/boule_de_feu" */
function stripLocale(id: string): string {
  const slash = id.indexOf('/');
  return slash >= 0 ? id.slice(slash + 1) : id;
}

/** Filter collection entries by locale prefix */
function byLocale<T>(entries: Array<{ id: string; data: T }>, locale: Lang) {
  return entries.filter(e => e.id.startsWith(`${locale}/`));
}

export async function getSpells(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Spell }>> {
  const entries = await getCollection('spells');
  return byLocale(entries, locale).map(entry => {
    const data = entry.data as Spell;
    if (!data.name && data.spell_series) {
      data.name = data.spell_series;
    }
    return {
      id: entry.id,
      slug: stripLocale(entry.id),
      data,
    };
  });
}

export async function getWeapons(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Weapon }>> {
  const entries = await getCollection('weapons');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as Weapon,
  }));
}

export async function getArmors(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Armor }>> {
  const entries = await getCollection('equipment');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as Armor,
  }));
}

export async function getSkills(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Skill }>> {
  const entries = await getCollection('skills');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as Skill,
  }));
}

export async function getConsumables(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Consumable }>> {
  const entries = await getCollection('consumables');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as Consumable,
  }));
}

export async function getClasses(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: CharacterClass }>> {
  const entries = await getCollection('classes');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as CharacterClass,
  }));
}

export async function getEntities(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Entity }>> {
  const entries = await getCollection('entities');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as Entity,
  }));
}

export async function getScenarios(locale: Lang = 'fr'): Promise<Array<{ id: string; slug: string; data: Scenario }>> {
  const entries = await getCollection('scenarios');
  return byLocale(entries, locale).map(entry => ({
    id: entry.id,
    slug: stripLocale(entry.id),
    data: entry.data as unknown as Scenario,
  }));
}

export async function getRules(locale: Lang = 'fr') {
  const entries = await getCollection('rules');
  return byLocale(entries, locale)
    .map(e => ({ ...e, id: stripLocale(e.id) }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function getHistory(locale: Lang = 'fr') {
  const entries = await getCollection('history');
  return byLocale(entries, locale)
    .map(e => ({ ...e, id: stripLocale(e.id) }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function getRulesTree(locale: Lang = 'fr'): Promise<TreeNode[]> {
  const entries = await getCollection('rules');
  return buildTree(byLocale(entries, locale).map(e => ({
    id: stripLocale(e.id),
    data: e.data as { title?: string; order?: number; description?: string },
  })));
}

export type ItemLink = {
  slug: string;
  description?: string;
  details?: string[];
  /** Per-level tooltip details for spells (keyed by level string, e.g. "1", "2") */
  levelDetails?: Record<string, string[]>;
};

export type LinkMaps = {
  weapons: Record<string, ItemLink>;
  armor: Record<string, ItemLink>;
  consumables: Record<string, ItemLink>;
  skills: Record<string, ItemLink>;
  spells: Record<string, ItemLink>;
};

/** Build name→{slug, tooltip} lookup maps for cross-linking from entity/class pages.
 *  Indexes both FR and EN names so references in either language resolve. */
export async function buildLinkMaps(): Promise<LinkMaps> {
  const [weaponsFr, weaponsEn, armorsFr, armorsEn, consumablesFr, consumablesEn, skillsFr, skillsEn, spellsFr, spellsEn] = await Promise.all([
    getWeapons('fr'), getWeapons('en'),
    getArmors('fr'), getArmors('en'),
    getConsumables('fr'), getConsumables('en'),
    getSkills('fr'), getSkills('en'),
    getSpells('fr'), getSpells('en'),
  ]);

  function register(map: Record<string, ItemLink>, name: string, link: ItemLink) {
    // Only set if not already present (first locale wins — FR data takes priority)
    if (!map[name]) map[name] = link;
    const lower = name.toLowerCase();
    if (!map[lower]) map[lower] = link;
  }

  // Weapons
  const weaponsMap: Record<string, ItemLink> = {};
  for (const list of [weaponsFr, weaponsEn]) {
    for (const item of list) {
      const name = item.data.name;
      if (!name) continue;
      const d = item.data as Weapon;
      const details: string[] = [];
      if (d.stats?.damage) details.push(d.stats.damage);
      if (d.stats?.range) details.push(d.stats.range);
      if (d.cost) details.push(d.cost);
      register(weaponsMap, name, { slug: item.slug, description: d.description, details });
    }
  }

  // Armor
  const armorMap: Record<string, ItemLink> = {};
  for (const list of [armorsFr, armorsEn]) {
    for (const item of list) {
      const name = item.data.name;
      if (!name) continue;
      const d = item.data as Armor;
      const details: string[] = [];
      const res = [d.stats?.RMEC && `RMEC ${d.stats.RMEC}`, d.stats?.RRAD && `RRAD ${d.stats.RRAD}`, d.stats?.RINT && `RINT ${d.stats.RINT}`].filter(Boolean) as string[];
      if (res.length) details.push(res.join(' / '));
      if (d.cost) details.push(d.cost);
      register(armorMap, name, { slug: item.slug, description: d.description, details });
    }
  }

  // Consumables
  const consumablesMap: Record<string, ItemLink> = {};
  for (const list of [consumablesFr, consumablesEn]) {
    for (const item of list) {
      const name = item.data.name;
      if (!name) continue;
      const d = item.data as Consumable;
      const details: string[] = [];
      if (d.effect?.damage) details.push(d.effect.damage);
      if (d.effect?.healing) details.push(d.effect.healing);
      if (d.effect?.area_effect) details.push(d.effect.area_effect);
      if (d.cost) details.push(d.cost);
      register(consumablesMap, name, { slug: item.slug, description: d.description, details });
    }
  }

  // Skills
  const skillsMap: Record<string, ItemLink> = {};
  for (const list of [skillsFr, skillsEn]) {
    for (const item of list) {
      const name = item.data.name;
      if (!name) continue;
      const d = item.data as Skill;
      const details: string[] = [];
      if (d.point_cost) details.push(`${d.point_cost} pts`);
      register(skillsMap, name, { slug: item.slug, description: d.description, details });
    }
  }

  // Spells
  const spellsMap: Record<string, ItemLink> = {};
  for (const list of [spellsFr, spellsEn]) {
    for (const item of list) {
      const d = item.data as Spell;
      const name = d.name || d.spell_series;
      if (!name) continue;
      const levelDetails: Record<string, string[]> = {};
      for (const lvl of d.levels || []) {
        const ld: string[] = [];
        if (lvl.conditions?.flux_cost) ld.push(`${lvl.conditions.flux_cost} flux`);
        if (lvl.effects?.damage) ld.push(lvl.effects.damage);
        if (d.school) ld.push(d.school);
        levelDetails[lvl.level] = ld;
      }
      const details = levelDetails['1'] || [];
      register(spellsMap, name, { slug: item.slug, description: d.description_base || d.description, details, levelDetails });
    }
  }

  return {
    weapons: weaponsMap,
    armor: armorMap,
    consumables: consumablesMap,
    skills: skillsMap,
    spells: spellsMap,
  };
}

export async function getHistoryTree(locale: Lang = 'fr'): Promise<TreeNode[]> {
  const entries = await getCollection('history');
  return buildTree(byLocale(entries, locale).map(e => ({
    id: stripLocale(e.id),
    data: e.data as { title?: string; order?: number; description?: string },
  })));
}
