import type { CharacterClass } from '@/types/classes'
import type { Weapon } from '@/types/weapons'
import type { Armor } from '@/types/armor'
import type { Skill } from '@/types/skills'
import type { Consumable } from '@/types/consumables'
import type { Spell } from '@/types/spells'
import type { AffinityStats } from '@/types/common'
import { checkSpellSeriesAccess, checkWeaponAccess, checkArmorAccess } from './accessUtils'

/**
 * Point Buy Calculator
 *
 * Calculates point buy costs for character classes based on:
 * - Base Stats (health: 1pt per 3 PV above 30, speed: 5pts per point above 3)
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
 * Calculate cost for health (PV)
 * Base 30 is free
 * 1 pt per 3 PV above baseline (rounded up)
 */
export function calculateHealthCost(health: number): number {
  const baseline = 30
  if (health <= baseline) return 0

  const above = health - baseline
  return Math.ceil(above / 3)
}

/**
 * Calculate cost for speed (vitesse)
 * Base 3 is free
 * 5 pts per speed point above baseline
 */
export function calculateSpeedCost(speed: number): number {
  const baseline = 3
  if (speed <= baseline) return 0

  const above = speed - baseline
  return above * 5
}

/**
 * Calculate total base stats cost (health + speed)
 */
export function calculateBaseStatsCost(baseStats: {
  health: number
  speed: number
}): number {
  return calculateHealthCost(baseStats.health) + calculateSpeedCost(baseStats.speed)
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
export function calculateAffinitiesCost(affinities: AffinityStats): number {
  let total = 0

  // Process combat affinities
  if (affinities.distance) {
    total += calculateAffinityCost('distance', affinities.distance)
  }
  if (affinities.melee) {
    total += calculateAffinityCost('melee', affinities.melee)
  }

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
    Object.entries(affinities.types).forEach(([_type, level]) => {
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
 * Calculate total credits spent on equipment
 */
export function calculateTotalCreditsSpent(
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

  return totalCredits
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
  const totalCredits = calculateTotalCreditsSpent(
    equipment,
    allWeapons,
    allArmor,
    allConsumables
  )

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
  baseStats: number
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
  const baseStats = calculateBaseStatsCost(characterClass.base_stats)
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
    baseStats,
    stats,
    affinities,
    flux,
    equipment,
    competences,
    total: baseStats + stats + affinities + flux + equipment + competences,
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

/**
 * Calculate total points for character (shorthand for calculateTotalPointBuy().total)
 */
export function calculateTotalPoints(
  character: any,
  allWeapons: Weapon[],
  allArmor: Armor[],
  allSkills: Skill[],
  allConsumables: Consumable[]
): number {
  const breakdown = calculateTotalPointBuy(character, allWeapons, allArmor, allSkills, allConsumables)
  return breakdown.total
}

/**
 * Check if character is legal (can use all equipped items/spells)
 * A character is illegal if they have items/spells with unmet prerequisites
 */
export function isCharacterLegal(
  character: any,
  allWeapons: Weapon[],
  allArmors: Armor[],
  _allSkills: Skill[],
  allConsumables: Consumable[],
  allSpells: Spell[]
): { isLegal: boolean; issues: string[] } {
  const issues: string[] = []

  // Check budget limit
  const creditsSpent = calculateTotalCreditsSpent(character.equipment, allWeapons, allArmors, allConsumables)
  const budget = character.starting_credits || 0
  if (creditsSpent > budget) {
    issues.push(`Budget dépassé: ${creditsSpent.toLocaleString()}/${budget.toLocaleString()} crédits`)
  }

  // Check spells (supports both legacy string[] and new SelectedSpell[] format)
  if (character.spells && Array.isArray(character.spells)) {
    character.spells.forEach((spellEntry: any) => {
      let spellName: string
      let spellLevel: string | undefined

      // Handle both legacy string format and new SelectedSpell format
      if (typeof spellEntry === 'string') {
        spellName = spellEntry
        spellLevel = undefined // Will check general series access
      } else if (spellEntry && typeof spellEntry === 'object' && 'series' in spellEntry) {
        spellName = spellEntry.series
        spellLevel = spellEntry.level
      } else {
        return // Skip invalid entries
      }

      const spell = allSpells.find(s => s.spell_series === spellName || s.name === spellName)
      if (spell) {
        if (spellLevel) {
          // Check access for specific level
          const level = spell.levels?.find(l => l.level === spellLevel)
          if (level) {
            // Create a spell object with just this level for validation
            const levelSpecificSpell = { ...spell, levels: [level] }
            const accessResult = checkSpellSeriesAccess(levelSpecificSpell, character.affinities)
            if (!accessResult.hasAccess) {
              issues.push(`Sort "${spellName}" (Niveau ${spellLevel}): prérequis non remplis`)
            }
          } else {
            issues.push(`Sort "${spellName}": niveau ${spellLevel} introuvable`)
          }
        } else {
          // Legacy: check general series access
          const accessResult = checkSpellSeriesAccess(spell, character.affinities)
          if (!accessResult.hasAccess) {
            issues.push(`Sort "${spellName}": prérequis non remplis`)
          }
        }
      }
    })
  }

  // Check weapons
  if (character.equipment?.weapons && Array.isArray(character.equipment.weapons)) {
    character.equipment.weapons.forEach((weaponName: string) => {
      const weapon = allWeapons.find(w => w.name === weaponName)
      if (weapon) {
        const accessResult = checkWeaponAccess(weapon, character)
        if (!accessResult.hasAccess) {
          issues.push(`Arme "${weaponName}": prérequis non remplis`)
        }
      }
    })
  }

  // Check armor
  if (character.equipment?.armor && Array.isArray(character.equipment.armor)) {
    character.equipment.armor.forEach((armorName: string) => {
      const armor = allArmors.find(a => a.name === armorName)
      if (armor) {
        const accessResult = checkArmorAccess(armor, character)
        if (!accessResult.hasAccess) {
          issues.push(`Armure "${armorName}": prérequis non remplis`)
        }
      }
    })
  }

  return {
    isLegal: issues.length === 0,
    issues
  }
}
