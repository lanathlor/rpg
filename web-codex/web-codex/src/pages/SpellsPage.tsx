import { useState } from 'react'
import { useSpells } from '@/lib/dataProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SpellDetail } from '@/components/SpellDetail'
import { Flame, Zap, Shield, Sparkles, Sword, ArrowRight, Users, Skull, Search, Filter } from 'lucide-react'
import type { Spell } from '@/types'

const getSchoolIcon = (school: string) => {
  switch (school) {
    case 'feu':
      return <Flame className="h-4 w-4" />
    case 'electricite':
      return <Zap className="h-4 w-4" />
    case 'biomagie':
      return <Users className="h-4 w-4" />
    case 'arcane':
    default:
      return <Sparkles className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'destruction':
      return <Skull className="h-4 w-4" />
    case 'protection':
      return <Shield className="h-4 w-4" />
    case 'arme':
      return <Sword className="h-4 w-4" />
    case 'deplacement':
      return <ArrowRight className="h-4 w-4" />
    case 'alteration':
    case 'amelioration':
    case 'affliction':
    default:
      return <Sparkles className="h-4 w-4" />
  }
}

const getSchoolColor = (school: string) => {
  switch (school) {
    case 'feu':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'electricite':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'biomagie':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'arcane':
    default:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'destruction':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'protection':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'alteration':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'amelioration':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'deplacement':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'arme':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    case 'affliction':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function SpellsPage() {
  const { spells, loading } = useSpells()
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  // Get unique schools and types for filters
  const schools = [...new Set(spells.map(spell => spell.school))].sort()
  const types = [...new Set(spells.map(spell => spell.type))].sort()

  // Filter spells
  const filteredSpells = spells.filter((spell) => {
    const matchesSearch =
      spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spell.description_base.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSchool = !selectedSchool || spell.school === selectedSchool
    const matchesType = !selectedType || spell.type === selectedType

    return matchesSearch && matchesSchool && matchesType
  })

  const openSpellDetail = (spell: Spell) => {
    setSelectedSpell(spell)
  }

  const closeSpellDetail = () => {
    setSelectedSpell(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des sorts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sorts</h1>
        <p className="text-lg text-muted-foreground">
          {filteredSpells.length} sur {spells.length} {spells.length === 1 ? 'sort' : 'sorts'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un sort..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="">Toutes les écoles</option>
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school.charAt(0).toUpperCase() + school.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="">Tous les types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {(selectedSchool || selectedType || searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSchool('')
                setSelectedType('')
                setSearchQuery('')
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpells.map((spell) => (
          <Card
            key={spell.name}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openSpellDetail(spell)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{spell.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getSchoolColor(spell.school)}>
                    {getSchoolIcon(spell.school)}
                    <span className="ml-1">{spell.school}</span>
                  </Badge>
                  <Badge className={getTypeColor(spell.type)}>
                    {getTypeIcon(spell.type)}
                    <span className="ml-1">{spell.type}</span>
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {spell.description_base.slice(0, 120)}...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Niveaux disponibles:</strong> {spell.levels.length}
                </div>
                {spell.levels[0] && (
                  <div className="text-sm space-y-1">
                    {/* Show flux cost if available, otherwise show recharge time */}
                    {spell.levels[0].conditions?.flux_cost ? (
                      <div><strong>Coût de flux:</strong> {spell.levels[0].conditions.flux_cost}</div>
                    ) : (spell.levels[0].conditions?.recharge || spell.levels[0].recharge_time) ? (
                      <div className="font-semibold text-blue-600">
                        <strong>Recharge:</strong> {spell.levels[0].conditions?.recharge || spell.levels[0].recharge_time}
                      </div>
                    ) : (
                      <div><strong>Coût de flux:</strong> N/A</div>
                    )}

                    {/* Show key effects in priority order */}
                    {spell.levels[0].effects?.damage && (
                      <div><strong className="text-red-600">Dégâts:</strong> {spell.levels[0].effects.damage}</div>
                    )}
                    {spell.levels[0].effects?.area_damage && (
                      <div><strong className="text-red-600">Zone:</strong> {spell.levels[0].effects.area_damage}</div>
                    )}
                    {spell.levels[0].effects?.damage_bonus && (
                      <div><strong className="text-red-600">Bonus:</strong> {spell.levels[0].effects.damage_bonus}</div>
                    )}
                    {spell.levels[0].effects?.movement && (
                      <div><strong className="text-blue-600">Mouvement:</strong> {spell.levels[0].effects.movement.slice(0, 40)}...</div>
                    )}
                    {spell.levels[0].effects?.teleport && (
                      <div><strong className="text-blue-600">Téléportation:</strong> {spell.levels[0].effects.teleport.slice(0, 40)}...</div>
                    )}
                    {spell.levels[0].effects?.debuff && (
                      <div><strong className="text-purple-600">Affaiblissement:</strong> {spell.levels[0].effects.debuff.slice(0, 40)}...</div>
                    )}
                    {spell.levels[0].effects?.status && (
                      <div><strong className="text-purple-600">Statut:</strong> {spell.levels[0].effects.status.slice(0, 40)}...</div>
                    )}
                    {spell.levels[0].effects?.protection && (
                      <div><strong className="text-green-600">Protection:</strong> {spell.levels[0].effects.protection.slice(0, 40)}...</div>
                    )}
                    {spell.levels[0].effects?.attack_bonus && (
                      <div><strong className="text-yellow-600">Attaque:</strong> {spell.levels[0].effects.attack_bonus.slice(0, 40)}...</div>
                    )}
                    {/* Show special only if no other major effects */}
                    {spell.levels[0].effects?.special &&
                     !spell.levels[0].effects?.damage &&
                     !spell.levels[0].effects?.area_damage &&
                     !spell.levels[0].effects?.damage_bonus &&
                     !spell.levels[0].effects?.movement &&
                     !spell.levels[0].effects?.teleport &&
                     !spell.levels[0].effects?.debuff &&
                     !spell.levels[0].effects?.status &&
                     !spell.levels[0].effects?.protection &&
                     !spell.levels[0].effects?.attack_bonus && (
                      <div><strong className="text-teal-600">Effet:</strong> {spell.levels[0].effects.special.slice(0, 50)}...</div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpells.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedSchool || selectedType
              ? 'Aucun sort ne correspond aux critères de recherche.'
              : 'Aucun sort trouvé.'}
          </p>
        </div>
      )}

      {/* Spell Detail Modal */}
      <Dialog open={!!selectedSpell} onOpenChange={closeSpellDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du sort</DialogTitle>
          </DialogHeader>
          {selectedSpell && <SpellDetail spell={selectedSpell} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}