import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown, ChevronUp, Shield, Target, Trophy,
  CheckCircle, AlertCircle, AlertTriangle, Swords,
  Clock, Users, Map, BookOpen, User, Star, Lightbulb,
} from 'lucide-react';
import { t } from '@/lib/i18n';

interface EntityData {
  name: string;
  description?: string;
  faction?: string;
  alignement?: string;
  type?: string;
  base_stats?: { health: number; speed: number };
  innate_resistances?: { RMEC?: number; RRAD?: number; RINT?: number };
  flux_system?: { reserve?: number; per_turn?: number; recovery?: number };
  stats?: Record<string, number>;
  affinities?: any;
  equipment?: any;
  skills?: string[];
  spells?: any[];
  gameplay_guide?: string;
  image?: string;
  pointBuyTotal?: number;
}

interface ScenarioData {
  name: string;
  description?: string;
  description_long?: string;
  synopsis?: string;
  category?: string;
  theme?: string;
  difficulty?: string;
  setting?: string;
  playtested?: boolean;
  session_info?: { duration?: string; player_count?: string; recommended_points?: string };
  gm_notes?: { preparation_time?: string; complexity?: string; tone?: string };
  gm_tips?: string;
  requirements?: { required_rules?: string[]; recommended_classes?: string[] };
  acts?: any[];
  encounters?: any[];
  npcs?: any[];
  rewards?: any;
  variants?: any[];
  tags?: string[];
  author?: string;
  last_updated?: string;
}

interface Props {
  scenario: ScenarioData;
  entities: Record<string, EntityData>;
  base: string;
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

function getStatLabels(): Record<string, string> {
  return {
    force: t('common.stat.force'), dexterite: t('common.stat.dexterite'), constitution: t('common.stat.constitution'),
    intelligence: t('common.stat.intelligence'), perception: t('common.stat.perception'), precision: t('common.stat.precision'), charisme: t('common.stat.charisme'),
  };
}

function EntityDetailPanel({ entity, displayName }: { entity: EntityData; displayName: string }) {
  const affinities = entity.affinities || {};
  const schools = affinities.schools || {};
  const types = affinities.types || {};
  const statLabels = getStatLabels();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{displayName}</h2>
        <div className="flex gap-2 flex-wrap mt-2">
          {entity.faction && <Badge variant="outline">{entity.faction}</Badge>}
          {entity.alignement && <Badge variant="outline">{entity.alignement}</Badge>}
          {entity.type && <Badge variant="outline">{entity.type}</Badge>}
          {entity.pointBuyTotal !== undefined && entity.pointBuyTotal > 0 && (
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">{`${entity.pointBuyTotal} ${t('common.pts')}`}</Badge>
          )}
        </div>
        {entity.description && <p className="text-sm text-muted-foreground mt-2">{entity.description}</p>}
      </div>

      {entity.base_stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 border rounded-md"><div className="text-xs text-muted-foreground">{t('common.pv')}</div><div className="text-lg font-bold">{entity.base_stats.health}</div></div>
          <div className="p-3 border rounded-md"><div className="text-xs text-muted-foreground">{t('common.speed')}</div><div className="text-lg font-bold">{entity.base_stats.speed}</div></div>
          {entity.innate_resistances && (
            <>
              <div className="p-3 border rounded-md">
                <div className="text-xs text-muted-foreground">{t('common.resistances')}</div>
                <div className="text-sm font-semibold">
                  {`RMEC ${entity.innate_resistances.RMEC ?? 0} / RRAD ${entity.innate_resistances.RRAD ?? 0} / RINT ${entity.innate_resistances.RINT ?? 0}`}
                </div>
              </div>
            </>
          )}
          {entity.flux_system?.reserve !== undefined && (
            <div className="p-3 border rounded-md"><div className="text-xs text-muted-foreground">{t('common.flux')}</div><div className="text-lg font-bold">{entity.flux_system.reserve}</div></div>
          )}
        </div>
      )}

