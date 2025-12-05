import type { BaseItem, AffinityStats } from './common'

export interface BaseStats {
  health: number
  speed: number
}

export interface FluxSystem {
  reserve: number
  per_turn: number
  recovery: number
}

export interface CharacterStats {
  force: number
  dexterite: number
  constitution: number
  intelligence: number
  perception: number
  precision: number
  charisme: number
}

export interface Equipment {
  weapons?: string[]
  armor?: string[]
  consumables?: Array<{
    name: string
    quantity: number
  }>
}

export interface SelectedSpell {
  series: string  // The spell series name (e.g., "Boule de feu")
  level: string   // The selected level (e.g., "1", "2")
}

export interface CharacterClass extends BaseItem {
  type?: string
  image?: string
  base_stats: BaseStats
  flux_system?: FluxSystem
  affinities: AffinityStats
  stats: CharacterStats
  equipment: Equipment
  skills: string[]
  spells?: SelectedSpell[] | string[]  // Support both formats for backward compatibility
  gameplay_guide: string
  starting_credits?: number  // Starting money budget (default: 0)
}

export type ClassCategory = 'Classe de personnage'