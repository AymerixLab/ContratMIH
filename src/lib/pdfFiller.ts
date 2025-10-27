import {
  PDFDocument,
  StandardFonts,
  PDFTextField,
  PDFCheckBox,
  PDFRadioGroup,
  PDFDict,
  PDFName,
  PDFBool,
} from 'pdf-lib';
import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData, CoExposant } from './types';
import { generateStandTypeName } from './documentHelpers';
import { PDF_FIELD_MAP, MappingCtx } from './pdfFieldMap';
import { calculateTotals } from './calculateTotals';
import { formatSignatureFromIso } from './utils';

// Resolve the packaged asset URL via Vite
const CONTRACT_TEMPLATE_URL = new URL('../assets/Contrat de participation 2025 form.pdf', import.meta.url).href;
const CO_EXPOSANT_TEMPLATE_URL = new URL('../assets/Co.exposant Form.pdf', import.meta.url).href;

function stripXFAAndUsageRights(pdfDoc: PDFDocument) {
  const catalog = pdfDoc.catalog;
  const acroFormRef = catalog.get(PDFName.of('AcroForm'));
  if (acroFormRef) {
    const acroForm = pdfDoc.context.lookup(acroFormRef, PDFDict);
    if (acroForm) {
      const xfaKey = PDFName.of('XFA');
      if (acroForm.has(xfaKey)) {
        acroForm.delete(xfaKey);
      }
      acroForm.set(PDFName.of('NeedAppearances'), PDFBool.False);
    }
  }

  const permsRef = catalog.get(PDFName.of('Perms'));
  if (permsRef) {
    const perms = pdfDoc.context.lookup(permsRef, PDFDict);
    if (perms) {
      const urKey = PDFName.of('UR');
      const ur3Key = PDFName.of('UR3');
      if (perms.has(urKey)) perms.delete(urKey);
      if (perms.has(ur3Key)) perms.delete(ur3Key);
      if (perms.size === 0) {
        catalog.delete(PDFName.of('Perms'));
      }
    }
  }
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    // Strip diacritics
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function includesAll(name: string, parts: string[]) {
  const n = normalize(name);
  return parts.every(p => n.includes(normalize(p)));
}

export function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9\-_.]/g, '-');
}

export function getContractPdfFilename(formData: FormData): string {
  const base = formData.raisonSociale || 'exposant';
  return `contrat-${sanitizeFilename(base)}.pdf`;
}

export function getCoExposantPdfFilename(coExposant: CoExposant, index: number): string {
  const company = coExposant.nomEntreprise || `co-exposant-${index + 1}`;
  return `co-exposant-${index + 1}-${sanitizeFilename(company)}.pdf`;
}

function sanitizeForPdf(text: string): string {
  return text
    .replace(/[\u00A0\u202F]/g, ' ') // NBSP and narrow NBSP
    .replace(/[€]/g, 'EUR')
    .replace(/[–—]/g, '-')
    .replace(/[’]/g, "'");
}

// Dev helper: list fields present in the template (logs in console)
export async function listContractPdfFields(): Promise<string[]> {
  const res = await fetch(CONTRACT_TEMPLATE_URL);
  const ab = await res.arrayBuffer();
  const pdf = await PDFDocument.load(ab);
  const form = pdf.getForm();
  const fields = form.getFields();
  const names = fields.map(f => f.getName());
  // eslint-disable-next-line no-console
  console.log('[PDF fields]', names);
  return names;
}

export async function downloadContractPdfFieldsCsv(): Promise<void> {
  const res = await fetch(CONTRACT_TEMPLATE_URL);
  const ab = await res.arrayBuffer();
  const pdf = await PDFDocument.load(ab);
  const form = pdf.getForm();
  const rows = [['name','type','mapped']];
  for (const f of form.getFields()) {
    const name = f.getName();
    const type = (f as any).constructor?.name || 'Field';
    const mapped = Object.prototype.hasOwnProperty.call(PDF_FIELD_MAP, name) ? 'matrix' : '';
    rows.push([name, type, mapped]);
  }
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pdf_fields.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Expose for debugging in dev so it can be called from the browser console
declare global {
  interface Window {
    listContractPdfFields?: () => Promise<string[]>;
    downloadContractPdfFieldsCsv?: () => Promise<void>;
  }
}
if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
  window.listContractPdfFields = listContractPdfFields;
  window.downloadContractPdfFieldsCsv = downloadContractPdfFieldsCsv;
}

