import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Sparkles } from 'lucide-react'
import { getSchoolIcon, getTypeIcon } from '@/lib/schoolUtils'
import type { CharacterClass, Entity } from '@/types'
import { useArmors, useWeapons } from '@/lib/dataProvider'
import { calculateFinalAffinities } from '@/lib/statCalculator'

interface AffinitiesCardProps {
  character: CharacterClass | Entity
}

export function AffinitiesCard({ character }: AffinitiesCardProps) {
  const { armors } = useArmors()
  const { weapons } = useWeapons()

  if (!character.affinities) return null

  const finalAffinities = calculateFinalAffinities(character, armors, weapons)

  // Extract weapon-specific affinities (those not in distance, melee, schools, types)
  const weaponAffinities: { [key: string]: number } = {}
  const knownKeys = ['distance', 'melee', 'schools', 'types']

  Object.entries(character.affinities).forEach(([key, value]) => {
    if (!knownKeys.includes(key) && typeof value === 'number') {
      weaponAffinities[key] = value
    }
  })

  const renderAffinityValue = (affinityName: string, baseValue: number | undefined) => {
    if (baseValue === undefined) return null

    const calculation = finalAffinities[affinityName]
    const hasBonus = calculation !== undefined

    if (hasBonus) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <span className="text-sm text-muted-foreground">{calculation.base}</span>
              <span className="text-sm text-muted-foreground">→</span>
              <Badge variant="default" className={calculation.equipment >= 0 ? "bg-purple-600 hover:bg-purple-700" : "bg-red-600 hover:bg-red-700"}>
                {calculation.final}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <div className="font-semibold text-xs mb-2 capitalize">{affinityName.replace(/_/g, ' ')}</div>
              <div className="text-xs">Base: {calculation.base}</div>
              {calculation.breakdown.map((item, idx) => (
                <div key={idx} className={`text-xs ${item.bonus >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  {item.source}: {item.bonus >= 0 ? '+' : ''}{item.bonus}
                </div>
              ))}
              <div className="text-xs font-semibold border-t pt-1 mt-1">
                Total: {calculation.final}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }

    return <Badge variant="outline">{baseValue}</Badge>
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Affinités arcanotechniques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Combat Affinities */}
            <div>
              <h4 className="font-medium text-sm mb-3">Combat</h4>
              <div className="space-y-2">
                {character.affinities.distance !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Distance</span>
                    {renderAffinityValue('distance', character.affinities.distance)}
                  </div>
                )}
                {character.affinities.melee !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Corps à corps</span>
                    {renderAffinityValue('melee', character.affinities.melee)}
                  </div>
                )}
                {/* Weapon-specific affinities */}
                {Object.entries(weaponAffinities).map(([weapon, level]) => (
                  <div key={weapon} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{weapon.replace(/_/g, ' ')}</span>
                    {renderAffinityValue(weapon, level)}
                  </div>
                ))}
              </div>
            </div>

            {/* Schools */}
            {character.affinities.schools && Object.keys(character.affinities.schools).length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3">Écoles d'arcanotechnie</h4>
                <div className="space-y-2">
                  {Object.entries(character.affinities.schools).map(([school, level]) => {
                    const Icon = getSchoolIcon(school)
                    return (
                      <div key={school} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm capitalize">{school}</span>
                        </div>
                        {renderAffinityValue(school, level)}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Types */}
            {character.affinities.types && Object.keys(character.affinities.types).length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3">Types d'arcanotechnie</h4>
                <div className="space-y-2">
                  {Object.entries(character.affinities.types).map(([type, level]) => {
                    const Icon = getTypeIcon(type)
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm capitalize">{type}</span>
                        </div>
                        {renderAffinityValue(type, level)}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
