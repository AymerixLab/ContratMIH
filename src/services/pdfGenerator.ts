import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { 
  PdfGenerationData, 
  PdfSection, 
  ContractImage, 
  PdfGenerationResult,
  PdfGenerationProgress
} from '@/types/pdf'
import { loadContractPages } from '@/utils/imageLoader'

class PdfGeneratorService {
  private contractPages: ContractImage[] = []
  private progressCallback?: (progress: PdfGenerationProgress) => void

  public setProgressCallback(callback: (progress: PdfGenerationProgress) => void) {
    this.progressCallback = callback
  }

  private emitProgress(step: string, progress: number, total: number) {
    if (this.progressCallback) {
      this.progressCallback({ step, progress, total })
    }
  }

  /**
   * Initialize the service by loading contract images
   */
  public async initialize(): Promise<void> {
    try {
      this.emitProgress('Chargement des images du contrat...', 0, 6)
      this.contractPages = await loadContractPages()
      this.emitProgress('Images chargées', 6, 6)
    } catch (error) {
      console.error('Failed to initialize PDF generator:', error)
      throw new Error('Impossible de charger les images du contrat')
    }
  }

  /**
   * Generate the quote PDF
   */
  public async generateQuotePdf(data: PdfGenerationData): Promise<jsPDF> {
    this.emitProgress('Génération du devis...', 0, 100)
    
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(232, 93, 64) // #e85d40
    doc.text('Devis - Salon Made in Hainaut 2026', margin, 30)
    
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('Site minier d\'Arenberg – La Porte du Hainaut', margin, 45)
    doc.text('21 & 22 mai 2026', margin, 55)

    // Company information
    let yPos = 75
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Informations client', margin, yPos)
    
    yPos += 10
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`${data.contact.raisonSociale}`, margin, yPos)
    yPos += 5
    doc.text(`${data.contact.adresse}`, margin, yPos)
    yPos += 5
    doc.text(`${data.contact.codePostal} ${data.contact.ville}`, margin, yPos)
    
    if (data.contact.telephone) {
      yPos += 5
      doc.text(`Tél: ${data.contact.telephone}`, margin, yPos)
    }

    yPos += 15
    this.emitProgress('Ajout des prestations...', 20, 100)

    // Services sections
    for (let i = 0; i < data.sections.length; i++) {
      const section = data.sections[i]
      
      if (section.prestations.length === 0) continue

      // Check if we need a new page
      if (yPos > 220) {
        doc.addPage()
        yPos = 30
      }

      // Section title
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, margin, yPos)
      yPos += 10

      // Services table
      const tableData = section.prestations.map(p => [
        p.libelle,
        `${p.prixUnitaire.toFixed(2)} €${p.unite !== '€' ? ' / ' + p.unite : ''}`,
        p.quantity.toString(),
        `${p.total.toFixed(2)} €`
      ])

      autoTable(doc, {
        startY: yPos,
        head: [['Prestation', 'Prix unitaire', 'Quantité', 'Total HT']],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [232, 93, 64],
          textColor: 255
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      })

      yPos = (doc as any).lastAutoTable.finalY + 10

      // Section total
      doc.setFont('helvetica', 'bold')
      doc.text(`Total ${section.title}: ${section.total.toFixed(2)} €`, 
               pageWidth - 70, yPos, { align: 'right' })
      yPos += 15

