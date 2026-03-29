/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  User,
  Plus,
  Search,
  Heart,
  Zap,
  Trash2,
  Edit,
  Upload,
  FileText,
  FileDown,
  Clock,
  Check,
  ArrowLeft,
} from 'lucide-react'
import {
  getCharacterList,
  getCharacter,
  createCharacter,
  saveCharacter,
  deleteCharacter,
  importCharacter,
} from '@/lib/characterStorage'
import { exportToYAML, importFromYAML } from '@/lib/characterExport'
import { isCharacterLegal } from '@/lib/pointBuyCalculator'
import { useAutoSave } from '@/hooks/useAutoSave'
import { StatsEditor } from '@/components/character/StatsEditor'
import { FluxEditor } from '@/components/character/FluxEditor'
import { AffinityEditor } from '@/components/character/AffinityEditor'
import { SpellsManager } from '@/components/character/SpellsManager'
import { EquipmentManager } from '@/components/character/EquipmentManager'
import { SkillsManager } from '@/components/character/SkillsManager'
import { PointBuyDisplay, MoneyDisplay } from '@/components/character/PointBuyDisplay'
import type { Character, CharacterListItem } from '@/types/character'
import type { CharacterClass } from '@/types/classes'
import type { Spell } from '@/types/spells'
import type { Weapon } from '@/types/weapons'
import type { Armor } from '@/types/armor'
import type { Skill } from '@/types/skills'
import type { Consumable } from '@/types/consumables'

type ViewState = 'list' | 'create' | 'edit'

const ARCHETYPES = [
  'Artilleur',
  'Combattant',
  'Protecteur',
  'Tacticien',
  'Tireur d\'élite',
]

interface CharacterCreatorIslandProps {
  classes: CharacterClass[]
  spells: Spell[]
  weapons: Weapon[]
  armors: Armor[]
  skills: Skill[]
  consumables: Consumable[]
}

