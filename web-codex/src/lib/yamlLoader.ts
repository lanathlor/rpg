import * as yaml from 'js-yaml'
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
  type CodexCategory,
} from '@/types'

export class YamlLoader {
  private static instance: YamlLoader
  private codexData: CodexData | null = null
  private loading = false
  private yamlCache = new Map<string, any>()
  private failedLoads = new Set<string>()

  // Method to clear cache - useful for development
  clearCache() {
    this.yamlCache.clear()
    this.failedLoads.clear()
    this.codexData = null
  }

  static getInstance(): YamlLoader {
    if (!YamlLoader.instance) {
      YamlLoader.instance = new YamlLoader()
    }
    return YamlLoader.instance
  }

  async loadCodexData(): Promise<CodexData> {
    // Clear cache in development to ensure fresh data
    if (import.meta.env.DEV) {
      this.codexData = null
      this.yamlCache.clear()
      this.failedLoads.clear()
    }

    if (this.codexData) {
      return this.codexData
    }

    if (this.loading) {
      // Wait for the current loading to complete
      while (this.loading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      if (this.codexData) {
        return this.codexData
      }
    }

    this.loading = true

    try {
      const codexData: CodexData = {
        spells: [],
        weapons: [],
        armor: [],
        skills: [],
        consumables: [],
        classes: [],
        entities: [],
        scenarios: [],
      }

      // Load all categories in parallel
      const categories: CodexCategory[] = [
        'sorts',
        'armes',
        'equipements',
        'competences',
        'consommables',
        'classes',
        'entites',
        'scenarios',
      ]

      // Load all categories concurrently
      const categoryPromises = categories.map(category =>
        this.loadCategory(category).then(items => ({ category, items }))
      )

      const categoryResults = await Promise.all(categoryPromises)

      // Assign results to codexData
      for (const { category, items } of categoryResults) {
        switch (category) {
          case 'sorts':
            codexData.spells = items as Spell[]
            break
          case 'armes':
            codexData.weapons = items as Weapon[]
            break
          case 'equipements':
            codexData.armor = items as Armor[]
            break
          case 'competences':
            codexData.skills = items as Skill[]
            break
          case 'consommables':
            codexData.consumables = items as Consumable[]
            break
          case 'classes':
            codexData.classes = items as CharacterClass[]
            break
          case 'entites':
            codexData.entities = items as Entity[]
            break
          case 'scenarios':
            codexData.scenarios = items as Scenario[]
            break
        }
      }

      this.codexData = codexData
      return codexData
    } finally {
      this.loading = false
    }
  }

  private async loadCategory(category: CodexCategory): Promise<CodexItem[]> {
    try {
      const files = await this.getCategoryFiles(category)

      // Load all files in parallel using Promise.allSettled
      const loadPromises = files.map(async (file) => {
        try {
          const content = await this.loadYamlFile(`${import.meta.env.BASE_URL}codex/${category}/${file}`)
          if (content) {
            // Add the name field to spells if using spell_series
            if (category === 'sorts') {
              if ((content as any).spell_series && !(content as any).name) {
                (content as any).name = (content as any).spell_series
              }
              // Validate spell has minimum required fields
              if (!(content as any).name && !(content as any).spell_series) {
                console.warn(`Spell ${file} missing both name and spell_series, skipping`)
                return null
              }
            }
            // Add id field to entities based on filename (without .yaml extension)
            if (category === 'entites' || category === 'classes') {
              const id = file.replace(/\.yaml$/, '')
              ;(content as any).id = id
            }
            return content as CodexItem
          }
          return null
        } catch (error) {
          console.warn(`Failed to load ${file} from ${category}:`, error)
          return null
        }
      })

      // Wait for all files to load in parallel
      const results = await Promise.allSettled(loadPromises)

      // Filter out failed loads and null values
      const items: CodexItem[] = results
        .filter((result): result is PromiseFulfilledResult<CodexItem> =>
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value)

      return items
    } catch (error) {
      console.error(`Failed to load category ${category}:`, error)
      return []
    }
  }

  private async loadYamlFile(path: string): Promise<unknown> {
    // Check cache first
    if (this.yamlCache.has(path)) {
      return this.yamlCache.get(path)
    }

    // Check if this file previously failed to load
    if (this.failedLoads.has(path)) {
      throw new Error(`File ${path} previously failed to load`)
    }

    try {
      const response = await fetch(path)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const yamlText = await response.text()
      const parsedData = yaml.load(yamlText)

      if (!parsedData) {
        throw new Error(`Failed to parse YAML from ${path}`)
      }

      // Cache the successful result
      this.yamlCache.set(path, parsedData)
      return parsedData
    } catch (error) {
      // Cache the failure
      this.failedLoads.add(path)
      console.error(`Error loading YAML file ${path}:`, error)
      return null
    }
  }

  // Get file list for a category from index.yaml
  private async getCategoryFiles(category: CodexCategory): Promise<string[]> {
    const indexPath = `${import.meta.env.BASE_URL}codex/${category}/index.yaml`
    try {
      const data = await this.loadYamlFile(indexPath)
      if (data && typeof data === 'object' && 'files' in data) {
        return (data as { files: string[] }).files
      }
      throw new Error(`Invalid index format for ${category}`)
    } catch (error) {
      console.error(`Failed to load index for ${category}:`, error)
      return []
    }
  }

  // Helper methods for specific data access
  async getSpells(): Promise<Spell[]> {
    const data = await this.loadCodexData()
    return data.spells
  }

  async getWeapons(): Promise<Weapon[]> {
    const data = await this.loadCodexData()
    return data.weapons
  }

  async getArmor(): Promise<Armor[]> {
    const data = await this.loadCodexData()
    return data.armor
  }

  async getSkills(): Promise<Skill[]> {
    const data = await this.loadCodexData()
    return data.skills
  }

  async getConsumables(): Promise<Consumable[]> {
    const data = await this.loadCodexData()
    return data.consumables
  }

  async getClasses(): Promise<CharacterClass[]> {
    const data = await this.loadCodexData()
    return data.classes
  }

  async getEntities(): Promise<Entity[]> {
    const data = await this.loadCodexData()
    return data.entities
  }

  async getScenarios(): Promise<Scenario[]> {
    const data = await this.loadCodexData()
    return data.scenarios
  }

  // Search functionality
  async searchAll(query: string): Promise<CodexItem[]> {
    const data = await this.loadCodexData()
    const allItems: CodexItem[] = [
      ...data.spells,
      ...data.weapons,
      ...data.armor,
      ...data.skills,
      ...data.consumables,
      ...data.classes,
      ...data.entities,
      ...data.scenarios,
    ]

    const lowerQuery = query.toLowerCase()
    return allItems.filter((item) => {
      return (
        (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
      )
    })
  }
}