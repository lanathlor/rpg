import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Consumable } from '@/types'
import { Package, Heart, Bomb, Sparkles, Eye, Monitor } from 'lucide-react'

interface ConsumableDetailProps {
  consumable: Consumable
}

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

export function ConsumableDetail({ consumable }: ConsumableDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{consumable.name}</h1>
            {consumable.subcategory && (
              <p className="text-lg text-muted-foreground mt-1">{consumable.subcategory}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
              <Package className="h-4 w-4" />
              <span className="ml-1">{consumable.category}</span>
            </Badge>
            {consumable.subcategory && (
              <Badge className={getSubcategoryColor(consumable.subcategory)}>
                {getSubcategoryIcon(consumable.subcategory)}
                <span className="ml-1 capitalize">{consumable.subcategory}</span>
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {consumable.description || 'Aucune description disponible'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Usage Information */}
      {consumable.effect.usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="font-medium text-gray-600 dark:text-gray-400">Type d'action:</span>
              <div className="text-muted-foreground mt-1">
                {consumable.effect.usage}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Effects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Effets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {consumable.effect.healing && (
            <div>
              <span className="font-medium text-sm text-green-600 dark:text-green-400">Soins:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.healing}
              </div>
            </div>
          )}
          {consumable.effect.damage && (
            <div>
              <span className="font-medium text-sm text-red-600 dark:text-red-400">Dégâts:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.damage}
              </div>
            </div>
          )}
          {(consumable.effect.area || consumable.effect.area_effect) && (
            <div>
              <span className="font-medium text-sm text-yellow-600 dark:text-yellow-400">Zone d'effet:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.area || consumable.effect.area_effect}
              </div>
            </div>
          )}
          {consumable.effect.duration && (
            <div>
              <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Durée:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.duration}
              </div>
            </div>
          )}
          {consumable.effect.spell_enhancement && (
            <div>
              <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Amélioration magique:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.spell_enhancement}
              </div>
            </div>
          )}
          {consumable.effect.spell_block && (
            <div>
              <span className="font-medium text-sm text-indigo-600 dark:text-indigo-400">Blocage de sorts:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.spell_block}
              </div>
              {consumable.effect.exception && (
                <div className="text-xs text-muted-foreground mt-1 italic">
                  Exception: {consumable.effect.exception}
                </div>
              )}
            </div>
          )}
          {consumable.effect.emp_effect && (
            <div>
              <span className="font-medium text-sm text-orange-600 dark:text-orange-400">Effet IEM:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.emp_effect}
              </div>
            </div>
          )}
          {consumable.effect.blind_effect && (
            <div>
              <span className="font-medium text-sm text-cyan-600 dark:text-cyan-400">Effet d'aveuglement:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.blind_effect}
              </div>
            </div>
          )}
          {consumable.effect.special && (
            <div>
              <span className="font-medium text-sm text-pink-600 dark:text-pink-400">Effet spécial:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {consumable.effect.special}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}