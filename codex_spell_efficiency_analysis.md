# Analyse d'Efficacité Complète des Sorts - CODEX COMPLET

## Introduction

Ce document présente une analyse exhaustive de tous les sorts du codex (48 sorts) utilisant deux méthodes d'évaluation quantitative :

1. **Score Dégâts vs Coût (DC)** - Évalue l'efficacité pure basée sur le rapport dégâts/contraintes d'utilisation
2. **Score Dégâts vs Prérequis (DP)** - Évalue l'efficacité en tenant compte de l'accessibilité (affinités requises)

---

## 🎯 Méthodologie des Fonctions d'Évaluation

### Fonction 1 : Score Dégâts vs Coût (DC)

**Principe :** Mesure l'efficacité opérationnelle d'un sort en combat.

```
Score_DC = (Valeur_Effet × Multiplicateur_Spéciaux) / (Facteur_Flux × Facteur_Recharge × Facteur_Conditions)
```

#### Composants de Calcul :

**Valeur d'Effet :**

- Dégâts directs (moyenne des dés + bonus)
- Dégâts sur durée (DoT calculé sur durée totale)
- Valeur utilitaire (protection, mobilité, contrôle)

**Multiplicateurs Spéciaux :**

- Effets de zone (AoE) : ×1.5
- Effets de chaîne : ×1.3
- Afflictions cumulatives : ×1.2-1.8
- Combinaisons d'effets : ×1.1-1.4

**Facteurs Pénalisants :**

**🔮 Pour Sorts Arcanotechnies (flux_cost) :**

- Coût flux : 3-5 flux = ÷1.1, 6-10 flux = ÷1.3, 11-15 flux = ÷1.5, 16+ flux = ÷1.7
- Conditions INT : 16 = ÷1.1, 17 = ÷1.15, 18+ = ÷1.2

**⚔️ Pour Sorts Martiaux/Arme (recharge_time) :**

- Recharge : 30-35s = ÷1.5, 45-60s = ÷2.0, 90s+ = ÷3.0
- Pas de coût flux = bonus × 1.2 (économie de ressources)

**⚠️ Système Hybride :**

- Sorts avec flux ET recharge = doublement pénalisés

### Fonction 2 : Score Dégâts vs Prérequis (DP)

**Principe :** Mesure l'efficacité d'un sort par rapport à l'investissement en affinités nécessaire.

```
Score_DP = (Valeur_Effet × Multiplicateur_Spéciaux) / (Facteur_Affinité × Facteur_Spécialisation)
```

#### Composants de Calcul :

**Facteur d'Affinité :**

- Niveau 3 : ÷1.5
- Niveau 4 : ÷2.0
- Niveau 5 : ÷2.5
- Niveau 6 : ÷3.0
- Niveau 8+ : ÷4.0

**Facteur Spécialisation :**

- École seule : ×1.2 (spécialisation pure)
- Type seul : ×1.1 (approche technique)
- École + Type équilibrés : ×1.0
- Prérequis mixtes complexes : ×0.9

---

## 📊 ANALYSE COMPLÈTE DES SORTS DU CODEX

### DESTRUCTION (9 sorts)

#### Flammèche

- **Dégâts :** 1d4+1 (3.5 moyenne) + 25% de brûlure (2d4 = 5 sur 2 tours)
- **Prérequis :** École[feu]: 3 OU Type[destruction]: 3 OU Mixte: 4
- **Coût :** 3 flux
- **Score DC :** (3.5 + 1.25) × 1.1 / 1.1 = 4.8
- **Score DP :** (3.5 + 1.25) × 1.1 / 1.5 × 1.2 = 2.9

#### Boule de feu I

- **Dégâts :** 2d6+3 (10 moyenne) + 1d4 (2.5) AoE
- **Prérequis :** École[feu]: 4 OU Type[destruction]: 4 OU Mixte: 6
- **Coût :** 8 flux
- **Score DC :** (10 + 2.5) × 1.5 / 1.3 = 14.4
- **Score DP :** (10 + 2.5) × 1.5 / 2.0 × 1.0 = 9.4

#### Boule de feu II

- **Dégâts :** 2d8+4 (13 moyenne) + Brûlure II
- **Prérequis :** École[feu]: 5 OU Type[destruction]: 5 OU Mixte: 8
- **Coût :** 12 flux, 17 INT
- **Score DC :** (13 + 4) × 1.3 / (1.5 × 1.15) = 12.8
- **Score DP :** (13 + 4) × 1.3 / 2.5 × 1.0 = 8.8

#### Éclaire

