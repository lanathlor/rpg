/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Clock,
  Check,
} from 'lucide-react'
import { getCharacterList, deleteCharacter, importCharacter, getCharacter } from '@/lib/characterStorage'
import { importFromYAML } from '@/lib/characterExport'
import { isCharacterLegal } from '@/lib/pointBuyCalculator'
import { useWeapons, useArmors, useSkills, useConsumables, useSpells } from '@/lib/dataProvider'
import type { CharacterListItem } from '@/types/character'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function CharactersPage() {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<CharacterListItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Load data for legality checks
  const { weapons } = useWeapons()
  const { armors } = useArmors()
  const { skills } = useSkills()
  const { consumables } = useConsumables()
  const { spells: allSpells } = useSpells()

  // Load characters from localStorage
  const loadCharacters = () => {
    const chars = getCharacterList()
    // Sort by most recently updated
    chars.sort((a, b) => b.updatedAt - a.updatedAt)
    setCharacters(chars)
  }

  useEffect(() => {
    loadCharacters()
  }, [])

  // Filter characters
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
        setTimeout(() => {
          setImportDialogOpen(false)
          setImportSuccess(false)
        }, 1500)
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

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un personnage..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Character Card */}
        <Link to="/personnages/nouveau">
          <Card className="hover:shadow-lg transition-all cursor-pointer group h-full border-dashed border-2 flex items-center justify-center min-h-[240px]">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium">Créer un personnage</p>
              <p className="text-sm text-muted-foreground">Partir de zéro ou d'une classe</p>
            </CardContent>
          </Card>
        </Link>

        {/* Existing Characters */}
        {filteredCharacters.map((character) => {
          // Load full character data for legality check
          const fullCharacter = getCharacter(character.id)
          const legalityCheck = fullCharacter
            ? isCharacterLegal(fullCharacter, weapons, armors, skills, consumables, allSpells)
            : { isLegal: true, issues: [] }

          return (
            <Card
              key={character.id}
              className="hover:shadow-lg transition-all group h-full relative"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {character.name || 'Sans nom'}
                        </CardTitle>
                        {!legalityCheck.isLegal && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="destructive" className="text-xs cursor-help">
                                  Non légal
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm space-y-1">
                                  <div className="font-medium mb-1">Problèmes:</div>
                                  {legalityCheck.issues.map((issue, i) => (
                                    <div key={i}>• {issue}</div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {character.type && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {character.type}
                        </Badge>
                      )}
                      {character.sourceClass && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Basé sur {character.sourceClass}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Stats Preview */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{character.health} PV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{character.flux_reserve} Flux</span>
                  </div>
                </div>

                {/* Last updated */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(character.updatedAt)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/personnages/${character.id}`)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Éditer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCharacterId(character.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          )
        })}
      </div>

      {filteredCharacters.length === 0 && characters.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucun personnage ne correspond à la recherche.
          </p>
        </div>
      )}

      {characters.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Aucun personnage</p>
          <p className="text-muted-foreground mb-4">
            Créez votre premier personnage pour commencer l'aventure !
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le personnage ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le personnage sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={(open) => {
        setImportDialogOpen(open)
        if (!open) {
          setImportError(null)
          setImportSuccess(false)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer un personnage</DialogTitle>
            <DialogDescription>
              Glissez-déposez un fichier YAML ou cliquez pour le sélectionner
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Drag and Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Glissez-déposez votre fichier YAML ici<br />
                ou cliquez pour sélectionner un fichier
              </p>
              <input
                type="file"
                accept=".yaml,.yml"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={importSuccess}
              >
                <FileText className="h-4 w-4 mr-2" />
                Sélectionner un fichier
              </Button>
            </div>

            {/* Success Message */}
            {importSuccess && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm flex items-center gap-2">
                <Check className="h-4 w-4" />
                Personnage importé avec succès !
              </div>
            )}

            {/* Error Message */}
            {importError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
                <strong>Erreur:</strong> {importError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
