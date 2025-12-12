import { useState, useEffect } from 'react'
import { useClasses, useWeapons, useArmors, useSkills, useConsumables } from '@/lib/dataProvider'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Users,
  Sparkles,
  Sword,
  Shield,
  Target,
  Eye,
  Cog,
  Trophy,
  Filter,
  Brain
} from 'lucide-react'
import type { CharacterClass } from '@/types'
import { calculateTotalPointBuy } from '@/lib/pointBuyCalculator'
import { createSlug } from '@/lib/characterUtils'
import { SearchBar } from '@/components/list/SearchBar'
import { FilterControls, FilterSelect } from '@/components/list/FilterControls'
import { CharacterCard } from '@/components/list/CharacterCard'

const getClassIcon = (className: string) => {
  const name = className.toLowerCase()
  if (name.includes('Arcanotechnicien') || name.includes('arcanotechnologue')) return <Sparkles className="h-5 w-5" />
  if (name.includes('chasseur')) return <Target className="h-5 w-5" />
  if (name.includes('horion') || name.includes('maitre')) return <Sword className="h-5 w-5" />
  if (name.includes('sentinelle') || name.includes('tutelaire')) return <Shield className="h-5 w-5" />
  if (name.includes('technologue')) return <Cog className="h-5 w-5" />
  if (name.includes('spectre')) return <Eye className="h-5 w-5" />
  if (name.includes('taliste')) return <Brain className="h-5 w-5" />
  return <Users className="h-5 w-5" />
}

