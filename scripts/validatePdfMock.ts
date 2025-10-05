import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import des constantes et données
import {
  standPrices,
  anglePrice,
  electricityPrices,
  exteriorSpacePrice,
  gardenCottagePrice,
  amenagementPrices,
  visibilitePrices,
  readyToExposePrices
} from '../src/lib/constants.js';

import {
  mockFormData,
  mockReservationData,
  mockAmenagementData,
  mockVisibiliteData
} from '../src/lib/mockData.js';

interface ValidationError {
  section: string;
  item: string;
  expected: number;
  actual: number;
  difference: number;
  formula: string;
}

const errors: ValidationError[] = [];
const warnings: string[] = [];

// Fonction helper pour arrondir à 2 décimales
const round = (n: number) => Math.round(n * 100) / 100;

console.log('🔍 VALIDATION DES CALCULS DU PDF MOCK\n');
console.log('=' .repeat(80));

// ==========================================
// SECTION 1: RÉSERVATION D'ESPACE (HT 01)
// ==========================================
console.log('\n📋 SECTION 1: RÉSERVATION D\'ESPACE\n');

let ht01 = 0;

// Stand équipé
if (mockReservationData.standType === 'equipped') {
  const size = parseInt(mockReservationData.standSize);
  const unitPrice = standPrices.equipped;
  const expected = round(size * unitPrice);
  const pdfValue = 4860.00; // Valeur extraite du PDF

  ht01 += expected;

  console.log(`Stand équipé ${size}m²`);
  console.log(`  Formule: ${size} × ${unitPrice}€/m² = ${expected}€`);
  console.log(`  PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Réservation - Stand équipé',
      item: `Stand équipé ${size}m²`,
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: `${size} × ${unitPrice}`
    });
    console.log(`  ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`  ✅ OK`);
  }
}

// Angles ouverts
if (mockReservationData.standAngles > 0) {
  const qty = mockReservationData.standAngles;
  const expected = round(qty * anglePrice);
  const pdfValue = 370.00; // Valeur extraite du PDF

  ht01 += expected;

  console.log(`\nAngles ouverts`);
  console.log(`  Formule: ${qty} × ${anglePrice}€ = ${expected}€`);
  console.log(`  PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Réservation - Angles',
      item: `${qty} angle(s)`,
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: `${qty} × ${anglePrice}`
    });
    console.log(`  ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`  ✅ OK`);
  }
}

// Électricité supérieure
if (mockReservationData.electricityUpgrade && mockReservationData.electricityUpgrade !== 'none') {
  const upgrade = mockReservationData.electricityUpgrade as keyof typeof electricityPrices;
  const expected = electricityPrices[upgrade];

  // Dans le PDF, on voit 3 lignes d'électricité avec 220, 260, 350
  // Mais d'après le mock, electricityUpgrade = 'none'
  console.log(`\n⚠️  Électricité supérieure: mock = '${mockReservationData.electricityUpgrade}'`);
  console.log(`    Le PDF montre les 3 options avec quantité = 1 chacune`);
  console.log(`    Cela semble être un problème de mock ou de mapping`);

  warnings.push('Électricité: Le mock indique "none" mais le PDF affiche les 3 options');
}

// Espace extérieur
if (mockReservationData.exteriorSpace) {
  const surface = parseInt(mockReservationData.exteriorSurface);
  const expected = round(surface * exteriorSpacePrice);
  const pdfValue = 600.00; // Valeur extraite du PDF

  ht01 += expected;

  console.log(`\nEspace extérieur`);
  console.log(`  Formule: ${surface}m² × ${exteriorSpacePrice}€/m² = ${expected}€`);
  console.log(`  PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Réservation - Espace extérieur',
      item: `${surface}m² extérieur`,
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: `${surface} × ${exteriorSpacePrice}`
    });
    console.log(`  ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`  ✅ OK`);
  }
}

// Garden cottage
if (mockReservationData.gardenCottage) {
  const expected = gardenCottagePrice;
  const pdfValue = 800.00; // Valeur extraite du PDF

  ht01 += expected;

  console.log(`\nGarden cottage`);
  console.log(`  Formule: 1 × ${expected}€ = ${expected}€`);
  console.log(`  PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Réservation - Garden cottage',
      item: 'Garden cottage',
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: `1 × ${expected}`
    });
    console.log(`  ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`  ✅ OK`);
  }
}

