# Analyse Point Buy : Classes RPG

## Objectif

Cette analyse présente le coût total en point buy de chaque classe en incluant leurs statistiques de base, affinités arcanotechniques, compétences et la valeur de leur équipement de départ. Cette approche révèle le coût réel de chaque classe et permet d'identifier les déséquilibres pour un équilibrage optimal du système.

---

## Méthodologie de Calcul

### Formule de Calcul Total

**Coût Total Classe = Points Stats + Points Affinités + Points Compétences + Points Équipement**

### 1. Calcul des Stats de Base

Chaque stat commence à 8 (gratuit), puis :

-   **9-13** : 1 point par niveau
-   **14-15** : 2 points par niveau
-   **16-17** : 3 points par niveau
-   **18** : 4 points

**Exemple :** DEX 16 = (9-13: 5pts) + (14-15: 4pts) + (16: 3pts) = **12 points**

### 2. Calcul des Affinités Arcanotechniques

**Formule** : `coût = max(0, (total_affinités - 5) / 2)`

-   Comptabilisation de TOUTES les valeurs d'affinité :
    -   Affinités de portée (distance, melee, sniper, etc.)
    -   Écoles arcanotechniques (balistique, electricite, givre, etc.)
    -   Types de sorts (arme, destruction, alteration, etc.)
-   Les 5 premiers points sont gratuits
-   Chaque 2 points d'affinité au-delà coûtent 1 point buy

**Exemple :** Total 22 affinités = (22 - 5) / 2 = **8.5 points**

### 3. Coûts des Compétences

| Compétence                  | Coût   |
| --------------------------- | ------ |
| Armure d'arcanotechnie      | 15 pts |
| Connaisseur d'arcanotechnie | 12 pts |
| Vue des quantiques          | 8 pts  |
| Champ électromagnétique     | 18 pts |
| Vétéran                     | 6 pts  |
| Tacticien                   | 8 pts  |
| Ingénieur                   | 15 pts |
| Hackeur                     | 10 pts |
| Guerrier                    | 10 pts |
| Scientifique                | 5 pts  |
| Traque                      | 6 pts  |
| Expert des terrains         | 8 pts  |
| Compréhension de la nature  | 5 pts  |
| Œil d'aigle                 | 8 pts  |
| Rôdeur                      | 6 pts  |
| Course                      | 5 pts  |
| Charismatique               | 10 pts |
| À l'affût                   | 8 pts  |

### 4. Coûts de l'Équipement

Conversion : **1 point = 400 crédits**

Les coûts sont calculés à partir du fichier `equipment_costs.md` et divisés par 400 pour obtenir le coût en points.

---

## Résultats Détaillés par Classe

### 1. Arcanotechnicien

**Stats de Base (FOR 9, DEX 9, CON 10, INT 16, PER 12, PRE 11, CHA 11):**

-   FOR 9: 1 pt
-   DEX 9: 1 pt
-   CON 10: 2 pts
-   INT 16: 12 pts
-   PER 12: 4 pts
-   PRE 11: 3 pts
-   CHA 11: 3 pts
-   **Total Stats: 26 pts**

**Affinités:**

-   distance: 2, melee: 2
-   givre: 5, bioarcanotechnique: 2
-   destruction: 4, alteration: 2, deplacement: 2
-   **Total: 21 affinités → (21-5)/2 = 8 pts**

**Compétences:**

-   Armure d'arcanotechnie: 15 pts
-   Vue des quantiques: 8 pts
-   **Total: 23 pts**

**Équipement:**

-   Bâton: 5 pts
-   Tunique: 0 pts
-   Kit de soins (1×): 2 pts
-   Cristal de mana (1×): 8 pts
-   **Total: 15 pts**

**COÛT TOTAL: 72 pts**

---

### 2. Arcanotechnologue

**Stats de Base (FOR 9, DEX 10, CON 11, INT 14, PER 16, PRE 9, CHA 10):**

