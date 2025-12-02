# Analyse Finale Point Buy : Classes avec Équipement et Compétences

## 🎯 Objectif

Cette analyse présente le coût total en point buy de chaque classe en incluant leurs compétences et la valeur de leur équipement de départ. Cette approche révèle le coût "réel" de chaque classe si les joueurs devaient acheter leur équipement avec des points au lieu de le recevoir gratuitement.

---

## 📊 Méthodologie de Calcul

### Formule de Calcul

**Coût Total Classe = Points Base + Points Compétences + (Valeur Équipement ÷ 400)**

### Sources de Données

- **Points Base** : `point_buy_analysis.md` + calculs complémentaires
- **Points Compétences** : `competence_costs.md`
- **Valeur Équipement** : `equipment_costs.md` (corrected prices at 400 credits/point)

---

## 🏆 Résultats Complets par Classe

### 📊 Tableau Récapitulatif Final

| **Rang** | **Classe**                     | **Points Base** | **Compétences** | **Équipement** | **TOTAL** | **Écart Cible** |
| -------- | ------------------------------ | --------------- | --------------- | -------------- | --------- | --------------- |
| 1        | **Arcanotechnicien**           | 119             | 23              | 15.0           | **157**   | -23             |
| 2        | **Arcanotechnologue**          | 132             | 17              | 15.0           | **164**   | -16             |
| 3        | **Chasseur**                   | 110             | 23              | 47.0           | **180**   | ±0              |
| 4        | **Taliste**                    | 122             | 19              | 24.0           | **165**   | -15             |
| 5        | **Horion**                     | 131             | 14              | 44.0           | **189**   | +9              |
| 6        | **Technologue**                | 92              | 25              | 76.0           | **193**   | +13             |
| 7        | **Arcanotechnicien de combat** | 136             | 26              | 37.0           | **199**   | +19             |
| 8        | **Sentinelle**                 | 151             | 22              | 52.0           | **225**   | +45             |
| 9        | **Spectre**                    | 150             | 20              | 63.0           | **233**   | +53             |
| 10       | **Maître d'armes**             | 157             | 43              | 40.0           | **240**   | +60             |
| 11       | **Tutélaire**                  | 170             | 27              | 51.0           | **248**   | +68             |

**Cible suggérée : 180 points** (basée sur Chasseur comme classe équilibrée)

---

## 📈 Analyse Détaillée par Classe

### 🥇 **Classes Équilibrées (150-190 points)**

#### **1. Arcanotechnicien** - 157 points ⭐

- **Base** : 119 pts (spécialiste arcanotechnique pur)
- **Compétences** : 23 pts (Armure arcanotechnique 15 + Vue quantiques 8)
- **Équipement** : 15 pts (équipement basique : bâton, tunique, consommables)
- **Analyse** : Parfait exemple d'équilibre classe simple/spécialisée

#### **2. Arcanotechnologue** - 164 points ⭐

- **Base** : 132 pts (stats équilibrées, bonnes affinités)
- **Compétences** : 17 pts (Connaisseur arcanotechnique 12 + Scientifique 5)
- **Équipement** : 15 pts (identique au Arcanotechnicien)
- **Analyse** : Excellent équilibre recherche/combat

#### **3. Chasseur** - 180 points ⭐⭐ (CIBLE PARFAITE)

- **Base** : 110 pts (stats physiques, affinités distance)
- **Compétences** : 23 pts (Armure arcanotechnique 15 + Vue quantiques 8)
- **Équipement** : 47 pts (fusil pompe surchargé 25 + exosquelette traque 12 + consommables 10)
- **Analyse** : Spécialiste anti-arcanotechnique avec coût justifié

#### **4. Taliste** - 165 points ⭐

- **Base** : 122 pts (ranger polyvalent)
- **Compétences** : 19 pts (Traque 6 + Expert terrains 8 + Compréhension nature 5)
- **Équipement** : 24 pts (pistolet 12 + tenue survie 8 + soins 4)
- **Analyse** : Polyvalent abordable avec spécialisation environnementale

