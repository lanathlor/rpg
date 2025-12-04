import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Plus, X, Target, Swords } from 'lucide-react'
import type { AffinityStats } from '@/types/common'
import {
  SCHOOLS,
  TYPES,
  COMBAT_AFFINITIES,
  calculateAffinityCost,
  getSchoolCost,
  TYPE_COST,
  COMBAT_AFFINITY_COST,
} from '@/lib/affinityConstants'
import { getSchoolIcon, getTypeIcon } from '@/lib/schoolUtils'

interface AffinityEditorProps {
  affinities: AffinityStats
  onUpdate: (affinities: AffinityStats) => void
}

export function AffinityEditor({ affinities, onUpdate }: AffinityEditorProps) {
  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  // Get already selected schools and types
  const selectedSchools = Object.keys(affinities.schools || {})
  const selectedTypes = Object.keys(affinities.types || {})

  // Calculate total costs for each section
  const combatCost = ((affinities.distance || 0) + (affinities.melee || 0)) * COMBAT_AFFINITY_COST

  const schoolsCost = selectedSchools.reduce((total, school) => {
    const level = affinities.schools?.[school] || 0
    return total + (level * getSchoolCost(school))
  }, 0)

  const typesCost = selectedTypes.reduce((total, type) => {
    const level = affinities.types?.[type] || 0
    return total + (level * TYPE_COST)
  }, 0)

  // Available schools (not yet selected)
  const availableSchools = SCHOOLS.filter((school) => !selectedSchools.includes(school))
  const availableTypes = TYPES.filter((type) => !selectedTypes.includes(type))

  const addSchool = () => {
    if (!selectedSchool) return
    onUpdate({
      ...affinities,
      schools: {
        ...affinities.schools,
        [selectedSchool]: 1,
      },
    })
    setSelectedSchool('')
  }

  const addType = () => {
    if (!selectedType) return
    onUpdate({
      ...affinities,
      types: {
        ...affinities.types,
        [selectedType]: 1,
      },
    })
    setSelectedType('')
  }

  const updateSchoolLevel = (school: string, level: number) => {
    if (level === 0) {
      // Remove if set to 0
      const newSchools = { ...affinities.schools }
      delete newSchools[school]
      onUpdate({ ...affinities, schools: newSchools })
    } else {
      onUpdate({
        ...affinities,
        schools: {
          ...affinities.schools,
          [school]: level,
        },
      })
    }
  }

  const updateTypeLevel = (type: string, level: number) => {
    if (level === 0) {
      // Remove if set to 0
      const newTypes = { ...affinities.types }
      delete newTypes[type]
      onUpdate({ ...affinities, types: newTypes })
    } else {
      onUpdate({
        ...affinities,
        types: {
          ...affinities.types,
          [type]: level,
        },
      })
    }
  }

  const updateCombatAffinity = (key: 'distance' | 'melee', level: number) => {
    onUpdate({
      ...affinities,
      [key]: level,
    })
  }

  return (
    <div className="space-y-4">
      {/* Combat Affinities */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Affinités de combat
              </CardTitle>
              <CardDescription>
                Affinité avec les armes à distance et au corps à corps ({COMBAT_AFFINITY_COST} pts/niveau)
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base">
              {combatCost} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMBAT_AFFINITIES.map(({ key, label }) => {
              const level = affinities[key] || 0
              const cost = level * COMBAT_AFFINITY_COST
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      {label}
                    </label>
                    <Input
                      type="number"
                      value={level}
                      onChange={(e) =>
                        updateCombatAffinity(key, parseInt(e.target.value) || 0)
                      }
                      min={0}
                      max={10}
                      className="w-full"
                    />
                  </div>
                  {level > 0 && (
                    <Badge variant="secondary" className="mt-6">
                      {cost} pts
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* School Affinities */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                Affinités d'école
              </CardTitle>
              <CardDescription>
                Niveau d'affinité avec chaque école de quantotechnique
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base">
              {schoolsCost} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Schools */}
          {selectedSchools.length > 0 && (
            <div className="space-y-3">
              {selectedSchools.map((school) => {
                const level = affinities.schools?.[school] || 0
                const costPerLevel = getSchoolCost(school)
                const totalCost = costPerLevel * level
                const SchoolIcon = getSchoolIcon(school)

                return (
                  <div key={school} className="flex items-center gap-3 p-3 border rounded-lg">
                    <SchoolIcon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium capitalize block">
                        {school}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {costPerLevel} pts/niveau
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={level}
                        onChange={(e) =>
                          updateSchoolLevel(school, parseInt(e.target.value) || 0)
                        }
                        min={0}
                        max={10}
                        className="w-20"
                      />
                      <Badge variant="secondary">{totalCost} pts</Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateSchoolLevel(school, 0)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add New School */}
          {availableSchools.length > 0 && (
            <div className="flex gap-2 pt-3 border-t">
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="flex-1 border rounded px-3 py-2 bg-background"
              >
                <option value="">Sélectionner une école...</option>
                {availableSchools.map((school) => (
                  <option key={school} value={school}>
                    {school} ({getSchoolCost(school)} pts/niv)
                  </option>
                ))}
              </select>
              <Button onClick={addSchool} disabled={!selectedSchool}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          {availableSchools.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Toutes les écoles ont été ajoutées
            </p>
          )}
        </CardContent>
      </Card>

      {/* Type Affinities */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-purple-500" />
                Affinités de type
              </CardTitle>
              <CardDescription>
                Niveau d'affinité avec chaque type de sort ({TYPE_COST} pts/niveau)
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base">
              {typesCost} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Types */}
          {selectedTypes.length > 0 && (
            <div className="space-y-3">
              {selectedTypes.map((type) => {
                const level = affinities.types?.[type] || 0
                const totalCost = TYPE_COST * level
                const TypeIcon = getTypeIcon(type)

                return (
                  <div key={type} className="flex items-center gap-3 p-3 border rounded-lg">
                    <TypeIcon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium capitalize block">
                        {type}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {TYPE_COST} pts/niveau
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={level}
                        onChange={(e) =>
                          updateTypeLevel(type, parseInt(e.target.value) || 0)
                        }
                        min={0}
                        max={10}
                        className="w-20"
                      />
                      <Badge variant="secondary">{totalCost} pts</Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateTypeLevel(type, 0)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add New Type */}
          {availableTypes.length > 0 && (
            <div className="flex gap-2 pt-3 border-t">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 border rounded px-3 py-2 bg-background"
              >
                <option value="">Sélectionner un type...</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type} ({TYPE_COST} pts/niv)
                  </option>
                ))}
              </select>
              <Button onClick={addType} disabled={!selectedType}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          {availableTypes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Tous les types ont été ajoutés
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
