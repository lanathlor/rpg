# Création de Personnage

Cette section explique comment créer un personnage joueur à l'aide du **système de Point Buy**.

Le système de Point Buy permet de construire des personnages équilibrés en attribuant un budget de points à répartir entre différentes catégories : statistiques, affinités, système de Flux, équipement et compétences.

---

## 1. Vue d'ensemble du système

Le Point Buy évalue la puissance d'un personnage en calculant le coût total de ses capacités. Chaque élément du personnage a un coût en points :

-   **Statistiques de base** : Points de Vie (PV), Vitesse de déplacement
-   **Statistiques** : Force, Dextérité, Constitution, Intelligence, Perception, Précision, Charisme
-   **Affinités** : Combat (mêlée/distance), écoles d'arcanotechnie, types de sorts, armes spéciales
-   **Système de Flux** : Réserve, régénération par tour, récupération
-   **Équipement** : Armes, armures, consommables
-   **Compétences** : Talents spéciaux et capacités de classe

### Budget recommandé

Le MJ déterminera le budget de points approprié pour la campagne.

---

## 2. Coût des Statistiques de Base (PV et Vitesse)

Les statistiques de base représentent les capacités physiques fondamentales de votre personnage : ses **Points de Vie (PV)** et sa **Vitesse** de déplacement.

### Points de Vie (PV)

Les Points de Vie déterminent la résistance de votre personnage aux dégâts.

| PV     | Coût            | Description               |
| ------ | --------------- | ------------------------- |
| 30     | 0 pts (gratuit) | Base de référence         |
| 31-33  | 1 pt            | Légèrement plus résistant |
| 34-60  | 2-10 pts        | Progression normale       |
| 61-90  | 11-20 pts       | Très résistant            |
| 91-120 | 21-30 pts       | Extrêmement durable       |

**Formule : 1 point par tranche de 3 PV au-dessus de 30 (arrondi au supérieur)**

#### Exemples

-   **PV 30** : 0 pts (base gratuite)
-   **PV 45** : 5 pts ((45-30)÷3 = 5)
-   **PV 60** : 10 pts ((60-30)÷3 = 10)
-   **PV 90** : 20 pts ((90-30)÷3 = 20)
-   **PV 100** : 24 pts ((100-30)÷3 = 23.33, arrondi à 24)

### Vitesse de Déplacement

La Vitesse détermine combien de mètres votre personnage peut se déplacer en un tour.

| Vitesse | Coût            | Description                     |
| ------- | --------------- | ------------------------------- |
| 3 m     | 0 pts (gratuit) | Vitesse de base (humain normal) |
| 4 m     | 5 pts           | Plus rapide que la moyenne      |
| 5 m     | 10 pts          | Rapide                          |
| 6 m     | 15 pts          | Très rapide                     |
| 7 m     | 20 pts          | Extrêmement rapide              |
| 8 m+    | 25+ pts         | Vitesse surhumaine              |

**Formule : 5 points par point de Vitesse au-dessus de 3**

#### Exemples

-   **Vitesse 3** : 0 pts (base gratuite)
-   **Vitesse 5** : 10 pts ((5-3)×5 = 10)
-   **Vitesse 6** : 15 pts ((6-3)×5 = 15)
-   **Vitesse 8** : 25 pts ((8-3)×5 = 25)

### Conseil de construction

**Stats de base typiques :**

-   **Lanceur de sorts** : PV 60 (10 pts) + Vitesse 5 (10 pts) = **20 points**

    -   Privilégie la mobilité pour garder ses distances

-   **Combattant équilibré** : PV 90 (20 pts) + Vitesse 5 (10 pts) = **30 points**

    -   Bon équilibre entre résistance et mobilité

-   **Tank lourd** : PV 120 (30 pts) + Vitesse 4 (5 pts) = **35 points**

    -   Maximise la survie au détriment de la vitesse

-   **Assassin agile** : PV 60 (10 pts) + Vitesse 7 (20 pts) = **30 points**
    -   Privilégie la mobilité et l'évasion

**Fourchette typique : 15-35 points en stats de base**

### Rationale des coûts

-   **PV** : Le coût augmente linéairement mais reste modéré (1 pt/3 PV). Doubler ses PV de 30 à 60 ne coûte que 10 points.
-   **Vitesse** : Coût élevé (5 pts/point) car la mobilité tactique est très puissante au combat. +1 m de déplacement peut être décisif.

