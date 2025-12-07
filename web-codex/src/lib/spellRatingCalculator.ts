import type { Spell, SpellLevel } from '@/types/spells'

/**
 * Spell Rating Calculator
 *
 * Calculates three key metrics for spells:
 * 1. Raw Power Score - effectiveness without considering affinity cost
 * 2. Accessibility Score - ease of unlocking based on affinity requirements
 * 3. Value Rating - power per affinity point (efficiency)
 *
 * See /rpg/spell_rating_system.md for complete documentation
 */

// ============================================================================
// UTILITY: Dice Parsing
// ============================================================================

interface DiceNotation {
  count: number
  sides: number
  bonus: number
}

/**
 * Parse dice notation string like "2d6+3", "1d8", "+3d6+6"
 * Returns null if string doesn't contain dice notation
 */
export function parseDiceNotation(damageString: string): DiceNotation | null {
  // Match patterns like: 2d6+3, 1d8, 3d6+6, d6, d12+4
  const match = damageString.match(/(\d+)?d(\d+)([+\-]\d+)?/)

  if (!match) return null

  return {
    count: match[1] ? parseInt(match[1], 10) : 1,
    sides: parseInt(match[2], 10),
    bonus: match[3] ? parseInt(match[3], 10) : 0
  }
}

/**
 * Calculate average damage from dice notation
 */
export function calculateAverageDamage(dice: DiceNotation): number {
  return dice.count * (dice.sides + 1) / 2 + dice.bonus
}

/**
 * Extract total average damage from damage string
 * Handles multiple dice in one string (e.g., "2d6+3 et 1d4 dans zone")
 */
export function extractTotalDamage(damageString: string): number {
  let total = 0

  // Find all dice notations in the string
  const diceMatches = damageString.matchAll(/(\d+)?d(\d+)([+\-]\d+)?/g)

  for (const match of diceMatches) {
    const count = match[1] ? parseInt(match[1], 10) : 1
    const sides = parseInt(match[2], 10)
    const bonus = match[3] ? parseInt(match[3], 10) : 0

    total += calculateAverageDamage({ count, sides, bonus })
  }

  return total
}

// ============================================================================
// UTILITY: Time Parsing
// ============================================================================

/**
 * Parse time string like "30 sec", "60 sec", "instantané"
 * Returns seconds, 0 for instant
 */
