# InaMaths 🎓

Application éducative **multilingue** (français d'abord) pour apprendre en jouant.
Les enfants font des exercices, gagnent des **pièces**, personnalisent leur **avatar**
et jouent à un **mini-jeu**.

## ✨ Fonctionnalités

- **Multilingue** — français par défaut, anglais démarré. Le sélecteur de langue est
  sur l'écran d'accueil. Voir [Ajouter une langue](#-ajouter-une-langue).
- **3 niveaux** de difficulté (facile / moyen / difficile).
- **Exercices** :
  - **Maths (CE2)** — additions, soustractions, multiplications et divisions.
    La difficulté et les opérations s'adaptent au niveau choisi.
  - **Formes géométriques (CP)** — reconnaître cercle, carré, triangle, rectangle,
    étoile, cœur (plus de formes aux niveaux supérieurs).
- **Pièces** — chaque bonne réponse rapporte des pièces.
- **Boutique** — dépenser ses pièces pour débloquer des couleurs, des pièces de
  visage et des vêtements.
- **Avatar personnalisable** — 4 types (**monstre, humain, animal, robot**).
  On change la couleur du corps, les **yeux**, la **bouche**, l'**accessoire**
  (cornes / oreilles / antenne / cheveux selon le type) et les vêtements sur
  **3 zones** : **tête** (chapeau), **ventre** (haut) et **jambes & pieds** (bas + chaussures).
- **Mini-jeu « Attrape-pièces »** — coûte des pièces pour jouer, on clique les pièces
  avant qu'elles ne disparaissent. Si on rate trop de pièces, on perd et **le jeu disparaît**.
- **Sauvegarde locale** — pièces, achats et avatar sont conservés (localStorage).

## 🚀 Démarrer

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## 🗂️ Structure

```
src/
  i18n/            Système de traduction (translations.ts + LanguageContext)
  state/           État du jeu (pièces, avatar, achats) + sauvegarde locale
  data/
    catalog.ts     Catalogue des pièces d'avatar et prix boutique
    exercises.ts   Génération des questions (maths & formes)
  components/       Avatar (SVG), formes, pièce, aperçus, barre du haut
  screens/          Accueil, Jouer, Exercice, Résultats, Boutique, Avatar, Mini-jeu
```

## 🌍 Ajouter une langue

1. Ajouter le code de la langue dans `LANGUAGES` (`src/i18n/translations.ts`).
2. Créer un objet de traduction avec **les mêmes clés que le français** (`fr`)
   et l'ajouter à `translations`.

Le français reste la langue de référence : toute clé manquante retombe
automatiquement sur le texte français.

## 🛠️ Technologies

React + TypeScript + Vite. Aucun avatar n'est une image : tout est dessiné en SVG,
ce qui permet de composer librement les pièces et les vêtements.
