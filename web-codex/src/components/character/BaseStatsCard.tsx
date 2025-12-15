import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Heart, Gauge, Shield } from 'lucide-react'
import type { CharacterClass, Entity } from '@/types'
import { useArmors, useWeapons } from '@/lib/dataProvider'
import { calculateFinalBaseStats, calculateFinalFlux, calculateFinalResistances } from '@/lib/statCalculator'

interface BaseStatsCardProps {
  character: CharacterClass | Entity
}

export function BaseStatsCard({ character }: BaseStatsCardProps) {
  const { armors } = useArmors()
  const { weapons } = useWeapons()

  const finalBaseStats = calculateFinalBaseStats(character, armors, weapons)
  const finalFlux = calculateFinalFlux(character, armors, weapons)
  const finalResistances = calculateFinalResistances(character, armors, weapons)

  const fluxLabels = {
    reserve: 'Réserve',
    per_turn: 'Par tour',
    recovery: 'Récupération'
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Statistiques de base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Points de vie</span>
              <div className="flex items-center gap-2 mt-1">
                <Heart className="h-4 w-4 text-red-500" />
                {finalBaseStats.health ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <span className="text-sm text-muted-foreground">{finalBaseStats.health.base}</span>
                        <span className="text-sm text-muted-foreground">→</span>
                        <Badge variant="default" className={`${finalBaseStats.health.equipment >= 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} font-semibold`}>
                          {finalBaseStats.health.final}
                        </Badge>
                        <span className="text-sm font-semibold">PV</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-semibold text-xs mb-2">Points de vie</div>
                        <div className="text-xs">Base: {finalBaseStats.health.base}</div>
                        {finalBaseStats.health.breakdown.map((item, idx) => (
                          <div key={idx} className={`text-xs ${item.bonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.source}: {item.bonus >= 0 ? '+' : ''}{item.bonus}
                          </div>
                        ))}
                        <div className="text-xs font-semibold border-t pt-1 mt-1">
                          Total: {finalBaseStats.health.final}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-lg font-semibold">{character.base_stats.health} PV</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Vitesse</span>
              <div className="flex items-center gap-2 mt-1">
                <Gauge className="h-4 w-4 text-blue-500" />
                {finalBaseStats.speed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <span className="text-sm text-muted-foreground">{finalBaseStats.speed.base}</span>
                        <span className="text-sm text-muted-foreground">→</span>
                        <Badge variant="default" className={`${finalBaseStats.speed.equipment >= 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} font-semibold`}>
                          {finalBaseStats.speed.final}
                        </Badge>
                        <span className="text-sm font-semibold">m/tour</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-semibold text-xs mb-2">Vitesse</div>
                        <div className="text-xs">Base: {finalBaseStats.speed.base}</div>
                        {finalBaseStats.speed.breakdown.map((item, idx) => (
                          <div key={idx} className={`text-xs ${item.bonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.source}: {item.bonus >= 0 ? '+' : ''}{item.bonus}
                          </div>
                        ))}
                        <div className="text-xs font-semibold border-t pt-1 mt-1">
                          Total: {finalBaseStats.speed.final}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-lg font-semibold">{character.base_stats.speed} m/tour</span>
                )}
              </div>
            </div>
          </div>

          {character.flux_system && (
            <div>
              <h4 className="font-medium text-sm mb-2">Système de flux</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {(['reserve', 'per_turn', 'recovery'] as const).map((field) => {
                  const calculation = finalFlux[field]
                  const baseValue = character.flux_system![field] || 0
                  const hasBonus = calculation !== undefined

                  return (
                    <div key={field}>
                      <span className="text-muted-foreground">{fluxLabels[field]}:</span>
                      {hasBonus ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                              <span className="text-sm text-muted-foreground">{calculation.base}</span>
                              <span className="text-sm text-muted-foreground">→</span>
                              <Badge variant="default" className={`${calculation.equipment >= 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} font-semibold`}>
                                {calculation.final}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <div className="font-semibold text-xs mb-2">{fluxLabels[field]}</div>
                              <div className="text-xs">Base: {calculation.base}</div>
                              {calculation.breakdown.map((item, idx) => (
                                <div key={idx} className={`text-xs ${item.bonus >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
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
                        <div className="font-semibold">{baseValue}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-sm mb-2">Résistances innées</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {(['RMEC', 'RRAD', 'RINT'] as const).map((resistanceName, index) => {
                const calculation = finalResistances[resistanceName]
                const baseValue = character.innate_resistances?.[resistanceName] ?? 0
                const hasBonus = calculation !== undefined && calculation.equipment > 0
                const colors = ['text-stone-500', 'text-orange-500', 'text-purple-500']
                const badgeColors = ['bg-stone-600 hover:bg-stone-700', 'bg-orange-600 hover:bg-orange-700', 'bg-purple-600 hover:bg-purple-700']

                return (
                  <div key={resistanceName}>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Shield className={`h-3 w-3 ${colors[index]}`} />
                      {resistanceName}:
                    </span>
                    {hasBonus ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 cursor-help">
                            <span className="text-sm text-muted-foreground">{calculation.base}</span>
                            <span className="text-sm text-muted-foreground">→</span>
                            <Badge variant="default" className={`${calculation.equipment >= 0 ? badgeColors[index] : 'bg-red-600 hover:bg-red-700'} font-semibold`}>
                              {calculation.final}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="space-y-1">
                            <div className="font-semibold text-xs mb-2">{resistanceName}</div>
                            <div className="text-xs">Base (innée): {calculation.base}</div>
                            {calculation.breakdown.map((item, idx) => (
                              <div key={idx} className={`text-xs ${item.bonus >= 0 ? (index === 0 ? 'text-stone-400' : index === 1 ? 'text-orange-400' : 'text-purple-400') : 'text-red-400'}`}>
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
                      <div className="font-semibold">{baseValue}</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
