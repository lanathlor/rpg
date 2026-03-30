---
title: "Affinities and Types"
order: 1
---

## General Principle

The affinity system is based on two axes:

- **School** -- the nature of the energy being manipulated (Fire, Frost, Light, etc.)
- **Type** -- the way Flux is transformed into energy (Destruction, Alteration, etc.)

A spell is defined by a School and a Type.
A character's affinities determine **which spells they can learn**, not their power.

---

## Spell Unlock Mechanics

Each character has affinity values:

- `A.School[Name]` -> affinity level with a school (e.g.: Fire, Frost, etc.)
- `A.Type[Name]` -> affinity level with a type (e.g.: Destruction, Alteration, etc.)

Affinities range from **0 to 5**.

### Spell Access Rule

A spell is usable if the character meets **one** of the following conditions:

- `(A.School >= ReqSchool AND A.Type >= ReqType)`
- `A.School + A.Type >= ReqMixed`

This means an Arcanotechnician can access a spell:

- by developing **both required affinities** (school AND type),
- or by compensating through a higher total investment (specialization with penalty).

### Specialization Penalty (50%)

**Specialists pay an additional affinity cost.**

The system encourages balance between School and Type, but allows pure specialization at a greater investment cost. The applied formula is:

```
ReqMixed = (ReqSchool + ReqType) x 1.5
```

**Why this penalty?**

A balanced character develops their affinities in a natural and complementary way. A pure specialist must "force" access to the spell by compensating for the lack of mastery on the other axis, which requires more effort and investment.

**Concrete example:**

A spell requiring `School 4, Type 4` has a `ReqMixed = 12` (4+4 x 1.5)

- **Balanced build**: School 4 + Type 4 = **8 points invested** -> Access
- **Specialized build**: School 12 + Type 0 = **12 points invested** -> Access (but 4 more points)

Pure specialization is viable but less efficient.

### Standard Spell Progression

| Spell Level | ReqSchool | ReqType | ReqMixed | Points (balanced) | Points (specialized) |
|-------------|-----------|---------|----------|-------------------|----------------------|
| Level 1     | 2         | 2       | 6        | 4                 | 6 (+50%)            |
| Level 2     | 3         | 3       | 9        | 6                 | 9 (+50%)            |
| Level 3     | 4         | 4       | 12       | 8                 | 12 (+50%)           |
| Level 4     | 5         | 5       | 15       | 10                | 15 (+50%)           |
| Level 5     | 6         | 6       | 18       | 12                | 18 (+50%)           |

**Important note:** These values are **guidelines**, not absolute rules.

### Signature Spells vs Niche Spells

**A spell's level does NOT determine its affinity requirements.**

The "level" (1-5) represents the **progression within a spell series** (Fireball 1 -> 5), not its accessibility. The requirements depend on the **spell's role in the archetype**:

**Signature spells** (low entry cost):
- Define the archetype's identity
- Accessible early so the class functions
- Example: *Fireball level 1* for a pyromancer -> school 2, type 2

**Niche spells** (high entry cost):
- Advanced or specialized techniques
- Reserved for school masters
- Example: *Overcharged Shot level 2* for a sniper -> school 5, type 5

A **level 1** spell can have **school 8** requirements if it represents a master technique.
A **level 5** spell can have **school 3** requirements if it is a natural improvement of a signature spell.

**Design principle:**
- **Signature** spells: Enable the archetype to function -> low requirements
- **Versatile** spells: Usable by multiple archetypes -> medium requirements
- **Niche** spells: Advanced or specialized techniques -> high requirements

### Example

**Spell: Frost Lance (Level 2)**

- School: Frost
- Type: Destruction
- Conditions: `Frost >= 3` or `Destruction >= 3` or `(Frost + Destruction) >= 9`

| Build                        | Frost | Destruction | Total | Access? | Point Cost     |
| ---------------------------- | ----- | ----------- | ----- | ------- | -------------- |
| Pure Cryomancer              | 9     | 0           | 9     | Yes     | 9 (specialized)|
| Pure Destroyer               | 0     | 9           | 9     | Yes     | 9 (specialized)|
| Balanced Generalist          | 3     | 3           | 6     | Yes     | 6 (balanced)   |
| Light Hybrid                 | 4     | 2           | 6     | Yes     | 6              |
| Beginner                     | 2     | 2           | 4     | No      | N/A            |

The generalist accesses the spell with **3 fewer points** than the pure specialist.

---

## List of Arcanotechnology Types

**Types** represent the way an Arcanotechnician transforms Flux into energy.
They reflect the _speed, stability, and complexity_ of this conversion.

---

### Destruction

**Nature:** Simple and immediate discharge.
**Principle:** direct conversion of Flux into raw energy, without complex structure.
**Profile:** fast, instinctive, mentally undemanding.

**Characteristics:**

- Instantaneous release of arcanotechnological Flux.
- Moderate energy output.
- Little control, high stability.

**Examples:**
Fire Bolt, Lightning, Shockwave.

---

### Annihilation

**Nature:** Compression and explosive release of Flux.
**Principle:** the Arcanotechnician concentrates the Flux before brutally releasing it, increasing its energy density.
**Profile:** fast, violent, unstable.

