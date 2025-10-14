import {
  calculateTotalHT1,
  calculateTotalHT2,
  calculateTotalHT3,
  calculateTotalHT4,
  canProceedFromReservation,
  isCoExpositionAvailable,
  validateIdentityPage,
  getFieldTitle,
} from './utils';
import { calculateTotals } from './calculateTotals';

import { ReservationData, AmenagementData, VisibiliteData, FormData } from './types';

const baseReservation: ReservationData = {
  standType: null,
  standSize: '',
  standAngles: 0,
  electricityUpgrade: 'none',
  exteriorSpace: false,
  exteriorSurface: '',
  gardenCottage: false,
  microStand: false,
  coExposants: [],
};

const baseAmenagement: AmenagementData = {
  reservePorteMelamine: 0,
  moquetteDifferente: 0,
  moquetteCouleur: '',
  velumStand: 0,
  cloisonBoisGainee: 0,
  reservePorteBois: 0,
  bandeauSignaletique: 0,
  comptoir: 0,
  tabouret: 0,
  mangeDebout: 0,
  chaise: 0,
  table120x60: 0,
  mange3Tabourets: 0,
  ecran52: 0,
  refrigerateur140: 0,
  refrigerateur240: 0,
  presentoirA4: 0,
  blocPrises: 0,
  fauteuil: 0,
  tableBasse: 0,
  gueridonHaut: 0,
  poufCube: 0,
  poufCouleur: '',
  colonneVitrine: 0,
  comptoirVitrine: 0,
  porteManteux: 0,
  planteBambou: 0,
  planteKentia: 0,
  scanBadges: false,
  passSoiree: 0,
};

const baseVisibilite: VisibiliteData = {
  packSignaletiqueComplet: false,
  signaletiqueComptoir: false,
  signaletiqueHautCloisons: false,
  signalethqueCloisons: 0,
  signaletiqueEnseigneHaute: false,
  demiPageCatalogue: false,
  pageCompleeteCatalogue: false,
  deuxiemeCouverture: false,
  quatriemeCouverture: false,
  logoplanSalon: false,
  documentationSacVisiteur: false,
  distributionHotesse: false,
};

const fullFormData = (): FormData => ({
  raisonSociale: 'ACME',
  adresse: '1 rue Test',
  codePostal: '75001',
  ville: 'PARIS',
  pays: 'FRANCE',
  tel: '0102030405',
  siteInternet: '',
  siret: '12345678901234',
  tvaIntra: 'FR12345678901',
  membreAssociation: false,
  exposant2024: false,
  activites: {
    industrie: false,
    transportLogistique: false,
    btpConstructionLogement: false,
    environnementEnergie: false,
    servicesEntreprises: false,
    imageNouvellesTechnologies: false,
    tourismeBienEtre: false,
    autre: false,
  },
  autreActivite: '',
  facturationAdresse: '',
  facturationCP: '',
  facturationVille: '',
  facturationPays: '',
  contactComptaNom: 'Doe',
  contactComptaTel: '0601020304',
  contactComptaMail: 'compta@example.com',
  responsableNom: 'Doe',
  responsablePrenom: 'John',
  responsableTel: '0601020304',
  responsableMail: 'john@example.com',
  respOpNom: 'Smith',
  respOpPrenom: 'Jane',
  respOpTel: '0601020304',
  respOpMail: 'jane@example.com',
  enseigne: 'ACME',
});