- **Dégâts :** 1d8+2 (6.5 moyenne) + chaîne
- **Prérequis :** École[électricité]: 3 OU Type[destruction]: 3 OU Mixte: 4
- **Coût :** 6 flux
- **Score DC :** 6.5 × 1.3 / 1.2 = 7.0
- **Score DP :** 6.5 × 1.3 / 1.5 × 1.2 = 4.7

#### Colonne de flamme

- **Dégâts :** 2d8+4 (13 moyenne) ligne AoE
- **Prérequis :** École[feu]: 4 OU Type[destruction]: 4 OU Mixte: 6
- **Coût :** 10 flux
- **Recharge :** 30s
- **Score DC :** 13 × 1.5 / (1.3 × 1.5) = 10.0
- **Score DP :** 13 × 1.5 / 2.0 × 1.0 = 9.8

#### Onde de choc

- **Dégâts :** 1d8+3 (7.5 moyenne) + repousse
- **Prérequis :** École[kinesthésique]: 4 OU Type[destruction]: 4 OU Mixte: 6
- **Coût :** 8 flux
- **Score DC :** 7.5 × 1.4 / 1.3 = 8.1
- **Score DP :** 7.5 × 1.4 / 2.0 × 1.0 = 5.3

#### Poigne de force

- **Dégâts :** 1d6+2 (5.5 moyenne) + immobilise
- **Prérequis :** École[kinesthésique]: 3 OU Type[destruction]: 3 OU Mixte: 4
- **Coût :** 5 flux
- **Score DC :** 5.5 × 1.3 / 1.15 = 6.2
- **Score DP :** 5.5 × 1.3 / 1.5 × 1.2 = 4.0

#### Givre (DÉJÀ ANALYSÉ)

- **Score DC :** 6.5
- **Score DP :** 4.3

#### Javelot de glace (DÉJÀ ANALYSÉ)

- **Score DC :** 6.8
- **Score DP :** 6.5

#### Vent cinglant (DÉJÀ ANALYSÉ)

- **Score DC :** 4.2
- **Score DP :** 4.7

### ALTÉRATION (11 sorts)

#### Zap

- **Dégâts :** 1d4 (2.5 moyenne) + étourdi 1 tour
- **Prérequis :** École[électricité]: 2 OU Type[altération]: 2 OU Mixte: 3
- **Coût :** 4 flux
- **Score DC :** 2.5 × 1.5 / 1.1 = 3.4
- **Score DP :** 2.5 × 1.5 / 1.3 × 1.2 = 2.4

#### Flash

- **Effet :** Aveuglement 2 tours (valeur contrôle: 8)
- **Prérequis :** École[lumière]: 3 OU Type[altération]: 3 OU Mixte: 4
- **Coût :** 6 flux
- **Score DC :** 8 × 1.0 / 1.2 = 6.7
- **Score DP :** 8 × 1.0 / 1.5 × 1.2 = 4.4

#### Confusion

- **Effet :** Actions aléatoires 3 tours (valeur contrôle: 12)
- **Prérequis :** École[illusion]: 4 OU Type[altération]: 4 OU Mixte: 6
- **Coût :** 9 flux
- **Score DC :** 12 × 1.0 / 1.35 = 8.9
- **Score DP :** 12 × 1.0 / 2.0 × 1.0 = 6.0

#### Distorsion gravitationnelle

- **Effet :** Déplace ennemis, zone difficile (valeur contrôle: 10)
- **Prérequis :** École[gravitonique]: 5 OU Type[altération]: 5 OU Mixte: 8
- **Coût :** 12 flux
- **Score DC :** 10 × 1.4 / 1.5 = 9.3
- **Score DP :** 10 × 1.4 / 2.5 × 1.0 = 5.6

#### Brouillage

- **Effet :** Interfère électronique (valeur utilitaire: 6)
- **Prérequis :** École[électricité]: 3 OU Type[altération]: 3
- **Coût :** 5 flux
- **Score DC :** 6 × 1.0 / 1.15 = 5.2
- **Score DP :** 6 × 1.0 / 1.5 × 1.2 = 3.3

#### Assoupissement

- **Effet :** Endormissement (valeur contrôle: 10)
- **Prérequis :** École[biométabolique]: 4 OU Type[altération]: 4
- **Coût :** 8 flux
- **Score DC :** 10 × 1.0 / 1.3 = 7.7
- **Score DP :** 10 × 1.0 / 2.0 × 1.0 = 5.0

#### Marée

- **Effet :** Déplacement forcé eau (valeur contrôle: 8)
- **Prérequis :** École[hydrodynamique]: 4 OU Type[altération]: 4
- **Coût :** 7 flux
- **Score DC :** 8 × 1.3 / 1.25 = 8.3
- **Score DP :** 8 × 1.3 / 2.0 × 1.0 = 5.2

#### Void

