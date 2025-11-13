import { useState } from 'react'
import { useArmors } from '@/lib/dataProvider'
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
import { ArmorDetail } from '@/components/ArmorDetail'
import { Shield, Shirt, HardHat, Users, Zap, Cog, Search, Filter } from 'lucide-react'
import type { Armor } from '@/types'

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'armure':
      return <Shield className="h-4 w-4" />
    case 'vêtement':
      return <Shirt className="h-4 w-4" />
    case 'casque':
      return <HardHat className="h-4 w-4" />
    case 'exosquelette':
      return <Users className="h-4 w-4" />
    case 'implant':
      return <Zap className="h-4 w-4" />
    case 'drone':
      return <Cog className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'légère':
    case 'légere':
      return <Shirt className="h-4 w-4" />
    case 'lourde':
      return <Shield className="h-4 w-4" />
    case 'bouclier':
      return <Shield className="h-4 w-4" />
    case 'combat':
      return <Users className="h-4 w-4" />
    case 'vitesse':
      return <Zap className="h-4 w-4" />
    case 'militaire':
      return <HardHat className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'armure':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'vêtement':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'casque':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'exosquelette':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'implant':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'drone':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'légère':
    case 'légere':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'lourde':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'bouclier':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'combat':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'vitesse':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'militaire':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'stabilisateur':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'traque':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function ArmorsPage() {
  const { armors, loading } = useArmors()
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  // Get unique categories and types for filters
  const categories = [...new Set(armors.map(armor => armor.category).filter(Boolean))].sort()
  const types = [...new Set(armors.map(armor => armor.type).filter(Boolean))].sort()

  // Filter armors
  const filteredArmors = armors.filter((armor) => {
    const matchesSearch =
      armor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (armor.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || armor.category === selectedCategory
    const matchesType = !selectedType || armor.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  const openArmorDetail = (armor: Armor) => {
    setSelectedArmor(armor)
  }

  const closeArmorDetail = () => {
    setSelectedArmor(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des armures...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Armures</h1>
        <p className="text-lg text-muted-foreground">
          {filteredArmors.length} sur {armors.length} {armors.length === 1 ? 'armure' : 'armures'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une armure..."
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
                  {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
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

      {/* Armors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArmors.map((armor) => (
          <Card
            key={armor.name}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openArmorDetail(armor)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{armor.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getCategoryColor(armor.category || '')}>
                    {getCategoryIcon(armor.category || '')}
                    <span className="ml-1">{armor.category}</span>
                  </Badge>
                  {armor.type && (
                    <Badge className={getTypeColor(armor.type)}>
                      {getTypeIcon(armor.type)}
                      <span className="ml-1">{armor.type}</span>
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {(armor.description || 'Aucune description disponible').slice(0, 120)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {armor.subcategory && (
                  <div className="text-sm">
                    <strong>Sous-catégorie:</strong> {armor.subcategory}
                  </div>
                )}
                <div className="text-sm space-y-1">
                  {armor.stats.armor_value && (
                    <div><strong>Valeur d'armure:</strong> {armor.stats.armor_value}</div>
                  )}
                  {armor.stats.defense_bonus && (
                    <div><strong>Bonus de défense:</strong> {armor.stats.defense_bonus}</div>
                  )}
                  {armor.stats.stat_bonus && (
                    <div><strong>Bonus de stat:</strong> {armor.stats.stat_bonus}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArmors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory || selectedType
              ? 'Aucune armure ne correspond aux critères de recherche.'
              : 'Aucune armure trouvée.'}
          </p>
        </div>
      )}

      {/* Armor Detail Modal */}
      <Dialog open={!!selectedArmor} onOpenChange={closeArmorDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'armure</DialogTitle>
          </DialogHeader>
          {selectedArmor && <ArmorDetail armor={selectedArmor} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}