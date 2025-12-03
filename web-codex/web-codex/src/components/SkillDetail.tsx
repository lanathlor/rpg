import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Skill } from '@/types'
import { Sword, Shield, Book, Wrench, Target, Zap, Trophy } from 'lucide-react'
import { getCompetenceTier } from '@/lib/pointBuyCalculator'

interface SkillDetailProps {
  skill: Skill
}

const getSubcategoryIcon = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'combat':
      return <Sword className="h-4 w-4" />
    case 'défensive':
      return <Shield className="h-4 w-4" />
    case 'connaissance':
      return <Book className="h-4 w-4" />
    case 'technique':
      return <Wrench className="h-4 w-4" />
    case 'précision':
      return <Target className="h-4 w-4" />
    case 'mobilité':
      return <Zap className="h-4 w-4" />
    default:
      return <Book className="h-4 w-4" />
  }
}

const getSubcategoryColor = (subcategory: string) => {
  switch (subcategory.toLowerCase()) {
    case 'combat':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'défensive':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'connaissance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'technique':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'précision':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'mobilité':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function SkillDetail({ skill }: SkillDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{skill.name}</h1>
            {skill.subcategory && (
              <p className="text-lg text-muted-foreground mt-1">{skill.subcategory}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              <Book className="h-4 w-4" />
              <span className="ml-1">{skill.category}</span>
            </Badge>
            {skill.subcategory && (
              <Badge className={getSubcategoryColor(skill.subcategory)}>
                {getSubcategoryIcon(skill.subcategory)}
                <span className="ml-1 capitalize">{skill.subcategory}</span>
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {skill.description || 'Aucune description disponible'}
          </p>
        </div>
      </div>

      <Separator />

      {/* Skill Effects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Effets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {skill.effect.multiple_attacks && (
            <div>
              <span className="font-medium text-sm text-red-600 dark:text-red-400">Attaques multiples:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.multiple_attacks}
              </div>
            </div>
          )}
          {skill.effect.protection_bonus && (
            <div>
              <span className="font-medium text-sm text-green-600 dark:text-green-400">Bonus de protection:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.protection_bonus}
              </div>
            </div>
          )}
          {skill.effect.stat_bonus && (
            <div>
              <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Bonus de statistique:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.stat_bonus}
              </div>
            </div>
          )}
          {skill.effect.movement_bonus && (
            <div>
              <span className="font-medium text-sm text-yellow-600 dark:text-yellow-400">Bonus de mouvement:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.movement_bonus}
              </div>
            </div>
          )}
          {skill.effect.detection_bonus && (
            <div>
              <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Bonus de détection:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.detection_bonus}
              </div>
            </div>
          )}
          {skill.effect.spell_recognition && (
            <div>
              <span className="font-medium text-sm text-indigo-600 dark:text-indigo-400">Reconnaissance des sorts:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.spell_recognition}
              </div>
            </div>
          )}
          {skill.effect.tech_bonus && (
            <div>
              <span className="font-medium text-sm text-orange-600 dark:text-orange-400">Bonus technique:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.tech_bonus}
              </div>
            </div>
          )}
          {skill.effect.repair_ability && (
            <div>
              <span className="font-medium text-sm text-teal-600 dark:text-teal-400">Capacité de réparation:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.repair_ability}
              </div>
            </div>
          )}
          {skill.effect.spell_enhancement && (
            <div>
              <span className="font-medium text-sm text-violet-600 dark:text-violet-400">Amélioration des sorts:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.spell_enhancement}
              </div>
            </div>
          )}
          {skill.effect.passive_bonus && (
            <div>
              <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Bonus passif:</span>
              <div className="text-sm text-muted-foreground mt-1">
                {skill.effect.passive_bonus}
              </div>
            </div>
          )}
          {skill.effect.special_abilities && skill.effect.special_abilities.length > 0 && (
            <div>
              <span className="font-medium text-sm text-pink-600 dark:text-pink-400">Capacités spéciales:</span>
              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                {skill.effect.special_abilities.map((ability, index) => (
                  <div key={index}>• {ability}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Point Cost */}
      {skill.point_cost !== undefined && (() => {
        const tier = getCompetenceTier(skill.point_cost)
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Coût en points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className={`h-6 w-6 ${tier.colorClass}`} />
                  <div>
                    <div className="text-sm text-muted-foreground">Coût</div>
                    <div className={`text-2xl font-bold ${tier.colorClass}`}>
                      {skill.point_cost} points
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={`${tier.colorClass} text-lg px-3 py-1`}>
                  Tier {tier.tier}
                </Badge>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <p>
                  Cette compétence appartient au tier <strong>{tier.tier}</strong> de puissance.
                  {tier.tier === 'S' && ' Les compétences de tier S (18 pts) sont les plus puissantes et offrent des avantages majeurs comme les attaques multiples.'}
                  {tier.tier === 'A' && ' Les compétences de tier A (15 pts) offrent des capacités défensives ou de mobilité très puissantes.'}
                  {tier.tier === 'B' && ' Les compétences de tier B (12 pts) confèrent des avantages tactiques significatifs.'}
                  {tier.tier === 'C' && ' Les compétences de tier C (10 pts) donnent des bonus de statistiques utiles.'}
                  {tier.tier === 'D' && ' Les compétences de tier D (8 pts) offrent des capacités utilitaires pratiques.'}
                  {tier.tier === 'E' && ' Les compétences de tier E (5 pts) confèrent des bonus mineurs ou des connaissances spécialisées.'}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })()}
    </div>
  )
}