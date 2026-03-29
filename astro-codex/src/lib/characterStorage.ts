import type { Character, CharacterListItem } from '../types/character'
import type { CharacterClass } from '../types/classes'

const STORAGE_KEY = 'rpg-characters'

export function getAllCharacters(): Character[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as Character[]
  } catch (error) {
    console.error('Error loading characters:', error)
    return []
  }
}

export function getCharacterList(): CharacterListItem[] {
  const characters = getAllCharacters()
  return characters.map((char) => ({
    id: char.id,
    name: char.name,
    type: char.type,
    image: char.image,
    sourceClass: char.sourceClass,
    updatedAt: char.updatedAt,
    health: char.base_stats.health,
    flux_reserve: char.flux_system?.reserve || 0,
  }))
}

export function getCharacter(id: string): Character | null {
  const characters = getAllCharacters()
  return characters.find((char) => char.id === id) || null
}

export function createCharacter(
  baseData?: Partial<CharacterClass>,
  sourceClassName?: string
): Character {
  const now = Date.now()

  const character: Character = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    sourceClass: sourceClassName,

    name: baseData?.name || 'Nouveau personnage',
    type: baseData?.type,
    description: baseData?.description,
    image: baseData?.image,

    base_stats: baseData?.base_stats || {
      health: 30,
      speed: 5,
    },

    innate_resistances: baseData?.innate_resistances || {
      RMEC: 0,
      RRAD: 0,
      RINT: 0,
    },

    flux_system: baseData?.flux_system || {
      reserve: 0,
      per_turn: 0,
      recovery: 0,
    },

    affinities: baseData?.affinities || {
      schools: {},
      types: {},
    },

    stats: baseData?.stats || {
      force: 10,
      dexterite: 10,
      constitution: 10,
      intelligence: 10,
      perception: 10,
      precision: 10,
      charisme: 10,
    },

    equipment: baseData?.equipment || {
      weapons: [],
      armor: [],
      consumables: [],
    },

    skills: baseData?.skills || [],
    spells: baseData?.spells || [],
    gameplay_guide: baseData?.gameplay_guide || '',
    starting_credits: baseData?.starting_credits,
    bonus_spell_slots: baseData?.bonus_spell_slots,
  }

  return character
}

export function saveCharacter(character: Character): void {
  try {
    const characters = getAllCharacters()
    const existingIndex = characters.findIndex((c) => c.id === character.id)

    character.updatedAt = Date.now()

    if (existingIndex >= 0) {
      characters[existingIndex] = character
    } else {
      characters.push(character)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
  } catch (error) {
    console.error('Error saving character:', error)
    throw new Error('Impossible de sauvegarder le personnage')
  }
}

export function deleteCharacter(id: string): void {
  try {
    const characters = getAllCharacters()
    const filtered = characters.filter((char) => char.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting character:', error)
    throw new Error('Impossible de supprimer le personnage')
  }
}

export function importCharacter(classData: CharacterClass): Character {
  const character = createCharacter(classData, classData.name)
  saveCharacter(character)
  return character
}
