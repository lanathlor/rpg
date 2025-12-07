import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '@/lib/dataProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, Sword, Shield, Zap, Package, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SpellDetail } from '@/components/SpellDetail'
import { WeaponDetail } from '@/components/WeaponDetail'
import { ArmorDetail } from '@/components/ArmorDetail'
import { SkillDetail } from '@/components/SkillDetail'
import { ConsumableDetail } from '@/components/ConsumableDetail'
import type { CodexItem, Spell, Weapon, Armor, Skill, Consumable } from '@/types'
import type { CharacterClass } from '@/types/classes'

type ItemType = 'spell' | 'weapon' | 'armor' | 'skill' | 'consumable' | 'class'

function getItemType(item: CodexItem): ItemType {
  // Classes have affinities and character stats (force, dexterite, etc.)
  if ('affinities' in item && 'stats' in item && (item as any).stats && ('force' in (item as any).stats || 'dexterite' in (item as any).stats || 'intelligence' in (item as any).stats)) return 'class'
  // Spells have levels and school
  if ('levels' in item && 'school' in item) return 'spell'
  // Weapons have stats.damage and attack_type
  if ('stats' in item && (item as any).stats && 'damage' in (item as any).stats && 'attack_type' in (item as any).stats) return 'weapon'
  // Armor has protection or resistance stats
  if ('protection' in item || ('stats' in item && (item as any).stats && ('RMEC' in (item as any).stats || 'RRAD' in (item as any).stats || 'RINT' in (item as any).stats))) return 'armor'
  // Skills have effect (singular) property
  if ('effect' in item && !('levels' in item)) return 'skill'
  // Consumables also have effect property
  if ('effect' in item) return 'consumable'
  // Default to skill if nothing else matches (safer than defaulting to spell)
  return 'skill'
}

function getItemIcon(type: ItemType) {
  switch (type) {
    case 'spell': return <Sparkles className="h-4 w-4" />
    case 'weapon': return <Sword className="h-4 w-4" />
    case 'armor': return <Shield className="h-4 w-4" />
    case 'skill': return <Zap className="h-4 w-4" />
    case 'consumable': return <Package className="h-4 w-4" />
    case 'class': return <Users className="h-4 w-4" />
  }
}

function getItemTypeLabel(type: ItemType) {
  switch (type) {
    case 'spell': return 'Sort'
    case 'weapon': return 'Arme'
    case 'armor': return 'Équipement'
    case 'skill': return 'Compétence'
    case 'consumable': return 'Consommable'
    case 'class': return 'Classe'
  }
}

