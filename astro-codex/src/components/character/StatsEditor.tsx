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
                  onUpdateBaseStats({ ...baseStats, health: parseInt(e.target.value) || 0 })
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
                  onUpdateBaseStats({ ...baseStats, speed: parseInt(e.target.value) || 0 })
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
                onChange={(e) => onUpdateStartingCredits(parseInt(e.target.value) || 0)}
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
                  onUpdateInnateResistances({ ...innateResistances, RMEC: parseInt(e.target.value) || 0 })
                }
                min={0}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">3 pts par point</p>
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
                  onUpdateInnateResistances({ ...innateResistances, RRAD: parseInt(e.target.value) || 0 })
                }
                min={0}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">4 pts par point</p>
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
                  onUpdateInnateResistances({ ...innateResistances, RINT: parseInt(e.target.value) || 0 })
                }
                min={0}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">6 pts par point</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            {([
              { key: 'force', label: 'Force', icon: Sword, color: 'text-red-500' },
              { key: 'dexterite', label: 'Dextérité', icon: Zap, color: 'text-yellow-500' },
              { key: 'constitution', label: 'Constitution', icon: Activity, color: 'text-green-500' },
              { key: 'intelligence', label: 'Intelligence', icon: Brain, color: 'text-purple-500' },
              { key: 'perception', label: 'Perception', icon: Eye, color: 'text-blue-500' },
              { key: 'precision', label: 'Précision', icon: Target, color: 'text-orange-500' },
              { key: 'charisme', label: 'Charisme', icon: Star, color: 'text-pink-500' },
            ] as const).map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  {label}
                </label>
                <Input
                  type="number"
                  value={primaryStats[key]}
                  onChange={(e) =>
                    onUpdatePrimaryStats({ ...primaryStats, [key]: parseInt(e.target.value) || 0 })
                  }
                  min={1}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
