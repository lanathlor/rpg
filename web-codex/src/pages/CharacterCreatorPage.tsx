/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Download, FileDown, Check } from 'lucide-react'
import {
  getCharacter,
  createCharacter,
  saveCharacter,
} from '@/lib/characterStorage'
import { useClasses, useWeapons, useArmors, useSkills, useConsumables, useSpells } from '@/lib/dataProvider'
import { exportToYAML } from '@/lib/characterExport'
import { filterCharacterContent, exportCharacterToPDF } from '@/lib/pdfExport'
import type { Character } from '@/types/character'
import type { CharacterClass } from '@/types/classes'
import { StatsEditor } from '@/components/character/StatsEditor'
import { FluxEditor } from '@/components/character/FluxEditor'
import { AffinityEditor } from '@/components/character/AffinityEditor'
import { SpellsManager } from '@/components/character/SpellsManager'
import { EquipmentManager } from '@/components/character/EquipmentManager'
import { SkillsManager } from '@/components/character/SkillsManager'
import { PointBuyDisplay, MoneyDisplay } from '@/components/character/PointBuyDisplay'
import { useAutoSave } from '@/hooks/useAutoSave'
import { isCharacterLegal } from '@/lib/pointBuyCalculator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Character archetypes from the codex
const ARCHETYPES = [
  'Artilleur',
  'Combattant',
  'Protecteur',
  'Tacticien',
  'Tireur d\'élite',
]

