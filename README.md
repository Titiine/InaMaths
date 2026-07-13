# InaAuto 🚗

Site vitrine de vente de voitures neuves et d'occasion (statique HTML/CSS/JS).

## Contenu
- Page d'accueil avec bandeau d'accroche et statistiques
- Catalogue de véhicules avec **filtres** (marque, carburant, budget, recherche)
- Fiche détaillée de chaque véhicule (fenêtre modale)
- Section « Pourquoi nous » et formulaire de contact
- Design **responsive** (mobile + ordinateur), aucune dépendance externe

## Lancer le site
Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Personnaliser
- **Voitures** : modifiez `js/cars.js` (ajout/suppression de véhicules).
- **Couleurs / style** : variables CSS en haut de `css/styles.css`.
- **Coordonnées / textes** : directement dans `index.html`.

## Hébergement gratuit
Le site étant statique, il se déploie sur GitHub Pages, Netlify ou Vercel sans configuration.