- **Effet :** Absorption énergie quantique (valeur contrôle: 12)
- **Prérequis :** École[pure]: 5 OU Type[altération]: 5
- **Coût :** 15 flux, 18 INT
- **Score DC :** 12 × 1.0 / (1.6 × 1.2) = 6.3
- **Score DP :** 12 × 1.0 / 2.5 × 1.0 = 4.8

#### Voile d'ombre

- **Effet :** Invisibilité partielle (valeur: 8)
- **Prérequis :** École[ombre]: 3 OU Type[altération]: 3
- **Coût :** 6 flux
- **Durée :** 4 tours
- **Score DC :** 8 × 1.0 / 1.2 = 6.7
- **Score DP :** 8 × 1.0 / 1.5 × 1.2 = 4.4

#### Vol de données

- **Effet :** Extraction info (valeur utilitaire: 7)
- **Prérequis :** École[électricité]: 4 + Compétence[hackeur]
- **Coût :** 8 flux
- **Score DC :** 7 × 1.0 / 1.3 = 5.4
- **Score DP :** 7 × 1.0 / (2.0 × 0.9) = 3.9

#### Froid mordant (DÉJÀ ANALYSÉ)

- **Score DC :** 8.9
- **Score DP :** 6.7

### AMÉLIORATION (5 sorts)

#### Blink I

- **Effet :** Téléport 1d4+Vit mètres (valeur mobilité: 12)
- **Prérequis :** École[quantique]: 3 OU Type[amélioration]: 3 OU Mixte: 5
- **Coût :** 8 flux, 18 INT
- **Score DC :** 12 × 1.0 / (1.3 × 1.2) = 7.7
- **Score DP :** 12 × 1.0 / 1.5 × 1.2 = 6.7

#### Blink II

- **Effet :** Téléport 1d4+2+Vit mètres (valeur mobilité: 15)
- **Prérequis :** École[quantique]: 4 OU Type[amélioration]: 4 OU Mixte: 6
- **Coût :** 10 flux, 16 INT
- **Score DC :** 15 × 1.0 / (1.35 × 1.1) = 10.1
- **Score DP :** 15 × 1.0 / 2.0 × 1.0 = 7.5

#### Charge

- **Effet :** +4 dégâts attaque suivante (valeur: 4)
- **Prérequis :** École[kinesthésique]: 3 OU Type[amélioration]: 3
- **Coût :** 5 flux
- **Score DC :** 4 × 1.0 / 1.15 = 3.5
- **Score DP :** 4 × 1.0 / 1.5 × 1.2 = 2.2

#### Accélération temporelle

- **Effet :** +1 action par tour 3 tours (valeur: 18)
- **Prérequis :** École[chronodynamique]: 5 OU Type[amélioration]: 5
- **Coût :** 15 flux, 18 INT
- **Durée :** 3 tours
- **Score DC :** 18 × 1.0 / (1.6 × 1.2) = 9.4
- **Score DP :** 18 × 1.0 / 2.5 × 1.0 = 7.2

#### Camouflage

- **Effet :** +6 en furtivité (valeur: 6)
- **Prérequis :** École[illusion]: 3 OU Type[amélioration]: 3
- **Coût :** 6 flux
- **Durée :** 5 tours
- **Score DC :** 6 × 1.0 / 1.2 = 5.0
- **Score DP :** 6 × 1.0 / 1.5 × 1.2 = 3.3

#### Lecture des mouvements

- **Effet :** +3 esquive (valeur: 6)
- **Prérequis :** École[chronodynamique]: 4 OU Type[amélioration]: 4
- **Coût :** 8 flux
- **Durée :** 4 tours
- **Score DC :** 6 × 1.0 / 1.3 = 4.6
- **Score DP :** 6 × 1.0 / 2.0 × 1.0 = 3.0

### DÉPLACEMENT (4 sorts)

#### Roulade

- **Effet :** Déplacement 8m + esquive (valeur: 10)
- **Prérequis :** École[martial]: 3
- **Coût :** Aucun
- **Score DC :** 10 × 1.0 / 1.0 = 10.0
- **Score DP :** 10 × 1.0 / 1.5 × 1.2 = 5.6

#### Tornade

- **Effet :** Vol 4 tours (valeur: 16)
- **Prérequis :** École[aérocinétique]: 5 OU Type[déplacement]: 5
- **Coût :** 12 flux
- **Durée :** 4 tours
- **Score DC :** 16 × 1.0 / 1.5 = 10.7
- **Score DP :** 16 × 1.0 / 2.5 × 1.0 = 6.4

#### Magnétisation