export function CharacterCreatorPage() {
  const { characterId } = useParams()
  const navigate = useNavigate()
  const { classes } = useClasses()
  const { weapons } = useWeapons()
  const { armors } = useArmors()
  const { skills } = useSkills()
  const { consumables } = useConsumables()
  const { spells: allSpells } = useSpells()

  const [character, setCharacter] = useState<Character | null>(null)
  const [showClassChoice, setShowClassChoice] = useState(false)
  const [saveIndicator, setSaveIndicator] = useState(false)

  // Load or create character
  useEffect(() => {
    if (characterId && characterId !== 'nouveau') {
      // Edit existing character
      const existing = getCharacter(characterId)
      if (existing) {
        setCharacter(existing)
      } else {
        // Character not found, redirect to list
        navigate('/personnages')
      }
    } else {
      // New character - show class choice
      setShowClassChoice(true)
    }
  }, [characterId, navigate])

  // Handle class selection or scratch creation
  const handleCreateCharacter = (selectedClass?: CharacterClass) => {
    const newChar = createCharacter(selectedClass, selectedClass?.name)
    setCharacter(newChar)
    setShowClassChoice(false)
    saveCharacter(newChar)
    // Update URL to edit mode
    navigate(`/personnages/${newChar.id}`, { replace: true })
  }

  // Auto-save hook
  useAutoSave(
    character,
    (char) => {
      if (char) {
        saveCharacter(char)
        setSaveIndicator(true)
        setTimeout(() => setSaveIndicator(false), 2000)
      }
    },
    500 // 500ms debounce
  )

  // Update character field
  const updateCharacter = (updates: Partial<Character>) => {
    if (character) {
      setCharacter({ ...character, ...updates })
    }
  }

  // Handle dialog close - navigate back if no character was created
  const handleDialogClose = (open: boolean) => {
    if (!open && !character) {
      navigate('/personnages')
    }
    setShowClassChoice(open)
  }

  // Show class selection dialog for new character
  if (!character && showClassChoice) {
    return (
      <div className="space-y-6 p-6">
        <Dialog open={showClassChoice} onOpenChange={handleDialogClose}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un personnage</DialogTitle>
              <DialogDescription>
                Choisissez de partir d'une classe existante ou de créer un personnage de zéro.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* From Scratch Option */}
              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2"
                onClick={() => handleCreateCharacter()}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="text-4xl">✨</div>
                  <div>
                    <h3 className="font-bold text-lg">Partir de zéro</h3>
                    <p className="text-sm text-muted-foreground">
                      Créer un personnage vierge et le personnaliser entièrement
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* From Class Options */}
              <div>
                <h3 className="font-semibold mb-3">Partir d'une classe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {classes.map((cls) => (
                    <Card
                      key={cls.name}
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => handleCreateCharacter(cls)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium">{cls.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {cls.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {cls.base_stats.health} PV
                          </Badge>
                          {cls.spells && cls.spells.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {cls.spells.length} sorts
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Show loading state while waiting for character to be set
  if (!character) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Check character legality
  const legalityCheck = isCharacterLegal(character, weapons, armors, skills, consumables, allSpells)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/personnages')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Input
                value={character.name || ''}
                onChange={(e) => updateCharacter({ name: e.target.value })}
                className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                placeholder="Nom du personnage"
              />
              {!legalityCheck.isLegal && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="cursor-help">
                        Non légal
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-sm space-y-1">
                        <div className="font-medium mb-1">Problèmes détectés:</div>
                        {legalityCheck.issues.map((issue, i) => (
                          <div key={i}>• {issue}</div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Select
                value={character.type || ''}
                onValueChange={(value) => updateCharacter({ type: value })}
              >
                <SelectTrigger className="w-[200px] h-auto border-none p-0 text-sm text-muted-foreground focus:ring-0">
                  <SelectValue placeholder="Sélectionner un archétype" />
                </SelectTrigger>
                <SelectContent>
                  {ARCHETYPES.map((archetype) => (
                    <SelectItem key={archetype} value={archetype}>
                      {archetype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {character.sourceClass && (
                <Badge variant="outline" className="text-xs">
                  Basé sur {character.sourceClass}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Save Indicator */}
          {saveIndicator && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Sauvegardé</span>
            </div>
          )}

          {/* Point Buy Display */}
          <PointBuyDisplay
            character={character}
            weapons={weapons}
            armors={armors}
            skills={skills}
            consumables={consumables}
          />

          {/* Money Display */}
          <MoneyDisplay
            character={character}
            weapons={weapons}
            armors={armors}
            skills={skills}
            consumables={consumables}
          />

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToYAML(character)}
            >
              <FileDown className="h-4 w-4 mr-2" />
              YAML
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const filteredData = filterCharacterContent(
                  character,
                  allSpells,
                  weapons,
                  armors,
                  skills,
                  consumables,
                  true // Skip access checks for custom characters - show all equipment
                )
                exportCharacterToPDF(filteredData, armors, weapons)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <textarea
          value={character.description || ''}
          onChange={(e) => updateCharacter({ description: e.target.value })}
          className="w-full min-h-[80px] p-3 border rounded-md"
          placeholder="Description du personnage..."
        />
      </div>

      {/* Tabbed Editor */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="flux">Flux</TabsTrigger>
          <TabsTrigger value="affinities">Affinités</TabsTrigger>
          <TabsTrigger value="spells">Sorts</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="skills">Compétences</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <StatsEditor
            baseStats={character.base_stats}
            innateResistances={character.innate_resistances}
            primaryStats={character.stats}
            startingCredits={character.starting_credits}
            onUpdateBaseStats={(stats) =>
              updateCharacter({ base_stats: stats })
            }
            onUpdateInnateResistances={(resistances) =>
              updateCharacter({ innate_resistances: resistances })
            }
            onUpdatePrimaryStats={(stats) => updateCharacter({ stats })}
            onUpdateStartingCredits={(credits) =>
              updateCharacter({ starting_credits: credits })
            }
          />
        </TabsContent>

        <TabsContent value="flux" className="space-y-4">
          <FluxEditor
            fluxSystem={character.flux_system}
            onUpdate={(flux) => updateCharacter({ flux_system: flux })}
          />
        </TabsContent>

        <TabsContent value="affinities" className="space-y-4">
          <AffinityEditor
            affinities={character.affinities}
            onUpdate={(affinities) => updateCharacter({ affinities })}
          />
        </TabsContent>

        <TabsContent value="spells" className="space-y-4">
          <SpellsManager
            spells={character.spells || []}
            affinities={character.affinities}
            intelligence={character.stats?.intelligence || 0}
            bonusSlots={character.bonus_spell_slots || 0}
            onUpdate={(spells) => updateCharacter({ spells })}
            onBonusSlotsUpdate={(bonus) => updateCharacter({ bonus_spell_slots: bonus })}
          />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <EquipmentManager
            equipment={character.equipment}
            affinities={character.affinities}
            stats={character.stats}
            onUpdate={(equipment) => updateCharacter({ equipment })}
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillsManager
            skills={character.skills}
            onUpdate={(skills) => updateCharacter({ skills })}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
