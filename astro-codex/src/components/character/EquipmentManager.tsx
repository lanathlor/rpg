/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sword, Shield, Package, Plus, X, Search, Lock, Eye, AlertTriangle } from 'lucide-react'
import { hasAccessToWeapon, hasAccessToArmor, checkWeaponAccess, checkArmorAccess, getDetailedAccessInfo } from '@/lib/accessUtils'
import type { Equipment, CharacterStats } from '@/types/classes'
import type { AffinityStats } from '@/types/common'
import type { Weapon } from '@/types/weapons'
import type { Armor } from '@/types/armor'
import type { Consumable } from '@/types/consumables'

interface EquipmentManagerProps {
  equipment: Equipment
  affinities: AffinityStats
  stats: CharacterStats
  allWeapons: Weapon[]
  allArmors: Armor[]
  allConsumables: Consumable[]
  onUpdate: (equipment: Equipment) => void
}

type SelectorType = 'weapon' | 'armor' | 'consumable' | null

export function EquipmentManager({
  equipment,
  affinities,
  stats,
  allWeapons,
  allArmors,
  allConsumables,
  onUpdate,
}: EquipmentManagerProps) {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectorType, setSelectorType] = useState<SelectorType>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewItem, setPreviewItem] = useState<Weapon | Armor | Consumable | null>(null)

  const openSelector = (type: SelectorType) => {
    setSelectorType(type)
    setSelectorOpen(true)
    setSearchQuery('')
    setPreviewItem(null)
  }

  const closeSelector = () => {
    setSelectorOpen(false)
    setSelectorType(null)
    setSearchQuery('')
    setPreviewItem(null)
  }

  const addWeapon = (name: string) => {
    if (!equipment.weapons?.includes(name)) {
      onUpdate({ ...equipment, weapons: [...(equipment.weapons || []), name] })
    }
  }

  const addArmor = (name: string) => {
    if (!equipment.armor?.includes(name)) {
      onUpdate({ ...equipment, armor: [...(equipment.armor || []), name] })
    }
  }

  const addConsumable = (name: string) => {
    const existing = equipment.consumables?.find((c) => c.name === name)
    if (existing) {
      onUpdate({
        ...equipment,
        consumables: equipment.consumables?.map((c) =>
          c.name === name ? { ...c, quantity: c.quantity + 1 } : c
        ),
      })
    } else {
      onUpdate({
        ...equipment,
        consumables: [...(equipment.consumables || []), { name, quantity: 1 }],
      })
    }
  }

  const addPreviewedItem = () => {
    if (!previewItem) return
    if (selectorType === 'weapon') addWeapon(previewItem.name || '')
    else if (selectorType === 'armor') addArmor(previewItem.name || '')
    else if (selectorType === 'consumable') addConsumable(previewItem.name || '')
    setPreviewItem(null)
  }

  const removeWeapon = (name: string) => {
    onUpdate({ ...equipment, weapons: equipment.weapons?.filter((w) => w !== name) })
  }

  const removeArmor = (name: string) => {
    onUpdate({ ...equipment, armor: equipment.armor?.filter((a) => a !== name) })
  }

  const removeConsumable = (name: string) => {
    onUpdate({ ...equipment, consumables: equipment.consumables?.filter((c) => c.name !== name) })
  }

  const updateConsumableQuantity = (name: string, quantity: number) => {
    onUpdate({
      ...equipment,
      consumables: equipment.consumables?.map((c) =>
        c.name === name ? { ...c, quantity: Math.max(1, quantity) } : c
      ),
    })
  }

  const accessibleWeapons = allWeapons.filter((weapon) => hasAccessToWeapon(weapon, affinities, stats))
  const accessibleArmors = allArmors.filter((armor) => hasAccessToArmor(armor, affinities, stats))

  const getFilteredItems = () => {
    const query = searchQuery.toLowerCase()
    if (selectorType === 'weapon') return accessibleWeapons.filter((w) => w.name?.toLowerCase().includes(query))
    if (selectorType === 'armor') return accessibleArmors.filter((a) => a.name?.toLowerCase().includes(query))
    if (selectorType === 'consumable') return allConsumables.filter((c) => c.name?.toLowerCase().includes(query))
    return []
  }

  const isItemSelected = (itemName: string) => {
    if (selectorType === 'weapon') return equipment.weapons?.includes(itemName)
    if (selectorType === 'armor') return equipment.armor?.includes(itemName)
    if (selectorType === 'consumable') return equipment.consumables?.some((c) => c.name === itemName)
    return false
  }

  const renderItemPreview = (item: any) => {
    if (selectorType === 'weapon') {
      const w = item as Weapon
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">{w.name}</h3>
          {w.category && <Badge variant="secondary">{w.category}</Badge>}
          {w.description && <p className="text-sm text-muted-foreground">{w.description}</p>}
          {w.stats && (
            <div className="space-y-1 text-sm">
              {w.stats.damage && <div>Dégâts: {w.stats.damage}</div>}
              {w.stats.attack_type && <div>Type d'attaque: {w.stats.attack_type}</div>}
              {w.stats.range && <div>Portée: {w.stats.range}</div>}
              {w.stats.special && <div>Spécial: {w.stats.special}</div>}
            </div>
          )}
          {w.cost && <div className="text-sm font-medium">Coût: {w.cost}</div>}
        </div>
      )
    }
    if (selectorType === 'armor') {
      const a = item as Armor
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">{a.name}</h3>
          {a.category && <Badge variant="secondary">{a.category}</Badge>}
          {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
          {a.stats && (
            <div className="space-y-1 text-sm">
              {a.stats.RMEC && <div>RMEC: {a.stats.RMEC}</div>}
              {a.stats.RRAD && <div>RRAD: {a.stats.RRAD}</div>}
              {a.stats.RINT && <div>RINT: {a.stats.RINT}</div>}
              {a.stats.defense_bonus && <div>Défense: {a.stats.defense_bonus}</div>}
            </div>
          )}
          {a.cost && <div className="text-sm font-medium">Coût: {a.cost}</div>}
        </div>
      )
    }
    if (selectorType === 'consumable') {
      const c = item as Consumable
      return (
        <div className="space-y-2">
          <h3 className="text-lg font-bold">{c.name}</h3>
          {c.category && <Badge variant="secondary">{c.category}</Badge>}
          {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
          {c.effect && (
            <div className="space-y-1 text-sm">
              {c.effect.healing && <div>Soins: {c.effect.healing}</div>}
              {c.effect.damage && <div>Dégâts: {c.effect.damage}</div>}
              {c.effect.flux_restoration && <div>Flux: {c.effect.flux_restoration}</div>}
              {c.effect.duration && <div>Durée: {c.effect.duration}</div>}
              {c.effect.special && <div>Spécial: {c.effect.special}</div>}
            </div>
          )}
          {c.cost && <div className="text-sm font-medium">Coût: {c.cost}</div>}
        </div>
      )
    }
    return null
  }

  return (
    <>
      <div className="space-y-4">
        {/* Weapons */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Sword className="h-5 w-5 text-red-500" />
                Armes ({equipment.weapons?.length || 0})
              </CardTitle>
              <Button size="sm" onClick={() => openSelector('weapon')}>
                <Plus className="h-4 w-4 mr-2" />Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!equipment.weapons || equipment.weapons.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune arme</p>
            ) : (
              <div className="space-y-2">
                {equipment.weapons.map((weaponName) => {
                  const weapon = allWeapons.find((w) => w.name === weaponName)
                  const accessResult = weapon
                    ? checkWeaponAccess(weapon, { affinities, stats, equipment, skills: [], base_stats: { health: 0, speed: 0 }, gameplay_guide: '' })
                    : { hasAccess: true }

                  return (
                    <div
                      key={weaponName}
                      className={`flex items-center justify-between p-2 border rounded-lg ${
                        !accessResult.hasAccess ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {!accessResult.hasAccess && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span className="text-sm font-medium">{weaponName}</span>
                        {!accessResult.hasAccess && <Badge variant="destructive" className="text-xs">Non accessible</Badge>}
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeWeapon(weaponName)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Armor */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Armures ({equipment.armor?.length || 0})
              </CardTitle>
              <Button size="sm" onClick={() => openSelector('armor')}>
                <Plus className="h-4 w-4 mr-2" />Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!equipment.armor || equipment.armor.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune armure</p>
            ) : (
              <div className="space-y-2">
                {equipment.armor.map((armorName) => {
                  const armor = allArmors.find((a) => a.name === armorName)
                  const accessResult = armor
                    ? checkArmorAccess(armor, { affinities, stats, equipment, skills: [], base_stats: { health: 0, speed: 0 }, gameplay_guide: '' })
                    : { hasAccess: true }

                  return (
                    <div
                      key={armorName}
                      className={`flex items-center justify-between p-2 border rounded-lg ${
                        !accessResult.hasAccess ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {!accessResult.hasAccess && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span className="text-sm font-medium">{armorName}</span>
                        {!accessResult.hasAccess && <Badge variant="destructive" className="text-xs">Non accessible</Badge>}
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => removeArmor(armorName)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consumables */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-500" />
                Consommables ({equipment.consumables?.length || 0})
              </CardTitle>
              <Button size="sm" onClick={() => openSelector('consumable')}>
                <Plus className="h-4 w-4 mr-2" />Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!equipment.consumables || equipment.consumables.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun consommable</p>
            ) : (
              <div className="space-y-2">
                {equipment.consumables.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <NumberInput
                        value={item.quantity}
                        onChange={(value) => updateConsumableQuantity(item.name, value)}
                        min={1}
                        className="w-32"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeConsumable(item.name)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Item Selector Dialog */}
      <Dialog open={selectorOpen} onOpenChange={closeSelector}>
        <DialogContent className="max-w-full sm:max-w-7xl max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {selectorType === 'weapon' && 'Sélectionner une arme'}
              {selectorType === 'armor' && 'Sélectionner une armure'}
              {selectorType === 'consumable' && 'Sélectionner un consommable'}
            </DialogTitle>
            <DialogDescription>
              {selectorType !== 'consumable' && `${getFilteredItems().length} objets accessibles avec vos affinités`}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {getFilteredItems().length === 0 ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Aucun objet ne correspond à la recherche' : 'Aucun objet accessible'}
                  </p>
                </div>
              ) : (
                getFilteredItems().map((item: any) => {
                  const isSelected = isItemSelected(item.name)
                  const isPreviewed = previewItem?.name === item.name

                  return (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isPreviewed ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                      }`}
                      onClick={() => setPreviewItem(item)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.category && <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {isSelected && <Badge className="bg-green-100 text-green-800 dark:bg-green-900">Ajouté</Badge>}
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="w-full md:w-[45%] md:border-l md:pl-4 overflow-y-auto">
              {previewItem ? (
                <div className="space-y-4">
                  {renderItemPreview(previewItem)}
                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={addPreviewedItem}
                      disabled={isItemSelected(previewItem.name || '')}
                    >
                      {isItemSelected(previewItem.name || '') ? 'Déjà ajouté' : 'Ajouter cet objet'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Cliquez sur un objet pour voir ses détails</p>
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