-   FOR 9: 1 pt
-   DEX 10: 2 pts
-   CON 11: 3 pts
-   INT 14: 8 pts
-   PER 16: 12 pts
-   PRE 9: 1 pt
-   CHA 10: 2 pts
-   **Total Stats: 29 pts**

**Affinités:**

-   distance: 0, melee: 2
-   bioarcanotechnique: 4, feu: 2
-   alteration: 3, amelioration: 3, destruction: 2
-   **Total: 16 affinités → (16-5)/2 = 5.5 pts**

**Compétences:**

-   Connaisseur d'arcanotechnie: 12 pts
-   Scientifique: 5 pts
-   **Total: 17 pts**

**Équipement:**

-   Bâton: 5 pts
-   Tunique: 0 pts
-   Kit de soins (1×): 2 pts
-   Cristal de mana (1×): 8 pts
-   **Total: 15 pts**

**COÛT TOTAL: 66.5 pts**

---

### 3. Arcanotechnicien de Combat

**Stats de Base (FOR 12, DEX 15, CON 11, INT 15, PER 10, PRE 9, CHA 11):**

-   FOR 12: 4 pts
-   DEX 15: 10 pts
-   CON 11: 3 pts
-   INT 15: 10 pts
-   PER 10: 2 pts
-   PRE 9: 1 pt
-   CHA 11: 3 pts
-   **Total Stats: 33 pts**

**Affinités:**

-   distance: 0, melee: 4
-   electricite: 3, magnetique: 2
-   arme: 3, destruction: 3, alteration: 2
-   **Total: 17 affinités → (17-5)/2 = 6 pts**

**Compétences:**

-   Champ électromagnétique: 18 pts
-   Vue des quantiques: 8 pts
-   **Total: 26 pts**

**Équipement:**

-   Épée légère: 15 pts
-   Exosquelette de combat: 18 pts
-   Kit de soins (2×): 4 pts
-   **Total: 37 pts**

**COÛT TOTAL: 102 pts**

---

### 4. Chasseur

**Stats de Base (FOR 13, DEX 14, CON 12, INT 8, PER 12, PRE 11, CHA 10):**

-   FOR 13: 5 pts
-   DEX 14: 8 pts
-   CON 12: 4 pts
-   INT 8: 0 pts
-   PER 12: 4 pts
-   PRE 11: 3 pts
-   CHA 10: 2 pts
-   **Total Stats: 26 pts**

**Affinités:**

-   distance: 3, melee: 0, fusil_a_pompe: 4
-   balistique: 6
-   arme: 4
-   **Total: 17 affinités → (17-5)/2 = 6 pts**

**Compétences:**

-   Armure d'arcanotechnie: 15 pts
-   Vue des quantiques: 8 pts
-   **Total: 23 pts**

**Équipement:**

-   Fusil à pompe surchargé: 25 pts
-   Exosquelette de traque: 12 pts
-   Kit de soins (1×): 2 pts
-   Fléchette anti-arcanotechnique (1×): 8 pts
-   **Total: 47 pts**

**COÛT TOTAL: 102 pts**

---

### 5. Horion

**Stats de Base (FOR 12, DEX 8, CON 12, INT 11, PER 12, PRE 16, CHA 11):**

-   FOR 12: 4 pts
-   DEX 8: 0 pts
-   CON 12: 4 pts
-   INT 11: 3 pts
-   PER 12: 4 pts
-   PRE 16: 12 pts
-   CHA 11: 3 pts
-   **Total Stats: 30 pts**

**Affinités:**

-   distance: 6, melee: 2
-   balistique: 4
-   arme: 6, amelioration: 2
-   **Total: 20 affinités → (20-5)/2 = 7.5 pts**

**Compétences:**

-   Vétéran: 6 pts
-   Tacticien: 8 pts
-   **Total: 14 pts**

**Équipement:**

