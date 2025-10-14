import { ReservationData, AmenagementData, VisibiliteData, FormData } from './types';
import { 
  standPrices, 
  readyToExposePrices, 
  anglePrice,
  electricityPrices, 
  exteriorSpacePrice,
  gardenCottagePrice,
  microStandPrice,
  coExpositionPrice,
  amenagementPrices, 
  visibilitePrices,
  getPassSoireeInclus
} from './constants';

export const calculateTotalHT1 = (reservationData: ReservationData): number => {
  let total = 0;
  
  // Prix du stand principal
  if (reservationData.standType && reservationData.standSize) {
    const size = parseInt(reservationData.standSize);
    
    if (reservationData.standType === 'equipped') {
      // Stand équipé : 270€ par m² (6-30m²)
      total += size * standPrices.equipped;
    } else if (reservationData.standType === 'ready') {
      // Pack prêt à exposer : prix fixes pour 12, 15, 18 m²
      if (readyToExposePrices[reservationData.standSize]) {
        total += readyToExposePrices[reservationData.standSize];
      }
    } else if (reservationData.standType === 'bare') {
      // Stand nu : 225€ par m² (6-30m²)
      total += size * standPrices.bare;
    }
  }
  
  // Prix des angles ouverts (185€ par angle)
  if (reservationData.standAngles > 0) {
    total += reservationData.standAngles * anglePrice;
  }
  
  // Prix électricité supérieure
  if (reservationData.electricityUpgrade && reservationData.electricityUpgrade !== 'none') {
    total += electricityPrices[reservationData.electricityUpgrade as keyof typeof electricityPrices] || 0;
  }
  
  // Prix surface extérieure (50€ / m²)
  if (reservationData.exteriorSpace && reservationData.exteriorSurface) {
    const surface = Math.min(
      Math.max(parseInt(reservationData.exteriorSurface, 10) || 0, 0),
      80
    );
    total += surface * exteriorSpacePrice;
  }
  
  // Prix garden cottage (800€)
  if (reservationData.gardenCottage) {
    total += gardenCottagePrice;
  }
  
  // Prix micro-stand (1200€)
  if (reservationData.microStand) {
    total += microStandPrice;
  }
  
  // Prix co-exposants (400€ par co-exposant)
  if (reservationData.coExposants && reservationData.coExposants.length > 0) {
    total += reservationData.coExposants.length * coExpositionPrice;
  }
  
  return total;
};

export const calculateTotalHT2 = (amenagementData: AmenagementData): number => {
  let total = 0;
  
  // ÉQUIPEMENTS STANDS
  total += amenagementData.reservePorteMelamine * amenagementPrices.reservePorteMelamine;
  total += amenagementData.moquetteDifferente * amenagementPrices.moquetteDifferente;
  total += amenagementData.velumStand * amenagementPrices.velumStand;
  total += amenagementData.cloisonBoisGainee * amenagementPrices.cloisonBoisGainee;
  total += amenagementData.reservePorteBois * amenagementPrices.reservePorteBois;
  total += amenagementData.bandeauSignaletique * amenagementPrices.bandeauSignaletique;
  
  // MOBILIER
  total += amenagementData.comptoir * amenagementPrices.comptoir;
  total += amenagementData.tabouret * amenagementPrices.tabouret;
  total += amenagementData.mangeDebout * amenagementPrices.mangeDebout;
  total += amenagementData.chaise * amenagementPrices.chaise;
  total += amenagementData.table120x60 * amenagementPrices.table120x60;
  total += amenagementData.mange3Tabourets * amenagementPrices.mange3Tabourets;
  total += amenagementData.ecran52 * amenagementPrices.ecran52;
  total += amenagementData.refrigerateur140 * amenagementPrices.refrigerateur140;
  total += amenagementData.refrigerateur240 * amenagementPrices.refrigerateur240;
  total += amenagementData.presentoirA4 * amenagementPrices.presentoirA4;
  total += amenagementData.blocPrises * amenagementPrices.blocPrises;
  total += amenagementData.fauteuil * amenagementPrices.fauteuil;
  total += amenagementData.tableBasse * amenagementPrices.tableBasse;
  total += amenagementData.gueridonHaut * amenagementPrices.gueridonHaut;
  total += amenagementData.poufCube * amenagementPrices.poufCube;
  total += amenagementData.colonneVitrine * amenagementPrices.colonneVitrine;
  total += amenagementData.comptoirVitrine * amenagementPrices.comptoirVitrine;
  total += amenagementData.porteManteux * amenagementPrices.porteManteux;
  total += amenagementData.planteBambou * amenagementPrices.planteBambou;
  total += amenagementData.planteKentia * amenagementPrices.planteKentia;
  return total;
};

export const calculateTotalHT3 = (amenagementData: AmenagementData): number => {
  let total = 0;

  if (amenagementData.scanBadges) {
    total += amenagementPrices.scanBadges;
  }
  total += amenagementData.passSoiree * amenagementPrices.passSoiree;

  return total;
};