describe('utils financial calculations', () => {
  it('calculates HT1 with stand, angles, electricity and co-exposant', () => {
    const reservation: ReservationData = {
      ...baseReservation,
      standType: 'equipped',
      standSize: '12',
      standAngles: 1,
      electricityUpgrade: '2kw',
      coExposants: [{ id: '1', nomEntreprise: 'Co', nomResponsable: '', prenomResponsable: '', telResponsable: '', mailResponsable: '' }],
    };

    expect(calculateTotalHT1(reservation)).toBe(4045);
  });

  it('falls back to zero when missing stand info', () => {
    expect(calculateTotalHT1(baseReservation)).toBe(0);
  });

  it('computes HT2 including furniture only', () => {
    const amenagement: AmenagementData = {
      ...baseAmenagement,
      comptoir: 2,
      tabouret: 1,
      scanBadges: true,
      passSoiree: 3,
    };

    // Les produits complémentaires ne doivent plus impacter HT2 : (2*165 + 1*40) = 370
    expect(calculateTotalHT2(amenagement)).toBe(370);
  });

  it('computes HT3 with complementary products', () => {
    const amenagement: AmenagementData = {
      ...baseAmenagement,
      scanBadges: true,
      passSoiree: 2,
    };

    expect(calculateTotalHT3(amenagement)).toBe(250);
  });

  it('computes HT4 based on stand size dependent visibility options', () => {
    const visibilite: VisibiliteData = {
      ...baseVisibilite,
      packSignaletiqueComplet: true,
      signaletiqueComptoir: true,
      signalethqueCloisons: 2,
    };

    const reservation: ReservationData = {
      ...baseReservation,
      standType: 'equipped',
      standSize: '10',
    };

    const total = calculateTotalHT4(visibilite, reservation);
    // 125 + 180 + 2*185 = 675
    expect(total).toBe(675);
  });

  it('aligns calculateTotals with individual section helpers', () => {
    const reservation: ReservationData = {
      ...baseReservation,
      standType: 'equipped',
      standSize: '12',
      standAngles: 1,
      electricityUpgrade: '4kw',
      exteriorSpace: true,
      exteriorSurface: '20',
      gardenCottage: true,
      microStand: true,
      coExposants: [
        { id: '1', nomEntreprise: 'Co1', nomResponsable: '', prenomResponsable: '', telResponsable: '', mailResponsable: '' },
        { id: '2', nomEntreprise: 'Co2', nomResponsable: '', prenomResponsable: '', telResponsable: '', mailResponsable: '' },
      ],
    };

    const amenagement: AmenagementData = {
      ...baseAmenagement,
      reservePorteMelamine: 1,
      moquetteDifferente: 10,
      velumStand: 5,
      comptoir: 2,
      tabouret: 3,
      scanBadges: true,
      passSoiree: 4,
    };

    const visibilite: VisibiliteData = {
      ...baseVisibilite,
      packSignaletiqueComplet: true,
      signaletiqueComptoir: true,
      signalethqueCloisons: 1,
      logoplanSalon: true,
    };

    const totals = calculateTotals(reservation, amenagement, visibilite);

    expect(totals.ht1).toBeCloseTo(calculateTotalHT1(reservation));
    expect(totals.ht2).toBeCloseTo(calculateTotalHT2(amenagement));
    expect(totals.ht3).toBeCloseTo(calculateTotalHT3(amenagement));
    expect(totals.ht4).toBeCloseTo(calculateTotalHT4(visibilite, reservation));
  });

  it('populates section 1 details with contract-specific reservation lines', () => {
    const reservation: ReservationData = {
      ...baseReservation,
      standType: 'ready',
      standSize: '18',
      standAngles: 2,
      electricityUpgrade: '6kw',
      exteriorSpace: true,
      exteriorSurface: '20',
      gardenCottage: true,
      microStand: true,
      coExposants: [
        { id: 'co-1', nomEntreprise: 'Partner', nomResponsable: '', prenomResponsable: '', telResponsable: '', mailResponsable: '' },
      ],
    };

    const totals = calculateTotals(reservation, baseAmenagement, baseVisibilite);

    expect(totals.ht1).toBe(9448);
    expect(totals.details.section1).toMatchObject({
      'Pack "Prêt à exposer" 18m²': 5328,
      'Angles ouverts': 370,
      'Coffret électrique 6KW': 350,
      'Espace extérieur 20m²': 1000,
      'Garden cottage (3m x 3m)': 800,
      'Micro-stand équipé 4m²': 1200,
      'Co-exposants (1)': 400,
    });

    expect(totals.details.section2).toEqual({});
    expect(totals.details.section3).toEqual({});
    expect(totals.details.section4).toEqual({});
  });

  it('places complementary products in section 3 breakdown', () => {
    const amenagement: AmenagementData = {
      ...baseAmenagement,
      scanBadges: true,
      passSoiree: 2,
    };

    const totals = calculateTotals(baseReservation, amenagement, baseVisibilite);

    expect(totals.ht2).toBe(0);
    expect(totals.details.section2).toEqual({});
    expect(totals.ht3).toBe(250);
    expect(totals.details.section3).toMatchObject({
      'Scan badges visiteurs': 150,
      'Pass soirée complémentaires': 100,
    });
  });
});

describe('utils validation helpers', () => {
  it('prevents proceeding when garden cottage missing for exterior only', () => {
    const reservation: ReservationData = {
      ...baseReservation,
      exteriorSpace: true,
      gardenCottage: false,
      standType: null,
    };

    expect(canProceedFromReservation(reservation)).toBe(false);
  });

  it('detects co-exposition availability threshold', () => {
    expect(
      isCoExpositionAvailable({ ...baseReservation, standType: 'equipped', standSize: '12' })
    ).toBe(true);
    expect(
      isCoExpositionAvailable({ ...baseReservation, standType: 'equipped', standSize: '9' })
    ).toBe(false);
  });

  it('returns missing fields for identity page', () => {
    const data = fullFormData();
    data.raisonSociale = '';
    data.tel = '';

    const errors = validateIdentityPage(data);
    expect(errors).toContain('raisonSociale');
    expect(errors).toContain('tel');
  });

  it('maps field names to human friendly titles with fallback', () => {
    expect(getFieldTitle('raisonSociale')).toBe('Raison sociale');
    expect(getFieldTitle('unknown_field')).toBe('unknown_field');
  });
});
