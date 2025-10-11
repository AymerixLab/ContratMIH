import JSZip from 'jszip';
import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from './types';
import { generateContractPdfBytes, getContractPdfFilename, sanitizeFilename } from './pdfFiller';
import { CSS_STYLES, CONTRACT_STYLES } from './documentStyles';
import { 
  generateDevisTableRows, 
  generateClientInfoSection, 
  generateCompanyInfoSection,
  generateStandTypeName 
} from './documentHelpers';

// Fonction pour générer le devis en HTML
export function generateDevisHTML(
  formData: FormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  totalHT1: number,
  totalHT2: number,
  totalHT3: number,
  totalHT: number,
  tva: number,
  totalTTC: number
): string {
  const today = new Date().toLocaleDateString('fr-FR');
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Devis - Salon Made in Hainaut</title>
    <style>${CSS_STYLES}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>DEVIS</h1>
            <p>Salon Made in Hainaut 2026</p>
            <p>Date: ${today}</p>
        </div>
        
        <div class="content">
            <div class="info-section">
                ${generateClientInfoSection(formData)}
                ${generateCompanyInfoSection()}
            </div>

            <table class="devis-table">
                <thead>
                    <tr>
                        <th>Libellé</th>
                        <th>Qté</th>
                        <th>Unité</th>
                        <th>PU HT</th>
                        <th>Rem.</th>
                        <th>TVA</th>
                        <th>Total TTC</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateDevisTableRows(reservationData, amenagementData, visibiliteData)}
                </tbody>
            </table>

            <div class="total-section">
                <h2>TOTAL TTC: ${totalTTC.toLocaleString('fr-FR')} €</h2>
                <div class="total-details">
                    <div class="total-item">
                        <div class="label">Total HT</div>
                        <div class="value">${totalHT.toLocaleString('fr-FR')} €</div>
                    </div>
                    <div class="total-item">
                        <div class="label">TVA 20%</div>
                        <div class="value">${tva.toLocaleString('fr-FR')} €</div>
                    </div>
                    <div class="total-item">
                        <div class="label">Total TTC</div>
                        <div class="value">${totalTTC.toLocaleString('fr-FR')} €</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Salon Made in Hainaut - Site Minier d'Arenberg - 21 & 22 Mai 2026</p>
            <p>Pour plus d'information: 0 800 059 135 - mih@agence-porteduhainaut.fr</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Fonction pour générer le contrat en HTML  