const getClassColor = (className: string) => {
  const name = className.toLowerCase()
  if (name.includes('Arcanotechnicien') || name.includes('arcanotechnologue')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  if (name.includes('chasseur')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  if (name.includes('horion') || name.includes('maitre')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  if (name.includes('sentinelle') || name.includes('tutelaire')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (name.includes('technologue')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  if (name.includes('spectre')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
  if (name.includes('taliste')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
}

const getClassArchetype = (characterClass: CharacterClass) => {
  return characterClass.type || 'Non défini'
}

export function ClassesPage() {
  const { classes, loading } = useClasses()
  const { weapons } = useWeapons()
  const { armors } = useArmors()
  const { skills } = useSkills()
  const { consumables } = useConsumables()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string>('name-asc')
  const [selectedArchetype, setSelectedArchetype] = useState<string>('all')

  // Calculate min/max point values from all classes
  const pointValues = classes.map(c => calculateTotalPointBuy(c, weapons, armors, skills, consumables).total)
  const absoluteMin = pointValues.length > 0 ? Math.min(...pointValues) : 0
  const absoluteMax = pointValues.length > 0 ? Math.max(...pointValues) : 1000

  const [minPoints, setMinPoints] = useState<number>(absoluteMin)
  const [maxPoints, setMaxPoints] = useState<number>(absoluteMax)

  // Local string state for input display (allows empty during editing)
  const [minInputValue, setMinInputValue] = useState<string>(String(absoluteMin))
  const [maxInputValue, setMaxInputValue] = useState<string>(String(absoluteMax))

  // Sync display values when filter state changes (e.g., from slider)
  useEffect(() => {
    setMinInputValue(String(minPoints))
  }, [minPoints])

  useEffect(() => {
    setMaxInputValue(String(maxPoints))
  }, [maxPoints])

  // Get unique archetypes for filter
  const uniqueArchetypes = Array.from(new Set(classes.map(c => getClassArchetype(c)))).sort()

  // Filter and sort classes
  const filteredClasses = classes.filter((characterClass) => {
    const matchesSearch =
      (characterClass.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (characterClass.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClassArchetype(characterClass).toLowerCase().includes(searchQuery.toLowerCase())

    // Point range filter
    const pointBuy = calculateTotalPointBuy(characterClass, weapons, armors, skills, consumables)
    const matchesPoints = pointBuy.total >= minPoints && pointBuy.total <= maxPoints

    // Archetype filter
    const matchesArchetype = selectedArchetype === 'all' || getClassArchetype(characterClass) === selectedArchetype

    return matchesSearch && matchesPoints && matchesArchetype
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '')
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
        <div className="text-lg">Chargement des classes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Classes de personnage</h1>
        <p className="text-lg text-muted-foreground">
          {filteredClasses.length} sur {classes.length} {classes.length === 1 ? 'classe' : 'classes'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une classe..."
        />

        {/* Filters Row */}
        <FilterControls
          sortValue={sortBy}
          onSortChange={setSortBy}
          sortOptions={[
            { label: 'Nom (A-Z)', value: 'name-asc' },
            { label: 'Nom (Z-A)', value: 'name-desc' },
            { label: 'Points (croissant)', value: 'points-asc' },
            { label: 'Points (décroissant)', value: 'points-desc' }
          ]}
          onReset={() => {
            setSearchQuery('')
            setMinPoints(absoluteMin)
            setMaxPoints(absoluteMax)
            setSelectedArchetype('all')
          }}
          resetDisabled={!searchQuery && minPoints === absoluteMin && maxPoints === absoluteMax && selectedArchetype === 'all'}
        >
          {/* Archetype Filter */}
          <FilterSelect
            value={selectedArchetype}
            onChange={setSelectedArchetype}
            options={uniqueArchetypes.map(archetype => ({ label: archetype, value: archetype }))}
            allLabel="Tous les types"
          />

          {/* Point Range Filter */}
          <div className="flex items-center gap-3 flex-1 sm:min-w-[300px]">
            <Filter className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Slider
                min={absoluteMin}
                max={absoluteMax}
                step={1}
                value={[minPoints, maxPoints]}
                onValueChange={([min, max]) => {
                  setMinPoints(min)
                  setMaxPoints(max)
                }}
                className="w-full"
              />
              <div className="flex gap-2 items-center text-sm">
                <Input
                  type="number"
                  min={absoluteMin}
                  max={maxPoints}
                  value={minInputValue}
                  onChange={(e) => {
                    const value = e.target.value
                    setMinInputValue(value)

                    if (value !== '' && !isNaN(Number(value))) {
                      const numValue = Number(value)
                      setMinPoints(Math.max(absoluteMin, Math.min(numValue, maxPoints)))
                    }
                  }}
                  onBlur={() => {
                    if (minInputValue === '' || isNaN(Number(minInputValue))) {
                      setMinPoints(absoluteMin)
                      setMinInputValue(String(absoluteMin))
                    } else {
                      const clamped = Math.max(absoluteMin, Math.min(Number(minInputValue), maxPoints))
                      setMinPoints(clamped)
                      setMinInputValue(String(clamped))
                    }
                  }}
                  className="w-20 h-9 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span>-</span>
                <Input
                  type="number"
                  min={minPoints}
                  max={absoluteMax}
                  value={maxInputValue}
                  onChange={(e) => {
                    const value = e.target.value
                    setMaxInputValue(value)

                    if (value !== '' && !isNaN(Number(value))) {
                      const numValue = Number(value)
                      setMaxPoints(Math.min(absoluteMax, Math.max(numValue, minPoints)))
                    }
                  }}
                  onBlur={() => {
                    if (maxInputValue === '' || isNaN(Number(maxInputValue))) {
                      setMaxPoints(absoluteMax)
                      setMaxInputValue(String(absoluteMax))
                    } else {
                      const clamped = Math.min(absoluteMax, Math.max(Number(maxInputValue), minPoints))
                      setMaxPoints(clamped)
                      setMaxInputValue(String(clamped))
                    }
                  }}
                  className="w-20 h-9 px-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-muted-foreground">points</span>
              </div>
            </div>
          </div>
        </FilterControls>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((characterClass) => {
          const pointBuy = calculateTotalPointBuy(characterClass, weapons, armors, skills, consumables)
          return (
            <CharacterCard
              key={characterClass.name}
              character={characterClass}
              slug={createSlug(characterClass.name || '')}
              basePath="classes"
              icon={getClassIcon(characterClass.name || '')}
              iconColor={getClassColor(characterClass.name || '')}
              badges={
                <Badge variant="outline">
                  {getClassArchetype(characterClass)}
                </Badge>
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

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? 'Aucune classe ne correspond aux critères de recherche.'
              : 'Aucune classe trouvée.'}
          </p>
        </div>
      )}
    </div>
  )
}