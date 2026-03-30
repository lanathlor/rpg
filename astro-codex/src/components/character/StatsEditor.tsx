import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart, Gauge, Sword, Zap, Activity, Brain, Eye, Target, Star, Coins, Shield } from 'lucide-react'
import { calculateStatsCost, calculateBaseStatsCost, calculateResistancesCost } from '@/lib/pointBuyCalculator'
import { t } from '@/lib/i18n'
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
            <CardTitle>{t('stats.baseStats')}</CardTitle>
            <Badge variant="secondary" className="text-base">
              {`${totalBaseStatsCost} ${t('common.pts')}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                {t('stats.healthLabel')}
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
                {t('stats.healthHelp')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Gauge className="h-4 w-4 text-blue-500" />
                {t('stats.speedLabel')}
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
                {t('stats.speedHelp')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-amber-500" />
                {t('stats.budgetLabel')}
              </label>
              <Input
                type="number"
                value={startingCredits}
                onChange={(e) => onUpdateStartingCredits(parseInt(e.target.value) || 0)}
                min={0}
                step={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {budgetPointCost > 0 ? `${t('common.cost')} ${budgetPointCost} ${t('common.pts')} (400 ₵ = 1 pt)` : t('stats.budgetFree')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('stats.innateResistances')}</CardTitle>
            <Badge variant="secondary" className="text-base">
              {`${totalResistancesCost} ${t('common.pts')}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-stone-500" />
                {t('stats.rmecLabel')}
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
              <p className="text-xs text-muted-foreground mt-1">{t('stats.rmecHelp')}</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-500" />
                {t('stats.rradLabel')}
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
              <p className="text-xs text-muted-foreground mt-1">{t('stats.rradHelp')}</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-purple-500" />
                {t('stats.rintLabel')}
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
              <p className="text-xs text-muted-foreground mt-1">{t('stats.rintHelp')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('stats.mainStats')}</CardTitle>
            <Badge variant="secondary" className="text-base">
              {`${totalStatsCost} ${t('common.pts')}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              { key: 'force', label: t('common.stat.force'), icon: Sword, color: 'text-red-500' },
              { key: 'dexterite', label: t('common.stat.dexterite'), icon: Zap, color: 'text-yellow-500' },
              { key: 'constitution', label: t('common.stat.constitution'), icon: Activity, color: 'text-green-500' },
              { key: 'intelligence', label: t('common.stat.intelligence'), icon: Brain, color: 'text-purple-500' },
              { key: 'perception', label: t('common.stat.perception'), icon: Eye, color: 'text-blue-500' },
              { key: 'precision', label: t('common.stat.precision'), icon: Target, color: 'text-orange-500' },
              { key: 'charisme', label: t('common.stat.charisme'), icon: Star, color: 'text-pink-500' },
            ] as { key: keyof CharacterStats; label: string; icon: typeof Sword; color: string }[]).map(({ key, label, icon: Icon, color }) => (
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