// Try to infer the value for a given PDF field name from our form objects
function resolveValue(
  fieldName: string,
  formData: FormData,
  reservationData: ReservationData,
  _amenagementData: AmenagementData,
  _visibiliteData: VisibiliteData,
  engagementData: EngagementData
): string | boolean | undefined {
  const n = normalize(fieldName);

  // Identity / company
  if (includesAll(n, ['raison']) || includesAll(n, ['raison', 'sociale']) || includesAll(n, ['societe']) || includesAll(n, ['entreprise']) && !includesAll(n, ['responsable'])) {
    return formData.raisonSociale || formData.enseigne || '';
  }
  if (includesAll(n, ['enseigne'])) return formData.enseigne;
  if (includesAll(n, ['siret'])) return formData.siret;
  if (includesAll(n, ['tva'])) return formData.tvaIntra;
  if (includesAll(n, ['adresse']) && !includesAll(n, ['facturation'])) return formData.adresse;
  if (includesAll(n, ['code', 'postal']) && !includesAll(n, ['facturation'])) return formData.codePostal;
  if (includesAll(n, ['ville']) && !includesAll(n, ['facturation'])) return formData.ville;
  if (includesAll(n, ['pays']) && !includesAll(n, ['facturation'])) return formData.pays;
  if (includesAll(n, ['telephone']) || includesAll(n, ['tel'])) return formData.tel;
  if (includesAll(n, ['site']) || includesAll(n, ['internet']) || includesAll(n, ['web'])) return formData.siteInternet;

  // Billing / accounting contact
  if (includesAll(n, ['facturation', 'adresse'])) return formData.facturationAdresse;
  if (includesAll(n, ['facturation', 'cp']) || includesAll(n, ['facturation', 'code', 'postal'])) return formData.facturationCP;
  if (includesAll(n, ['facturation', 'ville'])) return formData.facturationVille;
  if (includesAll(n, ['facturation', 'pays'])) return formData.facturationPays;
  if (includesAll(n, ['compta', 'nom'])) return formData.contactComptaNom;
  if (includesAll(n, ['compta', 'tel'])) return formData.contactComptaTel;
  if (includesAll(n, ['compta', 'mail']) || includesAll(n, ['compta', 'email'])) return formData.contactComptaMail;

  // Responsables
  if (includesAll(n, ['responsable', 'entreprise', 'prenom'])) return formData.responsablePrenom;
  if (includesAll(n, ['responsable', 'entreprise', 'nom'])) return formData.responsableNom;
  if (includesAll(n, ['responsable', 'entreprise', 'mail']) || includesAll(n, ['responsable', 'entreprise', 'email'])) return formData.responsableMail;
  if (includesAll(n, ['responsable', 'entreprise', 'tel'])) return formData.responsableTel;

  if (includesAll(n, ['responsable', 'operationnel', 'prenom'])) return formData.respOpPrenom;
  if (includesAll(n, ['responsable', 'operationnel', 'nom'])) return formData.respOpNom;
  if (includesAll(n, ['responsable', 'operationnel', 'mail']) || includesAll(n, ['responsable', 'operationnel', 'email'])) return formData.respOpMail;
  if (includesAll(n, ['responsable', 'operationnel', 'tel'])) return formData.respOpTel;

  // Reservation
  if (includesAll(n, ['type', 'stand'])) return generateStandTypeName(reservationData.standType);
  if (includesAll(n, ['surface']) || includesAll(n, ['m2']) || includesAll(n, ['metre', 'carre'])) return reservationData.standSize;
  if (includesAll(n, ['angle'])) return String(reservationData.standAngles ?? '');

  // Engagement / payment
  if (includesAll(n, ['date', 'signature'])) {
    const formatted = formatSignatureFromIso(engagementData.dateSignature);
    return formatted || new Date().toLocaleDateString('fr-FR');
  }
  if (includesAll(n, ['cachet']) && includesAll(n, ['signature'])) return engagementData.cachetSignature || '';
  if (includesAll(n, ['accepte']) && includesAll(n, ['reglement'])) return !!engagementData.accepteReglement;

  // Mode de règlement might be handled via radio/checkbox selection; handled elsewhere

  return undefined;
}

