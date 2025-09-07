import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { FormData, FormStep, PriceCalculation } from '@/types/form'
import { FIELD_META, SECTION_TO_STEP } from '@/types/fields'

const FORM_STORAGE_KEY = 'mih-contract-form'

export const useFormStore = defineStore('form', () => {
  // State
  const currentStep = ref(1)
  const formData = ref<FormData>({
    company: {
      raisonSociale: '',
      adresse: '',
      codePostal: '',
      ville: '',
      pays: 'France',
      telephone: '',
      siteInternet: '',
      siret: '',
      tva: '',
      membrePorte: false,
      exposant2024: false,
      activites: [],
      autreActivite: '',
      enseigne: ''
    },
    contact: {
      factCodePostal: '',
      factVille: '',
      factPays: '',
      contactNom: '',
      contactTel: '',
      contactMail: '',
      respNom: '',
      respPrenom: '',
      respTel: '',
      respMail: '',
      opNom: '',
      opPrenom: '',
      opTel: '',
      opMail: ''
    },
    spaceReservation: {
      selectedStandType: undefined,
      standEquipeSurface: 0,
      standEquipeAngle: 0,
      pack12: 0,
      pack15: 0,
      pack18: 0,
      packAngles: 0,
      standNuSurface: 0,
      standNuAngle: 0,
      puissance: '0',
      surfaceExterieur: 0,
      cottage: 0,
      moquetteCouleur: '',
      coExposants: []
    },
    optionalEquipment: {
      reserveMelamine: 0,
      velum: 0,
      cloisonBoisTissu: 0,
      reserveBois: 0,
      railSpots: 0,
      bandeauSignaletique: 0,
      mobilier_comptoir: 0,
      mobilier_tabouret: 0,
      mobilier_mangeDebout: 0,
      mobilier_chaise: 0,
      mobilier_table120: 0,
      mobilier_packMangeDebout: 0,
      mobilier_ecran52: 0,
      mobilier_frigo140: 0,
      mobilier_frigo260: 0,
      mobilier_presentoir: 0,
      mobilier_blocPrises: 0,
      mobilier_fauteuil: 0,
      mobilier_tableBasse: 0,
      mobilier_gueridonHaut: 0,
      mobilier_poufCube: 0,
      mobilier_colonneVitrine: 0,
      mobilier_comptoirVitrine: 0,
      mobilier_porteManteaux: 0,
      mobilier_planteBambou: 0,
      mobilier_planteKentia: 0
    },
    additionalProducts: {
      scanBadges: false,
      passSoiree: 0
    },
    communication: {
      visu_packComplet: 0,
      visu_comptoir: 0,
      visu_hautCloisons: 0,
      visu_cloisonComplete: 0,
      visu_enseigneHaute: 0,
      ameli_invitations: 0,
      ameli_demiPage: 0,
      ameli_unePage: 0,
      ameli_catalogueDemiPage: 0,
      ameli_catalogueUnePage: 0,
      ameli_deuxiemeCouverture: 0,
      ameli_quatriemeCouverture: 0,
      ameli_logoPlan: 0,
      ameli_goodies: 0,
      ameli_goodiesDescription: '',
      ameli_hotesse: 0
    },
    signature: {
      nomSignataire: '',
      dateSignature: '',
      acceptReglement: false
    }
  })

  const stepValidation = ref<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  })

  // Pricing structure
  const pricing = {
    standEquipeSurface: 270,
    standEquipeAngle: 185,
    pack12: 3552,
    pack15: 4440,
    pack18: 5328,
    packAngles: 185,
    standNuSurface: 225,
    standNuAngle: 185,
    power: { '0': 0, '220': 220, '260': 260, '350': 350 },
    surfaceExterieur: 50,
    cottage: 800,
    coExposant: 400,
    reserveMelamine: 200,
    moquetteDiff: 6.5,
    velum: 15,
    cloisonBoisTissu: 35,
    reserveBois: 260,
    railSpots: 35,
    bandeauSignaletique: 35,
    mobilier_comptoir: 165,
    mobilier_tabouret: 40,
    mobilier_mangeDebout: 90,
    mobilier_chaise: 40,
    mobilier_table120: 80,
    mobilier_packMangeDebout: 195,
    mobilier_ecran52: 395,
    mobilier_frigo140: 125,
    mobilier_frigo260: 210,
    mobilier_presentoir: 115,
    mobilier_blocPrises: 18,
    mobilier_fauteuil: 59,
    mobilier_tableBasse: 55,
    mobilier_gueridonHaut: 55,
    mobilier_poufCube: 33,
    mobilier_colonneVitrine: 252,
    mobilier_comptoirVitrine: 271,
    mobilier_porteManteaux: 51,
    mobilier_planteBambou: 50,
    mobilier_planteKentia: 50,
    scanBadges: 150,
    passSoiree: 50,
    visu_packComplet: 1020,
    visu_comptoir: 180,
    visu_hautCloisons: 435,
    visu_cloisonComplete: 185,
    visu_enseigneHaute: 225,
    ameli_invitations: 100,
    ameli_demiPage: 700,
    ameli_unePage: 1200,
    ameli_deuxiemeCouverture: 1800,
    ameli_quatriemeCouverture: 2300,
    ameli_logoPlan: 550,
    ameli_goodies: 900,
    ameli_hotesse: 1500
  }

  // Getters
  const steps = computed<FormStep[]>(() => [
    { id: 1, title: 'Identité de l\'entreprise', isCompleted: stepValidation.value[1], isValid: stepValidation.value[1] },
    { id: 2, title: 'Coordonnées de contact', isCompleted: stepValidation.value[2], isValid: stepValidation.value[2] },
    { id: 3, title: 'Réservation d\'espace', isCompleted: stepValidation.value[3], isValid: stepValidation.value[3] },
    { id: 4, title: 'Équipements optionnels', isCompleted: stepValidation.value[4], isValid: stepValidation.value[4] },
    { id: 5, title: 'Produits complémentaires', isCompleted: stepValidation.value[5], isValid: stepValidation.value[5] },
    { id: 6, title: 'Communication', isCompleted: stepValidation.value[6], isValid: stepValidation.value[6] },
    { id: 7, title: 'Validation et signature', isCompleted: stepValidation.value[7], isValid: stepValidation.value[7] }
  ])

  const progressPercent = computed(() => {
    const completedSteps = Object.values(stepValidation.value).filter(Boolean).length
    return Math.round((completedSteps / 7) * 100)
  })

  const priceCalculation = computed<PriceCalculation>(() => {
    const space = formData.value.spaceReservation
    const equipment = formData.value.optionalEquipment
    const products = formData.value.additionalProducts
    const communication = formData.value.communication

    // Section 1: Space Reservation
    const section1Total = 
      space.standEquipeSurface * pricing.standEquipeSurface +
      space.standEquipeAngle * pricing.standEquipeAngle +
      space.pack12 * pricing.pack12 +
      space.pack15 * pricing.pack15 +
      space.pack18 * pricing.pack18 +
      space.packAngles * pricing.packAngles +
      space.standNuSurface * pricing.standNuSurface +
      space.standNuAngle * pricing.standNuAngle +
      pricing.power[space.puissance as keyof typeof pricing.power] +
      space.surfaceExterieur * pricing.surfaceExterieur +
      space.cottage * pricing.cottage +
      (space.coExposants ? space.coExposants.length * pricing.coExposant : 0)

    // Section 2: Optional Equipment
    const section2Total = Object.entries(equipment).reduce((total, [key, value]) => {
      if (key in pricing && typeof value === 'number') {
        return total + value * (pricing as any)[key]
      }
      return total
    }, 0)

    // Section 3: Additional Products
    const section3Total = 
      (products.scanBadges ? pricing.scanBadges : 0) +
      products.passSoiree * pricing.passSoiree

    // Section 4: Communication
    const section4Total = Object.entries(communication).reduce((total, [key, value]) => {
      if (key in pricing && typeof value === 'number') {
        return total + value * (pricing as any)[key]
      }
      return total
    }, 0)

    const totalHT = section1Total + section2Total + section3Total + section4Total
    const tva = totalHT * 0.20
    const totalTTC = totalHT + tva
    const acompte = totalTTC * 0.50
    const solde = totalTTC - acompte

    return {
      section1Total,
      section2Total,
      section3Total,
      section4Total,
      totalHT,
      tva,
      totalTTC,
      acompte,
      solde
    }
  })

  // No automatic watching - save only on navigation

  // Actions
  const setCurrentStep = (step: number) => {
    if (step >= 1 && step <= 7) {
      console.log('📍 Navigating to step:', step)
      saveToStorage() // Save before changing step
      currentStep.value = step
    }
  }

  const nextStep = () => {
    if (currentStep.value < 7) {
      console.log('➡️ Moving to next step')
      saveToStorage() // Save before moving
      currentStep.value++
    }
  }

  const previousStep = () => {
    if (currentStep.value > 1) {
      console.log('⬅️ Moving to previous step')
      saveToStorage() // Save before moving
      currentStep.value--
    }
  }

  const updateFormData = (section: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    console.log('📝 updateFormData called:', { section, data, currentFormData: formData.value[section] })
    ;(formData.value[section] as any) = { ...formData.value[section], ...data }
    console.log('✅ Form data updated:', { section, newData: formData.value[section] })
    // Recompute step validity for sections that have required metadata
    recomputeStepValidityForSection(section)
    // No automatic save - only save on navigation
  }

  const validateStep = (step: number, _isValid: boolean) => {
    // Ignore external boolean and compute from required metadata for determinism
    stepValidation.value[step] = computeStepValidity(step)
    // No automatic save - only save on navigation
  }

  const computeStepValidity = (step: number): boolean => {
    // Find section key by step
    const sectionEntry = Object.entries(SECTION_TO_STEP).find(([, s]) => s === step)
    if (!sectionEntry) return true // no required metadata for this step -> valid
    const [sectionKey] = sectionEntry as [keyof typeof SECTION_TO_STEP, number]
    const meta = FIELD_META[sectionKey as keyof typeof FIELD_META]
    if (!meta) return true

    // Check required fields presence (simple non-empty validation)
    const sectionData: any = (formData.value as any)[sectionKey]
    return Object.entries(meta).every(([key, cfg]) => {
      if (!cfg?.required) return true
      const val = sectionData?.[key]
      if (typeof val === 'string') return val.trim().length > 0
      if (typeof val === 'number') return !Number.isNaN(val)
      if (typeof val === 'boolean') return val === true
      if (Array.isArray(val)) return val.length > 0
      return !!val
    })
  }

  const recomputeStepValidityForSection = (section: keyof FormData) => {
    // Map section to step if declared, otherwise no-op
    const step = (SECTION_TO_STEP as any)[section]
    if (step) {
      stepValidation.value[step] = computeStepValidity(step)
    }
  }

  const saveToStorage = () => {
    try {
      const payload = {
        formData: formData.value,
        stepValidation: stepValidation.value,
        currentStep: currentStep.value
      }
      console.log('💾 Saving to localStorage:', FORM_STORAGE_KEY, payload)
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload))
      console.log('✅ Successfully saved to localStorage')
    } catch (error) {
      console.error('❌ Failed to save form to storage:', error)
    }
  }

  const loadFromStorage = () => {
    try {
      console.log('📂 Loading from localStorage:', FORM_STORAGE_KEY)
      const savedData = localStorage.getItem(FORM_STORAGE_KEY)
      
      if (savedData) {
        const saved = JSON.parse(savedData) as {
          formData: FormData
          stepValidation: Record<number, boolean>
          currentStep: number
        }
        console.log('📁 Loaded data from localStorage:', saved)
        
        if (saved.formData) {
          console.log('🔄 Restoring form data...', saved.formData)
          
          // Direct assignment - no watchers to interfere!
          formData.value = { ...saved.formData }
          stepValidation.value = { ...saved.stepValidation }
          currentStep.value = saved.currentStep
          
          console.log('✅ Successfully restored form data from storage')
          console.log('📊 Final restored form data:', formData.value)
          
          // Ensure step validity aligns with current required metadata
          Object.values(SECTION_TO_STEP).forEach((s) => {
            stepValidation.value[s] = computeStepValidity(s)
          })
        }
      } else {
        console.log('ℹ️ No saved data found in localStorage')
      }
    } catch (error) {
      console.error('❌ Failed to load form from storage:', error)
    }
  }

  const resetForm = () => {
    formData.value = {
      company: {
        raisonSociale: '',
        adresse: '',
        codePostal: '',
        ville: '',
        pays: 'France',
        telephone: '',
        fax: '',
        siteInternet: '',
        siret: '',
        tva: '',
        membrePorte: false,
        exposant2024: false,
        activites: [],
        enseigne: ''
      },
      contact: {
        factCodePostal: '',
        factVille: '',
        factPays: '',
        contactNom: '',
        contactTel: '',
        contactMail: '',
        respNom: '',
        respPrenom: '',
        respTel: '',
        respMail: '',
        opNom: '',
        opPrenom: '',
        opTel: '',
        opMail: ''
      },
      spaceReservation: {
        selectedStandType: undefined,
        standEquipeSurface: 0,
        standEquipeAngle: 0,
        pack12: 0,
        pack15: 0,
        pack18: 0,
        packAngles: 0,
        standNuSurface: 0,
        standNuAngle: 0,
        puissance: '0',
        surfaceExterieur: 0,
        cottage: 0,
        moquetteCouleur: ''
      },
      optionalEquipment: {
        reserveMelamine: 0,
        velum: 0,
        cloisonBoisTissu: 0,
        reserveBois: 0,
        railSpots: 0,
        mobilier_comptoir: 0,
        mobilier_tabouret: 0,
        mobilier_mangeDebout: 0,
        mobilier_chaise: 0,
        mobilier_table120: 0,
        mobilier_packMangeDebout: 0,
        mobilier_ecran52: 0,
        mobilier_frigo140: 0,
        mobilier_frigo260: 0,
        mobilier_presentoir: 0,
        mobilier_bandeau: 0,
        mobilier_blocPrises: 0,
        mobilier_fauteuil: 0,
        mobilier_tableBasse: 0,
        mobilier_gueridonHaut: 0,
        mobilier_poufCube: 0,
        mobilier_colonneVitrine: 0,
        mobilier_comptoirVitrine: 0,
        mobilier_porteManteaux: 0,
        mobilier_planteBambou: 0,
        mobilier_planteKentia: 0
      },
      additionalProducts: {
        scanBadges: false,
        passSoiree: 0
      },
      communication: {
        visu_packComplet: 0,
        visu_comptoir: 0,
        visu_hautCloisons: 0,
        visu_cloisonComplete: 0,
        visu_enseigneHaute: 0,
        ameli_invitations: 0,
        ameli_demiPage: 0,
        ameli_unePage: 0,
        ameli_deuxiemeCouverture: 0,
        ameli_quatriemeCouverture: 0,
        ameli_logoPlan: 0,
        ameli_goodies: 0,
        ameli_hotesse: 0
      },
      signature: {
        nomSignataire: '',
        dateSignature: '',
        acceptReglement: false
      }
    }
    
    stepValidation.value = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false
    }
    
    currentStep.value = 1
    
    try {
      localStorage.removeItem(FORM_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear form storage:', error)
    }
  }

  const isFormComplete = computed(() => {
    return Object.values(stepValidation.value).every(Boolean)
  })

  const hasSelectedServices = computed(() => {
    const space = formData.value.spaceReservation
    const equipment = formData.value.optionalEquipment  
    const products = formData.value.additionalProducts
    const communication = formData.value.communication

    // Check if any space reservation is selected
    const hasSpaceReservation = 
      space.standEquipeSurface > 0 ||
      space.standEquipeAngle > 0 ||
      space.pack12 > 0 ||
      space.pack15 > 0 ||
      space.pack18 > 0 ||
      space.packAngles > 0 ||
      space.standNuSurface > 0 ||
      space.standNuAngle > 0 ||
      space.puissance !== '0' ||
      space.surfaceExterieur > 0 ||
      space.cottage > 0

    // Check if any optional equipment is selected
    const hasOptionalEquipment = Object.values(equipment).some(value => 
      typeof value === 'number' && value > 0
    )

    // Check if any additional products are selected
    const hasAdditionalProducts = 
      products.scanBadges || products.passSoiree > 0

    // Check if any communication services are selected
    const hasCommunicationServices = Object.values(communication).some(value => 
      typeof value === 'number' && value > 0
    )

    return hasSpaceReservation || hasOptionalEquipment || hasAdditionalProducts || hasCommunicationServices
  })

  const getFormDataForExport = () => {
    return {
      ...formData.value,
      metadata: {
        exportDate: new Date().toISOString(),
        completionStatus: stepValidation.value,
        totalAmount: priceCalculation.value.totalTTC
      }
    }
  }

  // Stand selection functions (mutual exclusion logic)
  const selectStandType = (standType: 'standEquipe' | 'standPretAExposer' | 'standNu') => {
    // Clear all existing stand selections when changing type
    formData.value.spaceReservation = {
      ...formData.value.spaceReservation,
      selectedStandType: standType,
      // Reset all stand values
      standEquipeSurface: standType === 'standEquipe' ? formData.value.spaceReservation.standEquipeSurface : 0,
      standEquipeAngle: standType === 'standEquipe' ? formData.value.spaceReservation.standEquipeAngle : 0,
      pack12: standType === 'standPretAExposer' ? formData.value.spaceReservation.pack12 : 0,
      pack15: standType === 'standPretAExposer' ? formData.value.spaceReservation.pack15 : 0,
      pack18: standType === 'standPretAExposer' ? formData.value.spaceReservation.pack18 : 0,
      packAngles: standType === 'standPretAExposer' ? formData.value.spaceReservation.packAngles : 0,
      standNuSurface: standType === 'standNu' ? formData.value.spaceReservation.standNuSurface : 0,
      standNuAngle: standType === 'standNu' ? formData.value.spaceReservation.standNuAngle : 0
    }
    // No automatic save - only save on navigation
  }

  const clearStandSelection = () => {
    formData.value.spaceReservation = {
      ...formData.value.spaceReservation,
      selectedStandType: undefined,
      standEquipeSurface: 0,
      standEquipeAngle: 0,
      pack12: 0,
      pack15: 0,
      pack18: 0,
      packAngles: 0,
      standNuSurface: 0,
      standNuAngle: 0
    }
    // No automatic save - only save on navigation
  }

  // Get the current selected stand size for pass calculation
  const getCurrentStandSize = computed(() => {
    const space = formData.value.spaceReservation
    switch (space.selectedStandType) {
      case 'standEquipe':
        return Math.max(space.standEquipeSurface, space.standEquipeAngle)
      case 'standPretAExposer':
        if (space.pack12 > 0) return 12
        if (space.pack15 > 0) return 15
        if (space.pack18 > 0) return 18
        return 0
      case 'standNu':
        return Math.max(space.standNuSurface, space.standNuAngle)
      default:
        return 0
    }
  })

  // Manual save function for explicit saves (like form submission)
  const saveFormData = () => {
    console.log('💾 Manual save triggered')
    saveToStorage()
  }

  return {
    // State
    currentStep,
    formData,
    stepValidation,
    
    // Getters
    steps,
    progressPercent,
    priceCalculation,
    isFormComplete,
    hasSelectedServices,
    
    // Actions
    setCurrentStep,
    nextStep,
    previousStep,
    updateFormData,
    validateStep,
    saveToStorage,
    saveFormData,
    loadFromStorage,
    resetForm,
    getFormDataForExport,
    
    // Stand selection
    selectStandType,
    clearStandSelection,
    getCurrentStandSize
  }
})
