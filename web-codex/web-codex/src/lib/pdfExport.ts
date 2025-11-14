import jsPDF from 'jspdf'
import type { CharacterClass, Spell, Weapon, Armor, Skill, Consumable } from '@/types'
import { checkSpellSeriesAccess, checkSpellAccess, checkWeaponAccess, checkArmorAccess, checkSkillAccess, checkConsumableAccess } from './accessUtils'

// Interface for filtered character data ready for export
interface FilteredCharacterData {
  character: CharacterClass
  accessibleSpells: Array<{
    spell: Spell
    accessibleLevel: number
    levelData: any
  }>
  accessibleWeapons: Weapon[]
  accessibleArmor: Armor[]
  accessibleSkills: Skill[]
  accessibleConsumables: Consumable[]
}

// Filter all character content to only include accessible items
export function filterCharacterContent(
  character: CharacterClass,
  spells: Spell[],
  weapons: Weapon[],
  armors: Armor[],
  skills: Skill[],
  consumables: Consumable[]
): FilteredCharacterData {
  // Filter spells - only include accessible ones with their highest accessible level
  const accessibleSpells: Array<{
    spell: Spell
    accessibleLevel: number
    levelData: any
  }> = []

  character.spells?.forEach(spellName => {
    const spell = spells.find(s => s.spell_series === spellName || s.name === spellName)
    if (spell) {
      // Use the SAME logic as the UI: checkSpellSeriesAccess
      const seriesAccess = checkSpellSeriesAccess(spell, character.affinities)

      if (seriesAccess.hasAccess) {
        // Find the highest accessible level for this spell
        let highestAccessibleLevel = 0
        let levelData = null

        for (const level of spell.levels) {
          const affinityAccess = checkSpellAccess(level, character.affinities)

          // Also check intelligence requirement
          const intelligenceOk = !level.conditions?.intelligence_required ||
                               character.stats.intelligence >= level.conditions.intelligence_required

          if (affinityAccess.hasAccess && intelligenceOk && parseInt(level.level) > highestAccessibleLevel) {
            highestAccessibleLevel = parseInt(level.level)
            levelData = level
          }
        }

        // Only include if we found at least one accessible level
        if (highestAccessibleLevel > 0 && levelData) {
          accessibleSpells.push({
            spell,
            accessibleLevel: highestAccessibleLevel,
            levelData
          })
        }
      }
    }
  })

  // Filter weapons
  const accessibleWeapons: Weapon[] = []
  character.equipment.weapons?.forEach(weaponName => {
    const weapon = weapons.find(w => w.name === weaponName)
    if (weapon) {
      const access = checkWeaponAccess(weapon, character)
      if (access.hasAccess) {
        accessibleWeapons.push(weapon)
      }
    }
  })

  // Filter armor
  const accessibleArmor: Armor[] = []
  character.equipment.armor?.forEach(armorName => {
    const armor = armors.find(a => a.name === armorName)
    if (armor) {
      const access = checkArmorAccess(armor, character)
      if (access.hasAccess) {
        accessibleArmor.push(armor)
      }
    }
  })

  // Filter skills
  const accessibleSkills: Skill[] = []
  character.skills?.forEach(skillName => {
    const skill = skills.find(s => s.name === skillName)
    if (skill) {
      const access = checkSkillAccess(skill, character)
      if (access.hasAccess) {
        accessibleSkills.push(skill)
      }
    }
  })

  // Filter consumables
  const accessibleConsumables: Consumable[] = []
  character.equipment.consumables?.forEach(consumableItem => {
    const consumable = consumables.find(c => c.name === consumableItem.name)
    if (consumable) {
      const access = checkConsumableAccess(consumable, character)
      if (access.hasAccess) {
        accessibleConsumables.push(consumable)
      }
    }
  })

  return {
    character,
    accessibleSpells,
    accessibleWeapons,
    accessibleArmor,
    accessibleSkills,
    accessibleConsumables
  }
}

