export const COLORS = {
  primary: '#D55A3A',   // Rouge-orange du nouveau logo
  secondary: '#3DB5A0'  // Vert-turquoise du nouveau logo
};

// Nouvelles constantes pour les stands selon les spécifications

// Tarifs au m² pour chaque type de stand
export const standPrices = {
  equipped: 270,  // Stand équipé - 270 € / m²
  bare: 225,      // Stand nu - 225 € / m²
  ready: 296      // Pack prêt à exposer - 296 € / m² (calcul pour les autres tailles)
};

// Surfaces disponibles pour stand équipé et nu (6 à 30 m²)
export const standardSizes = Array.from({ length: 25 }, (_, i) => (i + 6).toString());

// Surfaces et prix fixes pour le pack "Prêt à exposer"
export const readyToExposePrices: { [key: string]: number } = {
  '21': 6216,  // 21 m² à 6216 € HT (21 × 296)
  '24': 7104,  // 24 m² à 7104 € HT (24 × 296)
  '27': 7992,  // 27 m² à 7992 € HT (27 × 296)
  '30': 8880,  // 30 m² à 8880 € HT (30 × 296)
  '33': 9768,  // 33 m² à 9768 € HT (33 × 296)
  '36': 10656  // 36 m² à 10656 € HT (36 × 296)
};

// Surfaces disponibles pour le pack prêt à exposer
export const readyToExposeSizes = ['21', '24', '27', '30', '33', '36'];

// Prix des angles (185 € par angle)
export const anglePrice = 185;

// Prix de l'électricité supérieure
export const electricityPrices = {
  '2kw': 220,
  '4kw': 260,
  '6kw': 350
};

// Prix espace extérieur
export const exteriorSpacePrice = 50; // 50 € / m²

// Prix garden cottage
export const gardenCottagePrice = 800; // 800 €

// Prix micro-stand
export const microStandPrice = 1200; // 1200 € HT

// Prix co-exposition
export const coExpositionPrice = 400; // 400 € par co-exposant

// NOUVEAUX TARIFS AMÉNAGEMENTS
export const amenagementPrices = {
  // ÉQUIPEMENTS STANDS
  reservePorteMelamine: 200,          // Réserve d'1m² avec porte (cloisons mélaminées)
  moquetteDifferente: 6.5,            // Moquette coloris différent par m²
  velumStand: 15,                     // Velum (tissu tendu) par m²
  cloisonBoisGainee: 50,              // Cloison bois gainée tissu par ml
  reservePorteBois: 260,              // Réserve d'1m² avec porte (cloisons bois)
  bandeauSignaletique: 35,            // Bandeau signalétique par ml
  railSpots: 45,                      // Rail de 3 spots supplémentaires

  // MOBILIER
  comptoir: 165,                      // Comptoir
  tabouret: 40,                       // Tabouret
  mangeDebout: 90,                    // Mange-debout
  chaise: 40,                         // Chaise
  table120x60: 80,                    // Table 120x60cm
  mange3Tabourets: 195,               // Mange-debout + 3 tabourets
  ecran52: 395,                       // Écran 52" sur pied
  refrigerateur140: 125,              // Réfrigérateur 140L
  refrigerateur240: 210,              // Réfrigérateur 260L
  presentoirA4: 115,                  // Présentoir A4
  blocPrises: 18,                     // Bloc 3 prises
  fauteuil: 59,                       // Fauteuil
  tableBasse: 55,                     // Table basse ronde
  gueridonHaut: 75,                   // Guéridon haut 120cm
  poufCube: 33,                       // Pouf cube
  colonneVitrine: 350,                // Colonne vitrine
  comptoirVitrine: 350,               // Comptoir vitrine
  porteManteux: 51,                   // Porte-manteaux
  planteBambou: 80,                   // Plante bambou
  planteKentia: 80,                   // Plante kentia

  // PRODUITS COMPLÉMENTAIRES
  scanBadges: 150,                    // Scan badges visiteurs
  passSoiree: 50                      // Pass soirée
};

// Options de couleurs disponibles
export const couleursMoquette = ['Rouge', 'Bleu', 'Vert', 'Gris', 'Noir'];
export const couleursPouf = ['Rouge', 'Bleu', 'Vert', 'Gris', 'Noir'];

// Calcul des pass soirée inclus selon la surface du stand
export const getPassSoireeInclus = (standSize: string): number => {
  const size = parseInt(standSize) || 0;
  if (size === 6) return 2;
  if (size === 9) return 3;
  if (size === 12) return 4;
  if (size === 15) return 5;
  if (size >= 18) return 6;
  return 0;
};

// NOUVEAUX TARIFS VISIBILITÉ ET COMMUNICATION
export const visibilitePrices = {
  // HABILLAGE ET VISIBILITÉ DE VOTRE STAND
  packSignaletiqueComplet: 125,       // Pack signalétique complet - 125 €/m²
  signaletiqueComptoir: 180,          // Signalétique comptoir (condition: comptoir réservé)
  signaletiqueHautCloisons: 50,       // Signalétique haut de cloisons - 50 €/m²
  signalethqueCloisons: 185,          // Signalétique cloison complète - 185 €/cloison
  signaletiqueEnseigneHaute: 180,     // Signalétique enseigne haute

  // AMÉLIORATION DE VISIBILITÉ ET COMMUNICATION
  demiPageCatalogue: 700,             // 1/2 page quadri catalogue
  pageCompleeteCatalogue: 1200,       // 1 page quadri catalogue
  deuxiemeCouverture: 1800,           // Deuxième de couverture catalogue
  quatriemeCouverture: 2300,          // Quatrième de couverture catalogue
  logoplanSalon: 550,                 // Logo sur plan salon
  documentationSacVisiteur: 900,      // Documentation dans sac visiteur (3000 sacs, 4 entreprises)
  distributionHotesse: 700            // Distribution par hôtesse - 700 €/jour
};

// DEPRECATED - Garder pour compatibilité avec le code existant
export const equippeReadySizes = ['6', '9', '12', '15', '18', '21', '24', '27', '30'];