import type { Armor } from '@/types/armor'
import type { Weapon } from '@/types/weapons'

/**
 * Parse a bonus string like "+5" or "-2" into a number
 */
function parseBonus(bonusStr: string | undefined): number {
  if (!bonusStr) return 0
  const parsed = parseInt(bonusStr, 10)
  return isNaN(parsed) ? 0 : parsed
}

export interface StatBreakdownItem {
  source: string
  bonus: number
}

export interface StatCalculation {
  base: number
  equipment: number
  final: number
  breakdown: StatBreakdownItem[]
}

export type StatsCalculation = {
  [key in 'force' | 'dexterite' | 'constitution' | 'intelligence' | 'perception' | 'precision' | 'charisme']?: StatCalculation
}

export type ResistancesCalculation = {
  [key in 'RMEC' | 'RRAD' | 'RINT']?: StatCalculation
}

export interface FluxCalculation {
  reserve?: StatCalculation
  per_turn?: StatCalculation
  recovery?: StatCalculation
}

export type AffinitiesCalculation = {
  [key: string]: StatCalculation  // Dynamic affinity names
}

export interface BaseStatsCalculation {
  health?: StatCalculation
  speed?: StatCalculation
}

/**
 * Calculate final base stats (health, speed) for a character including equipment bonuses
 */
export function calculateFinalBaseStats(
  character: {
    base_stats: {
      health?: number
      speed?: number
    }
    equipment: {
      weapons?: string[]
      armor?: string[]
    }
  },
  allArmor: Armor[],
  allWeapons: Weapon[]
): BaseStatsCalculation {
  const result: BaseStatsCalculation = {}

  const equippedArmor = (character.equipment.armor || [])
    .map(name => allArmor.find(a => a.name === name))
    .filter((a): a is Armor => a !== undefined && a.base_stat_bonuses !== undefined)

  const equippedWeapons = (character.equipment.weapons || [])
    .map(name => allWeapons.find(w => w.name === name))
    .filter((w): w is Weapon => w !== undefined && w.base_stat_bonuses !== undefined)

  const baseStatFields = ['health', 'speed'] as const

  for (const field of baseStatFields) {
    const baseValue = character.base_stats[field] || 0
    const breakdown: StatBreakdownItem[] = []
    let equipmentBonus = 0

    for (const armor of equippedArmor) {
      const bonusStr = armor.base_stat_bonuses![field]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: armor.name || 'Armure',
          bonus
        })
      }
    }

    for (const weapon of equippedWeapons) {
      const bonusStr = weapon.base_stat_bonuses![field]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: weapon.name || 'Arme',
          bonus
        })
      }
    }

    if (equipmentBonus !== 0) {
      result[field] = {
        base: baseValue,
        equipment: equipmentBonus,
        final: baseValue + equipmentBonus,
        breakdown
      }
    }
  }

  return result
}

/**
 * Calculate final stats for a character including equipment bonuses
 * Only processes equipment that has structured bonuses
 */
export function calculateFinalStats(
  character: {
    stats: {
      force?: number
      dexterite?: number
      constitution?: number
      intelligence?: number
      perception?: number
      precision?: number
      charisme?: number
    }
    equipment: {
      weapons?: string[]
      armor?: string[]
    }
  },
  allArmor: Armor[],
  allWeapons: Weapon[]
): StatsCalculation {
  const result: StatsCalculation = {}

  // Get all equipped armor with bonuses
  const equippedArmor = (character.equipment.armor || [])
    .map(name => allArmor.find(a => a.name === name))
    .filter((a): a is Armor => a !== undefined && a.bonuses !== undefined)

  // Get all equipped weapons with bonuses
  const equippedWeapons = (character.equipment.weapons || [])
    .map(name => allWeapons.find(w => w.name === name))
    .filter((w): w is Weapon => w !== undefined && w.bonuses !== undefined)

  // Calculate for each stat
  const statNames = ['force', 'dexterite', 'constitution', 'intelligence', 'perception', 'precision', 'charisme'] as const

  for (const statName of statNames) {
    const baseValue = character.stats[statName] || 8
    const breakdown: StatBreakdownItem[] = []
    let equipmentBonus = 0

    // Add armor bonuses
    for (const armor of equippedArmor) {
      const bonusStr = armor.bonuses![statName]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: armor.name || 'Armure',
          bonus
        })
      }
    }

    // Add weapon bonuses
    for (const weapon of equippedWeapons) {
      const bonusStr = weapon.bonuses![statName]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: weapon.name || 'Arme',
          bonus
        })
      }
    }

    // Only add to result if there are bonuses (positive or negative)
    if (equipmentBonus !== 0) {
      result[statName] = {
        base: baseValue,
        equipment: equipmentBonus,
        final: baseValue + equipmentBonus,
        breakdown
      }
    }
  }

  return result
}

/**
 * Calculate final resistances for a character including equipment bonuses
 */