// NOTE: Dans le PDF, on voit les 3 lignes d'électricité avec quantité = 1
// Mais normalement on n'en sélectionne qu'une seule
// D'après le PDF: 220 + 260 + 350 = 830€
// Mais le mock dit electricityUpgrade = 'none'
// Donc pour matcher le PDF, il faut ajouter les 3 lignes:
const elecPdfTotal = 220 + 260 + 350;
console.log(`\n⚠️  Électricité: Le PDF affiche les 3 coffrets avec 830€ au total`);
console.log(`    Mock dit: '${mockReservationData.electricityUpgrade}'`);
console.log(`    Cela semble incorrect - normalement on sélectionne UNE SEULE puissance`);
warnings.push(`Électricité: Le PDF affiche 3 coffrets (830€) mais le mock dit "${mockReservationData.electricityUpgrade}"`);

// NE PAS ajouter l'électricité pour le moment car c'est incorrect
// ht01 += elecPdfTotal;

const pdfHT01 = 8230.00;
console.log(`\n${'─'.repeat(60)}`);
console.log(`TOTAL HT 01 calculé: ${ht01.toFixed(2)}€`);
console.log(`TOTAL HT 01 PDF: ${pdfHT01}€`);

if (round(ht01) !== pdfHT01) {
  console.log(`❌ ERREUR TOTAL HT 01: Écart de ${round(pdfHT01 - ht01)}€`);
  errors.push({
    section: 'TOTAL HT 01',
    item: 'Réservation d\'espace',
    expected: round(ht01),
    actual: pdfHT01,
    difference: pdfHT01 - round(ht01),
    formula: 'Somme des lignes section 1'
  });
} else {
  console.log(`✅ TOTAL HT 01 OK`);
}

// ==========================================
// SECTION 2: AMÉNAGEMENTS (HT 02)
// ==========================================
console.log('\n\n📋 SECTION 2: AMÉNAGEMENTS OPTIONNELS\n');

let ht02 = 0;

// Équipements stands
const equipements = [
  { name: 'Réserve mélaminée', qty: mockAmenagementData.reservePorteMelamine, price: amenagementPrices.reservePorteMelamine, pdfValue: 200.00 },
  { name: 'Moquette différente', qty: mockAmenagementData.moquetteDifferente, price: amenagementPrices.moquetteDifferente, pdfValue: 117.00 },
  { name: 'Velum stand', qty: mockAmenagementData.velumStand, price: amenagementPrices.velumStand, pdfValue: 270.00 },
  { name: 'Cloison bois gainée', qty: mockAmenagementData.cloisonBoisGainee, price: amenagementPrices.cloisonBoisGainee, pdfValue: 300.00 },
  { name: 'Bandeau signalétique', qty: mockAmenagementData.bandeauSignaletique, price: amenagementPrices.bandeauSignaletique, pdfValue: 210.00 },
];

console.log('Équipements stands:');
equipements.forEach(item => {
  if (item.qty > 0) {
    const expected = round(item.qty * item.price);
    ht02 += expected;

    console.log(`\n  ${item.name}`);
    console.log(`    Formule: ${item.qty} × ${item.price}€ = ${expected}€`);
    console.log(`    PDF: ${item.pdfValue}€`);

    if (expected !== item.pdfValue) {
      errors.push({
        section: 'Aménagements - Équipements',
        item: item.name,
        expected,
        actual: item.pdfValue,
        difference: item.pdfValue - expected,
        formula: `${item.qty} × ${item.price}`
      });
      console.log(`    ❌ ERREUR: Écart de ${item.pdfValue - expected}€`);
    } else {
      console.log(`    ✅ OK`);
    }
  }
});

