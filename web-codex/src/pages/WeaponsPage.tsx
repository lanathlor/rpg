import { useState } from 'react'
import { useWeapons } from '@/lib/dataProvider'
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
import { WeaponDetail } from '@/components/WeaponDetail'
import { Sword, Target, Shield, Zap, Crosshair, Search, Filter } from 'lucide-react'
import type { Weapon } from '@/types'

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'arme de corps à corps':
      return <Sword className="h-4 w-4" />
    case 'arme à distance':
      return <Target className="h-4 w-4" />
    case 'arme d\'épaule':
      return <Target className="h-4 w-4" />
    case 'arme de poing':
      return <Crosshair className="h-4 w-4" />
    case 'arme défensive':
      return <Shield className="h-4 w-4" />
    case 'arme électronique':
      return <Zap className="h-4 w-4" />
    default:
      return <Sword className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'épées':
    case 'lames':
      return <Sword className="h-4 w-4" />
    case 'arcs':
    case 'arbalètes':
      return <Target className="h-4 w-4" />
    case 'fusils':
    case 'armes automatiques':
      return <Target className="h-4 w-4" />
    case 'pistolets':
      return <Crosshair className="h-4 w-4" />
    case 'boucliers':
      return <Shield className="h-4 w-4" />
    default:
      return <Sword className="h-4 w-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'arme de corps à corps':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'arme à distance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'arme d\'épaule':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'arme de poing':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'arme défensive':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'arme électronique':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'épées':
    case 'lames':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'arcs':
    case 'arbalètes':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'fusils':
    case 'armes automatiques':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'pistolets':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'boucliers':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'bâtons':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function WeaponsPage() {
  const { weapons, loading } = useWeapons()
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  // Get unique categories and types for filters
  const categories = [...new Set(weapons.map(weapon => weapon.category))].sort()
  const types = [...new Set(weapons.map(weapon => weapon.type))].sort()

  // Filter weapons
  const filteredWeapons = weapons.filter((weapon) => {
    const matchesSearch =
      (weapon.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (weapon.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || weapon.category === selectedCategory
    const matchesType = !selectedType || weapon.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const openWeaponDetail = (weapon: Weapon) => {
    setSelectedWeapon(weapon)
  }

  const closeWeaponDetail = () => {
    setSelectedWeapon(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des armes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Armes</h1>
        <p className="text-lg text-muted-foreground">
          {filteredWeapons.length} sur {weapons.length} {weapons.length === 1 ? 'arme' : 'armes'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une arme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="">Tous les types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {(selectedCategory || selectedType || searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('')
                setSelectedType('')
                setSearchQuery('')
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Weapons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWeapons.map((weapon) => (
          <Card
            key={weapon.name}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openWeaponDetail(weapon)}
          >
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg flex-1 min-w-0">{weapon.name}</CardTitle>
                <div className="flex gap-2 flex-wrap flex-shrink-0">
                  <Badge className={getCategoryColor(weapon.category || '')}>
                    {getCategoryIcon(weapon.category || '')}
                    <span className="ml-1 capitalize">{weapon.category}</span>
                  </Badge>
                  <Badge className={getTypeColor(weapon.type)}>
                    {getTypeIcon(weapon.type)}
                    <span className="ml-1 capitalize">{weapon.type}</span>
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {(weapon.description || 'Aucune description disponible').slice(0, 120)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Sous-catégorie:</strong> {weapon.subcategory}
                </div>
                <div className="text-sm space-y-1">
                  <div><strong>Dégâts:</strong> {weapon.stats.damage}</div>
                  <div><strong>Type d'attaque:</strong> {weapon.stats.attack_type}</div>
                  {weapon.stats.range && (
                    <div><strong>Portée:</strong> {weapon.stats.range}</div>
                  )}
                  {weapon.cost && (
                    <div className="font-medium text-green-600 dark:text-green-400">
                      <strong>Coût:</strong> {weapon.cost}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWeapons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory || selectedType
              ? 'Aucune arme ne correspond aux critères de recherche.'
              : 'Aucune arme trouvée.'}
          </p>
        </div>
      )}

      {/* Weapon Detail Modal */}
      <Dialog open={!!selectedWeapon} onOpenChange={closeWeaponDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'arme</DialogTitle>
          </DialogHeader>
          {selectedWeapon && <WeaponDetail weapon={selectedWeapon} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}