export type FillOptions = { mockAll?: boolean };

export async function generateContractPdfBytes(
  formData: FormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  engagementData: EngagementData,
  options?: FillOptions
): Promise<Uint8Array> {
  // Load template
  const res = await fetch(CONTRACT_TEMPLATE_URL);
  const ab = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(ab, { updateFieldAppearances: false });
  stripXFAAndUsageRights(pdfDoc);
  const form = pdfDoc.getForm();

  // Embed a standard font for consistent appearances
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Compute totals for explicit mapping
  const totals = calculateTotals(reservationData, amenagementData, visibiliteData);

  const ctx: MappingCtx = {
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData,
    totals,
    mockAll: options?.mockAll === true,
  };

  // Fill fields using explicit mapping first, then heuristics
  for (const field of form.getFields()) {
    const name = field.getName();
    let value: string | boolean | undefined;
    const mapping = PDF_FIELD_MAP[name as keyof typeof PDF_FIELD_MAP];
    if (mapping) {
      value = mapping.get(ctx);
    } else {
      value = resolveValue(name, formData, reservationData, amenagementData, visibiliteData, engagementData);
    }
    if (value === undefined) {
      // eslint-disable-next-line no-console
      console.debug('[PDF] Unmapped field:', name, '-> leaving empty');
    }

    if (field instanceof PDFTextField) {
      if (typeof value === 'string') {
        field.setText(sanitizeForPdf(value));
      }
    } else if (field instanceof PDFCheckBox) {
      // Generic checkbox handling
      if (typeof value === 'boolean') {
        if (value) field.check(); else field.uncheck();
      } else {
        // Special-case mode de règlement as checkboxes named with keywords
        const n = normalize(name);
        if (includesAll(n, ['acompte'])) {
          engagementData.modeReglement === 'acompte' ? field.check() : field.uncheck();
        } else if (includesAll(n, ['solde'])) {
          engagementData.modeReglement === 'solde' ? field.check() : field.uncheck();
        } else if (includesAll(n, ['virement'])) {
          engagementData.modeReglement === 'virement' ? field.check() : field.uncheck();
        }
      }
    } else if (field instanceof PDFRadioGroup) {
      const n = normalize(name);
      try {
        // Try selecting an option whose export value matches our modeReglement
        const mode = engagementData.modeReglement;
        // pdf-lib exposes option values but typings may vary; try common tokens
        const candidates = [mode, mode.toUpperCase(), mode[0].toUpperCase() + mode.slice(1)];
        for (const c of candidates) {
          try { field.select(c); break; } catch { /* ignore */ }
        }
        // Fallback by name heuristics
        if (includesAll(n, ['acompte']) && mode === 'acompte') field.select('acompte');
        if (includesAll(n, ['solde']) && mode === 'solde') field.select('solde');
        if (includesAll(n, ['virement']) && mode === 'virement') field.select('virement');
      } catch {
        // ignore if selection fails
      }
    }
  }

  form.updateFieldAppearances(font);
  // Flatten so the PDF can’t be modified
  form.flatten();

  return pdfDoc.save({
    useObjectStreams: false, // safer for broader compatibility
  });
}

export async function fillAndDownloadContractPdf(
  formData: FormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  engagementData: EngagementData,
  options?: FillOptions
): Promise<void> {
  const pdfBytes = await generateContractPdfBytes(
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData,
    options
  );

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = getContractPdfFilename(formData);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateCoExposantPdfBytes(coExposant: CoExposant): Promise<Uint8Array> {
  const res = await fetch(CO_EXPOSANT_TEMPLATE_URL);
  const ab = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(ab, { updateFieldAppearances: false });
  stripXFAAndUsageRights(pdfDoc);
  const form = pdfDoc.getForm();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const setText = (name: string, value: string) => {
    if (!value) return;
    try {
      const field = form.getTextField(name);
      field.setText(sanitizeForPdf(value));
    } catch {}
  };

  setText('raison_social', coExposant.nomEntreprise);
  setText('resp_nom', coExposant.nomResponsable);
  setText('resp_prenom', coExposant.prenomResponsable);
  setText('resp_tel', coExposant.telResponsable);
  setText('resp_mail', coExposant.mailResponsable);

  form.updateFieldAppearances(font);
  form.flatten();

  return pdfDoc.save({
    useObjectStreams: false,
  });
}
