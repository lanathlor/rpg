import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Zap, Battery, RefreshCw } from 'lucide-react'
import type { FluxSystem } from '@/types/classes'

interface FluxEditorProps {
  fluxSystem?: FluxSystem
  onUpdate: (flux: FluxSystem) => void
}

export function FluxEditor({ fluxSystem, onUpdate }: FluxEditorProps) {
  const flux = fluxSystem || { reserve: 0, per_turn: 0, recovery: 0 }

  // Calculate flux cost: reserve=1pt, per_turn=3pts, recovery=2pts
  const fluxCost = (flux.reserve * 1) + (flux.per_turn * 3) + (flux.recovery * 2)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Système de Flux
            </CardTitle>
            <CardDescription>
              Le Flux est l'énergie utilisée pour lancer des sorts et activer des capacités spéciales.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-base">
            {fluxCost} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4 text-purple-500" />
              Réserve de Flux
            </label>
            <Input
              type="number"
              value={flux.reserve}
              onChange={(e) =>
                onUpdate({
                  ...flux,
                  reserve: parseInt(e.target.value) || 0,
                })
              }
              min={0}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Quantité maximale de Flux disponible
            </p>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Flux par tour
            </label>
            <Input
              type="number"
              value={flux.per_turn}
              onChange={(e) =>
                onUpdate({
                  ...flux,
                  per_turn: parseInt(e.target.value) || 0,
                })
              }
              min={0}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Flux régénéré chaque tour
            </p>
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <RefreshCw className="h-4 w-4 text-green-500" />
              Récupération
            </label>
            <Input
              type="number"
              value={flux.recovery}
              onChange={(e) =>
                onUpdate({
                  ...flux,
                  recovery: parseInt(e.target.value) || 0,
                })
              }
              min={0}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Flux récupéré hors combat
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
