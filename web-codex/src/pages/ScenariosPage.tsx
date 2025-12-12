import { useState } from 'react'
import { useScenarios } from '@/lib/dataProvider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Map,
  Clock,
  Users,
  Search,
  ArrowRight,
  Star,
  Target,
  X,
  CheckCircle,
} from 'lucide-react'
import type { Scenario } from '@/types'
import { ScenarioDetail } from '@/components/ScenarioDetail'

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'advanced':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'expert':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getDifficultyLabel = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner': return 'Débutant'
    case 'intermediate': return 'Intermédiaire'
    case 'advanced': return 'Avancé'
    case 'expert': return 'Expert'
    default: return difficulty || 'Non défini'
  }
}

export function ScenariosPage() {
  const { scenarios, loading } = useScenarios()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name-asc')
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  // Extract unique values for filters
  const difficulties = ['all', ...new Set(scenarios.map(s => s.difficulty).filter(Boolean))]
  const themes = ['all', ...new Set(scenarios.map(s => s.theme).filter(Boolean))]

  // Filter scenarios
  const filteredScenarios = scenarios.filter((scenario) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      scenario.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty

    // Theme filter
    const matchesTheme = selectedTheme === 'all' || scenario.theme === selectedTheme

    return matchesSearch && matchesDifficulty && matchesTheme
  })

  // Sort scenarios
  const sortedScenarios = [...filteredScenarios].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '')
      case 'difficulty-asc': {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }
        const aVal = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0
        const bVal = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0
        return aVal - bVal
      }
      case 'difficulty-desc': {
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }
        const aVal = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0
        const bVal = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0
        return bVal - aVal
      }
      default:
        return 0
    }
  })

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedDifficulty('all')
    setSelectedTheme('all')
    setSortBy('name-asc')
  }

  const hasActiveFilters = searchQuery || selectedDifficulty !== 'all' || selectedTheme !== 'all' || sortBy !== 'name-asc'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des scénarios...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scénarios</h1>
        <p className="text-lg text-muted-foreground">
          Aventures one-shot, campagnes et scénarios prêts à jouer
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, description ou tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Difficulty Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Difficulté</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Toutes difficultés</option>
              {difficulties.filter(d => d !== 'all').map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {getDifficultyLabel(difficulty)}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Thème</label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">Tous les thèmes</option>
              {themes.filter(t => t !== 'all').map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Tri</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="difficulty-asc">Difficulté (facile → difficile)</option>
              <option value="difficulty-desc">Difficulté (difficile → facile)</option>
            </select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-[42px]"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {sortedScenarios.length} scénario{sortedScenarios.length > 1 ? 's' : ''} trouvé{sortedScenarios.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Scenarios Grid */}
      {sortedScenarios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun scénario trouvé avec ces critères.</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters} className="mt-4">
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedScenarios.map((scenario) => (
            <Card
              key={scenario.name}
              className="hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
              onClick={() => setSelectedScenario(scenario)}
            >
              <CardHeader className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {scenario.name}
                    </CardTitle>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {scenario.difficulty && (
                    <Badge className={getDifficultyColor(scenario.difficulty)}>
                      {getDifficultyLabel(scenario.difficulty)}
                    </Badge>
                  )}
                  {scenario.theme && (
                    <Badge variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      {scenario.theme}
                    </Badge>
                  )}
                  {scenario.playtested && (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Testé
                    </Badge>
                  )}
                </div>

                <CardDescription className="line-clamp-3 mb-3">
                  {scenario.description}
                </CardDescription>

                {/* Quick Info */}
                <div className="space-y-1 text-sm text-muted-foreground">
                  {scenario.session_info?.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{scenario.session_info.duration}</span>
                    </div>
                  )}
                  {scenario.session_info?.player_count && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{scenario.session_info.player_count} joueurs</span>
                    </div>
                  )}
                  {scenario.session_info?.recommended_points && (
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3" />
                      <span>{scenario.session_info.recommended_points}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {scenario.tags && scenario.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {scenario.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {scenario.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{scenario.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedScenario} onOpenChange={() => setSelectedScenario(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedScenario && <ScenarioDetail scenario={selectedScenario} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
