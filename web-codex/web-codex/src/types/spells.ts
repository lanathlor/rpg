import type { BaseItem, Prerequisites } from './common'

export interface SpellLevel {
  level: string
  name: string
  prerequisites: Prerequisites
  conditions: {
    special?: string
    flux_cost?: number
    intelligence_required?: number
  }
  effects: {
    damage?: string
    area_damage?: string
    special?: string
    spell_enhancement?: string
    usage?: string
  }
  description?: string
  duration?: string
  usage?: string
}

export interface Spell extends BaseItem {
  spell_series: string
  school: string
  type: string
  description_base: string
  levels: SpellLevel[]
}

export type SpellSchool =
  | 'feu'
  | 'givre'
  | 'bio-quantotechnique'
  | 'electricite'
  | 'quantique'

export type SpellType =
  | 'destruction'
  | 'alteration'
  | 'amelioration'
  | 'deplacement'
  | 'protection'
  | 'arme'
  | 'affliction'