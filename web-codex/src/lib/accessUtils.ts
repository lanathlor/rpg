import type { Spell, SpellLevel, Weapon, Armor, Skill, Consumable, CharacterClass, AffinityStats } from '@/types'

// Define access result interface
export interface AccessResult {
  hasAccess: boolean
  reason?: string
  requirements?: string[]
  current?: string[]
}

// Helper function to normalize school/type names by removing accents
function normalizeAffinityName(name: string | undefined): string {
  if (!name) {
    return ''
  }
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
}

// Helper function to parse requirement strings like "A.École[feu]: 3"
function parseRequirement(requirement: string): { type: 'school' | 'type' | 'mixed', value: number, school?: string, typeKey?: string } | null {
  // Handle school requirements: "A.École[feu]: 3"
  const schoolMatch = requirement.match(/A\.École\[([^\]]+)\]:\s*(\d+)/)
  if (schoolMatch) {
    return {
      type: 'school',
      school: schoolMatch[1],
      value: parseInt(schoolMatch[2])
    }
  }

  // Handle type requirements: "A.Type[destruction]: 3"
  const typeMatch = requirement.match(/A\.Type\[([^\]]+)\]:\s*(\d+)/)
  if (typeMatch) {
    return {
      type: 'type',
      typeKey: typeMatch[1],
      value: parseInt(typeMatch[2])
    }
  }

  // Handle mixed requirements: "A.École[feu] + A.Type[destruction]: 5"
  const mixedMatch = requirement.match(/A\.École\[([^\]]+)\]\s*\+\s*A\.Type\[([^\]]+)\]:\s*(\d+)/)
  if (mixedMatch) {
    return {
      type: 'mixed',
      school: mixedMatch[1],
      typeKey: mixedMatch[2],
      value: parseInt(mixedMatch[3])
    }
  }

  return null
}

