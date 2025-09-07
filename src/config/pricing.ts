// Pricing configuration based on MIH 2026 contract
export interface PricingItem {
  id: string
  name: string
  price: number
  unit?: string
  description?: string
  category: string
}

// Stand Types Pricing
export const STAND_PRICING = {
  // Stand Équipé (per m²)
  standEquipe: {
    pricePerM2: 85, // €/m²
    minSize: 6,
    maxSize: 30,
    description: "Stand équipé avec cloisons, moquette, électricité 1kW, éclairage LED, enseigne",
    included: ["Cloisons 2,5m de hauteur", "Moquette grise", "Électricité 1kW", "Éclairage LED", "Enseigne avec nom"]
  },
  
  // Stand Équipé Angle (per m²) 
  standEquipeAngle: {
    pricePerM2: 95, // €/m² (premium for corner location)
    maxQuantity: 2,
    description: "Stand équipé d'angle avec exposition sur deux côtés",
    included: ["Avantages du stand équipé", "Position privilégiée d'angle", "Visibilité accrue"]
  },
  
  // Stand Prêt à Exposer (fixed packages)
  standPretAExposer: {
    pack12: {
      price: 1800,
      size: 12,
      description: "Solution clé en main 12m² avec mobilier et décoration",
      included: ["Stand équipé 12m²", "Mobilier complet", "Décoration", "Installation comprise"]
    },
    pack15: {
      price: 2200,
      size: 15, 
      description: "Solution clé en main 15m² avec mobilier et décoration",
      included: ["Stand équipé 15m²", "Mobilier complet", "Décoration", "Installation comprise"]
    },
    pack18: {
      price: 2600,
      size: 18,
      description: "Solution clé en main 18m² avec mobilier et décoration", 
      included: ["Stand équipé 18m²", "Mobilier complet", "Décoration", "Installation comprise"]
    },
    packAngles: {
      pricePerPack: 300, // Supplément angle
      maxQuantity: 4,
      description: "Supplément pour position d'angle (maximum 4)"
    }
  },
  
  // Stand Nu (per m²)
  standNu: {
    pricePerM2: 45, // €/m²
    minSize: 24,
    maxSize: 80,
    description: "Espace nu sans équipement",
    included: ["Emplacement délimité", "Accès électricité générale"]
  },
  
  // Stand Nu Angle
  standNuAngle: {
    pricePerM2: 55, // €/m²
    description: "Stand nu d'angle avec exposition privilégiée",
    included: ["Avantages du stand nu", "Position d'angle", "Accès facilité"]
  }
}

// Electrical Power Options
export const POWER_PRICING = [
  { value: '0', label: '1 kW de base (inclus)', price: 0 },
  { value: '220', label: '2 kW supplémentaire', price: 220 },
  { value: '260', label: '4 kW supplémentaire', price: 260 },
  { value: '350', label: '6 kW supplémentaire', price: 350 }
]

// Outdoor Space
export const OUTDOOR_PRICING = {
  surfaceExterieur: {
    pricePerM2: 35, // €/m²
    minSize: 50,
    maxSize: 80,
    description: "Espace extérieur pour exposition",
    mandatory: "Garden Cottage obligatoire si pas de stand intérieur"
  },
  cottage: {
    price: 450,
    description: "Garden Cottage pour espace extérieur",
    included: ["Structure couverte", "Installation comprise"]
  }
}

