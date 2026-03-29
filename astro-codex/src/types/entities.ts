import type { CharacterClass } from './classes'

/**
 * Entity (NPC) type - extends CharacterClass with faction and alignement fields
 */
export interface Entity extends CharacterClass {
  faction?: string      // Faction like "Empire", "Aceras", etc.
  alignement?: string   // Alignment like "amical", "hostile", "neutre", etc.
}

export type EntityCategory = 'Entité / PNJ'
