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

  // Calculate point buy breakdown
  const breakdown = calculateTotalPointBuy(
    character,
    weapons,
    armors,
    skills,
    consumables
  )

  const tier = getPointTier(breakdown.total)

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Points de build
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 px-2"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Total Points with Tier Badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl font-bold">{breakdown.total}</div>
          <Badge className={tier.colorClass}>
            {tier.name}
          </Badge>
        </div>

        {/* Breakdown */}
        {expanded && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Stats de base (PV/Vitesse)</span>
              <span className="font-medium">{breakdown.baseStats} pts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Résistances innées</span>
              <span className="font-medium">{breakdown.resistances} pts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Statistiques</span>
              <span className="font-medium">{breakdown.stats} pts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Affinités</span>
              <span className="font-medium">{breakdown.affinities} pts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Système de Flux</span>
              <span className="font-medium">{breakdown.flux} pts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Équipement</span>
              <span className="font-medium">{breakdown.equipment} pts</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t">
              <span className="text-muted-foreground">Compétences</span>
              <span className="font-medium">{breakdown.competences} pts</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t-2 font-bold">
              <span>Total</span>
              <span>{breakdown.total} pts</span>
            </div>
          </div>
        )}

        {/* Compact View */}
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
  // Calculate money spent
  const creditsSpent = calculateTotalCreditsSpent(
    character.equipment,
    weapons,
    armors,
    consumables
  )

  const startingCredits = character.starting_credits || 0
  const creditsRemaining = startingCredits - creditsSpent
  const budgetPointCost = Math.ceil(startingCredits / 400)

  // Determine color based on budget status
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
        {/* Starting Budget */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Budget de départ:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{startingCredits.toLocaleString()} ₵</span>
            {budgetPointCost > 0 && (
              <Badge variant="secondary" className="text-xs">
                {budgetPointCost} pts
              </Badge>
            )}
          </div>
        </div>

        {/* Credits Spent */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Dépensé:</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            -{creditsSpent.toLocaleString()} ₵
          </span>
        </div>

        {/* Credits Remaining */}
        <div className="flex justify-between items-center pt-2 border-t-2">
          <span className="text-sm font-semibold">Restant:</span>
          <span className={`font-bold text-lg ${budgetColor}`}>
            {creditsRemaining.toLocaleString()} ₵
          </span>
        </div>

        {/* Warning if over budget */}
        {creditsRemaining < 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
            ⚠️ Vous avez dépassé votre budget de {Math.abs(creditsRemaining).toLocaleString()} crédits
          </div>
        )}
      </CardContent>
    </Card>
  )
}
