export interface PdfPrestation {
  libelle: string
  quantity: number
  unite: string
  prixUnitaire: number
  total: number
}

export interface PdfSection {
  title: string
  prestations: PdfPrestation[]
  total: number
}

export interface PdfContactData {
  raisonSociale: string
  adresse: string
  codePostal: string
  ville: string
  pays: string
  telephone?: string
  siteInternet?: string
  siret?: string
  tva?: string
  enseigne?: string
  contactNom?: string
  contactTel?: string
  contactMail?: string
  respNom?: string
  respPrenom?: string
  respTel?: string
  respMail?: string
}

export interface PdfFinancialData {
  totalHT: number
  tva: number
  totalTTC: number
  acompte: number
  solde: number
}

export interface PdfGenerationData {
  contact: PdfContactData
  sections: PdfSection[]
  financial: PdfFinancialData
  signature: {
    nomSignataire: string
    dateSignature: string
  }
}

export interface ContractImage {
  page: number
  dataUrl: string
  width: number
  height: number
}

export interface PdfGenerationProgress {
  step: string
  progress: number
  total: number
}

export interface PdfGenerationResult {
  success: boolean
  message: string
  zipBlob?: Blob
  filename?: string
}