// Equipment Pricing
export const EQUIPMENT_PRICING: PricingItem[] = [
  // Stand Equipment
  { id: 'reserveMelamine', name: 'Réserve 1 m²', price: 180, category: 'equipment', description: 'Espace de stockage fermé' },
  { id: 'velum', name: 'Vélum', price: 45, unit: 'm²', category: 'equipment', description: 'Toile de plafond décorative' },
  { id: 'cloisonBoisTissu', name: 'Cloison bois/tissu', price: 35, unit: 'ml', category: 'equipment', description: 'Cloison décorative' },
  { id: 'reserveBois', name: 'Réserve', price: 220, category: 'equipment', description: 'Espace de stockage en bois' },
  { id: 'railSpots', name: 'Rail de 3 spots supplémentaire', price: 85, category: 'equipment', description: 'Éclairage d\'appoint (max 3)' },
  
  // Furniture
  { id: 'mobilier_comptoir', name: 'Comptoir', price: 120, category: 'furniture', description: 'Comptoir d\'accueil' },
  { id: 'mobilier_tabouret', name: 'Tabouret', price: 25, category: 'furniture', description: 'Tabouret de bar' },
  { id: 'mobilier_mangeDebout', name: 'Mange-debout', price: 45, category: 'furniture', description: 'Table haute' },
  { id: 'mobilier_chaise', name: 'Chaise', price: 18, category: 'furniture', description: 'Chaise standard' },
  { id: 'mobilier_table120', name: 'Table 120cm', price: 55, category: 'furniture', description: 'Table ronde 120cm' },
  { id: 'mobilier_packMangeDebout', name: 'Pack mange-debout + 3 tabourets', price: 135, category: 'furniture', description: 'Ensemble complet (max 4)' },
  { id: 'mobilier_ecran52', name: 'Écran 52"', price: 280, category: 'furniture', description: 'Écran de présentation (max 2)' },
  { id: 'mobilier_frigo140', name: 'Frigo 140L', price: 95, category: 'furniture', description: 'Réfrigérateur 140 litres' },
  { id: 'mobilier_frigo260', name: 'Frigo 260L', price: 125, category: 'furniture', description: 'Réfrigérateur 260 litres' },
  { id: 'mobilier_presentoir', name: 'Présentoir', price: 65, category: 'furniture', description: 'Présentoir produits' },
  { id: 'mobilier_bandeau', name: 'Bandeau', price: 35, category: 'furniture', description: 'Bandeau publicitaire' },
  { id: 'mobilier_blocPrises', name: 'Bloc prises', price: 25, category: 'furniture', description: 'Multiprise sécurisée' },
  { id: 'mobilier_fauteuil', name: 'Fauteuil', price: 45, category: 'furniture', description: 'Fauteuil confort' },
  { id: 'mobilier_tableBasse', name: 'Table basse', price: 35, category: 'furniture', description: 'Table basse salon' },
  { id: 'mobilier_gueridonHaut', name: 'Guéridon haut', price: 40, category: 'furniture', description: 'Table haute ronde' },
  { id: 'mobilier_poufCube', name: 'Pouf cube', price: 28, category: 'furniture', description: 'Assise d\'appoint' },
  { id: 'mobilier_colonneVitrine', name: 'Colonne vitrine', price: 85, category: 'furniture', description: 'Vitrine d\'exposition' },
  { id: 'mobilier_comptoirVitrine', name: 'Comptoir vitrine', price: 180, category: 'furniture', description: 'Comptoir avec vitrine' },
  { id: 'mobilier_porteManteaux', name: 'Porte-manteaux', price: 22, category: 'furniture', description: 'Vestiaire mobile' },
  { id: 'mobilier_planteBambou', name: 'Plante bambou', price: 45, category: 'furniture', description: 'Plante décorative' },
  { id: 'mobilier_planteKentia', name: 'Plante kentia', price: 55, category: 'furniture', description: 'Plante d\'intérieur' }
]

// Additional Products
export const ADDITIONAL_PRODUCTS_PRICING = [
  { id: 'scanBadges', name: 'Scan badges', price: 150, category: 'services', description: 'Service de scan des badges visiteurs' },
  { id: 'passSoiree', name: 'Pass soirée supplémentaire', price: 45, category: 'services', description: 'Invitation soirée de gala' }
]

