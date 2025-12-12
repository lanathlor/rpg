import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Gauge, Shield } from 'lucide-react'
import type { CharacterClass, Entity } from '@/types'

interface BaseStatsCardProps {
  character: CharacterClass | Entity
}

export function BaseStatsCard({ character }: BaseStatsCardProps) {
  return (
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
              <span className="text-lg font-semibold">{character.base_stats.health} PV</span>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Vitesse</span>
            <div className="flex items-center gap-2 mt-1">
              <Gauge className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-semibold">{character.base_stats.speed} m/tour</span>
            </div>
          </div>
        </div>

        {character.flux_system && (
          <div>
            <h4 className="font-medium text-sm mb-2">Système de flux</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Réserve:</span>
                <div className="font-semibold">{character.flux_system.reserve}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Par tour:</span>
                <div className="font-semibold">{character.flux_system.per_turn}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Récupération:</span>
                <div className="font-semibold">{character.flux_system.recovery}</div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium text-sm mb-2">Résistances innées</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3 text-stone-500" />
                RMEC:
              </span>
              <div className="font-semibold">{character.innate_resistances?.RMEC ?? 0}</div>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3 text-orange-500" />
                RRAD:
              </span>
              <div className="font-semibold">{character.innate_resistances?.RRAD ?? 0}</div>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3 text-purple-500" />
                RINT:
              </span>
              <div className="font-semibold">{character.innate_resistances?.RINT ?? 0}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
