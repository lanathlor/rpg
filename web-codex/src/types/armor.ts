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

export interface StatBonuses {
  force?: string  // Format: "+X" or "-X"
  dexterite?: string
  constitution?: string
  intelligence?: string
  perception?: string
  precision?: string
  charisme?: string
}

export interface BaseStatBonuses {
  health?: string  // Format: "+X" or "-X"
  speed?: string
}

export interface ResistanceBonuses {
  RMEC?: string  // Format: "+X" or "-X"
  RRAD?: string
  RINT?: string
}

export interface FluxBonuses {
  reserve?: string  // Format: "+X" or "-X"
  per_turn?: string
  recovery?: string
}

export interface AffinityBonuses {
  // Combat affinities
  distance?: string  // Format: "+X" or "-X"
  melee?: string
  sniper?: string
  arme_1_main?: string
  arme_2_mains?: string
  // Schools
  balistique?: string
  martial?: string
  feu?: string
  lumiere?: string
  electricite?: string
  glace?: string
  ombre?: string
  air?: string
  terre?: string
  eau?: string
  // Types
  destruction?: string
  amelioration?: string
  arme?: string
  alteration?: string
  [key: string]: string | undefined  // Allow any affinity name
}

export interface Armor extends BaseItem {
  prerequisites: Prerequisites
  stats: ArmorStats
  properties?: string[]
  resistances?: string[]
  cost?: string
  image?: string
  bonuses?: StatBonuses  // New structured stat bonuses
  base_stat_bonuses?: BaseStatBonuses  // Health and speed bonuses
  resistance_bonuses?: ResistanceBonuses  // New structured resistance bonuses
  flux_bonuses?: FluxBonuses  // New structured flux bonuses
  affinity_bonuses?: AffinityBonuses  // New structured affinity bonuses
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