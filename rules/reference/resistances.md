---
title: "Résistances"
order: 1
---

## 🧬 Principe Fondamental

Dans cet univers, il n'existe pas de "dégâts arcanotechniques". Le Flux est une énergie potentielle qui se convertit en phénomènes physiques réels. Une fois la conversion effectuée, l'effet produit (feu, impact, radiation, etc.) obéit aux lois de la physique.

**Donc : une seule physique, un seul système de résistances.**

Que l'attaque provienne d'une épée, d'une balle, d'un arcane de feu ou d'un rayon laser, elle suit les mêmes règles physiques. Ce qui compte, c'est la nature physique de l'effet final, pas sa source.

---

## ⚔️ Les Trois Résistances

### 1. RMEC — Résistance Mécanique

**Ce qu'elle couvre :**

- Impact direct (coup de poing, masse, chute)
- Perforation (lame, flèche, balle, éclat)
- Pression / compression (écrasement, constriction)
- Onde de choc (explosion, souffle)
- Projectiles solides accélérés par Flux
- Vibrations mécaniques destructrices

**Exemples concrets :**

- Épée → RMEC
- Balle de fusil → RMEC
- Arcane "Projectile de roche" → RMEC
- Arcane "Onde de choc" → RMEC
- Grenade (composante cinétique) → RMEC

**Ce que ça représente physiquement :**
Capacité du corps/armure à absorber ou dévier l'énergie cinétique et les contraintes mécaniques.

---

### 2. RRAD — Résistance Radiative

**Ce qu'elle couvre :**

