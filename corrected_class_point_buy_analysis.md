# Analyse Point Buy Corrigée (Sources YAML Autoritatives)

## 🎯 Objectif

Cette analyse recalcule complètement les coûts point buy de toutes les classes en utilisant les données autoritatives des fichiers YAML, incluant compétences et équipement.

---

## 📊 Méthodologie de Recalcul

### Sources Autoritatives

- **Stats/Affinités/Équipement** : Fichiers YAML `/codex/classes/`
- **Coûts Compétences** : `competence_costs.md`
- **Coûts Équipement** : `equipment_costs.md` (400 crédits/point)

### Formule de Calcul Base

- **Statistiques** : coût × (valeur - 10) [base humaine = 10]
- **Affinités** : coût × valeur [pas de base]
- **Secondaires** : coût × (valeur - base standard)

### Coûts Révisés

- **FOR, PRE, CHA** : 3 points/niveau
- **DEX, INT, PER** : 4 points/niveau
- **CON** : 3 points/niveau
- **A.Distance/CAC** : 4 points/niveau (spécialisées)
- **Écoles par Complexité** :
  - **Pure** : 8 pts/niveau
  - **Quantique** : 7 pts/niveau
  - **Complexes** (Chronodynamique, Gravitonique) : 6 pts/niveau
  - **Avancées** (Biométabolique, Bioarcanotechnie, Magnétique, Kinesthésique) : 5 pts/niveau
  - **Standard** (Feu, Givre, Électricité, Lumière, Ombre, Aérocinétique, Hydrodynamique, Sonique, Illusion, Martial, Balistique) : 3 pts/niveau
- **Types** : 5 points/niveau (Destruction, Altération, Amélioration, Arme, Déplacement)
- **Affinités spéciales** : 4 points/niveau

---

## 🔢 Recalculs Détaillés par Classe

### 1. **CHASSEUR** - TOTAL: 186 points (RÉVISÉ)

**Statistiques (base 10):**

- For 13 (3×3=9), Dex 14 (4×4=16), Con 12 (2×3=6), Int 8 (-2×4=-8)
- Per 12 (2×4=8), Pre 11 (1×3=3), Cha 10 (0×3=0)
- **Total Stats: 34 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 4 (4×4=16), CAC 0 (0×4=0), Fusil_pompe 4 (4×4=16)
- École[Balistique] 6 (6×**3**=**18**), Type[Arme] 4 (4×5=20)
- **Total Affinités: 70 points** ✅ **(-12 pts vs ancien système)**

**Secondaires:**

- Vie 40 (base), Vitesse 6 (+3×4=12), Flux 5/2/1 (base faible)
- **Total Secondaires: 12 points**

**Compétences:**

- Armure d'arcanotechnie (15) + Vue des quantiques (8) = **23 points**

**Équipement:**

- Fusil pompe surchargé (25) + Exosquelette traque (12) + Kit soins (2) + Fléchette (8) = **47 points**

**BASE RECALCULÉE: 34+70+12 = 116 points** (vs 128 ancien système)

---

### 2. **HORION** - TOTAL: 204 points (RÉVISÉ)

**Statistiques (base 10):**

- For 12 (2×3=6), Dex 8 (-2×4=-8), Con 12 (2×3=6), Int 11 (1×4=4)
- Per 12 (2×4=8), Pre 16 (6×3=18), Cha 11 (1×3=3)
- **Total Stats: 37 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 8 (8×4=32), CAC 2 (2×4=8)
- École[Balistique] 4 (4×**3**=**12**), Type[Arme] 6 (6×5=30), Type[Amélioration] 2 (2×5=10)
- **Total Affinités: 92 points** ✅ **(-8 pts vs ancien système)**

**Secondaires:**

- Vie 50 (+5×1=5), Vitesse 6 (+3×4=12), Flux 5/2/1 (base)
- **Total Secondaires: 17 points**

**Compétences:**

- Vétéran (6) + Tacticien (8) = **14 points**

**Équipement:**