---

## 2.5. Coût des Résistances Innées

Les résistances représentent votre capacité naturelle à résister aux différents types de dégâts, indépendamment de votre équipement.

### Les trois résistances

| Résistance | Abréviation | Coût par point | Description |
| ---------- | ----------- | -------------- | ----------- |
| Résistance Mécanique | RMEC | **3 points** | Résistance aux impacts, projectiles, pressions, ondes de choc |
| Résistance Radiative | RRAD | **4 points** | Résistance au feu, froid, électricité, lumière, radiation |
| Résistance Interne | RINT | **6 points** | Résistance aux drains de vie, nécroses, corruption, attaques internes |

**Base :** Tous les personnages commencent avec RMEC 0, RRAD 0, RINT 0 (gratuit)

### Formule

```
Coût total = (RMEC × 3) + (RRAD × 4) + (RINT × 6)
```

### Exemples

-   **RMEC +2, RRAD +1, RINT +1** (build tank) : (2×3) + (1×4) + (1×6) = **16 points**
-   **RMEC +1, RRAD +1, RINT +1** (build équilibré) : (1×3) + (1×4) + (1×6) = **13 points**
-   **RMEC +0, RRAD +2, RINT +2** (arcaniste anti-Flux) : (0×3) + (2×4) + (2×6) = **20 points**
-   **RMEC +3, RRAD +0, RINT +0** (guerrier physique) : (3×3) + (0×4) + (0×6) = **9 points**

### Conseil de construction

Les résistances innées représentent votre résistance **naturelle** (entraînement, constitution, maîtrise du Flux). Elles se **cumulent** avec les résistances fournies par l'équipement (armures, boucliers).

**Builds typiques :**

-   **Lanceur de sorts léger** : RMEC +0, RRAD +1, RINT +2 = **14 points**
    -   Compte sur l'équipement pour RMEC, investit dans RINT (rare à trouver)
-   **Guerrier équilibré** : RMEC +1, RRAD +1, RINT +1 = **13 points**
    -   Base solide, complétée par armure lourde
-   **Tank spécialisé** : RMEC +3, RRAD +1, RINT +1 = **19 points**
    -   Maximise RMEC pour être quasi-imperméable aux armes physiques
-   **Aucune résistance** : RMEC +0, RRAD +0, RINT +0 = **0 points**
    -   Dépend entièrement de l'équipement (approche économique)

**Fourchette typique : 0-20 points en résistances innées**

### Rationale des coûts

-   **RMEC** (3 pts) : Le moins cher car c'est le type de dégât le plus commun et l'équipement fournit déjà beaucoup de RMEC
-   **RRAD** (4 pts) : Coût intermédiaire, les dégâts élémentaires sont fréquents mais l'équipement fournit moins de protection
-   **RINT** (6 pts) : Le plus cher car intentionnellement rare et difficile à augmenter. Très peu d'équipements et de sorts fournissent de la RINT, rendant les résistances innées particulièrement précieuses

**Important :** Les résistances innées se cumulent avec celles de l'équipement. Un personnage avec RMEC +2 innée et une armure RMEC +3 aura **RMEC +5 total**.

---

## 3. Coût des Statistiques de Personnage

Chaque statistique commence à **8 gratuitement**. Augmenter une statistique au-delà coûte des points selon la progression suivante :

| Valeur de stat | Coût par niveau | Coût cumulé depuis 8 |
| -------------- | --------------- | -------------------- |
| 8              | —               | 0                    |
| 9-13           | 2 pts/niveau    | 2, 4, 6, 8, 10       |
| 14-15          | 3 pts/niveau    | 13, 16               |
| 16-17          | 5 pts/niveau    | 21, 26               |
| 18             | 6 pts           | 32                   |

### Exemples

-   Une statistique à **10** coûte : 2 + 2 = **4 points** (niveaux 9 et 10)
-   Une statistique à **14** coûte : 2+2+2+2+2+3 = **13 points** (niveaux 9-14)
-   Une statistique à **16** coûte : 2+2+2+2+2+3+3+5 = **21 points** (niveaux 9-16)

### Conseil de construction

Un personnage typique avec 7 statistiques :

-   **Statistique principale à 16** : 21 points
-   **Deux statistiques secondaires à 12-14** : 16-26 points
-   **Autres statistiques à 8-11** : 0-12 points

