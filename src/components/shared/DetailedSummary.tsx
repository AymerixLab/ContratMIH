import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { COLORS, amenagementPrices, visibilitePrices, standPrices, readyToExposePrices, anglePrice, electricityPrices, coExpositionPrice, gardenCottagePrice, exteriorSpacePrice, getPassSoireeInclus } from '../../lib/constants';
import { FormData, ReservationData, AmenagementData, VisibiliteData } from '../../lib/types';

interface DetailedSummaryProps {
  formData: FormData;
  reservationData: ReservationData;
  amenagementData: AmenagementData;
  visibiliteData: VisibiliteData;
}

export function DetailedSummary({
  formData,
  reservationData,
  amenagementData,
  visibiliteData
}: DetailedSummaryProps) {

  // Fonction helper pour afficher le type de stand
  const getStandTypeLabel = (type: string) => {
    switch (type) {
      case 'equipped': return 'Stand Équipé';
      case 'ready': return 'Pack "Prêt à Exposer"';
      case 'bare': return 'Stand Nu';
      default: return '';
    }
  };

  // Fonction helper pour calculer le prix du stand
  const getStandPrice = () => {
    if (!reservationData.standType || !reservationData.standSize) return 0;
    
    if (reservationData.standType === 'ready') {
      return readyToExposePrices[reservationData.standSize] || 0;
    } else {
      const pricePerM2 = standPrices[reservationData.standType as keyof typeof standPrices] || 0;
      return pricePerM2 * parseInt(reservationData.standSize);
    }
  };

  // Fonction helper pour récupérer les aménagements sélectionnés
  const getSelectedAmenagements = () => {
    const amenagements: Array<{
      name: string;
      quantity?: number;
      price: number;
      total: number;
      unit?: string;
    }> = [];

    const complementaires: Array<{
      name: string;
      quantity?: number;
      price: number;
      total: number;
    }> = [];
    
    // Équipements stands
    if (amenagementData.reservePorteMelamine > 0) {
      amenagements.push({
        name: 'Réserve d\'1m² avec porte (cloisons mélaminées)',
        quantity: amenagementData.reservePorteMelamine,
        price: amenagementPrices.reservePorteMelamine,
        total: amenagementData.reservePorteMelamine * amenagementPrices.reservePorteMelamine
      });
    }
    
    if (amenagementData.reservePorteBois > 0) {
      amenagements.push({
        name: 'Réserve d\'1m² avec porte (cloisons bois)',
        quantity: amenagementData.reservePorteBois,
        price: amenagementPrices.reservePorteBois,
        total: amenagementData.reservePorteBois * amenagementPrices.reservePorteBois
      });
    }
    
    if (amenagementData.moquetteDifferente > 0) {
      amenagements.push({
        name: `Moquette coloris différent (${amenagementData.moquetteCouleur || 'couleur non spécifiée'})`,
        quantity: amenagementData.moquetteDifferente,
        price: amenagementPrices.moquetteDifferente,
        total: amenagementData.moquetteDifferente * amenagementPrices.moquetteDifferente,
        unit: 'm²'
      });
    }
    
    if (amenagementData.velumStand > 0) {
      amenagements.push({
        name: 'Velum (tissu tendu)',
        quantity: amenagementData.velumStand,
        price: amenagementPrices.velumStand,
        total: amenagementData.velumStand * amenagementPrices.velumStand,
        unit: 'm²'
      });
    }
    
    if (amenagementData.cloisonBoisGainee > 0) {
      amenagements.push({
        name: 'Cloison bois gainée tissu',
        quantity: amenagementData.cloisonBoisGainee,
        price: amenagementPrices.cloisonBoisGainee,
        total: amenagementData.cloisonBoisGainee * amenagementPrices.cloisonBoisGainee,
        unit: 'ml'
      });
    }
    
    if (amenagementData.bandeauSignaletique > 0) {
      amenagements.push({
        name: 'Bandeau signalétique',
        quantity: amenagementData.bandeauSignaletique,
        price: amenagementPrices.bandeauSignaletique,
        total: amenagementData.bandeauSignaletique * amenagementPrices.bandeauSignaletique,
        unit: 'ml'
      });
    }

    if (amenagementData.railSpots > 0) {
      amenagements.push({
        name: 'Rail de 3 spots supplémentaires',
        quantity: amenagementData.railSpots,
        price: amenagementPrices.railSpots,
        total: amenagementData.railSpots * amenagementPrices.railSpots
      });
    }

    // Mobilier
    const mobilierItems = [
      { field: 'comptoir', name: 'Comptoir' },
      { field: 'tabouret', name: 'Tabouret' },
      { field: 'mangeDebout', name: 'Mange-debout' },
      { field: 'chaise', name: 'Chaise' },
      { field: 'table120x60', name: 'Table 120 x 60 cm' },
      { field: 'mange3Tabourets', name: 'Mange-debout + 3 tabourets' },
      { field: 'ecran52', name: 'Écran 52 pouces sur pied' },
      { field: 'refrigerateur140', name: 'Réfrigérateur 140 L' },
      { field: 'refrigerateur240', name: 'Réfrigérateur 260 L' },
      { field: 'presentoirA4', name: 'Présentoir pour document A4' },
      { field: 'blocPrises', name: 'Bloc de 3 prises' },
      { field: 'fauteuil', name: 'Fauteuil' },
      { field: 'tableBasse', name: 'Table basse ronde' },
      { field: 'gueridonHaut', name: 'Guéridon haut' },
      { field: 'colonneVitrine', name: 'Colonne vitrine' },
      { field: 'comptoirVitrine', name: 'Comptoir vitrine' },
      { field: 'porteManteux', name: 'Porte-manteaux sur pied' },
      { field: 'planteBambou', name: 'Plante bambou' },
      { field: 'planteKentia', name: 'Plante kentia' }
    ];

    mobilierItems.forEach(item => {
      const quantity = amenagementData[item.field as keyof AmenagementData] as number;
      if (quantity > 0) {
        const price = amenagementPrices[item.field as keyof typeof amenagementPrices];
        amenagements.push({
          name: item.name,
          quantity,
          price,
          total: quantity * price
        });
      }
    });

    // Pouf cube avec couleur
    if (amenagementData.poufCube > 0) {
      amenagements.push({
        name: `Pouf cube (${amenagementData.poufCouleur || 'couleur non spécifiée'})`,
        quantity: amenagementData.poufCube,
        price: amenagementPrices.poufCube,
        total: amenagementData.poufCube * amenagementPrices.poufCube
      });
    }

    // Produits complémentaires
    if (amenagementData.scanBadges) {
      complementaires.push({
        name: 'Scan badges visiteurs',
        quantity: 1,
        price: amenagementPrices.scanBadges,
        total: amenagementPrices.scanBadges
      });
    }

    if (amenagementData.passSoiree > 0) {
      complementaires.push({
        name: 'Pass soirée complémentaire',
        quantity: amenagementData.passSoiree,
        price: amenagementPrices.passSoiree,
        total: amenagementData.passSoiree * amenagementPrices.passSoiree
      });
    }

    return { amenagements, complementaires };
  };

  // Fonction helper pour récupérer les options de visibilité sélectionnées
  const getSelectedVisibilite = () => {
    const selected = [];
    const standSurface = reservationData.standSize ? parseInt(reservationData.standSize, 10) || 0 : 0;

    if (visibiliteData.packSignaletiqueComplet) {
      const total = standSurface > 0
        ? standSurface * visibilitePrices.packSignaletiqueComplet
        : visibilitePrices.packSignaletiqueComplet;

      selected.push({
        name: standSurface > 0
          ? `Pack signalétique complet (${standSurface} m² × ${visibilitePrices.packSignaletiqueComplet} €)`
          : 'Pack signalétique complet (125 € / m²)',
        price: total
      });
    }

    if (visibiliteData.signaletiqueComptoir) {
      selected.push({
        name: 'Signalétique comptoir',
        price: visibilitePrices.signaletiqueComptoir
      });
    }

    if (visibiliteData.signaletiqueHautCloisons) {
      const total = standSurface > 0
        ? standSurface * visibilitePrices.signaletiqueHautCloisons
        : visibilitePrices.signaletiqueHautCloisons;

      selected.push({
        name: standSurface > 0
          ? `Signalétique haut de cloisons (${standSurface} m² × ${visibilitePrices.signaletiqueHautCloisons} €)`
          : 'Signalétique haut de cloisons (50 € / m²)',
        price: total
      });
    }

    if (visibiliteData.signalethqueCloisons > 0) {
      const quantity = visibiliteData.signalethqueCloisons;
      const price = quantity * visibilitePrices.signalethqueCloisons;
      selected.push({
        name: `Signalétique cloison complète (${quantity} cloison${quantity > 1 ? 's' : ''} × ${visibilitePrices.signalethqueCloisons} €)`,
        price
      });
    }

    if (visibiliteData.signaletiqueEnseigneHaute) {
      selected.push({
        name: 'Signalétique enseigne haute',
        price: visibilitePrices.signaletiqueEnseigneHaute
      });
    }

    if (visibiliteData.demiPageCatalogue) {
      selected.push({
        name: '1/2 page quadri dans le catalogue des exposants',
        price: visibilitePrices.demiPageCatalogue
      });
    }

    if (visibiliteData.pageCompleeteCatalogue) {
      selected.push({
        name: '1 page quadri dans le catalogue des exposants',
        price: visibilitePrices.pageCompleeteCatalogue
      });
    }

    if (visibiliteData.deuxiemeCouverture) {
      selected.push({
        name: 'Deuxième de couverture dans le catalogue',
        price: visibilitePrices.deuxiemeCouverture
      });
    }

    if (visibiliteData.quatriemeCouverture) {
      selected.push({
        name: 'Quatrième de couverture dans le catalogue',
        price: visibilitePrices.quatriemeCouverture
      });
    }

    if (visibiliteData.logoplanSalon) {
      selected.push({
        name: 'Logo sur le plan du salon',
        price: visibilitePrices.logoplanSalon
      });
    }

    if (visibiliteData.documentationSacVisiteur) {
      selected.push({
        name: 'Documentation dans le sac visiteur (3 000 sacs – 4 entreprises maximum)',
        price: visibilitePrices.documentationSacVisiteur
      });
    }

    if (visibiliteData.distributionHotesse) {
      selected.push({
        name: 'Distribution par hôtesse (2 jours à 700 €/jour = 1 400 €)',
        price: visibilitePrices.distributionHotesse
      });
    }

    return selected;
  };

  const { amenagements: selectedAmenagements, complementaires: selectedComplementaires } = getSelectedAmenagements();
  const selectedVisibilite = getSelectedVisibilite();
  const standPrice = getStandPrice();
  const exteriorSurface = Math.min(
    Math.max(parseInt(reservationData.exteriorSurface || '0', 10) || 0, 0),
    80
  );
  const exteriorSpaceCost = reservationData.exteriorSpace ? exteriorSurface * exteriorSpacePrice : 0;

  return (
    <Card className="mb-6" style={{ borderColor: COLORS.primary, borderWidth: "2px", borderRadius: "12px" }}>
      <CardHeader style={{ backgroundColor: COLORS.primary, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
        <CardTitle className="text-white font-[Poppins]">
          📋 RÉCAPITULATIF DÉTAILLÉ DE VOTRE SÉLECTION
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          
          {/* INFORMATIONS ENTREPRISE */}
          <div>
            <h4 className="font-semibold text-lg mb-3 font-[Poppins]" style={{ color: COLORS.primary }}>
              🏢 Informations Entreprise
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Raison sociale :</span>
                <p className="text-gray-700">{formData.raisonSociale}</p>
              </div>
              <div>
                <span className="font-medium">Enseigne :</span>
                <p className="text-gray-700">{formData.enseigne}</p>
              </div>
              <div>
                <span className="font-medium">Secteur d'activité :</span>
                <p className="text-gray-700">{formData.activite}</p>
              </div>
              <div>
                <span className="font-medium">Responsable :</span>
                <p className="text-gray-700">{formData.responsablePrenom} {formData.responsableNom}</p>
              </div>
            </div>
          </div>

          {/* RÉSERVATION D'ESPACE */}
          <div>
            <h4 className="font-semibold text-lg mb-3 font-[Poppins]" style={{ color: COLORS.secondary }}>
              🏗️ Réservation d'Espace
            </h4>
            
            {reservationData.standType && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{getStandTypeLabel(reservationData.standType)}</span>
                  <Badge variant="secondary" style={{ backgroundColor: COLORS.secondary }}>
                    {reservationData.standSize} m²
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Prix de base :</span>
                    <span>{standPrice.toLocaleString('fr-FR')} €</span>
                  </div>
                  
                  {reservationData.standAngles > 0 && (
                    <div className="flex justify-between">
                      <span>Angles ouverts ({reservationData.standAngles}) :</span>
                      <span>{(reservationData.standAngles * anglePrice).toLocaleString('fr-FR')} €</span>
                    </div>
                  )}
                  
                  {reservationData.electricityUpgrade && reservationData.electricityUpgrade !== 'none' && (
                    <div className="flex justify-between">
                      <span>Électricité supérieure ({reservationData.electricityUpgrade.toUpperCase()}) :</span>
                      <span>{electricityPrices[reservationData.electricityUpgrade as keyof typeof electricityPrices]} €</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {reservationData.coExposants.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h5 className="font-medium mb-2">Co-exposants :</h5>
                <div className="space-y-2 text-sm">
                  {reservationData.coExposants.map((coExposant, index) => (
                    <div key={coExposant.id} className="flex justify-between">
                      <span>{coExposant.nomEntreprise || `Co-exposant ${index + 1}`}</span>
                      <span>{coExpositionPrice} €</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reservationData.exteriorSpace && exteriorSurface > 0 && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Espace d'exposition extérieur</span>
                  <span>
                    {exteriorSurface} m² × {exteriorSpacePrice.toLocaleString('fr-FR')} € = {exteriorSpaceCost.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
            )}

            {reservationData.gardenCottage && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Garden cottage (3m × 3m)</span>
                  <span>{gardenCottagePrice} €</span>
                </div>
              </div>
            )}
          </div>

          {/* AMÉNAGEMENTS */}
          {selectedAmenagements.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 font-[Poppins]" style={{ color: COLORS.primary }}>
                🛋️ Aménagements et Mobilier
              </h4>
              <div className="space-y-2">
                {selectedAmenagements.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.quantity && (
                        <span className="text-gray-500 text-xs ml-2">
                          {item.quantity} {item.unit || 'unité(s)'} × {item.price} €
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">{item.total.toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
              
              {/* Pass soirée inclus */}
              {reservationData.standSize && getPassSoireeInclus(reservationData.standSize) > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pass soirée inclus</span>
                    <Badge variant="outline" style={{ borderColor: COLORS.secondary }}>
                      {getPassSoireeInclus(reservationData.standSize)} gratuit{getPassSoireeInclus(reservationData.standSize) > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedComplementaires.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 font-[Poppins]" style={{ color: COLORS.secondary }}>
                🎟️ Produits complémentaires
              </h4>
              <div className="space-y-2">
                {selectedComplementaires.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.quantity && (
                        <span className="text-gray-500 text-xs ml-2">
                          {item.quantity} unité{item.quantity > 1 ? 's' : ''} × {item.price} €
                        </span>
                      )}
                    </div>
                    <span className="font-semibold">{item.total.toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISIBILITÉ ET COMMUNICATION */}
          {selectedVisibilite.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg mb-3 font-[Poppins]" style={{ color: COLORS.secondary }}>
                📢 Visibilité et Communication
              </h4>
              <div className="space-y-2">
                {selectedVisibilite.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="font-semibold">{item.price.toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message si aucune sélection */}
          {selectedAmenagements.length === 0 && selectedComplementaires.length === 0 && selectedVisibilite.length === 0 && !reservationData.standType && (
            <div className="text-center py-8 text-gray-500">
              <p className="font-[Poppins]">Aucune sélection effectuée pour le moment.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}