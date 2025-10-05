import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from './types';

/**
 * Mock data FULL - Remplit TOUS les champs disponibles
 * Utilisé pour tester que tous les mappings PDF fonctionnent correctement
 */

export const mockFormDataFull: FormData = {
  raisonSociale: 'TechCorp Solutions SARL',
  adresse: '45 Boulevard de la République',
  codePostal: '59000',
  ville: 'LILLE',
  pays: 'FRANCE',
  tel: '0320445566',
  siteInternet: 'https://techcorp-solutions.fr',
  siret: '98765432101234',
  tvaIntra: 'FR98765432101',
  membreAssociation: true,
  exposant2024: true,
  activites: {
    industrie: true,
    transportLogistique: true,
    btpConstructionLogement: true,
    environnementEnergie: true,
    servicesEntreprises: true,
    imageNouvellesTechnologies: true,
    tourismeBienEtre: true,
    autre: true,
  },
  autreActivite: 'Innovation & R&D',
  facturationAdresse: '12 Rue du Commerce',
  facturationCP: '59100',
  facturationVille: 'ROUBAIX',
  facturationPays: 'FRANCE',
  contactComptaNom: 'Bernard',
  contactComptaTel: '0320556677',
  contactComptaMail: 'compta@techcorp.fr',
  responsableNom: 'Rousseau',
  responsablePrenom: 'Sophie',
  responsableTel: '0612345678',
  responsableMail: 'sophie.rousseau@techcorp.fr',
  respOpNom: 'Lefebvre',
  respOpPrenom: 'Marc',
  respOpTel: '0687654321',
  respOpMail: 'marc.lefebvre@techcorp.fr',
  enseigne: 'TECHCORP'
};

export const mockReservationDataFull: ReservationData = {
  standType: 'equipped',  // Stand équipé (on ne peut en choisir qu'un)
  standSize: '24',        // Grande surface pour tester
  standAngles: 3,         // Maximum d'angles
  electricityUpgrade: '6kw',  // Maximum de puissance
  exteriorSpace: true,
  exteriorSurface: '20',  // Grande surface extérieure
  gardenCottage: true,    // Garden cottage inclus
  microStand: false,      // Incompatible avec un grand stand
  coExposants: [
    {
      id: '1',
      nomEntreprise: 'Partner Industries',
      nomResponsable: 'Moreau',
      prenomResponsable: 'Julie',
      telResponsable: '0623456789',
      mailResponsable: 'julie.moreau@partner.com'
    },
    {
      id: '2',
      nomEntreprise: 'Co-Expo Tech',
      nomResponsable: 'Dubois',
      prenomResponsable: 'Pierre',
      telResponsable: '0634567890',
      mailResponsable: 'pierre.dubois@coexpo.fr'
    }
  ]
};

export const mockAmenagementDataFull: AmenagementData = {
  // TOUS les équipements stands au maximum
  reservePorteMelamine: 2,
  moquetteDifferente: 24,   // Correspond à la surface du stand
  moquetteCouleur: 'Bleu marine',
  velumStand: 24,
  cloisonBoisGainee: 12,    // Plusieurs mètres linéaires
  reservePorteBois: 1,
  bandeauSignaletique: 12,

  // TOUT le mobilier (quantités réalistes mais maximales)
  comptoir: 2,
  tabouret: 6,
  mangeDebout: 2,
  chaise: 8,
  table120x60: 3,
  mange3Tabourets: 2,
  ecran52: 2,
  refrigerateur140: 1,
  refrigerateur240: 1,
  presentoirA4: 3,
  blocPrises: 4,
  fauteuil: 4,
  tableBasse: 2,
  gueridonHaut: 2,
  poufCube: 4,
  poufCouleur: 'Gris anthracite',
  colonneVitrine: 2,
  comptoirVitrine: 1,
  porteManteux: 2,
  planteBambou: 2,
  planteKentia: 2,

  // TOUS les produits complémentaires
  scanBadges: true,
  passSoiree: 10  // Maximum de pass supplémentaires
};

export const mockVisibiliteDataFull: VisibiliteData = {
  // TOUTE la signalétique
  packSignaletiqueComplet: true,
  signaletiqueComptoir: true,
  signaletiqueHautCloisons: true,
  signalethqueCloisons: 4,  // Plusieurs cloisons
  signaletiqueEnseigneHaute: true,

  // TOUTES les options de communication
  demiPageCatalogue: true,
  pageCompleeteCatalogue: true,
  deuxiemeCouverture: true,
  quatriemeCouverture: true,
  logoplanSalon: true,
  documentationSacVisiteur: true,
  distributionHotesse: true
};

export const mockEngagementDataFull: EngagementData = {
  modeReglement: 'acompte',
  accepteReglement: true,
  dateSignature: new Date().toLocaleDateString('fr-FR'),
  cachetSignature: 'TECHCORP SOLUTIONS — Validé et approuvé'
};
