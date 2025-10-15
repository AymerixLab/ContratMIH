import request from 'supertest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createApp } from './app.js';
import { MAX_TOTAL_VALUE } from './validation.js';

const createValidPayload = () => ({
  formData: {
    raisonSociale: 'ACME',
    adresse: '1 rue Test',
    codePostal: '75001',
    ville: 'PARIS',
    pays: 'FRANCE',
    tel: '0102030405',
    siteInternet: '   ',
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
    standAngles: 2,
    electricityUpgrade: '4kw',
    exteriorSpace: false,
    exteriorSurface: '',
    gardenCottage: false,
    microStand: false,
    coExposants: [
      {
        id: 'co-1',
        nomEntreprise: 'Co Legit',
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

describe('createApp server', () => {
  let submissionCreate: ReturnType<typeof vi.fn>;
  let coExposantCreate: ReturnType<typeof vi.fn>;
  let prismaMock: any;

  beforeEach(() => {
    submissionCreate = vi.fn(async ({ data }) => ({ id: 'sub-1', ...data }));
    coExposantCreate = vi.fn(async ({ data }) => data);
    prismaMock = {
      $transaction: vi.fn(async (callback) => callback({
        submission: { create: submissionCreate },
        coExposant: { create: coExposantCreate },
      })),
    };
  });

  it('exposes health endpoint', async () => {
    const app = createApp(prismaMock, { serveStatic: false });
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('persists submissions and normalises data', async () => {
    const app = createApp(prismaMock, { serveStatic: false });
    const payload = createValidPayload();

    const response = await request(app)
      .post('/api/submissions')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 'sub-1' });
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(submissionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          siteInternet: null,
          standAngles: 2,
          electricityUpgrade: '4kw',
          accepteCommunication: true,
          dateSignature: expect.any(Date),
          totalHtSection4: 1680,
          totalHt: 6205,
          totalTva: 1241,
          totalTtc: 7446,
        }),
      })
    );
    expect(coExposantCreate).toHaveBeenCalledTimes(1);
    expect(coExposantCreate.mock.calls[0][0].data.nomEntreprise).toBe('Co Legit');
  });

  it('rejects invalid submissions with 400', async () => {
    const app = createApp(prismaMock, { serveStatic: false });
    const payload = createValidPayload();
    payload.formData.raisonSociale = '';

    const response = await request(app)
      .post('/api/submissions')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it('rejects submissions when totals exceed supported range', async () => {
    const app = createApp(prismaMock, { serveStatic: false });
    const payload = createValidPayload();
    payload.totals.totalHT = MAX_TOTAL_VALUE + 1;

    const response = await request(app)
      .post('/api/submissions')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.details?.totals?.totalHT?._errors?.[0]).toContain('plafond autorisé');
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });
});
