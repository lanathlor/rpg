---
title: "Affinités et types"
order: 1
tags: [École, Type, Affinité, A.École, A.Type, ReqÉcole, ReqType, ReqMixte]
---

## 🎯 Principe général

Le système d'affinité repose sur deux axes :

- **École** - la nature de l’énergie manipulée (Feu, Givre, Lumière, etc.)
- **Type** - la manière dont le Flux est converti en énergie (Destruction, Altération, etc.)

Un sort est défini par une École et un Type.
Les affinités d’un personnage déterminent **quels sorts il peut apprendre**, pas leur puissance.

---

## ⚙️ Mécanique de déblocage des sorts

Chaque personnage possède des valeurs d’affinité :

- `A.École[Nom]` → niveau d’affinité avec une école (ex: Feu, Givre, etc.)
- `A.Type[Nom]` → niveau d’affinité avec un type (ex: Destruction, Altération, etc.)

Les affinités vont de **0 à 5**.

### 🔑 Règle d'accès à un sort

Un sort est utilisable si le personnage remplit **une** des conditions suivantes :

- `(A.École ≥ ReqÉcole ET A.Type ≥ ReqType)`
- `A.École + A.Type ≥ ReqMixte`

Cela signifie qu'un Arcanotechnicien peut accéder à un sort :

- en développant **les deux affinités** requises (école ET type),
- ou en compensant par un investissement total plus élevé (spécialisation avec pénalité).

### 💰 Pénalité de spécialisation (50%)

**Les spécialistes paient un coût en affinité supplémentaire.**

Le système encourage l'équilibre entre École et Type, mais permet la spécialisation pure moyennant un investissement plus important. La formule appliquée est :

```
ReqMixte = (ReqÉcole + ReqType) × 1.5
```

**Pourquoi cette pénalité ?**

Un personnage équilibré développe ses affinités de manière naturelle et complémentaire. Un spécialiste pur doit "forcer" l'accès au sort en compensant l'absence de maîtrise de l'autre axe, ce qui demande plus d'effort et d'investissement.

**Exemple concret :**

Un sort nécessitant `École 4, Type 4` a un `ReqMixte = 12` (4+4 × 1.5)

- **Build équilibré** : École 4 + Type 4 = **8 points investis** → Accès ✅
- **Build spécialisé** : École 12 + Type 0 = **12 points investis** → Accès ✅ (mais 4 points de plus)

La spécialisation pure est viable mais moins efficiente.

### 📊 Progression standard des sorts

| Niveau de Sort | ReqÉcole | ReqType | ReqMixte | Points (équilibré) | Points (spécialisé) |
|----------------|----------|---------|----------|-------------------|---------------------|
| Niveau 1       | 2        | 2       | 6        | 4                 | 6 (+50%)           |
| Niveau 2       | 3        | 3       | 9        | 6                 | 9 (+50%)           |
| Niveau 3       | 4        | 4       | 12       | 8                 | 12 (+50%)          |
| Niveau 4       | 5        | 5       | 15       | 10                | 15 (+50%)          |
| Niveau 5       | 6        | 6       | 18       | 12                | 18 (+50%)          |

**Note importante :** Ces valeurs sont des **lignes directrices**, pas des règles absolues.

### 🎯 Sorts signature vs sorts de niche

**Le niveau d'un sort ne détermine PAS ses exigences d'affinité.**

Le "niveau" (1-5) représente la **progression au sein d'une série de sorts** (Boule de feu 1 → 5), pas son accessibilité. Les exigences dépendent du **rôle du sort dans l'archétype** :