-   Fusil mitrailleur: 18 pts
-   Exosquelette de combat: 18 pts
-   Kit de soins (1×): 2 pts
-   Grenade (1×): 6 pts
-   **Total: 44 pts**

**COÛT TOTAL: 95.5 pts**

---

### 6. Maître d'armes

**Stats de Base (FOR 16, DEX 12, CON 14, INT 10, PER 8, PRE 10, CHA 12):**

-   FOR 16: 12 pts
-   DEX 12: 4 pts
-   CON 14: 8 pts
-   INT 10: 2 pts
-   PER 8: 0 pts
-   PRE 10: 2 pts
-   CHA 12: 4 pts
-   **Total Stats: 32 pts**

**Affinités:**

-   distance: 0, melee: 8
-   martial: 5, quantique: 2
-   arme: 5, amelioration: 2
-   **Total: 22 affinités → (22-5)/2 = 8.5 pts**

**Compétences:**

-   Guerrier: 10 pts
-   Tacticien: 8 pts
-   **Total: 18 pts**

**Équipement:**

-   Épée lourde: 20 pts
-   Armure de plate lourde: 16 pts
-   Kit de soins (2×): 4 pts
-   **Total: 40 pts**

**COÛT TOTAL: 98.5 pts**

---

### 7. Sentinelle

**Stats de Base (FOR 11, DEX 16, CON 13, INT 11, PER 12, PRE 10, CHA 8):**

-   FOR 11: 3 pts
-   DEX 16: 12 pts
-   CON 13: 5 pts
-   INT 11: 3 pts
-   PER 12: 4 pts
-   PRE 10: 2 pts
-   CHA 8: 0 pts
-   **Total Stats: 29 pts**

**Affinités:**

-   distance: 2, melee: 6, arme_1_main: 2
-   martial: 4, quantique: 2
-   arme: 5
-   **Total: 21 affinités → (21-5)/2 = 8 pts**

**Compétences:**

-   Course: 5 pts
-   Rôdeur: 6 pts
-   **Total: 11 pts**

**Équipement:**

-   Épée légère (2×): 30 pts
-   Exosquelette de vitesse: 18 pts
-   Kit de soins (2×): 4 pts
-   **Total: 52 pts**

**COÛT TOTAL: 100 pts**

---

### 8. Spectre

**Stats de Base (FOR 8, DEX 14, CON 9, INT 10, PER 11, PRE 14, CHA 10):**

-   FOR 8: 0 pts
-   DEX 14: 8 pts
-   CON 9: 1 pt
-   INT 10: 2 pts
-   PER 11: 3 pts
-   PRE 14: 8 pts
-   CHA 10: 2 pts
-   **Total Stats: 24 pts**

**Affinités:**

-   distance: 5, melee: 4, sniper: 2
-   balistique: 4, electricite: 2, quantique: 2
-   arme: 6, amelioration: 2
-   **Total: 27 affinités → (27-5)/2 = 11 pts**

**Compétences:**

-   Œil d'aigle: 8 pts
-   Rôdeur: 6 pts
-   **Total: 14 pts**

**Équipement:**

-   Fusil de sniper: 22 pts
-   Épée courte: 15 pts
-   Exosquelette stabilisateur: 20 pts
-   Kit de soins (1×): 2 pts
-   Flash (1×): 4 pts
-   **Total: 63 pts**

**COÛT TOTAL: 112 pts**

---

### 9. Taliste

**Stats de Base (FOR 6, DEX 8, CON 9, INT 14, PER 18, PRE 10, CHA 12):**

