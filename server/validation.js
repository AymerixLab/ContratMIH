import { z } from 'zod';

// Schémas de validation Zod pour sécuriser les données entrantes

export const MAX_TOTAL_VALUE = 9_999_999_999.99;

const createTotalValidator = (label) =>
  z.number({
    required_error: `${label} est requis`,
    invalid_type_error: `${label} doit être un nombre`,
  })
    .min(0, `${label} doit être positif`)
    .max(
      MAX_TOTAL_VALUE,
      `${label} dépasse le plafond autorisé (9 999 999 999,99 €)`
    );

const CoExposantSchema = z.object({
  id: z.string().optional(),
  nomEntreprise: z.string().min(1, 'Nom entreprise requis'),
  nomResponsable: z.string().optional(),
  prenomResponsable: z.string().optional(),
  telResponsable: z.string().optional(),
  mailResponsable: z.string().email().optional().or(z.literal('')),
});

const FormDataSchema = z.object({
  raisonSociale: z.string().min(1, 'Raison sociale requise'),
  adresse: z.string().min(1, 'Adresse requise'),
  codePostal: z.string().min(1, 'Code postal requis'),
  ville: z.string().min(1, 'Ville requise'),
  pays: z.string().min(1, 'Pays requis'),
  tel: z.string().min(8, 'Téléphone requis'),
  siteInternet: z.string().optional(),
  siret: z.string().optional(),
  tvaIntra: z.string().optional(),
  membreAssociation: z.boolean(),
  exposant2024: z.boolean(),
  activites: z.object({
    industrie: z.boolean(),
    transportLogistique: z.boolean(),
    btpConstructionLogement: z.boolean(),
    environnementEnergie: z.boolean(),
    servicesEntreprises: z.boolean(),
    imageNouvellesTechnologies: z.boolean(),
    tourismeBienEtre: z.boolean(),
    autre: z.boolean(),
  }),
  autreActivite: z.string().optional(),
  facturationAdresse: z.string().optional(),
  facturationCP: z.string().optional(),
  facturationVille: z.string().optional(),
  facturationPays: z.string().optional(),
  contactComptaNom: z.string().optional(),
  contactComptaTel: z.string().optional(),
  contactComptaMail: z.string().email().optional().or(z.literal('')),
  responsableNom: z.string().optional(),
  responsablePrenom: z.string().optional(),
  responsableTel: z.string().optional(),
  responsableMail: z.string().email().optional().or(z.literal('')),
  respOpNom: z.string().optional(),
  respOpPrenom: z.string().optional(),
  respOpTel: z.string().optional(),
  respOpMail: z.string().email().optional().or(z.literal('')),
  enseigne: z.string().optional(),
});

const ReservationDataSchema = z.object({
  standType: z.enum(['equipped', 'ready', 'bare']).nullable(),
  standSize: z.string(),
  standAngles: z.number().int().min(0).max(10),
  electricityUpgrade: z.string(),
  exteriorSpace: z.boolean(),
  exteriorSurface: z.string(),
  gardenCottage: z.boolean(),
  microStand: z.boolean(),
  coExposants: z.array(CoExposantSchema),
});

const AmenagementDataSchema = z.object({
  // ÉQUIPEMENTS STANDS
  reservePorteMelamine: z.number().int().min(0),
  moquetteDifferente: z.number().int().min(0),
  moquetteCouleur: z.string(),
  velumStand: z.number().int().min(0),
  cloisonBoisGainee: z.number().int().min(0),
  reservePorteBois: z.number().int().min(0),
  bandeauSignaletique: z.number().int().min(0),

  // MOBILIER
  comptoir: z.number().int().min(0),
  tabouret: z.number().int().min(0),
  mangeDebout: z.number().int().min(0),
  chaise: z.number().int().min(0),
  table120x60: z.number().int().min(0),
  mange3Tabourets: z.number().int().min(0),
  ecran52: z.number().int().min(0),
  refrigerateur140: z.number().int().min(0),
  refrigerateur240: z.number().int().min(0),
  presentoirA4: z.number().int().min(0),
  blocPrises: z.number().int().min(0),
  fauteuil: z.number().int().min(0),
  tableBasse: z.number().int().min(0),
  gueridonHaut: z.number().int().min(0),
  poufCube: z.number().int().min(0),
  poufCouleur: z.string(),
  colonneVitrine: z.number().int().min(0),
  comptoirVitrine: z.number().int().min(0),
  porteManteux: z.number().int().min(0),
  planteBambou: z.number().int().min(0),
  planteKentia: z.number().int().min(0),

  // PRODUITS COMPLÉMENTAIRES
  scanBadges: z.boolean(),
  passSoiree: z.number().int().min(0),
});

const VisibiliteDataSchema = z.object({
  packSignaletiqueComplet: z.boolean(),
  signaletiqueComptoir: z.boolean(),
  signaletiqueHautCloisons: z.boolean(),
  signalethqueCloisons: z.number().int().min(0),
  signaletiqueEnseigneHaute: z.boolean(),
  demiPageCatalogue: z.boolean(),
  pageCompleeteCatalogue: z.boolean(),
  deuxiemeCouverture: z.boolean(),
  quatriemeCouverture: z.boolean(),
  logoplanSalon: z.boolean(),
  documentationSacVisiteur: z.boolean(),
  distributionHotesse: z.boolean(),
  distributionHotesseDays: z.number().int().min(0).max(2),
  distributionHotesseSelectedDay: z.number().int().min(1).max(2).nullable(),
}).superRefine((data, ctx) => {
  if (data.distributionHotesseDays === 1 && (data.distributionHotesseSelectedDay !== 1 && data.distributionHotesseSelectedDay !== 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Veuillez sélectionner Jour 1 ou Jour 2 pour la distribution par hôtesse.',
      path: ['distributionHotesseSelectedDay'],
    });
  }
});

const EngagementDataSchema = z.object({
  modeReglement: z.enum(['acompte', 'solde', 'virement']),
  accepteReglement: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter le règlement',
  }),
  accepteCommunication: z.boolean(),
  dateSignature: z.preprocess((value) => {
    if (value === null || value === undefined) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      return new Date(trimmed);
    }
    return value;
  }, z.date().nullable()),
  cachetSignature: z.string().optional(),
});

const TotalsSchema = z.object({
  totalHT1: createTotalValidator('Total HT section 1'),
  totalHT2: createTotalValidator('Total HT section 2'),
  totalHT3: createTotalValidator('Total HT section 3'),
  totalHT4: createTotalValidator('Total HT section 4'),
  totalHT: createTotalValidator('Total HT global'),
  tva: createTotalValidator('TVA'),
  totalTTC: createTotalValidator('Total TTC'),
});

export const SubmissionSchema = z.object({
  formData: FormDataSchema,
  reservationData: ReservationDataSchema,
  amenagementData: AmenagementDataSchema,
  visibiliteData: VisibiliteDataSchema,
  engagementData: EngagementDataSchema,
  totals: TotalsSchema,
  submittedAt: z.string().optional(),
});