// Mobilier
const mobilier = [
  { name: 'Comptoir', qty: mockAmenagementData.comptoir, price: amenagementPrices.comptoir, pdfValue: 165.00 },
  { name: 'Tabouret', qty: mockAmenagementData.tabouret, price: amenagementPrices.tabouret, pdfValue: 80.00 },
  { name: 'Mange-debout', qty: mockAmenagementData.mangeDebout, price: amenagementPrices.mangeDebout, pdfValue: 90.00 },
  { name: 'Chaise', qty: mockAmenagementData.chaise, price: amenagementPrices.chaise, pdfValue: 80.00 },
  { name: 'Table 120x60', qty: mockAmenagementData.table120x60, price: amenagementPrices.table120x60, pdfValue: 80.00 },
  { name: 'Mange + 3 tabourets', qty: mockAmenagementData.mange3Tabourets, price: amenagementPrices.mange3Tabourets, pdfValue: 195.00 },
  { name: 'Écran 52"', qty: mockAmenagementData.ecran52, price: amenagementPrices.ecran52, pdfValue: 395.00 },
  { name: 'Réfrigérateur 140L', qty: mockAmenagementData.refrigerateur140, price: amenagementPrices.refrigerateur140, pdfValue: 125.00 },
  { name: 'Réfrigérateur 240L', qty: mockAmenagementData.refrigerateur240, price: amenagementPrices.refrigerateur240, pdfValue: 210.00 },
  { name: 'Présentoir A4', qty: mockAmenagementData.presentoirA4, price: amenagementPrices.presentoirA4, pdfValue: 115.00 },
  { name: 'Bloc prises', qty: mockAmenagementData.blocPrises, price: amenagementPrices.blocPrises, pdfValue: 36.00 },
  { name: 'Fauteuil', qty: mockAmenagementData.fauteuil, price: amenagementPrices.fauteuil, pdfValue: 118.00 },
  { name: 'Table basse', qty: mockAmenagementData.tableBasse, price: amenagementPrices.tableBasse, pdfValue: 55.00 },
  { name: 'Guéridon haut', qty: mockAmenagementData.gueridonHaut, price: amenagementPrices.gueridonHaut, pdfValue: 55.00 },
  { name: 'Pouf cube', qty: mockAmenagementData.poufCube, price: amenagementPrices.poufCube, pdfValue: 33.00 },
  { name: 'Colonne vitrine', qty: mockAmenagementData.colonneVitrine, price: amenagementPrices.colonneVitrine, pdfValue: 252.00 },
  { name: 'Comptoir vitrine', qty: mockAmenagementData.comptoirVitrine, price: amenagementPrices.comptoirVitrine, pdfValue: 271.00 },
  { name: 'Porte-manteaux', qty: mockAmenagementData.porteManteux, price: amenagementPrices.porteManteux, pdfValue: 51.00 },
  { name: 'Plante bambou', qty: mockAmenagementData.planteBambou, price: amenagementPrices.planteBambou, pdfValue: 50.00 },
];

console.log('\n\nMobilier:');
mobilier.forEach(item => {
  if (item.qty > 0) {
    const expected = round(item.qty * item.price);
    ht02 += expected;

    console.log(`\n  ${item.name}`);
    console.log(`    Formule: ${item.qty} × ${item.price}€ = ${expected}€`);
    console.log(`    PDF: ${item.pdfValue}€`);

    if (expected !== item.pdfValue) {
      errors.push({
        section: 'Aménagements - Mobilier',
        item: item.name,
        expected,
        actual: item.pdfValue,
        difference: item.pdfValue - expected,
        formula: `${item.qty} × ${item.price}`
      });
      console.log(`    ❌ ERREUR: Écart de ${item.pdfValue - expected}€`);
    } else {
      console.log(`    ✅ OK`);
    }
  }
});

const pdfHT02 = 3853.00;
console.log(`\n${'─'.repeat(60)}`);
console.log(`TOTAL HT 02 calculé: ${ht02.toFixed(2)}€`);
console.log(`TOTAL HT 02 PDF: ${pdfHT02}€`);

if (round(ht02) !== pdfHT02) {
  console.log(`❌ ERREUR TOTAL HT 02: Écart de ${round(pdfHT02 - ht02)}€`);
  errors.push({
    section: 'TOTAL HT 02',
    item: 'Aménagements optionnels',
    expected: round(ht02),
    actual: pdfHT02,
    difference: pdfHT02 - round(ht02),
    formula: 'Somme des lignes section 2'
  });
} else {
  console.log(`✅ TOTAL HT 02 OK`);
}

