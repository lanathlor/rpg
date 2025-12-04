import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Home,
  ChevronRight,
  Users,
  Heart,
  Gauge,
  Brain,
  Eye,
  Target,
  Sparkles,
  Flame,
  Zap,
  Shield,
  Sword,
  Package,
  Scroll,
  BookOpen,
  Activity,
  Star,
  Hand,
  FileText,
  Trophy,
  Calculator
} from 'lucide-react'
import { useClasses, useSpells, useWeapons, useArmors, useSkills, useConsumables } from '@/lib/dataProvider'
import { getSchoolIcon, getSchoolColor, getTypeIcon } from '@/lib/schoolUtils'
import { checkSpellSeriesAccess, checkWeaponAccess, checkArmorAccess, checkSkillAccess, checkConsumableAccess, getAccessDescription, getDetailedAccessInfo } from '@/lib/accessUtils'
import { filterCharacterContent, exportCharacterToPDF } from '@/lib/pdfExport'
import { calculateTotalPointBuy } from '@/lib/pointBuyCalculator'
import { SpellDetail } from '@/components/SpellDetail'
import { WeaponDetail } from '@/components/WeaponDetail'
import { ArmorDetail } from '@/components/ArmorDetail'
import { SkillDetail } from '@/components/SkillDetail'
import { ConsumableDetail } from '@/components/ConsumableDetail'
import type { Spell, Weapon, Armor, Skill, Consumable } from '@/types'

const getStatIcon = (statName: string) => {
  switch (statName) {
    case 'force': return <Sword className="h-4 w-4 text-red-500" />
    case 'dexterite': return <Zap className="h-4 w-4 text-yellow-500" />
    case 'constitution': return <Activity className="h-4 w-4 text-green-500" />
    case 'intelligence': return <Brain className="h-4 w-4 text-purple-500" />
    case 'perception': return <Eye className="h-4 w-4 text-blue-500" />
    case 'precision': return <Target className="h-4 w-4 text-orange-500" />
    case 'charisme': return <Star className="h-4 w-4 text-pink-500" />
    default: return <Hand className="h-4 w-4 text-gray-500" />
  }
}

const getHighestStat = (characterClass: any) => {
  const stats = characterClass.stats
  const statEntries = [
    { name: 'Force', value: stats.force, key: 'force' },
    { name: 'Dextérité', value: stats.dexterite, key: 'dexterite' },
    { name: 'Constitution', value: stats.constitution, key: 'constitution' },
    { name: 'Intelligence', value: stats.intelligence, key: 'intelligence' },
    { name: 'Perception', value: stats.perception, key: 'perception' },
    { name: 'Précision', value: stats.precision, key: 'precision' },
    { name: 'Charisme', value: stats.charisme, key: 'charisme' }
  ]

  return statEntries.reduce((highest, current) =>
    current.value > highest.value ? current : highest
  )
}