#### **5. Horion** - 189 points 🟡

- **Base** : 131 pts (soldat lourd)
- **Compétences** : 14 pts (Vétéran 6 + Tacticien 8)
- **Équipement** : 44 pts (fusil mitrailleur 18 + exosquelette combat 18 + explosifs 8)
- **Analyse** : Acceptable pour classe militaire lourde

---

### 🟡 **Classes Légèrement Déséquilibrées (190-210 points)**

#### **6. Technologue** - 193 points 🟡

- **Base** : 92 pts (stats faibles compensées par technologie)
- **Compétences** : 25 pts (Ingénieur 15 + Hackeur 10)
- **Équipement** : 76 pts (drone 30 + implant 22 + pistolet 12 + consommables 12)
- **Analyse** : High-tech justify coût élevé, archétype valide

#### **7. Arcanotechnicien de combat** - 199 points 🟡

- **Base** : 136 pts (hybride mage-guerrier)
- **Compétences** : 26 pts (Champ électromagnétique 18 + Vue quantiques 8)
- **Équipement** : 37 pts (épée légère 15 + exosquelette combat 18 + soins 4)
- **Analyse** : Coût élevé justifié par polyvalence mage/combat

---

### 🔴 **Classes Déséquilibrées (210+ points)**

#### **8. Sentinelle** - 225 points 🔴

- **Base** : 151 pts (stats très élevées)
- **Compétences** : 22 pts (Course 12 + Rôdeur 10)
- **Équipement** : 52 pts (2× épée légère 30 + exosquelette vitesse 18 + soins 4)
- **Problèmes** : Stats de base trop élevées + équipement double épée coûteux

#### **9. Spectre** - 233 points 🔴

