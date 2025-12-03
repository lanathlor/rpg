import type { BaseItem, Prerequisites } from './common'

export interface SpellLevel {
  level: string
  name: string
  prerequisites: Prerequisites
  conditions: {
    special?: string
    flux_cost?: number
    intelligence_required?: number
    perception_required?: number
    charisma_required?: number
    recharge?: string
    activation?: string
    target_range?: string
  }
  effects: {
    damage?: string
    area_damage?: string
    resistance?: string
    damage_bonus?: string
    burning_chance?: string
    debuff?: string
    status?: string
    emp?: string
    movement?: string
    teleport?: string
    protection?: string
    defense?: string
    defense_bonus?: string
    damage_reduction?: string
    attack_bonus?: string
    critical_chance?: string
    multiple_attack?: string
    information?: string
    prediction?: string
    success?: string
    failure?: string
    automatic_success?: string
    area?: string
    area_effect?: string | boolean
    special?: string
    spell_enhancement?: string
    specials?: string[]
    usage?: string
  }
  recharge_time?: string
  description?: string
  duration?: string
  usage?: string
}

export interface Spell extends BaseItem {
  spell_series?: string
  school?: string
  type?: string
  description_base?: string
  levels?: SpellLevel[]
}

export type SpellSchool =
  | 'feu'
  | 'givre'
  | 'bio-arcanotechnie'
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