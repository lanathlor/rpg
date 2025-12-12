import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { getSchoolIcon, getTypeIcon } from '@/lib/schoolUtils'
import type { CharacterClass, Entity } from '@/types'

interface AffinitiesCardProps {
  character: CharacterClass | Entity
}

export function AffinitiesCard({ character }: AffinitiesCardProps) {
  if (!character.affinities) return null

  return (
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
            <h4 className="font-medium text-sm mb-3">Combat</h4>
            <div className="space-y-2">
              {character.affinities.distance !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Distance</span>
                  <Badge variant="outline">{character.affinities.distance}</Badge>
                </div>
              )}
              {character.affinities.melee !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Corps à corps</span>
                  <Badge variant="outline">{character.affinities.melee}</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Schools */}
          {character.affinities.schools && Object.keys(character.affinities.schools).length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3">Écoles d'arcanotechnie</h4>
              <div className="space-y-2">
                {Object.entries(character.affinities.schools).map(([school, level]) => {
                  const Icon = getSchoolIcon(school)
                  return (
                    <div key={school} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm capitalize">{school}</span>
                      </div>
                      <Badge variant="outline">{level}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Types */}
          {character.affinities.types && Object.keys(character.affinities.types).length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3">Types d'arcanotechnie</h4>
              <div className="space-y-2">
                {Object.entries(character.affinities.types).map(([type, level]) => {
                  const Icon = getTypeIcon(type)
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <Badge variant="outline">{level}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
