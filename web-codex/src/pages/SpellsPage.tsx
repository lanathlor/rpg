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
import { Search, Filter, Zap, Target, TrendingUp, ArrowUpDown } from 'lucide-react'
import { getSchoolIcon, getSchoolColor, getTypeIcon, getTypeColor } from '@/lib/schoolUtils'
import { rateSpell } from '@/lib/spellRatingCalculator'
import type { Spell } from '@/types'


export function SpellsPage() {
  const { spells, loading } = useSpells()
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('name-asc')

  // Get unique schools and types for filters
  const schools = [...new Set(spells.map(spell => spell.school).filter((s): s is string => Boolean(s)))].sort()
  const types = [...new Set(spells.map(spell => spell.type).filter((t): t is string => Boolean(t)))].sort()

  // Filter and sort spells
  const filteredSpells = spells.filter((spell) => {
    const matchesSearch =
      spell.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spell.description_base?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSchool = !selectedSchool || spell.school === selectedSchool
    const matchesType = !selectedType || spell.type === selectedType

    return matchesSearch && matchesSchool && matchesType
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '')
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '')
      case 'power-asc': {
        const ratingA = a.levels?.[0] ? rateSpell(a.levels[0]).powerScore : 0
        const ratingB = b.levels?.[0] ? rateSpell(b.levels[0]).powerScore : 0
        return ratingA - ratingB
      }
      case 'power-desc': {
        const ratingA = a.levels?.[0] ? rateSpell(a.levels[0]).powerScore : 0
        const ratingB = b.levels?.[0] ? rateSpell(b.levels[0]).powerScore : 0
        return ratingB - ratingA
      }
      case 'value-asc': {
        const ratingA = a.levels?.[0] ? rateSpell(a.levels[0]).valueRating : 0
        const ratingB = b.levels?.[0] ? rateSpell(b.levels[0]).valueRating : 0
        return ratingA - ratingB
      }
      case 'value-desc': {
        const ratingA = a.levels?.[0] ? rateSpell(a.levels[0]).valueRating : 0
        const ratingB = b.levels?.[0] ? rateSpell(b.levels[0]).valueRating : 0
        return ratingB - ratingA
      }
      default:
        return 0
    }
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

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 bg-background"
            >
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="power-desc">Puissance (décroissant)</option>
              <option value="power-asc">Puissance (croissant)</option>
              <option value="value-desc">Valeur (décroissant)</option>
              <option value="value-asc">Valeur (croissant)</option>
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
        {filteredSpells.map((spell, index) => (
          <Card
            key={`${spell.name || 'unknown'}-${spell.school || 'unknown'}-${index}`}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openSpellDetail(spell)}
          >
            <CardHeader>
              <div>
                <CardTitle className="text-lg">{spell.name || 'Sort sans nom'}</CardTitle>
                <div className="flex gap-2 flex-wrap mt-2">
                  {spell.school && (
                    <Badge className={getSchoolColor(spell.school)}>
                      {(() => {
                        const Icon = getSchoolIcon(spell.school)
                        return <Icon className="h-4 w-4" />
                      })()}
                      <span className="ml-1 capitalize">{spell.school}</span>
                    </Badge>
                  )}
                  {spell.type && (
                    <Badge className={getTypeColor(spell.type)}>
                      {(() => {
                        const Icon = getTypeIcon(spell.type)
                        return <Icon className="h-4 w-4" />
                      })()}
                      <span className="ml-1 capitalize">{spell.type}</span>
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                {spell.description_base ? `${spell.description_base.slice(0, 120)}...` : 'Pas de description'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Niveaux disponibles:</strong> {spell.levels?.length || 0}
                </div>
                {spell.levels && spell.levels[0] && (() => {
                  const rating = rateSpell(spell.levels[0])
                  return (
                    <>
                      {/* Rating Badges */}
                      <div className="flex gap-2 py-2 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                          <Zap className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
                          <span className="font-semibold text-amber-600 dark:text-amber-400">{rating.powerScore.toFixed(0)}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                          <Target className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{rating.accessibilityScore.toFixed(0)}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-600 dark:text-green-400">{rating.valueRating.toFixed(1)}</span>
                        </Badge>
                        <Badge className={rating.tier.colorClass.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-') + ' text-white text-xs'}>
                          {rating.tier.name}
                        </Badge>
                      </div>
                    </>
                  )
                })()}
                {spell.levels && spell.levels[0] && (
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
                    {/* Show special only if no other major effects and no specials array */}
                    {spell.levels[0].effects?.special &&
                     !spell.levels[0].effects?.damage &&
                     !spell.levels[0].effects?.area_damage &&
                     !spell.levels[0].effects?.damage_bonus &&
                     !spell.levels[0].effects?.movement &&
                     !spell.levels[0].effects?.teleport &&
                     !spell.levels[0].effects?.debuff &&
                     !spell.levels[0].effects?.status &&
                     !spell.levels[0].effects?.protection &&
                     !spell.levels[0].effects?.attack_bonus &&
                     !spell.levels[0].effects?.specials &&
                     !Array.isArray(spell.levels[0].effects) && (
                      <div><strong className="text-teal-600">Effet:</strong> {spell.levels[0].effects.special.slice(0, 50)}...</div>
                    )}

                    {/* Show effects.specials array after other specific effects */}
                    {spell.levels[0].effects?.specials && Array.isArray(spell.levels[0].effects.specials) && spell.levels[0].effects.specials.length > 0 && (
                      <div><strong className="text-teal-600">Effets:</strong> {spell.levels[0].effects.specials[0].slice(0, 50)}...
                        {spell.levels[0].effects.specials.length > 1 && <span className="text-xs text-muted-foreground"> (+{spell.levels[0].effects.specials.length - 1} autres)</span>}
                      </div>
                    )}

                    {/* Show array effects after other specific effects */}
                    {Array.isArray(spell.levels[0].effects) && spell.levels[0].effects.length > 0 && (
                      <div><strong className="text-teal-600">Effets:</strong> {spell.levels[0].effects[0].slice(0, 50)}...
                        {spell.levels[0].effects.length > 1 && <span className="text-xs text-muted-foreground"> (+{spell.levels[0].effects.length - 1} autres)</span>}
                      </div>
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