**Sorts signature** (bas coût d'entrée) :
- Définissent l'identité de l'archétype
- Accessibles tôt pour que la classe fonctionne
- Exemple : *Boule de feu niveau 1* pour un pyromancien → école 2, type 2

**Sorts de niche** (haut coût d'entrée) :
- Techniques avancées ou spécialisées
- Réservés aux maîtres de l'école
- Exemple : *Tir surchargé niveau 2* pour un sniper → école 5, type 5

Un sort **niveau 1** peut avoir des exigences **école 8** s'il représente une technique de maître.
Un sort **niveau 5** peut avoir des exigences **école 3** s'il est une amélioration naturelle d'un sort signature.

**Principe de design :**
- Sorts **signature** : Permettent à l'archétype de fonctionner → exigences basses
- Sorts **polyvalents** : Utilisables par plusieurs archétypes → exigences moyennes
- Sorts **de niche** : Techniques avancées ou spécialisées → exigences élevées

### 🧊 Exemple

**Sort : Lance de Givre (Niveau 2)**

- École : Givre
- Type : Destruction
- Conditions : `Givre ≥ 3` ou `Destruction ≥ 3` ou `(Givre + Destruction) ≥ 9`

| Build                        | Givre | Destruction | Total | Accès ? | Coût en points |
| ---------------------------- | ----- | ----------- | ----- | ------- | -------------- |
| Cryomancien pur              | 9     | 0           | 9     | ✅      | 9 (spécialisé) |
| Destructeur pur              | 0     | 9           | 9     | ✅      | 9 (spécialisé) |
| Généraliste équilibré        | 3     | 3           | 6     | ✅      | 6 (équilibré)  |
| Hybride léger                | 4     | 2           | 6     | ✅      | 6              |
| Débutant                     | 2     | 2           | 4     | ❌      | N/A            |

Le généraliste accède au sort avec **3 points de moins** que le spécialiste pur.

---

## 🔹 Liste des Types d'Arcanotechnie

Les **Types** représentent la manière dont un Arcanotechnicien convertit le Flux en énergie.
Ils reflètent la _vitesse, la stabilité et la complexité_ de cette conversion.

---

### ⚡ Destruction

**Nature :** Décharge simple et immédiate.
**Principe :** conversion directe du Flux en énergie brute, sans structure complexe.
**Profil :** rapide, instinctif, peu exigeant mentalement.

**Caractéristiques :**

- Libération instantanée du flux arcanotechnique.
- Rendement énergétique modéré.
- Peu de contrôle, grande stabilité.

**Exemples :**
Trait de feu, Éclair, Onde de choc.

---

### 💥 Annihilation

**Nature :** Compression et libération explosive du Flux.
**Principe :** l'Arcanotechnicien concentre le Flux avant de le libérer brutalement, augmentant sa densité énergétique.
**Profil :** rapide, violent, instable.

**Caractéristiques :**

- Puissance de conversion extrême.
- Forte exigence mentale.
- Risque de retour d’énergie.

**Exemples :**
Lance quantique, Implosion lumineuse, Décharge critique.

---

### 🌋 Cataclysme

**Nature :** Accumulation lente et massive d’énergie arcanotechnique.
**Principe :** l'Arcanotechnicien canalise le Flux sur une longue durée avant sa libération.
**Profil :** lent, stable, dévastateur.

**Caractéristiques :**

- Long temps de charge.
- Effets à grande échelle.
- Endurance mentale élevée requise.

**Exemples :**
Tempête de feu, Séisme, Voile glaciaire.

---

### 🧬 Altération

**Nature :** Transformation subtile et ciblée.
**Principe :** manipulation fine du flux pour modifier une propriété physique, arcanotechnique ou biologique.
**Profil :** précis, méthodique, stable.

**Caractéristiques :**

- Effets de contrôle et de déstabilisation.
- Grande stabilité énergétique.
- Exige finesse plutôt que puissance.

**Exemples :**
Gel affaiblissant, Drain vital, Distorsion de phase.

---

### 🧠 Amélioration

**Nature :** Conversion harmonique et interne.
**Principe :** l'Arcanotechnicien réinjecte le Flux dans un système existant pour le renforcer ou le stabiliser.
**Profil :** stable, équilibré, endurant.

**Caractéristiques :**

- Effets de renforcement et de protection.
- Très faible perte énergétique.
- Synergie avec les alliés ou les artefacts.

**Exemples :**
Bénédiction, Accélération lumineuse, Renforcement kinesthésique.

---

### ⚔️ Arme

**Nature :** Canalisation d'énergie arcanotechnique à travers les armes physiques.
**Principe :** l'Arcanotechnicien infuse ses armes avec du Flux pour augmenter leur efficacité au combat.
**Profil :** tactique, polyvalent, orienté combat.

**Caractéristiques :**

- Amélioration des capacités d'armement.
- Synergie entre arcanotechnique et combat physique.
- Efficacité accrue selon l'arme utilisée.

**Exemples :**
Tir surchargé, Plombs à haute vélocité, Tir à la tête.

---

## 🧩 Résumé comparatif

| Type             | Vitesse     | Puissance   | Stabilité  | Complexité mentale | Style de conversion    |
| ---------------- | ----------- | ----------- | ---------- | ------------------ | ---------------------- |
| **Destruction**  | Très rapide | Moyenne     | Haute      | Faible             | Décharge directe       |
| **Annihilation** | Rapide      | Très élevée | Faible     | Haute              | Compression violente   |
| **Cataclysme**   | Lente       | Massive     | Moyenne    | Élevée             | Accumulation prolongée |
| **Altération**   | Moyenne     | Variable    | Très haute | Moyenne            | Transformation fine    |
| **Amélioration** | Moyenne     | Faible      | Très haute | Moyenne            | Réinjection harmonique |
| **Arme**         | Rapide      | Variable    | Haute      | Faible             | Infusion d'arme        |

---

## 🛡️ Types d'Arcanotechnie et Résistances

Le Type et l'École d'un sort déterminent **quelle résistance** s'applique contre lui. Ce n'est pas le fait qu'il soit "arcanotechnique" qui compte, mais **la nature physique de l'effet produit**.

> Pour une compréhension complète du système de résistances, consultez [Système de Résistances](07_systeme_de_resistances.md).

### Correspondances générales

| Type d'effet                      | Résistance applicable | Exemples                                    |
| --------------------------------- | --------------------- | ------------------------------------------- |
| **Projectile, impact, onde**      | RMEC                  | Projectile de roche, onde de choc           |
| **Feu, froid, lumière, foudre**   | RRAD                  | Boule de feu, rayon de givre, éclair        |
| **Drain, nécrose, corruption**    | RINT                  | Drain vital, nécrose, gel du sang           |

### Exemples par Type

**Destruction** → Principalement **RMEC** ou **RRAD** selon l'école
- Trait de feu → RRAD
- Projectile de force → RMEC
- Éclair → RRAD

**Annihilation** → Principalement **RMEC** (compression violente) ou **RRAD** (décharge)
- Lance quantique → RMEC
- Implosion lumineuse → RMEC + RRAD
- Décharge critique → RRAD

**Cataclysme** → Souvent **RMEC + RRAD** (effets à grande échelle)
- Tempête de feu → RRAD
- Séisme → RMEC
- Voile glaciaire → RRAD

**Altération** → Principalement **RINT** (transformation interne)
- Gel affaiblissant → RINT
- Drain vital → RINT
- Distorsion de phase → RINT (ou spécial)

**Amélioration** → Pas de résistance (effets bénéfiques)
- Bénédiction, accélération, renforcement → N/A

**Arme** → Dépend de l'arme infusée
- Tir surchargé → RMEC (projectile) ou RRAD (énergie)
- Lame enflammée → RMEC (tranchant) + RRAD (feu)

---

## 💡 Philosophie du système

> Le **Type** reflète la capacité mentale et physique de l'Arcanotechnicien à convertir le Flux.
> Il définit son _style énergétique_ et sa _relation au flux arcanotechnique_, pas sa puissance brute.
> Deux Arcanotechniciens de même école peuvent être radicalement différents selon leur type :
>
> - L'un décharge brutalement son énergie (Destruction)
> - L'autre l'accumule lentement (Cataclysme)
> - Un troisième la réinjecte pour renforcer (Amélioration)

**Important :** Le système d'affinités détermine **quels sorts vous pouvez apprendre**. Les résistances déterminent **combien de dégâts vous encaissez**. Ces deux systèmes sont indépendants mais complémentaires.

---
