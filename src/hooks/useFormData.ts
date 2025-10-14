import { useState } from 'react';
import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData, StandType, CoExposant } from '../lib/types';

export function useFormData() {
  const [formData, setFormData] = useState<FormData>({
    raisonSociale: '',
    adresse: '',
    codePostal: '',
    ville: '',
    pays: '',
    tel: '',
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
    enseigne: ''
  });

  const [reservationData, setReservationData] = useState<ReservationData>({
    standType: null as StandType,
    standSize: '',
    standAngles: 0,
    electricityUpgrade: 'none' as string,
    exteriorSpace: false,
    exteriorSurface: '',
    gardenCottage: false,
    microStand: false,
    coExposants: []
  });

  const [amenagementData, setAmenagementData] = useState<AmenagementData>({
    // ÉQUIPEMENTS STANDS
    reservePorteMelamine: 0,
    moquetteDifferente: 0,
    moquetteCouleur: '',
    velumStand: 0,
    cloisonBoisGainee: 0,
    reservePorteBois: 0,
    bandeauSignaletique: 0,
    railSpots: 0,
    
    // MOBILIER
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
    
    // PRODUITS COMPLÉMENTAIRES
    scanBadges: false,
    passSoiree: 0
  });

  const [visibiliteData, setVisibiliteData] = useState<VisibiliteData>({
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
    distributionHotesse: false
  });

  const [engagementData, setEngagementData] = useState<EngagementData>({
    modeReglement: 'acompte' as 'acompte' | 'solde' | 'virement',
    accepteReglement: false,
    dateSignature: '',
    cachetSignature: ''
  });

  // États pour l'auto-complétion des villes
  const [villeSuggestions, setVilleSuggestions] = useState<{ nom: string; codePostal: string }[]>([]);
  const [showVilleSuggestions, setShowVilleSuggestions] = useState(false);
  const [isLoadingVilles, setIsLoadingVilles] = useState(false);

  // Fonction pour formater le Siret (14 chiffres)
  const formatSiret = (value: string): string => {
    // Supprimer tous les caractères non numériques
    const numbersOnly = value.replace(/\D/g, '');
    // Limiter à 14 chiffres
    return numbersOnly.slice(0, 14);
  };

  // Fonction pour valider le Siret
  const isSiretValid = (siret: string): boolean => {
    return siret.length === 14 && /^\d{14}$/.test(siret);
  };

  // Fonction pour formater la TVA Intercommunautaire (2 lettres + 11 chiffres)
  const formatTvaIntra = (value: string): string => {
    // Supprimer les espaces et convertir en majuscules
    const cleanValue = value.replace(/\s/g, '').toUpperCase();
    
    // Extraire les lettres et les chiffres
    const letters = cleanValue.replace(/[^A-Z]/g, '').slice(0, 2);
    const numbers = cleanValue.replace(/[^0-9]/g, '').slice(0, 11);
    
    return letters + numbers;
  };

  // Fonction pour valider la TVA Intercommunautaire
  const isTvaIntraValid = (tva: string): boolean => {
    return tva.length === 13 && /^[A-Z]{2}\d{11}$/.test(tva);
  };

  // Fonction pour formater les numéros de téléphone (chiffres uniquement)
  const formatPhone = (value: string): string => {
    // Supprimer tous les caractères non numériques
    const numbersOnly = value.replace(/\D/g, '');
    // Limiter à 20 chiffres maximum (pour les numéros internationaux)
    return numbersOnly.slice(0, 20);
  };

  // Fonction pour valider les numéros de téléphone (au moins 8 chiffres)
  const isPhoneValid = (phone: string): boolean => {
    return phone.length >= 8 && /^\d+$/.test(phone);
  };

  // Fonction pour détecter le pays selon le code postal
  const detectCountryFromPostalCode = (codePostal: string): 'FRANCE' | 'BELGIQUE' | null => {
    if (!/^\d+$/.test(codePostal)) return null;
    
    const code = parseInt(codePostal);
    
    // France : 01000-95999 + DOM-TOM (97xxx, 98xxx)
    if (codePostal.length === 5) {
      if ((code >= 1000 && code <= 95999) || (code >= 97000 && code <= 98999)) {
        return 'FRANCE';
      }
    }
    
    // Belgique : 1000-9999
    if (codePostal.length === 4 && code >= 1000 && code <= 9999) {
      return 'BELGIQUE';
    }
    
    return null;
  };

  // Fonction pour rechercher les villes françaises
  const searchFrenchCities = async (codePostal: string) => {
    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}&fields=nom,codesPostaux`);
      if (response.ok) {
        const communes = await response.json();
        return communes.map((commune: any) => ({
          nom: commune.nom.toUpperCase(),
          codePostal: codePostal
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la recherche de villes françaises:', error);
      return [];
    }
  };

  // Fonction pour rechercher les villes belges
  const searchBelgianCities = async (codePostal: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/be/${codePostal}`);
      if (response.ok) {
        const data = await response.json();
        // L'API zippopotam retourne les villes dans un format différent
        return data.places.map((place: any) => ({
          nom: place['place name'].toUpperCase(),
          codePostal: codePostal
        }));
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la recherche de villes belges:', error);
      return [];
    }
  };

  // Fonction pour rechercher les villes par code postal avec détection de pays
  const searchVillesByCodePostal = async (codePostal: string) => {
    if (codePostal.length < 4) {
      setVilleSuggestions([]);
      setShowVilleSuggestions(false);
      // Reset pays si code postal trop court
      setFormData(prev => ({
        ...prev,
        pays: ''
      }));
      return;
    }

    const detectedCountry = detectCountryFromPostalCode(codePostal);
    if (!detectedCountry) {
      setVilleSuggestions([]);
      setShowVilleSuggestions(false);
      // Reset pays si format non reconnu
      setFormData(prev => ({
        ...prev,
        pays: ''
      }));
      return;
    }

    setIsLoadingVilles(true);
    
    // Auto-remplir le pays
    setFormData(prev => ({
      ...prev,
      pays: detectedCountry
    }));

    let villes = [];
    
    try {
      if (detectedCountry === 'FRANCE') {
        villes = await searchFrenchCities(codePostal);
      } else if (detectedCountry === 'BELGIQUE') {
        villes = await searchBelgianCities(codePostal);
      }

      setVilleSuggestions(villes);
      
      if (villes.length === 1) {
        // Une seule ville trouvée, auto-complétion
        setFormData(prev => ({
          ...prev,
          ville: villes[0].nom
        }));
        setShowVilleSuggestions(false);
      } else if (villes.length > 1) {
        // Plusieurs villes, afficher les suggestions
        setShowVilleSuggestions(true);
      } else {
        // Aucune ville trouvée
        setShowVilleSuggestions(false);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error);
      setVilleSuggestions([]);
      setShowVilleSuggestions(false);
    }
    
    setIsLoadingVilles(false);
  };

  // Fonction pour rechercher les villes par code postal pour l'adresse de facturation
  const searchFacturationVillesByCodePostal = async (codePostal: string) => {
    if (codePostal.length < 4) return;

    const detectedCountry = detectCountryFromPostalCode(codePostal);
    if (!detectedCountry) return;

    // Auto-remplir le pays de facturation
    setFormData(prev => ({
      ...prev,
      facturationPays: detectedCountry
    }));

    try {
      let villes = [];
      
      if (detectedCountry === 'FRANCE') {
        villes = await searchFrenchCities(codePostal);
      } else if (detectedCountry === 'BELGIQUE') {
        villes = await searchBelgianCities(codePostal);
      }

      if (villes.length === 1) {
        // Une seule ville trouvée, auto-complétion
        setFormData(prev => ({
          ...prev,
          facturationVille: villes[0].nom
        }));
      }
      // Pour la facturation, on ne propose pas de dropdown multiples pour simplifier
    } catch (error) {
      console.error('Erreur lors de la recherche de villes de facturation:', error);
    }
  };

  // Handlers
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler spécialisé pour le Siret
  const handleSiretChange = (value: string) => {
    const formattedSiret = formatSiret(value);
    setFormData(prev => ({
      ...prev,
      siret: formattedSiret
    }));
  };

  // Handler spécialisé pour la TVA Intercommunautaire
  const handleTvaIntraChange = (value: string) => {
    const formattedTva = formatTvaIntra(value);
    setFormData(prev => ({
      ...prev,
      tvaIntra: formattedTva
    }));
  };

  // Handler spécialisé pour les numéros de téléphone
  const handlePhoneChange = (field: string, value: string) => {
    const formattedPhone = formatPhone(value);
    setFormData(prev => ({
      ...prev,
      [field]: formattedPhone
    }));
  };

  const handleActiviteChange = (activite: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      activites: {
        ...prev.activites,
        [activite]: checked
      }
    }));
  };

  const handleVilleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.toUpperCase()
    }));
  };

  // Fonction pour gérer le pays en majuscules
  const handlePaysChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.toUpperCase()
    }));
  };

  // Fonction pour gérer le code postal avec auto-complétion
  const handleCodePostalChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Réinitialiser la ville si le code postal change
    if (field === 'codePostal') {
      setFormData(prev => ({
        ...prev,
        ville: ''
      }));
      searchVillesByCodePostal(value);
    } else if (field === 'facturationCP') {
      setFormData(prev => ({
        ...prev,
        facturationVille: '',
        facturationPays: ''
      }));
      searchFacturationVillesByCodePostal(value);
    }
  };

  // Fonction pour sélectionner une ville dans les suggestions
  const selectVille = (villeName: string) => {
    setFormData(prev => ({
      ...prev,
      ville: villeName
    }));
    setShowVilleSuggestions(false);
    setVilleSuggestions([]);
  };

  const handleEnseigneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      enseigne: value.toUpperCase()
    }));
  };

  const handleReservationChange = (field: string, value: any) => {
    setReservationData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'exteriorSurface') {
        const sanitized = typeof value === 'string' ? value.replace(/[^\d]/g, '') : '';
        newData.exteriorSurface = sanitized;
      }

      // Gérer le garden cottage selon les règles métier
      if (field === 'standType') {
        if (value) {
          // Si on sélectionne un stand intérieur, décocher garden cottage
          newData.gardenCottage = false;
        } else {
          // Si on désélectionne un stand intérieur et qu'on a un espace extérieur, cocher garden cottage
          if (prev.exteriorSpace) {
            newData.gardenCottage = true;
          }
        }
        // Reset stand size et angles lors du changement de type
        newData.standSize = '';
        newData.standAngles = 0;
      }
      
      // Décocher garden cottage si une surface de stand est choisie et qu'un type est déjà sélectionné
      if (field === 'standSize' && value && prev.standType) {
        newData.gardenCottage = false;
      }
      
      // Auto-check garden cottage si surface extérieure sans stand intérieur
      if (field === 'exteriorSpace' && value === true && !prev.standType) {
        newData.gardenCottage = true;
      }
      
      // Décocher garden cottage si on décoche l'espace extérieur
      if (field === 'exteriorSpace' && value === false) {
        newData.gardenCottage = false;
      }

      if (field === 'exteriorSpace' && value === true) {
        newData.exteriorSurface = prev.exteriorSurface || '1';
      }

      if (field === 'exteriorSpace' && value === false) {
        newData.exteriorSurface = '';
      }
      
      // Reset co-exposants si la surface devient < 12m²
      if ((field === 'standType' || field === 'standSize') && newData.standType && newData.standSize) {
        const size = parseInt(newData.standSize) || 0;
        if (size < 12) {
          newData.coExposants = [];
        }
      }
      
      return newData;
    });
  };

  // Fonctions pour gérer les co-exposants
  const addCoExposant = () => {
    const newCoExposant: CoExposant = {
      id: Date.now().toString(),
      nomEntreprise: '',
      nomResponsable: '',
      prenomResponsable: '',
      telResponsable: '',
      mailResponsable: ''
    };
    
    setReservationData(prev => ({
      ...prev,
      coExposants: [...prev.coExposants, newCoExposant]
    }));
  };

  const removeCoExposant = (id: string) => {
    setReservationData(prev => ({
      ...prev,
      coExposants: prev.coExposants.filter(coExp => coExp.id !== id)
    }));
  };

  const updateCoExposant = (id: string, field: keyof CoExposant, value: string) => {
    setReservationData(prev => ({
      ...prev,
      coExposants: prev.coExposants.map(coExp => 
        coExp.id === id ? { ...coExp, [field]: value } : coExp
      )
    }));
  };

  const handleAmenagementChange = (field: string, value: any) => {
    setAmenagementData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVisibiliteChange = (field: string, value: any) => {
    setVisibiliteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEngagementChange = (field: string, value: any) => {
    setEngagementData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Nouvelles fonctions pour gérer la reprise depuis réservation
  const resetDataFromReservation = () => {
    setReservationData({
      standType: null as StandType,
      standSize: '',
      standAngles: 0,
      electricityUpgrade: 'none' as string,
      exteriorSpace: false,
      exteriorSurface: '',
      gardenCottage: false,
      microStand: false,
      coExposants: []
    });

    setAmenagementData({
      // ÉQUIPEMENTS STANDS
      reservePorteMelamine: 0,
      moquetteDifferente: 0,
      moquetteCouleur: '',
      velumStand: 0,
      cloisonBoisGainee: 0,
      reservePorteBois: 0,
      bandeauSignaletique: 0,
      railSpots: 0,
      
      // MOBILIER
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
      
      // PRODUITS COMPLÉMENTAIRES
      scanBadges: false,
      passSoiree: 0
    });

    setVisibiliteData({
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
      distributionHotesse: false
    });

    setEngagementData({
      modeReglement: 'acompte' as 'acompte' | 'solde' | 'virement',
      accepteReglement: false,
      dateSignature: '',
      cachetSignature: ''
    });
  };

  const loadIdentityData = (identityData: FormData) => {
    setFormData(identityData);
  };

  return {
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData,
    villeSuggestions,
    showVilleSuggestions,
    isLoadingVilles,
    handleInputChange,
    handleSiretChange,
    handleTvaIntraChange,
    handlePhoneChange,
    handleActiviteChange,
    handleVilleChange,
    handlePaysChange,
    handleCodePostalChange,
    selectVille,
    handleEnseigneChange,
    handleReservationChange,
    handleAmenagementChange,
    handleVisibiliteChange,
    handleEngagementChange,
    resetDataFromReservation,
    loadIdentityData,
    addCoExposant,
    removeCoExposant,
    updateCoExposant,
    // Fonctions utilitaires exportées
    isSiretValid,
    isTvaIntraValid,
    isPhoneValid
  };
}