- **Base** : 150 pts (tireur spécialisé)
- **Compétences** : 20 pts (Œil d'aigle 10 + Rôdeur 10)
- **Équipement** : 63 pts (fusil sniper 22 + épée courte 15 + exo stabilisateur 20 + flash 4 + soins 2)
- **Problèmes** : Équipement spécialisé très coûteux

#### **10. Maître d'armes** - 240 points 🔴🔴

- **Base** : 157 pts (déjà élevé)
- **Compétences** : 43 pts (Guerrier 35 + Tacticien 8)
- **Équipement** : 40 pts (épée lourde 20 + armure plate 16 + soins 4)
- **Problèmes** : Compétence "Guerrier" excessivement coûteuse (35 pts)

#### **11. Tutélaire** - 248 points 🔴🔴🔴

- **Base** : 170 pts (PV excessifs, affinités élevées)
- **Compétences** : 27 pts (À l'affut 15 + Charismatique 12)
- **Équipement** : 51 pts (épée légère 15 + armure plate 16 + bouclier 14 + 3×soins 6)
- **Problèmes** : Multiple déséquilibres cumulés

---

## 📊 Analyse Statistique

### **Distribution des Coûts**

- **Moyenne** : 195 points
- **Médiane** : 193 points
- **Écart-type** : 31 points
- **Écart min-max** : 91 points (157-248)

### **Répartition par Composant**

| **Composant**   | **Minimum** | **Maximum** | **Moyenne** |
| --------------- | ----------- | ----------- | ----------- |
| **Points Base** | 92          | 170         | 132         |
| **Compétences** | 14          | 43          | 24          |
| **Équipement**  | 15          | 76          | 40          |

### **Classes par Catégorie de Coût**

- **Équilibrées (150-190)** : 5 classes (45%)
- **Déséquilibrées légères (190-210)** : 2 classes (18%)
- **Problématiques (210+)** : 4 classes (36%)

---

## 🎯 Recommandations de Rééquilibrage

### **Cible Optimale : 180 points**

#### **Actions Immédiates**

**1. Tutélaire (248 → 180 points) : -68 points**

- Réduire vie de 75 à 50 PV (-12 points)
- Réduire A.CAC de 6 à 4 (-8 points)
- Réduire FOR de 14 à 12 (-3 points)
- Remplacer "Charismatique" par compétence moins coûteuse (-7 points)
- Équipement : supprimer 1 kit de soins (-2 points)
- **Réduction nécessaire restante : -36 points**

**2. Maître d'armes (240 → 180 points) : -60 points**

- Réduire coût "Guerrier" de 35 à 15 points (-20 points)
- Réduire A.CAC de 8 à 6 (-8 points)
- Réduire École[Martial] de 6 à 4 (-8 points)
- Réduire vie de 65 à 55 PV (-5 points)
- **Réduction nécessaire restante : -19 points**

**3. Spectre (233 → 180 points) : -53 points**

- Remplacer exosquelette stabilisateur par armure légère (-15 points)
- Réduire A.Dist de 6 à 4 (-8 points)
- Réduire PRE de 14 à 12 (-6 points)
- **Réduction nécessaire restante : -24 points**

**4. Sentinelle (225 → 180 points) : -45 points**

- Supprimer 1 épée légère (-15 points)
- Réduire A.CAC de 6 à 4 (-8 points)
- Réduire DEX de 16 à 14 (-8 points)
- **Réduction nécessaire restante : -14 points**

#### **Classes Acceptables (Ajustements Mineurs)**

**5. Technologue (193 points)** : Acceptable pour classe high-tech
**6. Arcanotechnicien de combat (199 points)** : Acceptable pour hybride

---

## 🏅 Classes Modèles

### **Parfaitement Équilibrées**

1. **Chasseur (180 points)** - Cible parfaite
2. **Arcanotechnicien (157 points)** - Spécialiste pur équilibré
3. **Arcanotechnologue (164 points)** - Recherche/combat optimal
4. **Taliste (165 points)** - Polyvalent abordable

### **Archétypes Viables**

- **Mage pur** : 157-164 points (équipement minimal, stats/affinités élevées)
- **Spécialiste** : 180 points (équipement spécialisé, compétences ciblées)
- **High-tech** : 193 points (stats faibles, technologie compensatrice)
- **Hybride** : 199 points (équilibré stats/équipement/compétences)

---

## 💰 Impact Économique

### **Avec Système Monnaie (1 point = 400 crédits)**

Si les joueurs commencent avec **0 crédit** et doivent acheter leur équipement :

| **Classe**       | **Coût Équipement** | **Points Économisés** | **Nouveau Total** |
| ---------------- | ------------------- | --------------------- | ----------------- |
| Arcanotechnicien | 6 000 crédits       | 15 points             | 142 points        |
| Chasseur         | 18 800 crédits      | 47 points             | 133 points        |
| Technologue      | 30 400 crédits      | 76 points             | 117 points        |
| Tutélaire        | 20 400 crédits      | 51 points             | 197 points        |

**Observation** : Les classes high-tech deviennent très abordables sans équipement, tandis que les classes avec stats élevées restent coûteuses.

---

## 🎮 Conclusion

Cette analyse révèle que **36% des classes** sont significativement déséquilibrées lorsqu'on inclut la valeur de leur équipement. Le **Chasseur** émerge comme la classe la mieux équilibrée et devrait servir de référence pour ajuster les autres.

**Les 4 classes modèles** (Chasseur, Arcanotechnicien, Arcanotechnologue, Taliste) démontrent qu'un équilibrage optimal est possible, avec des archétypes distincts mais équitables en coût total.

**L'intégration équipement + compétences** dans le point buy révèle des déséquilibres cachés et permet une approche plus équitable de la création de personnage, où chaque point investi a une valeur comparable quelle que soit la classe choisie.

---

_Cette analyse finale fournit une base solide pour un système de point buy véritablement équilibré intégrant tous les aspects de la création de personnage._
