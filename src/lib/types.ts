export type CurrentPage = 'identity' | 'reservation' | 'amenagements' | 'visibilite' | 'engagement' | 'thanks';

export type StandType = 'equipped' | 'ready' | 'bare' | null;

export interface CoExposant {
  id: string;
  nomEntreprise: string;
  nomResponsable: string;
  prenomResponsable: string;
  telResponsable: string;
  mailResponsable: string;
}

export interface FormData {
  raisonSociale: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  tel: string;
  siteInternet: string;
  siret: string;
  tvaIntra: string;
  membreAssociation: boolean;
  exposant2024: boolean;
  activites: {
    industrie: boolean;
    transportLogistique: boolean;
    btpConstructionLogement: boolean;
    environnementEnergie: boolean;
    servicesEntreprises: boolean;
    imageNouvellesTechnologies: boolean;
    tourismeBienEtre: boolean;
    autre: boolean;
  };
  autreActivite: string;
  facturationAdresse: string;
  facturationCP: string;
  facturationVille: string;
  facturationPays: string;
  contactComptaNom: string;
  contactComptaTel: string;
  contactComptaMail: string;
  responsableNom: string;
  responsablePrenom: string;
  responsableTel: string;
  responsableMail: string;
  respOpNom: string;
  respOpPrenom: string;
  respOpTel: string;
  respOpMail: string;
  enseigne: string;
}

export interface ReservationData {
  standType: StandType;
  standSize: string;
  standAngles: number;
  electricityUpgrade: string;
  exteriorSpace: boolean;
  exteriorSurface: string;
  gardenCottage: boolean;
  microStand: boolean;
  coExposants: CoExposant[];
}

export interface AmenagementData {
  // ÉQUIPEMENTS STANDS
  reservePorteMelamine: number;        // Réserve d'1m² avec porte (cloisons mélaminées) - 200€
  moquetteDifferente: number;          // Moquette coloris différent - 6,50€/m²
  moquetteCouleur: string;             // Couleur choisie pour la moquette
  velumStand: number;                  // Velum (tissu tendu) - 15€/m²
  cloisonBoisGainee: number;           // Cloison bois gainée tissu - 50€/ml
  reservePorteBois: number;            // Réserve d'1m² avec porte (cloisons bois) - 260€
  bandeauSignaletique: number;         // Bandeau signalétique - 35€/ml

  // MOBILIER
  comptoir: number;                    // Comptoir - 165€
  tabouret: number;                    // Tabouret - 40€
  mangeDebout: number;                 // Mange-debout - 90€
  chaise: number;                      // Chaise - 40€
  table120x60: number;                 // Table 120x60cm - 80€
  mange3Tabourets: number;             // Mange-debout + 3 tabourets - 195€
  ecran52: number;                     // Écran 52" - 395€
  refrigerateur140: number;            // Réfrigérateur 140L - 125€
  refrigerateur240: number;            // Réfrigérateur 260L - 210€
  presentoirA4: number;                // Présentoir A4 - 115€
  blocPrises: number;                  // Bloc 3 prises - 18€
  fauteuil: number;                    // Fauteuil - 59€
  tableBasse: number;                  // Table basse ronde - 55€
  gueridonHaut: number;                // Guéridon haut 120cm - 55€
  poufCube: number;                    // Pouf cube - 33€
  poufCouleur: string;                 // Couleur du pouf cube
  colonneVitrine: number;              // Colonne vitrine - 252€
  comptoirVitrine: number;             // Comptoir vitrine - 271€
  porteManteux: number;                // Porte-manteaux - 51€
  planteBambou: number;                // Plante bambou - 50€
  planteKentia: number;                // Plante kentia - 50€

  // PRODUITS COMPLÉMENTAIRES
  scanBadges: boolean;                 // Scan badges visiteurs - 150€
  passSoiree: number;                  // Pass soirée complémentaires - 50€/unité
}

export interface VisibiliteData {
  packSignaletiqueComplet: boolean;
  signaletiqueComptoir: boolean;
  signaletiqueHautCloisons: boolean;
  signalethqueCloisons: number;
  signaletiqueEnseigneHaute: boolean;
  demiPageCatalogue: boolean;
  pageCompleeteCatalogue: boolean;
  deuxiemeCouverture: boolean;
  quatriemeCouverture: boolean;
  logoplanSalon: boolean;
  documentationSacVisiteur: boolean;
  distributionHotesse: boolean;
}

export interface EngagementData {
  modeReglement: 'acompte' | 'solde' | 'virement';
  accepteReglement: boolean;
  dateSignature: string;
  cachetSignature: string;
}