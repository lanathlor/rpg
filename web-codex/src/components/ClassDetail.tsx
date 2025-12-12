import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { CharacterClass } from '@/types/classes'
import { getSchoolIcon, getSchoolColor } from '@/lib/schoolUtils'
import {
  Heart,
  Shield,
  Zap,
  Sparkles,
  Sword,
  Activity,
  Brain,
  Eye,
  Target,
  Star,
  Hand,
  Gauge,
  Swords,
} from 'lucide-react'

interface ClassDetailProps {
  characterClass: CharacterClass
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

export function ClassDetail({ characterClass }: ClassDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{characterClass.name}</h1>
          {characterClass.description && (
            <p className="text-lg text-muted-foreground mt-2 leading-relaxed">{characterClass.description}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Base Stats and Flux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Stats */}
        {characterClass.base_stats && (
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
                    <span className="text-lg font-semibold">{characterClass.base_stats.health} PV</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Vitesse</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <span className="text-lg font-semibold">{characterClass.base_stats.speed} m/tour</span>
                  </div>
                </div>
              </div>

              {characterClass.flux_system && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Système de flux</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Réserve:</span>
                      <div className="font-semibold">{characterClass.flux_system.reserve}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Par tour:</span>
                      <div className="font-semibold">{characterClass.flux_system.per_turn}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Récupération:</span>
                      <div className="font-semibold">{characterClass.flux_system.recovery}</div>
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
                    <div className="font-semibold">{characterClass.innate_resistances?.RMEC ?? 0}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3 text-orange-500" />
                      RRAD:
                    </span>
                    <div className="font-semibold">{characterClass.innate_resistances?.RRAD ?? 0}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3 text-purple-500" />
                      RINT:
                    </span>
                    <div className="font-semibold">{characterClass.innate_resistances?.RINT ?? 0}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Character Stats */}
        {characterClass.stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(characterClass.stats).map(([statName, value]) => (
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
        )}
      </div>

      {/* Affinities */}
      {characterClass.affinities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Affinités arcanotechniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Combat Affinities */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Combat</h4>
                <div className="space-y-2">
                  {['feu', 'glace', 'foudre', 'terre'].map(school => {
                    const value = (characterClass.affinities as any)[school] || 0
                    if (value > 0) {
                      return (
                        <div key={school} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <>{getSchoolIcon(school)}</>
                            <span className="text-sm capitalize">{school}</span>
                          </div>
                          <Badge className={getSchoolColor(school)}>
                            {value}
                          </Badge>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>

              {/* Utility Affinities */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Utilité</h4>
                <div className="space-y-2">
                  {['lumiere', 'biometabolique', 'quantique'].map(school => {
                    const value = (characterClass.affinities as any)[school] || 0
                    if (value > 0) {
                      return (
                        <div key={school} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <>{getSchoolIcon(school)}</>
                            <span className="text-sm capitalize">{school.replace('biometabolique', 'biométabolique')}</span>
                          </div>
                          <Badge className={getSchoolColor(school)}>
                            {value}
                          </Badge>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>

              {/* Movement Affinities */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Mouvement</h4>
                <div className="space-y-2">
                  {['aerocinétique', 'hydrodynamique'].map(school => {
                    const value = (characterClass.affinities as any)[school] || 0
                    if (value > 0) {
                      return (
                        <div key={school} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <>{getSchoolIcon(school)}</>
                            <span className="text-sm capitalize">
                              {school === 'aerocinétique' ? 'Aérocinétique' : 'Hydrodynamique'}
                            </span>
                          </div>
                          <Badge className={getSchoolColor(school)}>
                            {value}
                          </Badge>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </div>

            {/* Type Affinities */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Affinités de type</h4>
              <div className="grid grid-cols-2 gap-2">
                {['destruction', 'alteration', 'amelioration'].map(type => {
                  const value = (characterClass.affinities as any)[type] || 0
                  if (value > 0) {
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{type === 'amelioration' ? 'Amélioration' : type}</span>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment */}
      {characterClass.equipment && (
        (characterClass.equipment.weapons && characterClass.equipment.weapons.length > 0) ||
        (characterClass.equipment.armor && characterClass.equipment.armor.length > 0) ||
        (characterClass.equipment.consumables && characterClass.equipment.consumables.length > 0)
      ) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5" />
              Équipement de départ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {characterClass.equipment.weapons && characterClass.equipment.weapons.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Armes</h4>
                <div className="flex flex-wrap gap-2">
                  {characterClass.equipment.weapons.map((weapon: string, index: number) => (
                    <Badge key={index} variant="outline">
                      <Sword className="h-3 w-3 mr-1" />
                      {weapon}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {characterClass.equipment.armor && characterClass.equipment.armor.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Armures</h4>
                <div className="flex flex-wrap gap-2">
                  {characterClass.equipment.armor.map((armor: string, index: number) => (
                    <Badge key={index} variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      {armor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {characterClass.equipment.consumables && characterClass.equipment.consumables.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Consommables</h4>
                <div className="flex flex-wrap gap-2">
                  {characterClass.equipment.consumables.map((item, index) => (
                    <Badge key={index} variant="outline">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {item.name} {item.quantity > 1 && `x${item.quantity}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}