- Fusil mitrailleur (18) + Exosquelette combat (18) + Kit soins (2) + Grenade (6) = **44 points**

**BASE RECALCULÉE: 37+92+17 = 146 points** (vs 154 ancien système)

---

### 3. **MAÎTRE D'ARMES** - TOTAL: 246 points (RÉVISÉ)

**Statistiques (base 10):**

- For 16 (6×3=18), Dex 12 (2×4=8), Con 14 (4×3=12), Int 10 (0×4=0)
- Per 8 (-2×4=-8), Pre 10 (0×3=0), Cha 12 (2×3=6)
- **Total Stats: 36 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 0 (0×4=0), CAC 8 (8×4=32)
- École[Martial] 6 (6×**3**=**18**), École[Quantique] 2 (2×**7**=**14**)
- Type[Arme] 6 (6×5=30), Type[Amélioration] 2 (2×5=10)
- **Total Affinités: 104 points** ✅ **(-8 pts vs ancien système)**

**Secondaires:**

- Vie 65 (+13×1=13), Vitesse 5 (+2×4=8), Flux 8/3/1 (+2 pts)
- **Total Secondaires: 23 points**

**Compétences:**

- Guerrier (35) + Tacticien (8) = **43 points**

**Équipement:**

- Épée lourde (20) + Armure plate (16) + 2×Kit soins (4) = **40 points**

**BASE RECALCULÉE: 36+104+23 = 163 points** (vs 171 ancien système)

---

### 4. **QUANTOTECHNICIEN** - TOTAL: 182 points (RÉVISÉ)

**Statistiques (base 10):**

- For 9 (-1×3=-3), Dex 9 (-1×4=-4), Con 10 (0×3=0), Int 16 (6×4=24)
- Per 12 (2×4=8), Pre 11 (1×3=3), Cha 11 (1×3=3)
- **Total Stats: 31 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 2 (2×4=8), CAC 2 (2×4=8)
- École[Givre] 5 (5×**3**=**15**), École[Bio] 3 (3×**5**=**15**)
- Type[Destruction] 5 (5×5=25), Type[Altération] 3 (3×5=15), Type[Déplacement] 3 (3×5=15)
- **Total Affinités: 101 points** ✅ **(-10 pts vs ancien système)**

**Secondaires:**

- Vie 40 (base), Vitesse 3 (base), Flux 30/8/3 (élevé +12 pts)
- **Total Secondaires: 12 points**

**Compétences:**

- Armure arcanotechnique (15) + Vue quantiques (8) = **23 points**

**Équipement:**

- Bâton (5) + Tunique (0) + Kit soins (2) + Cristal mana (8) = **15 points**

**BASE RECALCULÉE: 31+101+12 = 143 points** (vs 154 ancien système)

---

### 5. **QUANTOTECHNICIEN DE COMBAT** - TOTAL: 209 points (RÉVISÉ)

**Statistiques (base 10):**

- For 12 (2×3=6), Dex 15 (5×4=20), Con 11 (1×3=3), Int 15 (5×4=20)
- Per 10 (0×4=0), Pre 9 (-1×3=-3), Cha 11 (1×3=3)
- **Total Stats: 49 points** ⚠️ **+13 points vs original (Force 8→12)**

**Affinités (COÛTS RÉVISÉS):**

- Distance 0 (0×4=0), CAC 4 (4×4=16)
- École[Électricité] 4 (4×**3**=**12**), École[Magnétique] 2 (2×**5**=**10**)
- Type[Arme] 4 (4×5=20), Type[Destruction] 3 (3×5=15), Type[Altération] 2 (2×5=10)
- **Total Affinités: 83 points** ✅ **(-8 pts vs ancien système)**

**Secondaires:**

- Vie 50 (+2×1=2), Vitesse 4 (+1×4=4), Flux 25/7/2 (+8 pts)
- **Total Secondaires: 14 points**

**Compétences:**

- Champ électromagnétique (18) + Vue quantiques (8) = **26 points**

**Équipement:**