// Check if character can access a specific spell level
export function checkSpellAccess(spellLevel: SpellLevel, characterAffinities: AffinityStats): AccessResult {
  const { prerequisites } = spellLevel

  if (!prerequisites?.affinities) {
    return { hasAccess: true }
  }

  const { école_requirement, type_requirement, mixed_requirement } = prerequisites.affinities

  const schoolReq = école_requirement ? parseRequirement(école_requirement) : null
  const typeReq = type_requirement ? parseRequirement(type_requirement) : null
  const mixedReq = mixed_requirement ? parseRequirement(mixed_requirement) : null

  const requirements: string[] = []
  const current: string[] = []
  let schoolMet = false
  let typeMet = false
  let mixedMet = false
  let hasSchoolReq = false
  let hasTypeReq = false
  let hasMixedReq = false

  // Check school requirement
  if (schoolReq && schoolReq.school) {
    hasSchoolReq = true
    const normalizedSchoolName = normalizeAffinityName(schoolReq.school)
    const schoolValue = characterAffinities.schools?.[normalizedSchoolName as keyof typeof characterAffinities.schools] || 0
    current.push(`École ${schoolReq.school}: ${schoolValue}`)

    if (schoolValue >= schoolReq.value) {
      schoolMet = true
    }
  }

  // Check type requirement
  if (typeReq && typeReq.typeKey) {
    hasTypeReq = true
    const normalizedTypeName = normalizeAffinityName(typeReq.typeKey)
    const typeValue = characterAffinities.types?.[normalizedTypeName as keyof typeof characterAffinities.types] || 0
    current.push(`Type ${typeReq.typeKey}: ${typeValue}`)

    if (typeValue >= typeReq.value) {
      typeMet = true
    }
  }

  // Check mixed requirement
  if (mixedReq && mixedReq.school && mixedReq.typeKey) {
    hasMixedReq = true
    const normalizedSchoolName = normalizeAffinityName(mixedReq.school)
    const normalizedTypeName = normalizeAffinityName(mixedReq.typeKey)
    const schoolValue = characterAffinities.schools?.[normalizedSchoolName as keyof typeof characterAffinities.schools] || 0
    const typeValue = characterAffinities.types?.[normalizedTypeName as keyof typeof characterAffinities.types] || 0
    const combinedValue = schoolValue + typeValue

    current.push(`${mixedReq.school} (${schoolValue}) + ${mixedReq.typeKey} (${typeValue}) = ${combinedValue}`)

    if (combinedValue >= mixedReq.value) {
      mixedMet = true
    }
  }

  // Determine access based on (École AND Type) OR Mixte logic from the rulebook
  // A spell is accessible if the character meets:
  // - BOTH school AND type requirements
  // - OR the mixed requirement (with 1.5x penalty for specialization)
  let hasAccess = false

  if (hasSchoolReq && hasTypeReq) {
    // Must meet BOTH individual requirements, OR the mixed requirement
    const bothMet = schoolMet && typeMet
    hasAccess = bothMet || (hasMixedReq && mixedMet)

    // If no explicit mixed requirement, calculate implicit mixed with penalty
    if (!hasMixedReq && schoolReq && typeReq) {
      const schoolValue = characterAffinities.schools?.[normalizeAffinityName(schoolReq.school) as keyof typeof characterAffinities.schools] || 0
      const typeValue = characterAffinities.types?.[normalizeAffinityName(typeReq.typeKey) as keyof typeof characterAffinities.types] || 0
      const combinedValue = schoolValue + typeValue
      const implicitMixedReq = Math.ceil((schoolReq.value + typeReq.value) * 1.5)
      const implicitMixedMet = combinedValue >= implicitMixedReq
      hasAccess = bothMet || implicitMixedMet
    }

    // Build requirements string for (École AND Type) OR Mixte logic
    if (schoolReq && typeReq) {
      const individualReqs = `(École ${schoolReq.school} ≥ ${schoolReq.value} ET Type ${typeReq.typeKey} ≥ ${typeReq.value})`
      if (hasMixedReq && mixedReq) {
        requirements.push(`${individualReqs} OU (${mixedReq.school} + ${mixedReq.typeKey} ≥ ${mixedReq.value})`)
      } else {
        // If no explicit mixed requirement, calculate it with 1.5x penalty
        const calculatedMixed = Math.ceil((schoolReq.value + typeReq.value) * 1.5)
        requirements.push(`${individualReqs} OU (École + Type ≥ ${calculatedMixed})`)
      }
    }
  } else {
    // Only one individual requirement exists - use OR logic
    hasAccess = schoolMet || typeMet || (hasMixedReq && mixedMet)

    // Build requirements string for OR logic
    if (schoolReq && schoolReq.school) {
      requirements.push(`École ${schoolReq.school} ≥ ${schoolReq.value}`)
    }
    if (typeReq && typeReq.typeKey) {
      requirements.push(`Type ${typeReq.typeKey} ≥ ${typeReq.value}`)
    }
    if (hasMixedReq && mixedReq && mixedReq.school && mixedReq.typeKey) {
      requirements.push(`${mixedReq.school} + ${mixedReq.typeKey} ≥ ${mixedReq.value}`)
    }
  }

  // Check intelligence requirement if present
  if (spellLevel.conditions?.intelligence_required) {
    // Note: We don't have character stats here, so we'll handle this in the component
    // For now, we'll assume intelligence is accessible
  }

  if (!hasAccess) {
    const reason = hasSchoolReq && hasTypeReq
      ? `Requires: ${requirements.join('')}`
      : `Requires: ${requirements.join(' OU ')}`
    return {
      hasAccess: false,
      reason,
      requirements,
      current
    }
  }

  return { hasAccess: true }
}

// Check if character can access a spell (checks all levels and returns access to any level)
export function checkSpellSeriesAccess(spell: Spell, characterAffinities: AffinityStats): AccessResult {
  // Check if spell is player-castable (defaults to true if not specified)
  if (spell.player_castable === false) {
    return {
      hasAccess: false,
      requirements: ['Ce sort ne peut pas être lancé directement par un joueur']
    }
  }

  // Check if character can access any level of the spell
  if (spell.levels) {
    for (const level of spell.levels) {
      const access = checkSpellAccess(level, characterAffinities)
      if (access.hasAccess) {
        return { hasAccess: true }
      }
    }

    // If no level is accessible, return the access result for the first level
    // as it usually has the lowest requirements
    return checkSpellAccess(spell.levels[0], characterAffinities)
  }

  return { hasAccess: false, requirements: ['No spell levels available'] }
}

