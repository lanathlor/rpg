# Comment Contribuer au Projet

Bienvenue ! Ce document explique comment vous pouvez participer au développement de ce jeu de rôle, même sans connaissances techniques en programmation.

## Vue d'ensemble du projet

Ce projet est un système de jeu de rôle sur table où la "magie" (appelée Flux ou Arcanotechnique) crée des phénomènes physiques réels. Le système utilise un mécanisme de résistances unifié basé sur la physique plutôt que des types de dégâts magiques séparés.

### Trois types de résistances

Tous les dégâts dans le jeu sont résistés par l'une des trois résistances suivantes, basées sur la **nature physique** de l'effet :

-   **RMEC (Résistance Mécanique)** - Dégâts cinétiques/mécaniques : impacts, projectiles, pression, ondes de choc
-   **RRAD (Résistance Radiative)** - Dégâts énergétiques/thermiques : feu, froid, électricité, lumière, radiation
-   **RINT (Résistance Interne)** - Dégâts internes/métaboliques : drain de vie, nécroses, corruption, effets internes

**Règle importante :** Ce qui compte, c'est la NATURE PHYSIQUE de l'effet, pas sa source.

**Exemples :**

-   Une boule de feu → RRAD (dégâts thermiques)
-   Un javelot de glace magique → RMEC (projectile cinétique)
-   Un drain de vie → RINT (effet interne)

## Comment contribuer

Il existe plusieurs façons de participer au projet, selon vos intérêts et compétences.

### 1. Créer des Sorts

Les sorts sont stockés dans des fichiers au format YAML (un format simple pour écrire des données structurées). Vous pouvez créer de nouveaux sorts en suivant le modèle fourni.

**Emplacement :** `/codex/sorts/`

Les sorts sont organisés par type :

-   `destruction/` - Sorts offensifs
-   `alteration/` - Sorts qui modifient l'environnement ou les cibles
-   `amelioration/` - Sorts de renforcement
-   `arme/` - Sorts d'armes magiques
-   `soins/` - Sorts de guérison
-   etc.

#### Modèle de sort

Un fichier de sort ressemble à ceci :

```yaml
spell_series: 'Boule de feu'
school: feu
type: destruction
description_base: 'Lancez une sphère de flammes ardentes...'

levels:
    - level: '1'
      conditions:
          cast_time: 'action principale'
          range: '30m'
          flux_cost: '2'
      effects:
          damage: '2d6+3 feu'
          resistance: 'RRAD'
          area: 'rayon de 3m'
      description: 'Une boule de feu explose au point ciblé...'
```

#### Champs importants à remplir

-   **spell_series** : Nom unique du sort
-   **school** : École du sort (feu, glace, foudre, terre, air, eau, lumière, ombre, nature, etc.)
-   **type** : Type de sort (destruction, alteration, amélioration, etc.)
-   **description_base** : Description générale du sort
-   **level** : Niveau du sort (toujours entre guillemets : "1", "2", etc.)
-   **cast_time** : Temps d'incantation ("action principale", "action rapide", "1 sec", etc.)
-   **range** : Portée du sort ("30m", "contact", "personnelle", etc.)
-   **flux_cost** : Coût en Flux (toujours entre guillemets : "2", "3", etc.)
-   **damage** : Dégâts infligés (ex: "2d6+3 feu")
-   **resistance** : **TRÈS IMPORTANT** - Quelle résistance s'applique (RMEC, RRAD, ou RINT)

#### Choisir la bonne résistance

Posez-vous ces questions :

1. **L'effet frappe-t-il avec de la force ?** → RMEC

    - Projectiles (flèches magiques, rochers)
    - Impacts physiques
    - Ondes de choc
    - Pression

2. **L'effet brûle/gèle/électrocute-t-il ?** → RRAD

    - Feu (brûlures)
    - Froid (gelure)
    - Électricité (choc électrique)
    - Lumière intense
    - Radiation

