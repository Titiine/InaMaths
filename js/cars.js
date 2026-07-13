// ============ Configuration AbiAuto ============

// Lien vers votre profil / boutique Leboncoin (remplacez par votre vraie adresse).
const LEBONCOIN_PROFILE = "https://www.leboncoin.fr/profile/4dcd2995-01e9-4c3a-a393-1e9140d98d0f/offers";

// Prise de rendez-vous en ligne (optionnel) : collez ici votre lien Calendly / Google
// Agenda (ex: "https://calendly.com/abiauto/essai"). Laissez "" pour ne rien afficher.
const BOOKING_URL = "";

// ============ Base de données des véhicules ============
// Pour chaque voiture :
//   - annonce : URL exacte de l'annonce ("" si pas encore publiée)
//   - site    : "Leboncoin" ou "La Centrale"
//   - vendu   : true quand le véhicule est vendu / annonce expirée
//               (il sera masqué par défaut dans le catalogue)
//   - photos  : liste des photos du véhicule, ex :
//                 photos: ["assets/clio-1.jpg", "assets/clio-2.jpg"]
//               La 1re photo sert de vignette, les autres forment la galerie.
//               Si aucune photo n'est indiquée, une illustration est affichée.
// (Déposez vos photos dans le dossier "assets/" puis référencez-les ci-dessous.)
// ⚠️ Les caractéristiques ci-dessous (année, prix, km, puissance…) sont des
// valeurs provisoires à confirmer. Collez aussi l'URL de chaque annonce
// Leboncoin dans le champ "annonce".
const CARS = [
  {
    id: 1, marque: "Peugeot", modele: "208", annee: 2018,
    prix: 6990, km: 98000, carburant: "Essence", boite: "Automatique",
    puissance: "", places: 5, couleur: "#8e44ad",
    desc: "Boîte automatique, essence, Crit'Air 1 : très économique, parfaite pour rouler sur Paris et idéale pour les nouveaux permis. Ex-administration française, donc entretenue régulièrement chez Peugeot. Très bon état extérieur comme intérieur, non-fumeur, contrôle technique OK. Équipée : CarPlay, GPS, écran tactile, radar de recul, régulateur/limiteur de vitesse, Bluetooth, climatisation, feux LED diurnes, volant cuir multifonctions… Prix négociable dans la limite du raisonnable.",
    annonce: "", site: "Leboncoin", vendu: false
  },
  {
    id: 2, marque: "Renault", modele: "Captur 2 Intens", annee: 2019,
    prix: 18490, km: 18000, carburant: "Diesel", boite: "Automatique",
    puissance: "115 ch", places: 5, couleur: "#e67e22",
    desc: "SUV crossover 1.5 Blue dCi 115 Intens EDC (boîte automatique), 6 CV fiscaux, 1re mise en circulation 12/2019. Seulement 18 000 km ! Très bon état intérieur/extérieur, non-fumeur. Très équipé : caméra avant + arrière, park assist, GPS tactile, Apple CarPlay / Android Auto, cockpit numérique, sièges cuir, climatisation bi-zone, carte main libre, phares LED, jantes alu 18 pouces, régulateur… Prix négociable dans la limite du raisonnable.",
    annonce: "https://www.leboncoin.fr/ad/voitures/3230789451", site: "Leboncoin", vendu: false
  },
  {
    id: 3, marque: "Renault", modele: "Modus Expression", annee: 2009,
    prix: 4290, km: 126000, carburant: "Diesel", boite: "Manuelle",
    puissance: "86 ch", places: 5, couleur: "#2980b9",
    desc: "Monospace 1.5 dCi 90 Expression, première main, mise en circulation 01/2009, 126 000 km certifiés. Seulement 4,1 L/100 km et 5 CV fiscaux : très économique, assurance pas chère, idéal jeunes conducteurs. Ex-administration française (véhicule français), entretiens réguliers chez Renault, très bon état extérieur comme intérieur, contrôle technique de moins de 6 mois. Couleur marron clair métallisé, sellerie tissu gris, 5 portes / 5 places. Équipée : climatisation, régulateur/limiteur de vitesse, radio CD, vitres et rétroviseurs électriques, fixations ISOFIX… Prix à débattre dans la limite du raisonnable.",
    annonce: "https://www.lacentrale.fr/auto-occasion-annonce-66104128227.html", site: "La Centrale", vendu: false
  }
];