- Chaleur / brûlure thermique (feu, plasma, friction intense)
- Froid extrême externe (givre, cryogénie de surface)
- Lumière intense (laser, flash aveuglant destructeur)
- Rayonnement électromagnétique (micro-ondes, UV concentrés)
- Arc électrique externe (foudre, taser, décharge)
- Radiation ionisante (si applicable dans l'univers)

**Exemples concrets :**

- Arcane "Boule de feu" → RRAD
- Arcane "Rayon de givre" (dégâts de surface) → RRAD
- Laser industriel → RRAD
- Arcane "Arc électrique" → RRAD
- Explosion (composante thermique) → RRAD

**Ce que ça représente physiquement :**
Capacité à isoler, réfléchir ou dissiper l'énergie rayonnée ou conduite thermiquement/électriquement à la surface du corps.

---

### 3. RINT — Résistance Interne

**Aussi appelée RFP (Résistance au Flux Personnel)**

**Ce qu'elle couvre :**

- Altération directe du Flux interne de la cible
- Combustion interne (organes, sang)
- Nécrose / décomposition accélérée
- Drain d'énergie vitale / de Flux
- Corruption cellulaire ou énergétique
- Gel interne (cristallisation des fluides corporels)
- Désorganisation métabolique
- Attaques qui bypass les protections externes

**Exemples concrets :**

- Arcane "Combustion interne" → RINT
- Arcane "Drain de Flux" → RINT
- Arcane "Nécrose" → RINT
- Arcane "Gel du sang" → RINT
- Poison énergétique / corruption → RINT

**Ce que ça représente physiquement :**
Stabilité du système biologique/énergétique interne. Capacité à maintenir l'intégrité du Flux personnel et des fonctions vitales face à une intrusion directe.

**Note importante :**
RINT est la résistance la plus rare et la plus difficile à augmenter. Elle représente une défense "de dernier recours" contre les attaques qui ignorent armure et boucliers.

---

## 📊 Tableau Récapitulatif

| Résistance  | Abréviation | Vecteur d'attaque                  | Exemples                                        |
| ----------- | ----------- | ---------------------------------- | ----------------------------------------------- |
| Mécanique   | RMEC        | Cinétique, pression, perforation   | Épée, balle, explosion (souffle), projectile    |
| Radiative   | RRAD        | Thermique, EM, électrique externe  | Feu, laser, foudre, givre de surface            |
| Interne     | RINT        | Altération directe du corps/Flux   | Nécrose, drain, combustion interne, gel interne |

---

## ⚖️ Cas Limites et Arbitrages

Certaines attaques affectent plusieurs résistances ou nécessitent une interprétation.

| Situation                       | Résistance   | Justification                                         |
| ------------------------------- | ------------ | ----------------------------------------------------- |
| **Explosion**                   | RMEC + RRAD  | Souffle = RMEC, chaleur = RRAD (deux jets ou moyenne) |
| **Givre de surface**            | RRAD         | Transfert thermique externe                           |
| **Gel interne**                 | RINT         | Bypass des protections, attaque les fluides internes  |
| **Électrocution externe**       | RRAD         | Arc traverse la surface                               |
| **Électrocution interne**       | RINT         | Cible directement les organes (arrêt cardiaque)       |
| **Poison chimique classique**   | Hors système | Gestion séparée (Constitution / autre stat)           |
| **Poison énergétique / Flux**   | RINT         | Corruption du système interne                         |
| **Attaque sonique**             | RMEC         | Onde de pression mécanique                            |
| **Radiation ionisante**         | RRAD         | Rayonnement EM                                        |

---

## 🛡️ Sources de Résistance

Les résistances peuvent provenir de différentes sources. Certaines protections sont efficaces contre certains types de dégâts, mais pas contre d'autres.

| Source                          | RMEC | RRAD | RINT |
| ------------------------------- | ---- | ---- | ---- |
| Armure physique                 | +++  | +    | -    |
| Combinaison isolante            | +    | +++  | -    |
| Bouclier énergétique            | ++   | ++   | -    |
| Constitution / Endurance        | +    | +    | +    |
| Stabilité du Flux personnel     | -    | -    | +++  |
| Implants / Mutations            | ±    | ±    | ±    |

**Légende :**
- `-` = aucun bonus
- `+` = faible bonus
- `++` = bonus modéré
- `+++` = bonus élevé
- `±` = variable selon l'implant/mutation

---

## 🧮 Formule de Dégâts

### Calcul de base

```
Dégâts finaux = Dégâts bruts - Résistance applicable
```

### Étapes de résolution

1. **Déterminer le type de dégât** — L'attaquant/MJ identifie la nature physique de l'attaque
2. **Identifier la résistance** — RMEC, RRAD ou RINT (parfois plusieurs)
3. **Calculer la résistance totale** — Armure + Stat + Buffs
4. **Appliquer la réduction** — Soustraire la résistance des dégâts bruts
5. **Résultat** — Les dégâts finaux ne peuvent jamais être négatifs (minimum 0)

### Cas des attaques mixtes

Certaines attaques (comme les explosions) infligent plusieurs types de dégâts :

**Option 1 : Jets séparés**
- L'attaquant lance les dégâts mécaniques (souffle) → applique RMEC
- L'attaquant lance les dégâts radiatifs (chaleur) → applique RRAD
- Les deux résultats sont additionnés

**Option 2 : Moyenne (simplifié)**
- Calculer la moyenne de RMEC et RRAD de la cible
- Appliquer cette moyenne aux dégâts totaux de l'explosion

Le MJ choisit la méthode selon la complexité souhaitée.

---

## 📈 Progression des Résistances

### Comment augmenter ses résistances

| Résistance | Méthodes d'amélioration                                                |
| ---------- | ---------------------------------------------------------------------- |
| **RMEC**   | Armure lourde, exosquelette, bouclier, augmentation de FOR/CON        |
| **RRAD**   | Combinaison isolante, bouclier énergétique, augmentation de CON       |
| **RINT**   | Méditation, entraînement au Flux, implants rares, augmentation de INT |

### Valeurs typiques

| Niveau         | RMEC | RRAD | RINT | Profil                       |
| -------------- | ---- | ---- | ---- | ---------------------------- |
| Débutant       | 2-4  | 1-2  | 0-1  | Armure légère, peu de Flux   |
| Intermédiaire  | 5-8  | 3-5  | 1-3  | Armure moyenne, Flux modéré  |
| Avancé         | 9-12 | 6-9  | 3-5  | Armure lourde, Flux maîtrisé |
| Expert         | 13+  | 10+  | 6+   | Équipement exceptionnel      |

**Note :** RINT est intentionnellement plus difficile à augmenter que les autres résistances. Un personnage avec RINT élevé est extrêmement rare et puissant.

---

## 💡 Philosophie du Système

> **Une seule réalité physique.**
> Le Flux ne crée pas de "dégâts magiques" — il crée du feu, de la glace, des projectiles, de l'énergie cinétique.
> Ces phénomènes obéissent aux lois de la physique et sont contrés par les mêmes résistances qu'une attaque "normale".

**Avantages de ce système :**

1. **Cohérence narrative** — Pas de distinction artificielle entre "physique" et "magique"
2. **Clarté tactique** — Les joueurs comprennent intuitivement quel type de résistance protège contre quoi
3. **Équilibre** — Les arcanotechniciens ne contournent pas toute armure, mais peuvent cibler des faiblesses spécifiques
4. **Profondeur stratégique** — Les ennemis ont des profils de résistance variés (tank RMEC faible RRAD, etc.)

**Exemples d'application :**

- Un guerrier lourdement blindé (RMEC élevé) résiste aux balles et aux épées, mais est vulnérable aux attaques de feu (RRAD faible)
- Un arcanotechnicien avec stabilité du Flux élevée (RINT fort) résiste aux drains et nécroses, mais reste fragile face aux attaques physiques
- Une combinaison isolante protège contre les lasers et le feu (RRAD), mais pas contre les balles (RMEC)

---

## 🎯 Conseils au MJ

### Concevoir des ennemis équilibrés

- **Tank mécanique** : RMEC élevé, RRAD faible, RINT très faible — Vulnérable au feu et aux attaques internes
- **Créature élémentaire** : RMEC faible, RRAD très élevé, RINT modéré — Résiste à son élément, fragile aux armes physiques
- **Entité de Flux** : RMEC très faible, RRAD faible, RINT très élevé — Résiste aux drains, vulnérable aux attaques conventionnelles

### Varier les défis

- Forcer les joueurs à adapter leurs stratégies selon les résistances ennemies
- Encourager la coopération (tank attire l'ennemi RMEC pendant que le arcanotechnicien utilise RRAD/RINT)
- Récompenser la préparation (apporter l'équipement adapté à la mission)

---
