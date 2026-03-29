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

export async function getSpells(): Promise<Array<{ id: string; slug: string; data: Spell }>> {
  const entries = await getCollection('sorts');
  return entries.map(entry => {
    const data = entry.data as Spell;
    // Map spell_series to name when name is missing
    if (!data.name && data.spell_series) {
      data.name = data.spell_series;
    }
    return {
      id: entry.id,
      slug: entry.id,
      data,
    };
  });
}

export async function getWeapons(): Promise<Array<{ id: string; slug: string; data: Weapon }>> {
  const entries = await getCollection('armes');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as Weapon,
  }));
}

export async function getArmors(): Promise<Array<{ id: string; slug: string; data: Armor }>> {
  const entries = await getCollection('equipements');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as Armor,
  }));
}

export async function getSkills(): Promise<Array<{ id: string; slug: string; data: Skill }>> {
  const entries = await getCollection('competences');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as Skill,
  }));
}

export async function getConsumables(): Promise<Array<{ id: string; slug: string; data: Consumable }>> {
  const entries = await getCollection('consommables');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as Consumable,
  }));
}

export async function getClasses(): Promise<Array<{ id: string; slug: string; data: CharacterClass }>> {
  const entries = await getCollection('classes');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as CharacterClass,
  }));
}

export async function getEntities(): Promise<Array<{ id: string; slug: string; data: Entity }>> {
  const entries = await getCollection('entites');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as Entity,
  }));
}

export async function getScenarios(): Promise<Array<{ id: string; slug: string; data: Scenario }>> {
  const entries = await getCollection('scenarios');
  return entries.map(entry => ({
    id: entry.id,
    slug: entry.id.replace(/\.yaml$/, ''),
    data: entry.data as unknown as Scenario,
  }));
}

export async function getRules() {
  const entries = await getCollection('regles');
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getHistory() {
  const entries = await getCollection('histoire');
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

export async function getRulesTree(): Promise<TreeNode[]> {
  const entries = await getCollection('regles');
  return buildTree(entries.map(e => ({
    id: e.id,
    data: e.data as { title?: string; order?: number; description?: string },
  })));
}

export async function getHistoryTree(): Promise<TreeNode[]> {
  const entries = await getCollection('histoire');
  return buildTree(entries.map(e => ({
    id: e.id,
    data: e.data as { title?: string; order?: number; description?: string },
  })));
}