export function CharacterCreatorIsland({
  classes,
  spells,
  weapons,
  armors,
  skills,
  consumables,
}: CharacterCreatorIslandProps) {
  const [view, setView] = useState<ViewState>('list')
  const [characters, setCharacters] = useState<CharacterListItem[]>([])
  const [character, setCharacter] = useState<Character | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [saveIndicator, setSaveIndicator] = useState(false)

  const loadCharacters = () => {
    const chars = getCharacterList()
    chars.sort((a, b) => b.updatedAt - a.updatedAt)
    setCharacters(chars)
  }

  useEffect(() => {
    loadCharacters()
  }, [])

  const onSave = useCallback((char: Character) => {
    saveCharacter(char)
    setSaveIndicator(true)
    setTimeout(() => setSaveIndicator(false), 2000)
  }, [])

  useAutoSave(character, onSave, 500)

  const updateCharacter = (updates: Partial<Character>) => {
    if (character) {
      setCharacter({ ...character, ...updates })
    }
  }

  // --- List View ---
  const filteredCharacters = characters.filter((char) =>
    char.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = () => {
    if (selectedCharacterId) {
      deleteCharacter(selectedCharacterId)
      loadCharacters()
      setDeleteDialogOpen(false)
      setSelectedCharacterId(null)
    }
  }

  const handleImport = (file: File) => {
    setImportError(null)
    setImportSuccess(false)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const yamlContent = e.target?.result as string
        const classData = importFromYAML(yamlContent)
        importCharacter(classData)
        loadCharacters()
        setImportSuccess(true)
        setTimeout(() => { setImportDialogOpen(false); setImportSuccess(false) }, 1500)
      } catch (error) {
        setImportError((error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleImport(file)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
      handleImport(file)
    } else {
      setImportError('Veuillez sélectionner un fichier YAML (.yaml ou .yml)')
    }
  }

  const formatDate = (timestamp: number) => {
    const diffMs = Date.now() - timestamp
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return new Date(timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  // --- Create View ---
  const handleCreateCharacter = (selectedClass?: CharacterClass) => {
    const newChar = createCharacter(selectedClass, selectedClass?.name)
    saveCharacter(newChar)
    setCharacter(newChar)
    setView('edit')
    loadCharacters()
  }

  const handleEditCharacter = (id: string) => {
    const char = getCharacter(id)
    if (char) {
      setCharacter(char)
      setView('edit')
    }
  }

  const handleBackToList = () => {
    // Save current character before going back
    if (character) {
      saveCharacter(character)
    }
    setCharacter(null)
    setView('list')
    loadCharacters()
  }

  // === LIST VIEW ===
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mes personnages</h1>
            <p className="text-lg text-muted-foreground">
              {filteredCharacters.length} personnage{filteredCharacters.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setImportDialogOpen(true)} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer YAML
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un personnage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Character Card */}
          <Card
            className="hover:shadow-lg transition-all cursor-pointer group h-full border-dashed border-2 flex items-center justify-center min-h-[240px]"
            onClick={() => setView('create')}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium">Créer un personnage</p>
              <p className="text-sm text-muted-foreground">Partir de zéro ou d'une classe</p>
            </CardContent>
          </Card>

          {/* Existing Characters */}
          {filteredCharacters.map((char) => {
            const fullCharacter = getCharacter(char.id)
            const legalityCheck = fullCharacter
              ? isCharacterLegal(fullCharacter, weapons, armors, skills, consumables, spells)
              : { isLegal: true, issues: [] }

            return (
              <Card key={char.id} className="hover:shadow-lg transition-all group h-full relative">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{char.name || 'Sans nom'}</h3>
                          {!legalityCheck.isLegal && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="destructive" className="text-xs cursor-help">Non légal</Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm space-y-1">
                                    <div className="font-medium mb-1">Problèmes:</div>
                                    {legalityCheck.issues.map((issue, i) => <div key={i}>• {issue}</div>)}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {char.type && <Badge variant="outline" className="mt-1 text-xs">{char.type}</Badge>}
                        {char.sourceClass && (
                          <p className="text-xs text-muted-foreground mt-1">Basé sur {char.sourceClass}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{char.health} PV</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{char.flux_reserve} Flux</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(char.updatedAt)}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditCharacter(char.id)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Éditer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCharacterId(char.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredCharacters.length === 0 && characters.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun personnage ne correspond à la recherche.</p>
          </div>
        )}

        {characters.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Aucun personnage</p>
            <p className="text-muted-foreground mb-4">Créez votre premier personnage pour commencer l'aventure !</p>
          </div>
        )}

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le personnage ?</DialogTitle>
              <DialogDescription>Cette action est irréversible.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
              <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={(open) => {
          setImportDialogOpen(open)
          if (!open) { setImportError(null); setImportSuccess(false) }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importer un personnage</DialogTitle>
              <DialogDescription>Glissez-déposez un fichier YAML ou cliquez pour le sélectionner</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Glissez-déposez votre fichier YAML ici<br />ou cliquez pour sélectionner un fichier
                </p>
                <input type="file" accept=".yaml,.yml" onChange={handleFileSelect} className="hidden" id="file-input" />
                <Button variant="outline" onClick={() => document.getElementById('file-input')?.click()} disabled={importSuccess}>
                  <FileText className="h-4 w-4 mr-2" />Sélectionner un fichier
                </Button>
              </div>
              {importSuccess && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" />Personnage importé avec succès !
                </div>
              )}
              {importError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                  <strong>Erreur:</strong> {importError}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // === CREATE VIEW (Class Selection) ===
  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setView('list')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Créer un personnage</h1>
        </div>

        <p className="text-muted-foreground">
          Choisissez de partir d'une classe existante ou de créer un personnage de zéro.
        </p>

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
                  <p className="text-xs text-muted-foreground line-clamp-2">{cls.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">{cls.base_stats.health} PV</Badge>
                    {cls.spells && cls.spells.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{cls.spells.length} sorts</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // === EDIT VIEW ===
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

  const legalityCheck = isCharacterLegal(character, weapons, armors, skills, consumables, spells)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
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
                      <Badge variant="destructive" className="cursor-help">Non légal</Badge>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-sm space-y-1">
                        <div className="font-medium mb-1">Problèmes détectés:</div>
                        {legalityCheck.issues.map((issue, i) => <div key={i}>• {issue}</div>)}
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
                    <SelectItem key={archetype} value={archetype}>{archetype}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {character.sourceClass && (
                <Badge variant="outline" className="text-xs">Basé sur {character.sourceClass}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {saveIndicator && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" /><span>Sauvegardé</span>
            </div>
          )}

          <PointBuyDisplay
            character={character}
            weapons={weapons}
            armors={armors}
            skills={skills}
            consumables={consumables}
          />

          <MoneyDisplay
            character={character}
            weapons={weapons}
            armors={armors}
            skills={skills}
            consumables={consumables}
          />

          <Button variant="outline" size="sm" onClick={() => exportToYAML(character)}>
            <FileDown className="h-4 w-4 mr-2" />YAML
          </Button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <textarea
          value={character.description || ''}
          onChange={(e) => updateCharacter({ description: e.target.value })}
          className="w-full min-h-[80px] p-3 border rounded-md bg-background"
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
            onUpdateBaseStats={(stats) => updateCharacter({ base_stats: stats })}
            onUpdateInnateResistances={(resistances) => updateCharacter({ innate_resistances: resistances })}
            onUpdatePrimaryStats={(stats) => updateCharacter({ stats })}
            onUpdateStartingCredits={(credits) => updateCharacter({ starting_credits: credits })}
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
            allSpells={spells}
            onUpdate={(newSpells) => updateCharacter({ spells: newSpells })}
            onBonusSlotsUpdate={(bonus) => updateCharacter({ bonus_spell_slots: bonus })}
          />
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <EquipmentManager
            equipment={character.equipment}
            affinities={character.affinities}
            stats={character.stats}
            allWeapons={weapons}
            allArmors={armors}
            allConsumables={consumables}
            onUpdate={(equipment) => updateCharacter({ equipment })}
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillsManager
            skills={character.skills}
            allSkills={skills}
            onUpdate={(newSkills) => updateCharacter({ skills: newSkills })}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