- Épée légère (15) + Exosquelette combat (18) + 2×Kit soins (4) = **37 points**

**BASE RECALCULÉE: 49+83+14 = 146 points** (vs 154 ancien système, +18 pts stats)

---

### 6. **QUANTOTECHNOLOGUE** - TOTAL: 160 points (RÉVISÉ)

**Statistiques (base 10):**

- For 9 (-1×3=-3), Dex 10 (0×4=0), Con 11 (1×3=3), Int 14 (4×4=16)
- Per 16 (6×4=24), Pre 9 (-1×3=-3), Cha 10 (0×3=0)
- **Total Stats: 37 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 0 (0×4=0), CAC 2 (2×4=8)
- École[Bio] 4 (4×**5**=**20**), École[Feu] 2 (2×**3**=**6**)
- Type[Altération] 4 (4×5=20), Type[Amélioration] 3 (3×5=15), Type[Destruction] 2 (2×5=10)
- **Total Affinités: 79 points** ✅ **(-4 pts vs ancien système)**

**Secondaires:**

- Vie 40 (base), Vitesse 4 (+1×4=4), Flux 25/6/4 (+8 pts)
- **Total Secondaires: 12 points**

**Compétences:**

- Connaisseur arcanotechnique (12) + Scientifique (5) = **17 points**

**Équipement:**

- Bâton (5) + Tunique (0) + Kit soins (2) + Cristal mana (8) = **15 points**

**BASE RECALCULÉE: 37+79+12 = 128 points** (vs 132 ancien système)

---

### 7. **SENTINELLE** - TOTAL: 237 points (RÉVISÉ)

**Statistiques (base 10):**

- For 11 (1×3=3), Dex 16 (6×4=24), Con 13 (3×3=9), Int 11 (1×4=4)
- Per 12 (2×4=8), Pre 10 (0×3=0), Cha 8 (-2×3=-6)
- **Total Stats: 42 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 2 (2×4=8), CAC 6 (6×4=24), Arme_1_main 2 (2×4=8)
- École[Martial] 4 (4×**3**=**12**), École[Quantique] 2 (2×**7**=**14**)
- Type[Arme] 6 (6×5=30)
- **Total Affinités: 96 points** ✅ **(-4 pts vs ancien système)**

**Secondaires:**

- Vie 55 (+7×1=7), Vitesse 7 (+4×4=16), Flux 10/3/1 (+2 pts)
- **Total Secondaires: 25 points**

**Compétences:**

- Course (12) + Rôdeur (10) = **22 points**

**Équipement:**

- 2×Épée légère (30) + Exosquelette vitesse (18) + 2×Kit soins (4) = **52 points**

**BASE RECALCULÉE: 42+96+25 = 163 points** (vs 167 ancien système)

---

### 8. **SPECTRE** - TOTAL: 235 points (RÉVISÉ)

**Statistiques (base 10):**

- For 8 (-2×3=-6), Dex 14 (4×4=16), Con 9 (-1×3=-3), Int 10 (0×4=0)
- Per 11 (1×4=4), Pre 14 (4×3=12), Cha 10 (0×3=0)
- **Total Stats: 23 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 6 (6×4=24), CAC 4 (4×4=16), Sniper 2 (2×4=8)
- École[Balistique] 4 (4×**3**=**12**), École[Électricité] 2 (2×**3**=**6**), École[Quantique] 2 (2×**7**=**14**)
- Type[Arme] 6 (6×5=30), Type[Amélioration] 2 (2×5=10)
- **Total Affinités: 120 points** ✅ **(-8 pts vs ancien système)**

**Secondaires:**

- Vie 40 (base), Vitesse 5 (+2×4=8), Flux 8/3/1 (+1 pts)
- **Total Secondaires: 9 points**

**Compétences:**

- Œil d'aigle (10) + Rôdeur (10) = **20 points**

**Équipement:**

- Fusil sniper (22) + Épée courte (15) + Exo stabilisateur (20) + Kit soins (2) + Flash (4) = **63 points**

