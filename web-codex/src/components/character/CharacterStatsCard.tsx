import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {React.cloneElement(getStatIcon(getHighestStat(character).key), { className: "h-5 w-5" })}
          Caractéristiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(character.stats).map(([statName, value]) => (
            <div key={statName} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatIcon(statName)}
                <span className="text-sm font-medium capitalize">
                  {statName === 'dexterite' ? 'Dextérité' : statName}
                </span>
              </div>
              <Badge variant="secondary">{value}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
