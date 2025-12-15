import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Brain,
  Eye,
  Target,
  Zap,
  Sword,
  Activity,
  Star,
  Hand,
} from 'lucide-react'
import type { CharacterClass, Entity } from '@/types'
import { useArmors, useWeapons } from '@/lib/dataProvider'
import { calculateFinalStats } from '@/lib/statCalculator'

interface CharacterStatsCardProps {
  character: CharacterClass | Entity
}

const getStatIcon = (statName: string) => {
  switch (statName) {
    case 'force': return <Sword className="h-4 w-4 text-red-500" />
    case 'dexterite': return <Zap className="h-4 w-4 text-yellow-500" />
    case 'constitution': return <Activity className="h-4 w-4 text-green-500" />
    case 'intelligence': return <Brain className="h-4 w-4 text-purple-500" />
    case 'perception': return <Eye className="h-4 w-4 text-blue-500" />
    case 'precision': return <Target className="h-4 w-4 text-orange-500" />
    case 'charisme': return <Star className="h-4 w-4 text-pink-500" />
    default: return <Hand className="h-4 w-4 text-gray-500" />
  }
}

const getHighestStat = (character: CharacterClass | Entity) => {
  const stats = character.stats
  const statEntries = [
    { name: 'Force', value: stats.force, key: 'force' },
    { name: 'Dextérité', value: stats.dexterite, key: 'dexterite' },
    { name: 'Constitution', value: stats.constitution, key: 'constitution' },
    { name: 'Intelligence', value: stats.intelligence, key: 'intelligence' },
    { name: 'Perception', value: stats.perception, key: 'perception' },
    { name: 'Précision', value: stats.precision, key: 'precision' },
    { name: 'Charisme', value: stats.charisme, key: 'charisme' }
  ]

  return statEntries.reduce((highest, current) =>
    current.value > highest.value ? current : highest
  )
}

export function CharacterStatsCard({ character }: CharacterStatsCardProps) {
  const { armors } = useArmors()
  const { weapons } = useWeapons()

  // Calculate final stats with equipment bonuses
  const finalStats = calculateFinalStats(character, armors, weapons)

  const statDisplayNames: Record<string, string> = {
    force: 'Force',
    dexterite: 'Dextérité',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    perception: 'Perception',
    precision: 'Précision',
    charisme: 'Charisme'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {React.cloneElement(getStatIcon(getHighestStat(character).key), { className: "h-5 w-5" })}
          Caractéristiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(character.stats).map(([statName, baseValue]) => {
              const calculation = finalStats[statName as keyof typeof finalStats]
              const hasBonus = calculation !== undefined

              return (
                <div key={statName} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatIcon(statName)}
                    <span className="text-sm font-medium">
                      {statDisplayNames[statName] || statName}
                    </span>
                  </div>

                  {hasBonus ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <span className="text-sm text-muted-foreground">{calculation.base}</span>
                          <span className="text-sm text-muted-foreground">→</span>
                          <Badge variant="default" className={calculation.equipment >= 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
                            {calculation.final}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-1">
                          <div className="font-semibold text-xs mb-2">{statDisplayNames[statName]}</div>
                          <div className="text-xs">Base: {calculation.base}</div>
                          {calculation.breakdown.map((item, idx) => (
                            <div key={idx} className={`text-xs ${item.bonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {item.source}: {item.bonus >= 0 ? '+' : ''}{item.bonus}
                            </div>
                          ))}
                          <div className="text-xs font-semibold border-t pt-1 mt-1">
                            Total: {calculation.final}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge variant="secondary">{baseValue}</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