export function parseRechargeTime(timeString?: string): number {
  if (!timeString || timeString === 'instantané' || timeString === 'aucune') {
    return 0
  }

  const match = timeString.match(/(\d+)\s*sec/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Parse duration string like "1d4 tours", "3 tours", "1 tour"
 * Returns average number of turns
 */
export function parseDuration(durationString?: string): number {
  if (!durationString) return 0

  // Variable duration like "1d4 tours"
  const diceMatch = durationString.match(/(\d+)?d(\d+)/)
  if (diceMatch) {
    const count = diceMatch[1] ? parseInt(diceMatch[1], 10) : 1
    const sides = parseInt(diceMatch[2], 10)
    return count * (sides + 1) / 2
  }

  // Fixed duration like "3 tours" or "1 tour"
  const fixedMatch = durationString.match(/(\d+)\s*tour/)
  if (fixedMatch) {
    return parseInt(fixedMatch[1], 10)
  }

  return 0
}

// ============================================================================
// AOE Detection
// ============================================================================

/**
 * Detect area of effect and return multiplier
 */
export function getAOEMultiplier(spellLevel: SpellLevel): number {
  const effects = spellLevel.effects

  if (!effects) return 1.0

  // Check for explicit area damage
  if (effects.area_damage) {
    // Extract radius if present
    const radiusMatch = effects.area_damage.match(/(\d+)\s*m/)
    if (radiusMatch) {
      const radius = parseInt(radiusMatch[1], 10)
      if (radius >= 6) return 2.5      // Large AOE
      if (radius >= 4) return 2.0      // Medium AOE
      return 1.5                       // Small AOE
    }
    return 1.5 // Default small AOE if radius not specified
  }

  // Check for zone mention in special or damage fields
  const specialStr = typeof effects.special === 'string' ? effects.special : ''
  const damageStr = effects.damage || ''

  if (specialStr.toLowerCase().includes('zone') ||
      specialStr.toLowerCase().includes('rayon') ||
      damageStr.toLowerCase().includes('rayon')) {
    return 1.5
  }

  return 1.0
}

// ============================================================================
// UTILITY BONUS CALCULATION
// ============================================================================

/**
 * Calculate utility bonus based on spell effects
 */
export function calculateUtilityBonus(spellLevel: SpellLevel): number {
  let bonus = 0
  const effects = spellLevel.effects

  if (!effects) return 0

  const effectsStr = JSON.stringify(effects).toLowerCase()

  // Buffs
  if (effectsStr.includes('+1d4')) bonus += 12        // Significant stat buff
  if (effectsStr.includes('+1d6')) bonus += 15        // Strong stat buff
  if (effectsStr.includes('+1') && !effectsStr.includes('+1d')) bonus += 8  // Minor buff

  // Debuffs
  if (effectsStr.includes('-2')) bonus += 10          // Moderate debuff
  if (effectsStr.includes('-1')) bonus += 6           // Minor debuff
  if (effectsStr.includes('-3') || effectsStr.includes('-4')) bonus += 15  // Strong debuff

  // Movement
  if (effectsStr.includes('téléport') || effectsStr.includes('teleport')) bonus += 18
  if (effectsStr.includes('vitesse') || effectsStr.includes('déplacement')) bonus += 15

  // Stealth/Vision
  if (effectsStr.includes('camouflag') || effectsStr.includes('invisib')) bonus += 25
  if (effectsStr.includes('détection') || effectsStr.includes('révél')) bonus += 15

  // Control
  if (effectsStr.includes('stun') || effectsStr.includes('étourdi')) bonus += 20
  if (effectsStr.includes('désactive') || effectsStr.includes('disable')) bonus += 20
  if (effectsStr.includes('brouillage') || effectsStr.includes('jam')) bonus += 15

  // Healing
  if (effectsStr.includes('soin') || effectsStr.includes('heal')) {
    // Try to extract healing amount
    const healMatch = effectsStr.match(/(\d+)d(\d+)/)
    if (healMatch) {
      const avgHeal = parseInt(healMatch[1]) * (parseInt(healMatch[2]) + 1) / 2
      bonus += avgHeal
    } else {
      bonus += 10 // Default healing value
    }
  }

  return bonus
}

// ============================================================================
// RAW POWER SCORE
// ============================================================================

export interface PowerScoreBreakdown {
  damageEfficiency: number
  aoeMultiplier: number
  actionModifier: number
  durationBonus: number
  utilityBonus: number
  total: number
}

/**
 * Calculate raw power score for a spell level
 */
export function calculatePowerScore(spellLevel: SpellLevel): PowerScoreBreakdown {
  let damageEfficiency = 0
  let aoeMultiplier = 1.0
  let actionModifier = 1.0
  let durationBonus = 0
  let utilityBonus = 0

  const effects = spellLevel.effects
  const conditions = spellLevel.conditions

  // 1. Damage Efficiency
  if (effects?.damage) {
    const avgDamage = extractTotalDamage(effects.damage)

    if (conditions?.flux_cost) {
      // Flux-based spell
      damageEfficiency = (avgDamage / conditions.flux_cost) * 10
    } else if (spellLevel.recharge_time) {
      // Recharge-based spell
      const rechargeSec = parseRechargeTime(spellLevel.recharge_time)
      if (rechargeSec > 0) {
        damageEfficiency = (avgDamage / rechargeSec) * 60
      }
    }
  }

  // Include area damage if present
  if (effects?.area_damage) {
    const areaDamage = extractTotalDamage(effects.area_damage)
    if (conditions?.flux_cost) {
      damageEfficiency += (areaDamage / conditions.flux_cost) * 10 * 0.5 // Area damage worth 50% of main
    }
  }

  // 2. AOE Multiplier
  aoeMultiplier = getAOEMultiplier(spellLevel)

  // 3. Action Economy Modifier
  if (spellLevel.recharge_time) {
    const rechargeSec = parseRechargeTime(spellLevel.recharge_time)
    if (rechargeSec > 0) {
      actionModifier = Math.max(0.5, 1.0 - (rechargeSec / 300))
    }
  }

  // 4. Duration Bonus
  if (spellLevel.duration) {
    const durationStr = spellLevel.duration
    const turns = parseDuration(durationStr)
    durationBonus = turns * 8
  }

  // 5. Utility Bonus
  utilityBonus = calculateUtilityBonus(spellLevel)

  // Calculate total
  const baseDamage = damageEfficiency * aoeMultiplier
  const total = (baseDamage * actionModifier) + durationBonus + utilityBonus

  return {
    damageEfficiency,
    aoeMultiplier,
    actionModifier,
    durationBonus,
    utilityBonus,
    total: Math.round(total * 10) / 10 // Round to 1 decimal
  }
}

// ============================================================================
// ACCESSIBILITY SCORE
// ============================================================================

/**
 * Calculate best affinity path (lowest cost to unlock spell)
 */
export function calculateBestAffinityPath(spellLevel: SpellLevel): number {
  const affinities = spellLevel.prerequisites?.affinities

  if (!affinities) return 0

  // Extract numeric values from requirement strings
  const extractValue = (req?: string): number => {
    if (!req) return 999 // Very high if missing
    const match = req.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 999
  }

  const ecoleReq = extractValue(affinities.école_requirement)
  const typeReq = extractValue(affinities.type_requirement)
  const mixedReq = extractValue(affinities.mixed_requirement)

  // Best path = minimum of the three options
  // Mixed requirement is divided by 1.5 because it requires points in both
  return Math.min(ecoleReq, typeReq, mixedReq / 1.5)
}

/**
 * Calculate accessibility score (0-100, higher = more accessible)
 */
export function calculateAccessibilityScore(spellLevel: SpellLevel): number {
  const bestPath = calculateBestAffinityPath(spellLevel)

  if (bestPath === 0 || bestPath >= 999) return 0

  const score = 100 / (1 + bestPath)
  return Math.round(score * 10) / 10 // Round to 1 decimal
}

// ============================================================================
// VALUE RATING
// ============================================================================

/**
 * Calculate value rating (power per affinity point)
 */
export function calculateValueRating(spellLevel: SpellLevel): number {
  const powerScore = calculatePowerScore(spellLevel).total
  const bestPath = calculateBestAffinityPath(spellLevel)

  if (bestPath === 0 || bestPath >= 999) return 0

  const value = powerScore / bestPath
  return Math.round(value * 10) / 10 // Round to 1 decimal
}

// ============================================================================
// COMPLETE RATING
// ============================================================================

export interface SpellRating {
  powerScore: number
  powerBreakdown: PowerScoreBreakdown
  accessibilityScore: number
  bestAffinityPath: number
  valueRating: number
  tier: SpellTier
}

export interface SpellTier {
  name: string
  description: string
  colorClass: string
}

/**
 * Determine spell tier based on power, accessibility, and value
 */
export function getSpellTier(
  accessibilityScore: number,
  valueRating: number,
  powerScore: number
): SpellTier {
  // Special case: No affinity requirements (status effects, passive abilities)
  if (accessibilityScore === 0) {
    return {
      name: 'Passive',
      description: 'Effet déclenché',
      colorClass: 'text-gray-600 dark:text-gray-400'
    }
  }

  // Ultimate: High power AND hard to unlock (true endgame spells)
  if (powerScore >= 50 && accessibilityScore < 14) {
    return {
      name: 'Ultimate',
      description: 'Puissance légendaire',
      colorClass: 'text-purple-600 dark:text-purple-400'
    }
  }

  // Signature: High accessibility AND good value (defines archetype)
  if (accessibilityScore >= 20 && valueRating >= 5) {
    return {
      name: 'Signature',
      description: 'Définit l\'archétype',
      colorClass: 'text-blue-600 dark:text-blue-400'
    }
  }

  // Standard: High accessibility but low value (easy to get but inefficient)
  if (accessibilityScore >= 20) {
    return {
      name: 'Standard',
      description: 'Accessible mais inefficace',
      colorClass: 'text-green-600 dark:text-green-400'
    }
  }

  // Niche: Medium accessibility OR decent power with low accessibility
  if (accessibilityScore >= 14 || (powerScore >= 30 && accessibilityScore >= 10)) {
    return {
      name: 'Niche',
      description: 'Technique spécialisée',
      colorClass: 'text-amber-600 dark:text-amber-400'
    }
  }

  // Weak: Low accessibility AND low power (poorly balanced)
  if (powerScore < 30) {
    return {
      name: 'Faible',
      description: 'Coût/efficacité faible',
      colorClass: 'text-red-600 dark:text-red-400'
    }
  }

  // Advanced: Moderate power, hard to get (stepping stone to ultimate)
  return {
    name: 'Avancé',
    description: 'Requiert maîtrise',
    colorClass: 'text-indigo-600 dark:text-indigo-400'
  }
}

/**
 * Calculate complete rating for a spell level
 */
export function rateSpell(spellLevel: SpellLevel): SpellRating {
  const powerBreakdown = calculatePowerScore(spellLevel)
  const accessibilityScore = calculateAccessibilityScore(spellLevel)
  const bestAffinityPath = calculateBestAffinityPath(spellLevel)
  const valueRating = calculateValueRating(spellLevel)
  const tier = getSpellTier(accessibilityScore, valueRating, powerBreakdown.total)

  return {
    powerScore: powerBreakdown.total,
    powerBreakdown,
    accessibilityScore,
    bestAffinityPath,
    valueRating,
    tier
  }
}

// ============================================================================
// BATCH RATING
// ============================================================================

export interface SpellWithRating {
  spell: Spell
  levelIndex: number
  level: SpellLevel
  rating: SpellRating
}

/**
 * Rate all levels of a spell
 */
export function rateAllSpellLevels(spell: Spell): SpellWithRating[] {
  if (!spell.levels) return []
  return spell.levels.map((level, index) => ({
    spell,
    levelIndex: index,
    level,
    rating: rateSpell(level)
  }))
}

/**
 * Rate all spells in an array
 */
export function rateAllSpells(spells: Spell[]): SpellWithRating[] {
  return spells.flatMap(spell => rateAllSpellLevels(spell))
}

// ============================================================================
// COMPARISON & ANALYSIS
// ============================================================================

/**
 * Find spells with unusual value ratings (outliers)
 * Returns spells that are significantly over/under-valued
 */
export function findOutliers(
  ratedSpells: SpellWithRating[],
  threshold: number = 2.0
): {
  overvalued: SpellWithRating[]  // High value, potentially undercosted
  undervalued: SpellWithRating[] // Low value, potentially overcosted
} {
  // Calculate mean and standard deviation
  const values = ratedSpells.map(s => s.rating.valueRating)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)

  return {
    overvalued: ratedSpells.filter(s =>
      s.rating.valueRating > mean + (threshold * stdDev)
    ),
    undervalued: ratedSpells.filter(s =>
      s.rating.valueRating > 0 && // Exclude 0-value utility spells
      s.rating.valueRating < mean - (threshold * stdDev)
    )
  }
}

/**
 * Compare two spell levels
 */
export function compareSpells(
  spell1: SpellLevel,
  spell2: SpellLevel
): {
  powerDiff: number
  accessibilityDiff: number
  valueDiff: number
  recommendation: string
} {
  const rating1 = rateSpell(spell1)
  const rating2 = rateSpell(spell2)

  const powerDiff = rating1.powerScore - rating2.powerScore
  const accessibilityDiff = rating1.accessibilityScore - rating2.accessibilityScore
  const valueDiff = rating1.valueRating - rating2.valueRating

  let recommendation = ''
  if (valueDiff > 5) {
    recommendation = 'Sort 1 est nettement plus efficace'
  } else if (valueDiff < -5) {
    recommendation = 'Sort 2 est nettement plus efficace'
  } else if (Math.abs(valueDiff) < 2) {
    recommendation = 'Sorts équilibrés'
  } else {
    recommendation = valueDiff > 0 ? 'Sort 1 légèrement meilleur' : 'Sort 2 légèrement meilleur'
  }

  return {
    powerDiff: Math.round(powerDiff * 10) / 10,
    accessibilityDiff: Math.round(accessibilityDiff * 10) / 10,
    valueDiff: Math.round(valueDiff * 10) / 10,
    recommendation
  }
}
