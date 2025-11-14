import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Armor } from '@/types'
import { Shield, Shirt, HardHat, Users, Zap, Cog, Brain, Bot, Cpu, FlaskConical, Target, Gauge } from 'lucide-react'

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
            {armor.subcategory && (
              <Badge className={getSubcategoryColor(armor.subcategory)}>
                {getSubcategoryIcon(armor.subcategory)}
                <span className="ml-1 capitalize">{armor.subcategory}</span>
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
            {armor.prerequisites.equipment && (
              <div>
                <span className="font-medium text-sm">Équipement:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.prerequisites.equipment}
                </div>
              </div>
            )}
            {!armor.prerequisites.affinity && !armor.prerequisites.stat && !armor.prerequisites.special && !armor.prerequisites.equipment && (
              <div className="text-sm text-muted-foreground italic">
                Aucun prérequis
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
            {/* Protection bonus - main armor value */}
            {armor.stats.protection_bonus && (
              <div>
                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Bonus de protection:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.protection_bonus}
                </div>
              </div>
            )}
            {/* Defense bonus */}
            {armor.stats.defense_bonus && (
              <div>
                <span className="font-medium text-sm text-green-600 dark:text-green-400">Bonus de défense:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.defense_bonus}
                </div>
              </div>
            )}
            {/* Stat modifier/bonus */}
            {(armor.stats.stat_modifier || armor.stats.stat_bonus) && (
              <div>
                <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Modification de statistique:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.stat_modifier || armor.stats.stat_bonus}
                </div>
              </div>
            )}
            {/* Special abilities */}
            {(armor.stats.special_ability || armor.stats.special) && (
              <div>
                <span className="font-medium text-sm text-orange-600 dark:text-orange-400">Capacité spéciale:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.special_ability || armor.stats.special}
                </div>
              </div>
            )}
            {/* Inventory bonus */}
            {armor.stats.inventory_bonus && (
              <div>
                <span className="font-medium text-sm text-indigo-600 dark:text-indigo-400">Bonus d'inventaire:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.inventory_bonus}
                </div>
              </div>
            )}
            {/* Legacy fields for backward compatibility */}
            {armor.stats.armor_value && (
              <div>
                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Valeur d'armure:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.armor_value}
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
            {/* Drone-specific stats */}
            {armor.stats.health && (
              <div>
                <span className="font-medium text-sm text-red-600 dark:text-red-400">Points de vie:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.health}
                </div>
              </div>
            )}
            {armor.stats.speed && (
              <div>
                <span className="font-medium text-sm text-yellow-600 dark:text-yellow-400">Vitesse:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.speed}
                </div>
              </div>
            )}
            {armor.stats.movement && (
              <div>
                <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Mouvement:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.movement}
                </div>
              </div>
            )}
            {armor.stats.spellcasting && (
              <div>
                <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Incantation:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.spellcasting}
                </div>
              </div>
            )}
            {armor.stats.attack_penalty && (
              <div>
                <span className="font-medium text-sm text-red-600 dark:text-red-400">Malus d'attaque:</span>
                <div className="text-sm text-muted-foreground mt-1">
                  {armor.stats.attack_penalty}
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