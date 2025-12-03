import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useClasses, useWeapons, useArmors, useSkills, useConsumables } from '@/lib/dataProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Users,
  Sparkles,
  Sword,
  Shield,
  Target,
  Eye,
  Cog,
  Search,
  ArrowRight,
  Heart,
  Brain,
  Gauge,
  Zap,
  Hand,
  Activity,
  Star,
  Trophy,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import type { CharacterClass } from '@/types'
import { calculateTotalPointBuy } from '@/lib/pointBuyCalculator'

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

const getHighestStat = (characterClass: CharacterClass) => {
  const stats = characterClass.stats
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

const getStatIcon = (statKey: string) => {
  switch (statKey) {
    case 'force':
      return <Sword className="h-4 w-4 text-red-500" />
    case 'dexterite':
      return <Zap className="h-4 w-4 text-yellow-500" />
    case 'constitution':
      return <Activity className="h-4 w-4 text-green-500" />
    case 'intelligence':
      return <Brain className="h-4 w-4 text-purple-500" />
    case 'perception':
      return <Eye className="h-4 w-4 text-blue-500" />
    case 'precision':
      return <Target className="h-4 w-4 text-orange-500" />
    case 'charisme':
      return <Star className="h-4 w-4 text-pink-500" />
    default:
      return <Hand className="h-4 w-4 text-gray-500" />
  }
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
      characterClass.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
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

  // Create URL-friendly class name
  const getClassSlug = (className: string) => {
    return className.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9-]/g, '')
  }

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une classe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex gap-4 flex-wrap items-end">
          {/* Archetype Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 flex-shrink-0" />
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              className="border rounded px-3 py-2 bg-background min-w-[150px]"
            >
              <option value="all">Tous les types</option>
              {uniqueArchetypes.map(archetype => (
                <option key={archetype} value={archetype}>{archetype}</option>
              ))}
            </select>
          </div>

          {/* Point Range Filter */}
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
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
                    setMinInputValue(value) // Update display immediately

                    // Update filter state only if valid
                    if (value !== '' && !isNaN(Number(value))) {
                      const numValue = Number(value)
                      setMinPoints(Math.max(absoluteMin, Math.min(numValue, maxPoints)))
                    }
                  }}
                  onBlur={() => {
                    // Validate and clamp on blur
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
                    setMaxInputValue(value) // Update display immediately

                    // Update filter state only if valid
                    if (value !== '' && !isNaN(Number(value))) {
                      const numValue = Number(value)
                      setMaxPoints(Math.min(absoluteMax, Math.max(numValue, minPoints)))
                    }
                  }}
                  onBlur={() => {
                    // Validate and clamp on blur
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="points-asc">Points (croissant)</option>
              <option value="points-desc">Points (décroissant)</option>
            </select>
          </div>

          {/* Reset Button - Always visible to prevent layout shift */}
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setMinPoints(absoluteMin)
              setMaxPoints(absoluteMax)
              setSelectedArchetype('all')
            }}
            disabled={!searchQuery && minPoints === absoluteMin && maxPoints === absoluteMax && selectedArchetype === 'all'}
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((characterClass) => (
          <Link
            key={characterClass.name}
            to={`/classes/${getClassSlug(characterClass.name)}`}
            className="block"
          >
            <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getClassColor(characterClass.name).replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                      {getClassIcon(characterClass.name)}
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {characterClass.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {getClassArchetype(characterClass)}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardDescription className="line-clamp-3">
                  {(characterClass.description || 'Aucune description disponible').slice(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{characterClass.base_stats.health} PV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{characterClass.base_stats.speed} Vit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatIcon(getHighestStat(characterClass).key)}
                    <span className="font-medium">{getHighestStat(characterClass).value} {getHighestStat(characterClass).name.slice(0, 3).toUpperCase()}</span>
                  </div>
                  {(() => {
                    const pointBuy = calculateTotalPointBuy(characterClass, weapons, armors, skills, consumables)
                    return (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">{pointBuy.total} pts</span>
                      </div>
                    )
                  })()}
                </div>

                {/* Preview of abilities */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {characterClass.spells && characterClass.spells.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {characterClass.spells.length} sort{characterClass.spells.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {characterClass.skills && characterClass.skills.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {characterClass.skills.length} compétence{characterClass.skills.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {characterClass.equipment.weapons && characterClass.equipment.weapons.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {characterClass.equipment.weapons.length} arme{characterClass.equipment.weapons.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
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