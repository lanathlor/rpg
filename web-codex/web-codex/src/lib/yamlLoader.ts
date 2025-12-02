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
      }

      // Load all categories in parallel
      const categories: CodexCategory[] = [
        'sorts',
        'armes',
        'equipements',
        'competences',
        'consommables',
        'classes',
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
          const content = await this.loadYamlFile(`/codex/${category}/${file}`)
          if (content) {
            // Add the name field to spells if using spell_series
            if (category === 'sorts' && (content as any).spell_series && !(content as any).name) {
              (content as any).name = (content as any).spell_series
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

  // This would typically be fetched from a server endpoint
  // For now, we'll use static file lists based on our analysis
  private async getCategoryFiles(category: CodexCategory): Promise<string[]> {
    const fileMap: Record<CodexCategory, string[]> = {
      sorts: [
        'destruction/boule_de_feu.yaml',
        'destruction/flammeche.yaml',
        'destruction/colonne_de_flamme.yaml',
        'destruction/eclaire.yaml',
        'alteration/confusion.yaml',
        'alteration/flash.yaml',
        'alteration/brouillage.yaml',
        'alteration/assoupissement.yaml',
        'alteration/vol_de_donnees.yaml',
        'alteration/zap.yaml',
        'alteration/void.yaml',
        'amelioration/blink.yaml',
        'amelioration/camouflage.yaml',
        'amelioration/charge.yaml',
        'amelioration/lecture_des_mouvements.yaml',
        'amelioration/optimisation.yaml',
        'amelioration/partage_de_connaissance.yaml',
        'arme/attaque_de_force.yaml',
        'arme/attaque_des_points_sensibles.yaml',
        'arme/attaque_multiple.yaml',
        'arme/cartouche_de_shrapnel_augmentee.yaml',
        'arme/cartouche_de_shrapnel_augmentee_tech.yaml',
        'arme/charge_statique.yaml',
        'arme/fendre.yaml',
        'arme/lame_de_foudre.yaml',
        'arme/lame_fantome.yaml',
        'arme/lame_fantome_quantique.yaml',
        'arme/plombs_a_haute_velocite.yaml',
        'arme/plombs_a_haute_velocite_tech.yaml',
        'arme/tir_a_la_tete.yaml',
        'arme/tir_a_la_tete_a.yaml',
        'arme/tir_de_barrage.yaml',
        'arme/tir_surcharge.yaml',
        'deplacement/magnetisation.yaml',
        'deplacement/roulade.yaml',
        'protection/bouclier_de_lumiere_solide.yaml',
        'protection/intervention.yaml',
        'affliction/brulure.yaml',
        'destruction/javelot_de_glace.yaml',
        'destruction/vent_cinglant.yaml',
        'destruction/givre.yaml',
        'alteration/froid_mordant.yaml',
        'deplacement/un_avec_le_froid.yaml',
        'affliction/gelure.yaml',
        'alteration/voile_d_ombre.yaml',
        'affliction/drain_vital.yaml',
        'protection/annulation_arcanotechnique.yaml',
        'deplacement/tornade.yaml',
        'alteration/maree.yaml',
        'destruction/onde_de_choc.yaml',
        'amelioration/acceleration_temporelle.yaml',
        'alteration/distorsion_gravitationnelle.yaml',
        'destruction/poigne_de_force.yaml',
      ],
      armes: [
        'baton.yaml',
        'epee_courte.yaml',
        'epee_legere.yaml',
        'epee_lourde.yaml',
        'fusil_a_pompe_surcharge.yaml',
        'fusil_de_sniper.yaml',
        'fusil_mitrailleur.yaml',
        'pistolet.yaml',
      ],
      equipements: [
        'armure_de_plate_legere.yaml',
        'armure_de_plate_lourde.yaml',
        'bouclier.yaml',
        'drone_de_combat.yaml',
        'exosquelette_de_combat.yaml',
        'exosquelette_de_traque.yaml',
        'exosquelette_de_vitesse.yaml',
        'exosquelette_stabilisateur.yaml',
        'implant_neural_militaire.yaml',
        'tenue_de_survie.yaml',
        'tunique.yaml',
      ],
      competences: [
        'a_laffut.yaml',
        'armure_d_arcanotechnique.yaml',
        'champ_electromagnetique.yaml',
        'charismatique.yaml',
        'comprehension_de_la_nature.yaml',
        'connaisseur_d_arcanotechnique.yaml',
        'course.yaml',
        'expert_des_terrains.yaml',
        'guerrier.yaml',
        'hackeur.yaml',
        'ingenieur.yaml',
        'oeil_daigle.yaml',
        'rodeur.yaml',
        'scientifique.yaml',
        'tacticien.yaml',
        'traque.yaml',
        'veteran.yaml',
        'vue_des_quantiques.yaml',
      ],
      consommables: [
        'bombe_iem.yaml',
        'cristal_de_mana.yaml',
        'flash.yaml',
        'flechette_anti_arcanotechnique.yaml',
        'grenade.yaml',
        'kit_de_soins.yaml',
      ],
      classes: [
        'chasseur.yaml',
        'horion.yaml',
        'arcanotechnicien.yaml',
        'arcanotechnicien_de_combat.yaml',
        'arcanotechnologue.yaml',
        'maitre_darmes.yaml',
        'sentinelle.yaml',
        'spectre.yaml',
        'taliste.yaml',
        'technologue.yaml',
        'tutelaire.yaml',
      ],
    }

    return fileMap[category] || []
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
    ]

    const lowerQuery = query.toLowerCase()
    return allItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerQuery))
      )
    })
  }
}