// Check weapon access based on affinity requirements
export function checkWeaponAccess(weapon: Weapon, character: CharacterClass): AccessResult {
  const { prerequisites } = weapon

  if (!prerequisites?.affinity) {
    return { hasAccess: true }
  }

  // Parse affinity requirement like "A. dist 1" or "A. CAC 1"
  const affinityReq = prerequisites.affinity

  // Handle distance requirement: "A. dist 1" -> character needs distance affinity ≥ 1
  const distanceMatch = affinityReq.match(/A\.\s*dist\s+(\d+)/)
  if (distanceMatch) {
    const requiredLevel = parseInt(distanceMatch[1])
    const currentLevel = character.affinities.distance || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Distance affinity ≥ ${requiredLevel}`,
      requirements: [`Distance affinity ≥ ${requiredLevel}`],
      current: [`Distance affinity: ${currentLevel}`]
    }
  }

  // Handle melee requirement: "A. CAC 1" -> character needs melee affinity ≥ 1
  const meleeMatch = affinityReq.match(/A\.\s*CAC\s+(\d+)/)
  if (meleeMatch) {
    const requiredLevel = parseInt(meleeMatch[1])
    const currentLevel = character.affinities.melee || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Melee affinity ≥ ${requiredLevel}`,
      requirements: [`Melee affinity ≥ ${requiredLevel}`],
      current: [`Melee affinity: ${currentLevel}`]
    }
  }

  // Handle special weapon affinities: "A. fusil à pompe 2", "A. sniper 1", etc.
  const specialWeaponMatch = affinityReq.match(/A\.\s*(.+?)\s+(\d+)/)
  if (specialWeaponMatch) {
    const weaponType = specialWeaponMatch[1].trim()
    const requiredLevel = parseInt(specialWeaponMatch[2])

    // Normalize weapon type name for lookup (e.g., "fusil à pompe" -> "fusil_a_pompe")
    const normalizedType = weaponType
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/\s+/g, '_')
      .replace(/'/g, '')

    const currentLevel = (character.affinities as any)[normalizedType] || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires ${weaponType} affinity ≥ ${requiredLevel}`,
      requirements: [`${weaponType} affinity ≥ ${requiredLevel}`],
      current: [`${weaponType} affinity: ${currentLevel}`]
    }
  }

  // If we can't parse the requirement, deny access (safer default)
  return {
    hasAccess: false,
    reason: `Unknown affinity requirement: ${affinityReq}`,
    requirements: [affinityReq]
  }
}

// Check armor access based on stat requirements
export function checkArmorAccess(armor: Armor, character: CharacterClass): AccessResult {
  const { prerequisites } = armor

  // If no prerequisites at all, allow access
  if (!prerequisites) {
    return { hasAccess: true }
  }

  // Check equipment prerequisite (e.g., "Implant neural militaire")
  if (prerequisites.equipment) {
    const requiredEquipment = prerequisites.equipment
    // Check if character has the required equipment
    const hasEquipment = character.equipment?.armor?.includes(requiredEquipment) ||
                        character.equipment?.weapons?.includes(requiredEquipment)

    if (!hasEquipment) {
      return {
        hasAccess: false,
        reason: `Requires equipment: ${requiredEquipment}`,
        requirements: [`Equipment: ${requiredEquipment}`]
      }
    }
  }

  // Check equipment subcategory prerequisite (e.g., "implant neural")
  // This allows any equipment of a certain subcategory (more flexible than exact name match)
  if ((prerequisites as any).equipment_subcategory) {
    const requiredSubcategory = (prerequisites as any).equipment_subcategory
    // For now, we'll do a simple name-based check
    // A proper implementation would require loading equipment data to check actual subcategories
    // As a workaround, check if any equipment name contains the subcategory
    const allEquipment = [
      ...(character.equipment?.armor || []),
      ...(character.equipment?.weapons || [])
    ]

    const hasEquipmentWithSubcategory = allEquipment.some(equipName =>
      equipName.toLowerCase().includes(requiredSubcategory.toLowerCase()) ||
      // Handle specific subcategory mappings
      (requiredSubcategory.toLowerCase() === 'implant neural' &&
       equipName.toLowerCase().includes('implant neural'))
    )

    if (!hasEquipmentWithSubcategory) {
      return {
        hasAccess: false,
        reason: `Requires equipment with subcategory: ${requiredSubcategory}`,
        requirements: [`Equipment subcategory: ${requiredSubcategory}`]
      }
    }
  }

  // Check skill prerequisites (new structured format)
  if (prerequisites.skill_any_of) {
    // Character must have at least one of the listed skills
    const hasRequiredSkill = prerequisites.skill_any_of.some(skillName =>
      character.skills?.includes(skillName)
    )

    if (!hasRequiredSkill) {
      return {
        hasAccess: false,
        reason: `Requires one of: ${prerequisites.skill_any_of.join(' or ')}`,
        requirements: [`Skill: ${prerequisites.skill_any_of.join(' or ')}`]
      }
    }
  }

  if (prerequisites.skill_all_of) {
    // Character must have all of the listed skills
    const hasAllSkills = prerequisites.skill_all_of.every(skillName =>
      character.skills?.includes(skillName)
    )

    if (!hasAllSkills) {
      return {
        hasAccess: false,
        reason: `Requires all of: ${prerequisites.skill_all_of.join(' and ')}`,
        requirements: [`Skills: ${prerequisites.skill_all_of.join(' and ')}`]
      }
    }
  }

  // Legacy skill prerequisite format (e.g., "Compétence Hackeur ou Ingénieur")
  if (prerequisites.skill) {
    const requiredSkill = prerequisites.skill

    // Parse skills separated by "ou" (or)
    const skillOptions = requiredSkill
      .replace(/Compétence\s+/gi, '')
      .split(/\s+ou\s+/i)
      .map(s => s.trim())

    const hasRequiredSkill = skillOptions.some(skillName =>
      character.skills?.includes(skillName)
    )

    if (!hasRequiredSkill) {
      return {
        hasAccess: false,
        reason: `Requires skill: ${requiredSkill}`,
        requirements: [requiredSkill]
      }
    }
  }

  // If no stat requirement, allow access
  if (!prerequisites.stat) {
    return { hasAccess: true }
  }

  // Parse stat requirement like "FOR 12"
  const statReq = prerequisites.stat

  // Handle Force requirement: "FOR 12" -> character needs Force ≥ 12
  const forceMatch = statReq.match(/FOR\s+(\d+)/)
  if (forceMatch) {
    const requiredLevel = parseInt(forceMatch[1])
    const currentLevel = character.stats.force || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Force ≥ ${requiredLevel}`,
      requirements: [`Force ≥ ${requiredLevel}`],
      current: [`Force: ${currentLevel}`]
    }
  }

  // Handle Dexterity requirement: "DEX 12" -> character needs Dexterity ≥ 12
  const dexMatch = statReq.match(/DEX\s+(\d+)/)
  if (dexMatch) {
    const requiredLevel = parseInt(dexMatch[1])
    const currentLevel = character.stats.dexterite || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Dexterity ≥ ${requiredLevel}`,
      requirements: [`Dexterity ≥ ${requiredLevel}`],
      current: [`Dexterity: ${currentLevel}`]
    }
  }

  // Handle Constitution requirement: "CON 12" -> character needs Constitution ≥ 12
  const conMatch = statReq.match(/CON\s+(\d+)/)
  if (conMatch) {
    const requiredLevel = parseInt(conMatch[1])
    const currentLevel = character.stats.constitution || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Constitution ≥ ${requiredLevel}`,
      requirements: [`Constitution ≥ ${requiredLevel}`],
      current: [`Constitution: ${currentLevel}`]
    }
  }

  // Handle Intelligence requirement: "INT 12" -> character needs Intelligence ≥ 12
  const intMatch = statReq.match(/INT\s+(\d+)/)
  if (intMatch) {
    const requiredLevel = parseInt(intMatch[1])
    const currentLevel = character.stats.intelligence || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Intelligence ≥ ${requiredLevel}`,
      requirements: [`Intelligence ≥ ${requiredLevel}`],
      current: [`Intelligence: ${currentLevel}`]
    }
  }

  // Handle Perception requirement: "PER 12" -> character needs Perception ≥ 12
  const perMatch = statReq.match(/PER\s+(\d+)/)
  if (perMatch) {
    const requiredLevel = parseInt(perMatch[1])
    const currentLevel = character.stats.perception || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Perception ≥ ${requiredLevel}`,
      requirements: [`Perception ≥ ${requiredLevel}`],
      current: [`Perception: ${currentLevel}`]
    }
  }

  // Handle Precision requirement: "PRE 12" -> character needs Precision ≥ 12
  const preMatch = statReq.match(/PRE\s+(\d+)/)
  if (preMatch) {
    const requiredLevel = parseInt(preMatch[1])
    const currentLevel = character.stats.precision || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Precision ≥ ${requiredLevel}`,
      requirements: [`Precision ≥ ${requiredLevel}`],
      current: [`Precision: ${currentLevel}`]
    }
  }

  // Handle Charisma requirement: "CHA 12" -> character needs Charisma ≥ 12
  const chaMatch = statReq.match(/CHA\s+(\d+)/)
  if (chaMatch) {
    const requiredLevel = parseInt(chaMatch[1])
    const currentLevel = character.stats.charisme || 0

    if (currentLevel >= requiredLevel) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Charisma ≥ ${requiredLevel}`,
      requirements: [`Charisma ≥ ${requiredLevel}`],
      current: [`Charisma: ${currentLevel}`]
    }
  }

  // Handle Health requirement with comparison operators: "health <= 35", "health >= 40", etc.
  const healthMatch = statReq.match(/health\s*([<>=]+)\s*(\d+)/)
  if (healthMatch) {
    const operator = healthMatch[1]
    const requiredLevel = parseInt(healthMatch[2])
    const currentLevel = character.base_stats?.health || 0

    let meetsRequirement = false
    let operatorText = ''

    switch (operator) {
      case '<=':
        meetsRequirement = currentLevel <= requiredLevel
        operatorText = '≤'
        break
      case '>=':
        meetsRequirement = currentLevel >= requiredLevel
        operatorText = '≥'
        break
      case '<':
        meetsRequirement = currentLevel < requiredLevel
        operatorText = '<'
        break
      case '>':
        meetsRequirement = currentLevel > requiredLevel
        operatorText = '>'
        break
      case '==':
      case '=':
        meetsRequirement = currentLevel === requiredLevel
        operatorText = '='
        break
      default:
        meetsRequirement = false
    }

    if (meetsRequirement) {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: `Requires Health ${operatorText} ${requiredLevel}`,
      requirements: [`Health ${operatorText} ${requiredLevel}`],
      current: [`Health: ${currentLevel}`]
    }
  }

  // If we can't parse the requirement, deny access (safer default)
  return {
    hasAccess: false,
    reason: `Unknown stat requirement: ${statReq}`,
    requirements: [statReq]
  }
}