      {entity.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(entity.stats).map(([stat, val]) => (
            <div key={stat} className="flex justify-between items-center p-2 border rounded text-sm">
              <span>{statLabels[stat] || stat}</span>
              <Badge variant="secondary">{val}</Badge>
            </div>
          ))}
        </div>
      )}

      {(Object.keys(schools).length > 0 || Object.keys(types).length > 0 || affinities.distance || affinities.melee) && (
        <div>
          <h4 className="font-semibold text-sm mb-2">{t('scenarios.affinities')}</h4>
          <div className="flex flex-wrap gap-2">
            {affinities.distance && <Badge variant="outline">{`${t('scenarios.distance')} ${affinities.distance}`}</Badge>}
            {affinities.melee && <Badge variant="outline">{`${t('scenarios.melee')} ${affinities.melee}`}</Badge>}
            {Object.entries(schools).map(([s, v]) => v > 0 && <Badge key={s} variant="outline">{s}: {v as number}</Badge>)}
            {Object.entries(types).map(([tp, v]) => v > 0 && <Badge key={tp} variant="outline">{tp}: {v as number}</Badge>)}
          </div>
        </div>
      )}

      {entity.equipment && (
        <div>
          <h4 className="font-semibold text-sm mb-2">{t('scenarios.equipment')}</h4>
          <div className="flex flex-wrap gap-2">
            {entity.equipment.weapons?.map((w: string, i: number) => <Badge key={i} variant="outline">{w}</Badge>)}
            {entity.equipment.armor?.map((a: string, i: number) => <Badge key={i} variant="outline">{a}</Badge>)}
            {entity.equipment.consumables?.map((c: any, i: number) => <Badge key={i} variant="outline">{c.name}{c.quantity > 1 && ` x${c.quantity}`}</Badge>)}
          </div>
        </div>
      )}

      {entity.skills && entity.skills.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">{t('common.skills')}</h4>
          <div className="flex flex-wrap gap-2">{entity.skills.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}</div>
        </div>
      )}

      {entity.spells && entity.spells.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2">{t('common.spells')}</h4>
          <div className="flex flex-wrap gap-2">
            {entity.spells.map((sp: any, i: number) => {
              const name = typeof sp === 'string' ? sp : sp.series || sp.name;
              return <Badge key={i} variant="secondary">{name}</Badge>;
            })}
          </div>
        </div>
      )}

      {entity.gameplay_guide && (
        <div>
          <h4 className="font-semibold text-sm mb-2">{t('scenarios.gameplayGuide')}</h4>
          <p className="text-sm text-muted-foreground">{entity.gameplay_guide}</p>
        </div>
      )}
    </div>
  );
}

