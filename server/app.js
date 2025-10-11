import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { SubmissionSchema } from './validation.js';

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

export function createApp(prismaClient, options = {}) {
  if (!prismaClient) {
    throw new Error('Prisma client instance is required to create the app');
  }

  const {
    corsOrigin = process.env.CORS_ORIGIN,
    serveStatic = true,
  } = options;

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
      const validationResult = SubmissionSchema.safeParse(req.body);

      if (!validationResult.success) {
        console.error('Validation failed:', validationResult.error.format());
        return res.status(400).json({
          error: 'Données invalides',
          details: validationResult.error.format(),
        });
      }

      const {
        formData,
        reservationData,
        amenagementData,
        visibiliteData,
        engagementData,
        totals,
        submittedAt,
      } = validationResult.data;

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
            distributionHotesse: toBoolean(visibiliteData.distributionHotesse),
            modeReglement: engagementData.modeReglement,
            accepteReglement: toBoolean(engagementData.accepteReglement),
            dateSignature: toNullableText(engagementData.dateSignature),
            cachetSignature: toNullableText(engagementData.cachetSignature),
            totalHtSection1: toMoney(totals.totalHT1),
            totalHtSection2: toMoney(totals.totalHT2),
            totalHtSection3: toMoney(totals.totalHT3),
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

  if (serveStatic) {
    app.use(express.static(buildDir));

    app.use((req, res) => {
      res.sendFile(path.join(buildDir, 'index.html'));
    });
  }

  return app;
}