// ==========================================
// SECTION 3: PRODUITS COMPLÉMENTAIRES + VISIBILITÉ (HT 03)
// ==========================================
console.log('\n\n📋 SECTION 3: PRODUITS COMPLÉMENTAIRES & VISIBILITÉ\n');

let ht03 = 0;

// Scan badges
if (mockAmenagementData.scanBadges) {
  const expected = amenagementPrices.scanBadges;
  const pdfValue = 150.00;

  ht03 += expected;

  console.log('Scan badges visiteurs');
  console.log(`  Formule: 1 × ${expected}€ = ${expected}€`);
  console.log(`  PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Produits complémentaires',
      item: 'Scan badges',
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: `1 × ${expected}`
    });
    console.log(`  ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`  ✅ OK`);
  }
}

// Pass soirée
if (mockAmenagementData.passSoiree > 0) {
  const qty = mockAmenagementData.passSoiree;
  const expected = round(qty * amenagementPrices.passSoiree);
  const pdfValue = 150.00;

  ht03 += expected;

  console.log(`\nPass soirée supplémentaires`);
  console.log(`  Formule: ${qty} × ${amenagementPrices.passSoiree}€ = ${expected}€`);
  console.log(`  PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Produits complémentaires',
      item: 'Pass soirée',
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: `${qty} × ${amenagementPrices.passSoiree}`
    });
    console.log(`  ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`  ✅ OK`);
  }
}

// Visibilité
const visibilite = [
  { name: 'Pack signalétique complet', active: mockVisibiliteData.packSignaletiqueComplet, price: visibilitePrices.packSignaletiqueComplet, pdfValue: 1020.00 },
  { name: 'Signalétique comptoir', active: mockVisibiliteData.signaletiqueComptoir, price: visibilitePrices.signaletiqueComptoir, pdfValue: 180.00 },
  { name: 'Signalétique haut cloisons', active: mockVisibiliteData.signaletiqueHautCloisons, price: visibilitePrices.signaletiqueHautCloisons, pdfValue: 435.00 },
  { name: 'Signalétique enseigne haute', active: mockVisibiliteData.signaletiqueEnseigneHaute, price: visibilitePrices.signaletiqueEnseigneHaute, pdfValue: 225.00 },
  { name: '1/2 page catalogue', active: mockVisibiliteData.demiPageCatalogue, price: visibilitePrices.demiPageCatalogue, pdfValue: 700.00 },
  { name: 'Page complète catalogue', active: mockVisibiliteData.pageCompleeteCatalogue, price: visibilitePrices.pageCompleeteCatalogue, pdfValue: 1200.00 },
  { name: 'Deuxième couverture', active: mockVisibiliteData.deuxiemeCouverture, price: visibilitePrices.deuxiemeCouverture, pdfValue: 1800.00 },
  { name: 'Quatrième couverture', active: mockVisibiliteData.quatriemeCouverture, price: visibilitePrices.quatriemeCouverture, pdfValue: 2300.00 },
  { name: 'Logo plan salon', active: mockVisibiliteData.logoplanSalon, price: visibilitePrices.logoplanSalon, pdfValue: 550.00 },
  { name: 'Documentation sac visiteur', active: mockVisibiliteData.documentationSacVisiteur, price: visibilitePrices.documentationSacVisiteur, pdfValue: 900.00 },
  { name: 'Distribution hôtesse', active: mockVisibiliteData.distributionHotesse, price: visibilitePrices.distributionHotesse, pdfValue: 1500.00 },
];

console.log('\n\nVisibilité & Communication:');
visibilite.forEach(item => {
  if (item.active) {
    const expected = item.price;
    ht03 += expected;

    console.log(`\n  ${item.name}`);
    console.log(`    Formule: 1 × ${item.price}€ = ${expected}€`);
    console.log(`    PDF: ${item.pdfValue}€`);

    if (expected !== item.pdfValue) {
      errors.push({
        section: 'Visibilité',
        item: item.name,
        expected,
        actual: item.pdfValue,
        difference: item.pdfValue - expected,
        formula: `1 × ${item.price}`
      });
      console.log(`    ❌ ERREUR: Écart de ${item.pdfValue - expected}€`);
    } else {
      console.log(`    ✅ OK`);
    }
  }
});

