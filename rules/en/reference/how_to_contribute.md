---
title: "How to Contribute"
order: 5
---

Welcome! This guide explains how to participate in the development of this role-playing game. **No technical knowledge is required** - if you can use a web browser and write in a text file, you can contribute!

## Quick Overview: What Can I Do?

- **Artists** -- Create illustrations to replace temporary AI images
- **Creators** -- Invent spells, weapons, armor, character classes
- **Writers** -- Improve rules, fix mistakes, clarify texts
- **Testers** -- Play and report what doesn't work
- **Thinkers** -- Propose new ideas and mechanics

---

## Method 1: By Email (The Simplest!)

**Perfect if you don't like complicated websites.**

### How to do it:

1. **Create your content** in any text editor (Notepad, TextEdit, Word...)
2. **Send an email** to: **valentin@viviersoft.com**

### Example email:
```
Subject: New spell - Fireball

Hello!

I created a new spell for the game. It's a level 1 fireball
that deals 2d6 damage in a 3-meter area.

Here are the details:
- Name: Fireball
- School: Fire
- Type: Destruction
- Damage: 2d6+3
- Range: 30 meters
- Cost: 2 Flux

Thanks!
```

**That's it!** We'll take care of putting your creation in the proper format.

---

## Method 2: GitHub Without a Developer Account

**GitHub is the site where the project is hosted. You can contribute directly from your browser!**

### Step 1: Create a GitHub Account (Free)

1. Go to https://github.com
2. Click on **"Sign up"** (top right)
3. Follow the steps (email, password, username)
4. Verify your email
5. **Done!** You have a GitHub account

### Step 2: Report a Problem or Propose an Idea

1. Go to https://github.com/lanathlor/rpg
2. Click on the **"Issues"** tab
3. Click on the green **"New issue"** button
4. **Write your idea**:
   - **Title**: A short title (e.g., "New spell: Lightning")
   - **Comment**: Describe your idea or paste your creation
5. Click on **"Submit new issue"**

**Example Issue:**
```
Title: New class - Technomancer

Comment:
I have an idea for a new class that mixes technology and arcanotechnology.

Stats:
- Hit Points: 18
- Flux: 12
- Strength: 8
- Intelligence: 12

Starting Equipment:
- Energy pistol
- Light tech armor

Description: An expert in the fusion of technology and Flux...
```

### Step 3: Edit Files Directly on GitHub

**You can edit project files directly in your browser!**

1. **Go to** https://github.com/lanathlor/rpg
2. **Navigate** to the file to edit:
   - Click on `codex` to see spells, weapons, classes...
   - Click on `rules` for the game rules
3. **Click on a file** to open it
4. **Click on the pencil icon** (top right of the file)
5. **Make your changes** directly on the page
6. **At the bottom of the page**:
   - In "Commit changes", describe what you changed
   - Check **"Create a new branch"**
   - Click on **"Propose changes"**
7. **On the next page**, click on **"Create pull request"**
8. **Done!** Your changes will be reviewed

### Step 4: Add a New File on GitHub

1. **Navigate** to the correct folder (e.g., `codex/sorts/destruction/`)
2. **Click on** "Add file" then "Create new file"
3. **Name your file** (e.g., `boule_de_feu.yaml`)
4. **Write the content** in the editor
5. **At the bottom**, describe your addition and click on **"Propose new file"**
6. **Create the pull request** as above

---

## Creating Game Content

### Simplified Format for Spells

**No need to know YAML!** Just send us this information:

```
SPELL NAME: Fireball
SCHOOL: Fire (options: fire, ice, lightning, earth, air, water, light, shadow, nature)
TYPE: Destruction (options: destruction, alteration, enhancement, weapon, healing)

LEVEL 1:
- Damage: 2d6+3 fire
- Range: 30 meters
- Area: 3-meter radius
- Flux Cost: 2
- Cast Time: Main action
- Description: A small fireball explodes at the targeted point

LEVEL 2:
- Damage: 3d6+5 fire
- Range: 40 meters
- Area: 4-meter radius
- Flux Cost: 4
- (etc...)
```

### Simplified Format for Equipment

```
NAME: Combat Armor
TYPE: Heavy Armor
DESCRIPTION: A complete armor made of reinforced alloy

BONUSES:
- Protection: +3
- Speed: -1

PREREQUISITE: Strength 4
PRICE: 5000 credits
```

