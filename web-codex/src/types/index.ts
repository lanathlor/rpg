export * from './common'
export * from './spells'
export * from './weapons'
export * from './armor'
export * from './skills'
export * from './consumables'
export * from './classes'
export * from './scenarios'

import type { Spell } from './spells'
import type { Weapon } from './weapons'
import type { Armor } from './armor'
import type { Skill } from './skills'
import type { Consumable } from './consumables'
import type { CharacterClass } from './classes'
import type { Scenario } from './scenarios'

export type CodexItem = Spell | Weapon | Armor | Skill | Consumable | CharacterClass | Scenario

export interface CodexData {
  spells: Spell[]
  weapons: Weapon[]
  armor: Armor[]
  skills: Skill[]
  consumables: Consumable[]
  classes: CharacterClass[]
  scenarios: Scenario[]
}

export interface ParsedCodexFile {
  category: string
  subcategory: string
  filename: string
  data: CodexItem
}