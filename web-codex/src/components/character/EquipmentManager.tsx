import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
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
import { Sword, Shield, Package, Plus, X, Search, Lock, Eye, AlertTriangle } from 'lucide-react'
import { useWeapons, useArmors, useConsumables } from '@/lib/dataProvider'
import { hasAccessToWeapon, hasAccessToArmor, checkWeaponAccess, checkArmorAccess, getDetailedAccessInfo } from '@/lib/accessUtils'
import { WeaponDetail } from '@/components/WeaponDetail'
import { ArmorDetail } from '@/components/ArmorDetail'
import { ConsumableDetail } from '@/components/ConsumableDetail'
import type { Equipment, CharacterStats } from '@/types/classes'
import type { AffinityStats } from '@/types/common'
import type { Weapon, Armor, Consumable } from '@/types'

interface EquipmentManagerProps {
  equipment: Equipment
  affinities: AffinityStats
  stats: CharacterStats
  onUpdate: (equipment: Equipment) => void
}

type SelectorType = 'weapon' | 'armor' | 'consumable' | null

export function EquipmentManager({
  equipment,
  affinities,
  stats,
  onUpdate,
}: EquipmentManagerProps) {
  const { weapons: allWeapons } = useWeapons()
  const { armors: allArmors } = useArmors()
  const { consumables: allConsumables } = useConsumables()

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectorType, setSelectorType] = useState<SelectorType>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [previewItem, setPreviewItem] = useState<Weapon | Armor | Consumable | null>(null)
  const [detailItem, setDetailItem] = useState<Weapon | Armor | Consumable | null>(null)

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

  // Add item functions
  const addWeapon = (name: string) => {
    if (!equipment.weapons?.includes(name)) {
      onUpdate({
        ...equipment,
        weapons: [...(equipment.weapons || []), name],
      })
    }
  }

  const addArmor = (name: string) => {
    if (!equipment.armor?.includes(name)) {
      onUpdate({
        ...equipment,
        armor: [...(equipment.armor || []), name],
      })
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

    if (selectorType === 'weapon') {
      addWeapon(previewItem.name || '')
    } else if (selectorType === 'armor') {
      addArmor(previewItem.name || '')
    } else if (selectorType === 'consumable') {
      addConsumable(previewItem.name || '')
    }

    setPreviewItem(null)
  }

  // Remove item functions
  const removeWeapon = (name: string) => {
    onUpdate({
      ...equipment,
      weapons: equipment.weapons?.filter((w) => w !== name),
    })
  }

  const removeArmor = (name: string) => {
    onUpdate({
      ...equipment,
      armor: equipment.armor?.filter((a) => a !== name),
    })
  }

  const removeConsumable = (name: string) => {
    onUpdate({
      ...equipment,
      consumables: equipment.consumables?.filter((c) => c.name !== name),
    })
  }

  const updateConsumableQuantity = (name: string, quantity: number) => {
    onUpdate({
      ...equipment,
      consumables: equipment.consumables?.map((c) =>
        c.name === name ? { ...c, quantity: Math.max(1, quantity) } : c
      ),
    })
  }

  // Filter accessible items
  const accessibleWeapons = allWeapons.filter((weapon) =>
    hasAccessToWeapon(weapon, affinities, stats)
  )
  const accessibleArmors = allArmors.filter((armor) =>
    hasAccessToArmor(armor, affinities, stats)
  )

  // Filter by search
  const getFilteredItems = () => {
    const query = searchQuery.toLowerCase()
    if (selectorType === 'weapon') {
      return accessibleWeapons.filter((w) => w.name?.toLowerCase().includes(query))
    }
    if (selectorType === 'armor') {
      return accessibleArmors.filter((a) => a.name?.toLowerCase().includes(query))
    }
    if (selectorType === 'consumable') {
      return allConsumables.filter((c) => c.name?.toLowerCase().includes(query))
    }
    return []
  }

  const isItemSelected = (itemName: string) => {
    if (selectorType === 'weapon') return equipment.weapons?.includes(itemName)
    if (selectorType === 'armor') return equipment.armor?.includes(itemName)
    if (selectorType === 'consumable')
      return equipment.consumables?.some((c) => c.name === itemName)
    return false
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
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!equipment.weapons || equipment.weapons.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune arme
              </p>
            ) : (
              <TooltipProvider>
                <div className="space-y-2">
                  {equipment.weapons.map((weaponName) => {
                    // Find the weapon and check access
                    const weapon = allWeapons.find((w) => w.name === weaponName)
                    const accessResult = weapon
                      ? checkWeaponAccess(weapon, {
                          affinities,
                          stats,
                          equipment,
                          skills: [],
                          base_stats: { health: 0, speed: 0 },
                          gameplay_guide: ''
                        })
                      : { hasAccess: true }
                    const hasAccess = accessResult.hasAccess

                    // Generate tooltip summary
                    const summary = []
                    if (weapon) {
                      if (weapon.stats?.damage) summary.push(`Dégâts: ${weapon.stats.damage}`)
                      if (weapon.stats?.range) summary.push(`Portée: ${weapon.stats.range}`)
                      if (weapon.description) summary.push(weapon.description)
                    }

                    return (
                      <Tooltip key={weaponName}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-accent ${
                              !hasAccess
                                ? 'border-red-500 bg-red-50 dark:bg-red-950'
                                : ''
                            }`}
                            onClick={() => {
                              if (weapon) setDetailItem(weapon)
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {!hasAccess && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm font-medium">{weaponName}</span>
                              {!hasAccess && (
                                <Badge variant="destructive" className="text-xs">
                                  Non accessible
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeWeapon(weaponName)
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
                                ⚠️ Non accessible
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

        {/* Armor */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Armures ({equipment.armor?.length || 0})
              </CardTitle>
              <Button size="sm" onClick={() => openSelector('armor')}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!equipment.armor || equipment.armor.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune armure
              </p>
            ) : (
              <TooltipProvider>
                <div className="space-y-2">
                  {equipment.armor.map((armorName) => {
                    // Find the armor and check access
                    const armor = allArmors.find((a) => a.name === armorName)
                    const accessResult = armor
                      ? checkArmorAccess(armor, {
                          affinities,
                          stats,
                          equipment,
                          skills: [],
                          base_stats: { health: 0, speed: 0 },
                          gameplay_guide: ''
                        })
                      : { hasAccess: true }
                    const hasAccess = accessResult.hasAccess

                    // Generate tooltip summary
                    const summary = []
                    if (armor?.stats) {
                      if (armor.stats.RMEC) summary.push(`RMEC: ${armor.stats.RMEC}`)
                      if (armor.stats.RRAD) summary.push(`RRAD: ${armor.stats.RRAD}`)
                      if (armor.stats.RINT) summary.push(`RINT: ${armor.stats.RINT}`)
                      if (armor.stats.speed_bonus) summary.push(armor.stats.speed_bonus)
                      if (armor.stats.stat_modifier) summary.push(armor.stats.stat_modifier)
                    }
                    if (armor?.description && summary.length < 4) summary.push(armor.description)

                    return (
                      <Tooltip key={armorName}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-accent ${
                              !hasAccess
                                ? 'border-red-500 bg-red-50 dark:bg-red-950'
                                : ''
                            }`}
                            onClick={() => {
                              if (armor) setDetailItem(armor)
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {!hasAccess && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm font-medium">{armorName}</span>
                              {!hasAccess && (
                                <Badge variant="destructive" className="text-xs">
                                  Non accessible
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeArmor(armorName)
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
                                ⚠️ Non accessible
                                <div className="text-xs mt-1 whitespace-pre-line">
                                  {getDetailedAccessInfo(accessResult)}
                                </div>
                              </div>
                            )}
                            {summary.length > 0 && summary.slice(0, 4).map((line, i) => (
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

        {/* Consumables */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-500" />
                Consommables ({equipment.consumables?.length || 0})
              </CardTitle>
              <Button size="sm" onClick={() => openSelector('consumable')}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!equipment.consumables || equipment.consumables.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun consommable
              </p>
            ) : (
              <TooltipProvider>
                <div className="space-y-2">
                  {equipment.consumables.map((item) => {
                    const consumable = allConsumables.find((c) => c.name === item.name)

                    // Generate tooltip summary - same logic as ConsumableDetail
                    const summary = []
                    if (consumable && consumable.effect) {
                      // Display each effect property
                      if (consumable.effect.healing) {
                        summary.push(`Soins: ${consumable.effect.healing}`)
                      }
                      if (consumable.effect.damage) {
                        summary.push(`Dégâts: ${consumable.effect.damage}`)
                      }
                      if (consumable.effect.area || consumable.effect.area_effect) {
                        summary.push(`Zone: ${consumable.effect.area || consumable.effect.area_effect}`)
                      }
                      if (consumable.effect.duration) {
                        summary.push(`Durée: ${consumable.effect.duration}`)
                      }
                      if (consumable.effect.flux_restoration) {
                        summary.push(`Flux: ${consumable.effect.flux_restoration}`)
                      }
                      if (consumable.effect.recharge_reduction) {
                        summary.push(`Recharge: ${consumable.effect.recharge_reduction}`)
                      }
                      if (consumable.effect.spell_enhancement) {
                        summary.push(`Amélioration: ${consumable.effect.spell_enhancement}`)
                      }
                      if (consumable.effect.spell_block) {
                        summary.push(`Blocage: ${consumable.effect.spell_block}`)
                      }
                      if (consumable.effect.emp_effect) {
                        summary.push(`IEM: ${consumable.effect.emp_effect}`)
                      }
                      if (consumable.effect.blind_effect) {
                        summary.push(`Aveuglement: ${consumable.effect.blind_effect}`)
                      }
                      if (consumable.effect.special) {
                        summary.push(`Spécial: ${consumable.effect.special}`)
                      }
                      if (consumable.effect.usage) {
                        summary.push(`Action: ${consumable.effect.usage}`)
                      }
                    }
                    // Add truncated description
                    if (consumable?.description) {
                      const truncated = consumable.description.length > 100
                        ? consumable.description.substring(0, 100) + '...'
                        : consumable.description
                      summary.push(truncated)
                    }

                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <div
                            className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-accent"
                            onClick={() => {
                              if (consumable) setDetailItem(consumable)
                            }}
                          >
                            <span className="text-sm font-medium">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <div onClick={(e) => e.stopPropagation()}>
                                <NumberInput
                                  value={item.quantity}
                                  onChange={(value) => updateConsumableQuantity(item.name, value)}
                                  min={1}
                                  className="w-32"
                                />
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeConsumable(item.name)
                                }}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                          </div>
                        </div>
                        </TooltipTrigger>
                        {summary.length > 0 && (
                          <TooltipContent className="max-w-xs">
                            <div className="text-sm space-y-1">
                              {summary.map((line, i) => (
                                <div key={i} className="line-clamp-3">{line}</div>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )
                  })}
                </div>
              </TooltipProvider>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Item Selector Dialog with Preview */}
      <Dialog open={selectorOpen} onOpenChange={closeSelector}>
        <DialogContent className="max-w-full sm:max-w-7xl max-h-[85vh] overflow-hidden flex flex-col p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {selectorType === 'weapon' && 'Sélectionner une arme'}
              {selectorType === 'armor' && 'Sélectionner une armure'}
              {selectorType === 'consumable' && 'Sélectionner un consommable'}
            </DialogTitle>
            <DialogDescription>
              {selectorType !== 'consumable' &&
                `${getFilteredItems().length} objets accessibles avec vos affinités`}
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Two-Column Layout */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 min-h-0">
            {/* Left: Item List */}
            <TooltipProvider>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {getFilteredItems().length === 0 ? (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? 'Aucun objet ne correspond à la recherche'
                        : 'Aucun objet accessible'}
                    </p>
                  </div>
                ) : (
                  getFilteredItems().map((item: any) => {
                    const isSelected = isItemSelected(item.name)
                    const isPreviewed = previewItem?.name === item.name

                    // Generate tooltip summary based on item type
                    const summary = []
                    if ('damage' in item && item.damage) summary.push(`Dégâts: ${item.damage}`)
                    if ('range' in item && item.range) summary.push(`Portée: ${item.range}`)
                    if ('stats' in item) {
                      const stats = item.stats
                      if (stats.RMEC) summary.push(`RMEC: ${stats.RMEC}`)
                      if (stats.RRAD) summary.push(`RRAD: ${stats.RRAD}`)
                      if (stats.RINT) summary.push(`RINT: ${stats.RINT}`)
                      if (stats.speed_bonus) summary.push(stats.speed_bonus)
                      if (stats.stat_modifier) summary.push(stats.stat_modifier)
                    }
                    if ('effect' in item && item.effect) summary.push(`Effet: ${item.effect}`)
                    if (item.description && summary.length < 3) summary.push(item.description)

                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                              isPreviewed
                                ? 'bg-primary/10 border-primary'
                                : 'hover:bg-accent'
                            }`}
                            onClick={() => setPreviewItem(item)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              {item.category && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {item.category}
                                </Badge>
                              )}
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
                              {summary.slice(0, 4).map((line, i) => (
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
            <div className="w-full md:w-[45%] md:border-l md:pl-4 overflow-y-auto">
              {previewItem ? (
                <div className="space-y-4">
                  {selectorType === 'weapon' && <WeaponDetail weapon={previewItem as Weapon} />}
                  {selectorType === 'armor' && <ArmorDetail armor={previewItem as Armor} />}
                  {selectorType === 'consumable' && (
                    <ConsumableDetail consumable={previewItem as Consumable} />
                  )}
                  <div className="sticky bottom-0 bg-background pt-4 border-t">
                    <Button
                      className="w-full"
                      onClick={addPreviewedItem}
                      disabled={isItemSelected(previewItem.name || '')}
                    >
                      {isItemSelected(previewItem.name || '')
                        ? 'Déjà ajouté'
                        : 'Ajouter cet objet'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Cliquez sur un objet pour voir ses détails
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={!!detailItem} onOpenChange={(open) => !open && setDetailItem(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{detailItem?.name}</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <>
              {'damage' in detailItem && <WeaponDetail weapon={detailItem as Weapon} />}
              {'stats' in detailItem && !('damage' in detailItem) && <ArmorDetail armor={detailItem as Armor} />}
              {'effect' in detailItem && <ConsumableDetail consumable={detailItem as Consumable} />}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
