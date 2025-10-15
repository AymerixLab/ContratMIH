import JSZip from 'jszip';
import type {
  FormData as SubmissionFormData,
  ReservationData,
  AmenagementData,
  VisibiliteData,
  EngagementData,
} from './types';
import { generateContractPdfBytes, getContractPdfFilename, sanitizeFilename } from './pdfFiller';

export interface ZipAsset {
  blob: Blob;
  filename: string;
}

export async function generateContractZipBlob(
  formData: SubmissionFormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  engagementData: EngagementData,
  totalHT1: number,
  totalHT2: number,
  totalHT3: number,
  totalHT4: number,
  totalHT: number,
  tva: number,
  totalTTC: number
): Promise<ZipAsset> {
  const contractPdfBytes = await generateContractPdfBytes(
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData
  );
  
  const zip = new JSZip();
  zip.file(getContractPdfFilename(formData), contractPdfBytes);
  
  // Générer et télécharger le ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const sanitizedBase = sanitizeFilename(formData.raisonSociale || 'exposant');

  return {
    blob: content,
    filename: `documents-salon-${sanitizedBase}.zip`,
  };
}

export function downloadZipFromBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 100);
}

// Fonction pour créer et télécharger le ZIP (compatibilité)
export async function generateContractZip(
  formData: SubmissionFormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  engagementData: EngagementData,
  totalHT1: number,
  totalHT2: number,
  totalHT3: number,
  totalHT4: number,
  totalHT: number,
  tva: number,
  totalTTC: number
): Promise<void> {
  const asset = await generateContractZipBlob(
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData,
    totalHT1,
    totalHT2,
    totalHT3,
    totalHT4,
    totalHT,
    tva,
    totalTTC
  );

  downloadZipFromBlob(asset.blob, asset.filename);
}