import type { BaseItem, Prerequisites } from './common'

export interface ArmorStats {
  // Current YAML field names
  protection_bonus?: string
  defense_bonus?: string
  stat_modifier?: string
  special_ability?: string
  inventory_bonus?: string
  special_abilities?: string[]

  // Drone-specific stats
  health?: string
  speed?: string
  movement?: string
  spellcasting?: string
  attack_penalty?: string

  // Legacy/alternative field names for backward compatibility
  armor_value?: string
  movement_penalty?: string
  stat_bonus?: string
  special?: string
}

export interface Armor extends BaseItem {
  prerequisites: Prerequisites
  stats: ArmorStats
  properties?: string[]
  resistances?: string[]
  cost?: string
}

export type ArmorCategory = 'Armure' | 'Proxy' | 'Bouclier' | 'Exosquelette' | 'Augmentation' | 'Implant' | 'Vêtement' | 'Drone'
export type ArmorSubcategory =
  | 'plate'
  | 'tunique'
  | 'bouclier'
  | 'exosquelette'
  | 'drone'
  | 'neural'
  | 'combat'
  | 'vitesse'
  | 'traque'
  | 'stabilisateur'