-   FOR 6: -2 pts (below 8, counted as 0)
-   DEX 8: 0 pts
-   CON 9: 1 pt
-   INT 14: 8 pts
-   PER 18: 16 pts
-   PRE 10: 2 pts
-   CHA 12: 4 pts
-   **Total Stats: 31 pts** (note: stats below 8 don't give negative points)

**Affinités:**

-   distance: 2, melee: 0
-   bioarcanotechnique: 3, quantique: 3
-   alteration: 3, amelioration: 3
-   **Total: 14 affinités → (14-5)/2 = 4.5 pts**

**Compétences:**

-   Traque: 6 pts
-   Expert des terrains: 8 pts
-   Compréhension de la nature: 5 pts
-   **Total: 19 pts**

**Équipement:**

-   Pistolet: 12 pts
-   Tenue de survie: 8 pts
-   Kit de soins (2×): 4 pts
-   **Total: 24 pts**

**COÛT TOTAL: 78.5 pts**

---

### 10. Technologue

**Stats de Base (FOR 9, DEX 11, CON 10, INT 14, PER 12, PRE 8, CHA 14):**

-   FOR 9: 1 pt
-   DEX 11: 3 pts
-   CON 10: 2 pts
-   INT 14: 8 pts
-   PER 12: 4 pts
-   PRE 8: 0 pts
-   CHA 14: 8 pts
-   **Total Stats: 26 pts**

**Affinités:**

-   distance: 2, melee: 0
-   electricite: 3
-   alteration: 3, amelioration: 2
-   **Total: 10 affinités → (10-5)/2 = 2.5 pts**

**Compétences:**

-   Ingénieur: 15 pts
-   Hackeur: 10 pts
-   **Total: 25 pts**

**Équipement:**

-   Pistolet: 12 pts
-   Implant neural militaire: 22 pts
-   Drone de combat: 30 pts
-   Kit de soins (1×): 2 pts
-   Bombe IEM (1×): 10 pts
-   **Total: 76 pts**

**COÛT TOTAL: 129.5 pts**

---

### 11. Tutélaire

**Stats de Base (FOR 14, DEX 10, CON 15, INT 12, PER 9, PRE 10, CHA 13):**

-   FOR 14: 8 pts
-   DEX 10: 2 pts
-   CON 15: 10 pts
-   INT 12: 4 pts
-   PER 9: 1 pt
-   PRE 10: 2 pts
-   CHA 13: 5 pts
-   **Total Stats: 32 pts**

**Affinités:**

-   distance: 0, melee: 6
-   lumiere: 4, martial: 4
-   amelioration: 4, arme: 3, alteration: 2
-   **Total: 23 affinités → (23-5)/2 = 9 pts**

**Compétences:**

-   À l'affût: 8 pts
-   Charismatique: 10 pts
-   **Total: 18 pts**

**Équipement:**

-   Épée légère: 15 pts
-   Armure de plate lourde: 16 pts
-   Bouclier: 14 pts
-   Kit de soins (3×): 6 pts
-   **Total: 51 pts**

**COÛT TOTAL: 110 pts**

---

## Tableau Récapitulatif : Classement par Coût Total

| Rang | Classe                     | Stats | Affinités | Compétences | Équipement | TOTAL     | Écart/180 |
| ---- | -------------------------- | ----- | --------- | ----------- | ---------- | --------- | --------- |
| 1    | Arcanotechnologue          | 29.0  | 5.5       | 17          | 15         | **66.5**  | -113.5    |
| 2    | Arcanotechnicien           | 26.0  | 8.0       | 23          | 15         | **72.0**  | -108.0    |
| 3    | Taliste                    | 31.0  | 4.5       | 19          | 24         | **78.5**  | -101.5    |
| 4    | Horion                     | 30.0  | 7.5       | 14          | 44         | **95.5**  | -84.5     |
| 5    | Maître d'armes             | 32.0  | 8.5       | 18          | 40         | **98.5**  | -81.5     |
| 6    | Sentinelle                 | 29.0  | 8.0       | 11          | 52         | **100.0** | -80.0     |
| 7    | Chasseur                   | 26.0  | 6.0       | 23          | 47         | **102.0** | -78.0     |
| 8    | Arcanotechnicien de Combat | 33.0  | 6.0       | 26          | 37         | **102.0** | -78.0     |
| 9    | Tutélaire                  | 32.0  | 9.0       | 18          | 51         | **110.0** | -70.0     |
| 10   | Spectre                    | 24.0  | 11.0      | 14          | 63         | **112.0** | -68.0     |
| 11   | Technologue                | 26.0  | 2.5       | 25          | 76         | **129.5** | -50.5     |

**Cible suggérée : 180 points**

---

## Analyse Statistique

### Distribution des Coûts

-   **Moyenne** : 97.0 points
-   **Médiane** : 100.0 points
-   **Minimum** : 66.5 points (Arcanotechnologue)
-   **Maximum** : 129.5 points (Technologue)
-   **Écart min-max** : 63.0 points

### Répartition par Composant

| Composant   | Minimum | Maximum | Moyenne |
| ----------- | ------- | ------- | ------- |
| Stats       | 24.0    | 33.0    | 28.9    |
| Affinités   | 2.5     | 11.0    | 6.9     |
| Compétences | 11.0    | 26.0    | 18.5    |
| Équipement  | 15.0    | 76.0    | 42.6    |

### Observations Critiques

**1. Aucune classe n'atteint la cible de 180 points**

-   La classe la plus chère (Technologue) est à 129.5 points, soit 50.5 points sous la cible
-   Cet écart suggère que la cible de 180 points est irréaliste ou que le système de calcul doit être révisé

**2. Équipement = Principal Facteur de Variation**

-   L'équipement varie de 15 à 76 points (écart de 61 points)
-   Les classes high-tech (Technologue: 76 pts) ont 5× plus d'équipement que les mages (15 pts)
-   Cette variation explique 97% de l'écart entre classes

**3. Stats et Affinités Relativement Équilibrées**

-   Stats : écart de 9 points seulement (24-33)
-   Affinités : écart de 8.5 points (2.5-11)
-   Ces composants sont bien équilibrés entre classes

---

## Analyse Détaillée par Catégorie

### Classes Magiques Pures (66-72 points)

**Caractéristiques communes :**

-   Équipement minimal (15 pts)
-   Stats INT/PER élevées
-   Affinités arcanotechniques moyennes à élevées
-   Compétences spécialisées

**Arcanotechnologue (66.5 pts)** - Classe la moins chère

-   Points forts : Équipement minimal, affinités modérées (5.5)
-   Optimisation : Balance stats élevées avec peu d'équipement

**Arcanotechnicien (72 pts)**

-   Points forts : Spécialiste destruction pure
-   Coût : Affinités plus élevées (8) et compétences défensives (23)

**Conclusion** : Ces classes représentent le minimum viable pour un personnage fonctionnel.

---

### Classes Équilibrées (78-102 points)

Cette catégorie regroupe 6 des 11 classes, représentant l'équilibre type du jeu.

**Taliste (78.5 pts)** - Éclaireur polyvalent

-   Le plus bas en stats (31) mais compétences variées (3)
-   Équipement léger (24 pts)
-   Archétype : Spécialiste exploration/support

**Horion (95.5 pts)** - Soldat d'infanterie

-   Stats équilibrées, affinités distance élevées
-   Équipement militaire standard (44 pts)
-   Archétype : DPS distance fiable

**Maître d'armes (98.5 pts)** - Tank mêlée

-   Stats physiques élevées (FOR 16, CON 14)
-   Équipement lourd mais classique (40 pts)
-   Archétype : Frontline traditionnel

**Sentinelle (100 pts)** - Assassin rapide

-   DEX exceptionnelle (16) mais équipement coûteux (2 épées + exo = 52 pts)
-   Compétences peu chères (11 pts)
-   Archétype : Glass cannon mobile

**Chasseur (102 pts)** - Spécialiste anti-mage

-   Balance entre stats modestes et équipement spécialisé (47 pts)
-   Compétences défensives coûteuses (23 pts)
-   Archétype : Counter-pick tactique

**Arcanotechnicien de Combat (102 pts)** - Hybride mage-guerrier

-   Stats les plus élevées de la catégorie (33 pts)
-   Compétence unique très chère (Champ électromagnétique: 18 pts)
-   Archétype : Gish électrique

**Conclusion** : Ces classes représentent le coeur du système, avec des coûts entre 78-102 points. Elles offrent des archétypes distincts mais comparables en puissance.

---

### Classes Premium (110-130 points)

**Tutélaire (110 pts)** - Tank arcanotechnique

-   Stats défensives massives (CON 15, 75 PV)
-   Équipement défensif complet (armure + bouclier = 30 pts)
-   Archétype : Protecteur absolu

**Spectre (112 pts)** - Sniper d'élite

-   Affinités les plus élevées du jeu (11 pts)
-   Équipement ultra-spécialisé (fusil sniper + exo stabilisateur = 42 pts)
-   Archétype : One-shot wonder

**Technologue (129.5 pts)** - Classe la plus chère

-   Équipement de loin le plus coûteux (76 pts dont drone 30 + implant 22)
-   Affinités les plus basses (2.5) compensées par technologie
-   Archétype : High-tech support

**Conclusion** : Ces classes paient un premium pour des capacités uniques (tanking extrême, sniper parfait, technologie avancée). Leur coût justifié par leur spécialisation.

---

## Recommandations de Rééquilibrage

### Option 1 : Réduire la Cible à 100 Points

**Raisonnement :**

-   La médiane actuelle est de 100 points
-   6 classes sur 11 sont entre 95-102 points (le sweet spot naturel)
-   Plus réaliste que 180 points

**Ajustements nécessaires :**

**Classes à réduire :**

-   **Technologue (129.5 → 100)** : -29.5 pts

    -   Réduire coût drone de 30 à 15 pts (-15)
    -   Réduire coût implant de 22 à 12 pts (-10)
    -   Remplacer 1 compétence coûteuse (-5)

-   **Spectre (112 → 100)** : -12 pts

    -   Réduire coût exo stabilisateur de 20 à 12 pts (-8)
    -   Réduire 1 affinité de distance ou sniper (-2)
    -   Réduire équipement consommable (-2)

-   **Tutélaire (110 → 100)** : -10 pts
    -   Réduire PV de 75 à 65 (-3)
    -   Réduire 1 affinité mêlée (-2)
    -   Réduire kit de soins de 3 à 2 (-2)
    -   Réduire coût compétence Charismatique de 10 à 7 (-3)

**Classes à augmenter :**

-   **Arcanotechnologue (66.5 → 100)** : +33.5 pts

    -   Ajouter affinités arcanotechniques (+10)
    -   Améliorer équipement (ajouter protection/arme secondaire) (+15)
    -   Augmenter stats (PER ou INT) (+8.5)

-   **Arcanotechnicien (72 → 100)** : +28 pts

    -   Ajouter équipement défensif (armure légère) (+10)
    -   Augmenter affinités destruction (+8)
    -   Augmenter stats (INT ou CON) (+10)

-   **Taliste (78.5 → 100)** : +21.5 pts
    -   Augmenter équipement (meilleure arme ou armure) (+12)
    -   Ajouter affinités environnementales (+5)
    -   Augmenter 1-2 stats (DEX ou FOR) (+4.5)

---

### Option 2 : Garder la Cible à 180 Points

**Raisonnement :**

-   Permet plus de customisation au-delà de l'équipement de base
-   Les joueurs auraient ~80 points pour personnaliser leur personnage
-   Reflète un système de création plus complexe

**Implications :**

-   Chaque classe devrait recevoir +80 points en moyenne de budget supplémentaire
-   Ce budget pourrait être alloué par les joueurs en :
    -   Stats supplémentaires
    -   Affinités additionnelles
    -   Compétences supplémentaires
    -   Meilleur équipement
    -   Monnaie de départ (1 pt = 400 crédits)

**Exemple avec Chasseur (102 pts de base) :**

-   Budget restant : 78 points disponibles
-   Options :
    -   +6 DEX (de 14 à 17) = 9 pts
    -   Compétence "Vétéran" = 6 pts
    -   Affinités balistique +2 = 2 pts
    -   Grenade supplémentaire = 6 pts
    -   Reste 55 pts = 22,000 crédits de départ

---

### Option 3 : Système Hybride (Recommandé)

**Concept :** Classes de base à 100 pts + Points de personnalisation variables

**Étape 1 : Normaliser toutes les classes à 100 points de base**

-   Utiliser les ajustements de l'Option 1

**Étape 2 : Budget de personnalisation par archétype**

-   **Spécialistes purs** (Sniper, Tank, etc.) : +60 points
    -   Moins de flexibilité, plus de profondeur
-   **Généralistes** (Horion, Sentinelle) : +80 points
    -   Plus de flexibilité, moins de profondeur
-   **Hybrides** (Arcanotechnicien de Combat) : +70 points
    -   Équilibre flexibilité/profondeur

**Étape 3 : Budget total = 160-180 points selon archétype**

-   Reflète les différences de potentiel de croissance
-   Plus simple qu'un budget unique pour tous

**Avantages :**

-   Préserve l'identité des archétypes
-   Permet la personnalisation
-   Réaliste et applicable

---

## Classes Modèles par Archétype

### Mage Pur : Arcanotechnicien (72 pts)

**Forces :**

-   Stats INT/PER optimisées pour arcanotechnie
-   Affinités destruction élevées
-   Compétences défensives solides

**Faiblesses :**

-   Équipement minimal
-   Fragilité physique (40 PV, CON 10)
-   Dépendance aux ressources (flux)

**Modèle économique :**

-   Investissement minimal en équipement (15 pts)
-   Maximum en capacités intrinsèques (57 pts)

---

### DPS Distance : Horion (95.5 pts)

**Forces :**

-   Balance stats/équipement optimale
-   Compétences tactiques (Vétéran + Tacticien)
-   Équipement militaire polyvalent

**Faiblesses :**

-   Aucune capacité exceptionnelle
-   Dépendant du groupe

**Modèle économique :**

-   Distribution équilibrée entre tous les composants
-   Classe "default" bien exécutée

---

### Spécialiste Anti-Mage : Chasseur (102 pts)

**Forces :**

-   Équipement ultra-spécialisé (fusil pompe surchargé)
-   Compétences anti-arcanotechniques parfaites
-   Excellente mobilité

**Faiblesses :**

-   Stats INT faibles (8)
-   Dépendant de son équipement
-   Vulnérable en mêlée

**Modèle économique :**

-   Investissement lourd en équipement spécialisé (47 pts)
-   Compétences coûteuses mais définissantes (23 pts)
-   Stats minimalistes (26 pts)

---

### Hybride Mage-Guerrier : Arcanotechnicien de Combat (102 pts)

**Forces :**

-   Stats les plus équilibrées (DEX 15, INT 15)
-   Compétence unique définissante (Champ électromagnétique)
-   Versatilité combat/arcanotechnie

**Faiblesses :**

-   Aucune excellence dans un domaine
-   Flux limité malgré capacités arcanotechniques

**Modèle économique :**

-   Investissement maximum en stats (33 pts)
-   Compétence ultra-coûteuse mais unique (18 pts)
-   Équipement support correct (37 pts)

---

### Tank Premium : Tutélaire (110 pts)

**Forces :**

-   PV massifs (75)
-   Équipement défensif complet
-   Affinités protection (lumière + amélioration)

**Faiblesses :**

-   Mobilité faible (vitesse 4)
-   Coût élevé pour l'archétype

**Modèle économique :**

-   Premium de 10 points justifié par tanking supérieur
-   Investissement lourd en défense (51 pts équipement)

---

### High-Tech Support : Technologue (129.5 pts)

**Forces :**

-   Capacités technologiques uniques (drone, implant, hack)
-   Versatilité hors combat inégalée
-   Potentiel de contrôle du champ de bataille

**Faiblesses :**

-   Stats physiques très faibles
-   Dépendance totale à l'équipement
-   Fragilité extrême (30 PV)

**Modèle économique :**

-   Coût justifié par équipement unique (76 pts dont 52 en drone+implant)
-   Trade-off stats faibles vs technologie
-   Archétype "pay-to-play" viable

---

## Conclusion

### État Actuel du Système

**Points Positifs :**

1. **Diversité des archétypes** : Chaque classe a une identité distincte
2. **Balance stats/affinités** : Ces composants sont bien équilibrés (écarts de 8-9 pts)
3. **Coûts cohérents** : Les classes premium offrent réellement plus de valeur

**Points Problématiques :**

1. **Cible de 180 points irréaliste** : Aucune classe ne dépasse 130 points
2. **Variation équipement excessive** : Écart de 61 points entre classes
3. **Aucun budget de personnalisation** : Les joueurs reçoivent tout pré-fait

### Recommandation Finale

**Adopter le Système Hybride (Option 3) :**

1. **Normaliser les classes de base à 100 points**

    - Réduit l'écart entre classes
    - Crée un point de référence clair

2. **Budget de personnalisation de 60-80 points**

    - Spécialistes : 60 points (total 160)
    - Généralistes : 80 points (total 180)
    - Hybrides : 70 points (total 170)

3. **Permettre la conversion équipement ↔ caractéristiques**

    - Flexibilité pour les joueurs
    - Maintient l'équilibre économique (1 pt = 400 crédits)

4. **Points non dépensés = Monnaie de départ**
    - Évite le "use it or lose it"
    - Crée des choix intéressants

### Impact sur le Gameplay

**Pour les Joueurs :**

-   Plus de contrôle sur leur personnage
-   Choix significatifs dès la création
-   Possibilité d'optimisation sans briser l'équilibre

**Pour le MJ :**

-   Système plus simple à expliquer
-   Classes de base équilibrées par défaut
-   Flexibilité pour récompenses et progression

**Pour le Système :**

-   Cohérence économique entre création et jeu
-   Valeur claire de chaque point investi
-   Évolutivité pour futures classes/options

---

## Annexe : Formules et Références

### Formule Complète de Coût

```
Coût_Total = Σ(Coût_Stats) + max(0, (Σ(Affinités) - 5) / 2) + Σ(Coût_Compétences) + Σ(Coût_Équipement)

où :
  Coût_Stats(x) = {
    0 pts si x ≤ 8
    (x - 8) pts si 9 ≤ x ≤ 13
    5 + 2*(x - 13) pts si 14 ≤ x ≤ 15
    9 + 3*(x - 15) pts si 16 ≤ x ≤ 17
    15 + 4 pts si x = 18
  }

  Coût_Équipement = Prix_Crédits / 400
```

### Taux de Conversion

-   **Point buy ↔ Crédits** : 1 point = 400 crédits
-   **Stats** : Variable selon palier (1-4 pts par niveau)
-   **Affinités** : 2 affinités = 1 point (après les 5 premiers gratuits)

### Sources des Données

-   **Stats et affinités** : Fichiers YAML `/home/lanath/Work/lanath/rpg/codex/classes/*.yaml`
-   **Compétences** : Liste fournie dans les instructions
-   **Équipement** : `/home/lanath/Work/lanath/rpg/equipment_costs.md`

---

**Document créé le 2025-12-02**
**Analyse basée sur 11 classes complètes**
**Système : RPG Arcanotechnie Impériale**
