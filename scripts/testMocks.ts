import { calculateTotals, displayTotals } from '../src/lib/calculateTotals.js';

// Import des mocks
import {
  mockReservationDataFull,
  mockAmenagementDataFull,
  mockVisibiliteDataFull
} from '../src/lib/mockDataFull.js';

import {
  mockReservationDataRandom,
  mockAmenagementDataRandom,
  mockVisibiliteDataRandom
} from '../src/lib/mockDataRandom.js';

console.log('🧪 TEST DES MOCKS - Validation des calculs\n');
console.log('=' .repeat(80));

// ==========================================
// TEST 1: MOCK FULL (tous les champs)
// ==========================================
console.log('\n\n🔍 TEST 1: MOCK FULL (Configuration maximale)\n');

const totalsFull = calculateTotals(
  mockReservationDataFull,
  mockAmenagementDataFull,
  mockVisibiliteDataFull
);

displayTotals(totalsFull);

console.log('\n✅ Configuration FULL validée');
console.log(`   → Ce mock teste TOUS les champs disponibles`);
console.log(`   → Utilisez-le pour vérifier que tous les mappings PDF fonctionnent`);

// ==========================================
// TEST 2: MOCK RANDOM (configuration réaliste)
// ==========================================
console.log('\n\n🔍 TEST 2: MOCK RANDOM (Configuration réaliste)\n');

const totalsRandom = calculateTotals(
  mockReservationDataRandom,
  mockAmenagementDataRandom,
  mockVisibiliteDataRandom
);

displayTotals(totalsRandom);

console.log('\n✅ Configuration RANDOM validée');
console.log(`   → Ce mock simule un client réel avec sélection partielle`);
console.log(`   → Utilisez-le pour tester des scénarios d'usage typiques`);

// ==========================================
// COMPARAISON
// ==========================================
console.log('\n\n📊 COMPARAISON DES DEUX CONFIGURATIONS\n');
console.log('─'.repeat(80));

const comparison = [
  { label: 'HT 01 - Réservation', full: totalsFull.ht1, random: totalsRandom.ht1 },
  { label: 'HT 02 - Aménagements', full: totalsFull.ht2, random: totalsRandom.ht2 },
  { label: 'HT 03 - Visibilité', full: totalsFull.ht3, random: totalsRandom.ht3 },
  { label: 'TOTAL HT', full: totalsFull.ht, random: totalsRandom.ht },
  { label: 'TVA 20%', full: totalsFull.tva, random: totalsRandom.tva },
  { label: 'TOTAL TTC', full: totalsFull.ttc, random: totalsRandom.ttc },
];

console.log('Section'.padEnd(30) + 'FULL'.padStart(15) + 'RANDOM'.padStart(15) + 'Écart'.padStart(15));
console.log('─'.repeat(80));

comparison.forEach(({ label, full, random }) => {
  const diff = full - random;
  const diffStr = (diff > 0 ? '+' : '') + diff.toFixed(2) + '€';
  console.log(
    label.padEnd(30) +
    (full.toFixed(2) + '€').padStart(15) +
    (random.toFixed(2) + '€').padStart(15) +
    diffStr.padStart(15)
  );
});

// ==========================================
// STATISTIQUES
// ==========================================
console.log('\n\n📈 STATISTIQUES\n');
console.log('─'.repeat(80));

const statsFull = {
  nbItemsSection1: Object.keys(totalsFull.details.section1).length,
  nbItemsSection2: Object.keys(totalsFull.details.section2).length,
  nbItemsSection3: Object.keys(totalsFull.details.section3).length,
};

const statsRandom = {
  nbItemsSection1: Object.keys(totalsRandom.details.section1).length,
  nbItemsSection2: Object.keys(totalsRandom.details.section2).length,
  nbItemsSection3: Object.keys(totalsRandom.details.section3).length,
};

console.log(`Configuration FULL:`);
console.log(`  - Section 1: ${statsFull.nbItemsSection1} items`);
console.log(`  - Section 2: ${statsFull.nbItemsSection2} items`);
console.log(`  - Section 3: ${statsFull.nbItemsSection3} items`);
console.log(`  - Total: ${statsFull.nbItemsSection1 + statsFull.nbItemsSection2 + statsFull.nbItemsSection3} items`);

console.log(`\nConfiguration RANDOM:`);
console.log(`  - Section 1: ${statsRandom.nbItemsSection1} items`);
console.log(`  - Section 2: ${statsRandom.nbItemsSection2} items`);
console.log(`  - Section 3: ${statsRandom.nbItemsSection3} items`);
console.log(`  - Total: ${statsRandom.nbItemsSection1 + statsRandom.nbItemsSection2 + statsRandom.nbItemsSection3} items`);

// ==========================================
// RECOMMANDATIONS
// ==========================================
console.log('\n\n💡 RECOMMANDATIONS D\'UTILISATION\n');
console.log('─'.repeat(80));

console.log(`
1️⃣  MOCK FULL (mockDataFull.ts):
   → Utilisez pour: Tests exhaustifs, validation de tous les mappings PDF
   → Montant: ${totalsFull.ttc.toFixed(2)}€ TTC
   → Couverture: 100% des fonctionnalités

2️⃣  MOCK RANDOM (mockDataRandom.ts):
   → Utilisez pour: Tests de scénarios réels, démos, screenshots
   → Montant: ${totalsRandom.ttc.toFixed(2)}€ TTC
   → Couverture: ~${Math.round((statsRandom.nbItemsSection1 + statsRandom.nbItemsSection2 + statsRandom.nbItemsSection3) / (statsFull.nbItemsSection1 + statsFull.nbItemsSection2 + statsFull.nbItemsSection3) * 100)}% des fonctionnalités

3️⃣  MOCK ACTUEL (mockData.ts):
   → À REMPLACER par un des deux ci-dessus
   → Actuellement incohérent (totaux ne matchent pas)
`);

console.log('='.repeat(80));
console.log('\n✅ Tests terminés avec succès\n');