- **Effet :** Adhérence surfaces métalliques (valeur: 8)
- **Prérequis :** École[magnétique]: 3 OU Type[déplacement]: 3
- **Coût :** 5 flux
- **Durée :** 5 tours
- **Score DC :** 8 × 1.0 / 1.15 = 7.0
- **Score DP :** 8 × 1.0 / 1.5 × 1.2 = 4.4

#### Un avec le froid (DÉJÀ ANALYSÉ)

- **Score DC :** 10.9
- **Score DP :** 5.0

### PROTECTION (3 sorts)

#### Bouclier de lumière solide

- **Effet :** +4 défense, -3 dégâts (valeur: 14)
- **Prérequis :** École[lumière]: 4 OU Type[amélioration]: 4 OU Mixte: 6
- **Coût :** 8 flux
- **Durée :** 5 tours
- **Score DC :** 14 × 1.0 / 1.3 = 10.8
- **Score DP :** 14 × 1.0 / 2.0 × 1.0 = 7.0

#### Annulation arcanotechnique

- **Effet :** Immunité sorts 2 tours (valeur: 16)
- **Prérequis :** École[pure]: 6 OU Type[protection]: 6
- **Coût :** 18 flux, 18 INT
- **Score DC :** 16 × 1.0 / (1.7 × 1.2) = 7.8
- **Score DP :** 16 × 1.0 / 3.0 × 1.1 = 4.8

#### Intervention

- **Effet :** Bloque une attaque sur allié (valeur: 8)
- **Prérequis :** École[martial]: 4
- **Coût :** Aucun, réaction
- **Score DC :** 8 × 1.0 / 1.0 = 8.0
- **Score DP :** 8 × 1.0 / 2.0 × 1.2 = 3.3

### ARME (16 sorts)

#### Tir surchargé ⚔️

- **Dégâts :** +3d6+6 aux dégâts d'arme (16.5 bonus moyen)
- **Prérequis :** École[balistique]: 10
- **Recharge :** 60s (système martial)
- **Score DC :** (16.5 × 1.2) / 2.0 = 9.9 ✅ CORRIGÉ
- **Score DP :** (16.5 × 1.2) / (4.0 × 1.2) = 4.1 ✅ CORRIGÉ

#### Plombs à haute vélocité

- **Dégâts :** +2d6+3 aux dégâts (10 bonus moyen)
- **Prérequis :** École[balistique]: 6
- **Recharge :** 30s
- **Score DC :** 10 × 1.0 / 1.5 = 6.7
- **Score DP :** 10 × 1.0 / 3.0 × 1.2 = 2.8

#### Tir à la tête

- **Dégâts :** +1d8+4 critique (8.5 bonus moyen)
- **Prérequis :** École[balistique]: 5
- **Recharge :** 45s
- **Score DC :** 8.5 × 1.2 / 1.75 = 5.8
- **Score DP :** 8.5 × 1.2 / 2.5 × 1.2 = 3.4

#### Fendre

- **Dégâts :** +1d6+2 tranchants (5.5 bonus moyen)
- **Prérequis :** École[martial]: 4
- **Coût :** Aucun
- **Score DC :** 5.5 × 1.0 / 1.0 = 5.5
- **Score DP :** 5.5 × 1.0 / 2.0 × 1.2 = 2.3

#### Lame de foudre

- **Dégâts :** +2d4 électricité (5 bonus moyen)
- **Prérequis :** École[électricité]: 4 + arme conductrice
- **Coût :** 6 flux
- **Score DC :** 5 × 1.0 / 1.2 = 4.2
- **Score DP :** 5 × 1.0 / (2.0 × 0.9) = 2.8

#### Attaque de force

- **Dégâts :** +1d8+3 kinesthésique (7.5 bonus moyen)
- **Prérequis :** École[kinesthésique]: 5
- **Coût :** 8 flux
- **Score DC :** 7.5 × 1.0 / 1.3 = 5.8
- **Score DP :** 7.5 × 1.0 / 2.5 × 1.2 = 2.5

#### Lame fantôme quantique

- **Dégâts :** +2d6 (7 bonus moyen) ignore armure
- **Prérequis :** École[quantique]: 6
- **Coût :** 12 flux
- **Score DC :** 7 × 1.3 / 1.5 = 6.1
- **Score DP :** 7 × 1.3 / 3.0 × 1.2 = 2.5

#### Attaque multiple

- **Effet :** 2 attaques supplémentaires -2 (valeur: 12)
- **Prérequis :** École[martial]: 6
- **Coût :** Aucun
- **Score DC :** 12 × 1.0 / 1.0 = 12.0
- **Score DP :** 12 × 1.0 / 3.0 × 1.2 = 3.3

#### Tir de barrage ⚔️

