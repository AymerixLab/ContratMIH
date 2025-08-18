import { ref, reactive, computed } from 'vue'
import type { FormData } from '@/types/form'
import type { 
  PdfGenerationData, 
  PdfGenerationResult, 
  PdfGenerationProgress,
  PdfSection,
  PdfPrestation
} from '@/types/pdf'
import { pdfGenerator } from '@/services/pdfGenerator'
import { googleSheetsService } from '@/services/googleSheets'

export function usePdfGeneration() {
  // State
  const isGenerating = ref(false)
  const progress = reactive<PdfGenerationProgress>({
    step: '',
    progress: 0,
    total: 100
  })
  const error = ref<string | null>(null)
  const result = ref<PdfGenerationResult | null>(null)

  // Computed
  const progressPercent = computed(() => {
    return progress.total > 0 ? Math.round((progress.progress / progress.total) * 100) : 0
  })

  const isComplete = computed(() => {
    return result.value?.success === true
  })

  const hasError = computed(() => {
    return error.value !== null || result.value?.success === false
  })

  /**
   * Convert form data to PDF generation format
   */
  function formatFormDataForPdf(formData: FormData, priceCalculation: any): PdfGenerationData {
    const sections: PdfSection[] = []

    // Section 1: Space Reservation
    const spaceSection = createSpaceReservationSection(formData.spaceReservation, priceCalculation)
    if (spaceSection.prestations.length > 0) {
      sections.push(spaceSection)
    }

    // Section 2: Optional Equipment
    const equipmentSection = createOptionalEquipmentSection(formData.optionalEquipment)
    if (equipmentSection.prestations.length > 0) {
      sections.push(equipmentSection)
    }

    // Section 3: Additional Products
    const productsSection = createAdditionalProductsSection(formData.additionalProducts)
    if (productsSection.prestations.length > 0) {
      sections.push(productsSection)
    }

    // Section 4: Communication
    const commSection = createCommunicationSection(formData.communication)
    if (commSection.prestations.length > 0) {
      sections.push(commSection)
    }

    return {
      contact: {
        raisonSociale: formData.company.raisonSociale,
        adresse: formData.company.adresse,
        codePostal: formData.company.codePostal,
        ville: formData.company.ville,
        pays: formData.company.pays,
        telephone: formData.company.telephone,
        siteInternet: formData.company.siteInternet,
        siret: formData.company.siret,
        tva: formData.company.tva,
        enseigne: formData.company.enseigne,
        contactNom: formData.contact.contactNom,
        contactTel: formData.contact.contactTel,
        contactMail: formData.contact.contactMail,
        respNom: formData.contact.respNom,
        respPrenom: formData.contact.respPrenom,
        respTel: formData.contact.respTel,
        respMail: formData.contact.respMail
      },
      sections,
      financial: {
        totalHT: priceCalculation.totalHT,
        tva: priceCalculation.tva,
        totalTTC: priceCalculation.totalTTC,
        acompte: priceCalculation.acompte,
        solde: priceCalculation.solde
      },
      signature: {
        nomSignataire: formData.signature.nomSignataire,
        dateSignature: formData.signature.dateSignature
      }
    }
  }

  /**
   * Create space reservation section
   */
  function createSpaceReservationSection(spaceData: any, priceCalc: any): PdfSection {
    const prestations: PdfPrestation[] = []
    const pricing: any = {
      standEquipeSurface: 270,
      standEquipeAngle: 185,
      pack12: 3552,
      pack15: 4438,
      pack18: 5326,
      packAngles: 185,
      standNuSurface: 225,
      standNuAngle: 185,
      power: { '0': 0, '220': 220, '260': 260, '350': 350 },
      surfaceExterieur: 50,
      cottage: 800
    }

    if (spaceData.standEquipeSurface > 0) {
      prestations.push({
        libelle: 'Stand équipé',
        quantity: spaceData.standEquipeSurface,
        unite: 'm²',
        prixUnitaire: pricing.standEquipeSurface,
        total: spaceData.standEquipeSurface * pricing.standEquipeSurface
      })
    }

    if (spaceData.standEquipeAngle > 0) {
      prestations.push({
        libelle: 'Angles stand équipé',
        quantity: spaceData.standEquipeAngle,
        unite: 'angle',
        prixUnitaire: pricing.standEquipeAngle,
        total: spaceData.standEquipeAngle * pricing.standEquipeAngle
      })
    }

    if (spaceData.pack12 > 0) {
      prestations.push({
        libelle: 'Pack « Prêt à exposer » 12 m²',
        quantity: spaceData.pack12,
        unite: 'pack',
        prixUnitaire: pricing.pack12,
        total: spaceData.pack12 * pricing.pack12
      })
    }

    if (spaceData.pack15 > 0) {
      prestations.push({
        libelle: 'Pack « Prêt à exposer » 15 m²',
        quantity: spaceData.pack15,
        unite: 'pack',
        prixUnitaire: pricing.pack15,
        total: spaceData.pack15 * pricing.pack15
      })
    }

    if (spaceData.pack18 > 0) {
      prestations.push({
        libelle: 'Pack « Prêt à exposer » 18 m²',
        quantity: spaceData.pack18,
        unite: 'pack',
        prixUnitaire: pricing.pack18,
        total: spaceData.pack18 * pricing.pack18
      })
    }

    if (spaceData.packAngles > 0) {
      prestations.push({
        libelle: 'Angles pack',
        quantity: spaceData.packAngles,
        unite: 'angle',
        prixUnitaire: pricing.packAngles,
        total: spaceData.packAngles * pricing.packAngles
      })
    }

    if (spaceData.standNuSurface > 0) {
      prestations.push({
        libelle: 'Stand nu',
        quantity: spaceData.standNuSurface,
        unite: 'm²',
        prixUnitaire: pricing.standNuSurface,
        total: spaceData.standNuSurface * pricing.standNuSurface
      })
    }

    if (spaceData.standNuAngle > 0) {
      prestations.push({
        libelle: 'Angles stand nu',
        quantity: spaceData.standNuAngle,
        unite: 'angle',
        prixUnitaire: pricing.standNuAngle,
        total: spaceData.standNuAngle * pricing.standNuAngle
      })
    }

    if (spaceData.puissance && spaceData.puissance !== '0') {
      const powerPrice = pricing.power[spaceData.puissance as keyof typeof pricing.power]
      if (powerPrice > 0) {
        const powerLabel = {
          '220': '2 kW',
          '260': '4 kW', 
          '350': '6 kW'
        }[spaceData.puissance] || spaceData.puissance + ' kW'
        
        prestations.push({
          libelle: `Coffret électrique ${powerLabel}`,
          quantity: 1,
          unite: 'coffret',
          prixUnitaire: powerPrice,
          total: powerPrice
        })
      }
    }

    if (spaceData.surfaceExterieur > 0) {
      prestations.push({
        libelle: 'Espace d\'exposition extérieur',
        quantity: spaceData.surfaceExterieur,
        unite: 'm²',
        prixUnitaire: pricing.surfaceExterieur,
        total: spaceData.surfaceExterieur * pricing.surfaceExterieur
      })
    }

    if (spaceData.cottage > 0) {
      prestations.push({
        libelle: 'Garden cottage (3 m × 3 m)',
        quantity: spaceData.cottage,
        unite: 'cottage',
        prixUnitaire: pricing.cottage,
        total: spaceData.cottage * pricing.cottage
      })
    }

    return {
      title: '1. Réservation d\'espace',
      prestations,
      total: priceCalc.section1Total
    }
  }

  /**
   * Create optional equipment section
   */
  function createOptionalEquipmentSection(equipmentData: any): PdfSection {
    const prestations: PdfPrestation[] = []
    const equipmentLabels: Record<string, { label: string, price: number, unit: string }> = {
      reserveMelamine: { label: 'Réserve 1 m² avec porte (cloisons mélaminées)', price: 200, unit: 'réserve' },
      moquetteDiff: { label: 'Moquette coloris différent', price: 6.5, unit: 'm²' },
      velum: { label: 'Velum (tissu tendu)', price: 15, unit: 'm²' },
      cloisonBoisTissu: { label: 'Cloison bois gainée tissu', price: 50, unit: 'ml' },
      reserveBois: { label: 'Réserve 1 m² avec porte (cloisons bois)', price: 260, unit: 'réserve' },
      railSpots: { label: 'Rail de 3 spots supplémentaires', price: 45, unit: 'rail' },
      mobilier_comptoir: { label: '1 comptoir', price: 165, unit: 'pièce' },
      mobilier_tabouret: { label: '1 tabouret', price: 40, unit: 'pièce' },
      mobilier_mangeDebout: { label: '1 mange‑debout', price: 90, unit: 'pièce' },
      mobilier_chaise: { label: '1 chaise', price: 40, unit: 'pièce' },
      mobilier_table120: { label: '1 table 120 × 60 cm', price: 80, unit: 'pièce' },
      mobilier_packMangeDebout: { label: '1 mange‑debout + 3 tabourets', price: 195, unit: 'pack' },
      mobilier_ecran52: { label: '1 écran 52 ″ sur pied (HDMI/VGA)', price: 395, unit: 'pièce' },
      mobilier_frigo140: { label: '1 réfrigérateur 140 L (85×60×60)', price: 125, unit: 'pièce' },
      mobilier_frigo260: { label: '1 réfrigérateur 260 L (140×60×60)', price: 210, unit: 'pièce' },
      mobilier_presentoir: { label: '1 présentoir pour documents A4', price: 115, unit: 'pièce' },
      mobilier_bandeau: { label: 'Bandeau signalétique pourtour stand', price: 35, unit: 'ml' },
      mobilier_blocPrises: { label: 'Bloc de 3 prises', price: 18, unit: 'bloc' },
      mobilier_fauteuil: { label: '1 fauteuil', price: 59, unit: 'pièce' },
      mobilier_tableBasse: { label: '1 table basse ronde (ø 60 cm)', price: 55, unit: 'pièce' },
      mobilier_gueridonHaut: { label: '1 guéridon haut 120 cm', price: 55, unit: 'pièce' },
      mobilier_poufCube: { label: '1 pouf cube 40×40×40 cm', price: 33, unit: 'pièce' },
      mobilier_colonneVitrine: { label: '1 colonne vitrine', price: 252, unit: 'pièce' },
      mobilier_comptoirVitrine: { label: '1 comptoir vitrine', price: 271, unit: 'pièce' },
      mobilier_porteManteaux: { label: '1 porte‑manteaux sur pied', price: 51, unit: 'pièce' },
      mobilier_planteBambou: { label: '1 plante bambou avec pot blanc', price: 50, unit: 'pièce' },
      mobilier_planteKentia: { label: '1 plante kentia avec pot blanc', price: 50, unit: 'pièce' }
    }

    Object.entries(equipmentData).forEach(([key, value]) => {
      if (typeof value === 'number' && value > 0 && equipmentLabels[key]) {
        const item = equipmentLabels[key]
        prestations.push({
          libelle: item.label,
          quantity: value,
          unite: item.unit,
          prixUnitaire: item.price,
          total: value * item.price
        })
      }
    })

    const total = prestations.reduce((sum, p) => sum + p.total, 0)

    return {
      title: '2. Aménagements optionnels',
      prestations,
      total
    }
  }

  /**
   * Create additional products section
   */
  function createAdditionalProductsSection(productsData: any): PdfSection {
    const prestations: PdfPrestation[] = []

    if (productsData.scanBadges) {
      prestations.push({
        libelle: 'Scan badges visiteurs',
        quantity: 1,
        unite: 'service',
        prixUnitaire: 150,
        total: 150
      })
    }

    if (productsData.passSoiree > 0) {
      prestations.push({
        libelle: 'Pass soirée',
        quantity: productsData.passSoiree,
        unite: 'pass',
        prixUnitaire: 50,
        total: productsData.passSoiree * 50
      })
    }

    const total = prestations.reduce((sum, p) => sum + p.total, 0)

    return {
      title: '3. Produits complémentaires',
      prestations,
      total
    }
  }

  /**
   * Create communication section
   */
  function createCommunicationSection(commData: any): PdfSection {
    const prestations: PdfPrestation[] = []
    const commLabels: Record<string, { label: string, price: number, unit: string }> = {
      visu_packComplet: { label: 'Pack signalétique complet', price: 1020, unit: 'pack' },
      visu_comptoir: { label: 'Signalétique comptoir', price: 180, unit: 'pièce' },
      visu_hautCloisons: { label: 'Signalétique haut de cloisons', price: 435, unit: 'pièce' },
      visu_cloisonComplete: { label: 'Signalétique cloison complète', price: 185, unit: 'pièce' },
      visu_enseigneHaute: { label: 'Signalétique enseigne haute', price: 180, unit: 'pièce' },
      ameli_invitations: { label: '500 invitations papier à personnaliser', price: 100, unit: 'lot' },
      ameli_demiPage: { label: '1/2 page quadri dans le catalogue des exposants', price: 700, unit: 'page' },
      ameli_unePage: { label: '1 page quadri dans le catalogue des exposants', price: 1200, unit: 'page' },
      ameli_deuxiemeCouverture: { label: 'Deuxième de couverture dans le catalogue', price: 1800, unit: 'page' },
      ameli_quatriemeCouverture: { label: 'Quatrième de couverture dans le catalogue', price: 2300, unit: 'page' },
      ameli_logoPlan: { label: 'Logo sur le plan du salon', price: 550, unit: 'logo' },
      ameli_goodies: { label: 'Documentation/Goodies dans sac visiteur', price: 900, unit: 'prestation' },
      ameli_hotesse: { label: 'Distribution communication par 1 hôtesse (2 jours)', price: 1500, unit: 'prestation' }
    }

    Object.entries(commData).forEach(([key, value]) => {
      if (typeof value === 'number' && value > 0 && commLabels[key]) {
        const item = commLabels[key]
        prestations.push({
          libelle: item.label,
          quantity: value,
          unite: item.unit,
          prixUnitaire: item.price,
          total: value * item.price
        })
      }
    })

    const total = prestations.reduce((sum, p) => sum + p.total, 0)

    return {
      title: '4. Visibilité & communication',
      prestations,
      total
    }
  }

  /**
   * Generate PDFs and optionally send to Google Sheets
   */
  async function generatePdfs(
    formData: FormData, 
    priceCalculation: any, 
    sendToSheets: boolean = true
  ): Promise<void> {
    try {
      isGenerating.value = true
      error.value = null
      result.value = null

      // Set up progress callback
      pdfGenerator.setProgressCallback((progressData) => {
        progress.step = progressData.step
        progress.progress = progressData.progress
        progress.total = progressData.total
      })

      // Format data for PDF generation
      const pdfData = formatFormDataForPdf(formData, priceCalculation)

      // Generate PDFs
      const pdfResult = await pdfGenerator.generateComplete(pdfData)
      result.value = pdfResult

      if (!pdfResult.success) {
        error.value = pdfResult.message
        return
      }

      // Send to Google Sheets if requested
      if (sendToSheets) {
        try {
          progress.step = 'Envoi vers Google Sheets...'
          progress.progress = 95
          progress.total = 100
          
          const sheetsResult = await googleSheetsService.sendData(
            formData,
            priceCalculation,
            pdfData.sections
          )
          
          if (!sheetsResult.success) {
            console.warn('Google Sheets export failed:', sheetsResult.error)
            // Don't fail the whole process for Google Sheets errors
          }
        } catch (sheetsError) {
          console.warn('Google Sheets export error:', sheetsError)
          // Don't fail the whole process for Google Sheets errors
        }
      }

      progress.step = 'Terminé!'
      progress.progress = 100

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
      result.value = {
        success: false,
        message: error.value
      }
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Reset state
   */
  function reset() {
    isGenerating.value = false
    progress.step = ''
    progress.progress = 0
    progress.total = 100
    error.value = null
    result.value = null
  }

  return {
    // State
    isGenerating,
    progress,
    error,
    result,
    
    // Computed
    progressPercent,
    isComplete,
    hasError,
    
    // Methods
    generatePdfs,
    reset
  }
}
