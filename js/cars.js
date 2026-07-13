// Lien vers votre profil / boutique Leboncoin (remplacez par votre vraie adresse).
const LEBONCOIN_PROFILE = "https://www.leboncoin.fr/profil/VOTRE_PROFIL";

// Base de données des véhicules.
// Remplacez / ajoutez vos propres voitures ici.
// Champ "leboncoin" : collez l'URL exacte de l'annonce (laissez "" si pas encore publiée).
// Les images utilisent des dégradés SVG intégrés pour rester 100% hors-ligne.
const CARS = [
  {
    id: 1, marque: "Renault", modele: "Clio V", annee: 2022,
    prix: 15900, km: 24000, carburant: "Essence", boite: "Manuelle",
    puissance: "90 ch", places: 5, couleur: "#f2b705",
    desc: "Citadine polyvalente, faible consommation, idéale pour la ville comme pour les trajets quotidiens.",
    leboncoin: "https://www.leboncoin.fr/voitures/DEMO_clio"
  },
  {
    id: 2, marque: "Peugeot", modele: "3008 GT", annee: 2021,
    prix: 28500, km: 41000, carburant: "Diesel", boite: "Automatique",
    puissance: "130 ch", places: 5, couleur: "#0f4c81",
    desc: "SUV familial spacieux, finition GT, intérieur cuir et grand coffre. Très bien entretenu.",
    leboncoin: ""
  },
  {
    id: 3, marque: "Tesla", modele: "Model 3", annee: 2023,
    prix: 39900, km: 12000, carburant: "Électrique", boite: "Automatique",
    puissance: "283 ch", places: 5, couleur: "#c0392b",
    desc: "Berline 100% électrique, autonomie 490 km, Autopilot, entretien minimal.",
    leboncoin: "https://www.leboncoin.fr/voitures/DEMO_model3"
  },
  {
    id: 4, marque: "Volkswagen", modele: "Golf 8", annee: 2020,
    prix: 21900, km: 55000, carburant: "Essence", boite: "Manuelle",
    puissance: "110 ch", places: 5, couleur: "#2c3e50",
    desc: "La référence des compactes. Confort, fiabilité et tenue de route irréprochables.",
    leboncoin: ""
  },
  {
    id: 5, marque: "Toyota", modele: "Yaris Hybride", annee: 2022,
    prix: 18400, km: 30000, carburant: "Hybride", boite: "Automatique",
    puissance: "116 ch", places: 5, couleur: "#16a085",
    desc: "Hybride auto-rechargeable, ultra économique en ville, fiabilité légendaire Toyota.",
    leboncoin: ""
  },
  {
    id: 6, marque: "BMW", modele: "Série 1", annee: 2021,
    prix: 26900, km: 38000, carburant: "Diesel", boite: "Automatique",
    puissance: "150 ch", places: 5, couleur: "#34495e",
    desc: "Compacte premium dynamique, pack sport, sièges chauffants et navigation intégrée.",
    leboncoin: ""
  },
  {
    id: 7, marque: "Audi", modele: "Q5 Quattro", annee: 2019,
    prix: 34500, km: 68000, carburant: "Diesel", boite: "Automatique",
    puissance: "190 ch", places: 5, couleur: "#7f8c8d",
    desc: "SUV premium 4 roues motrices, très confortable, parfait pour les longs trajets et la montagne.",
    leboncoin: ""
  },
  {
    id: 8, marque: "Renault", modele: "Captur E-Tech", annee: 2023,
    prix: 23900, km: 15000, carburant: "Hybride", boite: "Automatique",
    puissance: "145 ch", places: 5, couleur: "#e67e22",
    desc: "SUV urbain hybride rechargeable, look moderne, équipement complet et faible consommation.",
    leboncoin: ""
  },
  {
    id: 9, marque: "Peugeot", modele: "208 Allure", annee: 2022,
    prix: 16700, km: 27000, carburant: "Essence", boite: "Manuelle",
    puissance: "100 ch", places: 5, couleur: "#8e44ad",
    desc: "Citadine au design affirmé, i-Cockpit 3D, écran tactile et caméra de recul.",
    leboncoin: ""
  },
  {
    id: 10, marque: "Tesla", modele: "Model Y", annee: 2023,
    prix: 46900, km: 9000, carburant: "Électrique", boite: "Automatique",
    puissance: "351 ch", places: 5, couleur: "#2980b9",
    desc: "SUV électrique spacieux, grande autonomie, coffre géant et technologie de pointe.",
    leboncoin: ""
  },
  {
    id: 11, marque: "Volkswagen", modele: "T-Roc", annee: 2020,
    prix: 22400, km: 49000, carburant: "Essence", boite: "Manuelle",
    puissance: "115 ch", places: 5, couleur: "#d35400",
    desc: "SUV compact au style jeune, position de conduite surélevée, très agréable au quotidien.",
    leboncoin: ""
  },
  {
    id: 12, marque: "Toyota", modele: "Corolla TS", annee: 2021,
    prix: 24900, km: 44000, carburant: "Hybride", boite: "Automatique",
    puissance: "122 ch", places: 5, couleur: "#27ae60",
    desc: "Break hybride spacieux et économique, idéal familles et gros rouleurs.",
    leboncoin: ""
  }
];
