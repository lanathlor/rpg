import type { BaseItem, Prerequisites } from './common'

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
}

export type WeaponCategory = 'Arme de corps à corps' | 'Arme à distance'
export type WeaponSubcategory = '1 main' | '2 mains' | 'Distance'
export type WeaponType = 'épées' | 'armes à feu' | 'bâtons'