// Generate and download PDF character sheet
export function exportCharacterToPDF(filteredData: FilteredCharacterData): void {
  const { character } = filteredData

  // Create new PDF document (A4 portrait)
  const doc = new jsPDF('portrait', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - (margin * 2)

  let yPosition = margin

  // Helper function to add text with automatic line wrapping
  function addText(text: string, fontSize = 10, isBold = false, indent = 0): void {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')

    const lines = doc.splitTextToSize(text, contentWidth - indent)
    for (const line of lines) {
      if (yPosition > 280) { // Near bottom of page
        doc.addPage()
        yPosition = margin
      }
      doc.text(line, margin + indent, yPosition)
      yPosition += fontSize * 0.5 + 2
    }
    yPosition += 2 // Extra spacing after text blocks
  }

  // Helper function to add section header
  function addSectionHeader(title: string): void {
    yPosition += 5
    addText(title, 12, true)
    yPosition += 3
  }

  // Document title
  addText(character.name, 16, true)
  yPosition += 5

  // Character description
  if (character.description) {
    addText(character.description, 9)
    yPosition += 5
  }

  // Base Statistics
  addSectionHeader('STATISTIQUES DE BASE')
  addText(`Points de vie: ${character.base_stats.health} PV`, 10)
  addText(`Vitesse: ${character.base_stats.speed} m/tour`, 10)

  if (character.flux_system) {
    addText(`Flux - Réserve: ${character.flux_system.reserve} | Par tour: ${character.flux_system.per_turn} | Récupération: ${character.flux_system.recovery}`, 10)
  }

  // Character Stats
  addSectionHeader('CARACTÉRISTIQUES')
  const statNames = {
    force: 'Force',
    dexterite: 'Dextérité',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    perception: 'Perception',
    precision: 'Précision',
    charisme: 'Charisme'
  }

  Object.entries(character.stats).forEach(([key, value]) => {
    const statName = statNames[key as keyof typeof statNames] || key
    addText(`${statName}: ${value}`, 10, false, 5)
  })

  // Affinities
  addSectionHeader('AFFINITÉS QUANTOTECHNIQUES')
  if (character.affinities.distance !== undefined) {
    addText(`Distance: ${character.affinities.distance}`, 10, false, 5)
  }
  if (character.affinities.melee !== undefined) {
    addText(`Corps à corps: ${character.affinities.melee}`, 10, false, 5)
  }

  if (character.affinities.schools) {
    addText('Écoles:', 10, true, 5)
    Object.entries(character.affinities.schools).forEach(([school, level]) => {
      addText(`• ${school}: ${level}`, 9, false, 10)
    })
  }

  if (character.affinities.types) {
    addText('Types:', 10, true, 5)
    Object.entries(character.affinities.types).forEach(([type, level]) => {
      addText(`• ${type}: ${level}`, 9, false, 10)
    })
  }

  // Accessible Weapons
  if (filteredData.accessibleWeapons.length > 0) {
    addSectionHeader('ARMES')
    filteredData.accessibleWeapons.forEach(weapon => {
      addText(`${weapon.name}`, 10, true, 5)

      // Core combat stats
      if (weapon.stats.damage) addText(`Dégâts: ${weapon.stats.damage}`, 9, false, 10)
      if (weapon.stats.range) addText(`Portée: ${weapon.stats.range}`, 9, false, 10)
      if (weapon.stats.attack_type) addText(`Type d'attaque: ${weapon.stats.attack_type}`, 9, false, 10)
      if (weapon.stats.defense_type) addText(`Type de défense: ${weapon.stats.defense_type}`, 9, false, 10)
      if (weapon.stats.reload_time) addText(`Temps de rechargement: ${weapon.stats.reload_time}`, 9, false, 10)
      if (weapon.stats.ammunition) addText(`Munitions: ${weapon.stats.ammunition}`, 9, false, 10)
      if (weapon.stats.weight) addText(`Poids: ${weapon.stats.weight}`, 9, false, 10)

      // Requirements
      if (weapon.prerequisites?.affinities || weapon.prerequisites?.stats) {
        let reqText = 'Prérequis: '
        if (weapon.prerequisites.stats) {
          reqText += weapon.prerequisites.stats.join(', ')
        }
        if (weapon.prerequisites.affinities) {
          if (weapon.prerequisites.stats) reqText += ', '
          if (weapon.prerequisites.affinities.distance) reqText += `A.Dist ${weapon.prerequisites.affinities.distance}`
          if (weapon.prerequisites.affinities.melee) reqText += `A.CAC ${weapon.prerequisites.affinities.melee}`
        }
        addText(reqText, 9, false, 10)
      }

      if (weapon.description) addText(weapon.description, 9, false, 10)
      yPosition += 2
    })
  }

  // Accessible Armor
  if (filteredData.accessibleArmor.length > 0) {
    addSectionHeader('ARMURES')
    filteredData.accessibleArmor.forEach(armor => {
      addText(`${armor.name}`, 10, true, 5)

      // Core defensive stats
      if (armor.stats?.protection_bonus) addText(`Protection: ${armor.stats.protection_bonus}`, 9, false, 10)
      if (armor.stats?.defense_bonus) addText(`Défense: ${armor.stats.defense_bonus}`, 9, false, 10)
      if (armor.stats?.armor_value) addText(`Valeur d'armure: ${armor.stats.armor_value}`, 9, false, 10)

      // Special abilities and modifiers (critical for gameplay)
      if (armor.stats?.special_ability) addText(`Capacité spéciale: ${armor.stats.special_ability}`, 9, false, 10)
      if (armor.stats?.special_abilities && armor.stats.special_abilities.length > 0) {
        addText(`Capacités spéciales: ${armor.stats.special_abilities.join(', ')}`, 9, false, 10)
      }
      if (armor.stats?.special) addText(`Spécial: ${armor.stats.special}`, 9, false, 10)

      // Stat modifications
      if (armor.stats?.stat_modifier) addText(`Modificateur de stats: ${armor.stats.stat_modifier}`, 9, false, 10)
      if (armor.stats?.stat_bonus) addText(`Bonus de stats: ${armor.stats.stat_bonus}`, 9, false, 10)
      if (armor.stats?.hacking_bonus) addText(`Bonus de piratage: ${armor.stats.hacking_bonus}`, 9, false, 10)

      // Inventory and utility
      if (armor.stats?.inventory_bonus) addText(`Bonus inventaire: ${armor.stats.inventory_bonus}`, 9, false, 10)

      // Penalties (important for gameplay)
      if (armor.stats?.movement_penalty) addText(`Pénalité de mouvement: ${armor.stats.movement_penalty}`, 9, false, 10)
      if (armor.stats?.attack_penalty) addText(`Pénalité d'attaque: ${armor.stats.attack_penalty}`, 9, false, 10)

      // Drone-specific stats (for drone armors)
      if (armor.stats?.health) addText(`Points de vie: ${armor.stats.health}`, 9, false, 10)
      if (armor.stats?.speed) addText(`Vitesse: ${armor.stats.speed}`, 9, false, 10)
      if (armor.stats?.movement) addText(`Mouvement: ${armor.stats.movement}`, 9, false, 10)
      if (armor.stats?.spellcasting) addText(`Lancement de sorts: ${armor.stats.spellcasting}`, 9, false, 10)

      // Properties and resistances
      if (armor.properties && armor.properties.length > 0) {
        addText(`Propriétés: ${armor.properties.join(', ')}`, 9, false, 10)
      }
      if (armor.resistances && armor.resistances.length > 0) {
        addText(`Résistances: ${armor.resistances.join(', ')}`, 9, false, 10)
      }

      // Category and type information
      if (armor.category) addText(`Catégorie: ${armor.category}`, 9, false, 10)
      if (armor.subcategory) addText(`Sous-catégorie: ${armor.subcategory}`, 9, false, 10)
      if ((armor as any).type) addText(`Type: ${(armor as any).type}`, 9, false, 10)

      // Cost
      if (armor.cost) addText(`Coût: ${armor.cost}`, 9, false, 10)

      // Requirements
      if (armor.prerequisites?.stat) {
        addText(`Prérequis: ${armor.prerequisites.stat}`, 9, false, 10)
      }
      if (armor.prerequisites?.stats) {
        addText(`Prérequis: ${armor.prerequisites.stats.join(', ')}`, 9, false, 10)
      }
      if ((armor.prerequisites as any)?.skill) {
        addText(`Compétence requise: ${(armor.prerequisites as any).skill}`, 9, false, 10)
      }

      if (armor.description) addText(armor.description, 9, false, 10)
      yPosition += 2
    })
  }

  // Accessible Skills
  if (filteredData.accessibleSkills.length > 0) {
    addSectionHeader('COMPÉTENCES')
    filteredData.accessibleSkills.forEach(skill => {
      addText(`${skill.name}`, 10, true, 5)
      if (skill.description) addText(skill.description, 9, false, 10)
      yPosition += 2
    })
  }

  // Accessible Spells
  if (filteredData.accessibleSpells.length > 0) {
    addSectionHeader('SORTS')
    filteredData.accessibleSpells.forEach(({ spell, accessibleLevel, levelData }) => {
      addText(`${spell.spell_series} (Niveau ${accessibleLevel})`, 10, true, 5)
      addText(`École: ${spell.school} | Type: ${spell.type}`, 9, false, 10)

      // Core combat info first
      if (levelData.conditions?.flux_cost) {
        addText(`Coût de flux: ${levelData.conditions.flux_cost}`, 9, false, 10)
      }

      if (levelData.recharge_time) {
        addText(`Temps de recharge: ${levelData.recharge_time}`, 9, false, 10)
      }

      if (levelData.conditions?.intelligence_required) {
        addText(`Intelligence requise: ${levelData.conditions.intelligence_required}`, 9, false, 10)
      }

      if (levelData.duration) {
        addText(`Durée: ${levelData.duration}`, 9, false, 10)
      }

      if (levelData.range) {
        addText(`Portée: ${levelData.range}`, 9, false, 10)
      }

      // Effects - key gameplay information
      if (levelData.effects) {
        if (typeof levelData.effects === 'object') {
          Object.entries(levelData.effects).forEach(([key, value]) => {
            if (value && key !== 'usage') {
              // Format key names for better readability
              let formattedKey = key
              if (key === 'damage') formattedKey = 'Dégâts'
              else if (key === 'area_damage') formattedKey = 'Dégâts de zone'
              else if (key === 'damage_bonus') formattedKey = 'Bonus de dégâts'
              else if (key === 'special') formattedKey = 'Spécial'
              else if (key === 'status') formattedKey = 'Statut'
              else if (key === 'healing') formattedKey = 'Soins'
              else if (key === 'bonus') formattedKey = 'Bonus'

              addText(`${formattedKey}: ${value}`, 9, false, 10)
            }
          })
        }
      }

      // Special conditions
      if (levelData.conditions?.special && levelData.conditions.special !== 'aucune') {
        addText(`Conditions spéciales: ${levelData.conditions.special}`, 9, false, 10)
      }

      if (levelData.description) {
        addText(levelData.description, 9, false, 10)
      }

      yPosition += 3
    })
  }

  // Accessible Consumables
  if (filteredData.accessibleConsumables.length > 0) {
    addSectionHeader('CONSOMMABLES')
    filteredData.accessibleConsumables.forEach(consumable => {
      const quantity = character.equipment.consumables?.find(c => c.name === consumable.name)?.quantity || 1
      addText(`${consumable.name} (${quantity})`, 10, true, 5)

      // Category and subcategory
      if (consumable.category) addText(`Catégorie: ${consumable.category}`, 9, false, 10)
      if (consumable.subcategory) addText(`Sous-catégorie: ${consumable.subcategory}`, 9, false, 10)

      // Effects and usage - using correct data structure (effect not effects)
      if (consumable.effect) {
        // Usage action type (critical for gameplay timing)
        if (consumable.effect.usage) addText(`Action requise: ${consumable.effect.usage}`, 9, false, 10)

        // Healing effects
        if (consumable.effect.healing) addText(`Soins: ${consumable.effect.healing}`, 9, false, 10)

        // Damage effects
        if (consumable.effect.damage) addText(`Dégâts: ${consumable.effect.damage}`, 9, false, 10)

        // Area effects (critical for tactical use)
        if (consumable.effect.area) addText(`Zone d'effet: ${consumable.effect.area}`, 9, false, 10)
        if (consumable.effect.area_effect) addText(`Effet de zone: ${consumable.effect.area_effect}`, 9, false, 10)

        // Duration (important for temporary effects)
        if (consumable.effect.duration) addText(`Durée: ${consumable.effect.duration}`, 9, false, 10)

        // Special effects
        if (consumable.effect.emp_effect) addText(`Effet IEM: ${consumable.effect.emp_effect}`, 9, false, 10)
        if (consumable.effect.blind_effect) addText(`Effet d'aveuglement: ${consumable.effect.blind_effect}`, 9, false, 10)
        if (consumable.effect.spell_enhancement) addText(`Amélioration de sort: ${consumable.effect.spell_enhancement}`, 9, false, 10)
        if (consumable.effect.spell_block) addText(`Blocage de sort: ${consumable.effect.spell_block}`, 9, false, 10)

        // Exceptions and special conditions
        if (consumable.effect.exception) addText(`Exception: ${consumable.effect.exception}`, 9, false, 10)
        if (consumable.effect.special) addText(`Spécial: ${consumable.effect.special}`, 9, false, 10)
      }

      // Cost information
      if ((consumable as any).cost) addText(`Coût: ${(consumable as any).cost}`, 9, false, 10)

      if (consumable.description) addText(consumable.description, 9, false, 10)
      yPosition += 2
    })
  }

  // Gameplay Guide
  if (character.gameplay_guide) {
    addSectionHeader('GUIDE DE JEU')
    addText(character.gameplay_guide, 9)
  }

  // Generate filename and download
  const filename = `${character.name.replace(/[^a-zA-Z0-9]/g, '-')}-Character-Sheet.pdf`
  doc.save(filename)
}