**Total stats moyen : 45-60 points**

---

## 4. Coût des Affinités

Les affinités déterminent quelles armes et sorts un personnage peut utiliser efficacement.

### Affinités de Combat

| Type              | Coût par niveau |
| ----------------- | --------------- |
| Mêlée (A.CAC)     | 4 pts           |
| Distance (A.Dist) | 4 pts           |
| Armes spéciales   | 4 pts           |

Fusil à pompe, sniper, arme à 1 main

### Écoles d'Arcanotechnie

Les écoles sont organisées par rareté et puissance :

| Palier        | Écoles                                                                 | Coût/niveau |
| ------------- | ---------------------------------------------------------------------- | ----------- |
| **Pure**      | Pure                                                                   | 8 pts       |
| **Quantique** | Quantique                                                              | 7 pts       |
| **Complexes** | Chronodynamique, Gravitonique                                          | 6 pts       |
| **Avancées**  | Bioarcanotechnique, Magnétique                                         | 5 pts       |
| **Standard**  | Feu, Électricité, Givre, Lumière, Martial, Balistique, Illusion, Ombre | 3 pts       |

### Types de Sorts

Tous les types coûtent **5 points par niveau** :

-   Destruction
-   Altération
-   Amélioration
-   Arme
-   Déplacement
-   Protection
-   Affliction
-   Invocation
-   Divination

### Exemple d'affinités

Un mage spécialisé en glace :

-   Distance : 2 → **8 points**
-   École Givre : 5 → **15 points** (5 × 3)
-   Type Destruction : 4 → **20 points** (4 × 5)
-   Type Altération : 2 → **10 points** (2 × 5)

**Total affinités : 53 points**

---

## 5. Coût du Système de Flux

Le Flux représente l'énergie arcanotechnique disponible pour lancer des sorts. C'est un facteur majeur de puissance pour les lanceurs de sorts.

| Composante       | Coût        | Description                                           |
| ---------------- | ----------- | ----------------------------------------------------- |
| **Réserve**      | 1 pt/point  | Pool de Flux total disponible                         |
| **Par tour**     | 3 pts/point | Régénération automatique chaque tour (très précieux!) |
| **Récupération** | 2 pts/point | Flux récupéré lors d'un repos court                   |

### Rationale des coûts

-   La **réserve** détermine combien de sorts peuvent être lancés avant épuisement
-   La **régénération par tour** est la plus coûteuse car elle permet un lancement continu de sorts
-   La **récupération** offre de la flexibilité entre les combats

### Exemples de profils Flux

**Lanceur de sorts majeur** (Arcanotechnicien) :

-   Réserve : 30 → **30 points**
-   Par tour : 8 → **24 points**
-   Récupération : 3 → **6 points**
-   **Total Flux : 60 points**

