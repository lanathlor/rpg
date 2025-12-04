import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Spell, SpellLevel } from '@/types'
import { getSchoolIcon, getSchoolColor, getTypeIcon, getTypeColor } from '@/lib/schoolUtils'
import { rateSpell } from '@/lib/spellRatingCalculator'
import { Zap, Target, TrendingUp } from 'lucide-react'

interface SpellDetailProps {
  spell: Spell
}


function SpellLevelDetail({ level }: { level: SpellLevel }) {
  const rating = rateSpell(level)

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline">Niveau {level.level}</Badge>
            {level.name}
          </CardTitle>
        </div>
        {level.description && (
          <CardDescription className="mt-2">
            {level.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spell Rating */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Évaluation du sort
            </h4>
            <Badge className={rating.tier.colorClass.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-') + ' text-white'}>
              {rating.tier.name}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-muted-foreground">Puissance</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {rating.powerScore.toFixed(1)}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-muted-foreground">Accessibilité</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {rating.accessibilityScore.toFixed(1)}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-muted-foreground">Valeur</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {rating.valueRating.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            {rating.tier.description} • Affinités min: {rating.bestAffinityPath.toFixed(1)}
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Prérequis</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            {/* New format: object with specific keys */}
            {level.prerequisites?.affinities?.école_requirement && (
              <div>• École: {level.prerequisites.affinities.école_requirement}</div>
            )}
            {level.prerequisites?.affinities?.type_requirement && (
              <div>• Type: {level.prerequisites.affinities.type_requirement}</div>
            )}
            {level.prerequisites?.affinities?.mixed_requirement && (
              <div>• Mixte: {level.prerequisites.affinities.mixed_requirement}</div>
            )}

            {/* Old format: array of strings */}
            {Array.isArray(level.prerequisites?.affinities) && level.prerequisites.affinities.map((affinity, index) => (
              <div key={index}>• {affinity}</div>
            ))}

            {/* Handle special prerequisites */}
            {level.prerequisites?.special && (
              <div>• {level.prerequisites.special}</div>
            )}
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Conditions</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Show flux cost if available */}
            {level.conditions?.flux_cost && (
              <div>
                <span className="font-medium">Coût de flux:</span> {level.conditions.flux_cost}
              </div>
            )}

            {/* Show recharge prominently if no flux cost, or always if present */}
            {(level.conditions?.recharge || level.recharge_time) && (
              <div className={!level.conditions?.flux_cost ? "font-semibold text-blue-600" : ""}>
                <span className="font-medium">Recharge:</span> {level.conditions?.recharge || level.recharge_time}
              </div>
            )}

            {level.conditions?.intelligence_required && (
              <div>
                <span className="font-medium">Intelligence:</span> {level.conditions.intelligence_required}
              </div>
            )}
            {level.conditions?.perception_required && (
              <div>
                <span className="font-medium">Perception:</span> {level.conditions.perception_required}
              </div>
            )}
            {level.conditions?.special && level.conditions.special !== 'aucune' && (
              <div className="col-span-2">
                <span className="font-medium">Spécial:</span> {level.conditions.special}
              </div>
            )}
          </div>
        </div>

        {/* Effects */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Effets</h4>
          <div className="space-y-1 text-sm">
            {/* Handle array effects */}
            {Array.isArray(level.effects) && level.effects.map((effect, index) => (
              <div key={index}>
                <span className="font-medium text-teal-600 dark:text-teal-400">•</span> {effect}
              </div>
            ))}

            {/* Damage Category - Red */}
            {level.effects?.damage && (
              <div>
                <span className="font-medium text-red-600 dark:text-red-400">Dégâts:</span> {level.effects.damage}
              </div>
            )}
            {level.effects?.area_damage && (
              <div>
                <span className="font-medium text-red-600 dark:text-red-400">Dégâts de zone:</span> {level.effects.area_damage}
              </div>
            )}
            {level.effects?.resistance && (
              <div>
                <span className="font-medium text-amber-600 dark:text-amber-400">Résistance:</span> <Badge variant="outline" className="ml-1">{level.effects.resistance}</Badge>
              </div>
            )}
            {level.effects?.damage_bonus && (
              <div>
                <span className="font-medium text-red-600 dark:text-red-400">Bonus dégâts:</span> {level.effects.damage_bonus}
              </div>
            )}
            {level.effects?.burning_chance && (
              <div>
                <span className="font-medium text-red-600 dark:text-red-400">Chance brûlure:</span> {level.effects.burning_chance}
              </div>
            )}

            {/* Status/Debuff Category - Purple/Orange */}
            {level.effects?.debuff && (
              <div>
                <span className="font-medium text-purple-600 dark:text-purple-400">Affaiblissement:</span> {level.effects.debuff}
              </div>
            )}
            {level.effects?.status && (
              <div>
                <span className="font-medium text-purple-600 dark:text-purple-400">Statut:</span> {level.effects.status}
              </div>
            )}
            {level.effects?.emp && (
              <div>
                <span className="font-medium text-orange-600 dark:text-orange-400">IEM:</span> {level.effects.emp}
              </div>
            )}

            {/* Movement Category - Blue */}
            {level.effects?.movement && (
              <div>
                <span className="font-medium text-blue-600 dark:text-blue-400">Mouvement:</span> {level.effects.movement}
              </div>
            )}
            {level.effects?.teleport && (
              <div>
                <span className="font-medium text-blue-600 dark:text-blue-400">Téléportation:</span> {level.effects.teleport}
              </div>
            )}

            {/* Defense Category - Green */}
            {level.effects?.protection && (
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">Protection:</span> {level.effects.protection}
              </div>
            )}
            {level.effects?.defense && (
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">Défense:</span> {level.effects.defense}
              </div>
            )}
            {level.effects?.defense_bonus && (
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">Bonus défense:</span> {level.effects.defense_bonus}
              </div>
            )}
            {level.effects?.damage_reduction && (
              <div>
                <span className="font-medium text-green-600 dark:text-green-400">Réduction dégâts:</span> {level.effects.damage_reduction}
              </div>
            )}

            {/* Attack Enhancement Category - Yellow */}
            {level.effects?.attack_bonus && (
              <div>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">Bonus attaque:</span> {level.effects.attack_bonus}
              </div>
            )}
            {level.effects?.critical_chance && (
              <div>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">Critique:</span> {level.effects.critical_chance}
              </div>
            )}
            {level.effects?.multiple_attack && (
              <div>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">Attaque multiple:</span> {level.effects.multiple_attack}
              </div>
            )}

            {/* Utility Category - Gray */}
            {level.effects?.information && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Information:</span> {level.effects.information}
              </div>
            )}
            {level.effects?.prediction && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Prédiction:</span> {level.effects.prediction}
              </div>
            )}
            {level.effects?.success && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">En cas de succès:</span> {level.effects.success}
              </div>
            )}
            {level.effects?.failure && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">En cas d'échec:</span> {level.effects.failure}
              </div>
            )}
            {level.effects?.automatic_success && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Succès auto:</span> {level.effects.automatic_success}
              </div>
            )}

            {/* Area/Technical Category - Indigo */}
            {level.effects?.area && (
              <div>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">Zone:</span> {level.effects.area}
              </div>
            )}
            {level.effects?.area_effect && (
              <div>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">Effet de zone:</span> {level.effects.area_effect === true ? 'Oui' : level.effects.area_effect}
              </div>
            )}


            {/* Special Category - Teal (kept last as catch-all) */}
            {level.effects?.special && (
              <div>
                <span className="font-medium text-teal-600 dark:text-teal-400">Spécial:</span> {level.effects.special}
              </div>
            )}
            {level.effects?.spell_enhancement && (
              <div>
                <span className="font-medium text-teal-600 dark:text-teal-400">Amélioration:</span> {level.effects.spell_enhancement}
              </div>
            )}
            {/* Handle effects.specials array */}
            {level.effects?.specials && Array.isArray(level.effects.specials) && level.effects.specials.map((special, index) => (
              <div key={index}>
                <span className="font-medium text-teal-600 dark:text-teal-400">•</span> {special}
              </div>
            ))}
          </div>
        </div>

        {/* Duration and Usage */}
        <div className="flex gap-4 text-sm">
          {level.duration && (
            <div>
              <span className="font-medium">Durée:</span> {level.duration}
            </div>
          )}
          {level.usage && (
            <div>
              <span className="font-medium">Usage:</span> {level.usage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function SpellDetail({ spell }: SpellDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{spell.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{spell.spell_series}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getSchoolColor(spell.school)}>
              {(() => {
                const Icon = getSchoolIcon(spell.school)
                return <Icon className="h-4 w-4" />
              })()}
              <span className="ml-1 capitalize">{spell.school}</span>
            </Badge>
            <Badge className={getTypeColor(spell.type)}>
              {(() => {
                const Icon = getTypeIcon(spell.type)
                return <Icon className="h-4 w-4" />
              })()}
              <span className="ml-1 capitalize">{spell.type}</span>
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {spell.description_base}
          </p>
        </div>
      </div>

      <Separator />

      {/* Levels */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Niveaux disponibles ({spell.levels.length})
        </h2>
        <div className="space-y-4">
          {spell.levels.map((level, index) => (
            <SpellLevelDetail key={`${level.level}-${index}`} level={level} />
          ))}
        </div>
      </div>
    </div>
  )
}