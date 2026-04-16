---
title: "Defense and Resistances"
order: 4
tags: [Defense Score, Defense]
---

The defense system relies on two fixed values:

-   the **Defense Score (DS)**: determines whether an attack hits.
-   the **Resistances**: reduce damage once the attack succeeds.

> For a complete understanding of the resistance system, see [Resistance System](07_systeme_de_resistances.md).

### 1. Defense Score (DS)

The Defense Score represents the **difficulty of hitting a target**.
It depends on the type of attack received and the corresponding defense statistic.

#### General Formula

```
DS = 10 + (defense stat / 2) + armor bonus
```

| Attack Type                      | Defense Stat Used                   | Example of Influential Equipment                  |
| -------------------------------- | ----------------------------------- | ------------------------------------------------- |
| **Heavy attack / 2-handed**      | Strength (STR)                      | Heavy armor, shield                               |
| **Light attack / 1-handed**      | Dexterity (DEX)                     | Medium armor, light exoskeleton                   |
| **Ranged attack**                | Precision (PRE) or Perception (PER) | Medium armor, cover                               |
| **Arcanotechnological attack**   | Intelligence (INT)                  | Arcanotechnological armor, quantum resistances    |

The attacker must achieve a result **>= the target's DS** for their attack to hit.
Armor bonuses, shields, and cover are added to the final value.

---

### 2. Resistances

Once the attack succeeds, **Resistances** determine **how much damage is absorbed** before reaching hit points.

There are **three types of resistances** based on the physical nature of the attack:

#### The Three Resistances

| Resistance                 | Abbreviation | Covers                                         | Examples                                |
| -------------------------- | ------------ | ---------------------------------------------- | --------------------------------------- |
| **Mechanical Resistance**  | RMEC         | Impact, perforation, pressure, shockwave       | Sword, bullet, rock projectile          |
| **Radiative Resistance**   | RRAD         | Heat, cold, light, external electricity        | Fire, laser, lightning, surface frost   |
| **Internal Resistance**    | RINT         | Flux alteration, internal combustion/freezing   | Necrosis, life drain, corruption        |

#### General Formula

```
Resistance = armor bonus + (secondary stat / 4) + special bonuses
```

> The secondary statistic and bonuses depend on the resistance type and equipment.

| Resistance | Primary Secondary Stat | Typical Bonus Sources                           |
| ---------- | ---------------------- | ----------------------------------------------- |
| **RMEC**   | Strength (STR)         | Heavy armor, exoskeleton, shield                |
| **RRAD**   | Constitution (CON)     | Insulating suit, energy shield                  |
| **RINT**   | Intelligence (INT)     | Flux stability, rare implants, meditation       |

#### Application

When an attack succeeds:

```
Final Damage = Raw Damage - Applicable Resistance
```

**Important:** It is not the source of the attack that determines the resistance, but **its physical nature**.

-   An arcanotechnological fireball -> **RRAD** (heat)
-   An arcanotechnological rock projectile -> **RMEC** (impact)
-   An arcanotechnological necrosis -> **RINT** (internal alteration)

Damage can never be reduced below 0.
Some mixed attacks (such as explosions) affect multiple resistances: blast (RMEC) + heat (RRAD).

---
