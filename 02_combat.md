# Règles de Combat

Cette section présente les règles de combat mises à jour selon le système de défense et de protection introduit dans la dernière version du manuel.
L’objectif est de proposer un cadre clair, fluide et cohérent entre les attaques physiques, magiques et à distance.

---

## ⚔️ Déroulement du Combat

Un combat se divise en **tours** de 6 secondes, chacun représentant une fenêtre d’action brève.
Chaque tour, un personnage dispose de :

- **1 action principale** (attaque, sort, manœuvre lourde, défense active)
- **1 action mineure** (déplacement, rechargement, interaction rapide)

Les tours s’enchaînent en **ordre d’initiative** jusqu’à la fin du combat.

---

## 🎲 Initiative

Au début du combat, chaque participant lance **1d20 + DEX**.

- Le plus haut résultat agit en premier.
- En cas d’embuscade, les assaillants jouent avant les autres et gagnent **+1 à leur premier jet d’attaque**.
- Une égalité se résout par un second jet entre les concernés.

---

## 👣 Déplacement

- La **vitesse** d’un personnage indique le **nombre de mètres parcourus par tour** en courant (ligne droite).
- Marcher divise cette valeur par deux.
- Les déplacements complexes (saut, escalade, ramper) peuvent nécessiter un **jet de DEX** ou une compétence spécifique.
- Quitter la zone de mêlée d’un ennemi déclenche un **jet d’opportunité** : une attaque gratuite de ce dernier (+1 au jet d’attaque).
- Les personnages disposant de la compétence **Course** peuvent se déplacer deux fois par tour.

---

## 🛡️ Défense et Protection

Le système de défense repose sur deux valeurs fixes :

- le **Score de Défense (SD)** : détermine si une attaque touche.
- le **Score de Protection (SP)** : réduit les dégâts une fois l’attaque réussie.

### 1. Score de Défense (SD)

Le Score de Défense représente la **difficulté à toucher une cible**.
Il dépend du type d’attaque subie et de la statistique de défense correspondante.

#### Formule générale

```
SD = 10 + (stat de défense / 2) + bonus d’armure
```

| Type d’attaque               | Stat de défense utilisée            | Exemple d’équipement influent       |
| ---------------------------- | ----------------------------------- | ----------------------------------- |
| **Attaque lourde / 2 mains** | Force (FOR)                         | Armure lourde, bouclier             |
| **Attaque légère / 1 main**  | Dextérité (DEX)                     | Armure moyenne, exosquelette léger  |
| **Attaque à distance**       | Précision (PRE) ou Perception (PER) | Armure moyenne, couvert             |
| **Attaque magique**          | Intelligence (INT)                  | Armure magique, résistances arcanes |

L’attaquant doit obtenir un résultat **≥ au SD** de la cible pour que son attaque touche.
Les bonus d’armure, boucliers et couvertures s’ajoutent à la valeur finale.

---

### 2. Score de Protection (SP)

Une fois l’attaque réussie, le Score de Protection détermine **combien de dégâts sont absorbés** avant d’atteindre les points de vie.

#### Formule générale

```
SP = bonus d’armure + (stat secondaire / 4)
```

> La statistique secondaire dépend du type de dégât reçu.

| Type de dégât                | Stat secondaire    | Score de Protection associé | Exemple                         |
| ---------------------------- | ------------------ | --------------------------- | ------------------------------- |
| **Physique (corps à corps)** | Force (FOR)        | Protection Physique (PP)    | Armure lourde : PP = 3          |
| **Distance (projectile)**    | Dextérité (DEX)    | Protection à Distance (PD)  | Exosquelette de combat : PD = 2 |
| **Magique (sorts)**          | Intelligence (INT) | Protection Magique (PM)     | Armure de magie : PM = 2        |

#### Application

Lorsqu’une attaque réussit :

```
Dégâts finaux = Dégâts bruts - SP (selon le type)
```

