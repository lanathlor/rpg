import { useState } from 'react'
import { useSkills } from '@/lib/dataProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SkillDetail } from '@/components/SkillDetail'
import { Book, Sword, Shield, Wrench, Target, Zap, Search, Filter, Trophy, ArrowUpDown } from 'lucide-react'
import type { Skill } from '@/types'
import { getCompetenceTier } from '@/lib/pointBuyCalculator'

const getSubcategoryIcon = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'combat':
      return <Sword className="h-4 w-4" />
    case 'défensive':
      return <Shield className="h-4 w-4" />
    case 'connaissance':
      return <Book className="h-4 w-4" />
    case 'technique':
      return <Wrench className="h-4 w-4" />
    case 'précision':
      return <Target className="h-4 w-4" />
    case 'mobilité':
      return <Zap className="h-4 w-4" />
    default:
      return <Book className="h-4 w-4" />
  }
}

const getSubcategoryColor = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'combat':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'défensive':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'connaissance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'technique':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'précision':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'mobilité':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function SkillsPage() {
  const { skills, loading } = useSkills()
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [selectedTiers, setSelectedTiers] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('name-asc')

  // Get unique subcategories for filters
  const subcategories = [...new Set(skills.map(skill => skill.subcategory).filter(Boolean))].sort()

  // Toggle tier filter
  const toggleTier = (tier: string) => {
    setSelectedTiers(prev =>
      prev.includes(tier)
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    )
  }

  // Filter and sort skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubcategory = !selectedSubcategory || skill.subcategory === selectedSubcategory

    // Point tier filter
    let matchesTier = true
    if (selectedTiers.length > 0 && skill.point_cost !== undefined) {
      const tier = getCompetenceTier(skill.point_cost)
      matchesTier = selectedTiers.includes(tier.tier)
    }

    return matchesSearch && matchesSubcategory && matchesTier
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'points-asc':
        return (a.point_cost || 0) - (b.point_cost || 0)
      case 'points-desc':
        return (b.point_cost || 0) - (a.point_cost || 0)
      default:
        return 0
    }
  })

  const openSkillDetail = (skill: Skill) => {
    setSelectedSkill(skill)
  }

  const closeSkillDetail = () => {
    setSelectedSkill(null)
  }

  // Helper function to display effect preview
  const getEffectPreview = (skill: Skill) => {
    const effects = []
    if (skill.effect.multiple_attacks) effects.push(`Attaques: ${skill.effect.multiple_attacks}`)
    if (skill.effect.stat_bonus) effects.push(`Stats: ${skill.effect.stat_bonus}`)
    if (skill.effect.protection_bonus) effects.push(`Protection: ${skill.effect.protection_bonus}`)
    if (skill.effect.movement_bonus) effects.push(`Mouvement: ${skill.effect.movement_bonus}`)
    if (skill.effect.tech_bonus) effects.push(`Tech: ${skill.effect.tech_bonus}`)
    if (skill.effect.detection_bonus) effects.push(`Détection: ${skill.effect.detection_bonus}`)

    return effects.slice(0, 2).join(' • ') || 'Voir les détails'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des compétences...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compétences</h1>
        <p className="text-lg text-muted-foreground">
          {filteredSkills.length} sur {skills.length} {skills.length === 1 ? 'compétence' : 'compétences'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="border rounded px-3 py-2 bg-background"
              >
                <option value="">Toutes les sous-catégories</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
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

            {(selectedSubcategory || searchQuery || selectedTiers.length > 0) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSubcategory('')
                  setSearchQuery('')
                  setSelectedTiers([])
                }}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </div>

        {/* Tier Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Tiers:</span>
          {['S', 'A', 'B', 'C', 'D', 'E'].map((tier) => {
            const isSelected = selectedTiers.includes(tier)
            const tierInfo = getCompetenceTier(tier === 'S' ? 18 : tier === 'A' ? 15 : tier === 'B' ? 12 : tier === 'C' ? 10 : tier === 'D' ? 8 : 5)
            return (
              <Badge
                key={tier}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer ${isSelected ? tierInfo.colorClass : ''}`}
                onClick={() => toggleTier(tier)}
              >
                <Trophy className="h-3 w-3 mr-1" />
                Tier {tier}
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <Card
            key={skill.name}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openSkillDetail(skill)}
          >
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg">{skill.name}</CardTitle>
                {skill.point_cost !== undefined && (() => {
                  const tier = getCompetenceTier(skill.point_cost)
                  return (
                    <Badge variant="outline" className={`flex items-center gap-1 ${tier.colorClass}`}>
                      <Trophy className="h-3 w-3" />
                      <span className="font-semibold">Tier {tier.tier}</span>
                    </Badge>
                  )
                })()}
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs">
                  {skill.category}
                </Badge>
                {skill.subcategory && (
                  <Badge className={`${getSubcategoryColor(skill.subcategory)} text-xs`}>
                    {skill.subcategory}
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-2">
                {(skill.description || 'Aucune description disponible').slice(0, 120)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Effets:</strong> {getEffectPreview(skill)}
                </div>
                {skill.point_cost !== undefined && (
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{skill.point_cost} points</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedSubcategory
              ? 'Aucune compétence ne correspond aux critères de recherche.'
              : 'Aucune compétence trouvée.'}
          </p>
        </div>
      )}

      {/* Skill Detail Modal */}
      <Dialog open={!!selectedSkill} onOpenChange={closeSkillDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la compétence</DialogTitle>
          </DialogHeader>
          {selectedSkill && <SkillDetail skill={selectedSkill} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}