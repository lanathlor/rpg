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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Zap, Plus, X, Search, Eye } from 'lucide-react'
import { useSkills } from '@/lib/dataProvider'
import { SkillDetail } from '@/components/SkillDetail'
import { getCompetenceTier } from '@/lib/pointBuyCalculator'
import type { Skill } from '@/types'

interface SkillsManagerProps {
  skills: string[]
  onUpdate: (skills: string[]) => void
}

export function SkillsManager({ skills, onUpdate }: SkillsManagerProps) {
  const { skills: allSkills } = useSkills()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewSkill, setPreviewSkill] = useState<Skill | null>(null)
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null)

  // Filter by search
  const filteredSkills = allSkills.filter((skill) =>
    skill.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addSkill = (skillName: string) => {
    if (!skills.includes(skillName)) {
      onUpdate([...skills, skillName])
    }
  }

  const addPreviewedSkill = () => {
    if (previewSkill) {
      addSkill(previewSkill.name || '')
      setPreviewSkill(null)
    }
  }

  const removeSkill = (skillName: string) => {
    onUpdate(skills.filter((s) => s !== skillName))
  }

  const handleSkillClick = (skill: Skill) => {
    setPreviewSkill(skill)
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
            <TooltipProvider>
              <div className="space-y-2">
                {skills.map((skillName) => {
                  const skill = allSkills.find((s) => s.name === skillName)
                  const tier = skill?.point_cost ? getCompetenceTier(skill.point_cost) : null

                  // Generate tooltip summary
                  const summary = []
                  if (skill) {
                    if (skill.point_cost && tier) {
                      summary.push(`Coût: ${skill.point_cost} points (Tier ${tier.tier})`)
                    }
                    if (skill.category) {
                      summary.push(`Catégorie: ${skill.category}`)
                    }
                    if (skill.description) {
                      summary.push(skill.description)
                    }
                  }

                  return (
                    <Tooltip key={skillName}>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                          onClick={() => {
                            if (skill) setDetailSkill(skill)
                          }}
                        >
                          <span className="font-medium flex-1">{skillName}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSkill(skillName)
                            }}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {summary.length > 0 && (
                        <TooltipContent className="max-w-xs">
                          <div className="text-sm space-y-1">
                            {summary.map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* Skill Selector Dialog with Preview */}
      <Dialog open={selectorOpen} onOpenChange={closeSelector}>
        <DialogContent className="max-w-7xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Sélectionner une compétence</DialogTitle>
            <DialogDescription>
              {allSkills.length} compétences disponibles
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une compétence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Two-Column Layout */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 min-h-0">
            {/* Left: Skill List */}
            <TooltipProvider>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredSkills.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Aucune compétence ne correspond à la recherche
                    </p>
                  </div>
                ) : (
                  filteredSkills.map((skill) => {
                    const isSelected = skills.includes(skill.name || '')
                    const isPreviewed = previewSkill?.name === skill.name
                    const tier = skill.point_cost ? getCompetenceTier(skill.point_cost) : null

                    // Generate tooltip summary
                    const summary = []
                    if (skill.point_cost && tier) {
                      summary.push(`Coût: ${skill.point_cost} points (Tier ${tier.tier})`)
                    }
                    if (skill.category) {
                      summary.push(`Catégorie: ${skill.category}`)
                    }
                    if (skill.description) {
                      summary.push(skill.description)
                    }

                    return (
                      <Tooltip key={skill.name}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                              isPreviewed
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-accent'
                            }`}
                            onClick={() => handleSkillClick(skill)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{skill.name}</p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {skill.point_cost && tier && (
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${tier.colorClass}`}
                                  >
                                    Tier {tier.tier} • {skill.point_cost} pts
                                  </Badge>
                                )}
                                {skill.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {skill.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              {isSelected && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900">
                                  Ajouté
                                </Badge>
                              )}
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </TooltipTrigger>
                        {summary.length > 0 && (
                          <TooltipContent className="max-w-xs">
                            <div className="text-sm space-y-1">
                              {summary.map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )
                  })
                )}
              </div>
            </TooltipProvider>

            {/* Right: Preview Pane */}
            <div className="w-full lg:w-[45%] lg:border-l lg:pl-4 overflow-y-auto">
              {previewSkill ? (
                <div className="space-y-4">
                  <SkillDetail skill={previewSkill} />
                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={addPreviewedSkill}
                      disabled={skills.includes(previewSkill.name || '')}
                    >
                      {skills.includes(previewSkill.name || '')
                        ? 'Déjà ajouté'
                        : 'Ajouter cette compétence'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Cliquez sur une compétence pour voir ses détails
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Skill Detail Dialog */}
      <Dialog open={!!detailSkill} onOpenChange={(open) => !open && setDetailSkill(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailSkill?.name}</DialogTitle>
          </DialogHeader>
          {detailSkill && <SkillDetail skill={detailSkill} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