export function ScenarioDetailIsland({ scenario, entities, base }: Props) {
  const [expandedActs, setExpandedActs] = useState<Set<string>>(new Set());
  const [gmNotesExpanded, setGmNotesExpanded] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{ entity: EntityData; displayName: string } | null>(null);

  const toggleAct = (actId: string) => {
    const next = new Set(expandedActs);
    next.has(actId) ? next.delete(actId) : next.add(actId);
    setExpandedActs(next);
  };

  const openEntityDetail = (entityBase: string, displayName: string) => {
    const entity = entities[entityBase];
    if (entity) setSelectedEntity({ entity, displayName });
  };

  const getEntityPoints = (entityBase: string): number => entities[entityBase]?.pointBuyTotal ?? 0;

  const renderClickableEntity = (entityBase: string | undefined, name: string) => {
    if (entityBase && entities[entityBase]) {
      return (
        <span className="underline cursor-pointer hover:text-primary transition-colors" onClick={() => openEntityDetail(entityBase, name)}>
          {name}
        </span>
      );
    }
    return <span>{name}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{scenario.name}</h1>
        {scenario.description && <p className="text-lg text-muted-foreground leading-relaxed">{scenario.description}</p>}
        <div className="flex flex-wrap gap-2">
          {scenario.difficulty && <Badge className={getDifficultyColor(scenario.difficulty)}>{scenario.difficulty}</Badge>}
          {scenario.theme && <Badge variant="outline"><Star className="h-3 w-3 mr-1" />{scenario.theme}</Badge>}
          {scenario.setting && <Badge variant="outline"><Map className="h-3 w-3 mr-1" />{scenario.setting}</Badge>}
          {scenario.category && <Badge variant="secondary">{scenario.category}</Badge>}
          {scenario.playtested && <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"><CheckCircle className="h-3 w-3 mr-1" />{t('scenarios.tested')}</Badge>}
        </div>
      </div>

      <Separator />

      {/* Session Info */}
      {scenario.session_info && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />{t('scenarios.sessionInfo')}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenario.session_info.duration && <div><span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />{t('scenarios.duration')}</span><div className="text-lg font-semibold mt-1">{scenario.session_info.duration}</div></div>}
              {scenario.session_info.player_count && <div><span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" />{t('scenarios.players')}</span><div className="text-lg font-semibold mt-1">{scenario.session_info.player_count}</div></div>}
              {scenario.session_info.recommended_points && <div><span className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4" />{t('scenarios.points')}</span><div className="text-lg font-semibold mt-1">{scenario.session_info.recommended_points}</div></div>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {scenario.requirements && (
        <Card>
          <CardHeader><CardTitle>{t('scenarios.prerequisites')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {scenario.requirements.required_rules && scenario.requirements.required_rules.length > 0 && (
              <div><h4 className="text-sm font-medium text-muted-foreground mb-2">{t('scenarios.requiredRules')}</h4><div className="flex flex-wrap gap-2">{scenario.requirements.required_rules.map((r, i) => <Badge key={i} variant="outline">{r}</Badge>)}</div></div>
            )}
            {scenario.requirements.recommended_classes && scenario.requirements.recommended_classes.length > 0 && (
              <div><h4 className="text-sm font-medium text-muted-foreground mb-2">{t('scenarios.recommendedClasses')}</h4><div className="flex flex-wrap gap-2">{scenario.requirements.recommended_classes.map((c, i) => <Badge key={i} variant="outline">{c}</Badge>)}</div></div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Synopsis */}
      {scenario.synopsis && (
        <Card className="border-2 border-red-500 dark:border-red-700 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400"><AlertTriangle className="h-5 w-5" />{t('scenarios.synopsisTitle')}</CardTitle>
            <p className="text-sm text-red-600 dark:text-red-500 font-medium">{t('scenarios.spoilerWarning')}</p>
          </CardHeader>
          <CardContent><p className="text-sm leading-relaxed whitespace-pre-line">{scenario.synopsis}</p></CardContent>
        </Card>
      )}

      {/* Description longue */}
      {scenario.description_long && (
        <Card><CardHeader><CardTitle>{t('scenarios.fullDescription')}</CardTitle></CardHeader><CardContent><p className="leading-relaxed whitespace-pre-line">{scenario.description_long}</p></CardContent></Card>
      )}

      {/* Acts */}
      {scenario.acts && scenario.acts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><BookOpen className="h-6 w-6" />{t('scenarios.structure')}</h2>
          <div className="space-y-3">
            {scenario.acts.map((act: any) => (
              <Card key={act.act} className="overflow-hidden">
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => toggleAct(act.act)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{`${t('scenarios.act')} ${act.act}`}</Badge>
                      <CardTitle className="text-lg">{act.title}</CardTitle>
                    </div>
                    {expandedActs.has(act.act) ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  {act.description && <CardDescription>{act.description}</CardDescription>}
                </CardHeader>
                {expandedActs.has(act.act) && (
                  <CardContent className="space-y-4">
                    {act.key_scenes?.length > 0 && (
                      <div><h4 className="font-semibold text-sm mb-2">{t('scenarios.keyScenes')}</h4><ul className="list-disc list-inside space-y-1 text-sm">{act.key_scenes.map((s: string, i: number) => <li key={i} className="text-muted-foreground">{s}</li>)}</ul></div>
                    )}
                    {act.estimated_duration && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>{`${t('scenarios.estimatedDuration')} ${act.estimated_duration}`}</span></div>}
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
          <h2 className="text-2xl font-semibold flex items-center gap-2"><User className="h-6 w-6" />{t('scenarios.npcs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.npcs.map((npc: any, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  {npc.entity_base ? (
                    <CardTitle className="text-base underline cursor-pointer hover:text-primary transition-colors" onClick={() => openEntityDetail(npc.entity_base, npc.name)}>{npc.name}</CardTitle>
                  ) : (
                    <CardTitle className="text-base">{npc.name}</CardTitle>
                  )}
                  <CardDescription>{npc.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {npc.description && <p className="text-muted-foreground">{npc.description}</p>}
                  {npc.notes && <div className="flex items-start gap-2"><BookOpen className="h-4 w-4 mt-0.5" /><span className="text-muted-foreground italic">{npc.notes}</span></div>}
                  {npc.motivations && <div className="flex items-start gap-2"><Target className="h-4 w-4 mt-0.5" /><span className="text-muted-foreground">{npc.motivations}</span></div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Encounters */}
      {scenario.encounters && scenario.encounters.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><Swords className="h-6 w-6" />{t('scenarios.encounters')}</h2>
          <div className="space-y-3">
            {scenario.encounters.map((enc: any, idx: number) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{enc.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">{enc.type}</Badge>
                      {enc.difficulty && <Badge className={getDifficultyColor(enc.difficulty)}>{enc.difficulty}</Badge>}
                    </div>
                  </div>
                  {enc.location && <CardDescription className="flex items-center gap-1"><Map className="h-3 w-3" />{enc.location}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {enc.description && <p className="text-muted-foreground">{enc.description}</p>}

                  {enc.enemies?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{t('scenarios.enemies')}</h4>
                        {enc.enemies.some((e: any) => e.entity_base) && (
                          <span className="text-sm font-medium text-primary">
                            {`${t('common.total')}: ${enc.enemies.reduce((sum: number, e: any) => sum + (e.entity_base ? getEntityPoints(e.entity_base) : 0) * e.count, 0)} ${t('common.pts')}`}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1">
                        {enc.enemies.map((enemy: any, eidx: number) => {
                          const pts = enemy.entity_base ? getEntityPoints(enemy.entity_base) : 0;
                          return (
                            <li key={eidx} className="flex items-center gap-2">
                              <Shield className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {`${enemy.count}x `}{renderClickableEntity(enemy.entity_base, enemy.name)}
                                {pts > 0 && <span className="text-muted-foreground text-xs ml-1">{`(${pts} ${t('common.pts')}${enemy.count > 1 ? ` × ${enemy.count} = ${pts * enemy.count} ${t('common.pts')}` : ''})`}</span>}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {enc.tactics && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <h4 className="font-semibold mb-1 flex items-center gap-2"><Target className="h-4 w-4" />{t('scenarios.tactics')}</h4>
                      <p className="text-muted-foreground">{enc.tactics}</p>
                    </div>
                  )}

                  {enc.challenges?.length > 0 && (
                    <div><h4 className="font-semibold mb-2">{t('scenarios.challenges')}</h4><ul className="list-disc list-inside space-y-1 text-muted-foreground">{enc.challenges.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul></div>
                  )}

                  {enc.success_conditions?.length > 0 && (
                    <div><h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{t('scenarios.successConditions')}</h4><ul className="list-disc list-inside space-y-1 text-muted-foreground">{enc.success_conditions.map((c: string, i: number) => <li key={i}>{c}</li>)}</ul></div>
                  )}

                  {enc.failure_consequence && (
                    <div className="bg-destructive/10 p-3 rounded-md">
                      <h4 className="font-semibold mb-1 flex items-center gap-2 text-destructive"><AlertCircle className="h-4 w-4" />{t('scenarios.onFailure')}</h4>
                      {typeof enc.failure_consequence === 'string' ? (
                        <p className="text-muted-foreground">{enc.failure_consequence}</p>
                      ) : (
                        <div className="space-y-2">
                          {enc.failure_consequence.description && <p className="text-muted-foreground">{enc.failure_consequence.description}</p>}
                          {enc.failure_consequence.enemies?.map((enemy: any, eidx: number) => {
                            const pts = enemy.entity_base ? getEntityPoints(enemy.entity_base) : 0;
                            return (
                              <div key={eidx} className="flex items-center gap-2">
                                <Shield className="h-3 w-3 text-muted-foreground" />
                                <span>{`${enemy.count}x `}{renderClickableEntity(enemy.entity_base, enemy.name)}{pts > 0 && <span className="text-muted-foreground text-xs ml-1">{`(${pts} ${t('common.pts')})`}</span>}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {enc.alternative && <div className="bg-primary/10 p-3 rounded-md"><h4 className="font-semibold mb-1">{t('scenarios.alternative')}</h4><p className="text-muted-foreground">{enc.alternative}</p></div>}

                  {enc.rewards?.length > 0 && (
                    <div><h4 className="font-semibold mb-2 flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" />{t('scenarios.rewards')}</h4><ul className="list-disc list-inside space-y-1 text-muted-foreground">{enc.rewards.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul></div>
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
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />{t('scenarios.globalRewards')}</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {scenario.rewards.points && <div className="flex items-center gap-2"><Star className="h-4 w-4 text-blue-500" /><span className="font-semibold">{t('scenarios.rewardPoints')}</span>{scenario.rewards.points}</div>}
            {scenario.rewards.credits && <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" /><span className="font-semibold">{t('scenarios.rewardCredits')}</span>{scenario.rewards.credits}</div>}
            {scenario.rewards.items?.length > 0 && <div><h4 className="font-semibold mb-2">{t('scenarios.rewardItems')}</h4><ul className="list-disc list-inside space-y-1 text-muted-foreground">{scenario.rewards.items.map((item: string, i: number) => <li key={i}>{item}</li>)}</ul></div>}
            {scenario.rewards.special && <div className="bg-primary/10 p-3 rounded-md"><h4 className="font-semibold mb-1">{t('scenarios.specialReward')}</h4><p className="text-muted-foreground whitespace-pre-line">{scenario.rewards.special}</p></div>}
          </CardContent>
        </Card>
      )}

      {/* Variants */}
      {scenario.variants?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><Lightbulb className="h-6 w-6" />{t('scenarios.variants')}</h2>
          {scenario.variants.map((v: any, i: number) => (
            <Card key={i}><CardHeader><CardTitle className="text-base">{v.name}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground whitespace-pre-line">{v.description}</p></CardContent></Card>
          ))}
        </div>
      )}

      {/* GM Notes */}
      {(scenario.gm_notes || scenario.gm_tips) && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setGmNotesExpanded(!gmNotesExpanded)}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-purple-500" />{t('scenarios.gmNotes')}</CardTitle>
              {gmNotesExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
          </CardHeader>
          {gmNotesExpanded && (
            <CardContent className="space-y-4 text-sm">
              {scenario.gm_notes?.preparation_time && <div><span className="font-semibold">{t('scenarios.prepTime')}</span><span className="text-muted-foreground">{scenario.gm_notes.preparation_time}</span></div>}
              {scenario.gm_notes?.complexity && <div><span className="font-semibold">{t('scenarios.complexity')}</span><Badge variant="outline">{scenario.gm_notes.complexity}</Badge></div>}
              {scenario.gm_notes?.tone && <div><span className="font-semibold">{t('scenarios.tone')}</span><span className="text-muted-foreground">{scenario.gm_notes.tone}</span></div>}
              {scenario.gm_tips && <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-md"><h4 className="font-semibold mb-2">{t('scenarios.gmTips')}</h4><p className="text-muted-foreground whitespace-pre-line leading-relaxed">{scenario.gm_tips}</p></div>}
            </CardContent>
          )}
        </Card>
      )}

      {/* Tags */}
      {scenario.tags?.length > 0 && <div className="flex flex-wrap gap-2">{scenario.tags.map((tg, i) => <Badge key={i} variant="secondary" className="text-xs">{tg}</Badge>)}</div>}

      {/* Entity Detail Modal */}
      <Dialog open={!!selectedEntity} onOpenChange={() => setSelectedEntity(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t('scenarios.entityDetails')}</DialogTitle></DialogHeader>
          {selectedEntity && <EntityDetailPanel entity={selectedEntity.entity} displayName={selectedEntity.displayName} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