3. **L'effet attaque-t-il de l'intérieur ?** → RINT
    - Drain de vie
    - Nécroses
    - Corruption
    - Poison magique
    - Effets métaboliques

**Exemples pratiques :**

-   "Boule de feu" → RRAD (c'est chaud, ça brûle)
-   "Lance de glace" → RMEC (c'est un projectile solide qui vous transperce)
-   "Rayon de givre" → RRAD (c'est du froid qui gèle)
-   "Marteau spectral" → RMEC (c'est un impact)
-   "Éclair" → RRAD (c'est de l'électricité)
-   "Drain de vie" → RINT (attaque le métabolisme interne)

#### Conventions d'écriture

-   Les niveaux sont toujours des chaînes de caractères : `level: "1"` et non `level: 1`
-   Le temps utilise le format : `"X sec"` ou `"instantané"`, jamais `"X secs"` ou `"aucun"`
-   Utilisez une indentation de 2 espaces (pas de tabulations)
-   N'oubliez jamais le champ `resistance` dans les effets !

### 2. Créer de l'Équipement

L'équipement (armes, armures, objets) se trouve dans `/codex/equipements/`.

#### Modèle d'armure

```yaml
name: 'Armure de combat lourde'
category: armure
subcategory: lourde
description: 'Une armure complète qui offre une protection maximale...'
stats:
    RMEC: '+3' # Bonus de résistance mécanique
    RRAD: '+1' # Bonus de résistance radiative
    RINT: '+0' # Bonus de résistance interne
    speed_bonus: '-1'
    force_requirement: '4'
cost: '5000 crédits'
```

#### Modèle d'arme

```yaml
name: 'Épée longue'
category: arme
subcategory: mêlée
description: 'Une lame équilibrée pour le combat rapproché...'
damage: '1d8+2'
range: 'mêlée'
cost: '800 crédits'
```

### 3. Créer des Classes de Personnages

Les classes définissent les personnages de départ dans `/codex/classes/`.

```yaml
name: 'Guerrier'
description: 'Un combattant robuste et polyvalent...'
base_stats:
    health: 25
    flux_reserve: 5
stats:
    force: 4
    agilité: 2
    endurance: 3
    intelligence: 1
    sagesse: 2
    charisme: 1
equipment:
    weapons: ['Épée longue']
    armor: ['Armure de combat moyenne']
spells: []
skills: ['Combat au corps-à-corps I']
starting_credits: 500
```

### 4. Améliorer les Règles

Les règles du jeu sont écrites en Markdown (un format de texte simple) dans `/rules/`.

Vous pouvez :

-   Corriger des fautes de frappe
-   Clarifier des règles ambiguës
-   Ajouter des exemples
-   Proposer de nouvelles mécaniques

**Fichiers principaux :**

-   `00_introduction.md` - Présentation du jeu
-   `01_bases_des_regles.md` - Règles de base
-   `02_combat.md` - Système de combat
-   `07_systeme_de_resistances.md` - Guide complet des résistances
-   `09_lexique.md` - Glossaire des termes

### 5. Signaler des Problèmes

Si vous trouvez :

-   Des erreurs dans les sorts ou l'équipement
-   Des incohérences dans les règles
-   Des bugs dans l'application web
-   Des sorts mal équilibrés

Signalez-les en créant une "issue" sur le dépôt Git ou en contactant l'équipe.

## Outils Recommandés

### Éditeur de Texte

Pour éditer les fichiers YAML et Markdown, utilisez un éditeur de texte simple :

-   **Visual Studio Code** (gratuit, recommandé) - https://code.visualstudio.com/
-   **Sublime Text** (gratuit)
-   **Notepad++** (Windows, gratuit)
-   **TextEdit** (Mac, intégré)

⚠️ **N'utilisez PAS** Microsoft Word ou LibreOffice - ils ajoutent du formatage invisible qui casse les fichiers.

### Validation YAML

Pour vérifier que votre YAML est correct :

-   Utilisez un validateur en ligne comme https://www.yamllint.com/
-   Collez votre contenu et vérifiez qu'il n'y a pas d'erreurs

## Processus de Contribution

### Méthode Simple (par Email/Message)

1. Créez votre contenu dans un fichier texte
2. Suivez le modèle approprié
3. Envoyez-le à l'équipe pour révision
4. L'équipe l'intégrera au projet

### Méthode Avancée (avec Git)

Si vous êtes à l'aise avec Git :

1. Clonez le dépôt
2. Créez une branche pour vos modifications
3. Ajoutez vos fichiers
4. Créez un "pull request"
5. Attendez la révision

## Conseils pour Créer du Contenu

### Équilibrage

Quand vous créez des sorts ou de l'équipement :

-   **Respectez la progression** : Les sorts de niveau 1 doivent être moins puissants que ceux de niveau 5
-   **Pensez au coût en Flux** : Plus un sort est puissant, plus il devrait coûter cher
-   **Considérez la portée** : Les sorts à longue portée devraient généralement faire moins de dégâts
-   **Variez les résistances** : Ne faites pas que des sorts RRAD, utilisez les trois types

### Style d'Écriture

-   Écrivez en français
-   Utilisez un langage clair et concis
-   Évitez le jargon technique inutile
-   Donnez des exemples concrets
-   Soyez cohérent avec le ton du reste du jeu

### Cohérence

-   Vérifiez que vos sorts correspondent aux écoles existantes
-   Assurez-vous que les coûts sont cohérents avec le contenu existant
-   Respectez les conventions de nommage
-   Utilisez les mêmes unités (mètres, secondes, crédits)

## Questions Fréquentes

### Q : Je ne connais rien à la programmation, puis-je quand même contribuer ?

**R :** Absolument ! La plupart des contributions concernent le contenu du jeu (sorts, équipement, règles) et ne nécessitent aucune connaissance en programmation. Il suffit de savoir éditer des fichiers texte.

### Q : Qu'est-ce que YAML exactement ?

**R :** YAML est un format simple pour écrire des données structurées. C'est comme remplir un formulaire dans un fichier texte. Il faut juste faire attention à l'indentation (les espaces au début des lignes).

### Q : Comment savoir si mes fichiers YAML sont corrects ?

**R :** Utilisez un validateur en ligne comme yamllint.com. Si vous avez des erreurs, le validateur vous dira où elles se trouvent.

### Q : Puis-je proposer de nouvelles écoles de magie ?

**R :** Oui ! Proposez votre idée à l'équipe avec une description détaillée et quelques sorts d'exemple.

### Q : Comment puis-je tester mes sorts dans le jeu ?

**R :** L'application web permet d'importer des fichiers YAML. Vous pouvez créer un personnage et lui ajouter vos sorts pour les tester.

### Q : Que faire si je ne suis pas sûr de la résistance à utiliser ?

**R :** Posez-vous la question : "Physiquement, comment cet effet blesse-t-il la cible ?" Si c'est encore flou, demandez conseil à l'équipe ou regardez des sorts similaires existants.

### Q : Combien de temps faut-il pour créer un sort ?

**R :** Entre 10 et 30 minutes une fois que vous connaissez le format. Les premiers sont plus longs, mais ça devient plus rapide avec la pratique.

### Q : Y a-t-il une limite au nombre de sorts que je peux créer ?

**R :** Non ! Plus il y a de contenu, mieux c'est. Assurez-vous juste que chaque sort est unique et intéressant.

## Ressources Utiles

-   **Modèle de sort :** `/codex/SPELL_TEMPLATE.yaml`
-   **Guide des résistances :** `/rules/07_systeme_de_resistances.md`
-   **Lexique :** `/rules/09_lexique.md`
-   **Sorts existants :** Parcourez `/codex/sorts/` pour voir des exemples

## Contact

valentin@viviersoft.com

---

**Merci de contribuer à ce projet ! Chaque sort, chaque pièce d'équipement, chaque amélioration des règles rend le jeu meilleur pour tout le monde.**
