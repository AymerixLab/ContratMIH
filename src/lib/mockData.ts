import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from './types';

/**
 * Mock data par défaut - Configuration réaliste et cohérente
 *
 * ⚠️  Ce fichier a été mis à jour pour garantir la cohérence des calculs.
 *
 * Pour tester d'autres configurations:
 * - mockDataFull.ts : Configuration maximale (tous les champs remplis)
 * - mockDataRandom.ts : Configuration alternative réaliste
 */

export const mockFormData: FormData = {
  raisonSociale: 'Innovatech Industries',
  adresse: '78 Avenue Jean Jaurès',
  codePostal: '59300',
  ville: 'VALENCIENNES',
  pays: 'FRANCE',
  tel: '0327334455',
  siteInternet: 'https://innovatech.example.com',
  siret: '45612378945678',
  tvaIntra: 'FR45612378945',
  membreAssociation: false,
  exposant2024: false,
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
  autreActivite: '',
  facturationAdresse: '',
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

export const mockReservationData: ReservationData = {
  standType: 'ready',
  standSize: '15',
  standAngles: 1,
  electricityUpgrade: '4kw',
  exteriorSpace: false,
  exteriorSurface: '0',
  gardenCottage: false,
  microStand: false,
  coExposants: []
};

export const mockAmenagementData: AmenagementData = {
  reservePorteMelamine: 1,
  moquetteDifferente: 0,
  moquetteCouleur: '',
  velumStand: 0,
  cloisonBoisGainee: 0,
  reservePorteBois: 0,
  bandeauSignaletique: 0,

  comptoir: 1,
  tabouret: 2,
  mangeDebout: 0,
  chaise: 4,
  table120x60: 1,
  mange3Tabourets: 0,
  ecran52: 1,
  refrigerateur140: 0,
  refrigerateur240: 1,
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
  planteKentia: 1,

  scanBadges: true,
  passSoiree: 2
};

export const mockVisibiliteData: VisibiliteData = {
  packSignaletiqueComplet: false,
  signaletiqueComptoir: true,
  signaletiqueHautCloisons: true,
  signalethqueCloisons: 0,
  signaletiqueEnseigneHaute: true,
  demiPageCatalogue: true,
  pageCompleeteCatalogue: false,
  deuxiemeCouverture: false,
  quatriemeCouverture: false,
  logoplanSalon: true,
  documentationSacVisiteur: false,
  distributionHotesse: false
};

export const mockEngagementData: EngagementData = {
  modeReglement: 'acompte',
  accepteReglement: true,
  dateSignature: new Date().toLocaleDateString('fr-FR'),
  cachetSignature: 'INNOVATECH — Signature électronique'
};

