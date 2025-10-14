import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from './types';
import { standPrices, anglePrice, electricityPrices, exteriorSpacePrice, amenagementPrices, visibilitePrices, readyToExposePrices } from './constants';

export type PdfFieldKind = 'text' | 'checkbox';

export interface MappingCtx {
  formData: FormData;
  reservationData: ReservationData;
  amenagementData: AmenagementData;
  visibiliteData: VisibiliteData;
  engagementData: EngagementData;
  totals: {
    ht1: number;
    ht2: number;
    ht3: number;
    ht4: number;
    ht: number;
    tva: number;
    ttc: number;
  };
  mockAll?: boolean;
}

export interface PdfFieldMapping {
  type: PdfFieldKind;
  get: (ctx: MappingCtx) => string | boolean | undefined;
}

const num = (n: number) => n.toFixed(2).replace('.', ',');

export const PDF_FIELD_MAP: Record<string, PdfFieldMapping> = {
  // Identité
  'raison_social': { type: 'text', get: ({ formData }) => formData.raisonSociale || formData.enseigne },
  'adresse': { type: 'text', get: ({ formData }) => formData.adresse },
  'code_postal': { type: 'text', get: ({ formData }) => formData.codePostal },
  'ville': { type: 'text', get: ({ formData }) => formData.ville },
  'pays': { type: 'text', get: ({ formData }) => formData.pays },
  'tel': { type: 'text', get: ({ formData }) => formData.tel },
  'site_internet': { type: 'text', get: ({ formData }) => formData.siteInternet },
  'siret': { type: 'text', get: ({ formData }) => formData.siret },
  'tva': { type: 'text', get: ({ formData }) => formData.tvaIntra },
  'membre': { type: 'checkbox', get: ({ formData }) => !!formData.membreAssociation },
  'expo_2024': { type: 'checkbox', get: ({ formData }) => !!formData.exposant2024 },

  // Activités
  'act_indus': { type: 'checkbox', get: ({ formData }) => !!formData.activites.industrie },
  'act_logistique': { type: 'checkbox', get: ({ formData }) => !!formData.activites.transportLogistique },
  'act_btp': { type: 'checkbox', get: ({ formData }) => !!formData.activites.btpConstructionLogement },
  'act_dev_durable': { type: 'checkbox', get: ({ formData }) => !!formData.activites.environnementEnergie },
  'act_service': { type: 'checkbox', get: ({ formData }) => !!formData.activites.servicesEntreprises },
  'act_new_tech': { type: 'checkbox', get: ({ formData }) => !!formData.activites.imageNouvellesTechnologies },
  'act_tourisme': { type: 'checkbox', get: ({ formData }) => !!formData.activites.tourismeBienEtre },
  'act_autre': { type: 'checkbox', get: ({ formData }) => !!formData.activites.autre },
  'act_autre_text': { type: 'text', get: ({ formData }) => formData.autreActivite },

  // Facturation / compta
  'fac_adresse': { type: 'text', get: ({ formData }) => formData.facturationAdresse },
  'fac_code_postal': { type: 'text', get: ({ formData }) => formData.facturationCP },
  'fac_ville': { type: 'text', get: ({ formData }) => formData.facturationVille },
  'fac_pays': { type: 'text', get: ({ formData }) => formData.facturationPays },
  'compta_contact': { type: 'text', get: ({ formData }) => formData.contactComptaNom },
  'compta_tel': { type: 'text', get: ({ formData }) => formData.contactComptaTel },
  'compta_mail': { type: 'text', get: ({ formData }) => formData.contactComptaMail },

  // Responsables
  'resp_nom': { type: 'text', get: ({ formData }) => formData.responsableNom },
  'resp_prenom': { type: 'text', get: ({ formData }) => formData.responsablePrenom },
  'resp_tel': { type: 'text', get: ({ formData }) => formData.responsableTel },
  'resp_mail': { type: 'text', get: ({ formData }) => formData.responsableMail },
  'resp_ope_nom': { type: 'text', get: ({ formData }) => formData.respOpNom },
  'resp_ope_prenom': { type: 'text', get: ({ formData }) => formData.respOpPrenom },
  'resp_ope_tel': { type: 'text', get: ({ formData }) => formData.respOpTel },
  'resp_ope_mail': { type: 'text', get: ({ formData }) => formData.respOpMail },

  // Réservation – stands
  'std_equipe_surface': { type: 'text', get: ({ reservationData, mockAll }) => reservationData.standType === 'equipped' ? reservationData.standSize : (mockAll ? (reservationData.standSize || '18') : '') },
  'std_equipe_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const size = reservationData.standType === 'equipped' ? parseInt(reservationData.standSize || '0') : 0;
    const fallback = mockAll ? (parseInt(reservationData.standSize || '0') || 18) : 0;
    const effectiveSize = size || fallback;
    return effectiveSize > 0 ? num(effectiveSize * standPrices.equipped) : '';
  } },
  'std_nu_surface_qte': { type: 'text', get: ({ reservationData, mockAll }) => reservationData.standType === 'bare' ? reservationData.standSize : (mockAll ? (reservationData.standSize || '18') : '') },
  'std_nu_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const size = reservationData.standType === 'bare' ? parseInt(reservationData.standSize || '0') : 0;
    const fallback = mockAll ? (parseInt(reservationData.standSize || '0') || 18) : 0;
    const effectiveSize = size || fallback;
    return effectiveSize > 0 ? num(effectiveSize * standPrices.bare) : '';
  } },
  'std_expo_surface_12': { type: 'checkbox', get: ({ reservationData, mockAll }) => (reservationData.standType === 'ready' && reservationData.standSize === '12') || (mockAll && (reservationData.standSize || '18') === '12') },
  'std_expo_surface_15': { type: 'checkbox', get: ({ reservationData, mockAll }) => (reservationData.standType === 'ready' && reservationData.standSize === '15') || (mockAll && (reservationData.standSize || '18') === '15') },
  'std_expo_surface_18': { type: 'checkbox', get: ({ reservationData, mockAll }) => (reservationData.standType === 'ready' && reservationData.standSize === '18') || (mockAll && (reservationData.standSize || '18') === '18') },
  'std_expo_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const size = reservationData.standType === 'ready' ? reservationData.standSize : undefined;
    const selectedSize = size || (mockAll ? (reservationData.standSize || '18') : undefined);
    return selectedSize ? num(readyToExposePrices[selectedSize] || 0) : '';
  } },
  'std_equipe_angle_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    const q = reservationData.standType === 'equipped' ? reservationData.standAngles : (mockAll ? (reservationData.standAngles || 2) : 0);
    return q ? String(q) : '';
  } },
  'std_equipe_angle_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const q = reservationData.standType === 'equipped' ? reservationData.standAngles : (mockAll ? (reservationData.standAngles || 2) : 0);
    return q ? num(q * anglePrice) : '';
  } },
  'std_expo_angle_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    const q = reservationData.standType === 'ready' ? reservationData.standAngles : (mockAll ? (reservationData.standAngles || 2) : 0);
    return q ? String(q) : '';
  } },
  'std_expo_angle_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const q = reservationData.standType === 'ready' ? reservationData.standAngles : (mockAll ? (reservationData.standAngles || 2) : 0);
    return q ? num(q * anglePrice) : '';
  } },
  'std_nu_angle_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    const q = reservationData.standType === 'bare' ? reservationData.standAngles : (mockAll ? (reservationData.standAngles || 2) : 0);
    return q ? String(q) : '';
  } },
  'std_nu_angle_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const q = reservationData.standType === 'bare' ? reservationData.standAngles : (mockAll ? (reservationData.standAngles || 2) : 0);
    return q ? num(q * anglePrice) : '';
  } },

  // Électricité
  'elec_1_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    const result = reservationData.electricityUpgrade === '2kw' ? '1' : (mockAll ? '1' : '');
    console.log('[PDF] elec_1_qte:', { electricityUpgrade: reservationData.electricityUpgrade, mockAll, result });
    return result;
  } },
  'elec_2_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    const result = reservationData.electricityUpgrade === '4kw' ? '1' : (mockAll ? '1' : '');
    console.log('[PDF] elec_2_qte:', { electricityUpgrade: reservationData.electricityUpgrade, mockAll, result });
    return result;
  } },
  'elec_3_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    const result = reservationData.electricityUpgrade === '6kw' ? '1' : (mockAll ? '1' : '');
    console.log('[PDF] elec_3_qte:', { electricityUpgrade: reservationData.electricityUpgrade, mockAll, result });
    return result;
  } },
  // Note: elec_X_prix_ht contient le TOTAL (quantité × prix unitaire), pas le prix unitaire seul
  'elec_1_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const shouldShow = reservationData.electricityUpgrade === '2kw' || mockAll;
    const result = shouldShow ? num(1 * electricityPrices['2kw']) : '';
    console.log('[PDF] elec_1_prix_ht:', { electricityUpgrade: reservationData.electricityUpgrade, mockAll, price: electricityPrices['2kw'], result });
    return result;
  } },
  'elec_2_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const shouldShow = reservationData.electricityUpgrade === '4kw' || mockAll;
    const result = shouldShow ? num(1 * electricityPrices['4kw']) : '';
    console.log('[PDF] elec_2_prix_ht:', { electricityUpgrade: reservationData.electricityUpgrade, mockAll, price: electricityPrices['4kw'], result });
    return result;
  } },
  'elec_3_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    const shouldShow = reservationData.electricityUpgrade === '6kw' || mockAll;
    const result = shouldShow ? num(1 * electricityPrices['6kw']) : '';
    console.log('[PDF] elec_3_prix_ht:', { electricityUpgrade: reservationData.electricityUpgrade, mockAll, price: electricityPrices['6kw'], result });
    return result;
  } },

  // Espace extérieur
  'std_ext_surface_qte': { type: 'text', get: ({ reservationData, mockAll }) => {
    if (!reservationData.exteriorSpace && !mockAll) return '';

    const raw = reservationData.exteriorSurface || (mockAll ? '12' : '0');
    const qty = Math.min(Math.max(parseInt(raw, 10) || 0, 0), 80);
    if (qty <= 0) return mockAll ? '12' : '';

    return String(qty);
  } },
  'std_ext_prix_ht': { type: 'text', get: ({ reservationData, mockAll }) => {
    if (!reservationData.exteriorSpace && !mockAll) return '';

    const fallback = mockAll ? 12 : 0;
    const raw = reservationData.exteriorSurface || String(fallback);
    const qty = Math.min(Math.max(parseInt(raw, 10) || 0, 0), 80);
    const effectiveQty = qty > 0 ? qty : fallback;

    return effectiveQty > 0 ? num(effectiveQty * exteriorSpacePrice) : '';
  } },

  // Aménagements – quantités
  'reserve_melamine_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.reservePorteMelamine ? String(amenagementData.reservePorteMelamine) : '' },
  'moquette_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.moquetteDifferente ? String(amenagementData.moquetteDifferente) : '' },
  'velum_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.velumStand ? String(amenagementData.velumStand) : '' },
  'cloison_bois_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.cloisonBoisGainee ? String(amenagementData.cloisonBoisGainee) : '' },
  'reserve_bois_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.reservePorteBois ? String(amenagementData.reservePorteBois) : '' },
  'bandeau_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.bandeauSignaletique ? String(amenagementData.bandeauSignaletique) : '' },
  'rail_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.bandeauSignaletique ? String(amenagementData.bandeauSignaletique) : '' },
  // Aménagements – totaux HT (les champs xxx_prix contiennent le total, pas le prix unitaire)
  'reserve_melamine_prix': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.reservePorteMelamine || 0;
    return qty > 0 ? num(qty * amenagementPrices.reservePorteMelamine) : '';
  } },
  'moquette_prix': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.moquetteDifferente || 0;
    return qty > 0 ? num(qty * amenagementPrices.moquetteDifferente) : '';
  } },
  'velum_prix': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.velumStand || 0;
    return qty > 0 ? num(qty * amenagementPrices.velumStand) : '';
  } },
  'cloison_bois_prix': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.cloisonBoisGainee || 0;
    return qty > 0 ? num(qty * amenagementPrices.cloisonBoisGainee) : '';
  } },
  'reserve_bois_prix': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.reservePorteBois || 0;
    return qty > 0 ? num(qty * amenagementPrices.reservePorteBois) : '';
  } },
  'rail_prix': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.bandeauSignaletique || 0;
    return qty > 0 ? num(qty * amenagementPrices.bandeauSignaletique) : '';
  } },

  // Mobilier – quantités
  'comptoir_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.comptoir ? String(amenagementData.comptoir) : '' },
  'tabouret_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.tabouret ? String(amenagementData.tabouret) : '' },
  'mange_debout_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.mangeDebout ? String(amenagementData.mangeDebout) : '' },
  'chaise_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.chaise ? String(amenagementData.chaise) : '' },
  'table_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.table120x60 ? String(amenagementData.table120x60) : '' },
  'pck_mange_tabouret_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.mange3Tabourets ? String(amenagementData.mange3Tabourets) : '' },
  'ecran_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.ecran52 ? String(amenagementData.ecran52) : '' },
  'frigo_140_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.refrigerateur140 ? String(amenagementData.refrigerateur140) : '' },
  'frigo_260_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.refrigerateur240 ? String(amenagementData.refrigerateur240) : '' },
  'presentoir_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.presentoirA4 ? String(amenagementData.presentoirA4) : '' },
  'bloc_prise_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.blocPrises ? String(amenagementData.blocPrises) : '' },
  'fauteuil_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.fauteuil ? String(amenagementData.fauteuil) : '' },
  'table_basse_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.tableBasse ? String(amenagementData.tableBasse) : '' },
  'gueridon_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.gueridonHaut ? String(amenagementData.gueridonHaut) : '' },
  'pouf_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.poufCube ? String(amenagementData.poufCube) : '' },
  'colonne_vitrine_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.colonneVitrine ? String(amenagementData.colonneVitrine) : '' },
  'comptoir_vitrine_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.comptoirVitrine ? String(amenagementData.comptoirVitrine) : '' },
  'porte_menteaux_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.porteManteux ? String(amenagementData.porteManteux) : '' },
  'plante_bambou_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.planteBambou ? String(amenagementData.planteBambou) : '' },
  'plante_kentia_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.planteKentia ? String(amenagementData.planteKentia) : '' },
  // Mobilier – totaux HT (les champs xxx_prix_ht contiennent le total, pas le prix unitaire)
  'comptoir_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.comptoir || 0;
    const result = qty > 0 ? num(qty * amenagementPrices.comptoir) : '';
    console.log('[PDF] comptoir_prix_ht:', { qty, unitPrice: amenagementPrices.comptoir, result });
    return result;
  } },
  'tabouret_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.tabouret || 0;
    const result = qty > 0 ? num(qty * amenagementPrices.tabouret) : '';
    console.log('[PDF] tabouret_prix_ht:', { qty, unitPrice: amenagementPrices.tabouret, result });
    return result;
  } },
  'mange_debout_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.mangeDebout || 0;
    return qty > 0 ? num(qty * amenagementPrices.mangeDebout) : '';
  } },
  'chaise_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.chaise || 0;
    return qty > 0 ? num(qty * amenagementPrices.chaise) : '';
  } },
  'table_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.table120x60 || 0;
    return qty > 0 ? num(qty * amenagementPrices.table120x60) : '';
  } },
  'pck_mange_tabouret_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.mange3Tabourets || 0;
    return qty > 0 ? num(qty * amenagementPrices.mange3Tabourets) : '';
  } },
  'ecran_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.ecran52 || 0;
    return qty > 0 ? num(qty * amenagementPrices.ecran52) : '';
  } },
  'frigo_140_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.refrigerateur140 || 0;
    return qty > 0 ? num(qty * amenagementPrices.refrigerateur140) : '';
  } },
  'frigo_260_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.refrigerateur240 || 0;
    return qty > 0 ? num(qty * amenagementPrices.refrigerateur240) : '';
  } },
  'presentoir_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.presentoirA4 || 0;
    return qty > 0 ? num(qty * amenagementPrices.presentoirA4) : '';
  } },
  'bandeau_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.bandeauSignaletique || 0;
    return qty > 0 ? num(qty * amenagementPrices.bandeauSignaletique) : '';
  } },
  'bloc_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.blocPrises || 0;
    return qty > 0 ? num(qty * amenagementPrices.blocPrises) : '';
  } },
  'fauteuil_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.fauteuil || 0;
    return qty > 0 ? num(qty * amenagementPrices.fauteuil) : '';
  } },
  'table_basse_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.tableBasse || 0;
    return qty > 0 ? num(qty * amenagementPrices.tableBasse) : '';
  } },
  'gueridon_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.gueridonHaut || 0;
    return qty > 0 ? num(qty * amenagementPrices.gueridonHaut) : '';
  } },
  'pouf_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.poufCube || 0;
    return qty > 0 ? num(qty * amenagementPrices.poufCube) : '';
  } },
  'colonne_vitrine_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.colonneVitrine || 0;
    return qty > 0 ? num(qty * amenagementPrices.colonneVitrine) : '';
  } },
  'comptoir_vitrine_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.comptoirVitrine || 0;
    return qty > 0 ? num(qty * amenagementPrices.comptoirVitrine) : '';
  } },
  'porte_menteaux_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.porteManteux || 0;
    return qty > 0 ? num(qty * amenagementPrices.porteManteux) : '';
  } },
  'plante_bambou_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.planteBambou || 0;
    return qty > 0 ? num(qty * amenagementPrices.planteBambou) : '';
  } },
  'plante_kentia_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.planteKentia || 0;
    return qty > 0 ? num(qty * amenagementPrices.planteKentia) : '';
  } },

  // Produits complémentaires
  'scan_badge': { type: 'checkbox', get: ({ amenagementData }) => !!amenagementData.scanBadges },
  'scan_badge_prix_ht': { type: 'text', get: ({ amenagementData }) =>
    amenagementData.scanBadges ? num(amenagementPrices.scanBadges) : ''
  },
  'pass_soiree_qte': { type: 'text', get: ({ amenagementData }) => amenagementData.passSoiree ? String(amenagementData.passSoiree) : '' },
  'pass_soiree_prix_ht': { type: 'text', get: ({ amenagementData }) => {
    const qty = amenagementData.passSoiree || 0;
    return qty > 0 ? num(qty * amenagementPrices.passSoiree) : '';
  } },

  // Visibilité & communication
  'signa_pck_qte': { type: 'text', get: ({ visibiliteData, reservationData }) => {
    return visibiliteData.packSignaletiqueComplet ? '1' : '';
  } },
  'signa_comptoir_qte': { type: 'text', get: ({ visibiliteData }) => visibiliteData.signaletiqueComptoir ? '1' : '' },
  'signa_haut_qte': { type: 'text', get: ({ visibiliteData, reservationData }) => {
    return visibiliteData.signaletiqueHautCloisons ? '1' : '';
  } },
  'signa_complete_qte': { type: 'text', get: ({ visibiliteData }) => visibiliteData.signalethqueCloisons ? String(visibiliteData.signalethqueCloisons) : '' },
  'signa_enseigne_haute_qte': { type: 'text', get: ({ visibiliteData }) => visibiliteData.signaletiqueEnseigneHaute ? '1' : '' },
  'signa_pck_prix_ht': { type: 'text', get: ({ visibiliteData, reservationData }) => {
    return visibiliteData.packSignaletiqueComplet ? num(visibilitePrices.packSignaletiqueComplet) : '';
  } },
  'signa_comptoir_prix_ht': { type: 'text', get: ({ visibiliteData }) => visibiliteData.signaletiqueComptoir ? num(1 * visibilitePrices.signaletiqueComptoir) : '' },
  'signa_haut_prix_ht': { type: 'text', get: ({ visibiliteData, reservationData }) => {
    return visibiliteData.signaletiqueHautCloisons ? num(visibilitePrices.signaletiqueHautCloisons) : '';
  } },
  'signa_complete_prix_ht': { type: 'text', get: ({ visibiliteData }) => {
    const qty = visibiliteData.signalethqueCloisons || 0;
    if (qty === 0) return '';
    return num(qty * visibilitePrices.signalethqueCloisons);
  } },
  'signa_enseigne_haute_prix_ht': { type: 'text', get: ({ visibiliteData }) => visibiliteData.signaletiqueEnseigneHaute ? num(1 * visibilitePrices.signaletiqueEnseigneHaute) : '' },

  // Totaux
  'total_ht_1': { type: 'text', get: ({ totals }) => num(totals.ht1) },
  'total_ht_2': { type: 'text', get: ({ totals }) => num(totals.ht2) },
  'total_ht_3': { type: 'text', get: ({ totals }) => num(totals.ht3) },
  'total_ht_4': { type: 'text', get: ({ totals }) => num(totals.ht4) },
  'total_ht': { type: 'text', get: ({ totals }) => num(totals.ht) },
  'total_tva': { type: 'text', get: ({ totals }) => num(totals.tva) },
  'total_ttc': { type: 'text', get: ({ totals }) => num(totals.ttc) },

  // Engagement
  'date': { type: 'text', get: ({ engagementData }) => engagementData.dateSignature || new Date().toLocaleDateString('fr-FR') },
  'acompte': { type: 'text', get: ({ engagementData }) => engagementData.modeReglement === 'acompte' ? 'X' : '' },
  'solde': { type: 'text', get: ({ engagementData }) => engagementData.modeReglement === 'solde' ? 'X' : '' },
  'virement': { type: 'text', get: ({ engagementData }) => engagementData.modeReglement === 'virement' ? 'X' : '' },

  // Divers incertains
  'fax': { type: 'text', get: () => '' },
  // Champs "communication" (page catalogue/pub) – déductions depuis visibiliteData
  'comm_catalogue': { type: 'text', get: ({ visibiliteData }) => visibiliteData.pageCompleeteCatalogue ? num(visibilitePrices.pageCompleeteCatalogue) : '' },
  'comm_demi_catalogue': { type: 'text', get: ({ visibiliteData }) => visibiliteData.demiPageCatalogue ? num(visibilitePrices.demiPageCatalogue) : '' },
  'comm_catalogue_deuxieme': { type: 'text', get: ({ visibiliteData }) => visibiliteData.deuxiemeCouverture ? num(visibilitePrices.deuxiemeCouverture) : '' },
  'comm_catalogue_quatrieme': { type: 'text', get: ({ visibiliteData }) => visibiliteData.quatriemeCouverture ? num(visibilitePrices.quatriemeCouverture) : '' },
  'comm_logo_plan': { type: 'text', get: ({ visibiliteData }) => visibiliteData.logoplanSalon ? num(visibilitePrices.logoplanSalon) : '' },
  'comm_sac': { type: 'text', get: ({ visibiliteData }) => visibiliteData.documentationSacVisiteur ? num(visibilitePrices.documentationSacVisiteur) : '' },
  'comm_hotesse': { type: 'text', get: ({ visibiliteData }) => visibiliteData.distributionHotesse ? num(visibilitePrices.distributionHotesse) : '' },
  'comm_papier': { type: 'text', get: () => '' },
};
