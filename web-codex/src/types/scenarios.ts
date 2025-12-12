import type { BaseItem } from './common'

export interface SessionInfo {
  duration?: string
  player_count?: string
  recommended_points?: string
}

export interface GMNotes {
  preparation_time?: string
  complexity?: 'low' | 'medium' | 'high'
  tone?: string
}

export interface Requirements {
  required_rules?: string[]
  recommended_classes?: string[]
  required_npcs?: number
  maps_included?: boolean
  handouts_included?: boolean
}

export interface Act {
  act: string
  title: string
  description?: string
  key_scenes?: string[]
  estimated_duration?: string
}

export interface NPC {
  name: string
  role: string
  description?: string
  stats_reference?: string  // Deprecated: use entity_base + notes instead
  entity_base?: string
  notes?: string
  motivations?: string
}

export interface Enemy {
  name: string
  count: number
  stats_reference?: string  // Deprecated: use entity_base instead
  entity_base?: string
  notes?: string  // Additional notes or modifications for this enemy instance
}

export interface FailureConsequence {
  description?: string
  enemies?: Enemy[]
}

export interface Encounter {
  name: string
  type: 'combat' | 'social' | 'exploration' | 'puzzle' | 'mixed'
  difficulty?: string
  location?: string
  description?: string
  enemies?: Enemy[]
  tactics?: string
  challenges?: string[]
  success_conditions?: string[]
  failure_consequence?: string | FailureConsequence
  alternative?: string
  rewards?: string[]
}

export interface Rewards {
  points?: string
  credits?: string
  items?: string[]
  special?: string
}

export interface Variant {
  name: string
  description: string
}

export interface RelatedContent {
  spells_used?: string[]
  equipment_used?: string[]
  locations?: string[]
}

export interface Scenario extends BaseItem {
  // Extends BaseItem with: name, description, category, subcategory, cost

  // Basic information
  description_long?: string
  image?: string

  // Classification
  theme?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  setting?: string

  // Session details
  session_info?: SessionInfo
  gm_notes?: GMNotes
  requirements?: Requirements

  // Plot structure
  synopsis?: string
  acts?: Act[]

  // Characters & encounters
  npcs?: NPC[]
  encounters?: Encounter[]

  // Rewards
  rewards?: Rewards

  // Variants
  variants?: Variant[]

  // Related content
  related_content?: RelatedContent

  // Metadata
  tags?: string[]
  author?: string
  last_updated?: string
  playtested?: boolean
  gm_tips?: string
}
