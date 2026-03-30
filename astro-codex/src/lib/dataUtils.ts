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

export async function getHistoryTree(locale: Lang = 'fr'): Promise<TreeNode[]> {
  const entries = await getCollection('history');
  return buildTree(byLocale(entries, locale).map(e => ({
    id: stripLocale(e.id),
    data: e.data as { title?: string; order?: number; description?: string },
  })));
}
