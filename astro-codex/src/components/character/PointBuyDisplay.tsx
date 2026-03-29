import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, ChevronDown, ChevronUp, Coins } from 'lucide-react'
import { calculateTotalPointBuy, calculateTotalCreditsSpent, getPointTier } from '@/lib/pointBuyCalculator'
import type { Character } from '@/types/character'
import type { Weapon, Armor, Skill, Consumable } from '@/types'

interface PointBuyDisplayProps {
  character: Character
  weapons: Weapon[]
  armors: Armor[]
  skills: Skill[]
  consumables: Consumable[]
}

export function PointBuyDisplay({
  character,
  weapons,
  armors,
  skills,
  consumables,
}: PointBuyDisplayProps) {
  const [expanded, setExpanded] = useState(false)

  const breakdown = calculateTotalPointBuy(character, weapons, armors, skills, consumables)
  const tier = getPointTier(breakdown.total)

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Points de build
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-6 px-2">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl font-bold">{breakdown.total}</div>
          <Badge className={tier.colorClass}>{tier.name}</Badge>
        </div>

        {expanded && (
          <div className="space-y-2 text-sm">
            {([
              ['Stats de base (PV/Vitesse)', breakdown.baseStats],
              ['Résistances innées', breakdown.resistances],
              ['Statistiques', breakdown.stats],
              ['Affinités', breakdown.affinities],
              ['Système de Flux', breakdown.flux],
              ['Équipement', breakdown.equipment],
              ['Compétences', breakdown.competences],
            ] as const).map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-1 border-t">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value} pts</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-t-2 font-bold">
              <span>Total</span>
              <span>{breakdown.total} pts</span>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="text-xs text-muted-foreground">
            Base: {breakdown.baseStats} • Résist: {breakdown.resistances} • Stats: {breakdown.stats} • Affinités: {breakdown.affinities} • Flux: {breakdown.flux}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MoneyDisplay({
  character,
  weapons,
  armors,
  consumables,
}: PointBuyDisplayProps) {
  const creditsSpent = calculateTotalCreditsSpent(character.equipment, weapons, armors, consumables)
  const startingCredits = character.starting_credits || 0
  const creditsRemaining = startingCredits - creditsSpent
  const budgetPointCost = Math.ceil(startingCredits / 400)

  const budgetColor = creditsRemaining < 0
    ? 'text-red-600 dark:text-red-400'
    : creditsRemaining === 0
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-green-600 dark:text-green-400'

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Coins className="h-4 w-4" />
          Budget (Crédits)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Budget de départ:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{startingCredits.toLocaleString()} ₵</span>
            {budgetPointCost > 0 && (
              <Badge variant="secondary" className="text-xs">{budgetPointCost} pts</Badge>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dépensé:</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            -{creditsSpent.toLocaleString()} ₵
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t-2">
          <span className="text-sm font-semibold">Restant:</span>
          <span className={`font-bold text-lg ${budgetColor}`}>
            {creditsRemaining.toLocaleString()} ₵
          </span>
        </div>
        {creditsRemaining < 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
            Budget dépassé de {Math.abs(creditsRemaining).toLocaleString()} crédits
          </div>
        )}
      </CardContent>
    </Card>
  )
}
