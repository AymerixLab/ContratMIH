import { describe, expect, it, vi } from 'vitest';
import { submitFormData, uploadSubmissionDocument, type SubmissionPayload } from './api';

const createFormDataStub = () => ({
  append: vi.fn(),
});

const createPayload = (): SubmissionPayload => ({
  formData: {
    raisonSociale: 'ACME',
    adresse: '1 rue Test',
    codePostal: '75001',
    ville: 'PARIS',
    pays: 'FRANCE',
    tel: '0102030405',
    siteInternet: '',
    siret: '',
    tvaIntra: '',
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
    contactComptaNom: '',
    contactComptaTel: '',
    contactComptaMail: '',
    responsableNom: '',
    responsablePrenom: '',
    responsableTel: '',
    responsableMail: '',
    respOpNom: '',
    respOpPrenom: '',
    respOpTel: '',
    respOpMail: '',
    enseigne: '',
  },
  reservationData: {
    standType: 'equipped',
    standSize: '12',
    standAngles: 0,
    electricityUpgrade: 'none',
    exteriorSpace: false,
    exteriorSurface: '',
    gardenCottage: false,
    microStand: false,
    coExposants: [],
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
    totalHT1: 0,
    totalHT2: 0,
    totalHT3: 0,
    totalHT4: 0,
    totalHT: 0,
    tva: 0,
    totalTTC: 0,
  },
  submittedAt: new Date().toISOString(),
});

describe('submitFormData', () => {
  it('sends payload to submissions endpoint', async () => {
    const payload = createPayload();
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'submission-123' }),
    } as Response);

    const result = await submitFormData(payload);

    expect(fetchSpy).toHaveBeenCalledWith(
      `${window.location.origin}/api/submissions`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    );

    expect(result).toEqual({ id: 'submission-123' });
  });

  it('throws when API responds with error message', async () => {
    const payload = createPayload();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Données invalides' }),
    } as Response);

    await expect(submitFormData(payload)).rejects.toThrow('Données invalides');
  });

  it('throws when API returns malformed payload', async () => {
    const payload = createPayload();
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await expect(submitFormData(payload)).rejects.toThrow('Réponse du serveur invalide');
  });
});

describe('uploadSubmissionDocument', () => {
  it('uploads file with multipart payload', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'doc-123' }),
    } as Response);

    const blob = new Blob(['test'], { type: 'application/zip' });
    const formDataInstance = createFormDataStub();
    const formDataFactory = vi.fn(() => formDataInstance as unknown as FormData);

    const result = await uploadSubmissionDocument('submission-123', blob, 'test.zip', {
      formDataFactory,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      `${window.location.origin}/api/submissions/submission-123/documents`,
      expect.objectContaining({
        method: 'POST',
        body: formDataInstance,
      })
    );

    expect(formDataFactory).toHaveBeenCalledTimes(1);
    expect(formDataInstance.append).toHaveBeenCalledWith('file', expect.any(Blob), 'test.zip');
    expect(result).toEqual({ id: 'doc-123' });
  });

  it('throws when upload fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Erreur interne' }),
    } as Response);

    const blob = new Blob(['test'], { type: 'application/zip' });
    const formDataFactory = () => createFormDataStub() as unknown as FormData;

    await expect(
      uploadSubmissionDocument('submission-123', blob, 'test.zip', { formDataFactory })
    ).rejects.toThrow('Erreur interne');
  });
});