**Combattant avec sorts mineurs** (Maître d'armes) :

-   Réserve : 8 → **8 points**
-   Par tour : 3 → **9 points**
-   Récupération : 1 → **2 points**
-   **Total Flux : 19 points**

---

## 6. Coût de l'Équipement

L'équipement se convertit en points selon sa valeur en crédits :

**Formule : Crédits ÷ 400, arrondi au supérieur**

### Exemples

| Équipement             | Prix (crédits) | Coût (points) |
| ---------------------- | -------------- | ------------- |
| Bâton arcanotechnique  | 50             | 1 (50÷400)    |
| Pistolet               | 300            | 1             |
| Épée légère            | 200            | 1             |
| Épée lourde            | 800            | 2             |
| Fusil d'assaut         | 1,200          | 3             |
| Fusil sniper           | 2,200          | 6             |
| Armure de plate lourde | 1,200          | 3             |
| Exosquelette de combat | 2,500          | 7             |
| Kit de soins           | ~100           | 1             |

### Conseil de construction

Un personnage typique dépense **4-15 points en équipement** selon son style :

-   **Mage léger** : Bâton + Tunique + Kits → **~4 points**
-   **Guerrier moyen** : Épée + Armure de plate + Kits → **~6 points**
-   **Sniper spécialisé** : Fusil sniper + Exo + Équipement → **~15 points**

---

## 7. Coût des Compétences

Les compétences sont classées par paliers selon leur puissance et utilité :

### Paliers de Compétences

| Palier | Coût   | Exemples                                                                |
| ------ | ------ | ----------------------------------------------------------------------- |
| **S**  | 18 pts | Guerrier (attaques doubles)                                             |
| **A**  | 15 pts | Course (mouvement ×2), Champ électromagnétique, Armure d'arcanotechnie  |
| **B**  | 12 pts | À l'affût (frappe prioritaire), Vétéran, Connaisseur d'arcanotechnie    |
| **C**  | 10 pts | Tacticien (+1 initiative), Œil d'aigle (+1 PRE), Charismatique (+1 CHA) |
| **D**  | 8 pts  | Rôdeur, Traque, Ingénieur, Hackeur, Gardien                             |
| **E**  | 5 pts  | Vue des quantiques, Expert des terrains, Compréhension de la nature     |

### Conseil de construction

Un personnage possède généralement **2-4 compétences**, pour un total de **15-30 points** :

-   1 compétence majeure (palier A ou S)
-   1-2 compétences de support (paliers C-E)
-   Ou plusieurs compétences moyennes (paliers B-C)

---

## 8. Exemple Complet : Création d'un Mage de Glace

Créons un arcanotechnicien spécialisé dans l'école du Givre.

### Concept

Un lanceur de sorts spécialisé en contrôle de zone et dégâts de glace, avec une défense arcanotechnique.

### Statistiques de Base (20 points)

-   **PV : 60** → 10 pts ((60-30)÷3 = 10)
-   **Vitesse : 5 m** → 10 pts ((5-3)×5 = 10)

**Total : 20 points**

Un profil typique de lanceur de sorts : survivabilité correcte avec bonne mobilité pour se repositionner.

### Résistances Innées (14 points)

-   **RMEC : 0** → 0 pts (compte sur l'équipement pour la protection physique)
-   **RRAD : 1** → 4 pts ((1×4) = 4)
-   **RINT : 2** → 12 pts ((2×6) = 12)

**Total : 14 points**

Investissement dans RINT (très rare sur l'équipement) et un peu de RRAD pour résister aux sorts élémentaires. Pas de RMEC car la tunique ne fournit aucune protection de toute façon.

### Statistiques de Personnage (49 points)

| Stat | Valeur | Coût |
| ---- | ------ | ---- | ------------------------ |
| FOR  | 9      | 2    |
| DEX  | 9      | 2    |
| CON  | 10     | 4    |
| INT  | 16     | 21   | ← Statistique principale |
| PER  | 12     | 8    |
| PRE  | 11     | 6    |
| CHA  | 11     | 6    |

**Total : 49 points**

### Affinités (81 points)

-   Distance : 2 → **8 pts** (pour se défendre)
-   Mêlée : 2 → **8 pts** (bâton en dernier recours)
-   École Givre : 5 → **15 pts** (spécialisation principale)
-   École Bioarcanotechnique : 2 → **10 pts** (sorts de soutien)
-   Type Destruction : 4 → **20 pts** (dégâts principaux)
-   Type Altération : 2 → **10 pts** (contrôle et debuffs)
-   Type Déplacement : 2 → **10 pts** (mobilité tactique)

**Total : 81 points**

### Système de Flux (60 points)

-   Réserve : 30 → **30 pts** (grande réserve pour combat prolongé)
-   Par tour : 8 → **24 pts** (régénération élevée)
-   Récupération : 3 → **6 pts** (bonne récupération entre combats)

**Total : 60 points**

### Équipement (4 points)

-   Bâton arcanotechnique : 50 crédits → **1 pt**
-   Tunique arcanotechnique : 50 crédits → **1 pt**
-   Kit de soins : 100 crédits → **1 pt**
-   Cristal de Flux : 200 crédits → **1 pt**

**Total : 4 points (400 crédits)**

### Compétences (20 points)

-   Armure d'arcanotechnie (A) → **15 pts** (protection magique)
-   Vue des quantiques (E) → **5 pts** (détection des sorts)

**Total : 20 points**

### Récapitulatif

| Catégorie                  | Points  | % du total |
| -------------------------- | ------- | ---------- |
| Stats de base (PV/Vitesse) | 20      | 8%         |
| Résistances innées         | 14      | 6%         |
| Statistiques               | 49      | 20%        |
| Affinités                  | 81      | 33%        |
| Flux                       | 60      | 24%        |
| Équipement                 | 4       | 2%         |
| Compétences                | 20      | 8%         |
| **TOTAL**                  | **248** | **100%**   |

Ce personnage se situe dans le palier **Moyen-Élevé**, avec une forte capacité de lancement de sorts grâce à son Flux élevé et ses affinités arcanotechniques. L'investissement en RINT (résistance interne) lui permet de mieux résister aux drains de vie et à la corruption du Flux.

---

## 9. Conseils de Construction

### Répartition Typique par Archétype

**Lanceur de sorts pur** (235-260 points) :

-   Stats de base : 15-25 pts (PV moyens, Vitesse élevée)
-   Résistances innées : 10-20 pts (RINT prioritaire, un peu de RRAD)
-   Stats : 45-55 pts (INT élevé)
-   Affinités : 70-90 pts (écoles et types variés)
-   Flux : 50-65 pts (réserve et régénération élevées)
-   Équipement : 4-8 pts (équipement léger)
-   Compétences : 15-25 pts (2-3 compétences magiques)

**Combattant martial** (215-235 points) :

-   Stats de base : 25-35 pts (PV élevés, Vitesse moyenne)
-   Résistances innées : 5-15 pts (RMEC/RRAD équilibrés)
-   Stats : 55-65 pts (FOR/DEX/CON élevés)
-   Affinités : 80-100 pts (combat + armes spéciales)
-   Flux : 15-25 pts (sorts mineurs uniquement)
-   Équipement : 6-14 pts (armure et armes de qualité, stacke avec innées)
-   Compétences : 20-30 pts (compétences de combat)

**Hybride combat/magie** (255-275 points) :

-   Stats de base : 20-30 pts (équilibre PV/Vitesse)
-   Résistances innées : 10-20 pts (équilibrées ou spécialisées selon concept)
-   Stats : 55-60 pts (plusieurs stats élevées)
-   Affinités : 90-110 pts (combat ET arcanotechnie)
-   Flux : 40-55 pts (capacité de sorts modérée)
-   Équipement : 8-12 pts (équipement tactique)
-   Compétences : 18-25 pts (compétences polyvalentes)

### Pièges à Éviter

1. **Trop disperser les affinités** : Se concentrer sur 2-3 écoles maximum pour être efficace
2. **Négliger le Flux sur un lanceur de sorts** : Le Flux détermine votre capacité à lancer des sorts en combat
3. **Sur-investir dans l'équipement** : L'équipement peut être trouvé/acheté en jeu, contrairement aux stats et affinités
4. **Oublier les compétences** : Certaines compétences (Guerrier, Course) transforment complètement le style de jeu
5. **Ignorer RINT** : La résistance interne est **extrêmement rare** sur l'équipement. Si vous n'investissez pas en résistances innées, il sera très difficile d'en obtenir
6. **Surinvestir en RMEC** : L'équipement fournit déjà beaucoup de RMEC. Mieux vaut investir dans RRAD/RINT

### Optimisation vs Roleplay

Le système de Point Buy vise l'équilibre, mais **le roleplay prime sur l'optimisation**.

Un personnage "sous-optimisé" avec un concept intéressant sera souvent plus mémorable qu'un build min-maxé. Le MJ peut ajuster les défis pour accommoder différents niveaux de puissance au sein du groupe.

---

## 10. Validation avec le MJ

Avant de finaliser votre personnage :

1. **Vérifiez le budget** : Confirmez le total de points autorisé par le MJ
2. **Concept du personnage** : Expliquez votre vision du personnage et son rôle dans le groupe
3. **Cohérence narrative** : Assurez-vous que les choix mécaniques reflètent l'histoire du personnage
4. **Équilibre du groupe** : Coordonnez avec les autres joueurs pour couvrir différents rôles

Le MJ peut autoriser des ajustements mineurs pour respecter le concept du personnage ou l'équilibre du groupe.

---

## 11. Progression et Expérience

Le système de Point Buy sert principalement à la création initiale. La progression du personnage en cours de campagne sera gérée par le système d'expérience défini par le MJ.

En général :

-   Les **statistiques** augmentent rarement (événements majeurs, entraînement long)
-   Les **affinités** progressent avec l'usage et l'entraînement
-   Le **système de Flux** peut s'améliorer avec l'étude arcanotechnique
-   L'**équipement** est remplacé et amélioré via l'exploration et le commerce
-   Les **compétences** s'acquièrent via des quêtes, mentors ou accomplissements héroïques

---

**Bon jeu et bonne création de personnage !**
