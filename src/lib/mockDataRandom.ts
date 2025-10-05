import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from './types';

/**
 * Mock data RANDOM - Configuration réaliste et cohérente
 * Simule un client réel avec une sélection partielle et logique
 */

export const mockFormDataRandom: FormData = {
  raisonSociale: 'Innovatech Industries',
  adresse: '78 Avenue Jean Jaurès',
  codePostal: '59300',
  ville: 'VALENCIENNES',
  pays: 'FRANCE',
  tel: '0327334455',
  siteInternet: 'https://innovatech.example.com',
  siret: '45612378945678',
  tvaIntra: 'FR45612378945',
  membreAssociation: false,  // Pas membre
  exposant2024: false,       // Nouveau participant
  activites: {
    industrie: true,
    transportLogistique: false,
    btpConstructionLogement: false,
    environnementEnergie: true,
    servicesEntreprises: false,
    imageNouvellesTechnologies: true,
    tourismeBienEtre: false,
    autre: false,
  },
  autreActivite: '',  // Pas d'autre activité
  facturationAdresse: '',  // Même adresse que l'entreprise
  facturationCP: '',
  facturationVille: '',
  facturationPays: '',
  contactComptaNom: 'Petit',
  contactComptaTel: '0327998877',
  contactComptaMail: 'comptabilite@innovatech.example.com',
  responsableNom: 'Lambert',
  responsablePrenom: 'Thomas',
  responsableTel: '0698765432',
  responsableMail: 'thomas.lambert@innovatech.example.com',
  respOpNom: 'Garcia',
  respOpPrenom: 'Marie',
  respOpTel: '0676543210',
  respOpMail: 'marie.garcia@innovatech.example.com',
  enseigne: 'INNOVATECH'
};

export const mockReservationDataRandom: ReservationData = {
  standType: 'ready',     // Pack prêt à exposer (plus simple)
  standSize: '15',        // Taille moyenne
  standAngles: 1,         // Un seul angle
  electricityUpgrade: '4kw',  // Puissance moyenne
  exteriorSpace: false,   // Pas d'espace extérieur
  exteriorSurface: '0',
  gardenCottage: false,   // Pas de cottage
  microStand: false,
  coExposants: []         // Pas de co-exposant
};

export const mockAmenagementDataRandom: AmenagementData = {
  // Équipements stands - Sélection partielle
  reservePorteMelamine: 1,      // Une réserve
  moquetteDifferente: 0,        // Pas de moquette différente
  moquetteCouleur: '',
  velumStand: 0,                // Pas de velum
  cloisonBoisGainee: 0,         // Pas de cloison bois
  reservePorteBois: 0,
  bandeauSignaletique: 0,       // Pas de bandeau

  // Mobilier - Configuration minimale mais fonctionnelle
  comptoir: 1,
  tabouret: 2,
  mangeDebout: 0,
  chaise: 4,
  table120x60: 1,
  mange3Tabourets: 0,
  ecran52: 1,                   // Un écran pour présentation
  refrigerateur140: 0,
  refrigerateur240: 1,          // Un seul frigo
  presentoirA4: 1,
  blocPrises: 1,
  fauteuil: 0,
  tableBasse: 1,
  gueridonHaut: 0,
  poufCube: 0,
  poufCouleur: '',
  colonneVitrine: 0,
  comptoirVitrine: 0,
  porteManteux: 1,
  planteBambou: 0,
  planteKentia: 1,              // Une plante pour décoration

  // Produits complémentaires
  scanBadges: true,             // Scan badges (recommandé)
  passSoiree: 2                 // Quelques pass supplémentaires
};

export const mockVisibiliteDataRandom: VisibiliteData = {
  // Signalétique - Budget moyen
  packSignaletiqueComplet: false,  // Pas le pack complet
  signaletiqueComptoir: true,      // Juste le comptoir
  signaletiqueHautCloisons: true,  // Et haut de cloisons
  signalethqueCloisons: 0,         // Pas de cloison complète
  signaletiqueEnseigneHaute: true, // Enseigne haute pour visibilité

  // Communication - Sélection ciblée
  demiPageCatalogue: true,         // 1/2 page catalogue
  pageCompleeteCatalogue: false,   // Pas de page complète
  deuxiemeCouverture: false,       // Pas de couverture
  quatriemeCouverture: false,
  logoplanSalon: true,             // Logo sur le plan (bonne visibilité/prix)
  documentationSacVisiteur: false, // Pas de doc dans sac
  distributionHotesse: false       // Pas de distribution hôtesse
};

export const mockEngagementDataRandom: EngagementData = {
  modeReglement: 'acompte',
  accepteReglement: true,
  dateSignature: new Date().toLocaleDateString('fr-FR'),
  cachetSignature: 'INNOVATECH — Signature électronique'
};
