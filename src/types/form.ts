export interface CompanyInfo {
  raisonSociale: string
  adresse: string
  codePostal: string
  ville: string
  pays: string
  telephone: string
  siteInternet: string
  siret: string
  tva: string
  membrePorte: boolean
  exposant2024: boolean
  activites: string[]
  autreActivite?: string
  enseigne: string
}

export interface CoExposant {
  nomEntreprise: string
  nom: string
  prenom: string
  email: string
  telephone: string
}

export interface ContactInfo {
  factCodePostal: string
  factVille: string
  factPays: string
  contactNom: string
  contactTel: string
  contactMail: string
  respNom: string
  respPrenom: string
  respTel: string
  respMail: string
  opNom: string
  opPrenom: string
  opTel: string
  opMail: string
}

export interface SpaceReservation {
  // Stand Type Selection (mutually exclusive)
  selectedStandType?: 'standEquipe' | 'standPretAExposer' | 'standNu'
  
  // Stand Équipé
  standEquipeSurface: number
  standEquipeAngle: number
  
  // Stand Prêt à Exposer (Packs)
  pack12: number
  pack15: number
  pack18: number
  packAngles: number
  
  // Stand Nu
  standNuSurface: number
  standNuAngle: number
  
  // Common options
  puissance: string
  surfaceExterieur: number
  cottage: number
  moquetteCouleur?: string
  coExposants: CoExposant[]
}

export interface OptionalEquipment {
  reserveMelamine: number
  velum: number
  cloisonBoisTissu: number
  reserveBois: number
  railSpots: number
  bandeauSignaletique: number
  mobilier_comptoir: number
  mobilier_tabouret: number
  mobilier_mangeDebout: number
  mobilier_chaise: number
  mobilier_table120: number
  mobilier_packMangeDebout: number
  mobilier_ecran52: number
  mobilier_frigo140: number
  mobilier_frigo260: number
  mobilier_presentoir: number
  mobilier_blocPrises: number
  mobilier_fauteuil: number
  mobilier_tableBasse: number
  mobilier_gueridonHaut: number
  mobilier_poufCube: number
  mobilier_colonneVitrine: number
  mobilier_comptoirVitrine: number
  mobilier_porteManteaux: number
  mobilier_planteBambou: number
  mobilier_planteKentia: number
}

export interface AdditionalProducts {
  scanBadges: boolean
  passSoiree: number
}

export interface Communication {
  visu_packComplet: number
  visu_comptoir: number
  visu_hautCloisons: number
  visu_cloisonComplete: number
  visu_enseigneHaute: number
  ameli_invitations: number
  ameli_demiPage: number
  ameli_unePage: number
  ameli_catalogueDemiPage: number
  ameli_catalogueUnePage: number
  ameli_deuxiemeCouverture: number
  ameli_quatriemeCouverture: number
  ameli_logoPlan: number
  ameli_goodies: number
  ameli_goodiesDescription?: string
  ameli_hotesse: number
}

export interface ContractSignature {
  nomSignataire: string
  dateSignature: string
  acceptReglement: boolean
}

export interface FormData {
  company: CompanyInfo
  contact: ContactInfo
  spaceReservation: SpaceReservation
  optionalEquipment: OptionalEquipment
  additionalProducts: AdditionalProducts
  communication: Communication
  signature: ContractSignature
}

export interface PriceCalculation {
  section1Total: number
  section2Total: number
  section3Total: number
  section4Total: number
  totalHT: number
  tva: number
  totalTTC: number
  acompte: number
  solde: number
}

export interface FormStep {
  id: number
  title: string
  isCompleted: boolean
  isValid: boolean
}

export const ACTIVITY_OPTIONS = [
  'Industrie',
  'Environnement, énergie et développement durable',
  'Tourisme et bien‑être',
  'Transport et logistique',
  'Services aux entreprises',
  'BTP, construction et logement',
  'Image et nouvelles technologies',
  'Autre'
] as const

export const POWER_OPTIONS = [
  { value: '0', label: '0 € (1 kW de base)', price: 0 },
  { value: '220', label: '2 kW – 220 €', price: 220 },
  { value: '260', label: '4 kW – 260 €', price: 260 },
  { value: '350', label: '6 kW – 350 €', price: 350 }
] as const

export const STAND_EQUIPE_SIZES = [
  { value: 6, label: '6 m²' },
  { value: 9, label: '9 m²' },
  { value: 12, label: '12 m²' },
  { value: 15, label: '15 m²' },
  { value: 18, label: '18 m²' },
  { value: 21, label: '21 m²' },
  { value: 24, label: '24 m²' },
  { value: 27, label: '27 m²' },
  { value: 30, label: '30 m²' }
] as const

export const PACK_SIZES = [
  { value: 12, label: '12 m²' },
  { value: 15, label: '15 m²' },
  { value: 18, label: '18 m²' }
] as const

export const MOQUETTE_COLORS = [
  'Rouge',
  'Vert', 
  'Bleu',
  'Noir',
  'Gris'
] as const