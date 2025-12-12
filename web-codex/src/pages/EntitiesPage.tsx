import { useState } from 'react'
import { useEntities, useWeapons, useArmors, useSkills, useConsumables } from '@/lib/dataProvider'
import { Badge } from '@/components/ui/badge'
import {
  Ghost,
  Sparkles,
  Sword,
  Shield,
  Target,
  Eye,
  Cog,
  Trophy,
  Users,
  Skull,
  Handshake
} from 'lucide-react'
import { createSlug } from '@/lib/characterUtils'
import { calculateTotalPointBuy } from '@/lib/pointBuyCalculator'
import { SearchBar } from '@/components/list/SearchBar'
import { FilterControls, FilterSelect } from '@/components/list/FilterControls'
import { CharacterCard } from '@/components/list/CharacterCard'

const getEntityIcon = (entityName: string) => {
  const name = entityName.toLowerCase()
  if (name.includes('garde') || name.includes('soldat')) return <Shield className="h-5 w-5" />
  if (name.includes('chasseur') || name.includes('tireur')) return <Target className="h-5 w-5" />
  if (name.includes('mage') || name.includes('arcanotechnicien')) return <Sparkles className="h-5 w-5" />
  if (name.includes('spectre') || name.includes('espion')) return <Eye className="h-5 w-5" />
  if (name.includes('technologue') || name.includes('ingénieur')) return <Cog className="h-5 w-5" />
  if (name.includes('chef') || name.includes('commandant')) return <Trophy className="h-5 w-5" />
  if (name.includes('assassin') || name.includes('tueur')) return <Skull className="h-5 w-5" />
  if (name.includes('guerrier') || name.includes('combattant')) return <Sword className="h-5 w-5" />
  return <Ghost className="h-5 w-5" />
}

const getEntityColor = (entityName: string) => {
  const name = entityName.toLowerCase()
  if (name.includes('garde') || name.includes('soldat')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (name.includes('chasseur') || name.includes('tireur')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  if (name.includes('mage') || name.includes('arcanotechnicien')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  if (name.includes('spectre') || name.includes('espion')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
  if (name.includes('technologue') || name.includes('ingénieur')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  if (name.includes('chef') || name.includes('commandant')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
  if (name.includes('assassin') || name.includes('tueur')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  if (name.includes('guerrier') || name.includes('combattant')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
}

const getAlignementColor = (alignement?: string) => {
  if (!alignement) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  const aligned = alignement.toLowerCase()
  if (aligned === 'amical' || aligned === 'ami' || aligned === 'allié') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (aligned === 'hostile' || aligned === 'ennemi') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  if (aligned === 'neutre') return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
}

const getAlignementIcon = (alignement?: string) => {
  if (!alignement) return <Users className="h-3 w-3" />
  const aligned = alignement.toLowerCase()
  if (aligned === 'amical' || aligned === 'ami' || aligned === 'allié') return <Handshake className="h-3 w-3" />
  if (aligned === 'hostile' || aligned === 'ennemi') return <Skull className="h-3 w-3" />
  if (aligned === 'neutre') return <Users className="h-3 w-3" />
  return <Users className="h-3 w-3" />
}

export function EntitiesPage() {
  const { entities, loading } = useEntities()
  const { weapons } = useWeapons()
  const { armors } = useArmors()
  const { skills } = useSkills()
  const { consumables } = useConsumables()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('name-asc')
  const [selectedFaction, setSelectedFaction] = useState<string>('all')
  const [selectedAlignement, setSelectedAlignement] = useState<string>('all')

  // Get unique factions and alignements for filters
  const uniqueFactions = Array.from(new Set(entities.map(e => e.faction).filter(Boolean))).sort()
  const uniqueAlignements = Array.from(new Set(entities.map(e => e.alignement).filter(Boolean))).sort()

  // Filter and sort entities
  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      (entity.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.faction || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entity.alignement || '').toLowerCase().includes(searchQuery.toLowerCase())

    // Faction filter
    const matchesFaction = selectedFaction === 'all' || entity.faction === selectedFaction

    // Alignement filter
    const matchesAlignement = selectedAlignement === 'all' || entity.alignement === selectedAlignement

    return matchesSearch && matchesFaction && matchesAlignement
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '')
      case 'health-asc':
        return a.base_stats.health - b.base_stats.health
      case 'health-desc':
        return b.base_stats.health - a.base_stats.health
      case 'points-asc': {
        const pointsA = calculateTotalPointBuy(a, weapons, armors, skills, consumables).total
        const pointsB = calculateTotalPointBuy(b, weapons, armors, skills, consumables).total
        return pointsA - pointsB
      }
      case 'points-desc': {
        const pointsA = calculateTotalPointBuy(a, weapons, armors, skills, consumables).total
        const pointsB = calculateTotalPointBuy(b, weapons, armors, skills, consumables).total
        return pointsB - pointsA
      }
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des entités...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Entités / PNJ</h1>
        <p className="text-lg text-muted-foreground">
          {filteredEntities.length} sur {entities.length} {entities.length === 1 ? 'entité' : 'entités'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une entité..."
        />

        {/* Filters Row */}
        <FilterControls
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { label: 'Nom (A-Z)', value: 'name-asc' },
            { label: 'Nom (Z-A)', value: 'name-desc' },
            { label: 'PV (croissant)', value: 'health-asc' },
            { label: 'PV (décroissant)', value: 'health-desc' },
            { label: 'Points (croissant)', value: 'points-asc' },
            { label: 'Points (décroissant)', value: 'points-desc' }
          ]}
          onReset={() => {
            setSearchQuery('')
            setSelectedFaction('all')
            setSelectedAlignement('all')
          }}
          resetDisabled={!searchQuery && selectedFaction === 'all' && selectedAlignement === 'all'}
        >
          {/* Faction Filter */}
          <FilterSelect
            value={selectedFaction}
            onChange={setSelectedFaction}
            options={uniqueFactions.map(faction => ({ label: faction || '', value: faction || '' }))}
            allLabel="Toutes les factions"
          />

          {/* Alignement Filter */}
          <FilterSelect
            value={selectedAlignement}
            onChange={setSelectedAlignement}
            options={uniqueAlignements.map(alignement => ({ label: alignement || '', value: alignement || '' }))}
            allLabel="Tous les alignements"
          />
        </FilterControls>
      </div>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntities.map((entity) => {
          const pointBuy = calculateTotalPointBuy(entity, weapons, armors, skills, consumables)
          return (
            <CharacterCard
              key={entity.name}
              character={entity}
              slug={createSlug(entity.name || '')}
              basePath="entites"
              icon={getEntityIcon(entity.name || '')}
              iconColor={getEntityColor(entity.name || '')}
              badges={
                <>
                  {entity.type && (
                    <Badge variant="outline">
                      {entity.type}
                    </Badge>
                  )}
                  {entity.faction && (
                    <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {entity.faction}
                    </Badge>
                  )}
                  {entity.alignement && (
                    <Badge className={getAlignementColor(entity.alignement)}>
                      <span className="flex items-center gap-1">
                        {getAlignementIcon(entity.alignement)}
                        {entity.alignement}
                      </span>
                    </Badge>
                  )}
                </>
              }
              extraStats={
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">{pointBuy.total} pts</span>
                </div>
              }
            />
          )
        })}
      </div>

      {filteredEntities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? 'Aucune entité ne correspond aux critères de recherche.'
              : 'Aucune entité trouvée.'}
          </p>
        </div>
      )}
    </div>
  )
}
