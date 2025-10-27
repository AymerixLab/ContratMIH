import express from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SubmissionSchema, getSubmissionEnv } from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildDir = path.join(__dirname, '..', 'build');

export const toNullableText = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

export const toInteger = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
};

export const toIntegerOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
};

export const toBoolean = (value) => Boolean(value);

export const toMoney = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * 100) / 100;
};

export const toDate = (value) => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function createApp(prismaClient, options = {}) {
  if (!prismaClient) {
    throw new Error('Prisma client instance is required to create the app');
  }

  const {
    corsOrigin = process.env.CORS_ORIGIN,
    serveStatic = true,
    disableSubmission = false,
    uploadsRoot,
  } = options;

  const uploadsDir = uploadsRoot
    ? path.resolve(uploadsRoot)
    : path.join(__dirname, '..', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
      const submissionId = req.params?.submissionId;
      const submissionDir = submissionId
        ? path.join(uploadsDir, submissionId)
        : uploadsDir;
      try {
        fs.mkdirSync(submissionDir, { recursive: true });
      } catch (error) {
        return cb(error);
      }
      cb(null, submissionDir);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const sanitized = file.originalname.replace(/[^\w.\-]+/g, '_');
      cb(null, `${timestamp}-${sanitized}`);
    },
  });

  const upload = multer({ storage });

  const app = express();
  app.use(express.json({ limit: '2mb' }));

  if (corsOrigin || process.env.NODE_ENV !== 'production') {
    app.use(cors({
      origin: corsOrigin || true,
    }));
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/submissions', async (req, res) => {
    try {
      const { bypassValidation, disableSubmission: envDisableSubmission } = getSubmissionEnv(process.env.NODE_ENV, process.env);
      if (envDisableSubmission) {
        return res.status(503).json({ error: 'Soumission désactivée en environnement de développement' });
      }

      const validationResult = SubmissionSchema.safeParse(req.body);

      if (!validationResult.success && !bypassValidation) {
        console.error('Validation failed:', validationResult.error.format());
        return res.status(400).json({
          error: 'Données invalides',
          details: validationResult.error.format(),
        });
      }

      const validationData = validationResult.success ? validationResult.data : req.body;

      const {
        formData,
        reservationData,
        amenagementData,
        visibiliteData,
        engagementData,
        totals,
        submittedAt,
      } = validationData;

      const normalizedDistributionDays = Math.max(
        0,
        Math.min(
          2,
          Number(
            visibiliteData.distributionHotesseDays ?? (visibiliteData.distributionHotesse ? 2 : 0)
          ) || 0
        )
      );
      const normalizedDistributionDay =
        normalizedDistributionDays === 1 &&
        (visibiliteData.distributionHotesseSelectedDay === 1 || visibiliteData.distributionHotesseSelectedDay === 2)
          ? visibiliteData.distributionHotesseSelectedDay
          : null;

      const result = await prismaClient.$transaction(async (tx) => {
        const submission = await tx.submission.create({
          data: {
            rawPayload: req.body,
            rawTotals: totals,
            clientSubmittedAt: submittedAt ? new Date(submittedAt) : null,
            raisonSociale: formData.raisonSociale,
            adresse: formData.adresse,
            codePostal: formData.codePostal,
            ville: formData.ville,
            pays: formData.pays,
            tel: formData.tel,
            siteInternet: toNullableText(formData.siteInternet),
            siret: toNullableText(formData.siret),
            tvaIntra: toNullableText(formData.tvaIntra),
            membreAssociation: toBoolean(formData.membreAssociation),
            exposant2024: toBoolean(formData.exposant2024),
            activiteIndustrie: toBoolean(formData.activites.industrie),
            activiteTransportLogistique: toBoolean(formData.activites.transportLogistique),
            activiteBtpConstructionLogement: toBoolean(formData.activites.btpConstructionLogement),
            activiteEnvironnementEnergie: toBoolean(formData.activites.environnementEnergie),
            activiteServicesEntreprises: toBoolean(formData.activites.servicesEntreprises),
            activiteImageNouvellesTechnologies: toBoolean(formData.activites.imageNouvellesTechnologies),
            activiteTourismeBienEtre: toBoolean(formData.activites.tourismeBienEtre),
            activiteAutre: toBoolean(formData.activites.autre),
            autreActivite: toNullableText(formData.autreActivite),
            facturationAdresse: toNullableText(formData.facturationAdresse),
            facturationCp: toNullableText(formData.facturationCP),
            facturationVille: toNullableText(formData.facturationVille),
            facturationPays: toNullableText(formData.facturationPays),
            contactComptaNom: toNullableText(formData.contactComptaNom),
            contactComptaTel: toNullableText(formData.contactComptaTel),
            contactComptaMail: toNullableText(formData.contactComptaMail),
            responsableNom: toNullableText(formData.responsableNom),
            responsablePrenom: toNullableText(formData.responsablePrenom),
            responsableTel: toNullableText(formData.responsableTel),
            responsableMail: toNullableText(formData.responsableMail),
            respOpNom: toNullableText(formData.respOpNom),
            respOpPrenom: toNullableText(formData.respOpPrenom),
            respOpTel: toNullableText(formData.respOpTel),
            respOpMail: toNullableText(formData.respOpMail),
            enseigne: toNullableText(formData.enseigne),
            standType: toNullableText(reservationData.standType),
            standSize: toNullableText(reservationData.standSize),
            standAngles: toInteger(reservationData.standAngles),
            electricityUpgrade: toNullableText(reservationData.electricityUpgrade),
            exteriorSpace: toBoolean(reservationData.exteriorSpace),
            exteriorSurface: toNullableText(reservationData.exteriorSurface),
            gardenCottage: toBoolean(reservationData.gardenCottage),
            microStand: toBoolean(reservationData.microStand),
            reservePorteMelamine: toIntegerOrZero(amenagementData.reservePorteMelamine),
            moquetteDifferente: toIntegerOrZero(amenagementData.moquetteDifferente),
            moquetteCouleur: toNullableText(amenagementData.moquetteCouleur),
            velumStand: toIntegerOrZero(amenagementData.velumStand),
            cloisonBoisGainee: toIntegerOrZero(amenagementData.cloisonBoisGainee),
            reservePorteBois: toIntegerOrZero(amenagementData.reservePorteBois),
            bandeauSignaletique: toIntegerOrZero(amenagementData.bandeauSignaletique),
            railSpots: toIntegerOrZero(amenagementData.railSpots),
            comptoir: toIntegerOrZero(amenagementData.comptoir),
            tabouret: toIntegerOrZero(amenagementData.tabouret),
            mangeDebout: toIntegerOrZero(amenagementData.mangeDebout),
            chaise: toIntegerOrZero(amenagementData.chaise),
            table120x60: toIntegerOrZero(amenagementData.table120x60),
            mange3Tabourets: toIntegerOrZero(amenagementData.mange3Tabourets),
            ecran52: toIntegerOrZero(amenagementData.ecran52),
            refrigerateur140: toIntegerOrZero(amenagementData.refrigerateur140),
            refrigerateur240: toIntegerOrZero(amenagementData.refrigerateur240),
            presentoirA4: toIntegerOrZero(amenagementData.presentoirA4),
            blocPrises: toIntegerOrZero(amenagementData.blocPrises),
            fauteuil: toIntegerOrZero(amenagementData.fauteuil),
            tableBasse: toIntegerOrZero(amenagementData.tableBasse),
            gueridonHaut: toIntegerOrZero(amenagementData.gueridonHaut),
            poufCube: toIntegerOrZero(amenagementData.poufCube),
            poufCouleur: toNullableText(amenagementData.poufCouleur),
            colonneVitrine: toIntegerOrZero(amenagementData.colonneVitrine),
            comptoirVitrine: toIntegerOrZero(amenagementData.comptoirVitrine),
            porteManteaux: toIntegerOrZero(amenagementData.porteManteux),
            planteBambou: toIntegerOrZero(amenagementData.planteBambou),
            planteKentia: toIntegerOrZero(amenagementData.planteKentia),
            scanBadges: toBoolean(amenagementData.scanBadges),
            passSoiree: toIntegerOrZero(amenagementData.passSoiree),
            packSignaletiqueComplet: toBoolean(visibiliteData.packSignaletiqueComplet),
            signaletiqueComptoir: toBoolean(visibiliteData.signaletiqueComptoir),
            signaletiqueHautCloisons: toBoolean(visibiliteData.signaletiqueHautCloisons),
            signaletiqueCloisonsLineaires: toIntegerOrZero(visibiliteData.signalethqueCloisons),
            signaletiqueEnseigneHaute: toBoolean(visibiliteData.signaletiqueEnseigneHaute),
            demiPageCatalogue: toBoolean(visibiliteData.demiPageCatalogue),
            pageCompleteCatalogue: toBoolean(visibiliteData.pageCompleeteCatalogue),
            deuxiemeCouverture: toBoolean(visibiliteData.deuxiemeCouverture),
            quatriemeCouverture: toBoolean(visibiliteData.quatriemeCouverture),
            logoPlanSalon: toBoolean(visibiliteData.logoplanSalon),
            documentationSacVisiteur: toBoolean(visibiliteData.documentationSacVisiteur),
            distributionHotesse: toBoolean(normalizedDistributionDays > 0),
            distributionHotesseDays: toIntegerOrZero(normalizedDistributionDays),
            distributionHotesseDay: normalizedDistributionDay,
            modeReglement: engagementData.modeReglement,
            accepteReglement: toBoolean(engagementData.accepteReglement),
            accepteCommunication: toBoolean(engagementData.accepteCommunication),
            dateSignature: toDate(engagementData.dateSignature),
            cachetSignature: toNullableText(engagementData.cachetSignature),
            totalHtSection1: toMoney(totals.totalHT1),
            totalHtSection2: toMoney(totals.totalHT2),
            totalHtSection3: toMoney(totals.totalHT3),
            totalHtSection4: toMoney(totals.totalHT4),
            totalHt: toMoney(totals.totalHT),
            totalTva: toMoney(totals.tva),
            totalTtc: toMoney(totals.totalTTC),
          },
        });

        if (Array.isArray(reservationData.coExposants)) {
          for (const coExposant of reservationData.coExposants) {
            if (!coExposant?.nomEntreprise) continue;

            await tx.coExposant.create({
              data: {
                submissionId: submission.id,
                nomEntreprise: coExposant.nomEntreprise,
                nomResponsable: toNullableText(coExposant.nomResponsable),
                prenomResponsable: toNullableText(coExposant.prenomResponsable),
                telResponsable: toNullableText(coExposant.telResponsable),
                mailResponsable: toNullableText(coExposant.mailResponsable),
              },
            });
          }
        }

        return submission;
      });

      return res.status(201).json({ id: result.id });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du formulaire:', error);
      return res.status(500).json({ error: 'Erreur interne' });
    }
  });

  app.post(
    '/api/submissions/:submissionId/documents',
    upload.single('file'),
    async (req, res) => {
      const { submissionId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' });
      }

      const relativePath = path.relative(uploadsDir, file.path);

      if (disableSubmission) {
        const devId = `dev-document-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        if (typeof console !== 'undefined' && typeof console.info === 'function') {
          console.info('[mih] Documents en mode développement, fichier conservé sur disque.', {
            submissionId,
            filepath: relativePath,
          });
        }

        return res.status(201).json({
          id: devId,
          filepath: relativePath,
        });
      }

      try {
        const submission = await prismaClient.submission.findUnique({
          where: { id: submissionId },
        });

        if (!submission) {
          await fs.promises.unlink(file.path).catch(() => undefined);
          return res.status(404).json({ error: 'Soumission introuvable' });
        }

        const document = await prismaClient.document.create({
          data: {
            submissionId,
            filename: file.originalname,
            filepath: relativePath,
            mimetype: file.mimetype,
            size: file.size,
          },
        });

        return res.status(201).json({ id: document.id, filepath: relativePath });
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du document:', error);
        await fs.promises.unlink(file.path).catch(() => undefined);
        return res.status(500).json({ error: 'Erreur interne' });
      }
    }
  );

  app.get(
    '/api/submissions/:submissionId/documents/:documentId',
    async (req, res) => {
      const { submissionId, documentId } = req.params;

      try {
        const document = await prismaClient.document.findFirst({
          where: { id: documentId, submissionId },
        });

        if (!document) {
          return res.status(404).json({ error: 'Document introuvable' });
        }

        const absolutePath = path.join(uploadsDir, document.filepath);
        const normalizedPath = path.normalize(absolutePath);

        if (!normalizedPath.startsWith(uploadsDir)) {
          return res.status(400).json({ error: 'Chemin de fichier invalide' });
        }

        return res.download(normalizedPath, document.filename, (err) => {
          if (err) {
            console.error('Erreur lors du téléchargement du document:', err);
            if (!res.headersSent) {
              res.status(500).json({ error: 'Erreur interne' });
            }
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération du document:', error);
        return res.status(500).json({ error: 'Erreur interne' });
      }
    }
  );

  if (serveStatic) {
    app.use(express.static(buildDir));

    app.use((req, res) => {
      res.sendFile(path.join(buildDir, 'index.html'));
    });
  }

  return app;
}
