/**
 * Shared utility functions for character/entity list pages
 */

/**
 * Create URL-friendly slug from a name
 */
export function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')
}

/**
 * Get highest stat from a character or entity
 */
export function getHighestStat(stats: {
  force: number
  dexterite: number
  constitution: number
  intelligence: number
  perception: number
  precision: number
  charisme: number
}) {
  const statEntries = [
    { name: 'Force', value: stats.force, key: 'force' },
    { name: 'Dextérité', value: stats.dexterite, key: 'dexterite' },
    { name: 'Constitution', value: stats.constitution, key: 'constitution' },
    { name: 'Intelligence', value: stats.intelligence, key: 'intelligence' },
    { name: 'Perception', value: stats.perception, key: 'perception' },
    { name: 'Précision', value: stats.precision, key: 'precision' },
    { name: 'Charisme', value: stats.charisme, key: 'charisme' }
  ]

  return statEntries.reduce((highest, current) =>
    current.value > highest.value ? current : highest
  )
}