- **Dégâts :** +4d4+2 aux dégâts (12 bonus moyen) + AoE 3×3m
- **Prérequis :** École[balistique]: 6
- **Recharge :** 35s (système martial)
- **Score DC :** (12 × 1.5 × 1.2) / 1.5 = 14.4 ✅ CORRIGÉ
- **Score DP :** (12 × 1.5 × 1.2) / (3.0 × 1.2) = 6.0 ✅ CORRIGÉ

#### Cartouche shrapnel augmentée

- **Dégâts :** +3d4 AoE (7.5 bonus moyen)
- **Prérequis :** École[balistique]: 5 + munition spéciale
- **Score DC :** 7.5 × 1.5 / 1.0 = 11.3
- **Score DP :** 7.5 × 1.5 / (2.5 × 0.9) = 5.0

#### Charge statique

- **Effet :** +1d6 électrique + arc (4.5 bonus + chaîne)
- **Prérequis :** École[électricité]: 3 + arme conductrice
- **Coût :** 4 flux
- **Score DC :** (4.5 × 1.3) / 1.1 = 5.3
- **Score DP :** (4.5 × 1.3) / (1.5 × 0.9) = 4.3

#### Attaque des points sensibles

- **Dégâts :** +1d4+1 + vulnérabilité (3.5 bonus + effet)
- **Prérequis :** École[martial]: 5
- **Score DC :** 3.5 × 1.4 / 1.0 = 4.9
- **Score DP :** 3.5 × 1.4 / 2.5 × 1.2 = 1.6

#### Lame fantôme

- **Dégâts :** +1d6 (3.5 bonus moyen) ignore défense
- **Prérequis :** École[ombre]: 4
- **Coût :** 6 flux
- **Score DC :** 3.5 × 1.2 / 1.2 = 3.5
- **Score DP :** 3.5 × 1.2 / 2.0 × 1.2 = 1.8

### AFFLICTION (3 sorts)

#### Drain vital

- **Dégâts :** 1d6+2 (5.5 moyenne) + récupère PV
- **Prérequis :** École[biométabolique]: 4 OU Type[affliction]: 4
- **Coût :** 8 flux
- **Score DC :** 5.5 × 1.4 / 1.3 = 5.9
- **Score DP :** 5.5 × 1.4 / 2.0 × 1.0 = 3.9

#### Brûlure (effet passif)

- **Dégâts :** 1d4 par tour selon niveau
- **Effet automatique des sorts de feu**

#### Gelure (DÉJÀ ANALYSÉ - effet passif)

---

## 📈 TABLEAU RÉCAPITULATIF COMPLET - TOUS LES SORTS DU CODEX

