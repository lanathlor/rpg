import { v4 as uuidv4 } from 'uuid'
import type { Character, CharacterListItem } from '../types/character'
import type { CharacterClass } from '../types/classes'

const STORAGE_KEY = 'rpg-characters'

/**
 * Get all characters from localStorage
 */
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

/**
 * Get character list items (minimal data for display)
 */
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

/**
 * Get a single character by ID
 */
export function getCharacter(id: string): Character | null {
  const characters = getAllCharacters()
  return characters.find((char) => char.id === id) || null
}

/**
 * Create a new character from scratch or from a class
 */
export function createCharacter(
  baseData?: Partial<CharacterClass>,
  sourceClassName?: string
): Character {
  const now = Date.now()

  const character: Character = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    sourceClass: sourceClassName,

    // Default values
    name: baseData?.name || 'Nouveau personnage',
    type: baseData?.type,
    description: baseData?.description,
    image: baseData?.image,

    base_stats: baseData?.base_stats || {
      health: 30,
      speed: 5,
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
  }

  return character
}

/**
 * Save a character (create or update)
 */
export function saveCharacter(character: Character): void {
  try {
    const characters = getAllCharacters()
    const existingIndex = characters.findIndex((c) => c.id === character.id)

    // Update timestamp
    character.updatedAt = Date.now()

    if (existingIndex >= 0) {
      // Update existing
      characters[existingIndex] = character
    } else {
      // Add new
      characters.push(character)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
  } catch (error) {
    console.error('Error saving character:', error)
    throw new Error('Impossible de sauvegarder le personnage')
  }
}

/**
 * Delete a character by ID
 */
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

/**
 * Import character from YAML data
 */
export function importCharacter(classData: CharacterClass): Character {
  const character = createCharacter(classData, classData.name)
  saveCharacter(character)
  return character
}
