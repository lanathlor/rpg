/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import yaml from 'js-yaml'
import type { Character } from '../types/character'
import type { CharacterClass } from '../types/classes'

/**
 * Export character to YAML format (compatible with class YAML structure)
 */
export function exportToYAML(character: Character): void {
  // Remove character-specific metadata
  const classData: CharacterClass = {
    name: character.name,
    type: character.type,
    description: character.description,
    image: character.image,
    base_stats: character.base_stats,
    innate_resistances: character.innate_resistances,
    flux_system: character.flux_system,
    affinities: character.affinities,
    stats: character.stats,
    equipment: character.equipment,
    skills: character.skills,
    spells: character.spells,
    gameplay_guide: character.gameplay_guide,
  }

  // Convert to YAML
  const yamlContent = yaml.dump(classData, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  })

  // Create blob and trigger download
  const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' })
  const filename = `${character.name?.replace(/\s+/g, '_').toLowerCase() || 'personnage'}.yaml`
  saveAs(blob, filename)
}

/**
 * Import character from YAML string
 */
export function importFromYAML(yamlContent: string): CharacterClass {
  try {
    const data = yaml.load(yamlContent) as CharacterClass

    // Validate required fields
    if (!data.base_stats || !data.stats || !data.affinities) {
      throw new Error('YAML invalide: champs requis manquants')
    }

    return data
  } catch (error) {
    console.error('Error parsing YAML:', error)
    throw new Error('Impossible de lire le fichier YAML')
  }
}

/**
 * Export character to PDF (character sheet format)
 */
export function exportToPDF(character: Character): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 15

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(character.name || 'Personnage', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Subtitle (Type/Class)
  if (character.type || character.sourceClass) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const subtitle = character.sourceClass
      ? `${character.type || ''} (Basé sur ${character.sourceClass})`
      : character.type || ''
    doc.text(subtitle, pageWidth / 2, yPos, { align: 'center' })
    yPos += 10
  }

  // Description
  if (character.description) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    const splitDesc = doc.splitTextToSize(character.description, pageWidth - 30)
    doc.text(splitDesc, 15, yPos)
    yPos += splitDesc.length * 5 + 5
  }

  // Base Stats
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Statistiques de base', 15, yPos)
  yPos += 8

  autoTable(doc, {
    startY: yPos,
    head: [['Santé', 'Vitesse']],
    body: [[character.base_stats.health, character.base_stats.speed]],
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] },
    margin: { left: 15, right: 15 },
  })
  yPos = (doc as any).lastAutoTable.finalY + 8

  // Flux System
  if (character.flux_system) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Système de Flux', 15, yPos)
    yPos += 8

    autoTable(doc, {
      startY: yPos,
      head: [['Réserve', 'Par tour', 'Récupération']],
      body: [
        [
          character.flux_system.reserve,
          character.flux_system.per_turn,
          character.flux_system.recovery,
        ],
      ],
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234] },
      margin: { left: 15, right: 15 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 8
  }

  // Innate Resistances
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Résistances innées', 15, yPos)
  yPos += 8

  autoTable(doc, {
    startY: yPos,
    head: [['RMEC', 'RRAD', 'RINT']],
    body: [
      [
        character.innate_resistances?.RMEC ?? 0,
        character.innate_resistances?.RRAD ?? 0,
        character.innate_resistances?.RINT ?? 0,
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [120, 120, 120] },
    margin: { left: 15, right: 15 },
  })
  yPos = (doc as any).lastAutoTable.finalY + 8

  // Primary Stats
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Caractéristiques', 15, yPos)
  yPos += 8

  autoTable(doc, {
    startY: yPos,
    head: [['FOR', 'DEX', 'CON', 'INT', 'PER', 'PRE', 'CHA']],
    body: [
      [
        character.stats.force,
        character.stats.dexterite,
        character.stats.constitution,
        character.stats.intelligence,
        character.stats.perception,
        character.stats.precision,
        character.stats.charisme,
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 15, right: 15 },
  })
  yPos = (doc as any).lastAutoTable.finalY + 8

  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage()
    yPos = 15
  }

  // Spells
  if (character.spells && character.spells.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Sorts', 15, yPos)
    yPos += 8

    const spellRows = character.spells.map((spell, idx) => [
      `${idx + 1}`,
      typeof spell === 'string' ? spell : `${spell.series} (Niveau ${spell.level})`
    ])
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nom du sort']],
      body: spellRows,
      theme: 'striped',
      headStyles: { fillColor: [251, 146, 60] },
      margin: { left: 15, right: 15 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 8
  }

  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage()
    yPos = 15
  }

  // Equipment
  const equipmentRows: string[][] = []

  if (character.equipment.weapons && character.equipment.weapons.length > 0) {
    equipmentRows.push(['Armes', character.equipment.weapons.join(', ')])
  }

  if (character.equipment.armor && character.equipment.armor.length > 0) {
    equipmentRows.push(['Armures', character.equipment.armor.join(', ')])
  }

  if (character.equipment.consumables && character.equipment.consumables.length > 0) {
    const consumablesList = character.equipment.consumables
      .map((c) => `${c.name} (x${c.quantity})`)
      .join(', ')
    equipmentRows.push(['Consommables', consumablesList])
  }

  if (equipmentRows.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Équipement', 15, yPos)
    yPos += 8

    autoTable(doc, {
      startY: yPos,
      head: [['Type', 'Objets']],
      body: equipmentRows,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 15, right: 15 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 8
  }

  // Skills
  if (character.skills && character.skills.length > 0) {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage()
      yPos = 15
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Compétences', 15, yPos)
    yPos += 8

    const skillRows = character.skills.map((skill, idx) => [`${idx + 1}`, skill])
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nom de la compétence']],
      body: skillRows,
      theme: 'striped',
      headStyles: { fillColor: [168, 85, 247] },
      margin: { left: 15, right: 15 },
    })
    yPos = (doc as any).lastAutoTable.finalY + 8
  }

  // Spells
  if (character.spells && character.spells.length > 0) {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage()
      yPos = 15
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Sorts', 15, yPos)
    yPos += 8

    // Handle both legacy string[] and new SelectedSpell[] formats
    const spellRows = character.spells.map((spell: any, idx: number) => {
      if (typeof spell === 'string') {
        // Legacy format
        return [`${idx + 1}`, spell, 'N/A']
      } else if (spell && typeof spell === 'object' && 'series' in spell) {
        // New format with level
        return [`${idx + 1}`, spell.series, `Niveau ${spell.level}`]
      }
      return [`${idx + 1}`, 'Sort inconnu', 'N/A']
    })

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Nom du sort', 'Niveau']],
      body: spellRows,
      theme: 'striped',
      headStyles: { fillColor: [251, 146, 60] },
      margin: { left: 15, right: 15 },
    })
  }

  // Save PDF
  const filename = `${character.name?.replace(/\s+/g, '_').toLowerCase() || 'personnage'}.pdf`
  doc.save(filename)
}
