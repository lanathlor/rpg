import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Sword, Shield } from 'lucide-react'
import { checkWeaponAccess, checkArmorAccess, checkConsumableAccess, getDetailedAccessInfo } from '@/lib/accessUtils'
import type { CharacterClass, Entity, Weapon, Armor, Consumable } from '@/types'

interface EquipmentCardProps {
  character: CharacterClass | Entity
  weapons: Weapon[]
  armors: Armor[]
  consumables: Consumable[]
  onWeaponClick: (weaponName: string) => void
  onArmorClick: (armorName: string) => void
  onConsumableClick: (consumableName: string) => void
}

export function EquipmentCard({
  character,
  weapons,
  armors,
  consumables,
  onWeaponClick,
  onArmorClick,
  onConsumableClick
}: EquipmentCardProps) {
  const findWeaponByName = (weaponName: string) => {
    return weapons.find(weapon => weapon.name === weaponName)
  }

  const findArmorByName = (armorName: string) => {
    return armors.find(armor => armor.name === armorName)
  }

  const findConsumableByName = (consumableName: string) => {
    return consumables.find(consumable => consumable.name === consumableName)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-500" />
          Équipement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weapons */}
          {character.equipment.weapons && character.equipment.weapons.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Sword className="h-4 w-4" />
                Armes
              </h4>
              <div className="space-y-2">
                {character.equipment.weapons.map((weapon, index) => {
                  const weaponData = findWeaponByName(weapon)
                  const accessResult = weaponData ? checkWeaponAccess(weaponData, character) : { hasAccess: true }
                  const hasAccess = accessResult.hasAccess

                  return (
                    <div
                      key={index}
                      onClick={() => onWeaponClick(weapon)}
                      className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                        !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                      }`}
                      title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{weapon}</span>
                        {!hasAccess && (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                            ✗
                          </Badge>
                        )}
                      </div>
                      {!hasAccess && accessResult.reason && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {accessResult.reason}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Armor */}
          {character.equipment.armor && character.equipment.armor.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Armures
              </h4>
              <div className="space-y-2">
                {character.equipment.armor.map((armor, index) => {
                  const armorData = findArmorByName(armor)
                  const accessResult = armorData ? checkArmorAccess(armorData, character) : { hasAccess: true }
                  const hasAccess = accessResult.hasAccess

                  return (
                    <div
                      key={index}
                      onClick={() => onArmorClick(armor)}
                      className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                        !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                      }`}
                      title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{armor}</span>
                        {!hasAccess && (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                            ✗
                          </Badge>
                        )}
                      </div>
                      {!hasAccess && accessResult.reason && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {accessResult.reason}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Consumables */}
          {character.equipment.consumables && character.equipment.consumables.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Consommables
              </h4>
              <div className="space-y-2">
                {character.equipment.consumables.map((consumable, index) => {
                  const consumableData = findConsumableByName(consumable.name)
                  const accessResult = consumableData ? checkConsumableAccess(consumableData, character) : { hasAccess: true }
                  const hasAccess = accessResult.hasAccess

                  return (
                    <div
                      key={index}
                      onClick={() => onConsumableClick(consumable.name)}
                      className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                        !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                      }`}
                      title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{consumable.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {consumable.quantity}
                          </Badge>
                          {!hasAccess && (
                            <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                              ✗
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!hasAccess && accessResult.reason && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {accessResult.reason}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
