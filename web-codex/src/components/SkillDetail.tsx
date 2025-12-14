import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Skill, EffectType } from '@/types'
import { Sword, Shield, Book, Wrench, Target, Zap, Trophy } from 'lucide-react'
import { getCompetenceTier } from '@/lib/pointBuyCalculator'
import type { ReactNode } from 'react'

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

// Effect type configuration for dynamic rendering
const effectTypeConfig: Record<EffectType, { label: string; colorClass: string; icon: ReactNode }> = {
  combat: {
    label: 'Combat',
    colorClass: 'text-red-600 dark:text-red-400',
    icon: <Sword className="h-4 w-4 inline mr-1" />
  },
  defense: {
    label: 'Défense',
    colorClass: 'text-green-600 dark:text-green-400',
    icon: <Shield className="h-4 w-4 inline mr-1" />
  },
  movement: {
    label: 'Mouvement',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    icon: <Zap className="h-4 w-4 inline mr-1" />
  },
  technique: {
    label: 'Technique',
    colorClass: 'text-orange-600 dark:text-orange-400',
    icon: <Wrench className="h-4 w-4 inline mr-1" />
  },
  detection: {
    label: 'Détection',
    colorClass: 'text-purple-600 dark:text-purple-400',
    icon: <Target className="h-4 w-4 inline mr-1" />
  },
  passive: {
    label: 'Passif',
    colorClass: 'text-blue-600 dark:text-blue-400',
    icon: <Book className="h-4 w-4 inline mr-1" />
  },
  special: {
    label: 'Spécial',
    colorClass: 'text-pink-600 dark:text-pink-400',
    icon: <Trophy className="h-4 w-4 inline mr-1" />
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
          {skill.effects && skill.effects.length > 0 ? (
            skill.effects.map((effect, index) => {
              const config = effectTypeConfig[effect.type]
              return (
                <div key={index}>
                  <span className={`font-medium text-sm ${config.colorClass}`}>
                    {config.icon}
                    {config.label}:
                  </span>
                  <div className="text-sm text-muted-foreground mt-1">
                    {effect.description}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-sm text-muted-foreground">
              Aucun effet défini
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