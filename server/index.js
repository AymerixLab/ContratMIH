const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./db');

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

const buildInsertQuery = (table, fields, options = {}) => {
  const columns = Object.keys(fields);
  if (columns.length === 0) {
    throw new Error(`No fields provided for insert into ${table}`);
  }

  const placeholders = columns.map((_, idx) => `$${idx + 1}`);
  const textLines = [
    `INSERT INTO ${table} (`,
    `  ${columns.join(',\n  ')}`,
    ') VALUES (',
    `  ${placeholders.join(', ')}`,
    ')',
  ];

  if (options.returning) {
    textLines.push(`RETURNING ${options.returning}`);
  }

  return {
    text: textLines.join('\n'),
    values: Object.values(fields),
  };
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
  const {
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData,
    totals,
    submittedAt,
  } = req.body || {};

  if (!formData || !reservationData || !amenagementData || !visibiliteData || !engagementData || !totals) {
    return res.status(400).json({ error: 'Payload incomplet' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const submissionRow = {
      client_submitted_at: submittedAt ? new Date(submittedAt) : null,
      raison_sociale: formData.raisonSociale,
      adresse: formData.adresse,
      code_postal: formData.codePostal,
      ville: formData.ville,
      pays: formData.pays,
      tel: formData.tel,
      site_internet: toNullableText(formData.siteInternet),
      siret: toNullableText(formData.siret),
      tva_intra: toNullableText(formData.tvaIntra),
      membre_association: toBoolean(formData.membreAssociation),
      exposant_2024: toBoolean(formData.exposant2024),
      activite_industrie: toBoolean(formData.activites.industrie),
      activite_transport_logistique: toBoolean(formData.activites.transportLogistique),
      activite_btp_construction_logement: toBoolean(formData.activites.btpConstructionLogement),
      activite_environnement_energie: toBoolean(formData.activites.environnementEnergie),
      activite_services_entreprises: toBoolean(formData.activites.servicesEntreprises),
      activite_image_nouvelles_technologies: toBoolean(formData.activites.imageNouvellesTechnologies),
      activite_tourisme_bien_etre: toBoolean(formData.activites.tourismeBienEtre),
      activite_autre: toBoolean(formData.activites.autre),
      autre_activite: toNullableText(formData.autreActivite),
      facturation_adresse: toNullableText(formData.facturationAdresse),
      facturation_cp: toNullableText(formData.facturationCP),
      facturation_ville: toNullableText(formData.facturationVille),
      facturation_pays: toNullableText(formData.facturationPays),
      contact_compta_nom: toNullableText(formData.contactComptaNom),
      contact_compta_tel: toNullableText(formData.contactComptaTel),
      contact_compta_mail: toNullableText(formData.contactComptaMail),
      responsable_nom: toNullableText(formData.responsableNom),
      responsable_prenom: toNullableText(formData.responsablePrenom),
      responsable_tel: toNullableText(formData.responsableTel),
      responsable_mail: toNullableText(formData.responsableMail),
      resp_op_nom: toNullableText(formData.respOpNom),
      resp_op_prenom: toNullableText(formData.respOpPrenom),
      resp_op_tel: toNullableText(formData.respOpTel),
      resp_op_mail: toNullableText(formData.respOpMail),
      enseigne: toNullableText(formData.enseigne),
      stand_type: toNullableText(reservationData.standType),
      stand_size: toNullableText(reservationData.standSize),
      stand_angles: toInteger(reservationData.standAngles),
      electricity_upgrade: toNullableText(reservationData.electricityUpgrade),
      exterior_space: toBoolean(reservationData.exteriorSpace),
      exterior_surface: toNullableText(reservationData.exteriorSurface),
      garden_cottage: toBoolean(reservationData.gardenCottage),
      micro_stand: toBoolean(reservationData.microStand),
      reserve_porte_melamine: toIntegerOrZero(amenagementData.reservePorteMelamine),
      moquette_differente: toIntegerOrZero(amenagementData.moquetteDifferente),
      moquette_couleur: toNullableText(amenagementData.moquetteCouleur),
      velum_stand: toIntegerOrZero(amenagementData.velumStand),
      cloison_bois_gainee: toIntegerOrZero(amenagementData.cloisonBoisGainee),
      reserve_porte_bois: toIntegerOrZero(amenagementData.reservePorteBois),
      bandeau_signaletique: toIntegerOrZero(amenagementData.bandeauSignaletique),
      comptoir: toIntegerOrZero(amenagementData.comptoir),
      tabouret: toIntegerOrZero(amenagementData.tabouret),
      mange_debout: toIntegerOrZero(amenagementData.mangeDebout),
      chaise: toIntegerOrZero(amenagementData.chaise),
      table_120x60: toIntegerOrZero(amenagementData.table120x60),
      mange_3_tabourets: toIntegerOrZero(amenagementData.mange3Tabourets),
      ecran_52: toIntegerOrZero(amenagementData.ecran52),
      refrigerateur_140: toIntegerOrZero(amenagementData.refrigerateur140),
      refrigerateur_240: toIntegerOrZero(amenagementData.refrigerateur240),
      presentoir_a4: toIntegerOrZero(amenagementData.presentoirA4),
      bloc_prises: toIntegerOrZero(amenagementData.blocPrises),
      fauteuil: toIntegerOrZero(amenagementData.fauteuil),
      table_basse: toIntegerOrZero(amenagementData.tableBasse),
      gueridon_haut: toIntegerOrZero(amenagementData.gueridonHaut),
      pouf_cube: toIntegerOrZero(amenagementData.poufCube),
      pouf_couleur: toNullableText(amenagementData.poufCouleur),
      colonne_vitrine: toIntegerOrZero(amenagementData.colonneVitrine),
      comptoir_vitrine: toIntegerOrZero(amenagementData.comptoirVitrine),
      porte_manteaux: toIntegerOrZero(amenagementData.porteManteux),
      plante_bambou: toIntegerOrZero(amenagementData.planteBambou),
      plante_kentia: toIntegerOrZero(amenagementData.planteKentia),
      scan_badges: toBoolean(amenagementData.scanBadges),
      pass_soiree: toIntegerOrZero(amenagementData.passSoiree),
      pack_signaletique_complet: toBoolean(visibiliteData.packSignaletiqueComplet),
      signaletique_comptoir: toBoolean(visibiliteData.signaletiqueComptoir),
      signaletique_haut_cloisons: toBoolean(visibiliteData.signaletiqueHautCloisons),
      signaletique_cloisons_lineaires: toIntegerOrZero(visibiliteData.signalethqueCloisons),
      signaletique_enseigne_haute: toBoolean(visibiliteData.signaletiqueEnseigneHaute),
      demi_page_catalogue: toBoolean(visibiliteData.demiPageCatalogue),
      page_complete_catalogue: toBoolean(visibiliteData.pageCompleeteCatalogue),
      deuxieme_couverture: toBoolean(visibiliteData.deuxiemeCouverture),
      quatrieme_couverture: toBoolean(visibiliteData.quatriemeCouverture),
      logo_plan_salon: toBoolean(visibiliteData.logoplanSalon),
      documentation_sac_visiteur: toBoolean(visibiliteData.documentationSacVisiteur),
      distribution_hotesse: toBoolean(visibiliteData.distributionHotesse),
      mode_reglement: engagementData.modeReglement,
      accepte_reglement: toBoolean(engagementData.accepteReglement),
      date_signature: toNullableText(engagementData.dateSignature),
      cachet_signature: toNullableText(engagementData.cachetSignature),
      total_ht_section1: toMoney(totals.totalHT1),
      total_ht_section2: toMoney(totals.totalHT2),
      total_ht_section3: toMoney(totals.totalHT3),
      total_ht: toMoney(totals.totalHT),
      total_tva: toMoney(totals.tva),
      total_ttc: toMoney(totals.totalTTC),
    };

    const submissionQuery = buildInsertQuery('submissions', submissionRow, { returning: 'id' });
    const submissionResult = await client.query(submissionQuery);

    const submissionId = submissionResult.rows[0].id;

    if (Array.isArray(reservationData.coExposants)) {
      for (const coExposant of reservationData.coExposants) {
        if (!coExposant?.nomEntreprise) continue;
        const coExposantRow = {
          submission_id: submissionId,
          nom_entreprise: coExposant.nomEntreprise,
          nom_responsable: toNullableText(coExposant.nomResponsable),
          prenom_responsable: toNullableText(coExposant.prenomResponsable),
          tel_responsable: toNullableText(coExposant.telResponsable),
          mail_responsable: toNullableText(coExposant.mailResponsable),
        };

        const coExposantQuery = buildInsertQuery('co_exposants', coExposantRow);
        await client.query(coExposantQuery);
      }
    }

    await client.query('COMMIT');

    return res.status(201).json({ id: submissionId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la sauvegarde du formulaire:', error);
    return res.status(500).json({ error: 'Erreur interne' });
  } finally {
    client.release();
  }
});

const buildDir = path.join(__dirname, '..', 'build');
app.use(express.static(buildDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
