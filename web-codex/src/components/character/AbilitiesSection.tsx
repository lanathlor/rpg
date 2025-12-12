import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Scroll } from 'lucide-react'
import { checkSpellSeriesAccess, checkSkillAccess, getDetailedAccessInfo } from '@/lib/accessUtils'
import type { CharacterClass, Entity, Spell, Skill } from '@/types'

interface AbilitiesSectionProps {
  character: CharacterClass | Entity
  spells: Spell[]
  skills: Skill[]
  onSpellClick: (spellName: string) => void
  onSkillClick: (skillName: string) => void
}

export function AbilitiesSection({
  character,
  spells,
  skills,
  onSpellClick,
  onSkillClick
}: AbilitiesSectionProps) {
  const findSpellByName = (spellName: string) => {
    return spells.find(spell => spell.spell_series === spellName || spell.name === spellName)
  }

  const findSkillByName = (skillName: string) => {
    return skills.find(skill => skill.name === skillName)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skills */}
      {character.skills && character.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Compétences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {character.skills.map((skill, index) => {
                const skillData = findSkillByName(skill)
                const accessResult = skillData ? checkSkillAccess(skillData, character) : { hasAccess: true }
                const hasAccess = accessResult.hasAccess

                return (
                  <div
                    key={index}
                    onClick={() => onSkillClick(skill)}
                    className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                      !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                    }`}
                    title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      {!hasAccess && (
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                          ✗
                        </Badge>
                      )}
                    </div>
                    {!hasAccess && accessResult.reason && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {accessResult.reason}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spells */}
      {character.spells && character.spells.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scroll className="h-5 w-5 text-purple-500" />
              Sorts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {character.spells.map((spell, index) => {
                const spellName = typeof spell === 'string' ? spell : spell.series
                const spellData = findSpellByName(spellName)
                const accessResult = spellData ? checkSpellSeriesAccess(spellData, character.affinities) : { hasAccess: true }
                const hasAccess = accessResult.hasAccess
                const displayName = typeof spell === 'string' ? spell : `${spell.series} (Niveau ${spell.level})`

                return (
                  <div
                    key={index}
                    onClick={() => onSpellClick(spellName)}
                    className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                      !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                    }`}
                    title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{displayName}</span>
                      <div className="flex items-center gap-2">
                        {!hasAccess && (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                            ✗ Restreint
                          </Badge>
                        )}
                        {hasAccess && (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                            ✓ Accessible
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!hasAccess && accessResult.reason && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {accessResult.reason}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