| Rang | Sort                      | École           | Type         | Dégâts     | Effet             | Score DC    | Score DP   | Catégorie  |
| ---- | ------------------------- | --------------- | ------------ | ---------- | ----------------- | ----------- | ---------- | ---------- |
| 1    | **Tir de barrage** ⚔️     | Balistique      | Arme         | 12 AoE     | +4d4+2 AoE        | **14.4** ✅ | **6.0** ✅ | Combat AoE |
| 2    | **Boule de feu I** 🔮     | Feu             | Destruction  | 10+2.5 AoE | Zone explosion    | **14.4**    | **9.4**    | Combat AoE |
| 3    | **Boule de feu II**       | Feu             | Destruction  | 13         | Brûlure II        | **12.8**    | 8.8        | Combat     |
| 4    | **Attaque multiple**      | Martial         | Arme         | 12         | 2 attaques supp.  | **12.0**    | 3.3        | Combat     |
| 5    | **Cartouche shrapnel**    | Balistique      | Arme         | 7.5 AoE    | Munition spé.     | **11.3**    | 5.0        | Combat AoE |
| 6    | **Un avec le froid**      | Givre           | Déplacement  | 0          | Téléport 20m      | **10.9**    | 5.0        | Mobilité   |
| 7    | **Bouclier lumière**      | Lumière         | Protection   | 14         | +4 Déf, -3 dég    | **10.8**    | **7.0**    | Protection |
| 8    | **Tornade**               | Aérocinétique   | Déplacement  | 0          | Vol 4 tours       | **10.7**    | 6.4        | Mobilité   |
| 9    | **Blink II**              | Quantique       | Amélioration | 15         | Téléport amélioré | **10.1**    | **7.5**    | Mobilité   |
| 10   | **Colonne de flamme**     | Feu             | Destruction  | 13 AoE     | Ligne de feu      | **10.0**    | **9.8**    | Combat AoE |
| 11   | **Roulade**               | Martial         | Déplacement  | 10         | Dépl + esquive    | **10.0**    | 5.6        | Mobilité   |
| 12   | **Accélération temp.**    | Chronodynamique | Amélioration | 18         | +1 action/tour    | **9.4**     | **7.2**    | Buff       |
| 13   | **Distorsion grav.**      | Gravitonique    | Altération   | 10         | Déplace ennemis   | **9.3**     | 5.6        | Contrôle   |
| 14   | **Confusion**             | Illusion        | Altération   | 12         | Actions aléat.    | **8.9**     | 6.0        | Contrôle   |
| 15   | **Froid mordant**         | Givre           | Altération   | 8          | 4× Gelure         | **8.9**     | 6.7        | Contrôle   |
| 16   | **Marée**                 | Hydrodynamique  | Altération   | 8          | Dépl. forcé eau   | **8.3**     | 5.2        | Contrôle   |
| 8    | **Tir surchargé** ⚔️      | Balistique      | Arme         | 16.5       | +3d6+6 dégâts     | **9.9** ✅  | **4.1** ✅ | Combat     |
| 18   | **Onde de choc**          | Kinesthésique   | Destruction  | 7.5        | Repousse          | **8.1**     | 5.3        | Combat     |
| 19   | **Intervention**          | Martial         | Protection   | 8          | Bloque attaque    | **8.0**     | 3.3        | Protection |
| 20   | **Annulation quant.**     | Pure            | Protection   | 16         | Immunité sorts    | **7.8**     | 4.8        | Protection |
| 21   | **Assoupissement**        | Biométabolique  | Altération   | 10         | Endormissement    | **7.7**     | 5.0        | Contrôle   |
| 22   | **Blink I**               | Quantique       | Amélioration | 12         | Téléport base     | **7.7**     | 6.7        | Mobilité   |
| 23   | **Magnétisation**         | Magnétique      | Déplacement  | 8          | Adhér. métal      | **7.0**     | 4.4        | Mobilité   |
| 24   | **Éclaire**               | Électricité     | Destruction  | 6.5        | Chaîne élec       | **7.0**     | 4.7        | Combat     |
| 25   | **Flash**                 | Lumière         | Altération   | 8          | Aveuglement       | **6.7**     | 4.4        | Contrôle   |
| 26   | **Voile d'ombre**         | Ombre           | Altération   | 8          | Invisibilité      | **6.7**     | 4.4        | Furtivité  |
| 27   | **Plombs haute vél.**     | Balistique      | Arme         | 10         | +2d6+3 dégâts     | **6.7**     | 2.8        | Combat     |
| 28   | **Javelot de glace**      | Givre           | Destruction  | 17         | 1× Gelure         | **6.8**     | 6.5        | Combat     |
| 29   | **Givre**                 | Givre           | Destruction  | 6.5        | Maintien gel.     | **6.5**     | 4.3        | Combat     |
| 30   | **Void**                  | Pure            | Altération   | 12         | Absorbe énergie   | **6.3**     | 4.8        | Contrôle   |
| 31   | **Poigne de force**       | Kinesthésique   | Destruction  | 5.5        | Immobilise        | **6.2**     | 4.0        | Contrôle   |
| 32   | **Lame fantôme quant.**   | Quantique       | Arme         | 7          | Ignore armure     | **6.1**     | 2.5        | Combat     |
| 33   | **Drain vital**           | Biométabolique  | Affliction   | 5.5        | Récup. PV         | **5.9**     | 3.9        | Combat     |
| 34   | **Tir à la tête**         | Balistique      | Arme         | 8.5        | Critique          | **5.8**     | 3.4        | Combat     |
| 35   | **Attaque de force**      | Kinesthésique   | Arme         | 7.5        | +1d8+3 kinés.     | **5.8**     | 2.5        | Combat     |
| 36   | **Fendre**                | Martial         | Arme         | 5.5        | +1d6+2 tranch.    | **5.5**     | 2.3        | Combat     |
| 37   | **Vol de données**        | Électricité     | Altération   | 7          | Extract. info     | **5.4**     | 3.9        | Utilitaire |
| 38   | **Charge statique**       | Électricité     | Arme         | 4.5        | Arc électrique    | **5.3**     | 4.3        | Combat     |
| 39   | **Brouillage**            | Électricité     | Altération   | 6          | Interfér. élec.   | **5.2**     | 3.3        | Utilitaire |
| 40   | **Camouflage**            | Illusion        | Amélioration | 6          | +6 furtivité      | **5.0**     | 3.3        | Furtivité  |
| 41   | **Attaque pts sensibles** | Martial         | Arme         | 3.5        | Vulnérabilité     | **4.9**     | 1.6        | Combat     |
| 42   | **Flammèche**             | Feu             | Destruction  | 3.5        | 25% brûlure       | **4.8**     | 2.9        | Combat     |
| 43   | **Lecture mouvements**    | Chronodynamique | Amélioration | 6          | +3 esquive        | **4.6**     | 3.0        | Défense    |
| 44   | **Lame de foudre**        | Électricité     | Arme         | 5          | +2d4 élec.        | **4.2**     | 2.8        | Combat     |
| 45   | **Vent cinglant**         | Givre           | Destruction  | 11         | 2× Gel. + AoE     | **4.2**     | 4.7        | Combat AoE |
| 46   | **Charge**                | Kinesthésique   | Amélioration | 4          | +4 dég. suiv.     | **3.5**     | 2.2        | Buff       |
| 47   | **Lame fantôme**          | Ombre           | Arme         | 3.5        | Ignore défense    | **3.5**     | 1.8        | Combat     |
| 48   | **Zap**                   | Électricité     | Altération   | 2.5        | Étourdit 1 tour   | **3.4**     | 2.4        | Contrôle   |

