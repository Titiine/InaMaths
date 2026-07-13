# AbiAuto 🚗

Site vitrine d'un **conseiller automobile** expérimenté basé à **Évry (Île-de-France)**.
En partenariat avec des professionnels (garage mécanique, carrosserie).
Site statique HTML/CSS/JS, sans dépendance externe.

## Contenu
- Page d'accueil (présentation du conseiller, statistiques)
- Catalogue de véhicules avec **filtres** (marque, carburant, budget, recherche)
- Fiche détaillée de chaque véhicule (fenêtre modale)
- **Intégration Leboncoin** : lien vers chaque annonce + lien vers le profil
- Section « Pourquoi nous » et formulaire de contact
- Design **responsive** (mobile + ordinateur)

## Lancer le site
Ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

Le fichier `AbiAuto-site-complet.html` est une version **autonome** (tout dans un seul fichier)
à ouvrir directement d'un double-clic.

## Personnaliser
- **Voitures** : modifiez `js/cars.js`. Pour chaque voiture, collez l'URL de l'annonce
  dans le champ `leboncoin` (laissez `""` si l'annonce n'est pas encore publiée).
- **Profil Leboncoin** : constante `LEBONCOIN_PROFILE` en haut de `js/cars.js`.
- **Couleurs / style** : variables CSS en haut de `css/styles.css`.
- **Coordonnées / textes** : directement dans `index.html`.

> ⚠️ Leboncoin ne fournit pas d'API publique pour importer automatiquement les annonces.
> Les liens sont donc renseignés manuellement (méthode fiable et conforme à leurs conditions).

## Hébergement gratuit
Le site étant statique, il se déploie sur GitHub Pages, Netlify ou Vercel sans configuration.
