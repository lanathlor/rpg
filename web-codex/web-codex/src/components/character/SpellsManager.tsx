import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, Plus, X, Search, Lock, Eye, AlertTriangle } from 'lucide-react'
import { useSpells } from '@/lib/dataProvider'
import { hasAccessToSpell, checkSpellSeriesAccess, getDetailedAccessInfo } from '@/lib/accessUtils'
import { SpellDetail } from '@/components/SpellDetail'
import type { AffinityStats } from '@/types/common'
import type { Spell } from '@/types'

interface SpellsManagerProps {
  spells: string[]
  affinities: AffinityStats
  onUpdate: (spells: string[]) => void
}

export function SpellsManager({ spells, affinities, onUpdate }: SpellsManagerProps) {
  const { spells: allSpells } = useSpells()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewSpell, setPreviewSpell] = useState<Spell | null>(null)
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null)

  // Filter accessible spells
  const accessibleSpells = allSpells.filter((spell) =>
    hasAccessToSpell(spell, affinities)
  )

  // Filter by search
  const filteredSpells = accessibleSpells.filter((spell) =>
    spell.spell_series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spell.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addSpell = (spellName: string) => {
    if (!spells.includes(spellName)) {
      onUpdate([...spells, spellName])
    }
  }

  const addPreviewedSpell = () => {
    if (previewSpell) {
      const spellName = previewSpell.spell_series || previewSpell.name || ''
      addSpell(spellName)
      setPreviewSpell(null)
    }
  }

  const removeSpell = (spellName: string) => {
    onUpdate(spells.filter((s) => s !== spellName))
  }

  const handleSpellClick = (spell: Spell) => {
    setPreviewSpell(spell)
  }

  const closeSelector = () => {
    setSelectorOpen(false)
    setSearchQuery('')
    setPreviewSpell(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Sorts ({spells.length})
            </CardTitle>
            <Button onClick={() => setSelectorOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {spells.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun sort sélectionné. Cliquez sur "Ajouter" pour choisir des sorts.
            </p>
          ) : (
            <TooltipProvider>
              <div className="space-y-2">
                {spells.map((spellName) => {
                  // Find the spell and check access
                  const spell = allSpells.find(
                    (s) => s.spell_series === spellName || s.name === spellName
                  )
                  const accessResult = spell
                    ? checkSpellSeriesAccess(spell, affinities)
                    : { hasAccess: true }
                  const hasAccess = accessResult.hasAccess

                  // Generate tooltip summary
                  const summary = []
                  if (spell) {
                    const firstLevel = spell.levels?.[0]
                    if (firstLevel?.effects?.damage) summary.push(`Dégâts: ${firstLevel.effects.damage}`)
                    if (firstLevel?.conditions?.flux_cost) summary.push(`Coût: ${firstLevel.conditions.flux_cost} Flux`)
                    if (firstLevel?.effects?.defense) summary.push(`Défense: ${firstLevel.effects.defense}`)
                    if (firstLevel?.effects?.protection) summary.push(`Protection: ${firstLevel.effects.protection}`)
                    if (spell.description_base) summary.push(spell.description_base)
                  }

                  return (
                    <Tooltip key={spellName}>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer ${
                            !hasAccess
                              ? 'border-red-500 bg-red-50 dark:bg-red-950'
                              : ''
                          }`}
                          onClick={() => {
                            if (spell) setDetailSpell(spell)
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {!hasAccess && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">{spellName}</span>
                            {!hasAccess && (
                              <Badge variant="destructive" className="text-xs">
                                Prérequis non remplis
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSpell(spellName)
                            }}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-sm space-y-1">
                          {!hasAccess && (
                            <div className="text-red-400 font-medium mb-2 pb-2 border-b">
                              ⚠️ Prérequis non remplis
                              <div className="text-xs mt-1 whitespace-pre-line">
                                {getDetailedAccessInfo(accessResult)}
                              </div>
                            </div>
                          )}
                          {summary.length > 0 && summary.map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                          {summary.length === 0 && hasAccess && (
                            <div>Aucune information disponible</div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>

      {/* Spell Selector Dialog with Preview */}
      <Dialog open={selectorOpen} onOpenChange={closeSelector}>
        <DialogContent className="max-w-7xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Sélectionner un sort</DialogTitle>
            <DialogDescription>
              {accessibleSpells.length} sorts accessibles avec vos affinités
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un sort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Two-Column Layout */}
          <div className="flex-1 overflow-hidden flex gap-4 min-h-0">
            {/* Left: Spell List */}
            <TooltipProvider>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredSpells.length === 0 ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? 'Aucun sort ne correspond à la recherche'
                      : 'Aucun sort accessible avec vos affinités actuelles'}
                  </p>
                </div>
              ) : (
                filteredSpells.map((spell) => {
                  const spellName = spell.spell_series || spell.name || ''
                  const isSelected = spells.includes(spellName)
                  const isPreviewed = previewSpell?.name === spell.name

                  // Generate tooltip summary
                  const firstLevel = spell.levels?.[0]
                  const summary = []
                  if (firstLevel?.effects?.damage) summary.push(`Dégâts: ${firstLevel.effects.damage}`)
                  if (firstLevel?.conditions?.flux_cost) summary.push(`Coût: ${firstLevel.conditions.flux_cost} Flux`)
                  if (firstLevel?.effects?.defense) summary.push(`Défense: ${firstLevel.effects.defense}`)
                  if (firstLevel?.effects?.protection) summary.push(`Protection: ${firstLevel.effects.protection}`)
                  if (spell.description_base) summary.push(spell.description_base)

                  return (
                    <Tooltip key={spell.name}>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            isPreviewed
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => handleSpellClick(spell)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{spell.spell_series || spell.name}</p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {spell.school && (
                                <Badge variant="secondary" className="text-xs">
                                  {spell.school}
                                </Badge>
                              )}
                              {spell.type && (
                                <Badge variant="outline" className="text-xs">
                                  {spell.type}
                                </Badge>
                              )}
                              {spell.levels && spell.levels.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Niv. 1-{spell.levels.length}
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
            <div className="w-[45%] border-l pl-4 overflow-y-auto">
              {previewSpell ? (
                <div className="space-y-4">
                  <SpellDetail spell={previewSpell} />
                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={addPreviewedSpell}
                      disabled={spells.includes(
                        previewSpell.spell_series || previewSpell.name || ''
                      )}
                    >
                      {spells.includes(previewSpell.spell_series || previewSpell.name || '')
                        ? 'Déjà ajouté'
                        : 'Ajouter ce sort'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Cliquez sur un sort pour voir ses détails
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spell Detail Dialog */}
      <Dialog open={!!detailSpell} onOpenChange={(open) => !open && setDetailSpell(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailSpell?.spell_series || detailSpell?.name}</DialogTitle>
          </DialogHeader>
          {detailSpell && <SpellDetail spell={detailSpell} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
