import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Weapon } from '@/types'
import { Sword, Target, Shield, Zap, Crosshair } from 'lucide-react'

interface WeaponDetailProps {
  weapon: Weapon
}

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

export function WeaponDetail({ weapon }: WeaponDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{weapon.name}</h1>
            {weapon.subcategory && (
              <p className="text-lg text-muted-foreground mt-1">{weapon.subcategory}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(weapon.category || '')}>
              {getCategoryIcon(weapon.category || '')}
              <span className="ml-1">{weapon.category}</span>
            </Badge>
            <Badge className={getTypeColor(weapon.type)}>
              {getTypeIcon(weapon.type)}
              <span className="ml-1 capitalize">{weapon.type}</span>
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {weapon.description || 'Aucune description disponible'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Weapon Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prérequis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weapon.prerequisites.affinity && (
              <div>
                <span className="font-medium text-sm">Affinité:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.prerequisites.affinity}
                </div>
              </div>
            )}
            {weapon.prerequisites.stat && (
              <div>
                <span className="font-medium text-sm">Statistique:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.prerequisites.stat}
                </div>
              </div>
            )}
            {weapon.prerequisites.special && weapon.prerequisites.special !== 'aucun' && (
              <div>
                <span className="font-medium text-sm">Spécial:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.prerequisites.special}
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
            {weapon.stats.damage && (
              <div>
                <span className="font-medium text-sm text-red-600 dark:text-red-400">Dégâts:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.stats.damage}
                </div>
              </div>
            )}
            {weapon.stats.attack_type && (
              <div>
                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Type d'attaque:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.stats.attack_type}
                </div>
              </div>
            )}
            {weapon.stats.defense_type && (
              <div>
                <span className="font-medium text-sm text-green-600 dark:text-green-400">Type de défense:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.stats.defense_type}
                </div>
              </div>
            )}
            {weapon.stats.range && (
              <div>
                <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Portée:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.stats.range}
                </div>
              </div>
            )}
            {weapon.stats.special && (
              <div>
                <span className="font-medium text-sm text-orange-600 dark:text-orange-400">Spécial:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {weapon.stats.special}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Properties */}
      {weapon.properties && weapon.properties.length > 0 && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Propriétés spéciales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {weapon.properties.map((property, index) => (
                  <Badge key={index} variant="outline">
                    {property}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Cost */}
      {weapon.cost && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coût</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {weapon.cost}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}