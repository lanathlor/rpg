import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, ChevronDown, ChevronUp, Coins } from 'lucide-react'
import { calculateTotalPointBuy, calculateTotalCreditsSpent, getPointTier } from '@/lib/pointBuyCalculator'
import { t } from '@/lib/i18n'
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
            {t('pointBuy.title')}
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
              [t('pointBuy.baseStats'), breakdown.baseStats],
              [t('pointBuy.resistances'), breakdown.resistances],
              [t('pointBuy.stats'), breakdown.stats],
              [t('pointBuy.affinities'), breakdown.affinities],
              [t('pointBuy.fluxSystem'), breakdown.flux],
              [t('pointBuy.equipment'), breakdown.equipment],
              [t('pointBuy.skills'), breakdown.competences],
            ] as [string, number][]).map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-1 border-t">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{`${value} ${t('common.pts')}`}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-t-2 font-bold">
              <span>{t('common.total')}</span>
              <span>{`${breakdown.total} ${t('common.pts')}`}</span>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="text-xs text-muted-foreground">
            {t('pointBuy.summaryBase')} {breakdown.baseStats} • {t('pointBuy.summaryResist')} {breakdown.resistances} • {t('pointBuy.summaryStats')} {breakdown.stats} • {t('pointBuy.summaryAffinities')} {breakdown.affinities} • {t('pointBuy.summaryFlux')} {breakdown.flux}
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
          {t('pointBuy.budget')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t('pointBuy.startingBudget')}</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{`${startingCredits.toLocaleString()} ₵`}</span>
            {budgetPointCost > 0 && (
              <Badge variant="secondary" className="text-xs">{`${budgetPointCost} ${t('common.pts')}`}</Badge>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t('pointBuy.spent')}</span>
          <span className="font-medium text-red-600 dark:text-red-400">
            {`-${creditsSpent.toLocaleString()} ₵`}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t-2">
          <span className="text-sm font-semibold">{t('pointBuy.remaining')}</span>
          <span className={`font-bold text-lg ${budgetColor}`}>
            {`${creditsRemaining.toLocaleString()} ₵`}
          </span>
        </div>
        {creditsRemaining < 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
            {`${t('pointBuy.overBudget')} ${Math.abs(creditsRemaining).toLocaleString()} ${t('pointBuy.credits')}`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
