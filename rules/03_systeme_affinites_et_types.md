# Système d'affinités magiques

## 🎯 Principe général

Le système d'affinité repose sur deux axes :

- **École** — la nature de l’énergie manipulée (Feu, Givre, Lumière, etc.)
- **Type** — la manière dont le mana est transformé en énergie (Destruction, Altération, etc.)

Un sort est défini par une École et un Type.
Les affinités d’un personnage déterminent **quels sorts il peut apprendre**, pas leur puissance.

---

## ⚙️ Mécanique de déblocage des sorts

Chaque personnage possède des valeurs d’affinité :

- `A.École[Nom]` → niveau d’affinité avec une école (ex: Feu, Givre, etc.)
- `A.Type[Nom]` → niveau d’affinité avec un type (ex: Destruction, Altération, etc.)

Les affinités vont de **0 à 5**.

### 🔑 Règle d’accès à un sort

Un sort est utilisable si le personnage remplit **au moins une** des conditions suivantes :

- `A.École ≥ ReqÉcole`
- `A.Type ≥ ReqType`
- `A.École + A.Type ≥ ReqMixte`

Cela signifie qu’un mage peut accéder à un sort :

- en se spécialisant dans une **école** (ex : Givre pur),
- en se spécialisant dans un **type** (ex : Destruction pur),
- ou en répartissant ses affinités sur les deux (ex : un peu Givre + un peu Destruction).

### 🧊 Exemple

**Sort : Lance de Givre**

- École : Givre
- Type : Destruction
- Conditions : `Givre ≥ 3` ou `Destruction ≥ 3` ou `(Givre + Destruction) ≥ 4`

| Build            | Givre | Destruction | Accès ? | Commentaire                   |
| ---------------- | ----- | ----------- | ------- | ----------------------------- |
| Cryomancien pur  | 4     | 0           | ✅      | Spécialiste d’école           |
| Mage destructeur | 0     | 4           | ✅      | Spécialiste de type           |
| Généraliste      | 2     | 2           | ✅      | Mixte équilibré               |
| Débutant         | 1     | 1           | ❌      | Pas assez d’affinité combinée |

---

## 🔹 Liste des Types de Magie

Les **Types** représentent la manière dont un mage transforme le mana en énergie.
Ils reflètent la _vitesse, la stabilité et la complexité_ de cette conversion.

---

### ⚡ Destruction

**Nature :** Décharge simple et immédiate.
**Principe :** conversion directe du mana en énergie brute, sans structure complexe.
**Profil :** rapide, instinctif, peu exigeant mentalement.

**Caractéristiques :**

- Libération instantanée du flux magique.
- Rendement énergétique modéré.
- Peu de contrôle, grande stabilité.

**Exemples :**
Trait de feu, Éclair, Onde de choc.

---

### 💥 Annihilation

**Nature :** Compression et libération explosive du mana.
**Principe :** le mage concentre le flux avant de le libérer brutalement, augmentant sa densité énergétique.
**Profil :** rapide, violent, instable.

**Caractéristiques :**

- Puissance de conversion extrême.
- Forte exigence mentale.
- Risque de retour d’énergie.

**Exemples :**
Lance arcanique, Implosion lumineuse, Décharge critique.

---

### 🌋 Cataclysme

**Nature :** Accumulation lente et massive d’énergie magique.
**Principe :** le mage canalise le mana sur une longue durée avant sa libération.
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
**Principe :** manipulation fine du flux pour modifier une propriété physique, magique ou biologique.
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
**Principe :** le mage réinjecte le mana dans un système existant pour le renforcer ou le stabiliser.
**Profil :** stable, équilibré, endurant.

**Caractéristiques :**

- Effets de renforcement et de protection.
- Très faible perte énergétique.
- Synergie avec les alliés ou les artefacts.

**Exemples :**
Bénédiction, Accélération lumineuse, Renforcement kinesthésique.

---

### ⚔️ Arme

**Nature :** Canalisation d'énergie magique à travers les armes physiques.
**Principe :** le mage infuse ses armes avec du mana pour augmenter leur efficacité au combat.
**Profil :** tactique, polyvalent, orienté combat.

**Caractéristiques :**

- Amélioration des capacités d'armement.
- Synergie entre magie et combat physique.
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

## 💡 Philosophie du système

> Le **Type** reflète la capacité mentale et physique du mage à transformer le mana.
> Il définit son _style énergétique_ et sa _relation au flux magique_, pas sa puissance brute.
> Deux mages de même école peuvent être radicalement différents selon leur type :
>
> - L’un décharge brutalement son énergie (Destruction)
> - L’autre l’accumule lentement (Cataclysme)
> - Un troisième la réinjecte pour renforcer (Amélioration)

---
