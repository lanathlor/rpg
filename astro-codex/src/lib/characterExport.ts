import yaml from 'js-yaml'
import type { Character } from '../types/character'
import type { CharacterClass } from '../types/classes'

export function exportToYAML(character: Character): void {
  const classData: Partial<CharacterClass> = {
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

  const yamlContent = yaml.dump(classData, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  })

  const blob = new Blob([yamlContent], { type: 'text/yaml;charset=utf-8' })
  const filename = `${character.name?.replace(/\s+/g, '_').toLowerCase() || 'personnage'}.yaml`

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export function importFromYAML(yamlContent: string): CharacterClass {
  try {
    const data = yaml.load(yamlContent) as CharacterClass

    if (!data.base_stats || !data.stats || !data.affinities) {
      throw new Error('YAML invalide: champs requis manquants')
    }

    return data
  } catch (error) {
    console.error('Error parsing YAML:', error)
    throw new Error('Impossible de lire le fichier YAML')
  }
}