---

## 🚨 CORRECTIONS CRITIQUES APPLIQUÉES : SYSTÈME FLUX vs RECHARGE

### 🛠️ PATCH 1 : Double Pénalité Éliminée

**Problème découvert :** Certains sorts arcanotechniques avaient `flux_cost` ET `recharge_time`, les pénalisant doublement !

**Sorts corrigés :**

- ✅ **Vent cinglant** : flux_cost: 10 (supprimé recharge: 50s)
- ✅ **Javelot de glace** : flux_cost: 8 (supprimé recharge: 40s)
- ✅ **Givre** : flux_cost: 4 (supprimé recharge: instantané)
- ✅ **Froid mordant** : flux_cost: 6 (supprimé recharge: 20s)
- ✅ **Un avec le froid** : flux_cost: 5 (supprimé recharge: instantané)

### 📈 Impact Dramatique sur les Scores

Ces corrections **révolutionnent** les classements car ces sorts n'étaient plus doublement pénalisés :

**Nouveaux Scores Vent cinglant :**

- **AVANT** : (11 × 1.5) / (1.35 × 3.0 × 1.2) = 3.4 DC (rang 45)
- **APRÈS** : (11 × 1.5) / (1.35 × 1.2) = **10.2** DC ✅ (nouveau rang 7)

**Nouveaux Scores Javelot de glace :**

- **AVANT** : (17 × 1.2) / (1.3 × 2.5 × 1.1) = 5.7 DC
- **APRÈS** : (17 × 1.2) / (1.3 × 1.1) = **14.2** DC ✅ (podium)

**Nouveaux Scores Givre :**

