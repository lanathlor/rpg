import type { CharacterClass } from '@/types/classes'
import type { Weapon } from '@/types/weapons'
import type { Armor } from '@/types/armor'
import type { Skill } from '@/types/skills'
import type { Consumable } from '@/types/consumables'

/**
 * Point Buy Calculator
 *
 * Calculates point buy costs for character classes based on:
 * - Stats (with 1.5x multiplier, rounded up)
 * - Affinities (tiered system by school rarity)
 * - Flux system (reserve, per_turn, recovery)
 * - Equipment (credits/400, rounded up)
 * - Competences (fixed costs by tier)
 */

// School tier costs
const SCHOOL_COSTS: Record<string, number> = {
  // Pure
  pure: 8,
  // Quantique
  quantique: 7,
  // Complexes
  chronodynamique: 6,
  gravitonique: 6,
  // Avancées
  bioarcanotechnique: 5,
  magnetique: 5,
  // Standard
  feu: 3,
  electricite: 3,
  givre: 3,
  lumiere: 3,
  martial: 3,
  balistique: 3,
  illusion: 3,
  ombre: 3,
}

const TYPE_COST = 5
const COMBAT_AFFINITY_COST = 4
const SPECIAL_WEAPON_COST = 4

// Special weapon affinities
const SPECIAL_WEAPONS = ['fusil_a_pompe', 'sniper', 'arme_1_main']

/**
 * Calculate cost for a single stat value
 * Base 8 is free
 * 9-13: 2 pts/level (rounded up from 1.5)
 * 14-15: 3 pts/level
 * 16-17: 5 pts/level (rounded up from 4.5)
 * 18: 6 pts
 */
export function calculateStatCost(statValue: number): number {
  if (statValue <= 8) return 0

  let cost = 0
  let current = 9

  // 9-13: 2 pts each
  while (current <= 13 && current <= statValue) {
    cost += 2
    current++
  }

  // 14-15: 3 pts each
  while (current <= 15 && current <= statValue) {
    cost += 3
    current++
  }

  // 16-17: 5 pts each
  while (current <= 17 && current <= statValue) {
    cost += 5
    current++
  }

  // 18: 6 pts
  if (statValue >= 18) {
    cost += 6
  }

  return cost
}

/**
 * Calculate total stats cost for all character stats
 */
export function calculateStatsCost(stats: {
  force?: number
  dexterite?: number
  constitution?: number
  intelligence?: number
  perception?: number
  precision?: number
  charisme?: number
}): number {
  const statValues = [
    stats.force || 8,
    stats.dexterite || 8,
    stats.constitution || 8,
    stats.intelligence || 8,
    stats.perception || 8,
    stats.precision || 8,
    stats.charisme || 8,
  ]

  return statValues.reduce((total, value) => total + calculateStatCost(value), 0)
}

/**
 * Calculate cost for a single affinity (school, type, or combat)
 */
export function calculateAffinityCost(affinityType: string, level: number): number {
  // Check if it's a school
  if (affinityType in SCHOOL_COSTS) {
    return SCHOOL_COSTS[affinityType] * level
  }

  // Check if it's a special weapon affinity
  if (SPECIAL_WEAPONS.includes(affinityType)) {
    return SPECIAL_WEAPON_COST * level
  }

  // Check if it's a combat affinity (distance, melee)
  if (affinityType === 'distance' || affinityType === 'melee') {
    return COMBAT_AFFINITY_COST * level
  }

  // Default to type cost
  return TYPE_COST * level
}

/**
 * Calculate total affinities cost
 */
export function calculateAffinitiesCost(affinities: {
  distance?: number
  melee?: number
  [key: string]: number | { [key: string]: number } | undefined
}): number {
  let total = 0

  // Process combat affinities
  if (affinities.distance) {
    total += calculateAffinityCost('distance', affinities.distance)
  }
  if (affinities.melee) {
    total += calculateAffinityCost('melee', affinities.melee)
  }

  // Process special weapon affinities
  SPECIAL_WEAPONS.forEach(weapon => {
    if (affinities[weapon] && typeof affinities[weapon] === 'number') {
      total += calculateAffinityCost(weapon, affinities[weapon] as number)
    }
  })

  // Process schools
  if (affinities.schools && typeof affinities.schools === 'object') {
    Object.entries(affinities.schools).forEach(([school, level]) => {
      if (typeof level === 'number') {
        total += calculateAffinityCost(school, level)
      }
    })
  }

  // Process types
  if (affinities.types && typeof affinities.types === 'object') {
    Object.entries(affinities.types).forEach(([type, level]) => {
      if (typeof level === 'number') {
        total += TYPE_COST * level
      }
    })
  }

  return total
}

