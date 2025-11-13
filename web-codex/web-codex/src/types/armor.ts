import type { BaseItem, Prerequisites } from './common'

export interface ArmorStats {
  protection_bonus?: string
  special_abilities?: string[]
  armor_value?: string
  defense_bonus?: string
  movement_penalty?: string
  stat_bonus?: string
  special?: string
}

export interface Armor extends BaseItem {
  type?: string
  prerequisites: Prerequisites
  stats: ArmorStats
  properties?: string[]
  resistances?: string[]
  cost?: string
}

export type ArmorCategory = 'Armure' | 'Bouclier' | 'Exosquelette' | 'Implant'
export type ArmorSubcategory =
  | 'plate'
  | 'tunique'
  | 'combat'
  | 'vitesse'
  | 'traque'
  | 'stabilisateur'
  | 'neural'