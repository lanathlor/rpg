import type { BaseItem, Prerequisites } from './common'
import type { StatBonuses, BaseStatBonuses, ResistanceBonuses, FluxBonuses, AffinityBonuses } from './armor'

export interface WeaponStats {
  damage: string
  off_hand_damage?: string
  attack_type: string
  defense_type: string
  range?: string
  special?: string
}

export interface Weapon extends BaseItem {
  type: string
  prerequisites: Prerequisites
  stats: WeaponStats
  properties?: string[]
  cost?: string
  image?: string
  bonuses?: StatBonuses  // New structured stat bonuses
  base_stat_bonuses?: BaseStatBonuses  // Health and speed bonuses
  resistance_bonuses?: ResistanceBonuses  // New structured resistance bonuses
  flux_bonuses?: FluxBonuses  // New structured flux bonuses
  affinity_bonuses?: AffinityBonuses  // New structured affinity bonuses
}

export type WeaponCategory = 'Arme de corps à corps' | 'Arme à distance'
export type WeaponSubcategory = '1 main' | '2 mains' | 'Distance'
export type WeaponType = 'épées' | 'armes à feu' | 'bâtons'