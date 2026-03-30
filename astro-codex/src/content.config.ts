import { defineCollection, z } from 'astro:content';
import { localizedLoader, localizedMarkdownLoader } from '@/lib/localizedLoader';

// Flexible schema for YAML spell effects (highly variable structure)
const spellEffectsSchema = z.any();

const sortsCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/spells' }),
  schema: z.object({
    spell_series: z.string().optional(),
    name: z.string().optional(),
    school: z.string().optional(),
    type: z.string().optional(),
    description_base: z.string().optional(),
    player_castable: z.boolean().optional(),
    image: z.string().optional(),
    levels: z.array(z.object({
      level: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      prerequisites: z.any().optional(),
      conditions: z.any().optional(),
      recharge_time: z.string().optional(),
      effects: spellEffectsSchema.optional(),
      duration: z.string().optional(),
      usage: z.string().optional(),
    })).optional(),
  }),
});

const armesCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/weapons' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    type: z.string().optional(),
    cost: z.string().optional(),
    image: z.string().optional(),
    prerequisites: z.any().optional(),
    stats: z.any().optional(),
    bonuses: z.any().optional(),
    base_stat_bonuses: z.any().optional(),
    resistance_bonuses: z.any().optional(),
    flux_bonuses: z.any().optional(),
    affinity_bonuses: z.any().optional(),
    properties: z.array(z.string()).optional(),
  }),
});

const equipementsCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/equipment' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    cost: z.string().optional(),
    image: z.string().optional(),
    prerequisites: z.any().optional(),
    stats: z.any().optional(),
    bonuses: z.any().optional(),
    base_stat_bonuses: z.any().optional(),
    resistance_bonuses: z.any().optional(),
    flux_bonuses: z.any().optional(),
    affinity_bonuses: z.any().optional(),
    properties: z.array(z.string()).optional(),
    resistances: z.array(z.string()).optional(),
  }),
});

const competencesCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/skills' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    effects: z.array(z.object({
      type: z.string(),
      description: z.string(),
    })).optional(),
    point_cost: z.number().optional(),
  }),
});

const consommablesCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/consumables' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    cost: z.string().optional(),
    effect: z.any().optional(),
  }),
});

const classesCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/classes' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    base_stats: z.any().optional(),
    innate_resistances: z.any().optional(),
    flux_system: z.any().optional(),
    stats: z.any().optional(),
    affinities: z.any().optional(),
    equipment: z.any().optional(),
    skills: z.any().optional(),
    spells: z.any().optional(),
    gameplay_guide: z.string().optional(),
    starting_credits: z.number().optional(),
    image: z.string().optional(),
  }),
});

const entitesCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/entities' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    faction: z.string().optional(),
    alignement: z.string().optional(),
    type: z.string().optional(),
    base_stats: z.any().optional(),
    innate_resistances: z.any().optional(),
    flux_system: z.any().optional(),
    stats: z.any().optional(),
    affinities: z.any().optional(),
    equipment: z.any().optional(),
    skills: z.any().optional(),
    spells: z.any().optional(),
    gameplay_guide: z.string().optional(),
    starting_credits: z.number().optional(),
    image: z.string().optional(),
  }),
});

const scenariosCollection = defineCollection({
  loader: localizedLoader({ base: '../codex/scenarios' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    session_info: z.any().optional(),
    gm_notes: z.any().optional(),
    requirements: z.any().optional(),
    synopsis: z.string().optional(),
    acts: z.any().optional(),
    encounters: z.any().optional(),
    npcs: z.any().optional(),
    rewards: z.any().optional(),
    variants: z.any().optional(),
    related_content: z.any().optional(),
  }),
});

const mdFrontmatterSchema = z.object({
  title: z.string(),
  order: z.number().optional(),
  description: z.string().optional(),
});

const reglesCollection = defineCollection({
  loader: localizedMarkdownLoader({ base: '../rules' }),
  schema: mdFrontmatterSchema,
});

const histoireCollection = defineCollection({
  loader: localizedMarkdownLoader({ base: '../history' }),
  schema: mdFrontmatterSchema,
});

export const collections = {
  spells: sortsCollection,
  weapons: armesCollection,
  equipment: equipementsCollection,
  skills: competencesCollection,
  consumables: consommablesCollection,
  classes: classesCollection,
  entities: entitesCollection,
  scenarios: scenariosCollection,
  rules: reglesCollection,
  history: histoireCollection,
};
