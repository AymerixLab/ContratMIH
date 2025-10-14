import { FormData, ReservationData, AmenagementData, VisibiliteData } from './types';
import { exteriorSpacePrice } from './constants';

export function generateStandTypeDescription(standType: string): string {
  const descriptions = {
    'equipped': 'Cloisons mélaminées - hauteur 2,5 m<br>Moquette coloris unique<br>1 enseigne d\'appeau<br>2 spots / 9 m²<br>1 coffret électrique 1 kW',
    'ready': 'Cloisons médium - hauteur 2,5 m<br>1 enseigne haute sur élevée<br>1 réserve et un accueil avec porte<br>1 rail de 3 spots / 9m²<br>1 coffret électrique 1 kW',
    'bare': 'Moquette coloris unique<br>1 coffret électrique 1 kW / 9 m²'
  };
  return descriptions[standType as keyof typeof descriptions] || '';
}

export function generateStandTypeName(standType: string): string {
  const names = {
    'equipped': 'STAND ÉQUIPÉ',
    'ready': 'PRÊT À EXPOSER',
    'bare': 'STAND NU'
  };
  return names[standType as keyof typeof names] || '';
}

export function generateDevisTableRows(
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData
): string {
  const rows: string[] = [];
  
  // Stand principal
  if (reservationData.standType && reservationData.standSize) {
    const standTypePrices = { 'equipped': 270, 'ready': 296, 'bare': 225 };
    const size = parseInt(reservationData.standSize);
    const unitPrice = standTypePrices[reservationData.standType as keyof typeof standTypePrices];
    const totalPrice = size * unitPrice;
    
    rows.push(`
      <tr>
        <td>
          <strong>${generateStandTypeName(reservationData.standType)}</strong><br>
          ${generateStandTypeDescription(reservationData.standType)}
        </td>
        <td>${size}</td>
        <td>m²</td>
        <td>${unitPrice} €</td>
        <td>0,00%</td>
        <td>20,00%</td>
        <td>${(totalPrice * 1.2).toFixed(2)} €</td>
      </tr>
    `);
  }
  
  // Angles ouverts
  if (reservationData.standAngles > 0) {
    const totalAngles = reservationData.standAngles * 185;
    rows.push(`
      <tr>
        <td>Angles ouverts</td>
        <td>${reservationData.standAngles}</td>
        <td>unité</td>
        <td>185 €</td>
        <td>0,00%</td>
        <td>20,00%</td>
        <td>${(totalAngles * 1.2).toFixed(2)} €</td>
      </tr>
    `);
  }
  
  // Électricité supérieure
  if (reservationData.electricityUpgrade && reservationData.electricityUpgrade !== 'none') {
    const electricityPrices = { '2kw': 220, '4kw': 260, '6kw': 350 };
    const price = electricityPrices[reservationData.electricityUpgrade as keyof typeof electricityPrices] || 0;
    if (price > 0) {
      rows.push(`
        <tr>
          <td>Coffret électrique ${reservationData.electricityUpgrade.toUpperCase()}</td>
          <td>1</td>
          <td>unité</td>
          <td>${price} €</td>
          <td>0,00%</td>
          <td>20,00%</td>
          <td>${(price * 1.2).toFixed(2)} €</td>
        </tr>
      `);
    }
  }
  
  // Espace extérieur
  if (reservationData.exteriorSpace && reservationData.exteriorSurface) {
    const rawSurface = parseInt(reservationData.exteriorSurface || '0', 10) || 0;
    const surface = Math.min(Math.max(rawSurface, 0), 80);

    if (surface > 0) {
      const totalHT = surface * exteriorSpacePrice;
      const totalTTC = totalHT * 1.2;
    rows.push(`
      <tr>
        <td>Espace extérieur</td>
        <td>${surface}</td>
        <td>m²</td>
        <td>${exteriorSpacePrice.toLocaleString('fr-FR')} €</td>
        <td>0,00%</td>
        <td>20,00%</td>
        <td>${totalTTC.toFixed(2)} €</td>
      </tr>
    `);
    }
  }
  
  // Garden cottage
  if (reservationData.gardenCottage) {
    rows.push(`
      <tr>
        <td>Garden cottage (3mx3m)</td>
        <td>1</td>
        <td>unité</td>
        <td>800 €</td>
        <td>0,00%</td>
        <td>20,00%</td>
        <td>${(800 * 1.2).toFixed(2)} €</td>
      </tr>
    `);
  }
  
  // Micro-stand
  if (reservationData.microStand) {
    rows.push(`
      <tr>
        <td>Micro-stand 4m²</td>
        <td>1</td>
        <td>unité</td>
        <td>1200 €</td>
        <td>0,00%</td>
        <td>20,00%</td>
        <td>${(1200 * 1.2).toFixed(2)} €</td>
      </tr>
    `);
  }
  
  return rows.join('');
}

export function generateClientInfoSection(formData: FormData): string {
  return `
    <div class="info-box">
        <h3>Informations Client</h3>
        <p><strong>${formData.raisonSociale}</strong></p>
        <p>${formData.adresse}</p>
        <p>${formData.codePostal} ${formData.ville}</p>
        <p>${formData.pays}</p>
        <p>Tél: ${formData.tel}</p>
        <p>SIRET: ${formData.siret}</p>
        <p>Enseigne: ${formData.enseigne}</p>
    </div>
  `;
}

export function generateCompanyInfoSection(): string {
  return `
    <div class="info-box">
        <h3>Porte du Hainaut Développement</h3>
        <p>Site Minier d'Arenberg</p>
        <p>La Porte du Hainaut</p>
        <p>59135 - Wallers</p>
        <p>France</p>
        <p>Tél: 03 27 09 91 21</p>
    </div>
  `;
}