**BASE RECALCULÉE: 23+120+9 = 152 points** (vs 160 ancien système)

---

### 9. **TALISTE** - TOTAL: 183 points (RÉVISÉ)

**Statistiques (base 10):**

- For 6 (-4×3=-12), Dex 8 (-2×4=-8), Con 9 (-1×3=-3), Int 14 (4×4=16)
- Per 18 (8×4=32), Pre 10 (0×3=0), Cha 12 (2×3=6)
- **Total Stats: 31 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 2 (2×4=8), CAC 0 (0×4=0)
- École[Bio] 4 (4×**5**=**20**), École[Quantique] 3 (3×**7**=**21**)
- Type[Altération] 4 (4×5=20), Type[Amélioration] 3 (3×5=15)
- **Total Affinités: 84 points** ✅ **(+6 pts vs ancien système)**

**Secondaires:**

- Vie 35 (-3×1=-3), Vitesse 8 (+5×4=20), Flux 20/5/4 (+8 pts)
- **Total Secondaires: 25 points**

**Compétences:**

- Traque (6) + Expert terrains (8) + Compréhension nature (5) = **19 points**

**Équipement:**

- Pistolet (12) + Tenue survie (8) + 2×Kit soins (4) = **24 points**

**BASE RECALCULÉE: 31+84+25 = 140 points** (vs 134 ancien système)

---

### 10. **TECHNOLOGUE** - TOTAL: 195 points (RÉVISÉ)

**Statistiques (base 10):**

- For 9 (-1×3=-3), Dex 11 (1×4=4), Con 10 (0×3=0), Int 14 (4×4=16)
- Per 12 (2×4=8), Pre 8 (-2×3=-6), Cha 14 (4×3=12)
- **Total Stats: 31 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 2 (2×4=8), CAC 0 (0×4=0)
- École[Électricité] 4 (4×**3**=**12**)
- Type[Altération] 4 (4×5=20), Type[Amélioration] 2 (2×5=10)
- **Total Affinités: 50 points** ✅ **(-8 pts vs ancien système)**

**Secondaires:**

- Vie 30 (-5×1=-5), Vitesse 6 (+3×4=12), Flux 20/5/3 (+6 pts)
- **Total Secondaires: 13 points**

**Compétences:**

- Ingénieur (15) + Hackeur (10) = **25 points**

**Équipement:**

- Pistolet (12) + Implant neural (22) + Drone (30) + Kit soins (2) + Bombe IEM (10) = **76 points**

**BASE RECALCULÉE: 31+50+13 = 94 points** (vs 102 ancien système)

---

### 11. **TUTÉLAIRE** - TOTAL: 244 points (RÉVISÉ)

**Statistiques (base 10):**

- For 14 (4×3=12), Dex 10 (0×4=0), Con 15 (5×3=15), Int 12 (2×4=8)
- Per 9 (-1×4=-4), Pre 10 (0×3=0), Cha 13 (3×3=9)
- **Total Stats: 40 points**

**Affinités (COÛTS RÉVISÉS):**

- Distance 0 (0×4=0), CAC 6 (6×4=24)
- École[Lumière] 4 (4×**3**=**12**), École[Martial] 4 (4×**3**=**12**)
- Type[Amélioration] 5 (5×5=25), Type[Arme] 3 (3×5=15), Type[Altération] 2 (2×5=10)
- **Total Affinités: 98 points** ✅ **(-16 pts vs ancien système)**

**Secondaires:**

- Vie 75 (+18×1=18), Vitesse 4 (+1×4=4), Flux 20/5/2 (+6 pts)
- **Total Secondaires: 28 points**

**Compétences:**

- À l'affut (15) + Charismatique (12) = **27 points**

**Équipement:**

- Épée légère (15) + Armure plate (16) + Bouclier (14) + 3×Kit soins (6) = **51 points**

**BASE RECALCULÉE: 40+98+28 = 166 points** (vs 182 ancien système)

---

## 📊 Tableau Récapitulatif Final avec Coûts d'Affinités Révisés