export function ClassDetailPage() {
  const { className } = useParams<{ className: string }>()
  const navigate = useNavigate()
  const { classes, loading } = useClasses()
  const { spells } = useSpells()
  const { weapons } = useWeapons()
  const { armors } = useArmors()
  const { skills } = useSkills()
  const { consumables } = useConsumables()

  // Find class by matching URL slug to class name
  const characterClass = useMemo(() => {
    if (loading || !className) return null
    return classes.find(c => {
      const slug = c.name.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9-]/g, '')
      return slug === className
    }) || null
  }, [className, classes, loading])

  // Popup state management
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null)
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [selectedConsumable, setSelectedConsumable] = useState<Consumable | null>(null)

  // Item lookup functions
  const findSpellByName = (spellName: string) => {
    return spells.find(spell => spell.spell_series === spellName || spell.name === spellName)
  }

  const findWeaponByName = (weaponName: string) => {
    return weapons.find(weapon => weapon.name === weaponName)
  }

  const findArmorByName = (armorName: string) => {
    return armors.find(armor => armor.name === armorName)
  }

  const findSkillByName = (skillName: string) => {
    return skills.find(skill => skill.name === skillName)
  }

  const findConsumableByName = (consumableName: string) => {
    return consumables.find(consumable => consumable.name === consumableName)
  }

  // Click handlers for popups
  const openSpellDetail = (spellName: string) => {
    const spell = findSpellByName(spellName)
    if (spell) setSelectedSpell(spell)
  }

  const openWeaponDetail = (weaponName: string) => {
    const weapon = findWeaponByName(weaponName)
    if (weapon) setSelectedWeapon(weapon)
  }

  const openArmorDetail = (armorName: string) => {
    const armor = findArmorByName(armorName)
    if (armor) setSelectedArmor(armor)
  }

  const openSkillDetail = (skillName: string) => {
    const skill = findSkillByName(skillName)
    if (skill) setSelectedSkill(skill)
  }

  const openConsumableDetail = (consumableName: string) => {
    const consumable = findConsumableByName(consumableName)
    if (consumable) setSelectedConsumable(consumable)
  }

  const closeAllDialogs = () => {
    setSelectedSpell(null)
    setSelectedWeapon(null)
    setSelectedArmor(null)
    setSelectedSkill(null)
    setSelectedConsumable(null)
  }

  // Handle PDF export
  const handleExportPDF = () => {
    if (!characterClass) return

    try {
      const filteredData = filterCharacterContent(
        characterClass,
        spells,
        weapons,
        armors,
        skills,
        consumables
      )
      exportCharacterToPDF(filteredData)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      // You could add a toast notification here in the future
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement de la classe...</div>
      </div>
    )
  }

  if (!characterClass) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Classe non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            La classe "{className}" n'existe pas ou n'a pas pu être chargée.
          </p>
          <Button asChild>
            <Link to="/classes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux classes
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/classes" className="hover:text-foreground transition-colors">
          Classes
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{characterClass.name}</span>
      </nav>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/classes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux classes
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter PDF
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{characterClass.name}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            {characterClass.description}
          </p>
        </div>
      </div>

      <Separator />

      {/* Character Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Statistiques de base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Points de vie</span>
                <div className="flex items-center gap-2 mt-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-lg font-semibold">{characterClass.base_stats.health} PV</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Vitesse</span>
                <div className="flex items-center gap-2 mt-1">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="text-lg font-semibold">{characterClass.base_stats.speed} m/tour</span>
                </div>
              </div>
            </div>

            {characterClass.flux_system && (
              <div>
                <h4 className="font-medium text-sm mb-2">Système de flux</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Réserve:</span>
                    <div className="font-semibold">{characterClass.flux_system.reserve}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Par tour:</span>
                    <div className="font-semibold">{characterClass.flux_system.per_turn}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Récupération:</span>
                    <div className="font-semibold">{characterClass.flux_system.recovery}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Character Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.cloneElement(getStatIcon(getHighestStat(characterClass).key), { className: "h-5 w-5" })}
              Caractéristiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(characterClass.stats).map(([statName, value]) => (
                <div key={statName} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatIcon(statName)}
                    <span className="text-sm font-medium capitalize">
                      {statName === 'dexterite' ? 'Dextérité' : statName}
                    </span>
                  </div>
                  <Badge variant="secondary">{value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Point Buy Breakdown */}
      {(() => {
        const pointBuy = calculateTotalPointBuy(characterClass, weapons, armors, skills, consumables)

        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-amber-500" />
                Calcul de points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Total - Prominent Display */}
                <div className="flex items-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-2xl font-bold">
                        {pointBuy.total} points
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Caractéristiques</div>
                    <div className="text-lg font-semibold">{pointBuy.stats} pts</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Affinités</div>
                    <div className="text-lg font-semibold">{pointBuy.affinities} pts</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Flux</div>
                    <div className="text-lg font-semibold">{pointBuy.flux} pts</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Équipement</div>
                    <div className="text-lg font-semibold">{pointBuy.equipment} pts</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Compétences</div>
                    <div className="text-lg font-semibold">{pointBuy.competences} pts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })()}

      {/* Affinities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Affinités arcanotechniques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Combat Affinities */}
            <div>
              <h4 className="font-medium text-sm mb-3">Combat</h4>
              <div className="space-y-2">
                {characterClass.affinities.distance !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Distance</span>
                    <Badge variant="outline">{characterClass.affinities.distance}</Badge>
                  </div>
                )}
                {characterClass.affinities.melee !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Corps à corps</span>
                    <Badge variant="outline">{characterClass.affinities.melee}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Schools */}
            {characterClass.affinities.schools && (
              <div>
                <h4 className="font-medium text-sm mb-3">Écoles d'arcanotechnie</h4>
                <div className="space-y-2">
                  {Object.entries(characterClass.affinities.schools).map(([school, level]) => {
                    const Icon = getSchoolIcon(school)
                    return (
                      <div key={school} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm capitalize">{school}</span>
                        </div>
                        <Badge variant="outline">{level}</Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Types */}
            {characterClass.affinities.types && (
              <div>
                <h4 className="font-medium text-sm mb-3">Types d'arcanotechnie</h4>
                <div className="space-y-2">
                  {Object.entries(characterClass.affinities.types).map(([type, level]) => {
                    const Icon = getTypeIcon(type)
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm capitalize">{type}</span>
                        </div>
                        <Badge variant="outline">{level}</Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Equipment */}
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
            {characterClass.equipment.weapons && characterClass.equipment.weapons.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Sword className="h-4 w-4" />
                  Armes
                </h4>
                <div className="space-y-2">
                  {characterClass.equipment.weapons.map((weapon, index) => {
                    const weaponData = findWeaponByName(weapon)
                    const accessResult = weaponData ? checkWeaponAccess(weaponData, characterClass) : { hasAccess: true }
                    const hasAccess = accessResult.hasAccess

                    return (
                      <div
                        key={index}
                        onClick={() => openWeaponDetail(weapon)}
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
            {characterClass.equipment.armor && characterClass.equipment.armor.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Armures
                </h4>
                <div className="space-y-2">
                  {characterClass.equipment.armor.map((armor, index) => {
                    const armorData = findArmorByName(armor)
                    const accessResult = armorData ? checkArmorAccess(armorData, characterClass) : { hasAccess: true }
                    const hasAccess = accessResult.hasAccess

                    return (
                      <div
                        key={index}
                        onClick={() => openArmorDetail(armor)}
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
            {characterClass.equipment.consumables && characterClass.equipment.consumables.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Consommables
                </h4>
                <div className="space-y-2">
                  {characterClass.equipment.consumables.map((consumable, index) => {
                    const consumableData = findConsumableByName(consumable.name)
                    const accessResult = consumableData ? checkConsumableAccess(consumableData, characterClass) : { hasAccess: true }
                    const hasAccess = accessResult.hasAccess

                    return (
                      <div
                        key={index}
                        onClick={() => openConsumableDetail(consumable.name)}
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

      {/* Abilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        {characterClass.skills && characterClass.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Compétences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {characterClass.skills.map((skill, index) => {
                  const skillData = findSkillByName(skill)
                  const accessResult = skillData ? checkSkillAccess(skillData, characterClass) : { hasAccess: true }
                  const hasAccess = accessResult.hasAccess

                  return (
                    <div
                      key={index}
                      onClick={() => openSkillDetail(skill)}
                      className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                        !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                      }`}
                      title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{skill}</span>
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
            </CardContent>
          </Card>
        )}

        {/* Spells */}
        {characterClass.spells && characterClass.spells.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scroll className="h-5 w-5 text-purple-500" />
                Sorts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {characterClass.spells.map((spell, index) => {
                  const spellData = findSpellByName(spell)
                  const accessResult = spellData ? checkSpellSeriesAccess(spellData, characterClass.affinities) : { hasAccess: true }
                  const hasAccess = accessResult.hasAccess

                  return (
                    <div
                      key={index}
                      onClick={() => openSpellDetail(spell)}
                      className={`block p-2 rounded-md border hover:bg-muted transition-colors cursor-pointer relative ${
                        !hasAccess ? 'border-red-500 border-2 bg-red-50 dark:bg-red-950/20' : ''
                      }`}
                      title={!hasAccess ? getDetailedAccessInfo(accessResult) : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{spell}</span>
                        <div className="flex items-center gap-2">
                          {!hasAccess && (
                            <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
                              ✗ Restreint
                            </Badge>
                          )}
                          {hasAccess && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                              ✓ Accessible
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gameplay Guide */}
      {characterClass.gameplay_guide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Guide de jeu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {characterClass.gameplay_guide}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal Dialogs */}
      {/* Spell Detail Modal */}
      <Dialog open={!!selectedSpell} onOpenChange={closeAllDialogs}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du sort</DialogTitle>
          </DialogHeader>
          {selectedSpell && <SpellDetail spell={selectedSpell} />}
        </DialogContent>
      </Dialog>

      {/* Weapon Detail Modal */}
      <Dialog open={!!selectedWeapon} onOpenChange={closeAllDialogs}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'arme</DialogTitle>
          </DialogHeader>
          {selectedWeapon && <WeaponDetail weapon={selectedWeapon} />}
        </DialogContent>
      </Dialog>

      {/* Armor Detail Modal */}
      <Dialog open={!!selectedArmor} onOpenChange={closeAllDialogs}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'armure</DialogTitle>
          </DialogHeader>
          {selectedArmor && <ArmorDetail armor={selectedArmor} />}
        </DialogContent>
      </Dialog>

      {/* Skill Detail Modal */}
      <Dialog open={!!selectedSkill} onOpenChange={closeAllDialogs}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la compétence</DialogTitle>
          </DialogHeader>
          {selectedSkill && <SkillDetail skill={selectedSkill} />}
        </DialogContent>
      </Dialog>

      {/* Consumable Detail Modal */}
      <Dialog open={!!selectedConsumable} onOpenChange={closeAllDialogs}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du consommable</DialogTitle>
          </DialogHeader>
          {selectedConsumable && <ConsumableDetail consumable={selectedConsumable} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}