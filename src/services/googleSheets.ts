import type { FormData, PriceCalculation } from '@/types/form'
import type { PdfSection } from '@/types/pdf'
import { FIELD_META } from '@/types/fields'
import localforage from 'localforage'

interface GoogleSheetsResponse {
  success: boolean
  message?: string
  error?: string
}

class GoogleSheetsService {
  private readonly SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || 
    'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
  
  private readonly TIMEOUT = 10000 // 10 seconds
  private readonly QUEUE_KEY = 'mih-google-sheets-queue'

  /**
   * Send form data to Google Sheets
   */
  public async sendData(
    formData: FormData,
    price?: PriceCalculation,
    sections?: PdfSection[]
  ): Promise<GoogleSheetsResponse> {
    try {
      // Format data for Google Sheets
      const sheetData = this.formatDataForSheet(formData, price, sections)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT)

      const response = await fetch(this.SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        message: result.message || 'Données envoyées vers Google Sheets avec succès'
      }

    } catch (error) {
      // If offline or network error, enqueue for background retry
      const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false
      const isNetworkError = error instanceof TypeError || (error instanceof Error && /Failed to fetch|NetworkError|abort/i.test(error.message))
      if (isOffline || isNetworkError) {
        await this.enqueue(sheetData)
        return {
          success: true,
          message: 'Envoi hors-ligne: données mises en file d\'attente'
        }
      }
      // Timeout explicit
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Timeout: La requête a pris trop de temps'
        }
      }
      // Fallback unknown error
      return {
        success: false,
        error: error instanceof Error ? `Erreur: ${error.message}` : 'Erreur inconnue lors de l\'envoi vers Google Sheets'
      }
    }
  }

  // Queue helpers
  private async enqueue(payload: Record<string, any>) {
    const queue = (await localforage.getItem<Record<string, any>[]>(this.QUEUE_KEY)) || []
    queue.push(payload)
    await localforage.setItem(this.QUEUE_KEY, queue)
    this.dispatchQueueCount(queue.length)
  }

  private async dequeue(): Promise<Record<string, any> | undefined> {
    const queue = (await localforage.getItem<Record<string, any>[]>(this.QUEUE_KEY)) || []
    const item = queue.shift()
    await localforage.setItem(this.QUEUE_KEY, queue)
    this.dispatchQueueCount(queue.length)
    return item
  }

  private dispatchQueueCount(count: number) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mih:queue-updated', { detail: count }))
    }
  }

  public async getQueueLength(): Promise<number> {
    const queue = (await localforage.getItem<unknown>(this.QUEUE_KEY)) as Record<string, any>[] | null
    return Array.isArray(queue) ? queue.length : 0
  }

  public async flushQueue(): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return
    let item = await this.dequeue()
    while (item) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT)
        const res = await fetch(this.SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } catch (e) {
        // Put back and stop if still failing
        const queue = (await localforage.getItem<Record<string, any>[]>(this.QUEUE_KEY)) || []
        queue.unshift(item)
        await localforage.setItem(this.QUEUE_KEY, queue)
        this.dispatchQueueCount(queue.length)
        break
      }
      item = await this.dequeue()
    }
  }

  /**
   * Test connection to Google Sheets
   */
  public async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(this.SCRIPT_URL, {
        method: 'OPTIONS',
        mode: 'cors',
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response.ok

    } catch (error) {
      console.error('Google Sheets connection test failed:', error)
      return false
    }
  }

  /**
   * Format form data for Google Sheets compatibility
   */
  private formatDataForSheet(
    formData: FormData,
    price?: PriceCalculation,
    sections?: PdfSection[]
  ): Record<string, any> {
    const timestamp = new Date().toISOString()

    // Build nested objects per Apps Script expectations
    const mobilier = {
      comptoir: formData.optionalEquipment.mobilier_comptoir,
      tabouret: formData.optionalEquipment.mobilier_tabouret,
      mangeDebout: formData.optionalEquipment.mobilier_mangeDebout,
      chaise: formData.optionalEquipment.mobilier_chaise,
      table120: formData.optionalEquipment.mobilier_table120,
      packMangeDebout: formData.optionalEquipment.mobilier_packMangeDebout,
      ecran52: formData.optionalEquipment.mobilier_ecran52,
      frigo140: formData.optionalEquipment.mobilier_frigo140,
      frigo260: formData.optionalEquipment.mobilier_frigo260,
      presentoir: formData.optionalEquipment.mobilier_presentoir,
      bandeau: formData.optionalEquipment.mobilier_bandeau,
      blocPrises: formData.optionalEquipment.mobilier_blocPrises,
      fauteuil: formData.optionalEquipment.mobilier_fauteuil,
      tableBasse: formData.optionalEquipment.mobilier_tableBasse,
      gueridonHaut: formData.optionalEquipment.mobilier_gueridonHaut,
      poufCube: formData.optionalEquipment.mobilier_poufCube,
      colonneVitrine: formData.optionalEquipment.mobilier_colonneVitrine,
      comptoirVitrine: formData.optionalEquipment.mobilier_comptoirVitrine,
      porteManteaux: formData.optionalEquipment.mobilier_porteManteaux,
      planteBambou: formData.optionalEquipment.mobilier_planteBambou,
      planteKentia: formData.optionalEquipment.mobilier_planteKentia,
    }

    const signaletique = {
      packComplet: formData.communication.visu_packComplet,
      comptoir: formData.communication.visu_comptoir,
      hautCloisons: formData.communication.visu_hautCloisons,
      cloisonComplete: formData.communication.visu_cloisonComplete,
      enseigneHaute: formData.communication.visu_enseigneHaute,
    }

    const communication = {
      invitations: formData.communication.ameli_invitations,
      demiPage: formData.communication.ameli_demiPage,
      unePage: formData.communication.ameli_unePage,
      deuxiemeCouverture: formData.communication.ameli_deuxiemeCouverture,
      quatriemeCouverture: formData.communication.ameli_quatriemeCouverture,
      logoPlan: formData.communication.ameli_logoPlan,
      goodies: formData.communication.ameli_goodies,
      hotesse: formData.communication.ameli_hotesse,
    }

    // Build prestations list from sections if available
    const prestations = sections?.flatMap(sec => sec.prestations.map(p => ({
      section: sec.title,
      libelle: p.libelle,
      quantite: p.quantity,
      unite: p.unite,
      prixUnitaire: p.prixUnitaire,
      total: p.total
    }))) || []

    // Labeled columns for consumers targeting header names
    const labeled: Record<string, any> = {}
    ;(['company', 'contact', 'signature'] as const).forEach((section) => {
      const meta = FIELD_META[section]
      if (!meta) return
      const data: any = (formData as any)[section]
      Object.entries(meta).forEach(([key, cfg]) => {
        const col = cfg?.column
        if (!col) return
        const val = data?.[key]
        labeled[col] = Array.isArray(val) ? val.join(', ') : val
      })
    })

    return {
      timestamp,
      // General / identity
      date: formData.signature.dateSignature,
      signataire: formData.signature.nomSignataire,
      raisonSociale: formData.company.raisonSociale,
      adresse: formData.company.adresse,
      codePostal: formData.company.codePostal,
      ville: formData.company.ville,
      pays: formData.company.pays,
      telephone: formData.company.telephone,
      fax: formData.company.fax,
      siteInternet: formData.company.siteInternet,
      siret: formData.company.siret,
      tvaNumber: formData.company.tva,
      membrePorte: formData.company.membrePorte,
      exposant2024: formData.company.exposant2024,
      activites: formData.company.activites.join(', '),
      factCodePostal: formData.contact.factCodePostal,
      factVille: formData.contact.factVille,
      factPays: formData.contact.factPays,
      contactNom: formData.contact.contactNom,
      contactTel: formData.contact.contactTel,
      contactMail: formData.contact.contactMail,
      respNom: formData.contact.respNom,
      respPrenom: formData.contact.respPrenom,
      respTel: formData.contact.respTel,
      respMail: formData.contact.respMail,
      opNom: formData.contact.opNom,
      opPrenom: formData.contact.opPrenom,
      opTel: formData.contact.opTel,
      opMail: formData.contact.opMail,
      enseigne: formData.company.enseigne,

      // Réservation d’espace
      standEquipeSurface: formData.spaceReservation.standEquipeSurface,
      standEquipeAngle: formData.spaceReservation.standEquipeAngle,
      pack12: formData.spaceReservation.pack12,
      pack15: formData.spaceReservation.pack15,
      pack18: formData.spaceReservation.pack18,
      packAngles: formData.spaceReservation.packAngles,
      standNuSurface: formData.spaceReservation.standNuSurface,
      standNuAngle: formData.spaceReservation.standNuAngle,
      puissance: formData.spaceReservation.puissance,
      surfaceExterieur: formData.spaceReservation.surfaceExterieur,
      cottage: formData.spaceReservation.cottage,

      // Aménagements optionnels
      reserveMelamine: formData.optionalEquipment.reserveMelamine,
      moquetteDiff: formData.optionalEquipment.moquetteDiff,
      velum: formData.optionalEquipment.velum,
      cloisonBoisTissu: formData.optionalEquipment.cloisonBoisTissu,
      reserveBois: formData.optionalEquipment.reserveBois,
      railSpots: formData.optionalEquipment.railSpots,
      mobilier,

      // Produits complémentaires
      scanBadges: formData.additionalProducts.scanBadges,
      passSoiree: formData.additionalProducts.passSoiree,

      // Signalétique + Communication
      signaletique,
      communication,

      // Totaux financiers (if provided)
      totalSection1: price?.section1Total,
      totalSection2: price?.section2Total,
      totalSection3: price?.section3Total,
      totalSection4: price?.section4Total,
      totalHT: price?.totalHT,
      tvaAmount: price?.tva,
      totalTTC: price?.totalTTC,
      acompte: price?.acompte,
      solde: price?.solde,

      // Détails des prestations
      prestations,

      // Labeled columns for convenience
      ...labeled
    }
  }

  /**
   * Format equipment data - only include non-zero values
   */
  private formatEquipmentData(equipment: any): string {
    const nonZeroItems: string[] = []
    
    Object.entries(equipment).forEach(([key, value]) => {
      if (typeof value === 'number' && value > 0) {
        // Convert key to readable format
        const readableKey = this.camelToReadable(key)
        nonZeroItems.push(`${readableKey}: ${value}`)
      }
    })

    return nonZeroItems.join(' | ')
  }

  /**
   * Format communication data - only include non-zero values
   */
  private formatCommunicationData(communication: any): string {
    const nonZeroItems: string[] = []
    
    Object.entries(communication).forEach(([key, value]) => {
      if (typeof value === 'number' && value > 0) {
        const readableKey = this.camelToReadable(key)
        nonZeroItems.push(`${readableKey}: ${value}`)
      }
    })

    return nonZeroItems.join(' | ')
  }

  /**
   * Convert camelCase to readable format
   */
  private camelToReadable(camelCase: string): string {
    return camelCase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase())
      .replace(/mobilier_/g, '')
      .replace(/visu_/g, 'Visuel ')
      .replace(/ameli_/g, 'Amélioration ')
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService()
export default googleSheetsService