function getItemColor(type: ItemType) {
  switch (type) {
    case 'spell': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'weapon': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'armor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'skill': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'consumable': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'class': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  }
}

function getItemDescription(item: CodexItem, type: ItemType): string {
  if (item.description) return item.description

  // Type-specific descriptions
  if (type === 'spell') {
    const spell = item as Spell
    return spell.description_base || `Sort de ${spell.school || 'magie'}`
  }
  if (type === 'weapon') {
    const weapon = item as Weapon
    return weapon.stats?.damage ? `Dégâts: ${weapon.stats.damage}` : 'Arme de combat'
  }
  if (type === 'armor') {
    const armor = item as Armor
    if (armor.stats?.RMEC || armor.stats?.RRAD || armor.stats?.RINT) {
      const resistances = []
      if (armor.stats.RMEC) resistances.push(`RMEC: ${armor.stats.RMEC}`)
      if (armor.stats.RRAD) resistances.push(`RRAD: ${armor.stats.RRAD}`)
      if (armor.stats.RINT) resistances.push(`RINT: ${armor.stats.RINT}`)
      return resistances.join(', ')
    }
    return 'Équipement de protection'
  }
  if (type === 'class') {
    const charClass = item as CharacterClass
    if (charClass.stats && 'PV' in charClass.stats && 'SD' in charClass.stats) {
      return `PV: ${charClass.stats.PV || '?'}, SD: ${charClass.stats.SD || '?'}`
    }
    return 'Classe de personnage'
  }

  return 'Aucune description disponible'
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedItem, setSelectedItem] = useState<CodexItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { results, loading } = useSearch(query)

  // Update query when URL changes
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
  }, [searchParams])

  // Update URL when query changes
  const handleSearchChange = (value: string) => {
    setQuery(value)
    if (value) {
      setSearchParams({ q: value })
    } else {
      setSearchParams({})
    }
  }

  const handleItemClick = (item: CodexItem) => {
    const type = getItemType(item)
    // Classes navigate to their detail page, not modal
    if (type === 'class') {
      return // Navigation handled by Link component
    }
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const renderItemDetail = () => {
    if (!selectedItem) return null

    const type = getItemType(selectedItem)

    switch (type) {
      case 'spell':
        return <SpellDetail spell={selectedItem as Spell} />
      case 'weapon':
        return <WeaponDetail weapon={selectedItem as Weapon} />
      case 'armor':
        return <ArmorDetail armor={selectedItem as Armor} />
      case 'skill':
        return <SkillDetail skill={selectedItem as Skill} />
      case 'consumable':
        return <ConsumableDetail consumable={selectedItem as Consumable} />
      default:
        return null
    }
  }

  const getModalTitle = () => {
    if (!selectedItem) return ''
    const type = getItemType(selectedItem)
    switch (type) {
      case 'spell': return 'Détails du sort'
      case 'weapon': return 'Détails de l\'arme'
      case 'armor': return 'Détails de l\'équipement'
      case 'skill': return 'Détails de la compétence'
      case 'consumable': return 'Détails du consommable'
      case 'class': return 'Détails de la classe'
      default: return 'Détails'
    }
  }

  // Group results by type
  const groupedResults = results.reduce((acc, item) => {
    const type = getItemType(item)
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {} as Record<ItemType, CodexItem[]>)

  const resultCount = results.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rechercher dans le Codex</h1>
        <p className="text-lg text-muted-foreground">
          Explorez sorts, armes, équipements, compétences et plus encore
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Recherche en cours...</div>
        </div>
      ) : query && resultCount === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground mt-2">
              Essayez avec d'autres termes de recherche
            </p>
          </CardContent>
        </Card>
      ) : query ? (
        <div className="space-y-6">
          {/* Result count */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
            </h2>
          </div>

          {/* Grouped results */}
          {Object.entries(groupedResults).map(([type, items]) => (
            <div key={type} className="space-y-4">
              <div className="flex items-center gap-2">
                {getItemIcon(type as ItemType)}
                <h3 className="text-lg font-semibold">
                  {getItemTypeLabel(type as ItemType)}
                  {items.length > 1 && 's'}
                </h3>
                <Badge variant="outline">
                  {items.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const itemType = getItemType(item)

                  // Classes need a Link wrapper for navigation
                  if (itemType === 'class') {
                    return (
                      <Link
                        key={item.name || `item-${Math.random()}`}
                        to={`/classes/${item.name?.toLowerCase().replace(/\s+/g, '-')
                          .replace(/[àáâãäå]/g, 'a')
                          .replace(/[èéêë]/g, 'e')
                          .replace(/[ìíîï]/g, 'i')
                          .replace(/[òóôõö]/g, 'o')
                          .replace(/[ùúûü]/g, 'u')
                          .replace(/ç/g, 'c')
                          .replace(/[^a-z0-9-]/g, '')}`}
                      >
                        <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{item.name || 'Sans nom'}</CardTitle>
                              <Badge className={getItemColor(itemType)}>
                                {getItemIcon(itemType)}
                                <span className="ml-1">{getItemTypeLabel(itemType)}</span>
                              </Badge>
                            </div>
                            <CardDescription>
                              {getItemDescription(item, itemType)}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    )
                  }

                  // Other items open in modal
                  return (
                    <div key={item.name || `item-${Math.random()}`}>
                      <Card
                        className="hover:shadow-lg transition-all cursor-pointer h-full"
                        onClick={() => handleItemClick(item)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{item.name || 'Sans nom'}</CardTitle>
                            <Badge className={getItemColor(itemType)}>
                              {getItemIcon(itemType)}
                              <span className="ml-1">{getItemTypeLabel(itemType)}</span>
                            </Badge>
                          </div>
                          <CardDescription>
                            {getItemDescription(item, itemType)}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Commencez votre recherche</h3>
            <p className="text-muted-foreground mt-2">
              Entrez un terme pour explorer le codex
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsModalOpen(false)
          setSelectedItem(null)
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getModalTitle()}</DialogTitle>
          </DialogHeader>
          {renderItemDetail()}
        </DialogContent>
      </Dialog>
    </div>
  )
}