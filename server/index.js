import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { SubmissionSchema } from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const toNullableText = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

const toInteger = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
};

const toIntegerOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
};

const toBoolean = (value) => Boolean(value);

const toMoney = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(parsed * 100) / 100;
};

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: '2mb' }));

const corsOrigin = process.env.CORS_ORIGIN;
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
    // VALIDATION ZOD - Protection contre données malformées
    const validationResult = SubmissionSchema.safeParse(req.body);

    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error.format());
      return res.status(400).json({
        error: 'Données invalides',
        details: validationResult.error.format()
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

    // Utiliser une transaction Prisma (sécurisée et type-safe)
    const result = await prisma.$transaction(async (tx) => {
      // Créer la soumission avec backup JSON complet
      const submission = await tx.submission.create({
        data: {
          // BACKUP COMPLET - Aucune perte de données possible
          rawPayload: req.body,
          rawTotals: totals,

          clientSubmittedAt: submittedAt ? new Date(submittedAt) : null,

          // IDENTITÉ ENTREPRISE
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

          // ACTIVITÉS
          activiteIndustrie: toBoolean(formData.activites.industrie),
          activiteTransportLogistique: toBoolean(formData.activites.transportLogistique),
          activiteBtpConstructionLogement: toBoolean(formData.activites.btpConstructionLogement),
          activiteEnvironnementEnergie: toBoolean(formData.activites.environnementEnergie),
          activiteServicesEntreprises: toBoolean(formData.activites.servicesEntreprises),
          activiteImageNouvellesTechnologies: toBoolean(formData.activites.imageNouvellesTechnologies),
          activiteTourismeBienEtre: toBoolean(formData.activites.tourismeBienEtre),
          activiteAutre: toBoolean(formData.activites.autre),
          autreActivite: toNullableText(formData.autreActivite),

          // FACTURATION
          facturationAdresse: toNullableText(formData.facturationAdresse),
          facturationCp: toNullableText(formData.facturationCP),
          facturationVille: toNullableText(formData.facturationVille),
          facturationPays: toNullableText(formData.facturationPays),

          // CONTACTS
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

          // RÉSERVATION STAND
          standType: toNullableText(reservationData.standType),
          standSize: toNullableText(reservationData.standSize),
          standAngles: toInteger(reservationData.standAngles),
          electricityUpgrade: toNullableText(reservationData.electricityUpgrade),
          exteriorSpace: toBoolean(reservationData.exteriorSpace),
          exteriorSurface: toNullableText(reservationData.exteriorSurface),
          gardenCottage: toBoolean(reservationData.gardenCottage),
          microStand: toBoolean(reservationData.microStand),

          // AMÉNAGEMENT - ÉQUIPEMENTS STANDS
          reservePorteMelamine: toIntegerOrZero(amenagementData.reservePorteMelamine),
          moquetteDifferente: toIntegerOrZero(amenagementData.moquetteDifferente),
          moquetteCouleur: toNullableText(amenagementData.moquetteCouleur),
          velumStand: toIntegerOrZero(amenagementData.velumStand),
          cloisonBoisGainee: toIntegerOrZero(amenagementData.cloisonBoisGainee),
          reservePorteBois: toIntegerOrZero(amenagementData.reservePorteBois),
          bandeauSignaletique: toIntegerOrZero(amenagementData.bandeauSignaletique),

          // AMÉNAGEMENT - MOBILIER
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
          // FIX: Correction du bug porteManteux -> porte_manteaux
          porteManteaux: toIntegerOrZero(amenagementData.porteManteux),
          planteBambou: toIntegerOrZero(amenagementData.planteBambou),
          planteKentia: toIntegerOrZero(amenagementData.planteKentia),

          // AMÉNAGEMENT - PRODUITS COMPLÉMENTAIRES
          scanBadges: toBoolean(amenagementData.scanBadges),
          passSoiree: toIntegerOrZero(amenagementData.passSoiree),

          // VISIBILITÉ
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

          // ENGAGEMENT
          modeReglement: engagementData.modeReglement,
          accepteReglement: toBoolean(engagementData.accepteReglement),
          dateSignature: toNullableText(engagementData.dateSignature),
          cachetSignature: toNullableText(engagementData.cachetSignature),

          // TOTAUX
          totalHtSection1: toMoney(totals.totalHT1),
          totalHtSection2: toMoney(totals.totalHT2),
          totalHtSection3: toMoney(totals.totalHT3),
          totalHt: toMoney(totals.totalHT),
          totalTva: toMoney(totals.tva),
          totalTtc: toMoney(totals.totalTTC),
        },
      });

      // Créer les co-exposants
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

const buildDir = path.join(__dirname, '..', 'build');
app.use(express.static(buildDir));

app.use((req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

// Check database connection before starting server
prisma.$queryRaw`SELECT NOW()`
  .then(() => {
    console.log('Database connection established');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
