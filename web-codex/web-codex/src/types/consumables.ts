import type { BaseItem } from './common'

export interface ConsumableEffect {
  spell_enhancement?: string
  usage?: string
  healing?: string
  damage?: string
  area_effect?: string
  area?: string
  duration?: string
  spell_block?: string
  exception?: string
  emp_effect?: string
  blind_effect?: string
  special?: string
}

export interface Consumable extends BaseItem {
  effect: ConsumableEffect
}

export type ConsumableCategory = 'Consommable'
export type ConsumableSubcategory =
  | 'magique'
  | 'médical'
  | 'explosive'
  | 'tactique'
  | 'technologique'