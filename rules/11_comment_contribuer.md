# Comment Contribuer au Projet

Bienvenue ! Ce guide vous explique comment participer au développement de ce jeu de rôle. **Aucune connaissance technique n'est requise** - si vous savez utiliser un navigateur web et écrire dans un fichier texte, vous pouvez contribuer !

## 🎯 Vue Rapide : Que Puis-je Faire ?

- **🎨 Artistes** → Créer des illustrations pour remplacer les images IA temporaires
- **✨ Créateurs** → Inventer des sorts, armes, armures, classes de personnage
- **📝 Rédacteurs** → Améliorer les règles, corriger les fautes, clarifier les textes
- **🎲 Testeurs** → Jouer et signaler ce qui ne va pas
- **💡 Penseurs** → Proposer de nouvelles idées et mécaniques

---

## 📧 Méthode 1 : Par Email (Le Plus Simple !)

**Parfait si vous n'aimez pas les sites web compliqués.**

### Comment faire :

1. **Créez votre contenu** dans n'importe quel éditeur de texte (Bloc-notes, TextEdit, Word...)
2. **Envoyez un email** à : **valentin@viviersoft.com**

### Exemple d'email :
```
Objet : Nouveau sort - Boule de feu

Bonjour !

J'ai créé un nouveau sort pour le jeu. C'est une boule de feu de niveau 1
qui fait 2d6 dégâts dans une zone de 3 mètres.

Voici les détails :
- Nom : Boule de feu
- École : Feu
- Type : Destruction
- Dégâts : 2d6+3
- Portée : 30 mètres
- Coût : 2 Flux

Merci !
```

**C'est tout !** Nous nous occuperons de mettre votre création dans le bon format.

---

## 🌐 Méthode 2 : GitHub Sans Compte Développeur

**GitHub est le site où le projet est hébergé. Vous pouvez contribuer directement depuis votre navigateur !**

### Étape 1 : Créer un compte GitHub (Gratuit)