export function generateContractHTML(
  formData: FormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  engagementData: EngagementData,
  totalHT1: number,
  totalHT2: number,
  totalHT3: number,
  totalHT: number,
  tva: number,
  totalTTC: number
): string {
  const today = new Date().toLocaleDateString('fr-FR');
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contrat de Participation - Salon Made in Hainaut</title>
    <style>${CONTRACT_STYLES}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CONTRAT DE PARTICIPATION</h1>
            <p>Salon Made in Hainaut 2026</p>
            <p>Site Minier d'Arenberg - La Porte du Hainaut</p>
            <p>21 & 22 Mai 2026</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>IDENTITÉ DE L'EXPOSANT</h2>
                <div class="field-group">
                    <div class="field">
                        <label>Raison sociale</label>
                        <div class="value">${formData.raisonSociale}</div>
                    </div>
                    <div class="field">
                        <label>SIRET</label>
                        <div class="value">${formData.siret}</div>
                    </div>
                </div>
                <div class="field-group">
                    <div class="field">
                        <label>Adresse</label>
                        <div class="value">${formData.adresse}</div>
                    </div>
                    <div class="field">
                        <label>Code postal - Ville</label>
                        <div class="value">${formData.codePostal} ${formData.ville}</div>
                    </div>
                </div>
                <div class="field-group">
                    <div class="field">
                        <label>Téléphone</label>
                        <div class="value">${formData.tel}</div>
                    </div>
                    <div class="field">
                        <label>Enseigne</label>
                        <div class="value">${formData.enseigne}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>RESPONSABLES</h2>
                <div class="field-group">
                    <div class="field">
                        <label>Responsable Entreprise</label>
                        <div class="value">${formData.responsablePrenom} ${formData.responsableNom}</div>
                    </div>
                    <div class="field">
                        <label>Responsable Opérationnel</label>
                        <div class="value">${formData.respOpPrenom} ${formData.respOpNom}</div>
                    </div>
                </div>
            </div>

            ${reservationData.standType ? `
            <div class="section">
                <h2>RÉSERVATION D'ESPACE</h2>
                <div class="field-group">
                    <div class="field">
                        <label>Type de stand</label>
                        <div class="value">${generateStandTypeName(reservationData.standType)}</div>
                    </div>
                    <div class="field">
                        <label>Surface</label>
                        <div class="value">${reservationData.standSize} m²</div>
                    </div>
                </div>
                ${reservationData.standAngles > 0 ? `
                <div class="field">
                    <label>Angles ouverts</label>
                    <div class="value">${reservationData.standAngles} angle(s)</div>
                </div>
                ` : ''}
            </div>
            ` : ''}

            <div class="totals-section">
                <h2 style="color: white; text-align: center;">RÉCAPITULATIF FINANCIER</h2>
                <div class="totals-grid">
                    <div class="total-box">
                        <div style="font-size: 12px; opacity: 0.8;">HT 1 - Réservation</div>
                        <div style="font-size: 16px; font-weight: bold;">${totalHT1.toLocaleString('fr-FR')} €</div>
                    </div>
                    <div class="total-box">
                        <div style="font-size: 12px; opacity: 0.8;">HT 2 - Aménagements</div>
                        <div style="font-size: 16px; font-weight: bold;">${totalHT2.toLocaleString('fr-FR')} €</div>
                    </div>
                    <div class="total-box">
                        <div style="font-size: 12px; opacity: 0.8;">HT 3 - Visibilité</div>
                        <div style="font-size: 16px; font-weight: bold;">${totalHT3.toLocaleString('fr-FR')} €</div>
                    </div>
                    <div class="total-box">
                        <div style="font-size: 12px; opacity: 0.8;">TOTAL HT</div>
                        <div style="font-size: 16px; font-weight: bold;">${totalHT.toLocaleString('fr-FR')} €</div>
                    </div>
                </div>
                <div style="text-align: center; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <div style="font-size: 14px; opacity: 0.9;">TVA (20%): ${tva.toLocaleString('fr-FR')} €</div>
                    <div style="font-size: 24px; font-weight: bold; margin-top: 10px;">TOTAL TTC: ${totalTTC.toLocaleString('fr-FR')} €</div>
                </div>
            </div>

            <div class="signature-section">
                <h2>ENGAGEMENT CONTRACTUEL</h2>
                <p>En tant qu'exposant, je m'engage à respecter l'intégralité du règlement général du Salon Made in Hainaut.</p>
                
                <div class="field-group" style="margin-top: 20px;">
                    <div class="field">
                        <label style="color: white;">Date</label>
                        <div class="value">${engagementData.dateSignature || today}</div>
                    </div>
                </div>
                
                <div class="field" style="margin-top: 15px;">
                    <label style="color: white;">Cachet et signature de l'entreprise</label>
                    <div class="signature-box">${engagementData.cachetSignature || ''}</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Salon Made in Hainaut - Site Minier d'Arenberg - 21 & 22 Mai 2026</p>
            <p>Pour plus d'information: 0 800 059 135 - mih@agence-porteduhainaut.fr</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Fonction pour créer et télécharger le ZIP
export async function generateContractZip(
  formData: FormData,
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData,
  engagementData: EngagementData,
  totalHT1: number,
  totalHT2: number,
  totalHT3: number,
  totalHT: number,
  tva: number,
  totalTTC: number
): Promise<void> {
  const zip = new JSZip();
  
  // Générer le contenu HTML
  const devisHTML = generateDevisHTML(
    formData, reservationData, amenagementData, visibiliteData,
    totalHT1, totalHT2, totalHT3, totalHT, tva, totalTTC
  );
  
  const contractHTML = generateContractHTML(
    formData, reservationData, amenagementData, visibiliteData, engagementData,
    totalHT1, totalHT2, totalHT3, totalHT, tva, totalTTC
  );

  const contractPdfBytes = await generateContractPdfBytes(
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData
  );
  
  // Ajouter les fichiers au ZIP
  zip.file("devis-salon-made-in-hainaut.html", devisHTML);
  zip.file("contrat-participation-salon.html", contractHTML);
  zip.file(getContractPdfFilename(formData), contractPdfBytes);
  
  // Générer et télécharger le ZIP
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  
  const link = document.createElement('a');
  link.href = url;
  const sanitizedBase = sanitizeFilename(formData.raisonSociale || 'exposant');
  link.download = `documents-salon-${sanitizedBase}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Nettoyer l'URL
  URL.revokeObjectURL(url);
}