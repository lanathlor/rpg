import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Heart,
  Gauge,
  Shield,
  Sword,
  Zap,
  Brain,
  Eye,
  Target,
  Activity,
  Star,
  Hand
} from 'lucide-react'
import type { CharacterClass, Entity } from '@/types'
import { getHighestStat } from '@/lib/characterUtils'

interface CharacterCardProps {
  character: CharacterClass | Entity
  slug: string
  basePath: string // 'classes' or 'entites'
  icon: React.ReactNode
  iconColor: string
  badges?: React.ReactNode // Custom badges for class-specific or entity-specific content
  extraStats?: React.ReactNode // Custom stats like point buy for classes
}

const getStatIcon = (statKey: string) => {
  switch (statKey) {
    case 'force':
      return <Sword className="h-4 w-4 text-red-500" />
    case 'dexterite':
      return <Zap className="h-4 w-4 text-yellow-500" />
    case 'constitution':
      return <Activity className="h-4 w-4 text-green-500" />
    case 'intelligence':
      return <Brain className="h-4 w-4 text-purple-500" />
    case 'perception':
      return <Eye className="h-4 w-4 text-blue-500" />
    case 'precision':
      return <Target className="h-4 w-4 text-orange-500" />
    case 'charisme':
      return <Star className="h-4 w-4 text-pink-500" />
    default:
      return <Hand className="h-4 w-4 text-gray-500" />
  }
}

export function CharacterCard({
  character,
  slug,
  basePath,
  icon,
  iconColor,
  badges,
  extraStats
}: CharacterCardProps) {
  const highestStat = getHighestStat(character.stats)

  return (
    <Link
      to={`/${basePath}/${slug}`}
      className="block"
    >
      <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${iconColor.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                {icon}
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {character.name}
                </CardTitle>
                {badges && (
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {badges}
                  </div>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <CardDescription className="line-clamp-3">
            {(character.description || 'Aucune description disponible').slice(0, 150)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-medium">{character.base_stats.health} PV</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{character.base_stats.speed} Vit</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatIcon(highestStat.key)}
              <span className="font-medium">{highestStat.value} {highestStat.name.slice(0, 3).toUpperCase()}</span>
            </div>
            {extraStats}
          </div>

          {/* Resistances - show if any non-zero */}
          {character.innate_resistances &&
            (character.innate_resistances.RMEC > 0 ||
             character.innate_resistances.RRAD > 0 ||
             character.innate_resistances.RINT > 0) && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Résist:</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-stone-500" />
                  <span className="font-medium">{character.innate_resistances.RMEC}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-orange-500" />
                  <span className="font-medium">{character.innate_resistances.RRAD}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">{character.innate_resistances.RINT}</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview of abilities */}
          <div className="mt-4 flex flex-wrap gap-2">
            {character.spells && character.spells.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {character.spells.length} sort{character.spells.length > 1 ? 's' : ''}
              </Badge>
            )}
            {character.skills && character.skills.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {character.skills.length} compétence{character.skills.length > 1 ? 's' : ''}
              </Badge>
            )}
            {character.equipment.weapons && character.equipment.weapons.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {character.equipment.weapons.length} arme{character.equipment.weapons.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
