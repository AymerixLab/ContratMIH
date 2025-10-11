import { describe, expect, it } from 'vitest';
import { SubmissionSchema } from './validation.js';

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
  },
  engagementData: {
    modeReglement: 'acompte',
    accepteReglement: true,
    dateSignature: '',
    cachetSignature: '',
  },
  totals: {
    totalHT1: 4045,
    totalHT2: 480,
    totalHT3: 1680,
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
});
