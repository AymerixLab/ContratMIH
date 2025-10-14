import { ReservationData, AmenagementData, VisibiliteData } from './types';
import {
  standPrices,
  anglePrice,
  electricityPrices,
  exteriorSpacePrice,
  gardenCottagePrice,
  microStandPrice,
  coExpositionPrice,
  amenagementPrices,
  visibilitePrices,
  readyToExposePrices
} from './constants';

/**
 * Calculateur de totaux centralisé
 * Utilisé par le générateur de PDF et les scripts de validation
 */

export interface TotalsBreakdown {
  ht1: number;
  ht2: number;
  ht3: number;
  ht4: number;
  ht: number;
  tva: number;
  ttc: number;
  details: {
    section1: { [key: string]: number };
    section2: { [key: string]: number };
    section3: { [key: string]: number };
    section4: { [key: string]: number };
  };
}

/**
 * Calcule tous les totaux à partir des données du formulaire
 */
export function calculateTotals(
  reservationData: ReservationData,
  amenagementData: AmenagementData,
  visibiliteData: VisibiliteData
): TotalsBreakdown {
  const details: TotalsBreakdown['details'] = {
    section1: {},
    section2: {},
    section3: {},
    section4: {}
  };

  const addDetail = (
    section: keyof TotalsBreakdown['details'],
    label: string,
    amount: number
  ): number => {
    if (amount <= 0) {
      return 0;
    }

    details[section][label] = Math.round(amount * 100) / 100;
    return amount;
  };

  // ========================================
  // SECTION 1: RÉSERVATION D'ESPACE
  // ========================================
  let ht1 = 0;

  const addSection1 = (label: string, amount: number) => {
    ht1 += addDetail('section1', label, amount);
  };

  // Stand
  if (reservationData.standType && reservationData.standSize) {
    const size = parseInt(reservationData.standSize);

    switch (reservationData.standType) {
      case 'equipped':
        addSection1(`Stand équipé ${size}m²`, size * standPrices.equipped);
        break;
      case 'bare':
        addSection1(`Stand nu ${size}m²`, size * standPrices.bare);
        break;
      case 'ready':
        addSection1(
          `Pack "Prêt à exposer" ${size}m²`,
          readyToExposePrices[reservationData.standSize] || 0
        );
        break;
    }
  }

  // Angles ouverts
  if (reservationData.standAngles > 0) {
    const anglesCost = reservationData.standAngles * anglePrice;
    addSection1('Angles ouverts', anglesCost);
  }

  // Électricité supérieure
  if (reservationData.electricityUpgrade && reservationData.electricityUpgrade !== 'none') {
    const elecCost = electricityPrices[reservationData.electricityUpgrade as keyof typeof electricityPrices] || 0;
    const powerLabel = reservationData.electricityUpgrade.toUpperCase();
    addSection1(`Coffret électrique ${powerLabel}`, elecCost);
  }

  // Espace extérieur
  if (reservationData.exteriorSpace && reservationData.exteriorSurface) {
    const surface = Math.min(
      Math.max(parseInt(reservationData.exteriorSurface, 10) || 0, 0),
      80
    );

    if (surface > 0) {
      const extCost = surface * exteriorSpacePrice;
      addSection1(`Espace extérieur ${surface}m²`, extCost);
    }
  }

  // Garden cottage
  if (reservationData.gardenCottage) {
    addSection1('Garden cottage (3m x 3m)', gardenCottagePrice);
  }

  if (reservationData.microStand) {
    addSection1('Micro-stand équipé 4m²', microStandPrice);
  }

  if (reservationData.coExposants && reservationData.coExposants.length > 0) {
    const coExpoCount = reservationData.coExposants.length;
    const coExpoCost = coExpoCount * coExpositionPrice;
    addSection1(`Co-exposants (${coExpoCount})`, coExpoCost);
  }

  // ========================================
  // SECTION 2: AMÉNAGEMENTS
  // ========================================
  let ht2 = 0;

  const addSection2 = (label: string, amount: number) => {
    ht2 += addDetail('section2', label, amount);
  };

  // Équipements stands
  const equipements: { [key: string]: { qty: number; price: number } } = {
    'Réserve mélaminée': { qty: amenagementData.reservePorteMelamine, price: amenagementPrices.reservePorteMelamine },
    'Moquette différente': { qty: amenagementData.moquetteDifferente, price: amenagementPrices.moquetteDifferente },
    'Velum': { qty: amenagementData.velumStand, price: amenagementPrices.velumStand },
    'Cloison bois gainée': { qty: amenagementData.cloisonBoisGainee, price: amenagementPrices.cloisonBoisGainee },
    'Réserve bois': { qty: amenagementData.reservePorteBois, price: amenagementPrices.reservePorteBois },
    'Bandeau signalétique': { qty: amenagementData.bandeauSignaletique, price: amenagementPrices.bandeauSignaletique },
    'Rail de 3 spots supplémentaires': { qty: amenagementData.railSpots, price: amenagementPrices.railSpots },
  };

  Object.entries(equipements).forEach(([name, { qty, price }]) => {
    if (qty > 0) {
      const cost = qty * price;
      addSection2(name, cost);
    }
  });

  // Mobilier
  const mobilier: { [key: string]: { qty: number; price: number } } = {
    'Comptoir': { qty: amenagementData.comptoir, price: amenagementPrices.comptoir },
    'Tabouret': { qty: amenagementData.tabouret, price: amenagementPrices.tabouret },
    'Mange-debout': { qty: amenagementData.mangeDebout, price: amenagementPrices.mangeDebout },
    'Chaise': { qty: amenagementData.chaise, price: amenagementPrices.chaise },
    'Table 120x60': { qty: amenagementData.table120x60, price: amenagementPrices.table120x60 },
    'Mange + 3 tabourets': { qty: amenagementData.mange3Tabourets, price: amenagementPrices.mange3Tabourets },
    'Écran 52"': { qty: amenagementData.ecran52, price: amenagementPrices.ecran52 },
    'Réfrigérateur 140L': { qty: amenagementData.refrigerateur140, price: amenagementPrices.refrigerateur140 },
    'Réfrigérateur 240L': { qty: amenagementData.refrigerateur240, price: amenagementPrices.refrigerateur240 },
    'Présentoir A4': { qty: amenagementData.presentoirA4, price: amenagementPrices.presentoirA4 },
    'Bloc prises': { qty: amenagementData.blocPrises, price: amenagementPrices.blocPrises },
    'Fauteuil': { qty: amenagementData.fauteuil, price: amenagementPrices.fauteuil },
    'Table basse': { qty: amenagementData.tableBasse, price: amenagementPrices.tableBasse },
    'Guéridon': { qty: amenagementData.gueridonHaut, price: amenagementPrices.gueridonHaut },
    'Pouf cube': { qty: amenagementData.poufCube, price: amenagementPrices.poufCube },
    'Colonne vitrine': { qty: amenagementData.colonneVitrine, price: amenagementPrices.colonneVitrine },
    'Comptoir vitrine': { qty: amenagementData.comptoirVitrine, price: amenagementPrices.comptoirVitrine },
    'Porte-manteaux': { qty: amenagementData.porteManteux, price: amenagementPrices.porteManteux },
    'Plante bambou': { qty: amenagementData.planteBambou, price: amenagementPrices.planteBambou },
    'Plante kentia': { qty: amenagementData.planteKentia, price: amenagementPrices.planteKentia },
  };

  Object.entries(mobilier).forEach(([name, { qty, price }]) => {
    if (qty > 0) {
      const cost = qty * price;
      addSection2(name, cost);
    }
  });

  // ========================================
  // SECTION 3: PRODUITS COMPLÉMENTAIRES
  // ========================================
  let ht3 = 0;

  const addSection3 = (label: string, amount: number) => {
    ht3 += addDetail('section3', label, amount);
  };

  if (amenagementData.scanBadges) {
    addSection3('Scan badges visiteurs', amenagementPrices.scanBadges);
  }

  if (amenagementData.passSoiree > 0) {
    const passCost = amenagementData.passSoiree * amenagementPrices.passSoiree;
    addSection3('Pass soirée complémentaires', passCost);
  }

  // ========================================
  // SECTION 4: VISIBILITÉ & COMMUNICATION
  // ========================================
  let ht4 = 0;

  const addSection4 = (label: string, amount: number) => {
    ht4 += addDetail('section4', label, amount);
  };

  if (visibiliteData.packSignaletiqueComplet) {
    const surface = reservationData.standSize ? parseInt(reservationData.standSize, 10) || 0 : 0;
    const amount = surface > 0
      ? surface * visibilitePrices.packSignaletiqueComplet
      : visibilitePrices.packSignaletiqueComplet;
    addSection4(
      surface > 0
        ? `Pack signalétique complet (${surface} m² × ${visibilitePrices.packSignaletiqueComplet} €)`
        : 'Pack signalétique complet (125 € / m²)',
      amount
    );
  }

  if (visibiliteData.signaletiqueComptoir) {
    addSection4('Signalétique comptoir', visibilitePrices.signaletiqueComptoir);
  }

  if (visibiliteData.signaletiqueHautCloisons) {
    const surface = reservationData.standSize ? parseInt(reservationData.standSize, 10) || 0 : 0;
    const amount = surface > 0
      ? surface * visibilitePrices.signaletiqueHautCloisons
      : visibilitePrices.signaletiqueHautCloisons;
    addSection4(
      surface > 0
        ? `Signalétique haut cloisons (${surface} m² × ${visibilitePrices.signaletiqueHautCloisons} €)`
        : 'Signalétique haut cloisons (50 € / m²)',
      amount
    );
  }

  if (visibiliteData.signalethqueCloisons > 0) {
    const qty = visibiliteData.signalethqueCloisons;
    const cloisonCost = qty * visibilitePrices.signalethqueCloisons;
    addSection4(`Signalétique cloison complète (${qty} × ${visibilitePrices.signalethqueCloisons} €)`, cloisonCost);
  }

  if (visibiliteData.signaletiqueEnseigneHaute) {
    addSection4('Signalétique enseigne haute', visibilitePrices.signaletiqueEnseigneHaute);
  }

  const communication: { [key: string]: { active: boolean; price: number } } = {
    '1/2 page catalogue': { active: visibiliteData.demiPageCatalogue, price: visibilitePrices.demiPageCatalogue },
    'Page complète catalogue': { active: visibiliteData.pageCompleeteCatalogue, price: visibilitePrices.pageCompleeteCatalogue },
    'Deuxième couverture': { active: visibiliteData.deuxiemeCouverture, price: visibilitePrices.deuxiemeCouverture },
    'Quatrième couverture': { active: visibiliteData.quatriemeCouverture, price: visibilitePrices.quatriemeCouverture },
    'Logo plan salon': { active: visibiliteData.logoplanSalon, price: visibilitePrices.logoplanSalon },
    'Documentation sac visiteur (3 000 sacs – 4 entreprises)': { active: visibiliteData.documentationSacVisiteur, price: visibilitePrices.documentationSacVisiteur },
    'Distribution hôtesse (2 jours)': { active: visibiliteData.distributionHotesse, price: visibilitePrices.distributionHotesse },
  };

  Object.entries(communication).forEach(([name, { active, price }]) => {
    if (active) {
      addSection4(name, price);
    }
  });

  // ========================================
  // TOTAUX FINAUX
  // ========================================
  const ht = ht1 + ht2 + ht3 + ht4;
  const tva = ht * 0.20;
  const ttc = ht + tva;

  return {
    ht1: Math.round(ht1 * 100) / 100,
    ht2: Math.round(ht2 * 100) / 100,
    ht3: Math.round(ht3 * 100) / 100,
    ht4: Math.round(ht4 * 100) / 100,
    ht: Math.round(ht * 100) / 100,
    tva: Math.round(tva * 100) / 100,
    ttc: Math.round(ttc * 100) / 100,
    details
  };
}

