import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart, Gauge, Sword, Zap, Activity, Brain, Eye, Target, Star, Coins, Shield } from 'lucide-react'
import { calculateStatsCost, calculateBaseStatsCost, calculateResistancesCost } from '@/lib/pointBuyCalculator'
import type { BaseStats, CharacterStats, InnateResistances } from '@/types/classes'

interface StatsEditorProps {
  baseStats: BaseStats
  innateResistances?: InnateResistances
  primaryStats: CharacterStats
  startingCredits?: number
  onUpdateBaseStats: (stats: BaseStats) => void
  onUpdateInnateResistances: (resistances: InnateResistances) => void
  onUpdatePrimaryStats: (stats: CharacterStats) => void
  onUpdateStartingCredits: (credits: number) => void
}

export function StatsEditor({
  baseStats,
  innateResistances = { RMEC: 0, RRAD: 0, RINT: 0 },
  primaryStats,
  startingCredits = 0,
  onUpdateBaseStats,
  onUpdateInnateResistances,
  onUpdatePrimaryStats,
  onUpdateStartingCredits,
}: StatsEditorProps) {
  const totalStatsCost = calculateStatsCost(primaryStats)
  const totalBaseStatsCost = calculateBaseStatsCost(baseStats)
  const totalResistancesCost = calculateResistancesCost(innateResistances)
  const budgetPointCost = Math.ceil(startingCredits / 400)

  return (
    <div className="space-y-4">
      {/* Base Stats */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Statistiques de base</CardTitle>
            <Badge variant="secondary" className="text-base">
              {totalBaseStatsCost} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                Points de vie (PV)
              </label>
              <Input
                type="number"
                value={baseStats.health}
                onChange={(e) =>
                  onUpdateBaseStats({
                    ...baseStats,
                    health: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Baseline: 30 PV (gratuit), +1 pt par 3 PV
              </p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-blue-500" />
                Vitesse
              </label>
              <Input
                type="number"
                value={baseStats.speed}
                onChange={(e) =>
                  onUpdateBaseStats({
                    ...baseStats,
                    speed: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Baseline: 3 (gratuit), +5 pts par point
              </p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-amber-500" />
                Budget de départ (Crédits)
              </label>
              <Input
                type="number"
                value={startingCredits}
                onChange={(e) =>
                  onUpdateStartingCredits(parseInt(e.target.value) || 0)
                }
                min={0}
                step={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {budgetPointCost > 0 ? `Coût: ${budgetPointCost} pts (400 ₵ = 1 pt)` : '0 crédits = gratuit'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Innate Resistances */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Résistances Innées</CardTitle>
            <Badge variant="secondary" className="text-base">
              {totalResistancesCost} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-stone-500" />
                RMEC (Mécanique)
              </label>
              <Input
                type="number"
                value={innateResistances.RMEC}
                onChange={(e) =>
                  onUpdateInnateResistances({
                    ...innateResistances,
                    RMEC: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                3 pts par point (impacts, projectiles)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-500" />
                RRAD (Radiative)
              </label>
              <Input
                type="number"
                value={innateResistances.RRAD}
                onChange={(e) =>
                  onUpdateInnateResistances({
                    ...innateResistances,
                    RRAD: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                4 pts par point (feu, froid, électricité)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-500" />
                RINT (Interne)
              </label>
              <Input
                type="number"
                value={innateResistances.RINT}
                onChange={(e) =>
                  onUpdateInnateResistances({
                    ...innateResistances,
                    RINT: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                6 pts par point (drain, corruption)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Stats */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Caractéristiques principales</CardTitle>
            <Badge variant="secondary" className="text-base">
              {totalStatsCost} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Sword className="h-4 w-4 text-red-500" />
                Force
              </label>
              <Input
                type="number"
                value={primaryStats.force}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    force: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Dextérité
              </label>
              <Input
                type="number"
                value={primaryStats.dexterite}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    dexterite: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-500" />
                Constitution
              </label>
              <Input
                type="number"
                value={primaryStats.constitution}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    constitution: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-500" />
                Intelligence
              </label>
              <Input
                type="number"
                value={primaryStats.intelligence}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    intelligence: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-500" />
                Perception
              </label>
              <Input
                type="number"
                value={primaryStats.perception}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    perception: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-orange-500" />
                Précision
              </label>
              <Input
                type="number"
                value={primaryStats.precision}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    precision: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-pink-500" />
                Charisme
              </label>
              <Input
                type="number"
                value={primaryStats.charisme}
                onChange={(e) =>
                  onUpdatePrimaryStats({
                    ...primaryStats,
                    charisme: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
