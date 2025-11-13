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

export interface CharacterClass extends BaseItem {
  image?: string
  base_stats: BaseStats
  flux_system?: FluxSystem
  affinities: AffinityStats
  stats: CharacterStats
  equipment: Equipment
  skills: string[]
  spells?: string[]
  gameplay_guide: string
}

export type ClassCategory = 'Classe de personnage'