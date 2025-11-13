import { useState } from 'react'
import { useConsumables } from '@/lib/dataProvider'
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
import { ConsumableDetail } from '@/components/ConsumableDetail'
import { Package, Heart, Bomb, Sparkles, Eye, Monitor, Search, Filter } from 'lucide-react'
import type { Consumable } from '@/types'

const getSubcategoryIcon = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'médical':
      return <Heart className="h-4 w-4" />
    case 'explosive':
      return <Bomb className="h-4 w-4" />
    case 'magique':
      return <Sparkles className="h-4 w-4" />
    case 'tactique':
      return <Eye className="h-4 w-4" />
    case 'technologique':
      return <Monitor className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getSubcategoryColor = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'médical':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'explosive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'magique':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'tactique':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'technologique':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function ConsumablesPage() {
  const { consumables, loading } = useConsumables()
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')

  // Get unique subcategories for filters
  const subcategories = [...new Set(consumables.map(consumable => consumable.subcategory).filter(Boolean))].sort()

  // Filter consumables
  const filteredConsumables = consumables.filter((consumable) => {
    const matchesSearch =
      consumable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (consumable.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubcategory = !selectedSubcategory || consumable.subcategory === selectedSubcategory

    return matchesSearch && matchesSubcategory
  })

  const openConsumableDetail = (consumable: Consumable) => {
    setSelectedConsumable(consumable)
  }

  const closeConsumableDetail = () => {
    setSelectedConsumable(null)
  }

  // Helper function to display effect preview
  const getEffectPreview = (consumable: Consumable) => {
    const effects = []
    if (consumable.effect.healing) effects.push(`Soins: ${consumable.effect.healing}`)
    if (consumable.effect.damage) effects.push(`Dégâts: ${consumable.effect.damage}`)
    if (consumable.effect.usage) effects.push(`Usage: ${consumable.effect.usage}`)
    if (consumable.effect.area || consumable.effect.area_effect) effects.push(`Zone: ${consumable.effect.area || consumable.effect.area_effect}`)
    if (consumable.effect.spell_enhancement) effects.push('Amélioration magique')
    if (consumable.effect.spell_block) effects.push('Anti-magie')
    if (consumable.effect.emp_effect) effects.push('IEM')
    if (consumable.effect.blind_effect) effects.push('Aveuglement')

    return effects.slice(0, 2).join(' • ') || 'Voir les détails'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des consommables...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consommables</h1>
        <p className="text-lg text-muted-foreground">
          {filteredConsumables.length} sur {consumables.length} {consumables.length === 1 ? 'consommable' : 'consommables'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un consommable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
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

          {(selectedSubcategory || searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSubcategory('')
                setSearchQuery('')
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Consumables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsumables.map((consumable) => (
          <Card
            key={consumable.name}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openConsumableDetail(consumable)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{consumable.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                    <Package className="h-4 w-4" />
                    <span className="ml-1">{consumable.category}</span>
                  </Badge>
                  {consumable.subcategory && (
                    <Badge className={getSubcategoryColor(consumable.subcategory)}>
                      {getSubcategoryIcon(consumable.subcategory)}
                      <span className="ml-1">{consumable.subcategory}</span>
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {(consumable.description || 'Aucune description disponible').slice(0, 120)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Effets:</strong> {getEffectPreview(consumable)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConsumables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedSubcategory
              ? 'Aucun consommable ne correspond aux critères de recherche.'
              : 'Aucun consommable trouvé.'}
          </p>
        </div>
      )}

      {/* Consumable Detail Modal */}
      <Dialog open={!!selectedConsumable} onOpenChange={closeConsumableDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du consommable</DialogTitle>
          </DialogHeader>
          {selectedConsumable && <ConsumableDetail consumable={selectedConsumable} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}