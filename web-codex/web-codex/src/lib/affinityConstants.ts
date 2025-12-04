/**
 * Predefined affinity values for character creation
 * These are the standard schools and types used in the game system
 */

// School affinities (quantotechnique schools)
export const SCHOOLS = [
  'aérocinétique',
  'balistique',
  'bioarcanotechnique',
  'biométabolique',
  'chronodynamique',
  'électricité',
  'feu',
  'givre',
  'gravitonique',
  'hydrodynamique',
  'illusion',
  'kinesthésique',
  'lumière',
  'magnétique',
  'martial',
  'ombre',
  'pure',
  'quantique',
  'sonique',
] as const

// Type affinities (spell types)
export const TYPES = [
  'affliction',
  'alteration',
  'amelioration',
  'arme',
  'deplacement',
  'destruction',
  'protection',
] as const

// Combat affinities
export const COMBAT_AFFINITIES = [
  { key: 'distance', label: 'Distance' },
  { key: 'melee', label: 'Corps à corps (CAC)' },
] as const

// Special weapon affinities
export const SPECIAL_WEAPONS = [
  'fusil_a_pompe',
  'fusil_de_precision',
  'fusil_d_assaut',
  'pistolet_lourd',
  'mitrailleuse',
  'lance_roquettes',
] as const

// School costs per level (from pointBuyCalculator)
export const SCHOOL_COSTS: Record<string, number> = {
  // Pure tier (8 pts per level)
  pure: 8,

  // Quantique tier (7 pts per level)
  quantique: 7,

  // Complex tier (6 pts per level)
  chronodynamique: 6,
  gravitonique: 6,

  // Advanced tier (5 pts per level)
  bioarcanotechnique: 5,
  magnétique: 5,

  // Standard tier (3 pts per level)
  feu: 3,
  électricité: 3,
  givre: 3,
  lumière: 3,
  martial: 3,
  balistique: 3,
  illusion: 3,
  ombre: 3,
  aérocinétique: 3,
  hydrodynamique: 3,
  biométabolique: 3,
  kinesthésique: 3,
  sonique: 3,
}

// Type costs per level (all types cost 5 pts per level)
export const TYPE_COST = 5

// Combat affinity cost per level (4 pts per level)
export const COMBAT_AFFINITY_COST = 4

// Special weapon affinity cost per level (4 pts per level)
export const SPECIAL_WEAPON_COST = 4

/**
 * Get the cost per level for a school
 */
export function getSchoolCost(school: string): number {
  return SCHOOL_COSTS[school] || 3 // Default to standard tier
}

/**
 * Calculate total cost for an affinity at a given level
 */
export function calculateAffinityCost(
  affinityType: 'school' | 'type' | 'combat' | 'special_weapon',
  school: string,
  level: number
): number {
  if (level === 0) return 0

  switch (affinityType) {
    case 'school':
      return getSchoolCost(school) * level
    case 'type':
      return TYPE_COST * level
    case 'combat':
    case 'special_weapon':
      return COMBAT_AFFINITY_COST * level
    default:
      return 0
  }
}

export type School = typeof SCHOOLS[number]
export type Type = typeof TYPES[number]
export type CombatAffinity = typeof COMBAT_AFFINITIES[number]['key']
export type SpecialWeapon = typeof SPECIAL_WEAPONS[number]
