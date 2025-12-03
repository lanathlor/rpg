export interface BaseItem {
  name?: string
  description?: string
  category?: string
  subcategory?: string
  cost?: string
}

export interface Prerequisites {
  affinity?: string
  stat?: string
  special?: string
  equipment?: string  // For drone/proxy items
  affinities?: {
    école_requirement?: string
    type_requirement?: string
    mixed_requirement?: string
  }
  intelligence_required?: number
}

export interface AffinityStats {
  distance?: number
  melee?: number
  schools?: {
    feu?: number
    givre?: number
    'bio-arcanotechnie'?: number
    electricite?: number
    quantique?: number
  }
  types?: {
    destruction?: number
    alteration?: number
    amelioration?: number
    deplacement?: number
    protection?: number
    arme?: number
  }
}

export type CodexCategory =
  | 'sorts'
  | 'armes'
  | 'equipements'
  | 'classes'
  | 'competences'
  | 'consommables'