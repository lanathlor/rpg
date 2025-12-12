import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Scenario } from '@/types/scenarios'
import {
  Map,
  Clock,
  Users,
  BookOpen,
  Shield,
  Target,
  Star,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  User,
  Swords,
  Trophy,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { useState } from 'react'

interface ScenarioDetailProps {
  scenario: Scenario
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'advanced':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    case 'expert':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

const getEncounterTypeIcon = (type: string) => {
  switch (type) {
    case 'combat':
      return <Swords className="h-4 w-4" />
    case 'social':
      return <Users className="h-4 w-4" />
    case 'exploration':
      return <Map className="h-4 w-4" />
    case 'puzzle':
      return <Lightbulb className="h-4 w-4" />
    default:
      return <Star className="h-4 w-4" />
  }
}

export function ScenarioDetail({ scenario }: ScenarioDetailProps) {
  const [expandedActs, setExpandedActs] = useState<Set<string>>(new Set())
  const [gmNotesExpanded, setGmNotesExpanded] = useState(false)

  const toggleAct = (actId: string) => {
    const newExpanded = new Set(expandedActs)
    if (newExpanded.has(actId)) {
      newExpanded.delete(actId)
    } else {
      newExpanded.add(actId)
    }
    setExpandedActs(newExpanded)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{scenario.name}</h1>
          {scenario.description && (
            <p className="text-lg text-muted-foreground mt-2 leading-relaxed">{scenario.description}</p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {scenario.difficulty && (
            <Badge className={getDifficultyColor(scenario.difficulty)}>
              {scenario.difficulty}
            </Badge>
          )}
          {scenario.theme && (
            <Badge variant="outline">
              <Star className="h-3 w-3 mr-1" />
              {scenario.theme}
            </Badge>
          )}
          {scenario.setting && (
            <Badge variant="outline">
              <Map className="h-3 w-3 mr-1" />
              {scenario.setting}
            </Badge>
          )}
          {scenario.category && (
            <Badge variant="secondary">{scenario.category}</Badge>
          )}
          {scenario.playtested && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              Testé
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Session Info */}
      {scenario.session_info && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Informations de session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenario.session_info.duration && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée
                  </span>
                  <div className="text-lg font-semibold mt-1">{scenario.session_info.duration}</div>
                </div>
              )}
              {scenario.session_info.player_count && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Joueurs
                  </span>
                  <div className="text-lg font-semibold mt-1">{scenario.session_info.player_count}</div>
                </div>
              )}
              {scenario.session_info.recommended_points && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Points
                  </span>
                  <div className="text-lg font-semibold mt-1">{scenario.session_info.recommended_points}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Synopsis - GM Only with Warning */}
      {scenario.synopsis && (
        <Card className="border-2 border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              ⚠️ SYNOPSIS - MJ SEULEMENT ⚠️
            </CardTitle>
            <p className="text-sm text-red-600 dark:text-red-500 font-medium">
              ATTENTION : Cette section contient des spoilers majeurs. NE PAS lire si vous êtes joueur !
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-line">{scenario.synopsis}</p>
          </CardContent>
        </Card>
      )}

      {/* Description longue */}
      {scenario.description_long && (
        <Card>
          <CardHeader>
            <CardTitle>Description complète</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed whitespace-pre-line">{scenario.description_long}</p>
          </CardContent>
        </Card>
      )}

      {/* Acts */}
      {scenario.acts && scenario.acts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Structure du scénario
          </h2>
          <div className="space-y-3">
            {scenario.acts.map((act) => (
              <Card key={act.act} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => toggleAct(act.act)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Acte {act.act}</Badge>
                      <CardTitle className="text-lg">{act.title}</CardTitle>
                    </div>
                    {expandedActs.has(act.act) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  {act.description && (
                    <CardDescription>{act.description}</CardDescription>
                  )}
                </CardHeader>
                {expandedActs.has(act.act) && (
                  <CardContent className="space-y-4">
                    {act.key_scenes && act.key_scenes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Scènes clés :</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {act.key_scenes.map((scene, idx) => (
                            <li key={idx} className="text-muted-foreground">{scene}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {act.estimated_duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Durée estimée : {act.estimated_duration}</span>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* NPCs */}
      {scenario.npcs && scenario.npcs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-6 w-6" />
            Personnages Non-Joueurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.npcs.map((npc, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{npc.name}</CardTitle>
                  <CardDescription>{npc.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {npc.description && (
                    <p className="text-muted-foreground">{npc.description}</p>
                  )}
                  {npc.stats_reference && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Stats : {npc.stats_reference}</span>
                    </div>
                  )}
                  {npc.motivations && (
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 mt-0.5" />
                      <span className="text-muted-foreground">{npc.motivations}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Encounters */}
      {scenario.encounters && scenario.encounters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Swords className="h-6 w-6" />
            Rencontres
          </h2>
          <div className="space-y-3">
            {scenario.encounters.map((encounter, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEncounterTypeIcon(encounter.type)}
                      <CardTitle className="text-base">{encounter.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">{encounter.type}</Badge>
                      {encounter.difficulty && (
                        <Badge className={getDifficultyColor(encounter.difficulty)}>
                          {encounter.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {encounter.location && (
                    <CardDescription className="flex items-center gap-1">
                      <Map className="h-3 w-3" />
                      {encounter.location}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {encounter.description && (
                    <p className="text-muted-foreground">{encounter.description}</p>
                  )}

                  {encounter.enemies && encounter.enemies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Ennemis :</h4>
                      <ul className="space-y-1">
                        {encounter.enemies.map((enemy, eidx) => (
                          <li key={eidx} className="flex items-center gap-2">
                            <Shield className="h-3 w-3 text-muted-foreground" />
                            <span>{enemy.count}x {enemy.name}</span>
                            {enemy.stats_reference && (
                              <span className="text-muted-foreground text-xs">({enemy.stats_reference})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {encounter.tactics && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Tactique :
                      </h4>
                      <p className="text-muted-foreground">{encounter.tactics}</p>
                    </div>
                  )}

                  {encounter.challenges && encounter.challenges.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Défis :</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {encounter.challenges.map((challenge, cidx) => (
                          <li key={cidx}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {encounter.success_conditions && encounter.success_conditions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Conditions de succès :
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {encounter.success_conditions.map((condition, cidx) => (
                          <li key={cidx}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {encounter.failure_consequence && (
                    <div className="bg-destructive/10 p-3 rounded-md">
                      <h4 className="font-semibold mb-1 flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        En cas d'échec :
                      </h4>
                      <p className="text-muted-foreground">{encounter.failure_consequence}</p>
                    </div>
                  )}

                  {encounter.alternative && (
                    <div className="bg-primary/10 p-3 rounded-md">
                      <h4 className="font-semibold mb-1">Alternative :</h4>
                      <p className="text-muted-foreground">{encounter.alternative}</p>
                    </div>
                  )}

                  {encounter.rewards && encounter.rewards.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        Récompenses :
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {encounter.rewards.map((reward, ridx) => (
                          <li key={ridx}>{reward}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rewards */}
      {scenario.rewards && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Récompenses globales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {scenario.rewards.points && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">Points :</span>
                <span>{scenario.rewards.points}</span>
              </div>
            )}
            {scenario.rewards.credits && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">Crédits :</span>
                <span>{scenario.rewards.credits}</span>
              </div>
            )}
            {scenario.rewards.items && scenario.rewards.items.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Objets :</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {scenario.rewards.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {scenario.rewards.special && (
              <div className="bg-primary/10 p-3 rounded-md">
                <h4 className="font-semibold mb-1">Récompense spéciale :</h4>
                <p className="text-muted-foreground whitespace-pre-line">{scenario.rewards.special}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Variants */}
      {scenario.variants && scenario.variants.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Variantes
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {scenario.variants.map((variant, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-base">{variant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{variant.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* GM Notes & Tips */}
      {(scenario.gm_notes || scenario.gm_tips) && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setGmNotesExpanded(!gmNotesExpanded)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-500" />
                Notes pour le MJ
              </CardTitle>
              {gmNotesExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {gmNotesExpanded && (
            <CardContent className="space-y-4 text-sm">
              {scenario.gm_notes && (
                <div className="space-y-2">
                  {scenario.gm_notes.preparation_time && (
                    <div>
                      <span className="font-semibold">Temps de préparation : </span>
                      <span className="text-muted-foreground">{scenario.gm_notes.preparation_time}</span>
                    </div>
                  )}
                  {scenario.gm_notes.complexity && (
                    <div>
                      <span className="font-semibold">Complexité : </span>
                      <Badge variant="outline">{scenario.gm_notes.complexity}</Badge>
                    </div>
                  )}
                  {scenario.gm_notes.tone && (
                    <div>
                      <span className="font-semibold">Ton : </span>
                      <span className="text-muted-foreground">{scenario.gm_notes.tone}</span>
                    </div>
                  )}
                </div>
              )}
              {scenario.gm_tips && (
                <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Conseils de maîtrise :</h4>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{scenario.gm_tips}</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Tags & Metadata */}
      <div className="flex flex-wrap gap-2">
        {scenario.tags?.map((tag, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Author & Date */}
      {(scenario.author || scenario.last_updated) && (
        <div className="text-xs text-muted-foreground text-center space-y-1">
          {scenario.author && <div>Auteur : {scenario.author}</div>}
          {scenario.last_updated && <div>Dernière mise à jour : {scenario.last_updated}</div>}
        </div>
      )}
    </div>
  )
}