// Signalétique cloison complète (cas spécial)
if (mockVisibiliteData.signalethqueCloisons > 0) {
  const qty = mockVisibiliteData.signalethqueCloisons;
  let expected: number;

  if (qty >= 3) {
    // Premier à 185€, les suivants à 120€
    expected = round(visibilitePrices.signalethqueCloisons + (qty - 1) * 120);
  } else {
    expected = round(qty * visibilitePrices.signalethqueCloisons);
  }

  const pdfValue = 370.00; // 2 cloisons dans le PDF
  ht03 += expected;

  console.log(`\n  Signalétique cloison complète`);
  console.log(`    Quantité: ${qty}`);
  console.log(`    Formule: ${qty >= 3 ? `185€ + ${qty - 1} × 120€` : `${qty} × 185€`} = ${expected}€`);
  console.log(`    PDF: ${pdfValue}€`);

  if (expected !== pdfValue) {
    errors.push({
      section: 'Visibilité',
      item: 'Signalétique cloison complète',
      expected,
      actual: pdfValue,
      difference: pdfValue - expected,
      formula: qty >= 3 ? `185 + ${qty - 1} × 120` : `${qty} × 185`
    });
    console.log(`    ❌ ERREUR: Écart de ${pdfValue - expected}€`);
  } else {
    console.log(`    ✅ OK`);
  }
}

const pdfHT03 = 11180.00;
console.log(`\n${'─'.repeat(60)}`);
console.log(`TOTAL HT 03 calculé: ${ht03.toFixed(2)}€`);
console.log(`TOTAL HT 03 PDF: ${pdfHT03}€`);

if (round(ht03) !== pdfHT03) {
  console.log(`❌ ERREUR TOTAL HT 03: Écart de ${round(pdfHT03 - ht03)}€`);
  errors.push({
    section: 'TOTAL HT 03',
    item: 'Produits complémentaires + Visibilité',
    expected: round(ht03),
    actual: pdfHT03,
    difference: pdfHT03 - round(ht03),
    formula: 'Somme des lignes section 3'
  });
} else {
  console.log(`✅ TOTAL HT 03 OK`);
}

// ==========================================
// TOTAUX FINAUX
// ==========================================
console.log('\n\n📋 TOTAUX FINAUX\n');

const totalHTCalculated = round(ht01 + ht02 + ht03);
const totalHTPdf = 23263.00;

console.log(`Total HT calculé: ${totalHTCalculated.toFixed(2)}€`);
console.log(`Total HT PDF: ${totalHTPdf}€`);

if (totalHTCalculated !== totalHTPdf) {
  console.log(`❌ ERREUR TOTAL HT: Écart de ${round(totalHTPdf - totalHTCalculated)}€`);
  errors.push({
    section: 'TOTAUX FINAUX',
    item: 'Total HT',
    expected: totalHTCalculated,
    actual: totalHTPdf,
    difference: totalHTPdf - totalHTCalculated,
    formula: 'HT01 + HT02 + HT03'
  });
} else {
  console.log(`✅ TOTAL HT OK`);
}

const tvaCalculated = round(totalHTCalculated * 0.20);
const tvaPdf = 4652.60;

console.log(`\nTVA 20% calculée: ${tvaCalculated.toFixed(2)}€`);
console.log(`TVA 20% PDF: ${tvaPdf}€`);

if (Math.abs(tvaCalculated - tvaPdf) > 0.01) {
  console.log(`❌ ERREUR TVA: Écart de ${round(tvaPdf - tvaCalculated)}€`);
  errors.push({
    section: 'TOTAUX FINAUX',
    item: 'TVA 20%',
    expected: tvaCalculated,
    actual: tvaPdf,
    difference: tvaPdf - tvaCalculated,
    formula: 'Total HT × 20%'
  });
} else {
  console.log(`✅ TVA OK`);
}

