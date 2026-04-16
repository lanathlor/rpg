---
title: '️Défense et Résistances'
order: 4
tags: [SD, Score de Défense, Défense]
---

Le système de défense repose sur deux valeurs fixes :

-   le **Score de Défense (SD)** : détermine si une attaque touche.
-   les **Résistances** : réduisent les dégâts une fois l'attaque réussie.

> Pour une compréhension complète du système de résistances, consultez [Système de Résistances](07_systeme_de_resistances.md).

### 1. Score de Défense (SD)

Le Score de Défense représente la **difficulté à toucher une cible**.
Il dépend du type d’attaque subie et de la statistique de défense correspondante.

#### Formule générale

```
SD = 10 + (stat de défense / 2) + bonus d’armure
```

| Type d’attaque               | Stat de défense utilisée            | Exemple d’équipement influent                  |
| ---------------------------- | ----------------------------------- | ---------------------------------------------- |
| **Attaque lourde / 2 mains** | Force (FOR)                         | Armure lourde, bouclier                        |
| **Attaque légère / 1 main**  | Dextérité (DEX)                     | Armure moyenne, exosquelette léger             |
| **Attaque à distance**       | Précision (PRE) ou Perception (PER) | Armure moyenne, couvert                        |
| **Attaque arcanotechnique**  | Intelligence (INT)                  | Armure arcanotechnique, résistances quantiques |

L’attaquant doit obtenir un résultat **≥ au SD** de la cible pour que son attaque touche.
Les bonus d’armure, boucliers et couvertures s’ajoutent à la valeur finale.

---

### 2. Résistances

Une fois l'attaque réussie, les **Résistances** déterminent **combien de dégâts sont absorbés** avant d'atteindre les points de vie.

Il existe **trois types de résistances** basées sur la nature physique de l'attaque :

#### Les trois résistances

| Résistance               | Abréviation | Couvre                                       | Exemples                             |
| ------------------------ | ----------- | -------------------------------------------- | ------------------------------------ |
| **Résistance Mécanique** | RMEC        | Impact, perforation, pression, onde de choc  | Épée, balle, projectile de roche     |
| **Résistance Radiative** | RRAD        | Chaleur, froid, lumière, électricité externe | Feu, laser, foudre, givre de surface |
| **Résistance Interne**   | RINT        | Altération du Flux, combustion/gel interne   | Nécrose, drain de vie, corruption    |

#### Formule générale

```
Résistance = bonus d'armure + (stat secondaire / 4) + bonus spéciaux
```

> La statistique secondaire et les bonus dépendent du type de résistance et de l'équipement.

| Résistance | Stat secondaire principale | Sources typiques de bonus                     |
| ---------- | -------------------------- | --------------------------------------------- |
| **RMEC**   | Force (FOR)                | Armure lourde, exosquelette, bouclier         |
| **RRAD**   | Constitution (CON)         | Combinaison isolante, bouclier énergétique    |
| **RINT**   | Intelligence (INT)         | Stabilité du Flux, implants rares, méditation |

#### Application

Lorsqu'une attaque réussit :

```
Dégâts finaux = Dégâts bruts - Résistance applicable
```

**Important :** Ce n'est pas la source de l'attaque qui détermine la résistance, mais **sa nature physique**.

-   Une boule de feu arcanotechnique → **RRAD** (chaleur)
-   Un projectile de roche arcanotechnique → **RMEC** (impact)
-   Une nécrose arcanotechnique → **RINT** (altération interne)

Les dégâts ne peuvent jamais être réduits en dessous de 0.
Certaines attaques mixtes (comme les explosions) affectent plusieurs résistances : souffle (RMEC) + chaleur (RRAD).

---
