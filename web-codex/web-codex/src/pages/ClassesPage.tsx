import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClasses } from '@/lib/dataProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  Star
} from 'lucide-react'
import type { CharacterClass } from '@/types'

const getClassIcon = (className: string) => {
  const name = className.toLowerCase()
  if (name.includes('Quantotechnicien') || name.includes('quantotechnologue')) return <Sparkles className="h-5 w-5" />
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
  if (name.includes('Quantotechnicien') || name.includes('quantotechnologue')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  if (name.includes('chasseur')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  if (name.includes('horion') || name.includes('maitre')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  if (name.includes('sentinelle') || name.includes('tutelaire')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (name.includes('technologue')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  if (name.includes('spectre')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
  if (name.includes('taliste')) return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
}

const getClassArchetype = (characterClass: CharacterClass) => {
  const name = characterClass.name.toLowerCase()
  const hasSpells = characterClass.spells && characterClass.spells.length > 0
  const hasHighIntelligence = characterClass.stats.intelligence > 12
  const hasHighForce = characterClass.stats.force > 12
  const hasHighSpeed = characterClass.base_stats.speed > 4

  if (hasSpells && hasHighIntelligence) return 'Lanceur de sorts'
  if (hasHighForce && !hasSpells) return 'Combattant'
  if (hasHighSpeed && name.includes('chasseur')) return 'Tireur d\'élite'
  if (name.includes('sentinelle') || name.includes('tutelaire')) return 'Défenseur'
  if (name.includes('technologue')) return 'Technologue'
  return 'Hybride'
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
  const [searchQuery, setSearchQuery] = useState('')

  // Filter classes
  const filteredClasses = classes.filter((characterClass) => {
    const matchesSearch =
      characterClass.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (characterClass.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getClassArchetype(characterClass).toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
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

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une classe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {searchQuery && (
          <Button
            variant="outline"
            onClick={() => setSearchQuery('')}
          >
            Réinitialiser
          </Button>
        )}
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
                <div className="grid grid-cols-3 gap-4 text-sm">
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