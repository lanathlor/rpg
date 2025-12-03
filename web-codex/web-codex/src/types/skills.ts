import type { BaseItem } from './common'

export interface SkillEffect {
  multiple_attacks?: string
  spell_enhancement?: string
  special_abilities?: string[]
  passive_bonus?: string
  protection_bonus?: string
  detection_bonus?: string
  spell_recognition?: string
  tech_bonus?: string
  repair_ability?: string
  stat_bonus?: string
  movement_bonus?: string
}

export interface Skill extends BaseItem {
  effect: SkillEffect
  point_cost?: number
}

export type SkillCategory = 'Compétence'
export type SkillSubcategory = 'combat' | 'défensive' | 'connaissance' | 'technique' | 'précision' | 'mobilité'