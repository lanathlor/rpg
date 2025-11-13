# Système de Mana et Conversion du Flux

La magie dans cet univers repose sur la manipulation d’une énergie fondamentale : le **Flux**.
Chaque sort, chaque effet magique et chaque altération reposent sur la capacité d’un personnage à **mobiliser**, **convertir**, puis **stabiliser** cette énergie.

Ce document décrit le fonctionnement complet de cette ressource.

---

# 1. Réserve de Flux

La **Réserve de Flux** est la quantité maximale d’énergie magique qu’un personnage peut contenir à un instant donné.

- Elle représente la capacité du corps et du système nerveux à supporter la pression énergétique.
- Lorsqu’elle tombe à 0, un personnage ne peut plus lancer de sorts tant qu’il n’a pas récupéré.

**Notation :**

```
Réserve de Flux = énergie magique maximale du personnage
```

Chaque sort possède un **coût en Flux**.

---

# 2. Afflux par Tour

L’**Afflux par Tour** est la quantité de flux qu’un personnage peut mobiliser ou convertir en énergie utilisable pendant un tour de 6 secondes.

C’est la mesure la plus importante du lanceur de sorts :
elle détermine **à quelle vitesse** il peut préparer un sort.

**Notation :**

```
Afflux par Tour = quantité de flux mobilisable chaque tour
```

### Exemple de sort nécessitant concentration :

- Un sort coûte **12** points de flux.
- Le personnage possède un Afflux par Tour de **5**.

Concentration :

- Tour 1 : 5/12
- Tour 2 : 10/12
- Tour 3 : 12/12 → le sort est prêt au début du tour.

### ⚡ Sorts instantanés

**Si l'Afflux par Tour ≥ Coût du sort**, le sort est lancé **immédiatement** le même tour.

**Exemple :**
- Un sort coûte **4** points de flux.
- Le personnage possède un Afflux par Tour de **6**.
- **Résultat :** Le sort se déclenche instantanément sans concentration.

---

# 3. Récupération Naturelle

Chaque tour, un personnage regagne automatiquement une petite quantité de flux.

**Notation :**

```
Récupération Naturelle = flux regagné automatiquement à la fin du tour
```

Elle représente :

- la respiration magique,
- l’équilibrage naturel des flux internes,
- la resynchronisation avec l’environnement.

La récupération ne peut jamais dépasser la Réserve de Flux maximale.

---

# 4. Lancer un sort

Pour lancer un sort, un personnage doit :

1. **Mobiliser suffisamment de flux** (en plusieurs tours si nécessaire)
2. **Atteindre le coût du sort**
3. **Déclencher l'effet**

**Règles de déclenchement :**

- **Si Afflux par Tour ≥ Coût du sort** → Sort **instantané** (même tour)
- **Si Afflux par Tour < Coût du sort** → **Concentration requise** (plusieurs tours)

**Formule :**

```
Flux accumulé ≥ Coût du sort → Incantation réussie
```

### 4.1. Concentration interrompue

La concentration se brise si un personnage :

- subit des dégâts,
- est contrôlé,
- effectue une action majeure,
- ou doit se déplacer sous pression.

En cas d’interruption, le personnage perd **la moitié du flux accumulé**, arrondi à l’inférieur.

---

# 5. Instabilité du Flux (Surcharge)

Lorsque le flux manipulé dépasse les capacités naturelles du mage, une **Instabilité du Flux** apparaît.
Cela survient lorsque :

- le personnage dépasse son Afflux par Tour,
- ou enchaîne plusieurs sorts lourds sans temps de stabilisation.

### Effets possibles :

- −1 à l’Intelligence pendant 1 tour
- Perte de 1d4 points de Réserve de Flux
- Sort annulé
- Dégâts internes (1d6)
- Pulse magique mineur (effet RP décidé par le MJ)

La surcharge n’est jamais mortelle, mais elle limite l’abus de sorts lourds.

---

# 6. Conversion du Flux et Écoles / Types

### 6.1. Écoles et Types

Chaque sort appartient :

- à une **École** (Feu, Givre, Lumière, Ombre, etc.)
- et à un **Type** (Destruction, Annihilation, Cataclysme, Altération, Amélioration)

Ces éléments ne modifient **pas** le coût en flux, mais influencent :

- la difficulté de stabilisation,
- les risques de surcharge,
- et les affinités nécessaires pour débloquer le sort.

### 6.2. Conditions d'accès

Un sort est accessible si :

- l’affinité d’École est suffisante,
- **ou** l’affinité de Type,
- **ou** une combinaison des deux.

Voir le fichier : `03_systeme_affinites_et_types.md`.

---

# 7. Interaction avec le combat

### Timing de déclenchement :
- **Sorts instantanés** (Coût ≤ Afflux par Tour) → Se déclenchent **immédiatement** dans le tour
- **Sorts nécessitant concentration** → Se déclenchent **au début du tour où le coût est atteint**

### Vulnérabilités :
- Les ennemis peuvent **interrompre la concentration** (dégâts, contrôle, déplacement forcé)
- Les sorts longs créent une tension tactique : le mage doit être protégé
- Seuls les sorts nécessitant concentration sont vulnérables à l'interruption

Le système rend la magie puissante mais vulnérable au timing et au positionnement.

---

# 8. Récupération hors combat

Hors combat, un personnage récupère l’intégralité de sa Réserve de Flux via :

- 10 minutes de méditation,
- ou 1 minute avec un **Cristal de Flux**.

---

# 9. Résumé rapide

| Élément                | Nom                     | Rôle                                          |
| ---------------------- | ----------------------- | --------------------------------------------- |
| Réserve de Flux        | Capacité maximale       | Détermine le total de magie disponible        |
| Afflux par Tour        | Vitesse de mobilisation | Détermine la vitesse de préparation d’un sort |
| Récupération Naturelle | Regain automatique      | Permet de maintenir le rythme magique         |
| Instabilité du Flux    | Surcharge               | Limite l’abus de sorts lourds                 |
| Coût du sort           | —                       | Flux à atteindre pour lancer un sort          |

---

# 10. Philosophie du système

Le Flux n’est pas un simple nombre, mais une **dynamique énergétique**.
Ce système met l’accent sur :

- la **préparation**,
- la **gestion du risque**,
- la **conversion physique ou élémentaire**,
- la **surcharge**,
- et le **timing tactique**.

Un mage puissant n’est pas celui qui a le plus de flux,
mais celui qui sait **le convertir au bon moment**.

---