export function calculateFinalResistances(
  character: {
    innate_resistances?: {
      RMEC?: number
      RRAD?: number
      RINT?: number
    }
    equipment: {
      weapons?: string[]
      armor?: string[]
    }
  },
  allArmor: Armor[],
  allWeapons: Weapon[]
): ResistancesCalculation {
  const result: ResistancesCalculation = {}

  const equippedArmor = (character.equipment.armor || [])
    .map(name => allArmor.find(a => a.name === name))
    .filter((a): a is Armor => a !== undefined && a.resistance_bonuses !== undefined)

  const equippedWeapons = (character.equipment.weapons || [])
    .map(name => allWeapons.find(w => w.name === name))
    .filter((w): w is Weapon => w !== undefined && w.resistance_bonuses !== undefined)

  const resistanceNames = ['RMEC', 'RRAD', 'RINT'] as const

  for (const resistanceName of resistanceNames) {
    const baseValue = character.innate_resistances?.[resistanceName] || 0
    const breakdown: StatBreakdownItem[] = []
    let equipmentBonus = 0

    for (const armor of equippedArmor) {
      const bonusStr = armor.resistance_bonuses![resistanceName]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: armor.name || 'Armure',
          bonus
        })
      }
    }

    for (const weapon of equippedWeapons) {
      const bonusStr = weapon.resistance_bonuses![resistanceName]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: weapon.name || 'Arme',
          bonus
        })
      }
    }

    if (equipmentBonus !== 0 || baseValue > 0) {
      result[resistanceName] = {
        base: baseValue,
        equipment: equipmentBonus,
        final: baseValue + equipmentBonus,
        breakdown
      }
    }
  }

  return result
}

/**
 * Calculate final flux values for a character including equipment bonuses
 */
export function calculateFinalFlux(
  character: {
    flux_system?: {
      reserve?: number
      per_turn?: number
      recovery?: number
    }
    equipment: {
      weapons?: string[]
      armor?: string[]
    }
  },
  allArmor: Armor[],
  allWeapons: Weapon[]
): FluxCalculation {
  const result: FluxCalculation = {}

  const equippedArmor = (character.equipment.armor || [])
    .map(name => allArmor.find(a => a.name === name))
    .filter((a): a is Armor => a !== undefined && a.flux_bonuses !== undefined)

  const equippedWeapons = (character.equipment.weapons || [])
    .map(name => allWeapons.find(w => w.name === name))
    .filter((w): w is Weapon => w !== undefined && w.flux_bonuses !== undefined)

  const fluxFields = ['reserve', 'per_turn', 'recovery'] as const

  for (const field of fluxFields) {
    const baseValue = character.flux_system?.[field] || 0
    const breakdown: StatBreakdownItem[] = []
    let equipmentBonus = 0

    for (const armor of equippedArmor) {
      const bonusStr = armor.flux_bonuses![field]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: armor.name || 'Armure',
          bonus
        })
      }
    }

    for (const weapon of equippedWeapons) {
      const bonusStr = weapon.flux_bonuses![field]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: weapon.name || 'Arme',
          bonus
        })
      }
    }

    if (equipmentBonus !== 0) {
      result[field] = {
        base: baseValue,
        equipment: equipmentBonus,
        final: baseValue + equipmentBonus,
        breakdown
      }
    }
  }

  return result
}

/**
 * Calculate final affinities for a character including equipment bonuses
 */
export function calculateFinalAffinities(
  character: {
    affinities?: {
      distance?: number
      melee?: number
      sniper?: number
      arme_1_main?: number
      arme_2_mains?: number
      schools?: {
        [key: string]: number | undefined
      }
      types?: {
        [key: string]: number | undefined
      }
    }
    equipment: {
      weapons?: string[]
      armor?: string[]
    }
  },
  allArmor: Armor[],
  allWeapons: Weapon[]
): AffinitiesCalculation {
  const result: AffinitiesCalculation = {}

  const equippedArmor = (character.equipment.armor || [])
    .map(name => allArmor.find(a => a.name === name))
    .filter((a): a is Armor => a !== undefined && a.affinity_bonuses !== undefined)

  const equippedWeapons = (character.equipment.weapons || [])
    .map(name => allWeapons.find(w => w.name === name))
    .filter((w): w is Weapon => w !== undefined && w.affinity_bonuses !== undefined)

  // Collect all possible affinity names from character and equipment
  const affinityNames = new Set<string>()

  // Add character affinities
  if (character.affinities) {
    Object.keys(character.affinities).forEach(key => {
      if (key === 'schools' || key === 'types') {
        Object.keys(character.affinities![key] as Record<string, number>).forEach(name => affinityNames.add(name))
      } else {
        affinityNames.add(key)
      }
    })
  }

  // Add equipment affinity bonuses
  equippedArmor.forEach(armor => {
    if (armor.affinity_bonuses) {
      Object.keys(armor.affinity_bonuses).forEach(name => affinityNames.add(name))
    }
  })
  equippedWeapons.forEach(weapon => {
    if (weapon.affinity_bonuses) {
      Object.keys(weapon.affinity_bonuses).forEach(name => affinityNames.add(name))
    }
  })

  for (const affinityName of affinityNames) {
    // Get base value from character affinities
    let baseValue = 0
    if (character.affinities) {
      if (character.affinities[affinityName as keyof typeof character.affinities] !== undefined) {
        baseValue = character.affinities[affinityName as keyof typeof character.affinities] as number
      } else if (character.affinities.schools?.[affinityName]) {
        baseValue = character.affinities.schools[affinityName]
      } else if (character.affinities.types?.[affinityName]) {
        baseValue = character.affinities.types[affinityName]
      }
    }

    const breakdown: StatBreakdownItem[] = []
    let equipmentBonus = 0

    for (const armor of equippedArmor) {
      const bonusStr = armor.affinity_bonuses![affinityName]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: armor.name || 'Armure',
          bonus
        })
      }
    }

    for (const weapon of equippedWeapons) {
      const bonusStr = weapon.affinity_bonuses![affinityName]
      const bonus = parseBonus(bonusStr)
      if (bonus !== 0) {
        equipmentBonus += bonus
        breakdown.push({
          source: weapon.name || 'Arme',
          bonus
        })
      }
    }

    if (equipmentBonus !== 0) {
      result[affinityName] = {
        base: baseValue,
        equipment: equipmentBonus,
        final: baseValue + equipmentBonus,
        breakdown
      }
    }
  }

  return result
}