// Check skill access (placeholder - may depend on stats or prerequisites)
export function checkSkillAccess(_skill: Skill, _character: CharacterClass): AccessResult {
  // For now, assume all skills are accessible
  // This can be expanded based on stat requirements or other rules
  return { hasAccess: true }
}

// Check consumable access (placeholder)
export function checkConsumableAccess(_consumable: Consumable, _character: CharacterClass): AccessResult {
  // For now, assume all consumables are accessible
  return { hasAccess: true }
}

// Generate a human-readable access description
export function getAccessDescription(accessResult: AccessResult): string {
  if (accessResult.hasAccess) {
    return "✓ Accessible"
  }

  if (accessResult.reason) {
    return `✗ ${accessResult.reason}`
  }

  return "✗ Restricted"
}

// Get detailed access information for tooltips/modals
export function getDetailedAccessInfo(accessResult: AccessResult): string {
  if (accessResult.hasAccess) {
    return "You meet all requirements to use this item."
  }

  if (!accessResult.requirements || !accessResult.current) {
    return "You don't meet the requirements to use this item."
  }

  let info = "Requirements not met:\n\n"

  for (let i = 0; i < accessResult.requirements.length; i++) {
    info += `• Need: ${accessResult.requirements[i]}\n`
    if (accessResult.current[i]) {
      info += `  You have: ${accessResult.current[i]}\n\n`
    }
  }

  return info.trim()
}

// Wrapper functions for simpler boolean checks in components
export function hasAccessToSpell(spell: Spell, affinities: AffinityStats): boolean {
  return checkSpellSeriesAccess(spell, affinities).hasAccess
}

export function hasAccessToWeapon(weapon: Weapon, affinities: AffinityStats, stats: any): boolean {
  // Create a minimal character object for the check
  const character: CharacterClass = {
    affinities,
    stats,
    base_stats: { health: 0, speed: 0 },
    equipment: {},
    skills: [],
    gameplay_guide: '',
  }
  return checkWeaponAccess(weapon, character).hasAccess
}

export function hasAccessToArmor(armor: Armor, affinities: AffinityStats, stats: any): boolean {
  // Create a minimal character object for the check
  const character: CharacterClass = {
    affinities,
    stats,
    base_stats: { health: 0, speed: 0 },
    equipment: {},
    skills: [],
    gameplay_guide: '',
  }
  return checkArmorAccess(armor, character).hasAccess
}