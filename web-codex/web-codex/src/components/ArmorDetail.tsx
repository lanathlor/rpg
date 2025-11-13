import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Armor } from '@/types'
import { Shield, Shirt, HardHat, Users, Zap, Cog } from 'lucide-react'

interface ArmorDetailProps {
  armor: Armor
}

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

export function ArmorDetail({ armor }: ArmorDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{armor.name}</h1>
            {armor.subcategory && (
              <p className="text-lg text-muted-foreground mt-1">{armor.subcategory}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(armor.category || '')}>
              {getCategoryIcon(armor.category || '')}
              <span className="ml-1">{armor.category}</span>
            </Badge>
            {armor.type && (
              <Badge className={getTypeColor(armor.type)}>
                {getTypeIcon(armor.type)}
                <span className="ml-1 capitalize">{armor.type}</span>
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {armor.description || 'Aucune description disponible'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Armor Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prérequis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {armor.prerequisites.affinity && (
              <div>
                <span className="font-medium text-sm">Affinité:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.prerequisites.affinity}
                </div>
              </div>
            )}
            {armor.prerequisites.stat && (
              <div>
                <span className="font-medium text-sm">Statistique:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.prerequisites.stat}
                </div>
              </div>
            )}
            {armor.prerequisites.special && armor.prerequisites.special !== 'aucun' && (
              <div>
                <span className="font-medium text-sm">Spécial:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.prerequisites.special}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {armor.stats.armor_value && (
              <div>
                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Valeur d'armure:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.armor_value}
                </div>
              </div>
            )}
            {armor.stats.defense_bonus && (
              <div>
                <span className="font-medium text-sm text-green-600 dark:text-green-400">Bonus de défense:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.defense_bonus}
                </div>
              </div>
            )}
            {armor.stats.movement_penalty && (
              <div>
                <span className="font-medium text-sm text-red-600 dark:text-red-400">Malus de mouvement:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.movement_penalty}
                </div>
              </div>
            )}
            {armor.stats.stat_bonus && (
              <div>
                <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Bonus de statistique:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.stat_bonus}
                </div>
              </div>
            )}
            {armor.stats.special && (
              <div>
                <span className="font-medium text-sm text-orange-600 dark:text-orange-400">Spécial:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.special}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Properties */}
      {armor.properties && armor.properties.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Propriétés spéciales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {armor.properties.map((property, index) => (
                  <Badge key={index} variant="outline">
                    {property}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Resistances */}
      {armor.resistances && armor.resistances.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résistances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {armor.resistances.map((resistance, index) => (
                  <Badge key={index} variant="outline" className="text-green-600 dark:text-green-400">
                    {resistance}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Cost */}
      {armor.cost && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coût</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {armor.cost}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}