const totalTTCCalculated = round(totalHTCalculated + tvaCalculated);
const totalTTCPdf = 27915.60;

console.log(`\nTotal TTC calculé: ${totalTTCCalculated.toFixed(2)}€`);
console.log(`Total TTC PDF: ${totalTTCPdf}€`);

if (Math.abs(totalTTCCalculated - totalTTCPdf) > 0.01) {
  console.log(`❌ ERREUR TOTAL TTC: Écart de ${round(totalTTCPdf - totalTTCCalculated)}€`);
  errors.push({
    section: 'TOTAUX FINAUX',
    item: 'Total TTC',
    expected: totalTTCCalculated,
    actual: totalTTCPdf,
    difference: totalTTCPdf - totalTTCCalculated,
    formula: 'Total HT + TVA'
  });
} else {
  console.log(`✅ TOTAL TTC OK`);
}

// ==========================================
// RAPPORT FINAL
// ==========================================
console.log('\n\n' + '='.repeat(80));
console.log('📊 RAPPORT DE VALIDATION');
console.log('='.repeat(80));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ Aucune erreur détectée ! Tous les calculs sont corrects.');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} erreur(s) détectée(s):\n`);

    errors.forEach((error, index) => {
      console.log(`${index + 1}. [${error.section}] ${error.item}`);
      console.log(`   Formule: ${error.formula}`);
      console.log(`   Attendu: ${error.expected.toFixed(2)}€`);
      console.log(`   Actuel (PDF): ${error.actual.toFixed(2)}€`);
      console.log(`   Écart: ${error.difference > 0 ? '+' : ''}${error.difference.toFixed(2)}€`);
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} avertissement(s):\n`);
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
  }
}

// Générer un fichier de rapport
const reportContent = `# Rapport de validation du PDF Mock

Date: ${new Date().toLocaleString('fr-FR')}

## Résumé

- Erreurs détectées: ${errors.length}
- Avertissements: ${warnings.length}

## Détails des erreurs

${errors.length === 0 ? '✅ Aucune erreur' : errors.map((error, index) => `
### ${index + 1}. ${error.section} - ${error.item}

- **Formule**: \`${error.formula}\`
- **Attendu**: ${error.expected.toFixed(2)}€
- **Actuel (PDF)**: ${error.actual.toFixed(2)}€
- **Écart**: ${error.difference > 0 ? '+' : ''}${error.difference.toFixed(2)}€
`).join('\n')}

## Avertissements

${warnings.length === 0 ? '✅ Aucun avertissement' : warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}

## Totaux récapitulatifs

| Section | Calculé | PDF | Écart |
|---------|---------|-----|-------|
| HT 01 | ${ht01.toFixed(2)}€ | ${pdfHT01}€ | ${(pdfHT01 - ht01).toFixed(2)}€ |
| HT 02 | ${ht02.toFixed(2)}€ | ${pdfHT02}€ | ${(pdfHT02 - ht02).toFixed(2)}€ |
| HT 03 | ${ht03.toFixed(2)}€ | ${pdfHT03}€ | ${(pdfHT03 - ht03).toFixed(2)}€ |
| **Total HT** | **${totalHTCalculated.toFixed(2)}€** | **${totalHTPdf}€** | **${(totalHTPdf - totalHTCalculated).toFixed(2)}€** |
| TVA 20% | ${tvaCalculated.toFixed(2)}€ | ${tvaPdf}€ | ${(tvaPdf - tvaCalculated).toFixed(2)}€ |
| **Total TTC** | **${totalTTCCalculated.toFixed(2)}€** | **${totalTTCPdf}€** | **${(totalTTCPdf - totalTTCCalculated).toFixed(2)}€** |
`;

const reportPath = path.join(__dirname, '..', 'pdf-validation-report.md');
fs.writeFileSync(reportPath, reportContent, 'utf-8');

console.log(`\n📄 Rapport détaillé généré: pdf-validation-report.md`);
console.log('\n' + '='.repeat(80));

// Exit code
process.exit(errors.length > 0 ? 1 : 0);
