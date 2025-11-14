# Intégration Monnaie et Point Buy

## 🎯 Objectif

Ce document établit l'intégration de la monnaie comme ressource du système de point buy, permettant aux joueurs d'échanger des points contre des crédits de départ et vice versa.

---

## 💰 Analyse du Taux de Change Points ↔ Crédits

### Méthodologie de Calcul

Basé sur l'analyse des équipements dans `equipment_costs.md`, j'ai calculé le ratio prix/points pour chaque catégorie :

#### **Ratios par Catégorie d'Équipement**

| **Catégorie** | **Ratio Moyen (Crédits/Point)** | **Échantillon** |
|---|---|---|
| **Armes légères** | 180 cr/pt | Pistolet (1500cr/12pt), Épée légère (2500cr/15pt) |
| **Armes lourdes** | 420 cr/pt | Fusil pompe (8000cr/25pt), Épée lourde (5000cr/20pt) |
| **Armures standard** | 650 cr/pt | Plate lourde (8000cr/16pt), Bouclier (2000cr/14pt) |
| **Technologie avancée** | 1100 cr/pt | Implant neural (25000cr/22pt), Drone (35000cr/30pt) |
| **Exosquelettes** | 950 cr/pt | Combat (20000cr/18pt), Stabilisateur (16000cr/20pt) |
| **Consommables** | 150 cr/pt | Kit soins (200cr/2pt), Grenade (500cr/6pt) |

#### **Calcul du Taux de Base**

**Moyenne pondérée** (en excluant technologie très avancée) :
- Armes : 300 cr/pt (40% du marché)
- Armures : 650 cr/pt (30% du marché)
- Consommables : 150 cr/pt (30% du marché)

**Taux de change recommandé : 1 point = 400 crédits**

---

## 📊 Évaluation de la Monnaie comme Statistique

### Utilité de la Monnaie dans le Jeu

**Impact Combat :** 3/5
- Permet l'achat d'équipement tactique
- Consommables donnent avantages ponctuels
- Réparations et améliorations d'équipement

**Fréquence d'Usage :** 4/5
- Achats d'équipement réguliers
- Réparations après combats
- Achat de consommables

**Polyvalence :** 5/5
- S'applique à tous les domaines (équipement, services, informations)
- Permet personnalisation du personnage
- Résout problèmes par l'achat

**Criticité :** 3/5
- Important mais alternatives existent
- Équipement de base fourni par classe
- Créativité peut remplacer l'achat

**Score Total :** (3 × 4 × 5 × 3) / 100 = **18.0**

### **Coût Monnaie de Départ**

Comparable aux statistiques secondaires :
**Coût : 1 point = 400 crédits de départ**

---

## 💳 Système d'Intégration Point Buy

### **Budget de Monnaie par Classe**

Basé sur l'équipement de départ des classes, voici le budget équivalent en crédits :

#### **Classes High-Tech (Budget élevé)**
- **Technologue** : ~60 000 crédits (implant neural + drone + équipement)
- **Quantotechnicien de combat** : ~45 000 crédits (exosquelette combat + épée légère)
- **Horion** : ~35 000 crédits (fusil mitrailleur + exosquelette + grenade)

#### **Classes Martiales (Budget moyen)**
- **Maître d'armes** : ~15 000 crédits (épée lourde + armure plate)
- **Chasseur** : ~25 000 crédits (fusil pompe + exosquelette traque)
- **Spectre** : ~30 000 crédits (fusil sniper + exosquelette stabilisateur)

#### **Classes Simples (Budget faible)**
- **Quantotechnicien** : ~1 500 crédits (bâton + tunique + consommables)
- **Tutélaire** : ~15 000 crédits (épée légère + armure plate + bouclier)
- **Sentinelle** : ~22 000 crédits (épée légère + exosquelette vitesse)

### **Monnaie de Départ Recommandée (Corrigée)**

| **Classe** | **Équipement Crédits** | **Monnaie de Départ** | **Total Budget** |
|---|---|---|---|
| **Technologue** | 24 000 | 8 000 | 32 000 |
| **Quantotechnicien de combat** | 18 000 | 12 000 | 30 000 |
| **Horion** | 14 000 | 16 000 | 30 000 |
| **Spectre** | 20 000 | 10 000 | 30 000 |
| **Chasseur** | 18 000 | 12 000 | 30 000 |
| **Sentinelle** | 14 000 | 16 000 | 30 000 |
| **Maître d'armes** | 14 000 | 16 000 | 30 000 |
| **Tutélaire** | 17 000 | 13 000 | 30 000 |
| **Quantotechnicien** | 5 000 | 25 000 | 30 000 |

