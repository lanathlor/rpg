import { v4 as uuidv4 } from 'uuid'
import type { Character } from '@/types/character'
import type { CharacterClass, BaseStats, FluxSystem, CharacterStats, Equipment } from '@/types/classes'
import type { AffinityStats } from '@/types/common'

/**
 * Creates a mock BaseStats object
 */
export function createMockBaseStats(overrides?: Partial<BaseStats>): BaseStats {
  return {
    health: 100,
    speed: 6,
    ...overrides,
  }
}

/**
 * Creates a mock FluxSystem object
 */
export function createMockFluxSystem(overrides?: Partial<FluxSystem>): FluxSystem {
  return {
    reserve: 20,
    per_turn: 4,
    recovery: 2,
    ...overrides,
  }
}

/**
 * Creates a mock CharacterStats object
 */
export function createMockCharacterStats(overrides?: Partial<CharacterStats>): CharacterStats {
  return {
    force: 10,
    dexterite: 10,
    constitution: 10,
    intelligence: 10,
    perception: 10,
    precision: 10,
    charisme: 10,
    ...overrides,
  }
}

/**
 * Creates a mock AffinityStats object
 */
export function createMockAffinityStats(overrides?: Partial<AffinityStats>): AffinityStats {
  return {
    distance: 0,
    melee: 0,
    schools: {
      feu: 0,
      givre: 0,
      'bio-arcanotechnie': 0,
      electricite: 0,
      quantique: 0,
    },
    types: {
      destruction: 0,
      alteration: 0,
      amelioration: 0,
      deplacement: 0,
      protection: 0,
      arme: 0,
    },
    ...overrides,
  }
}

/**
 * Creates a mock Equipment object
 */
export function createMockEquipment(overrides?: Partial<Equipment>): Equipment {
  return {
    weapons: [],
    armor: [],
    consumables: [],
    ...overrides,
  }
}

/**
 * Creates a mock CharacterClass object
 */
export function createMockClass(overrides?: Partial<CharacterClass>): CharacterClass {
  return {
    name: 'Test Class',
    description: 'A test character class',
    base_stats: createMockBaseStats(),
    flux_system: createMockFluxSystem(),
    affinities: createMockAffinityStats(),
    stats: createMockCharacterStats(),
    equipment: createMockEquipment(),
    skills: [],
    spells: [],
    gameplay_guide: 'Test gameplay guide',
    ...overrides,
  }
}

/**
 * Creates a mock Character object
 */
export function createMockCharacter(overrides?: Partial<Character>): Character {
  const now = Date.now()
  return {
    id: uuidv4(),
    name: 'Test Character',
    description: 'A test character',
    base_stats: createMockBaseStats(),
    flux_system: createMockFluxSystem(),
    affinities: createMockAffinityStats(),
    stats: createMockCharacterStats(),
    equipment: createMockEquipment(),
    skills: [],
    spells: [],
    gameplay_guide: 'Test gameplay guide',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

/**
 * Creates a mock CharacterClass with common warrior attributes
 */
export function createWarriorClass(): CharacterClass {
  return createMockClass({
    name: 'Guerrier',
    description: 'Combattant corps à corps puissant',
    base_stats: createMockBaseStats({ health: 120, speed: 5 }),
    stats: createMockCharacterStats({ force: 14, constitution: 12 }),
    affinities: {
      ...createMockAffinityStats(),
      melee: 3,
      types: {
        ...createMockAffinityStats().types,
        arme: 2,
      },
    },
    equipment: createMockEquipment({
      weapons: ['Épée longue'],
      armor: ['Armure lourde'],
    }),
    skills: ['Combat rapproché', 'Endurance'],
  })
}

/**
 * Creates a mock CharacterClass with common mage attributes
 */
export function createMageClass(): CharacterClass {
  return createMockClass({
    name: 'Mage',
    description: 'Lanceur de sorts puissant',
    base_stats: createMockBaseStats({ health: 80, speed: 6 }),
    flux_system: createMockFluxSystem({ reserve: 30, per_turn: 6 }),
    stats: createMockCharacterStats({ intelligence: 14, perception: 12 }),
    affinities: {
      ...createMockAffinityStats(),
      distance: 3,
      schools: {
        ...createMockAffinityStats().schools,
        feu: 2,
        givre: 2,
      },
      types: {
        ...createMockAffinityStats().types,
        destruction: 3,
        alteration: 2,
      },
    },
    spells: ['Boule de feu', 'Javelot de glace'],
    skills: ['Incantation rapide', 'Méditation'],
  })
}

/**
 * Creates multiple mock classes for testing
 */
export function createMockClasses(count: number = 3): CharacterClass[] {
  return Array.from({ length: count }, (_, i) =>
    createMockClass({
      name: `Test Class ${i + 1}`,
      description: `Description for test class ${i + 1}`,
    })
  )
}

/**
 * Creates multiple mock characters for testing
 */
export function createMockCharacters(count: number = 3): Character[] {
  return Array.from({ length: count }, (_, i) =>
    createMockCharacter({
      name: `Test Character ${i + 1}`,
      description: `Description for test character ${i + 1}`,
    })
  )
}
