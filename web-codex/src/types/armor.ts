import type { BaseItem, Prerequisites } from './common'

export interface ArmorStats {
  // New resistance system
  RMEC?: string
  RRAD?: string
  RINT?: string

  // Current YAML field names
  protection_bonus?: string  // Legacy - being phased out
  defense_bonus?: string
  stat_modifier?: string
  special_ability?: string
  inventory_bonus?: string
  special_abilities?: string[]

  // Bonus stats
  speed_bonus?: string
  hacking_bonus?: string
  saving_throw_bonus?: string
  conditional_bonus?: string

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