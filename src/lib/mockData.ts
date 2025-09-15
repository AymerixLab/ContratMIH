import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from './types';

export const mockFormData: FormData = {
  raisonSociale: 'ACME Industries',
  adresse: '12 Rue des Forges',
  codePostal: '59800',
  ville: 'LILLE',
  pays: 'FRANCE',
  tel: '0320123456',
  siteInternet: 'https://acme.example.com',
  siret: '12345678901234',
  tvaIntra: 'FR12345678901',
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
  autreActivite: 'test',
  facturationAdresse: 'ZI Nord, 100 Avenue Centrale',
  facturationCP: '59300',
  facturationVille: 'VALENCIENNES',
  facturationPays: 'FRANCE',
  contactComptaNom: 'Dupont',
  contactComptaTel: '0320998877',
  contactComptaMail: 'compta@acme.example.com',
  responsableNom: 'Martin',
  responsablePrenom: 'Claire',
  responsableTel: '0601020304',
  responsableMail: 'claire.martin@acme.example.com',
  respOpNom: 'Durand',
  respOpPrenom: 'Alex',
  respOpTel: '0605060708',
  respOpMail: 'alex.durand@acme.example.com',
  enseigne: 'ACME'
};

export const mockReservationData: ReservationData = {
  standType: 'equipped',
  standSize: '18',
  standAngles: 2,
  electricityUpgrade: 'none',
  exteriorSpace: true,
  exteriorSurface: '12',
  gardenCottage: true,
  microStand: true,
  coExposants: [
    {
      id: '1',
      nomEntreprise: 'Beta Co',
      nomResponsable: 'Leroy',
      prenomResponsable: 'Nina',
      telResponsable: '0611223344',
      mailResponsable: 'nina.leroy@beta.example.com'
    }
  ]
};

export const mockAmenagementData: AmenagementData = {
  reservePorteMelamine: 1,
  moquetteDifferente: 18,
  moquetteCouleur: 'Bleu',
  velumStand: 18,
  cloisonBoisGainee: 6,
  reservePorteBois: 0,
  bandeauSignaletique: 6,
  
  comptoir: 1,
  tabouret: 2,
  mangeDebout: 1,
  chaise: 2,
  table120x60: 1,
  mange3Tabourets: 1,
  ecran52: 1,
  refrigerateur140: 1,
  refrigerateur240: 1,
  presentoirA4: 1,
  blocPrises: 2,
  fauteuil: 2,
  tableBasse: 1,
  gueridonHaut: 1,
  poufCube: 1,
  poufCouleur: 'Rouge',
  colonneVitrine: 1,
  comptoirVitrine: 1,
  porteManteux: 1,
  planteBambou: 1,
  planteKentia: 0,
  
  scanBadges: true,
  passSoiree: 3
};

export const mockVisibiliteData: VisibiliteData = {
  packSignaletiqueComplet: true,
  signaletiqueComptoir: true,
  signaletiqueHautCloisons: true,
  signalethqueCloisons: 2,
  signaletiqueEnseigneHaute: true,
  demiPageCatalogue: true,
  pageCompleeteCatalogue: true,
  deuxiemeCouverture: true,
  quatriemeCouverture: true,
  logoplanSalon: true,
  documentationSacVisiteur: true,
  distributionHotesse: true
};

export const mockEngagementData: EngagementData = {
  modeReglement: 'acompte',
  accepteReglement: true,
  dateSignature: new Date().toLocaleDateString('fr-FR'),
  cachetSignature: 'ACME — Signature'
};

