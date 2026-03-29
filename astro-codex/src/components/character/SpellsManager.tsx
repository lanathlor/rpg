/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, Plus, X, Search, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react'
import { hasAccessToSpell, checkSpellAccess } from '@/lib/accessUtils'
import type { AffinityStats } from '@/types/common'
import type { Spell } from '@/types/spells'
import type { SelectedSpell } from '@/types/classes'

interface SpellsManagerProps {
  spells: (SelectedSpell | string)[]
  affinities: AffinityStats
  intelligence?: number
  bonusSlots?: number
  allSpells: Spell[]
  onUpdate: (spells: SelectedSpell[]) => void
  onBonusSlotsUpdate?: (bonus: number) => void
}

export function SpellsManager({ spells, affinities, intelligence = 0, bonusSlots = 0, allSpells, onUpdate, onBonusSlotsUpdate }: SpellsManagerProps) {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewSpell, setPreviewSpell] = useState<Spell | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>('1')
  const [editingBonus, setEditingBonus] = useState(false)
  const [tempBonus, setTempBonus] = useState(bonusSlots.toString())

  useEffect(() => {
    setTempBonus(bonusSlots.toString())
  }, [bonusSlots])

  const baseSlots = 2
  const intelligenceBonus = Math.floor(intelligence / 5)
  const calculatedSlots = baseSlots + intelligenceBonus
  const baseTotal = Math.max(4, calculatedSlots)
  const maxSpellSlots = baseTotal + bonusSlots

  const normalizedSpells: SelectedSpell[] = spells.map(spell => {
    if (typeof spell === 'string') return { series: spell, level: '1' }
    return spell
  })

  const accessibleSpells = allSpells.filter((spell) => hasAccessToSpell(spell, affinities))

  const filteredSpells = accessibleSpells.filter((spell) =>
    spell.spell_series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spell.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const checkLevelAccess = (spell: Spell, level: string): boolean => {
    const spellLevel = spell.levels?.find(l => l.level === level)
    if (!spellLevel) return false

    const accessResult = checkSpellAccess(spellLevel, affinities)
    if (spellLevel.prerequisites?.affinities) return accessResult.hasAccess

    if (spell.school) {
      const schoolName = spell.school.toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c').replace(/[ñ]/g, 'n')

      const schoolAffinity = (affinities.schools as any)?.[schoolName] || 0
      const typeAffinity = spell.type ? ((affinities.types as any)?.[spell.type] || 0) : 0

      const levelNum = parseInt(level)
      let minSchool = 2, minType = 2, minMixed = 6
      if (levelNum === 2) { minSchool = 3; minType = 3; minMixed = 9 }
      else if (levelNum === 3) { minSchool = 4; minType = 4; minMixed = 12 }
      else if (levelNum === 4) { minSchool = 5; minType = 5; minMixed = 15 }
      else if (levelNum >= 5) { minSchool = 6; minType = 6; minMixed = 18 }

      if (spell.type) {
        const bothMet = schoolAffinity >= minSchool && typeAffinity >= minType
        const hasMixedAccess = (schoolAffinity + typeAffinity) >= minMixed
        return bothMet || hasMixedAccess
      } else {
        return schoolAffinity >= minSchool
      }
    }

    return accessResult.hasAccess
  }

  const addPreviewedSpell = () => {
    if (previewSpell && selectedLevel) {
      const spellName = previewSpell.spell_series || previewSpell.name || ''
      const exists = normalizedSpells.some(s => s.series === spellName && s.level === selectedLevel)
      if (!exists && normalizedSpells.length < maxSpellSlots) {
        onUpdate([...normalizedSpells, { series: spellName, level: selectedLevel }])
      }
      setPreviewSpell(null)
      setSelectedLevel('1')
    }
  }

  const removeSpell = (series: string, level: string) => {
    onUpdate(normalizedSpells.filter((s) => !(s.series === series && s.level === level)))
  }

  const handleSpellClick = (spell: Spell) => {
    setPreviewSpell(spell)
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
    setSelectedLevel('1')
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
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0"
                          onClick={() => {
                            const value = Math.max(0, Math.min(10, parseInt(tempBonus) || 0))
                            onBonusSlotsUpdate(value)
                            setEditingBonus(false)
                          }}
                        >
                          ✓
                        </Button>
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0"
                          onClick={() => { setTempBonus(bonusSlots.toString()); setEditingBonus(false) }}
                        >
                          ✗
                        </Button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingBonus(true)} className="font-semibold hover:underline">
                        +{bonusSlots}
                      </button>
                    )}
                    {bonusSlots > 0 && ` = ${maxSpellSlots} total`}
                  </div>
                )}
              </div>
            </div>
            <Button onClick={() => setSelectorOpen(true)} disabled={normalizedSpells.length >= maxSpellSlots}>
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
            <div className="space-y-2">
              {normalizedSpells.map((selectedSpell, index) => {
                const spell = allSpells.find(
                  (s) => s.spell_series === selectedSpell.series || s.name === selectedSpell.series
                )
                const hasAccess = spell ? checkLevelAccess(spell, selectedSpell.level) : false

                return (
                  <div
                    key={`${selectedSpell.series}-${selectedSpell.level}-${index}`}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      !hasAccess ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {!hasAccess && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className="font-medium">{selectedSpell.series}</span>

                      <Select
                        value={selectedSpell.level}
                        onValueChange={(newLevel) => {
                          const updatedSpells = normalizedSpells.map(s =>
                            s.series === selectedSpell.series && s.level === selectedSpell.level
                              ? { ...s, level: newLevel }
                              : s
                          )
                          onUpdate(updatedSpells)
                        }}
                      >
                        <SelectTrigger className="w-[90px] h-7 text-xs">
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

                      {!hasAccess && (
                        <Badge variant="destructive" className="text-xs">
                          Prérequis non remplis
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSpell(selectedSpell.series, selectedSpell.level)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spell Selector Dialog */}
      <Dialog open={selectorOpen} onOpenChange={closeSelector}>
        <DialogContent className="max-w-full sm:max-w-7xl max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Sélectionner un sort</DialogTitle>
            <DialogDescription>
              {accessibleSpells.length} sorts accessibles avec vos affinités
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un sort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 min-h-0">
            {/* Left: Spell List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredSpells.length === 0 ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Aucun sort ne correspond à la recherche' : 'Aucun sort accessible avec vos affinités actuelles'}
                  </p>
                </div>
              ) : (
                filteredSpells.map((spell) => {
                  const spellName = spell.spell_series || spell.name || ''
                  const selectedLevels = normalizedSpells.filter(s => s.series === spellName).map(s => s.level)
                  const isPreviewed = previewSpell?.name === spell.name

                  return (
                    <div
                      key={spell.name}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isPreviewed ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                      }`}
                      onClick={() => handleSpellClick(spell)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{spellName}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {spell.school && <Badge variant="secondary" className="text-xs">{spell.school}</Badge>}
                          {spell.type && <Badge variant="outline" className="text-xs">{spell.type}</Badge>}
                          {spell.levels && <Badge variant="outline" className="text-xs">Niv. 1-{spell.levels.length}</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {selectedLevels.length > 0 && selectedLevels.map(level => (
                          <Badge key={level} className="bg-green-100 text-green-800 dark:bg-green-900 text-xs">Niv. {level}</Badge>
                        ))}
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Right: Preview Pane */}
            <div className="w-full md:w-[45%] md:border-l md:pl-4 overflow-y-auto">
              {previewSpell ? (
                <div className="space-y-4">
                  {/* Inline Preview */}
                  <div>
                    <h3 className="text-lg font-bold">{previewSpell.spell_series || previewSpell.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {previewSpell.school && <Badge variant="secondary">{previewSpell.school}</Badge>}
                      {previewSpell.type && <Badge variant="outline">{previewSpell.type}</Badge>}
                    </div>
                    {previewSpell.description_base && (
                      <p className="text-sm text-muted-foreground mt-2">{previewSpell.description_base}</p>
                    )}
                    {previewSpell.levels && previewSpell.levels.map(level => (
                      <div key={level.level} className="mt-3 p-3 border rounded-lg text-sm">
                        <div className="font-semibold">Niveau {level.level}{level.name && level.name !== previewSpell.spell_series ? ` - ${level.name}` : ''}</div>
                        {level.effects?.damage && <div>Dégâts: {level.effects.damage}</div>}
                        {level.conditions?.flux_cost != null && <div>Coût: {level.conditions.flux_cost} Flux</div>}
                        {level.effects?.defense && <div>Défense: {level.effects.defense}</div>}
                        {level.effects?.protection && <div>Protection: {level.effects.protection}</div>}
                        {level.duration && <div>Durée: {level.duration}</div>}
                        {level.description && <div className="text-muted-foreground mt-1">{level.description}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Level Selection */}
                  {previewSpell.levels && previewSpell.levels.length > 0 && (
                    <div className="space-y-3 p-4 border rounded-lg bg-secondary/10">
                      <h4 className="font-semibold text-sm">Sélectionner le niveau</h4>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
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
                                  {isAlreadyAdded && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 text-xs ml-2">
                                      <CheckCircle className="h-3 w-3 mr-1" />Déjà ajouté
                                    </Badge>
                                  )}
                                  {!hasAccess && (
                                    <Badge variant="destructive" className="text-xs ml-2">
                                      <AlertTriangle className="h-3 w-3 mr-1" />Prérequis non remplis
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
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
                      {normalizedSpells.length >= maxSpellSlots
                        ? 'Limite de sorts atteinte'
                        : normalizedSpells.some(
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
                    <p className="text-muted-foreground">Cliquez sur un sort pour voir ses détails</p>
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