### Simplified Format for Classes

```
NAME: Technomancer
DESCRIPTION: Expert in the fusion of technology and arcanotechnology

BASE STATS:
- Hit Points: 18
- Reserve Flux: 12
- Speed: 6

STATS:
- Strength: 8
- Dexterity: 10
- Constitution: 9
- Intelligence: 12
- Perception: 10
- Precision: 11
- Charisma: 8

STARTING EQUIPMENT:
- Energy pistol
- Light tech armor
- Hacking kit

STARTING SPELLS:
- Energy shield
- System hack

SKILLS:
- Hacking level 1
- Technological knowledge
```

---

## For Artists

**We are actively looking for artists!** The current images are temporarily AI-generated.

### How to contribute illustrations:

1. **Create your art** in whatever style you like
2. **Accepted formats**: PNG, JPG, SVG
3. **Ideal resolution**: 512x512 pixels minimum for icons, 1920x1080 for illustrations
4. **Send via**:
   - Email with files or download link
   - GitHub Issue with attached images
   - Pull Request if you're comfortable with GitHub

### What we need:

- Spell illustrations
- Class portraits
- Equipment icons
- Creature illustrations
- Maps and environments
- Anything that can visually enrich the game!

---

## Frequently Asked Questions

### "I know nothing about programming, can I really help?"

**YES!** The majority of content is just text. If you can write an email, you can contribute.

### "What if my English isn't perfect?"

No problem! The team will correct small mistakes. What matters is the idea.

### "How do I know if my idea is good?"

Every idea is worth proposing! At worst, we'll discuss it together to improve it.

### "How long does it take?"

- Creating a simple spell: 5-10 minutes
- Creating a class: 20-30 minutes
- Reporting a problem: 2 minutes

### "How many things can I create?"

As many as you want! The more content, the better.

### "What if I make a mistake?"

No worries! Everything is reviewed before being integrated. We'll fix things together.

### "Can I modify other people's content?"

Yes! This is a collaborative project. Propose your improvements.

### "How do I know if my contribution was accepted?"

You'll receive an email notification (if you used GitHub) or a direct email reply.

---

## Useful Resources

### Where to Find Inspiration

- **Existing spells**: https://github.com/lanathlor/rpg/tree/main/codex/sorts
- **Existing equipment**: https://github.com/lanathlor/rpg/tree/main/codex/equipements
- **Existing classes**: https://github.com/lanathlor/rpg/tree/main/codex/classes
- **Game rules**: https://github.com/lanathlor/rpg/tree/main/rules

### Recommended Tools (Optional)

**Recommended text editor:**
- **Visual Studio Code** (free, all platforms) - https://code.visualstudio.com/
  - Syntax highlighting for YAML and Markdown
  - Automatic format error detection
  - Simple and intuitive interface
  - Useful extensions available (YAML, Markdown Preview)

**Other simple editors** (alternatives):
- **Windows**: Notepad (pre-installed) or Notepad++ (free)
- **Mac**: TextEdit (pre-installed)
- **Linux**: Gedit, Kate, or nano
- **Online**: https://dillinger.io/ (free online editor)

**To validate YAML format** (optional):
- https://www.yamllint.com/ - Paste your text to verify it's correct
- VS Code automatically detects errors if you use it!

---

## Project Spirit

This project is **collaborative and open**. This means:

- **Everyone can contribute**, regardless of their level
- **All ideas are welcome**
- **Mistakes are normal** and we learn together
- **Respect and kindness** are essential
- **The joy of creating** is our main motivation

### Simplified License

By contributing, you agree that:
- Your content will be **freely usable** by all (Creative Commons license)
- Others may **modify and improve** it
- You will be **credited** as a contributor
- The project will remain **free and open** forever

---

## Contact

**Main email:** valentin@viviersoft.com

**Discord:** [@Lanath](https://discord.com/users/Lanath)

**Project GitHub:** https://github.com/lanathlor/rpg

**For any questions**, don't hesitate to:
- Open an Issue on GitHub
- Send an email
- Contact me on Discord
- Propose your ideas directly

---

**Thank you for your interest in this project!**

Every contribution, small or large, makes the game better. Whether you create a single spell or an entire class, whether you fix a typo or propose a new mechanic, **your participation matters**.

**Together, let's create a unique and exciting role-playing game!**