      this.emitProgress(`Section ${i + 1} ajoutée`, 20 + (i + 1) * 15, 100)
    }

    // Final totals
    if (yPos > 220) {
      doc.addPage()
      yPos = 30
    }

    this.emitProgress('Ajout des totaux...', 80, 100)

    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('RÉCAPITULATIF FINANCIER', margin, yPos)
    yPos += 15

    const financialData = [
      ['Total HT', `${data.financial.totalHT.toFixed(2)} €`],
      ['TVA (20%)', `${data.financial.tva.toFixed(2)} €`],
      ['Total TTC', `${data.financial.totalTTC.toFixed(2)} €`],
      ['Acompte (50%)', `${data.financial.acompte.toFixed(2)} €`],
      ['Solde', `${data.financial.solde.toFixed(2)} €`]
    ]

    autoTable(doc, {
      startY: yPos,
      body: financialData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 11,
        cellPadding: 5
      },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left' },
        1: { halign: 'right' }
      }
    })

    // Footer
    const footerY = doc.internal.pageSize.height - 30
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Ce devis est valable 30 jours. Acompte de 50% à la signature.', 
             pageWidth / 2, footerY, { align: 'center' })

    this.emitProgress('Devis généré', 100, 100)
    return doc
  }

  /**
   * Generate the contract PDF with embedded images
   */
  public async generateContractPdf(data: PdfGenerationData): Promise<jsPDF> {
    this.emitProgress('Génération du contrat...', 0, 100)
    
    if (this.contractPages.length === 0) {
      await this.initialize()
    }

    const doc = new jsPDF()
    
    // Add each contract page
    for (let i = 0; i < this.contractPages.length; i++) {
      if (i > 0) {
        doc.addPage()
      }
      
      const page = this.contractPages[i]
      doc.addImage(page.dataUrl, 'PNG', 0, 0, page.width, page.height)
      
      // Fill in the form data on the first page
      if (i === 0) {
        this.fillFirstPage(doc, data)
      }
      
      this.emitProgress(`Page ${i + 1} ajoutée`, (i + 1) * 15, 100)
    }

    this.emitProgress('Contrat généré', 100, 100)
    return doc
  }

  /**
   * Fill the first page of the contract with form data
   */
  private fillFirstPage(doc: jsPDF, data: PdfGenerationData) {
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)

    // Company information (approximate positions based on the form)
    if (data.contact.raisonSociale) {
      doc.text(data.contact.raisonSociale, 175, 175)
    }
    if (data.contact.adresse) {
      doc.text(data.contact.adresse, 175, 185)
    }
    if (data.contact.codePostal) {
      doc.text(data.contact.codePostal, 175, 195)
    }
    if (data.contact.ville) {
      doc.text(data.contact.ville, 305, 195)
    }
    if (data.contact.pays) {
      doc.text(data.contact.pays, 480, 195)
    }
    if (data.contact.telephone) {
      doc.text(data.contact.telephone, 175, 205)
    }
    if (data.contact.siteInternet) {
      doc.text(data.contact.siteInternet, 380, 215)
    }
    if (data.contact.siret) {
      doc.text(data.contact.siret, 175, 225)
    }
    if (data.contact.tva) {
      doc.text(data.contact.tva, 450, 235)
    }

    // Contact information
    if (data.contact.contactNom) {
      doc.text(data.contact.contactNom, 175, 285)
    }
    if (data.contact.contactTel) {
      doc.text(data.contact.contactTel, 350, 285)
    }

    // Responsible persons
    if (data.contact.respNom) {
      doc.text(data.contact.respNom, 175, 330)
    }
    if (data.contact.respPrenom) {
      doc.text(data.contact.respPrenom, 175, 340)
    }

    // Enseigne
    if (data.contact.enseigne) {
      doc.text(data.contact.enseigne, 175, 385)
    }
  }

  /**
   * Create a ZIP file containing both PDFs
   */
  public async createZipBundle(quotePdf: jsPDF, contractPdf: jsPDF, companyName: string): Promise<Blob> {
    this.emitProgress('Création de l\'archive ZIP...', 0, 100)
    
    const zip = new JSZip()
    
    // Add quote PDF
    const quoteBlob = quotePdf.output('blob')
    zip.file(`Devis_MIH_2026_${this.sanitizeFilename(companyName)}.pdf`, quoteBlob)
    
    this.emitProgress('Devis ajouté à l\'archive', 50, 100)
    
    // Add contract PDF
    const contractBlob = contractPdf.output('blob')
    zip.file(`Contrat_MIH_2026_${this.sanitizeFilename(companyName)}.pdf`, contractBlob)
    
    this.emitProgress('Contrat ajouté à l\'archive', 80, 100)
    
    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    this.emitProgress('Archive créée', 100, 100)
    return zipBlob
  }

  /**
   * Generate both PDFs and create ZIP bundle
   */
  public async generateComplete(data: PdfGenerationData): Promise<PdfGenerationResult> {
    try {
      this.emitProgress('Initialisation...', 0, 100)
      
      if (this.contractPages.length === 0) {
        await this.initialize()
      }

      this.emitProgress('Génération des PDFs...', 10, 100)
      
      // Generate both PDFs
      const [quotePdf, contractPdf] = await Promise.all([
        this.generateQuotePdf(data),
        this.generateContractPdf(data)
      ])

      this.emitProgress('Création de l\'archive...', 80, 100)

      // Create ZIP bundle
      const zipBlob = await this.createZipBundle(quotePdf, contractPdf, data.contact.raisonSociale)
      
      // Generate filename
      const filename = `Devis_et_Contrat_MIH_2026_${this.sanitizeFilename(data.contact.raisonSociale)}.zip`
      
      this.emitProgress('Téléchargement...', 95, 100)
      
      // Trigger download
      saveAs(zipBlob, filename)
      
      this.emitProgress('Terminé!', 100, 100)

      return {
        success: true,
        message: 'Devis et contrat générés avec succès',
        zipBlob,
        filename
      }
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la génération des PDFs'
      }
    }
  }

  /**
   * Sanitize filename for safe file system usage
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9\-_\.]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 50) // Limit length
  }
}

// Export singleton instance
export const pdfGenerator = new PdfGeneratorService()
export default pdfGenerator