| **Rang** | **Classe**                     | **Base Révisée** | **Compétences** | **Équipement** | **TOTAL** | **Δ vs Ancienne** |
| -------- | ------------------------------ | ---------------- | --------------- | -------------- | --------- | ------------------ |
| 1        | **Arcanotechnologue**          | 128              | 17              | 15             | **160**   | -4 ⬇️              |
| 2        | **Arcanotechnicien**           | 143              | 23              | 15             | **182**   | -10 ⬇️             |
| 3        | **Taliste**                    | 140              | 19              | 24             | **183**   | +6 ⬆️              |
| 4        | **Chasseur**                   | 116              | 23              | 47             | **186**   | -12 ⬇️             |
| 5        | **Technologue**                | 94               | 25              | 76             | **195**   | -8 ⬇️              |
| 6        | **Arcanotechnicien de combat** | 146              | 26              | 37             | **209**   | -8 ⬇️              |
| 7        | **Horion**                     | 146              | 14              | 44             | **204**   | -8 ⬇️              |
| 8        | **Spectre**                    | 152              | 20              | 63             | **235**   | -8 ⬇️              |
| 9        | **Sentinelle**                 | 163              | 22              | 52             | **237**   | -4 ⬇️              |
| 10       | **Tutélaire**                  | 166              | 27              | 51             | **244**   | -16 ⬇️             |
| 11       | **Maître d'armes**             | 163              | 43              | 40             | **246**   | -8 ⬇️              |

**Nouvelle cible suggérée : 190 points** (basée sur distribution resserrée)

---

## 🎯 Impact de la Révision des Coûts d'Affinités

### **Objectif Atteint : Classes Arcanotechnies Équilibrées ✅**

1. **Arcanotechnologue** : 160 points
2. **Arcanotechnicien** : 182 points
3. **Taliste** : 183 points

La différence entre Arcanotechnicien et Arcanotechnologue est maintenant de seulement **22 points**, montrant un meilleur équilibre.

### **Réduction Générale des Coûts**

- **Réduction moyenne** : -8 points par classe
- **Écoles standard** réduites à 3 pts/niveau (-40%)
- **Distribution resserrée** : 160-246 points (86 pts écart)
- **Classes arcanotechniques** mieux équilibrées

### **Classes Bien Équilibrées (160-195 points)**

- **Arcanotechnologue** : 160 points ⭐
- **Arcanotechnicien** : 182 points ⭐
- **Taliste** : 183 points ⭐
- **Chasseur** : 186 points ⭐
- **Technologue** : 195 points ⭐

---

## 🎯 Recommandations Finales

### **Nouvelle Cible : 190 points**

La distribution naturelle avec les nouveaux coûts suggère 190 points comme cible optimale.

### **Classes Modèles à Maintenir**

1. **Arcanotechnologue** (160) - Spécialiste recherche/soutien parfait
2. **Arcanotechnicien** (182) - Mage de combat équilibré
3. **Chasseur** (186) - Anti-mage spécialisé
4. **Technologue** (195) - High-tech viable

### **Ajustements Mineurs Requis**

- **Arcanotechnicien de combat** (209) : Acceptable comme hybride premium
- **Horion** (204) : Réduction légère nécessaire (-15-20 pts)

### **Rééquilibrage Majeur Requis**

- Classes 235+ points nécessitent réduction significative des stats de base ou équipement

---

---

## ✅ Succès de la Révision

Cette révision a réussi à :
1. **Équilibrer les classes arcanotechniques** (écart réduit de 28 à 22 points)
2. **Réduire l'écart général** entre toutes les classes (86 vs 96 points)
3. **Créer 5 classes bien équilibrées** dans la zone cible 160-195
4. **Maintenir la cohérence** des coûts d'affinités par complexité

La nouvelle structure de coûts offre un système plus équitable où le choix d'école n'avantage pas excessivement certaines classes par rapport à d'autres.

---

_Cette analyse corrigée intègre les nouveaux coûts d'affinités pour créer un système plus équilibré entre toutes les classes._
