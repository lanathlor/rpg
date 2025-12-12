import { useState, useEffect } from 'react'
import {
  type CodexData,
  type CodexItem,
  type Spell,
  type Weapon,
  type Armor,
  type Skill,
  type Consumable,
  type CharacterClass,
  type Entity,
  type Scenario,
} from '@/types'
import { YamlLoader } from './yamlLoader'

// Initialize the YAML loader instance
const yamlLoader = YamlLoader.getInstance()

// Export the yaml loader instance for direct access if needed
export { yamlLoader as dataProvider }

// React hooks for easier component usage
export function useCodexData() {
  const [data, setData] = useState<CodexData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setError(null)
        const codexData = await yamlLoader.loadCodexData()
        setData(codexData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}

export function useSpells() {
  const [spells, setSpells] = useState<Spell[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSpells() {
      try {
        setError(null)
        const data = await yamlLoader.getSpells()
        setSpells(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load spells')
      } finally {
        setLoading(false)
      }
    }
    loadSpells()
  }, [])

  return { spells, loading, error }
}

export function useWeapons() {
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadWeapons() {
      try {
        setError(null)
        const data = await yamlLoader.getWeapons()
        setWeapons(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weapons')
      } finally {
        setLoading(false)
      }
    }
    loadWeapons()
  }, [])

  return { weapons, loading, error }
}

export function useArmors() {
  const [armors, setArmors] = useState<Armor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArmors() {
      try {
        setError(null)
        const data = await yamlLoader.getArmor()
        setArmors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load armor')
      } finally {
        setLoading(false)
      }
    }
    loadArmors()
  }, [])

  return { armors, loading, error }
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSkills() {
      try {
        setError(null)
        const data = await yamlLoader.getSkills()
        setSkills(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }
    loadSkills()
  }, [])

  return { skills, loading, error }
}

export function useConsumables() {
  const [consumables, setConsumables] = useState<Consumable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadConsumables() {
      try {
        setError(null)
        const data = await yamlLoader.getConsumables()
        setConsumables(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load consumables')
      } finally {
        setLoading(false)
      }
    }
    loadConsumables()
  }, [])

  return { consumables, loading, error }
}

export function useClasses() {
  const [classes, setClasses] = useState<CharacterClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClasses() {
      try {
        setError(null)
        const data = await yamlLoader.getClasses()
        setClasses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load classes')
      } finally {
        setLoading(false)
      }
    }
    loadClasses()
  }, [])

  return { classes, loading, error }
}

export function useEntities() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEntities() {
      try {
        setError(null)
        const data = await yamlLoader.getEntities()
        setEntities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entities')
      } finally {
        setLoading(false)
      }
    }
    loadEntities()
  }, [])

  return { entities, loading, error }
}

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadScenarios() {
      try {
        setError(null)
        const data = await yamlLoader.getScenarios()
        setScenarios(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load scenarios')
      } finally {
        setLoading(false)
      }
    }
    loadScenarios()
  }, [])

  return { scenarios, loading, error }
}

// Search functionality
export function useSearch(query: string) {
  const [results, setResults] = useState<CodexItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        setError(null)
        const searchResults = await yamlLoader.searchAll(query)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return { results, loading, error }
}

// Utility function to get all data as a single object
export async function getAllCodexData(): Promise<CodexData> {
  return yamlLoader.loadCodexData()
}