Les dégâts ne peuvent jamais être réduits en dessous de 0.
Certaines attaques (magiques ou explosives) peuvent ignorer partiellement ou totalement la protection.

---

## ⚔️ Attaquer

Une attaque se déroule en deux étapes : **jet d’attaque**, puis **jet de dégâts**.

### 1. Jet d’attaque

> **d20 + Stat d’attaque + bonus d’arme ≥ Score de Défense de la cible**

| Type d’arme ou de sort | Stat d’attaque utilisée |
| ---------------------- | ----------------------- |
| Arme lourde / 2 mains  | Force (FOR)             |
| Arme légère / 1 main   | Dextérité (DEX)         |
| Arme à distance        | Précision (PRE)         |
| Sort offensif          | Intelligence (INT)      |

- **20 naturel** → réussite critique (attaque imparable, dégâts doublés).
- **1 naturel** → échec critique (l’arme se bloque, le sort échoue).

### 2. Jet de dégâts

- Lancer les dés indiqués sur l’arme ou le sort.
- Soustraire la protection correspondante (PP, PD ou PM).
- Appliquer le résultat aux points de vie de la cible.
- Si la cible est réduite à 0 PV → elle est mise hors combat.

---

## 🧠 Actions défensives actives

Un personnage peut renoncer à attaquer pour se défendre activement.
Ces actions offrent des bonus temporaires au Score de Défense ou de Protection.

| Action                  | Effet                                                                                                           | Durée                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Parade**              | Effectuer un **jet opposé de FOR ou DEX** contre l’attaque physique. En cas de réussite, l’attaque est bloquée. | Instantané             |
| **Esquive**             | Lance **d20 + DEX** contre le jet d’attaque de l’adversaire. En cas de réussite, l’attaque rate.                | Instantané             |
| **Se mettre à couvert** | +2 à la Défense à distance et magique.                                                                          | Jusqu’au prochain tour |
| **Tenir la ligne**      | Si adjacent à un allié, +1 à votre Défense et à celle de cet allié.                                             | Jusqu’à la fin du tour |

---

## 💥 Jets d’Opportunité

Lorsqu’un ennemi quitte votre zone d’engagement (corps à corps), vous pouvez effectuer une attaque d’opportunité.

- Jet d’attaque classique avec **+1 au résultat**.
- Une seule par tour, sauf compétence spéciale.

---

## 🧩 Manœuvres

Les manœuvres regroupent toutes les actions non offensives : utilisation d’objets, environnement, interactions spéciales, etc.

> Jet associé : **d20 + Stat appropriée (souvent DEX, INT ou PER)**.
> Le MJ fixe la difficulté selon le contexte (voir section “Jets de dés”).

Les personnages avec la compétence **Stratège** peuvent effectuer **deux manœuvres par tour**.

---

## 🩸 Fin du Combat

Le combat prend fin lorsque tous les ennemis d’un camp sont :

- morts, hors de portée, ou en fuite,
- ou qu’un objectif de mission est atteint.

Après le combat, les joueurs peuvent :

- fouiller, interagir, se soigner, ou récupérer.
- recevoir des gains de compétences ou statistiques selon leurs actions.

---

## ⏳ Rythme et durée

- **1 tour = 6 secondes**
- **1 round complet (tous les participants) = environ 30 secondes in-game**
- Les effets à durée limitée (buffs, sorts, debuffs) se comptent en tours.

---

## 💡 Philosophie du système

> Le combat repose sur deux principes : **simplicité de jet** et **clarté des valeurs**.
> Le joueur ne lance qu’un seul dé pour attaquer, la cible ne lance rien pour se défendre.
> Les valeurs fixes de Défense et de Protection rendent le système fluide, mais tactique.

Les priorités du système :

- Unification des mécaniques physiques et magiques.
- Défenses claires et mesurables.
- Progression naturelle par équipement et statistiques.
- Fluidité de lecture pour le MJ et les joueurs.

---