**Characteristics:**

- Extreme conversion power.
- High mental demand.
- Risk of energy blowback.

**Examples:**
Quantum Lance, Luminous Implosion, Critical Discharge.

---

### Cataclysm

**Nature:** Slow and massive accumulation of arcanotechnological energy.
**Principle:** the Arcanotechnician channels Flux over a long duration before release.
**Profile:** slow, stable, devastating.

**Characteristics:**

- Long charge time.
- Large-scale effects.
- High mental endurance required.

**Examples:**
Firestorm, Earthquake, Glacial Veil.

---

### Alteration

**Nature:** Subtle and targeted transformation.
**Principle:** fine manipulation of Flux to modify a physical, arcanotechnological, or biological property.
**Profile:** precise, methodical, stable.

**Characteristics:**

- Control and destabilization effects.
- High energetic stability.
- Requires finesse rather than power.

**Examples:**
Weakening Frost, Life Drain, Phase Distortion.

---

### Enhancement

**Nature:** Harmonic and internal conversion.
**Principle:** the Arcanotechnician reinjects Flux into an existing system to strengthen or stabilize it.
**Profile:** stable, balanced, enduring.

**Characteristics:**

- Reinforcement and protection effects.
- Very low energy loss.
- Synergy with allies or artifacts.

**Examples:**
Blessing, Luminous Acceleration, Kinesthetic Reinforcement.

---

### Weapon

**Nature:** Channeling of arcanotechnological energy through physical weapons.
**Principle:** the Arcanotechnician infuses their weapons with Flux to increase their combat effectiveness.
**Profile:** tactical, versatile, combat-oriented.

**Characteristics:**

- Enhancement of armament capabilities.
- Synergy between arcanotechnology and physical combat.
- Increased effectiveness depending on the weapon used.

**Examples:**
Overcharged Shot, High-Velocity Slugs, Headshot.

---

## Comparative Summary

| Type             | Speed       | Power       | Stability  | Mental Complexity  | Conversion Style       |
| ---------------- | ----------- | ----------- | ---------- | ------------------ | ---------------------- |
| **Destruction**  | Very fast   | Medium      | High       | Low                | Direct discharge       |
| **Annihilation** | Fast        | Very high   | Low        | High               | Violent compression    |
| **Cataclysm**    | Slow        | Massive     | Medium     | High               | Prolonged accumulation |
| **Alteration**   | Medium      | Variable    | Very high  | Medium             | Fine transformation    |
| **Enhancement**  | Medium      | Low         | Very high  | Medium             | Harmonic reinjection   |
| **Weapon**       | Fast        | Variable    | High       | Low                | Weapon infusion        |

---

## Arcanotechnology Types and Resistances

The Type and School of a spell determine **which resistance** applies against it. What matters is not the fact that it is "arcanotechnological," but **the physical nature of the effect produced**.

> For a complete understanding of the resistance system, see [Resistance System](07_systeme_de_resistances.md).

### General Correspondences

| Effect Type                       | Applicable Resistance | Examples                                    |
| --------------------------------- | --------------------- | ------------------------------------------- |
| **Projectile, impact, wave**      | RMEC                  | Rock projectile, shockwave                  |
| **Fire, cold, light, lightning**  | RRAD                  | Fireball, frost ray, lightning              |
| **Drain, necrosis, corruption**   | RINT                  | Life drain, necrosis, blood freeze          |

### Examples by Type

**Destruction** -> Primarily **RMEC** or **RRAD** depending on the school
- Fire Bolt -> RRAD
- Force Projectile -> RMEC
- Lightning -> RRAD

**Annihilation** -> Primarily **RMEC** (violent compression) or **RRAD** (discharge)
- Quantum Lance -> RMEC
- Luminous Implosion -> RMEC + RRAD
- Critical Discharge -> RRAD

**Cataclysm** -> Often **RMEC + RRAD** (large-scale effects)
- Firestorm -> RRAD
- Earthquake -> RMEC
- Glacial Veil -> RRAD

**Alteration** -> Primarily **RINT** (internal transformation)
- Weakening Frost -> RINT
- Life Drain -> RINT
- Phase Distortion -> RINT (or special)

**Enhancement** -> No resistance (beneficial effects)
- Blessing, acceleration, reinforcement -> N/A

**Weapon** -> Depends on the infused weapon
- Overcharged Shot -> RMEC (projectile) or RRAD (energy)
- Flaming Blade -> RMEC (slashing) + RRAD (fire)

---

## System Philosophy

> The **Type** reflects the Arcanotechnician's mental and physical capacity to transform Flux.
> It defines their _energetic style_ and their _relationship to arcanotechnological Flux_, not their raw power.
> Two Arcanotechnicians of the same school can be radically different depending on their type:
>
> - One brutally discharges their energy (Destruction)
> - Another slowly accumulates it (Cataclysm)
> - A third reinjects it for reinforcement (Enhancement)

**Important:** The affinity system determines **which spells you can learn**. Resistances determine **how much damage you take**. These two systems are independent but complementary.

---