/**
 * Calculate flux system cost
 * reserve: 1 pt per point
 * per_turn: 3 pts per point (regeneration is valuable)
 * recovery: 2 pts per point
 */
export function calculateFluxCost(flux?: {
  reserve?: number
  per_turn?: number
  recovery?: number
}): number {
  if (!flux) return 0

  const reserveCost = (flux.reserve || 0) * 1
  const perTurnCost = (flux.per_turn || 0) * 3
  const recoveryCost = (flux.recovery || 0) * 2

  return reserveCost + perTurnCost + recoveryCost
}

/**
 * Parse equipment cost string (e.g., "800 crédits") and return number
 */
export function parseEquipmentCost(costString?: string): number {
  if (!costString) return 0

  const match = costString.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Calculate equipment point cost (credits / 400, rounded up)
 */
export function calculateEquipmentCost(
  equipment: {
    weapons?: string[]
    armor?: string[]
    consumables?: Array<{ name: string; quantity?: number }>
  },
  allWeapons: Weapon[],
  allArmor: Armor[],
  allConsumables: Consumable[]
): number {
  let totalCredits = 0

  // Calculate weapons cost
  if (equipment.weapons) {
    equipment.weapons.forEach(weaponName => {
      const weapon = allWeapons.find(w => w.name === weaponName)
      if (weapon) {
        totalCredits += parseEquipmentCost(weapon.cost)
      }
    })
  }

  // Calculate armor cost
  if (equipment.armor) {
    equipment.armor.forEach(armorName => {
      const armor = allArmor.find(a => a.name === armorName)
      if (armor) {
        totalCredits += parseEquipmentCost(armor.cost)
      }
    })
  }

  // Calculate consumables cost
  if (equipment.consumables) {
    equipment.consumables.forEach(consumable => {
      const item = allConsumables.find(c => c.name === consumable.name)
      if (item) {
        const quantity = consumable.quantity || 1
        totalCredits += parseEquipmentCost(item.cost) * quantity
      }
    })
  }

  // Convert credits to points (divide by 400, round up)
  return Math.ceil(totalCredits / 400)
}

/**
 * Calculate total competence cost
 */
export function calculateCompetenceCost(
  skillNames: string[],
  allSkills: Skill[]
): number {
  return skillNames.reduce((total, skillName) => {
    const skill = allSkills.find(s => s.name === skillName)
    return total + (skill?.point_cost || 0)
  }, 0)
}

/**
 * Main calculation function - returns breakdown and total
 */
export interface PointBuyBreakdown {
  stats: number
  affinities: number
  flux: number
  equipment: number
  competences: number
  total: number
}

export function calculateTotalPointBuy(
  characterClass: CharacterClass,
  allWeapons: Weapon[],
  allArmor: Armor[],
  allSkills: Skill[],
  allConsumables: Consumable[]
): PointBuyBreakdown {
  const stats = calculateStatsCost(characterClass.stats)
  const affinities = calculateAffinitiesCost(characterClass.affinities)
  const flux = calculateFluxCost(characterClass.flux_system)
  const equipment = calculateEquipmentCost(
    characterClass.equipment,
    allWeapons,
    allArmor,
    allConsumables
  )
  const competences = calculateCompetenceCost(
    characterClass.skills,
    allSkills
  )

  return {
    stats,
    affinities,
    flux,
    equipment,
    competences,
    total: stats + affinities + flux + equipment + competences,
  }
}

/**
 * Get point tier for display styling
 * Returns tier name and color class
 */
export function getPointTier(total: number): {
  name: string
  colorClass: string
} {
  if (total < 195) {
    return { name: 'Low', colorClass: 'text-blue-600' }
  } else if (total < 220) {
    return { name: 'Mid', colorClass: 'text-purple-600' }
  } else {
    return { name: 'High', colorClass: 'text-amber-600' }
  }
}

/**
 * Get competence tier for display styling
 * Returns tier letter and color class
 */
export function getCompetenceTier(pointCost: number): {
  tier: string
  colorClass: string
} {
  if (pointCost >= 18) {
    return { tier: 'S', colorClass: 'text-red-600' }
  } else if (pointCost >= 15) {
    return { tier: 'A', colorClass: 'text-orange-600' }
  } else if (pointCost >= 12) {
    return { tier: 'B', colorClass: 'text-amber-600' }
  } else if (pointCost >= 10) {
    return { tier: 'C', colorClass: 'text-yellow-600' }
  } else if (pointCost >= 8) {
    return { tier: 'D', colorClass: 'text-blue-600' }
  } else {
    return { tier: 'E', colorClass: 'text-gray-600' }
  }
}