- **AVANT** : (6.5 × 1.2) / (1.1 × 1.0 × 1.1) = 6.5 DC
- **APRÈS** : (6.5 × 1.2) / (1.1 × 1.1) = **6.5** DC (pas d'impact recharge instantané)

**Nouveaux Scores Froid mordant :**

- **AVANT** : (8 × 2.0) / (1.2 × 1.5 × 1.1) = 8.1 DC
- **APRÈS** : (8 × 2.0) / (1.2 × 1.1) = **12.1** DC ✅ (top 5)

**Nouveaux Scores Un avec le froid :**

- **AVANT** : (12 × 0.8) / (1.15 × 1.0) = 8.3 DC
- **APRÈS** : (12 × 0.8) / 1.15 = **8.3** DC (pas d'impact recharge instantané)

---

## 🚨 CORRECTION CRITIQUE : SYSTÈME FLUX vs RECHARGE

### Découverte d'Incohérence Système

L'analyse initiale contenait une **erreur méthodologique majeure** : confusion entre deux systèmes de coûts distincts :

- **🔮 Sorts Arcanotechnies** → Utilisent `flux_cost` (mana)
- **⚔️ Sorts Martiaux/Arme** → Utilisent `recharge_time` (cooldown)

### Impact sur les Classements

Cette correction modifie significativement les scores des sorts martiaux qui bénéficient du bonus "pas de flux" (×1.2) :

**Nouvelles Positions :**

- **Tir de barrage** : 12.9 → **14.4** (égalité rang 1)
- **Tir surchargé** : 8.3 → **9.9** (rang 17 → rang 8)
- Tous les sorts martiaux remontent dans le classement

### Révélation Système

Les **sorts martiaux gratuits** (pas de flux) sont **drastiquement sous-évalués** dans l'analyse standard. Le système récompense en fait la spécialisation martiale pure !

---

## 🎯 ANALYSES ET RÉVÉLATIONS MAJEURES (CORRIGÉES)

### Top 5 Sorts les Plus Efficaces (Score DC) ✅ TRIPLE CORRIGÉ

1. **Tir de barrage** ⚔️ (14.4) - AoE martial sans flux
2. **Boule de feu I** 🔮 (14.4) - AoE arcanotechnique (égalité)
3. **Javelot de glace** 🔮 (14.2) - ✅ NOUVEAU PODIUM (était rang ~25)
4. **Boule de feu II** 🔮 (12.8) - Évolution naturelle puissante
5. **Froid mordant** 🔮 (12.1) - ✅ NOUVEAU TOP 5 (était rang 15)

### 🎯 Sorts Massivement Réévalués Post-Patch :

- **Vent cinglant** : 3.4 → **10.2** DC (+200%!) 🚀
- **Javelot de glace** : 6.8 → **14.2** DC (+109%!) 🚀
- **Froid mordant** : 8.9 → **12.1** DC (+36%!) 🚀

### Top 5 Sorts les Plus Accessibles (Score DP)

1. **Colonne de flamme** (9.8) - AoE en ligne très accessible
2. **Boule de feu I** (9.4) - Excellent équilibre
3. **Boule de feu II** (8.8) - Puissance vs investissement optimal
4. **Blink II** (7.5) - Mobilité quantique avancée
5. **Accélération temporelle** (7.2) - Buff chronodynamique

### Découvertes Surprenantes

#### **Domination du Feu**

L'école de feu monopolise le podium avec Boule de feu I & II. Les dégâts AoE combinés à des prérequis raisonnables en font l'école la plus efficace.

#### **Efficacité Martiale Sous-Estimée**

- **Attaque multiple** (rang 4) dépasse de nombreux sorts arcanotechniques
- **Roulade** (score DC parfait 10.0) sans coût de flux
- **Intervention** offre une protection gratuite

#### **Déséquilibres Flagrants**

- **Vent cinglant** (rang 45) est dramatiquement sous-optimisé
- **Zap** (rang 48) quasi-inutile malgré sa simplicité
- Les sorts d'arme balistique haut niveau sous-performent

#### **École Pure = Piège à Noobs**

Malgré leurs effets impressionnants, **Void** et **Annulation arcanotechnique** sont handicapés par des prérequis prohibitifs.

### Méta-Game Révélé

#### **Build Optimal "Pyromancien AoE"**

1. Spécialiser Feu 4-5 + Destruction 4-5
2. Spam **Boule de feu I** en début de partie
3. Évoluer vers **Boule de feu II** + **Colonne de flamme**
4. Domination absolue du champ de bataille

#### **Build "Guerrier Quantique"**

1. Base martiale avec **Attaque multiple** + **Roulade**
2. Complément **Blink II** pour mobilité
3. **Intervention** pour protection d'équipe
4. Polyvalence combat rapproché/mobilité

#### **Anti-Build : Spécialiste Pur**

Les écoles Pure, Chronodynamique (hors Accélération) et haute Balistique sont des **pièges d'optimisation**.

---

## 🔧 RECOMMANDATIONS D'ÉQUILIBRAGE CRITIQUES

### Ajustements Urgents

#### **Vent cinglant** - Catastrophe d'équilibrage

- **Problème** : Rang 45/48 malgré prérequis niveau 6
- **Solution** : Réduire recharge 50s → 25s OU augmenter dégâts 1d12+1d8 → 2d12+1d8

#### **École Pure** - Piège à investissement

- **Problème** : ROI désastreux malgré effets puissants
- **Solution** : Réduire tous les prérequis Pure de -1 niveau

#### **Sorts Balistiques** - Rendements décroissants

- **Problème** : Plus l'investissement augmente, moins c'est efficace
- **Solution** : **Tir surchargé** devrait être rang 10-15, pas 17

### Nouvelles Créations Suggérées

#### **Sort Feu Niveau 3** (combler le gap)

- **"Embrasement"** : 1d8+3 + 50% brûlure, École[feu]: 3, 5 flux
- **Score théorique** : DC ≈ 7.5, DP ≈ 5.0

#### **Sort Pure Accessible**

- **"Dissipation"** : Retire 1 effet magique, École[pure]: 3, 4 flux
- **Rôle** : Utilitaire anti-magie accessible

---

## 💎 CONCLUSION

Cette analyse révèle un système avec des **déséquilibres majeurs** mais une **base solide**. L'école de Feu domine grâce à ses AoE efficaces, tandis que l'approche martiale offre une alternative viable. Les sorts utilitaires souffrent d'un manque de métrique d'évaluation adaptée, mais **Blink II** et **Accélération temporelle** montrent qu'ils peuvent être compétitifs.

Le système récompense la **spécialisation précoce** en Feu/Destruction ou Martial, pénalise les **approches pures** tardives, et nécessite un **rééquilibrage** de plusieurs sorts clés pour offrir une véritable diversité stratégique.
