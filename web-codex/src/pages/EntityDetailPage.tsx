import { useState, useMemo } from 'react'
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
  Ghost,
  Skull,
  Handshake,
  Users,
  Target,
  Trophy,
  Calculator,
  FileText
} from 'lucide-react'
import { useEntities, useSpells, useWeapons, useArmors, useSkills, useConsumables } from '@/lib/dataProvider'
import { calculateTotalPointBuy } from '@/lib/pointBuyCalculator'
import { filterCharacterContent, exportCharacterToPDF } from '@/lib/pdfExport'
import { SpellDetail } from '@/components/SpellDetail'
import { WeaponDetail } from '@/components/WeaponDetail'
import { ArmorDetail } from '@/components/ArmorDetail'
import { SkillDetail } from '@/components/SkillDetail'
import { ConsumableDetail } from '@/components/ConsumableDetail'
import { BaseStatsCard } from '@/components/character/BaseStatsCard'
import { CharacterStatsCard } from '@/components/character/CharacterStatsCard'
import { AffinitiesCard } from '@/components/character/AffinitiesCard'
import { EquipmentCard } from '@/components/character/EquipmentCard'
import { AbilitiesSection } from '@/components/character/AbilitiesSection'
import type { Spell, Weapon, Armor, Skill, Consumable } from '@/types'

const getAlignementColor = (alignement?: string) => {
  if (!alignement) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  const aligned = alignement.toLowerCase()
  if (aligned === 'amical' || aligned === 'ami' || aligned === 'allié') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  if (aligned === 'hostile' || aligned === 'ennemi') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  if (aligned === 'neutre') return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
}

const getAlignementIcon = (alignement?: string) => {
  if (!alignement) return <Users className="h-4 w-4" />
  const aligned = alignement.toLowerCase()
  if (aligned === 'amical' || aligned === 'ami' || aligned === 'allié') return <Handshake className="h-4 w-4" />
  if (aligned === 'hostile' || aligned === 'ennemi') return <Skull className="h-4 w-4" />
  if (aligned === 'neutre') return <Users className="h-4 w-4" />
  return <Users className="h-4 w-4" />
}


export function EntityDetailPage() {
  const { entityName } = useParams<{ entityName: string }>()
  const navigate = useNavigate()
  const { entities, loading } = useEntities()
  const { spells } = useSpells()
  const { weapons } = useWeapons()
  const { armors } = useArmors()
  const { skills } = useSkills()
  const { consumables } = useConsumables()

  // Find entity by matching URL slug to entity name
  const entity = useMemo(() => {
    if (loading || !entityName) return null
    return entities.find(e => {
      const slug = (e.name || '').toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9-]/g, '')
      return slug === entityName
    }) || null
  }, [entityName, entities, loading])

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
    if (!entity) return

    try {
      const filteredData = filterCharacterContent(
        entity,
        spells,
        weapons,
        armors,
        skills,
        consumables
      )
      exportCharacterToPDF(filteredData, armors, weapons)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      // You could add a toast notification here in the future
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement de l'entité...</div>
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Entité non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            L'entité "{entityName}" n'existe pas ou n'a pas pu être chargée.
          </p>
          <Button asChild>
            <Link to="/entites">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux entités
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
        <Link to="/entites" className="hover:text-foreground transition-colors">
          Entités
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{entity.name}</span>
      </nav>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/entites')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux entités
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exporter PDF
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold tracking-tight">{entity.name}</h1>
            <Ghost className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Faction and Alignement badges */}
          <div className="flex gap-3 mb-4">
            {entity.faction && (
              <Badge variant="outline" className="text-base px-4 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {entity.faction}
              </Badge>
            )}
            {entity.alignement && (
              <Badge className={`text-base px-4 py-1 ${getAlignementColor(entity.alignement)}`}>
                <span className="flex items-center gap-2">
                  {getAlignementIcon(entity.alignement)}
                  {entity.alignement}
                </span>
              </Badge>
            )}
            {entity.type && (
              <Badge variant="outline" className="text-base px-4 py-1">
                {entity.type}
              </Badge>
            )}
          </div>

          <p className="text-xl text-muted-foreground leading-relaxed mt-4">
            {entity.description}
          </p>
        </div>

        {/* Hero Image */}
        {entity.image && (
          <div className="mt-6">
            <img
              src={`${import.meta.env.BASE_URL}${entity.image}`}
              alt={entity.name}
              className="rounded-lg w-full max-w-2xl mx-auto shadow-lg"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Character Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseStatsCard character={entity} />
        <CharacterStatsCard character={entity} />
      </div>

      {/* Point Buy Breakdown */}
      {(() => {
        const pointBuy = calculateTotalPointBuy(entity, weapons, armors, skills, consumables)

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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Stats de base</div>
                    <div className="text-lg font-semibold">{pointBuy.baseStats} pts</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Résistances</div>
                    <div className="text-lg font-semibold">{pointBuy.resistances} pts</div>
                  </div>
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
      <AffinitiesCard character={entity} />

      {/* Equipment */}
      <EquipmentCard
        character={entity}
        weapons={weapons}
        armors={armors}
        consumables={consumables}
        onWeaponClick={openWeaponDetail}
        onArmorClick={openArmorDetail}
        onConsumableClick={openConsumableDetail}
      />

      {/* Abilities */}
      <AbilitiesSection
        character={entity}
        spells={spells}
        skills={skills}
        onSpellClick={openSpellDetail}
        onSkillClick={openSkillDetail}
      />

      {/* Gameplay Guide */}
      {entity.gameplay_guide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Guide de jeu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {entity.gameplay_guide}
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
