---
title: "Flux System"
order: 3
---

Arcanotechnology in this universe relies on the manipulation of a fundamental energy: the **Flux**.
Every spell, every arcanotechnological effect, and every alteration depends on a character's ability to **mobilize**, **convert**, and then **stabilize** this energy.

This document describes the complete workings of this resource.

---

# 1. Flux Reserve

The **Flux Reserve** is the maximum amount of arcanotechnological energy a character can contain at any given moment.

- It represents the body's and nervous system's capacity to withstand energetic pressure.
- When it drops to 0, a character can no longer cast spells until they have recovered.

**Notation:**

```
Flux Reserve = character's maximum arcanotechnological energy
```

Each spell has a **Flux cost**.

---

# 2. Flux Influx per Turn

The **Flux Influx per Turn** is the amount of Flux a character can mobilize or convert into usable energy during a 6-second turn.

This is the most important measure for a spellcaster:
it determines **how quickly** they can prepare a spell.

**Notation:**

```
Flux Influx per Turn = amount of Flux that can be mobilized each turn
```

### Example of a spell requiring concentration:

- A spell costs **12** Flux points.
- The character has a Flux Influx per Turn of **5**.

Concentration:

- Turn 1: 5/12
- Turn 2: 10/12
- Turn 3: 12/12 -> the spell is ready at the start of the turn.

### Instant Spells

**If Flux Influx per Turn >= Spell Cost**, the spell is cast **immediately** on the same turn.

**Example:**
- A spell costs **4** Flux points.
- The character has a Flux Influx per Turn of **6**.
- **Result:** The spell triggers instantly without concentration.

---

# 3. Natural Recovery

Each turn, a character automatically regains a small amount of Flux.

**Notation:**

```
Natural Recovery = Flux automatically regained at the end of the turn
```

It represents:

- arcanotechnological breathing,
- natural balancing of internal Flux,
- resynchronization with the environment.

Recovery can never exceed the maximum Flux Reserve.

---

# 4. Casting a Spell

To cast a spell, a character must:

1. **Mobilize enough Flux** (over several turns if necessary)
2. **Reach the spell's cost**
3. **Trigger the effect**

**Triggering rules:**

- **If Flux Influx per Turn >= Spell Cost** -> **Instant** spell (same turn)
- **If Flux Influx per Turn < Spell Cost** -> **Concentration required** (multiple turns)

**Formula:**

```
Accumulated Flux >= Spell Cost -> Successful casting
```

### 4.1. Interrupted Concentration

Concentration breaks if a character:

- takes damage,
- is controlled,
- performs a major action,
- or must move under pressure.

If interrupted, the character loses **half of the accumulated Flux**, rounded down.

---

# 5. Flux Instability (Overload)

When the manipulated Flux exceeds an Arcanotechnician's natural capacities, **Flux Instability** occurs.
This happens when:

- the character exceeds their Flux Influx per Turn,
- or chains multiple heavy spells without stabilization time.

### Possible effects:

- -1 to Intelligence for 1 turn
- Loss of 1d4 Flux Reserve points
- Spell cancelled
- Internal damage (1d6)
- Minor arcanotechnological pulse (roleplay effect decided by the GM)

Overload is never lethal, but it limits the abuse of heavy spells.

---

# 6. Flux Conversion and Schools / Types

### 6.1. Schools and Types

Each spell belongs to:

- a **School** (Fire, Frost, Light, Shadow, etc.)
- and a **Type** (Destruction, Annihilation, Cataclysm, Alteration, Enhancement)

These elements do **not** modify the Flux cost, but they influence:

- stabilization difficulty,
- overload risks,
- and the affinities required to unlock the spell.

### 6.2. Access Conditions

A spell is accessible if:

- the School affinity is sufficient,
- **or** the Type affinity,
- **or** a combination of both.

See the file: `03_systeme_affinites_et_types.md`.

### 6.3. Spell Availability

**Codex access:** A character can use **any spell from the codex** if they meet the required affinity conditions. There is no learning cost or availability restriction beyond affinities.

**Spell slots:** Each character has **2 base spell slots**. These slots determine how many spells can be "prepared" and available for immediate use.

**Intelligence bonus:** Intelligence improves the ability to memorize and prepare spells. **Every 5 Intelligence points, the character gains 1 spell slot**:
- Base: 2 slots + (Intelligence / 5)
- **Minimum: 4 slots** (can never drop below)

Examples:
- Intelligence 0-9: 4 slots (guaranteed minimum)
- Intelligence 10-14: 4 slots (2 base + 2 = 4)
- Intelligence 15-19: 5 slots (2 base + 3 = 5)
- Intelligence 20-24: 6 slots (2 base + 4 = 6)

**Changing spells:** In a secure rest zone, a character can freely swap their prepared spells for other codex spells, as long as they possess the required affinities.

**Additional slots (GM Bonus):** The Game Master can grant additional spell slots as rewards:
- Major quest rewards
- Arcanotechnological objects or artifacts
- Divine blessings or pacts
- Specialized training
- Exceptional narrative events

These bonuses are added to the base calculation (2 + Intelligence/5, minimum 4) and are permanent unless otherwise specified by the GM.

---

# 7. Interaction with Combat

### Triggering Timing:
- **Instant spells** (Cost <= Flux Influx per Turn) -> Trigger **immediately** during the turn
- **Spells requiring concentration** -> Trigger **at the start of the turn when the cost is reached**

### Vulnerabilities:
- Enemies can **interrupt concentration** (damage, control, forced movement)
- Long spells create tactical tension: the Arcanotechnician must be protected
- Only spells requiring concentration are vulnerable to interruption

The system makes arcanotechnology powerful but vulnerable to timing and positioning.

---

# 8. Out-of-Combat Recovery

Out of combat, a character recovers their entire Flux Reserve via:

- 10 minutes of meditation,
- or 1 minute with a **Flux Crystal**.

---

# 9. Quick Summary

| Element                | Name                     | Role                                          |
| ---------------------- | ----------------------- | --------------------------------------------- |
| Flux Reserve           | Maximum capacity        | Determines the total available arcanotechnology      |
| Flux Influx per Turn   | Mobilization speed      | Determines the speed of spell preparation     |
| Natural Recovery       | Automatic regeneration  | Maintains the arcanotechnological rhythm              |
| Flux Instability       | Overload                | Limits the abuse of heavy spells              |
| Spell Cost             | --                      | Flux required to cast a spell                 |

---

# 10. System Philosophy

Flux is not a simple number, but an **energetic dynamic**.
This system emphasizes:

- **preparation**,
- **risk management**,
- **physical or elemental conversion**,
- **overload**,
- and **tactical timing**.

A powerful Arcanotechnician is not the one with the most Flux,
but the one who knows **how to convert it at the right moment**.

---
