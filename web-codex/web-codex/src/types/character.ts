import type { CharacterClass } from './classes'

/**
 * Character represents a player-created character with metadata for storage
 * Extends CharacterClass with ID and timestamps
 */
export interface Character extends CharacterClass {
  id: string // Unique identifier (UUID)
  createdAt: number // Unix timestamp
  updatedAt: number // Unix timestamp
  sourceClass?: string // Name of the class it was created from (if any)
}

/**
 * Minimal character info for list display
 */
export interface CharacterListItem {
  id: string
  name?: string
  type?: string
  image?: string
  sourceClass?: string
  updatedAt: number
  health: number
  flux_reserve: number
}

/**
 * Options for creating a new character
 */
export type CharacterCreationMode = 'scratch' | 'from-class'

export interface CharacterCreationOptions {
  mode: CharacterCreationMode
  sourceClassName?: string // Required if mode is 'from-class'
}