---

## ⚙️ Règles d'Échange Point Buy ↔ Monnaie

### **Règle de Base**
**1 point = 400 crédits** (échange dans les deux sens)

### **Règles de Création de Personnage**

1. **Budget total ajusté à 200 points** pour inclure monnaie de départ
2. **Monnaie minimum** : Chaque classe commence avec au moins 2 000 crédits (5 points)
3. **Monnaie maximum** : Maximum 50 points convertibles en monnaie (20 000 crédits)

#### **Options d'Échange**
- **Réduction d'équipement** → Plus de monnaie de départ
- **Réduction de statistiques/affinités** → Plus de monnaie
- **Plus de monnaie** → Moins d'équipement de départ
- **Plus de monnaie** → Réduction autres caractéristiques

### **Exemples de Conversion**

#### **Quantotechnicien Riche**
- Budget : 200 points
- Statistiques : 90 points (intelligence réduite)
- Affinités : 70 points (affinités réduites)
- Compétences : 23 points
- Équipement minimal : 5 points (bâton + tunique)
- **Monnaie : 12 points → 4 800 crédits supplémentaires**
- **Total monnaie : ~30 000 crédits**

#### **Chasseur Équipé Léger**
- Budget : 200 points
- Statistiques : 110 points
- Affinités : 60 points
- Compétences : 23 points
- **Équipement réduit : 0 points (pas d'exosquelette)**
- **Monnaie : 7 points → 2 800 crédits**
- Devra acheter équipement avec monnaie de départ

---

## 🎮 Impact sur la Création de Personnage

### **Nouveaux Archétypes Possibles**

#### **Le Riche Héritier**
- Statistiques/affinités moyennes
- Équipement minimal de classe
- 15-20k crédits de départ
- Stratégie : achète équipement spécialisé selon situations

#### **Le Vétéran Équipé**
- Statistiques élevées
- Équipement maximal de classe
- Peu de monnaie de départ
- Stratégie : optimisé pour performance immédiate

#### **L'Ascète/Minimaliste**
- Statistiques très élevées
- Équipement minimal
- Beaucoup de monnaie pour situations spécialisées
- Stratégie : polyvalence par l'achat situationnel

### **Choix Tactiques**

1. **Spécialisation immédiate** (équipement maximal, peu de monnaie)
2. **Flexibilité future** (équipement réduit, monnaie pour adaptation)
3. **Équilibrage** (équipement moyen, monnaie moyenne)

---

## 🔄 Évolution en Cours de Jeu

### **Gains de Monnaie**
- **Missions réussies** : 1 000 - 5 000 crédits
- **Vente d'équipement trouvé** : prix × 0.6
- **Services rendus** : variable selon contexte
- **Découvertes** : équipement ou informations monnayables

### **Coûts Récurrents**
- **Réparations équipement** : 10-20% prix original
- **Munitions spécialisées** : 50-100 crédits par utilisation
- **Services (informations, transport)** : 500-2000 crédits
- **Amélioration équipement** : +50% prix pour +1 bonus

### **Évolution Point Buy en Campagne**
- **Gain d'expérience** : 5-10 points par niveau
- **Conversion monnaie** : possible mais avec malus (1 point = 600 crédits)
- **Investissement long terme** : équipement rare nécessite accumulation

---

## 📋 Récapitulatif des Règles

### **Taux de Change**
- **Création personnage** : 1 point = 400 crédits
- **En campagne** : 1 point = 600 crédits (conversion plus difficile)

### **Limites**
- **Minimum monnaie** : 2 000 crédits (5 points)
- **Maximum échange** : 50 points convertibles en monnaie
- **Budget total** : 200 points incluant monnaie

### **Balance Classes**
- Classes technologiques : équipement coûteux, peu de monnaie libre
- Classes martiales : équilibre équipement/monnaie
- Classes simples : équipement basique, plus de monnaie libre

---

## 🎯 Avantages du Système

1. **Flexibilité création** : personnages avec philosophies économiques différentes
2. **Choix tactiques** : spécialisation vs polyvalence
3. **Évolution naturelle** : monnaie devient importante en campagne
4. **Balance économique** : taux basé sur valeurs réelles d'équipement
5. **Roleplay enrichi** : background économique influence gameplay

---

_Ce système d'intégration crée un lien cohérent entre création de personnage et économie de jeu, tout en offrant des choix tactiques significatifs aux joueurs._