// Communication Pricing
export const COMMUNICATION_PRICING: PricingItem[] = [
  // Visual Communication
  { id: 'visu_packComplet', name: 'Pack communication complet', price: 450, category: 'communication', description: 'Pack complet signalétique' },
  { id: 'visu_comptoir', name: 'Visuel comptoir', price: 120, category: 'communication', description: 'Habillage comptoir personnalisé' },
  { id: 'visu_hautCloisons', name: 'Visuel haut de cloisons', price: 85, category: 'communication', description: 'Signalétique haute' },
  { id: 'visu_cloisonComplete', name: 'Habillage cloison complète', price: 180, category: 'communication', description: 'Cloison entièrement habillée' },
  { id: 'visu_enseigneHaute', name: 'Enseigne haute', price: 220, category: 'communication', description: 'Enseigne suspendue' },
  
  // Marketing Enhancement
  { id: 'ameli_invitations', name: 'Invitations personnalisées', price: 180, category: 'marketing', description: 'Invitations sur mesure (500 ex)' },
  { id: 'ameli_demiPage', name: 'Publicité 1/2 page', price: 350, category: 'marketing', description: 'Publicité programme 1/2 page' },
  { id: 'ameli_unePage', name: 'Publicité 1 page', price: 650, category: 'marketing', description: 'Publicité programme pleine page' },
  { id: 'ameli_catalogueDemiPage', name: 'Catalogue 1/2 page', price: 280, category: 'marketing', description: 'Présentation catalogue 1/2 page' },
  { id: 'ameli_catalogueUnePage', name: 'Catalogue 1 page', price: 520, category: 'marketing', description: 'Présentation catalogue pleine page' },
  { id: 'ameli_deuxiemeCouverture', name: '2ème de couverture', price: 1200, category: 'marketing', description: 'Emplacement premium catalogue' },
  { id: 'ameli_quatriemeCouverture', name: '4ème de couverture', price: 1500, category: 'marketing', description: 'Emplacement premium catalogue' },
  { id: 'ameli_logoPlan', name: 'Logo sur plan du salon', price: 220, category: 'marketing', description: 'Visibilité plan général' },
  { id: 'ameli_goodies', name: 'Goodies personnalisés', price: 8.5, unit: 'pièce', category: 'marketing', description: 'Objets publicitaires (prix unitaire)' },
  { id: 'ameli_hotesse', name: 'Service hôtesse', price: 280, unit: 'jour', category: 'services', description: 'Hôtesse d\'accueil (par jour)' }
]

// Moquette Colors (no additional cost)
export const MOQUETTE_COLORS = [
  { value: 'gris', label: 'Gris (standard)', price: 0 },
  { value: 'rouge', label: 'Rouge', price: 25, unit: 'm²' },
  { value: 'vert', label: 'Vert', price: 25, unit: 'm²' },
  { value: 'bleu', label: 'Bleu', price: 25, unit: 'm²' },
  { value: 'noir', label: 'Noir', price: 25, unit: 'm²' }
]

// Pass Soirée Inclusions
export const PASS_SOIREE_INCLUSIONS = {
  6: 2,  // 6m² = 2 pass inclus
  9: 3,  // 9m² = 3 pass inclus  
  12: 4, // 12m² = 4 pass inclus
  15: 6, // 15m² = 6 pass inclus
  18: 6, // 18m² = 6 pass inclus
  21: 6, // 21m² = 6 pass inclus
  24: 6, // 24m² = 6 pass inclus
  27: 6, // 27m² = 6 pass inclus
  30: 6  // 30m² = 6 pass inclus
}

// PORTE Member Discount
export const PORTE_MEMBER_DISCOUNT = 0.1 // 10% discount

// TVA Rate
export const TVA_RATE = 0.2 // 20%

// Helper function to get pricing for an item
export function getItemPricing(itemId: string): PricingItem | undefined {
  const allItems = [
    ...EQUIPMENT_PRICING,
    ...ADDITIONAL_PRODUCTS_PRICING,
    ...COMMUNICATION_PRICING
  ]
  return allItems.find(item => item.id === itemId)
}

// Helper function to calculate stand pricing
export function calculateStandPricing(standType: string, size: number, isAngle: boolean = false): number {
  switch (standType) {
    case 'standEquipe':
      return size * (isAngle ? STAND_PRICING.standEquipeAngle.pricePerM2 : STAND_PRICING.standEquipe.pricePerM2)
    case 'standNu':  
      return size * (isAngle ? STAND_PRICING.standNuAngle.pricePerM2 : STAND_PRICING.standNu.pricePerM2)
    case 'pack12':
      return STAND_PRICING.standPretAExposer.pack12.price
    case 'pack15':
      return STAND_PRICING.standPretAExposer.pack15.price
    case 'pack18':
      return STAND_PRICING.standPretAExposer.pack18.price
    default:
      return 0
  }
}

// Helper function to get included pass count
export function getIncludedPassCount(standSize: number): number {
  // Find the appropriate tier
  const sizes = Object.keys(PASS_SOIREE_INCLUSIONS).map(Number).sort((a, b) => a - b)
  for (const size of sizes) {
    if (standSize <= size) {
      return PASS_SOIREE_INCLUSIONS[size as keyof typeof PASS_SOIREE_INCLUSIONS]
    }
  }
  return PASS_SOIREE_INCLUSIONS[30] // Default to max for larger stands
}