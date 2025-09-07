export type FieldMeta = {
  required?: boolean
  column?: string
}

export type SectionFieldMeta<T extends Record<string, any>> = {
  [K in keyof T]?: FieldMeta
}

export const FIELD_META = {
  company: {
    raisonSociale: { required: true, column: 'Raison sociale' },
    adresse: { required: true, column: 'Adresse' },
    codePostal: { required: true, column: 'Code postal' },
    ville: { required: true, column: 'Ville' },
    pays: { required: true, column: 'Pays' },
    telephone: { column: 'Téléphone' },
    siteInternet: { column: 'Site internet' },
    siret: { column: 'SIRET' },
    tva: { column: 'TVA intracommunautaire' },
    membrePorte: { column: 'Membre Porte du Hainaut' },
    exposant2024: { column: 'Exposant 2024' },
    activites: { column: 'Activités' },
    autreActivite: { column: 'Autre activité' },
    enseigne: { column: 'Enseigne' }
  },
  contact: {
    contactNom: { required: true, column: 'Contact Nom' },
    contactTel: { required: true, column: 'Contact Téléphone' },
    contactMail: { required: true, column: 'Contact Email' },
    factCodePostal: { column: 'Facturation Code postal' },
    factVille: { column: 'Facturation Ville' },
    factPays: { column: 'Facturation Pays' },
    respNom: { required: true, column: 'Responsable Nom' },
    respPrenom: { required: true, column: 'Responsable Prénom' },
    respTel: { required: true, column: 'Responsable Téléphone' },
    respMail: { required: true, column: 'Responsable Email' },
    opNom: { column: 'Opérationnel Nom' },
    opPrenom: { column: 'Opérationnel Prénom' },
    opTel: { column: 'Opérationnel Téléphone' },
    opMail: { column: 'Opérationnel Email' }
  },
  spaceReservation: {
    selectedStandType: { required: true, column: 'Type de stand' }
  },
  signature: {
    nomSignataire: { required: true, column: 'Nom signataire' },
    dateSignature: { required: true, column: 'Date signature' },
    acceptReglement: { required: true, column: 'Règlement accepté' }
  }
} as const

export type FormSections = keyof typeof FIELD_META

export const SECTION_TO_STEP: Record<FormSections, number> = {
  company: 1,
  contact: 2,
  spaceReservation: 3,
  // steps 4-6 have no required fields by default; they remain navigable
  // Only add entries here if you mark required fields in FIELD_META for them
  signature: 7
}

