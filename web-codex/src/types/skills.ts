import type { BaseItem } from './common'

export type EffectType =
  | 'combat'      // Offensive capabilities (attacks, damage)
  | 'defense'     // Defensive capabilities (blocking, protection)
  | 'movement'    // Mobility enhancements (speed, terrain)
  | 'technique'   // Technical abilities (repair, construction, hacking)
  | 'detection'   // Perception and identification (tracking, recognition)
  | 'passive'     // Stat bonuses and passive effects
  | 'special'     // Unique abilities that don't fit other categories

export interface SkillEffect {
  type: EffectType
  description: string
}

export interface Skill extends BaseItem {
  effects: SkillEffect[]
  point_cost?: number
}

export type SkillCategory = 'Compétence'
export type SkillSubcategory =
  | 'combat'
  | 'défense'
  | 'défensive'
  | 'connaissance'
  | 'technique'
  | 'précision'
  | 'mobilité'
  | 'tactique'
  | 'survie'
  | 'furtivité'
  | 'social'
  | 'analyse'
  | 'perception'
  | 'capacité spéciale'