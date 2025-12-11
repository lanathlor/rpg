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
import { Shield, Shirt, HardHat, Users, Search, Filter, Brain, Bot, Cpu, FlaskConical, Target, Gauge, ArrowUpDown } from 'lucide-react'
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
    case 'augmentation':
      return <Brain className="h-4 w-4" />
    case 'implant':
      return <Cpu className="h-4 w-4" />
    case 'drone':
      return <Bot className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

const getSubcategoryIcon = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'plate':
      return <Shield className="h-4 w-4" />
    case 'tunique':
      return <Shirt className="h-4 w-4" />
    case 'bouclier':
      return <Shield className="h-4 w-4" />
    case 'exosquelette':
      return <Users className="h-4 w-4" />
    case 'drone':
      return <Bot className="h-4 w-4" />
    case 'neural':
      return <Brain className="h-4 w-4" />
    case 'implant':
      return <Cpu className="h-4 w-4" />
    case 'combat':
      return <Target className="h-4 w-4" />
    case 'vitesse':
      return <Gauge className="h-4 w-4" />
    case 'traque':
      return <FlaskConical className="h-4 w-4" />
    case 'stabilisateur':
      return <Shield className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'armure':
      return 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300'
    case 'vêtement':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
    case 'casque':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'exosquelette':
      return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300'
    case 'augmentation':
      return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-300'
    case 'implant':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
    case 'drone':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getSubcategoryColor = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'plate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'legere':
    case 'cuir':
      return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300'
    case 'tissue':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'tunique':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
    case 'bouclier':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
    case 'exosquelette':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'drone':
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
    case 'neural':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    case 'implant':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
    case 'combat':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
    case 'vitesse':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    case 'traque':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    case 'stabilisateur':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

// Helper function to parse cost from string like "500 cr" to number
const parseCost = (cost: string | undefined): number => {
  if (!cost) return 0
  const match = cost.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function EquipmentsPage() {
  const { armors, loading } = useArmors()
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('name-asc')

  // Get unique categories and subcategories for filters
  const categories = [...new Set(armors.map(armor => armor.category).filter(Boolean))].sort()
  const subcategories = [...new Set(armors.map(armor => armor.subcategory).filter(Boolean))].sort()

  // Filter and sort armors
  const filteredArmors = armors.filter((armor) => {
    const matchesSearch =
      (armor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (armor.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || armor.category === selectedCategory
    const matchesSubcategory = !selectedSubcategory || armor.subcategory === selectedSubcategory

    return matchesSearch && matchesCategory && matchesSubcategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '')
      case 'cost-asc':
        return parseCost(a.cost) - parseCost(b.cost)
      case 'cost-desc':
        return parseCost(b.cost) - parseCost(a.cost)
      default:
        return 0
    }
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
        <div className="text-lg">Chargement des équipements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Équipements</h1>
        <p className="text-lg text-muted-foreground">
          {filteredArmors.length} sur {armors.length} {armors.length === 1 ? 'équipement' : 'équipements'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un équipement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-3 py-2 bg-background flex-1 sm:flex-initial"
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
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="border rounded px-3 py-2 bg-background flex-1 sm:flex-initial"
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
              className="border rounded px-3 py-2 bg-background flex-1 sm:flex-initial"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="cost-desc">Coût (décroissant)</option>
              <option value="cost-asc">Coût (croissant)</option>
            </select>
          </div>

          {(selectedCategory || selectedSubcategory || searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('')
                setSelectedSubcategory('')
                setSearchQuery('')
              }}
              className="w-full sm:w-auto"
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
              <div>
                <CardTitle className="text-lg">{armor.name}</CardTitle>
                <div className="flex gap-2 flex-wrap mt-2">
                  <Badge className={getCategoryColor(armor.category || '')}>
                    {getCategoryIcon(armor.category || '')}
                    <span className="ml-1 capitalize">{armor.category}</span>
                  </Badge>
                  {armor.subcategory && (
                    <Badge className={getSubcategoryColor(armor.subcategory)}>
                      {getSubcategoryIcon(armor.subcategory)}
                      <span className="ml-1 capitalize">{armor.subcategory}</span>
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
                  {(armor.stats as any).protection_bonus && (
                    <div><strong>Bonus de protection:</strong> {(armor.stats as any).protection_bonus}</div>
                  )}
                  {armor.stats.defense_bonus && (
                    <div><strong>Bonus de défense:</strong> {armor.stats.defense_bonus}</div>
                  )}
                  {((armor.stats as any).stat_modifier || armor.stats.stat_bonus) && (
                    <div><strong>Modification de stat:</strong> {(armor.stats as any).stat_modifier || armor.stats.stat_bonus}</div>
                  )}
                  {armor.stats.armor_value && (
                    <div><strong>Valeur d'armure:</strong> {armor.stats.armor_value}</div>
                  )}
                  {armor.cost && (
                    <div className="font-medium text-green-600 dark:text-green-400">
                      <strong>Coût:</strong> {armor.cost}
                    </div>
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
            {searchQuery || selectedCategory || selectedSubcategory
              ? 'Aucun équipement ne correspond aux critères de recherche.'
              : 'Aucun équipement trouvé.'}
          </p>
        </div>
      )}

      {/* Armor Detail Modal */}
      <Dialog open={!!selectedArmor} onOpenChange={closeArmorDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'équipement</DialogTitle>
          </DialogHeader>
          {selectedArmor && <ArmorDetail armor={selectedArmor} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}