/**
 * Affiche un résumé lisible des totaux calculés
 */
export function displayTotals(totals: TotalsBreakdown): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 TOTAUX CALCULÉS');
  console.log('='.repeat(80));

  console.log('\n📋 Section 1 - Réservation d\'espace:');
  Object.entries(totals.details.section1).forEach(([item, value]) => {
    console.log(`  ${item.padEnd(40)} ${value.toFixed(2)}€`);
  });
  console.log(`  ${'TOTAL HT 01'.padEnd(40)} ${totals.ht1.toFixed(2)}€`);

  console.log('\n📋 Section 2 - Aménagements:');
  Object.entries(totals.details.section2).forEach(([item, value]) => {
    console.log(`  ${item.padEnd(40)} ${value.toFixed(2)}€`);
  });
  console.log(`  ${'TOTAL HT 02'.padEnd(40)} ${totals.ht2.toFixed(2)}€`);

  console.log('\n📋 Section 3 - Produits complémentaires:');
  Object.entries(totals.details.section3).forEach(([item, value]) => {
    console.log(`  ${item.padEnd(40)} ${value.toFixed(2)}€`);
  });
  console.log(`  ${'TOTAL HT 03'.padEnd(40)} ${totals.ht3.toFixed(2)}€`);

  console.log('\n📋 Section 4 - Visibilité & communication:');
  Object.entries(totals.details.section4).forEach(([item, value]) => {
    console.log(`  ${item.padEnd(40)} ${value.toFixed(2)}€`);
  });
  console.log(`  ${'TOTAL HT 04'.padEnd(40)} ${totals.ht4.toFixed(2)}€`);

  console.log('\n' + '─'.repeat(80));
  console.log(`  ${'TOTAL HT'.padEnd(40)} ${totals.ht.toFixed(2)}€`);
  console.log(`  ${'TVA 20%'.padEnd(40)} ${totals.tva.toFixed(2)}€`);
  console.log(`  ${'TOTAL TTC'.padEnd(40)} ${totals.ttc.toFixed(2)}€`);
  console.log('='.repeat(80));
}
