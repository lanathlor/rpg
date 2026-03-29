import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Flexible schema for YAML spell effects (highly variable structure)
const spellEffectsSchema = z.any();

const sortsCollection = defineCollection({
  loader: glob({
    pattern: ['**/*.yaml', '!**/index.yaml', '!**/SPELL_TEMPLATE.yaml'],
    base: '../codex/sorts',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml'],
    base: '../codex/armes',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml'],
    base: '../codex/equipements',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml', '!SKILL_TEMPLATE.yaml'],
    base: '../codex/competences',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml'],
    base: '../codex/consommables',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml'],
    base: '../codex/classes',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml', '!ENTITY_TEMPLATE.yaml'],
    base: '../codex/entites',
  }),
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
  loader: glob({
    pattern: ['*.yaml', '!index.yaml', '!SCENARIO_TEMPLATE.yaml'],
    base: '../codex/scenarios',
  }),
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
  loader: glob({
    pattern: '**/*.md',
    base: '../rules',
  }),
  schema: mdFrontmatterSchema,
});

const histoireCollection = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!12_structure_militaire.md'],
    base: '../history',
  }),
  schema: mdFrontmatterSchema,
});

export const collections = {
  sorts: sortsCollection,
  armes: armesCollection,
  equipements: equipementsCollection,
  competences: competencesCollection,
  consommables: consommablesCollection,
  classes: classesCollection,
  entites: entitesCollection,
  scenarios: scenariosCollection,
  regles: reglesCollection,
  histoire: histoireCollection,
};
