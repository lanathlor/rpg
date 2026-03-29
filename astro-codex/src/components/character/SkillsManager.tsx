import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Zap, Plus, X, Search, Eye } from 'lucide-react'
import { getCompetenceTier } from '@/lib/pointBuyCalculator'
import type { Skill } from '@/types/skills'

interface SkillsManagerProps {
  skills: string[]
  allSkills: Skill[]
  onUpdate: (skills: string[]) => void
}

export function SkillsManager({ skills, allSkills, onUpdate }: SkillsManagerProps) {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewSkill, setPreviewSkill] = useState<Skill | null>(null)

  const filteredSkills = allSkills.filter((skill) =>
    skill.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addPreviewedSkill = () => {
    if (previewSkill && !skills.includes(previewSkill.name || '')) {
      onUpdate([...skills, previewSkill.name || ''])
      setPreviewSkill(null)
    }
  }

  const removeSkill = (skillName: string) => {
    onUpdate(skills.filter((s) => s !== skillName))
  }

  const closeSelector = () => {
    setSelectorOpen(false)
    setSearchQuery('')
    setPreviewSkill(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Compétences ({skills.length})
            </CardTitle>
            <Button onClick={() => setSelectorOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune compétence sélectionnée. Cliquez sur "Ajouter" pour choisir des compétences.
            </p>
          ) : (
            <div className="space-y-2">
              {skills.map((skillName) => {
                const skill = allSkills.find((s) => s.name === skillName)
                const tier = skill?.point_cost ? getCompetenceTier(skill.point_cost) : null

                return (
                  <div key={skillName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-medium">{skillName}</span>
                      {tier && (
                        <Badge variant="secondary" className={`text-xs ${tier.colorClass}`}>
                          Tier {tier.tier} • {skill?.point_cost} pts
                        </Badge>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeSkill(skillName)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Selector Dialog */}
      <Dialog open={selectorOpen} onOpenChange={closeSelector}>
        <DialogContent className="max-w-full sm:max-w-7xl max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Sélectionner une compétence</DialogTitle>
            <DialogDescription>{allSkills.length} compétences disponibles</DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 min-h-0">
            {/* Left: Skill List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredSkills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune compétence ne correspond à la recherche</p>
                </div>
              ) : (
                filteredSkills.map((skill) => {
                  const isSelected = skills.includes(skill.name || '')
                  const isPreviewed = previewSkill?.name === skill.name
                  const tier = skill.point_cost ? getCompetenceTier(skill.point_cost) : null

                  return (
                    <div
                      key={skill.name}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isPreviewed ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                      }`}
                      onClick={() => setPreviewSkill(skill)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{skill.name}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {tier && (
                            <Badge variant="secondary" className={`text-xs ${tier.colorClass}`}>
                              Tier {tier.tier} • {skill.point_cost} pts
                            </Badge>
                          )}
                          {skill.category && (
                            <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {isSelected && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900">Ajouté</Badge>
                        )}
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Right: Preview Pane */}
            <div className="w-full lg:w-[45%] lg:border-l lg:pl-4 overflow-y-auto">
              {previewSkill ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{previewSkill.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {previewSkill.category && <Badge variant="secondary">{previewSkill.category}</Badge>}
                      {previewSkill.subcategory && <Badge variant="outline">{previewSkill.subcategory}</Badge>}
                      {previewSkill.point_cost != null && (
                        <Badge variant="outline">{previewSkill.point_cost} pts</Badge>
                      )}
                    </div>
                    {previewSkill.description && (
                      <p className="text-sm text-muted-foreground mt-2">{previewSkill.description}</p>
                    )}
                    {previewSkill.effects && previewSkill.effects.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="font-semibold text-sm">Effets</h4>
                        {previewSkill.effects.map((effect, i) => (
                          <div key={i} className="p-2 border rounded text-sm">
                            <Badge variant="outline" className="text-xs mb-1">{effect.type}</Badge>
                            <p className="text-muted-foreground">{effect.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={addPreviewedSkill}
                      disabled={skills.includes(previewSkill.name || '')}
                    >
                      {skills.includes(previewSkill.name || '') ? 'Déjà ajouté' : 'Ajouter cette compétence'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Cliquez sur une compétence pour voir ses détails</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
