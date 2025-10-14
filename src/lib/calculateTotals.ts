import { ReservationData, AmenagementData, VisibiliteData } from './types';
import {
  standPrices,
  anglePrice,
  electricityPrices,
  exteriorSpacePrice,
  gardenCottagePrice,
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
    section3: {}
  };

  // ========================================
  // SECTION 1: RÉSERVATION D'ESPACE
  // ========================================
  let ht1 = 0;

  // Stand
  if (reservationData.standType && reservationData.standSize) {
    const size = parseInt(reservationData.standSize);
    let standCost = 0;

    switch (reservationData.standType) {
      case 'equipped':
        standCost = size * standPrices.equipped;
        details.section1[`Stand équipé ${size}m²`] = standCost;
        break;
      case 'bare':
        standCost = size * standPrices.bare;
        details.section1[`Stand nu ${size}m²`] = standCost;
        break;
      case 'ready':
        standCost = readyToExposePrices[reservationData.standSize] || 0;
        details.section1[`Pack prêt à exposer ${size}m²`] = standCost;
        break;
    }

    ht1 += standCost;
  }

  // Angles ouverts
  if (reservationData.standAngles > 0) {
    const anglesCost = reservationData.standAngles * anglePrice;
    details.section1['Angles ouverts'] = anglesCost;
    ht1 += anglesCost;
  }

  // Électricité supérieure
  if (reservationData.electricityUpgrade && reservationData.electricityUpgrade !== 'none') {
    const elecCost = electricityPrices[reservationData.electricityUpgrade as keyof typeof electricityPrices] || 0;
    details.section1[`Coffret électrique ${reservationData.electricityUpgrade}`] = elecCost;
    ht1 += elecCost;
  }

  // Espace extérieur
  if (reservationData.exteriorSpace && reservationData.exteriorSurface) {
    const surface = Math.min(
      Math.max(parseInt(reservationData.exteriorSurface, 10) || 0, 0),
      80
    );

    if (surface > 0) {
      const extCost = surface * exteriorSpacePrice;
      details.section1[`Espace extérieur ${surface}m²`] = extCost;
      ht1 += extCost;
    }
  }

  // Garden cottage
  if (reservationData.gardenCottage) {
    details.section1['Garden cottage'] = gardenCottagePrice;
    ht1 += gardenCottagePrice;
  }

  // ========================================
  // SECTION 2: AMÉNAGEMENTS
  // ========================================
  let ht2 = 0;

  // Équipements stands
  const equipements: { [key: string]: { qty: number; price: number } } = {
    'Réserve mélaminée': { qty: amenagementData.reservePorteMelamine, price: amenagementPrices.reservePorteMelamine },
    'Moquette différente': { qty: amenagementData.moquetteDifferente, price: amenagementPrices.moquetteDifferente },
    'Velum': { qty: amenagementData.velumStand, price: amenagementPrices.velumStand },
    'Cloison bois gainée': { qty: amenagementData.cloisonBoisGainee, price: amenagementPrices.cloisonBoisGainee },
    'Réserve bois': { qty: amenagementData.reservePorteBois, price: amenagementPrices.reservePorteBois },
    'Bandeau signalétique': { qty: amenagementData.bandeauSignaletique, price: amenagementPrices.bandeauSignaletique },
  };

  Object.entries(equipements).forEach(([name, { qty, price }]) => {
    if (qty > 0) {
      const cost = qty * price;
      details.section2[name] = cost;
      ht2 += cost;
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
      details.section2[name] = cost;
      ht2 += cost;
    }
  });

  // ========================================
  // SECTION 3: PRODUITS COMPLÉMENTAIRES + VISIBILITÉ
  // ========================================
  let ht3 = 0;

  // Scan badges
  if (amenagementData.scanBadges) {
    details.section3['Scan badges'] = amenagementPrices.scanBadges;
    ht3 += amenagementPrices.scanBadges;
  }

  // Pass soirée
  if (amenagementData.passSoiree > 0) {
    const passCost = amenagementData.passSoiree * amenagementPrices.passSoiree;
    details.section3['Pass soirée'] = passCost;
    ht3 += passCost;
  }

  // Signalétique
  if (visibiliteData.packSignaletiqueComplet) {
    const standSize = parseInt(reservationData.standSize || '0');
    const packCost = standSize > 0 ? standSize * visibilitePrices.packSignaletiqueComplet : 0;
    details.section3['Pack signalétique complet'] = packCost;
    ht3 += packCost;
  }

  if (visibiliteData.signaletiqueComptoir) {
    details.section3['Signalétique comptoir'] = visibilitePrices.signaletiqueComptoir;
    ht3 += visibilitePrices.signaletiqueComptoir;
  }

  if (visibiliteData.signaletiqueHautCloisons) {
    const standSize = parseInt(reservationData.standSize || '0');
    const hautCost = standSize > 0 ? standSize * visibilitePrices.signaletiqueHautCloisons : 0;
    details.section3['Signalétique haut cloisons'] = hautCost;
    ht3 += hautCost;
  }

  if (visibiliteData.signalethqueCloisons > 0) {
    const qty = visibiliteData.signalethqueCloisons;
    const cloisonCost = qty * visibilitePrices.signalethqueCloisons;
    details.section3['Signalétique cloison complète'] = cloisonCost;
    ht3 += cloisonCost;
  }

  if (visibiliteData.signaletiqueEnseigneHaute) {
    details.section3['Signalétique enseigne haute'] = visibilitePrices.signaletiqueEnseigneHaute;
    ht3 += visibilitePrices.signaletiqueEnseigneHaute;
  }

  // Communication
  const communication: { [key: string]: { active: boolean; price: number } } = {
    '1/2 page catalogue': { active: visibiliteData.demiPageCatalogue, price: visibilitePrices.demiPageCatalogue },
    'Page complète catalogue': { active: visibiliteData.pageCompleeteCatalogue, price: visibilitePrices.pageCompleeteCatalogue },
    'Deuxième couverture': { active: visibiliteData.deuxiemeCouverture, price: visibilitePrices.deuxiemeCouverture },
    'Quatrième couverture': { active: visibiliteData.quatriemeCouverture, price: visibilitePrices.quatriemeCouverture },
    'Logo plan salon': { active: visibiliteData.logoplanSalon, price: visibilitePrices.logoplanSalon },
    'Documentation sac visiteur': { active: visibiliteData.documentationSacVisiteur, price: visibilitePrices.documentationSacVisiteur },
    'Distribution hôtesse': { active: visibiliteData.distributionHotesse, price: visibilitePrices.distributionHotesse },
  };

  Object.entries(communication).forEach(([name, { active, price }]) => {
    if (active) {
      details.section3[name] = price;
      ht3 += price;
    }
  });

  // ========================================
  // TOTAUX FINAUX
  // ========================================
  const ht4 = 0; // Section 4 vide par défaut
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

  console.log('\n📋 Section 3 - Produits complémentaires & Visibilité:');
  Object.entries(totals.details.section3).forEach(([item, value]) => {
    console.log(`  ${item.padEnd(40)} ${value.toFixed(2)}€`);
  });
  console.log(`  ${'TOTAL HT 03'.padEnd(40)} ${totals.ht3.toFixed(2)}€`);

  console.log('\n' + '─'.repeat(80));
  console.log(`  ${'TOTAL HT'.padEnd(40)} ${totals.ht.toFixed(2)}€`);
  console.log(`  ${'TVA 20%'.padEnd(40)} ${totals.tva.toFixed(2)}€`);
  console.log(`  ${'TOTAL TTC'.padEnd(40)} ${totals.ttc.toFixed(2)}€`);
  console.log('='.repeat(80));
}
