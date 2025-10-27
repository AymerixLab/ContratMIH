import { describe, expect, it } from 'vitest';
import { MAX_TOTAL_VALUE, SubmissionSchema, getSubmissionEnv } from './validation.js';

const createValidPayload = () => ({
  formData: {
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
      industrie: true,
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
    contactComptaNom: '',
    contactComptaTel: '',
    contactComptaMail: '',
    responsableNom: '',
    responsablePrenom: '',
    responsableTel: '',
    responsableMail: 'john@example.com',
    respOpNom: '',
    respOpPrenom: '',
    respOpTel: '',
    respOpMail: 'ops@example.com',
    enseigne: 'ACME',
  },
  reservationData: {
    standType: 'equipped',
    standSize: '12',
    standAngles: 1,
    electricityUpgrade: 'none',
    exteriorSpace: false,
    exteriorSurface: '',
    gardenCottage: false,
    microStand: false,
    coExposants: [
      {
        id: 'co-1',
        nomEntreprise: 'Co',
        nomResponsable: '',
        prenomResponsable: '',
        telResponsable: '',
        mailResponsable: '',
      },
    ],
  },
  amenagementData: {
    reservePorteMelamine: 0,
    moquetteDifferente: 0,
    moquetteCouleur: '',
    velumStand: 0,
    cloisonBoisGainee: 0,
    reservePorteBois: 0,
    bandeauSignaletique: 0,
    railSpots: 0,
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
  },
  visibiliteData: {
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
    distributionHotesseDays: 0,
    distributionHotesseSelectedDay: null,
  },
  engagementData: {
    modeReglement: 'acompte',
    accepteReglement: true,
    accepteCommunication: true,
    dateSignature: new Date().toISOString(),
    cachetSignature: '',
  },
  totals: {
    totalHT1: 4045,
    totalHT2: 330,
    totalHT3: 150,
    totalHT4: 1680,
    totalHT: 6205,
    tva: 1241,
    totalTTC: 7446,
  },
  submittedAt: new Date().toISOString(),
});

describe('SubmissionSchema', () => {
  it('accepts a valid payload', () => {
    expect(() => SubmissionSchema.parse(createValidPayload())).not.toThrow();
  });

  it('rejects payloads without regulation acceptance', () => {
    const payload = createValidPayload();
    payload.engagementData.accepteReglement = false;

    const result = SubmissionSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('accepter le règlement');
    }
  });

  it('rejects totals that exceed database precision limits', () => {
    const payload = createValidPayload();
    payload.totals.totalHT = MAX_TOTAL_VALUE + 1;

    const result = SubmissionSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = result.error.format();
      expect(formatted.totals?.totalHT?._errors?.[0]).toContain('plafond autorisé');
    }
  });

  it('converts ISO date strings into Date instances for signature field', () => {
    const payload = createValidPayload();
    const result = SubmissionSchema.parse(payload);
    expect(result.engagementData.dateSignature).toBeInstanceOf(Date);
  });

  it('rejects invalid date signatures', () => {
    const payload = createValidPayload();
    payload.engagementData.dateSignature = 'not-a-date';

    const result = SubmissionSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = result.error.format();
      expect(formatted.engagementData?.dateSignature?._errors?.[0]).toBeDefined();
    }
  });

  it('requires a selected day when a single distribution day is chosen', () => {
    const payload = createValidPayload();
    payload.visibiliteData.distributionHotesse = true;
    payload.visibiliteData.distributionHotesseDays = 1;
    payload.visibiliteData.distributionHotesseSelectedDay = null;

    const result = SubmissionSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = result.error.format();
      expect(formatted.visibiliteData?.distributionHotesseSelectedDay?._errors?.[0]).toContain('Jour');
    }
  });
});

describe('getSubmissionEnv', () => {
  it('parses bypass and disable flags in non-production', () => {
    const result = getSubmissionEnv('development', {
      VITE_BYPASS_VALIDATION: 'true',
      VITE_DISABLE_SUBMISSION: 'false',
    });

    expect(result).toEqual({ bypassValidation: true, disableSubmission: false });
  });

  it('ignores flags in production environments', () => {
    const result = getSubmissionEnv('production', {
      VITE_BYPASS_VALIDATION: 'true',
      VITE_DISABLE_SUBMISSION: 'true',
    });

    expect(result).toEqual({ bypassValidation: false, disableSubmission: false });
  });

  it('accepts numeric truthy values for disabling submission', () => {
    const result = getSubmissionEnv('development', {
      VITE_DISABLE_SUBMISSION: '1',
    });

    expect(result.disableSubmission).toBe(true);
  });
});
