import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Sparkles, Plus, X, Search, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react'
import { useSpells } from '@/lib/dataProvider'
import { hasAccessToSpell, checkSpellSeriesAccess, checkSpellAccess, getDetailedAccessInfo } from '@/lib/accessUtils'
import { SpellDetail } from '@/components/SpellDetail'
import type { AffinityStats } from '@/types/common'
import type { Spell } from '@/types'
import type { SelectedSpell } from '@/types/classes'

interface SpellsManagerProps {
  spells: (SelectedSpell | string)[]  // Support both formats for backward compatibility
  affinities: AffinityStats
  intelligence?: number  // Character's intelligence stat
  bonusSlots?: number  // Extra spell slots granted by MJ
  onUpdate: (spells: SelectedSpell[]) => void
  onBonusSlotsUpdate?: (bonus: number) => void  // Callback to update bonus slots
}

export function SpellsManager({ spells, affinities, intelligence = 0, bonusSlots = 0, onUpdate, onBonusSlotsUpdate }: SpellsManagerProps) {
  const { spells: allSpells } = useSpells()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewSpell, setPreviewSpell] = useState<Spell | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('1')
  const [detailSpell, setDetailSpell] = useState<Spell | null>(null)
  const [editingBonus, setEditingBonus] = useState(false)
  const [tempBonus, setTempBonus] = useState(bonusSlots.toString())

  // Sync tempBonus with bonusSlots when it changes
  useEffect(() => {
    setTempBonus(bonusSlots.toString())
  }, [bonusSlots])

  // Calculate maximum spell slots based on Intelligence and MJ bonus
  const baseSlots = 2
  const intelligenceBonus = Math.floor(intelligence / 5)
  const calculatedSlots = baseSlots + intelligenceBonus
  const baseTotal = Math.max(4, calculatedSlots) // Minimum of 4 slots
  const maxSpellSlots = baseTotal + bonusSlots // Add MJ bonus on top

  // Convert legacy string[] format to SelectedSpell[] format
  const normalizedSpells: SelectedSpell[] = spells.map(spell => {
    if (typeof spell === 'string') {
      return { series: spell, level: '1' }  // Default to level 1 for migration
    }
    return spell
  })

  // Filter accessible spells
  const accessibleSpells = allSpells.filter((spell) =>
    hasAccessToSpell(spell, affinities)
  )

  // Filter by search
  const filteredSpells = accessibleSpells.filter((spell) =>
    spell.spell_series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spell.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addSpell = (spellName: string, level: string) => {
    const exists = normalizedSpells.some(s => s.series === spellName && s.level === level)
    if (!exists) {
      // Check if we've reached the maximum spell slots
      if (normalizedSpells.length >= maxSpellSlots) {
        // Don't add if we're at the limit
        return
      }
      onUpdate([...normalizedSpells, { series: spellName, level }])
    }
  }

  const addPreviewedSpell = () => {
    if (previewSpell && selectedLevel) {
      const spellName = previewSpell.spell_series || previewSpell.name || ''
      addSpell(spellName, selectedLevel)
      setPreviewSpell(null)
      setSelectedLevel('1')  // Reset to level 1 for next spell
    }
  }

  const removeSpell = (spellSeries: string, level: string) => {
    onUpdate(normalizedSpells.filter((s) => !(s.series === spellSeries && s.level === level)))
  }

  // Check if a character meets prerequisites for a specific spell level
  const checkLevelAccess = (spell: Spell, level: string): boolean => {
    const spellLevel = spell.levels?.find(l => l.level === level)
    if (!spellLevel) return false

    // First check explicit affinity prerequisites for the specific level
    const accessResult = checkSpellAccess(spellLevel, affinities)

    // If the level has explicit prerequisites, use them
    if (spellLevel.prerequisites?.affinities) {
      return accessResult.hasAccess
    }

    // If the level doesn't have explicit prerequisites, infer them from spell school/type
    // This prevents accessing higher levels without proper affinities
    if (spell.school) {
      // Normalize school name for lookup
      const schoolName = spell.school.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')

      const schoolAffinity = (affinities.schools as any)?.[schoolName] || 0
      const typeAffinity = spell.type ? ((affinities.types as any)?.[spell.type] || 0) : 0

      // Use the official rulebook requirements (from /rules/03_systeme_affinites_et_types.md)
      // Level 1: École 2, Type 2, Mixte 6
      // Level 2: École 3, Type 3, Mixte 9
      // Level 3: École 4, Type 4, Mixte 12
      // Level 4: École 5, Type 5, Mixte 15
      // Level 5: École 6, Type 6, Mixte 18
      const levelNum = parseInt(level)
      let minSchoolRequired = 2 // Level 1 default
      let minTypeRequired = 2   // Level 1 default
      let minMixedRequired = 6  // Level 1 default

      if (levelNum === 2) {
        minSchoolRequired = 3
        minTypeRequired = 3
        minMixedRequired = 9
      } else if (levelNum === 3) {
        minSchoolRequired = 4
        minTypeRequired = 4
        minMixedRequired = 12
      } else if (levelNum === 4) {
        minSchoolRequired = 5
        minTypeRequired = 5
        minMixedRequired = 15
      } else if (levelNum >= 5) {
        minSchoolRequired = 6
        minTypeRequired = 6
        minMixedRequired = 18
      }

      // Apply (École AND Type) OR Mixte logic from the rulebook
      if (spell.type) {
        // If spell has both school and type requirements
        const hasSchoolAccess = schoolAffinity >= minSchoolRequired
        const hasTypeAccess = typeAffinity >= minTypeRequired
        const bothMet = hasSchoolAccess && hasTypeAccess

        // Check mixed requirement (with 1.5x penalty for specialization)
        const combinedAffinity = schoolAffinity + typeAffinity
        const hasMixedAccess = combinedAffinity >= minMixedRequired

        return bothMet || hasMixedAccess
      } else {
        // If spell only has school requirement (no type)
        return schoolAffinity >= minSchoolRequired
      }
    }

    // If no school/type info, fall back to the explicit check result
    return accessResult.hasAccess
  }

  const handleSpellClick = (spell: Spell) => {
    setPreviewSpell(spell)
    // Reset selected level to first available level when changing spells
    if (spell.levels && spell.levels.length > 0) {
      setSelectedLevel(spell.levels[0].level)
    } else {
      setSelectedLevel('1')
    }
  }

  const closeSelector = () => {
    setSelectorOpen(false)
    setSearchQuery('')
    setPreviewSpell(null)
    setSelectedLevel('1')  // Reset level selection
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                Sorts ({normalizedSpells.length}/{maxSpellSlots})
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <p>
                  {calculatedSlots < 4
                    ? `Base: 2 + ${intelligenceBonus} (Int) = ${calculatedSlots} → 4 (minimum)`
                    : calculatedSlots === 4
                    ? `Base: 2 + ${intelligenceBonus} (Int) = 4`
                    : `Base: 2 + ${intelligenceBonus} (Int) = ${baseTotal}`
                  }
                </p>
                {onBonusSlotsUpdate && (
                  <div className="flex items-center gap-2">
                    <span>Bonus MJ:</span>
                    {editingBonus ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={tempBonus}
                          onChange={(e) => setTempBonus(e.target.value)}
                          className="h-5 w-16 text-xs"
                          min="0"
                          max="10"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                          onClick={() => {
                            const value = Math.max(0, Math.min(10, parseInt(tempBonus) || 0))
                            onBonusSlotsUpdate(value)
                            setEditingBonus(false)
                          }}
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                          onClick={() => {
                            setTempBonus(bonusSlots.toString())
                            setEditingBonus(false)
                          }}
                        >
                          ✗
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingBonus(true)}
                        className="font-semibold hover:underline"
                      >
                        +{bonusSlots}
                      </button>
                    )}
                    {bonusSlots > 0 && ` = ${maxSpellSlots} total`}
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => setSelectorOpen(true)}
              disabled={normalizedSpells.length >= maxSpellSlots}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {normalizedSpells.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun sort sélectionné. Cliquez sur "Ajouter" pour choisir des sorts.
            </p>
          ) : (
            <TooltipProvider>
              <div className="space-y-2">
                {normalizedSpells.map((selectedSpell, index) => {
                  // Find the spell and check access
                  const spell = allSpells.find(
                    (s) => s.spell_series === selectedSpell.series || s.name === selectedSpell.series
                  )
                  const spellLevel = spell?.levels?.find(l => l.level === selectedSpell.level)
                  const hasAccess = spell ? checkLevelAccess(spell, selectedSpell.level) : false

                  // Generate tooltip summary for the selected level
                  const summary = []
                  if (spellLevel) {
                    if (spellLevel.effects?.damage) summary.push(`Dégâts: ${spellLevel.effects.damage}`)
                    if (spellLevel.conditions?.flux_cost) summary.push(`Coût: ${spellLevel.conditions.flux_cost} Flux`)
                    if (spellLevel.effects?.defense) summary.push(`Défense: ${spellLevel.effects.defense}`)
                    if (spellLevel.effects?.protection) summary.push(`Protection: ${spellLevel.effects.protection}`)
                    if (spellLevel.description) summary.push(spellLevel.description)
                  }

                  return (
                    <Tooltip key={`${selectedSpell.series}-${selectedSpell.level}-${index}`}>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer ${
                            !hasAccess
                              ? 'border-red-500 bg-red-50 dark:bg-red-950'
                              : ''
                          }`}
                          onClick={(e) => {
                            // Don't open detail if clicking on the select
                            if ((e.target as HTMLElement).closest('[data-radix-select-trigger]')) {
                              return
                            }
                            if (spell) setDetailSpell(spell)
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {!hasAccess && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium">{selectedSpell.series}</span>

                            {/* Level selector dropdown */}
                            <div onClick={(e) => e.stopPropagation()}>
                              <Select
                                value={selectedSpell.level}
                                onValueChange={(newLevel) => {
                                  const updatedSpells = normalizedSpells.map(s =>
                                    s.series === selectedSpell.series
                                      ? { ...s, level: newLevel }
                                      : s
                                  )
                                  onUpdate(updatedSpells)
                                }}
                              >
                                <SelectTrigger className="w-[90px] h-7 text-xs" data-radix-select-trigger>
                                  <SelectValue>Niv. {selectedSpell.level}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {spell?.levels?.map(level => {
                                    const levelHasAccess = checkLevelAccess(spell, level.level)
                                    return (
                                      <SelectItem
                                        key={level.level}
                                        value={level.level}
                                        disabled={!levelHasAccess}
                                        className={levelHasAccess ? '' : 'opacity-50'}
                                      >
                                        Niveau {level.level} {!levelHasAccess && '🔒'}
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>

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
                              removeSpell(selectedSpell.series, selectedSpell.level)
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
                              ⚠️ Prérequis non remplis pour le niveau {selectedSpell.level}
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
                  const selectedLevels = normalizedSpells
                    .filter(s => s.series === spellName)
                    .map(s => s.level)
                  const hasSelectedSpell = selectedLevels.length > 0
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
                            {hasSelectedSpell && (
                              <div className="flex gap-1">
                                {selectedLevels.map(level => (
                                  <Badge key={level} className="bg-green-100 text-green-800 dark:bg-green-900 text-xs">
                                    Niv. {level}
                                  </Badge>
                                ))}
                              </div>
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

                  {/* Level Selection */}
                  {previewSpell.levels && previewSpell.levels.length > 0 && selectedLevel && (
                    <div className="space-y-3 p-4 border rounded-lg bg-secondary/10">
                      <h4 className="font-semibold text-sm">Sélectionner le niveau</h4>
                      <Select
                        value={selectedLevel}
                        onValueChange={setSelectedLevel}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {previewSpell.levels.map((level) => {
                            const hasAccess = checkLevelAccess(previewSpell, level.level)
                            const spellName = previewSpell.spell_series || previewSpell.name || ''
                            const isAlreadyAdded = normalizedSpells.some(
                              s => s.series === spellName && s.level === level.level
                            )

                            return (
                              <SelectItem
                                key={level.level}
                                value={level.level}
                                disabled={!hasAccess || isAlreadyAdded}
                              >
                                <div className="flex items-center gap-2">
                                  <span>Niveau {level.level}</span>
                                  {level.name && level.name !== previewSpell.spell_series && (
                                    <span className="text-sm text-muted-foreground">- {level.name}</span>
                                  )}
                                  {isAlreadyAdded && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 text-xs ml-2">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Déjà ajouté
                                    </Badge>
                                  )}
                                  {!hasAccess && (
                                    <Badge variant="destructive" className="text-xs ml-2">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Prérequis non remplis
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>

                      {/* Display selected level details */}
                      {selectedLevel && previewSpell.levels && (
                        <div className="mt-3 p-3 bg-secondary/20 rounded-lg">
                          {(() => {
                            const level = previewSpell.levels.find(l => l.level === selectedLevel)
                            if (!level) return null
                            return (
                              <div className="space-y-2 text-sm">
                                <div className="font-medium">Niveau {level.level} - Détails:</div>
                                {level.effects?.damage && (
                                  <div className="text-muted-foreground">
                                    • Dégâts: {level.effects.damage}
                                  </div>
                                )}
                                {level.conditions?.flux_cost && (
                                  <div className="text-muted-foreground">
                                    • Coût: {level.conditions.flux_cost} Flux
                                  </div>
                                )}
                                {level.duration && (
                                  <div className="text-muted-foreground">
                                    • Durée: {level.duration}
                                  </div>
                                )}
                                {level.description && (
                                  <div className="text-muted-foreground mt-2">
                                    {level.description}
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={addPreviewedSpell}
                      disabled={
                        !selectedLevel ||
                        !checkLevelAccess(previewSpell, selectedLevel) ||
                        normalizedSpells.some(
                          s => s.series === (previewSpell.spell_series || previewSpell.name || '') && s.level === selectedLevel
                        ) ||
                        normalizedSpells.length >= maxSpellSlots
                      }
                    >
                      {normalizedSpells.length >= maxSpellSlots ? (
                        'Limite de sorts atteinte'
                      ) : normalizedSpells.some(
                        s => s.series === (previewSpell.spell_series || previewSpell.name || '') && s.level === selectedLevel
                      )
                        ? `Niveau ${selectedLevel} déjà ajouté`
                        : `Ajouter ce sort (Niveau ${selectedLevel})`}
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