1. Allez sur https://github.com
2. Cliquez sur **"Sign up"** (en haut à droite)
3. Suivez les étapes (email, mot de passe, nom d'utilisateur)
4. Validez votre email
5. **C'est fait !** Vous avez un compte GitHub

### Étape 2 : Signaler un Problème ou Proposer une Idée

1. Allez sur https://github.com/lanathlor/rpg
2. Cliquez sur l'onglet **"Issues"**
3. Cliquez sur le bouton vert **"New issue"**
4. **Écrivez votre idée** :
   - **Title** : Un titre court (ex: "Nouveau sort : Éclair")
   - **Comment** : Décrivez votre idée ou collez votre création
5. Cliquez sur **"Submit new issue"**

**Exemple d'Issue :**
```
Title: Nouvelle classe - Technomancien

Comment:
J'ai une idée pour une nouvelle classe qui mélange technologie et magie.

Caractéristiques :
- Points de vie : 18
- Flux : 12
- Force : 8
- Intelligence : 12

Équipement de départ :
- Pistolet à énergie
- Armure légère tech

Description : Un expert en fusion de la technologie et du Flux...
```

### Étape 3 : Modifier des Fichiers Directement sur GitHub

**Vous pouvez éditer les fichiers du projet directement dans votre navigateur !**

1. **Allez sur** https://github.com/lanathlor/rpg
2. **Naviguez** jusqu'au fichier à modifier :
   - Cliquez sur `codex` pour voir les sorts, armes, classes...
   - Cliquez sur `rules` pour les règles du jeu
3. **Cliquez sur un fichier** pour l'ouvrir
4. **Cliquez sur l'icône crayon** ✏️ (en haut à droite du fichier)
5. **Faites vos modifications** directement dans la page
6. **En bas de la page** :
   - Dans "Commit changes", décrivez ce que vous avez changé
   - Cochez **"Create a new branch"**
   - Cliquez sur **"Propose changes"**
7. **Sur la page suivante**, cliquez sur **"Create pull request"**
8. **C'est fait !** Vos modifications seront examinées

### Étape 4 : Ajouter un Nouveau Fichier sur GitHub

1. **Naviguez** jusqu'au bon dossier (ex: `codex/sorts/destruction/`)
2. **Cliquez sur** "Add file" → "Create new file"
3. **Nommez votre fichier** (ex: `boule_de_feu.yaml`)
4. **Écrivez le contenu** dans l'éditeur
5. **En bas**, décrivez votre ajout et cliquez sur **"Propose new file"**
6. **Créez la pull request** comme ci-dessus

---

## 📝 Créer du Contenu de Jeu

### Format Simplifié pour les Sorts

**Pas besoin de connaître YAML !** Envoyez-nous simplement ces informations :

```
NOM DU SORT : Boule de feu
ÉCOLE : Feu (options : feu, glace, foudre, terre, air, eau, lumière, ombre, nature)
TYPE : Destruction (options : destruction, altération, amélioration, arme, soin)

NIVEAU 1 :
- Dégâts : 2d6+3 feu
- Portée : 30 mètres
- Zone : Rayon de 3 mètres
- Coût en Flux : 2
- Temps d'incantation : Action principale
- Description : Une petite boule de feu explose au point ciblé

NIVEAU 2 :
- Dégâts : 3d6+5 feu
- Portée : 40 mètres
- Zone : Rayon de 4 mètres
- Coût en Flux : 4
- (etc...)
```

### Format Simplifié pour l'Équipement

```
NOM : Armure de combat
TYPE : Armure lourde
DESCRIPTION : Une armure complète en alliage renforcé

BONUS :
- Protection : +3
- Vitesse : -1

PRÉREQUIS : Force 4
PRIX : 5000 crédits
```

### Format Simplifié pour les Classes

```
NOM : Technomancien
DESCRIPTION : Expert en fusion de technologie et magie

STATS DE BASE :
- Points de vie : 18
- Flux de réserve : 12
- Vitesse : 6

CARACTÉRISTIQUES :
- Force : 8
- Dextérité : 10
- Constitution : 9
- Intelligence : 12
- Perception : 10
- Précision : 11
- Charisme : 8

ÉQUIPEMENT DE DÉPART :
- Pistolet à énergie
- Armure légère tech
- Kit de piratage

SORTS DE DÉPART :
- Bouclier énergétique
- Hack système

COMPÉTENCES :
- Piratage niveau 1
- Connaissance technologique
```

---

## 🎨 Pour les Artistes

**Nous cherchons activement des artistes !** Les images actuelles sont générées par IA temporairement.

### Comment contribuer des illustrations :

1. **Créez votre art** dans le style qui vous plaît
2. **Formats acceptés** : PNG, JPG, SVG
3. **Résolution idéale** : 512x512 pixels minimum pour les icônes, 1920x1080 pour les illustrations
4. **Envoyez par** :
   - Email avec les fichiers ou lien de téléchargement
   - GitHub Issue avec les images attachées
   - Pull Request si vous êtes à l'aise avec GitHub

### Ce dont nous avons besoin :

- Illustrations de sorts
- Portraits de classes
- Icônes d'équipement
- Illustrations de créatures
- Cartes et environnements
- Tout ce qui peut enrichir visuellement le jeu !

---

## ❓ Questions Fréquentes

### "Je n'y connais rien en programmation, puis-je vraiment aider ?"

**OUI !** La majorité du contenu n'est que du texte. Si vous savez écrire un email, vous pouvez contribuer.

### "Et si mon français n'est pas parfait ?"

Pas de problème ! L'équipe corrigera les petites fautes. L'important c'est l'idée.

### "Comment savoir si mon idée est bonne ?"

Toute idée est bonne à proposer ! Au pire, on discutera ensemble pour l'améliorer.

### "Combien de temps ça prend ?"

- Créer un sort simple : 5-10 minutes
- Créer une classe : 20-30 minutes
- Signaler un problème : 2 minutes

### "Je peux créer combien de choses ?"

Autant que vous voulez ! Plus il y a de contenu, mieux c'est.

### "Et si je fais une erreur ?"

Aucun souci ! Tout est révisé avant d'être intégré. On corrigera ensemble.

### "Puis-je modifier le contenu d'autres personnes ?"

Oui ! C'est un projet collaboratif. Proposez vos améliorations.

### "Comment je sais si ma contribution a été acceptée ?"

Vous recevrez une notification par email (si vous avez utilisé GitHub) ou une réponse directe par email.

---

## 📚 Ressources Utiles

### Où Trouver de l'Inspiration

- **Sorts existants** : https://github.com/lanathlor/rpg/tree/main/codex/sorts
- **Équipements existants** : https://github.com/lanathlor/rpg/tree/main/codex/equipements
- **Classes existantes** : https://github.com/lanathlor/rpg/tree/main/codex/classes
- **Règles du jeu** : https://github.com/lanathlor/rpg/tree/main/rules

### Outils Recommandés (Optionnels)

**📝 Éditeur de texte recommandé :**
- **Visual Studio Code** (gratuit, tous systèmes) - https://code.visualstudio.com/
  - ✅ Coloration syntaxique pour YAML et Markdown
  - ✅ Détection automatique des erreurs de format
  - ✅ Interface simple et intuitive
  - ✅ Extensions utiles disponibles (YAML, Markdown Preview)

**Autres éditeurs simples** (alternatives) :
- **Windows** : Bloc-notes (déjà installé) ou Notepad++ (gratuit)
- **Mac** : TextEdit (déjà installé)
- **Linux** : Gedit, Kate, ou nano
- **En ligne** : https://dillinger.io/ (éditeur en ligne gratuit)

**Pour valider le format YAML** (optionnel) :
- https://www.yamllint.com/ - Collez votre texte pour vérifier qu'il est correct
- VS Code détecte automatiquement les erreurs si vous l'utilisez !

---

## 🤝 L'Esprit du Projet

Ce projet est **collaboratif et ouvert**. Cela signifie :

- ✅ **Tout le monde peut contribuer**, peu importe son niveau
- ✅ **Toutes les idées sont bienvenues**
- ✅ **Les erreurs sont normales** et on apprend ensemble
- ✅ **Le respect et la bienveillance** sont essentiels
- ✅ **Le plaisir de créer** est notre motivation principale

### Licence Simplifiée

En contribuant, vous acceptez que :
- Votre contenu sera **librement utilisable** par tous (licence Creative Commons)
- D'autres pourront le **modifier et l'améliorer**
- Vous serez **crédité** comme contributeur
- Le projet restera **gratuit et ouvert** pour toujours

---

## 📮 Contact

**Email principal :** valentin@viviersoft.com

**Discord :** [@Lanath](https://discord.com/users/Lanath)

**GitHub du projet :** https://github.com/lanathlor/rpg

**Pour toute question**, n'hésitez pas à :
- Ouvrir une Issue sur GitHub
- Envoyer un email
- Me contacter sur Discord
- Proposer directement vos idées

---

**🎉 Merci de votre intérêt pour ce projet !**

Chaque contribution, petite ou grande, rend le jeu meilleur. Que vous créiez un seul sort ou une classe entière, que vous corrigiez une faute ou proposiez une nouvelle mécanique, **votre participation compte**.

**Ensemble, créons un jeu de rôle unique et passionnant !**