export const calculateTotalHT4 = (visibiliteData: VisibiliteData, reservationData?: ReservationData): number => {
  let total = 0;
  const standSize = parseInt(reservationData?.standSize || '0', 10) || 0;
  
  // HABILLAGE ET VISIBILITÉ DE VOTRE STAND
  if (visibiliteData.packSignaletiqueComplet) {
    total += standSize > 0 ? standSize * visibilitePrices.packSignaletiqueComplet : 0;
  }
  if (visibiliteData.signaletiqueComptoir) {
    total += visibilitePrices.signaletiqueComptoir;
  }
  if (visibiliteData.signaletiqueHautCloisons) {
    total += standSize > 0 ? standSize * visibilitePrices.signaletiqueHautCloisons : 0;
  }
  if (visibiliteData.signalethqueCloisons > 0) {
    total += visibiliteData.signalethqueCloisons * visibilitePrices.signalethqueCloisons;
  }
  if (visibiliteData.signaletiqueEnseigneHaute) {
    total += visibilitePrices.signaletiqueEnseigneHaute;
  }
  
  // AMÉLIORATION DE VISIBILITÉ ET COMMUNICATION
  if (visibiliteData.demiPageCatalogue) {
    total += visibilitePrices.demiPageCatalogue;
  }
  if (visibiliteData.pageCompleeteCatalogue) {
    total += visibilitePrices.pageCompleeteCatalogue;
  }
  if (visibiliteData.deuxiemeCouverture) {
    total += visibilitePrices.deuxiemeCouverture;
  }
  if (visibiliteData.quatriemeCouverture) {
    total += visibilitePrices.quatriemeCouverture;
  }
  if (visibiliteData.logoplanSalon) {
    total += visibilitePrices.logoplanSalon;
  }
  if (visibiliteData.documentationSacVisiteur) {
    total += visibilitePrices.documentationSacVisiteur;
  }
  if (visibiliteData.distributionHotesse) {
    total += visibilitePrices.distributionHotesse;
  }
  
  return total;
};

export const canProceedFromReservation = (reservationData: ReservationData): boolean => {
  // Vérification que si surface extérieure est choisie, garden cottage doit être coché SAUF si un stand intérieur est sélectionné
  if (reservationData.exteriorSpace && !reservationData.gardenCottage && !reservationData.standType) {
    return false;
  }
  return true;
};

// Fonction pour vérifier si la co-exposition est disponible (>= 12m²)
export const isCoExpositionAvailable = (reservationData: ReservationData): boolean => {
  if (!reservationData.standType || !reservationData.standSize) return false;
  const size = parseInt(reservationData.standSize) || 0;
  return size >= 12;
};

// Validation des champs obligatoires pour la page identité
export const validateIdentityPage = (formData: FormData): string[] => {
  const missingFields: string[] = [];
  
  if (!formData.raisonSociale.trim()) missingFields.push('raisonSociale');
  if (!formData.adresse.trim()) missingFields.push('adresse');
  if (!formData.codePostal.trim()) missingFields.push('codePostal');
  if (!formData.ville.trim()) missingFields.push('ville');
  if (!formData.pays.trim()) missingFields.push('pays');
  if (!formData.tel.trim()) missingFields.push('tel');
  if (!formData.siret.trim()) missingFields.push('siret');
  if (!formData.tvaIntra.trim()) missingFields.push('tvaIntra');
  if (!formData.contactComptaNom.trim()) missingFields.push('contactComptaNom');
  if (!formData.contactComptaTel.trim()) missingFields.push('contactComptaTel');
  if (!formData.contactComptaMail.trim()) missingFields.push('contactComptaMail');
  if (!formData.responsableNom.trim()) missingFields.push('responsableNom');
  if (!formData.responsablePrenom.trim()) missingFields.push('responsablePrenom');
  if (!formData.responsableTel.trim()) missingFields.push('responsableTel');
  if (!formData.responsableMail.trim()) missingFields.push('responsableMail');
  if (!formData.respOpNom.trim()) missingFields.push('respOpNom');
  if (!formData.respOpPrenom.trim()) missingFields.push('respOpPrenom');
  if (!formData.respOpTel.trim()) missingFields.push('respOpTel');
  if (!formData.respOpMail.trim()) missingFields.push('respOpMail');
  if (!formData.enseigne.trim()) missingFields.push('enseigne');
  
  return missingFields;
};

// Validation pour la page réservation
export const validateReservationPage = (reservationData: ReservationData): string[] => {
  const missingFields: string[] = [];
  
  // Vérification garden cottage si surface extérieure sans stand intérieur
  if (reservationData.exteriorSpace && !reservationData.gardenCottage && !reservationData.standType) {
    missingFields.push('gardenCottage');
  }
  
  return missingFields;
};

// Fonction utilitaire pour vérifier si un champ est en erreur
export const isFieldInError = (fieldName: string, errorFields: string[]): boolean => {
  return errorFields.includes(fieldName);
};

// Mapping des noms de champs vers leurs titres lisibles
export const getFieldTitle = (fieldName: string): string => {
  const fieldTitles: { [key: string]: string } = {
    // Informations de base
    raisonSociale: 'Raison sociale',
    adresse: 'Adresse',
    codePostal: 'Code postal',
    ville: 'Ville',
    pays: 'Pays',
    tel: 'Téléphone',
    siret: 'Siret',
    tvaIntra: 'TVA Intercommunautaire',
    enseigne: 'Enseigne',
    
    // Contact comptabilité
    contactComptaNom: 'Nom de contact (Comptabilité)',
    contactComptaTel: 'Téléphone direct (Comptabilité)',
    contactComptaMail: 'Email (Comptabilité)',
    
    // Responsable entreprise
    responsableNom: 'Nom (Responsable de l\'entreprise)',
    responsablePrenom: 'Prénom (Responsable de l\'entreprise)',
    responsableTel: 'Téléphone (Responsable de l\'entreprise)',
    responsableMail: 'Email (Responsable de l\'entreprise)',
    
    // Responsable opérationnel
    respOpNom: 'Nom (Responsable opérationnel)',
    respOpPrenom: 'Prénom (Responsable opérationnel)',
    respOpTel: 'Téléphone (Responsable opérationnel)',
    respOpMail: 'Email (Responsable opérationnel)',
    
    // Réservation
    gardenCottage: 'Garden cottage (obligatoire pour surface extérieure sans stand intérieur)'
  };
  
  return fieldTitles[fieldName] || fieldName;
};