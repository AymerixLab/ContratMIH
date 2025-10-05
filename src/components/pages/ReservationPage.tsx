import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Plus, X } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ReservationData } from "../../lib/types";
import {
  electricityPrices,
  coExpositionPrice,
} from "../../lib/constants";
import { isCoExpositionAvailable } from "../../lib/utils";
import { COLORS } from "../../lib/constants";

// Import des nouvelles images selon les spécifications
import standEquipeImage from "figma:asset/28f2069c512501197478b70ded9fab3bda891d27.png"; // Image 1 = Stand équipé
import pretAExposerImage from "figma:asset/b766f8675214a4f4f217947209ae5cc49050aca7.png"; // Image 2 = Prêt à exposer

interface ReservationPageProps {
  reservationData: ReservationData;
  onReservationChange: (field: string, value: any) => void;
  totalHT1: number;
  onBack: () => void;
  onNext: () => void;
  addCoExposant: () => void;
  removeCoExposant: (id: string) => void;
  updateCoExposant: (
    id: string,
    field: string,
    value: string,
  ) => void;
}

export function ReservationPage({
  reservationData,
  onReservationChange,
  totalHT1,
  onBack,
  onNext,
  addCoExposant,
  removeCoExposant,
  updateCoExposant,
}: ReservationPageProps) {
  // Fonction pour vérifier si on peut procéder à la page suivante
  const canProceedToNext = () => {
    // Doit avoir au moins un stand intérieur sélectionné OU un espace extérieur avec garden cottage
    return reservationData.standType !== null || 
           (reservationData.exteriorSpace && reservationData.gardenCottage);
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      window.scrollTo(0, 0);
      onNext();
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  const isCoExpositionEnabled =
    isCoExpositionAvailable(reservationData);

  // Fonction pour déterminer si le garden cottage doit être disabled
  const isGardenCottageDisabled = () => {
    // Disabled si un stand intérieur est sélectionné (comme avant)
    if (reservationData.standType !== null) {
      return true;
    }
    
    // Disabled si espace extérieur est coché (pour empêcher de le décocher)
    if (reservationData.exteriorSpace) {
      return true;
    }
    
    // Libre dans les autres cas
    return false;
  };

  // Fonction pour obtenir le texte explicatif du garden cottage
  const getGardenCottageLabel = () => {
    if (reservationData.standType !== null) {
      return "Garden cottage (3m x 3m) - 800 € - Incompatible avec stand intérieur";
    }
    
    if (reservationData.exteriorSpace) {
      return "Garden cottage (3m x 3m) - 800 € - Obligatoire avec espace extérieur";
    }
    
    return "Garden cottage (3m x 3m) - 800 € - Location obligatoire si non réservation d'un stand intérieur";
  };

  // Nouvelle fonction pour récupérer les surfaces selon le type de stand
  const getAvailableSizes = (standType: string) => {
    switch (standType) {
      case 'equipped':
        // Stand équipé : 6 à 30 m² par pas de 3m² (6, 9, 12, 15, 18, 21, 24, 27, 30)
        return Array.from({ length: 9 }, (_, i) => (6 + i * 3).toString());
      case 'ready':
        // Pack prêt à exposer : 6 choix fixes (21, 24, 27, 30, 33, 36 m²)
        return ['21', '24', '27', '30', '33', '36'];
      case 'bare':
        // Stand nu : 6 à 30 m² par pas de 3m² (comme équipé)
        return Array.from({ length: 9 }, (_, i) => (6 + i * 3).toString());
      default:
        return [];
    }
  };

  // Fonction pour récupérer le nombre maximum d'angles selon le type
  const getMaxAngles = (standType: string) => {
    if (standType === 'ready') {
      return 4; // Pack prêt à exposer : max 4 angles
    }
    if (standType === 'bare') {
      return 0; // Stand nu : aucun angle ouvert
    }
    return 2; // Stand équipé : max 2 angles
  };

  // Fonction pour calculer le prix du pack prêt à exposer
  const getReadyToExposePrice = (size: string) => {
    const pricePerM2 = 296;
    const sizeNum = parseInt(size);
    if (isNaN(sizeNum)) return 0;
    return sizeNum * pricePerM2;
  };

  // Fonction pour gérer la sélection/désélection des stands
  const handleStandSelection = (type: "equipped" | "ready" | "bare") => {
    if (reservationData.standType === type) {
      // Désélectionner le stand si on clique sur le même
      onReservationChange("standType", null);
      onReservationChange("standSize", "");
      onReservationChange("standAngles", 0);
    } else {
      // Sélectionner le nouveau stand
      onReservationChange("standType", type);
      onReservationChange("standSize", "");
      onReservationChange("standAngles", 0);
    }
  };

  const getStandCard = (
    type: "equipped" | "ready" | "bare",
    title: string,
    price: string,
    features: string[],
    imageSrc?: string,
  ) => {
    const isSelected = reservationData.standType === type;
    
    return (
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden ${
          isSelected
            ? "ring-2 shadow-lg transform scale-[1.02]"
            : "hover:border-gray-300 hover:shadow-md"
        }`}
        style={{
          borderColor: isSelected ? COLORS.secondary : "rgb(229, 231, 235)",
          borderWidth: "2px",
          borderRadius: "12px",
          ringColor: isSelected ? COLORS.secondary : undefined,
        }}
        onClick={() => handleStandSelection(type)}
      >
        <CardHeader
          className="text-center transition-all duration-300"
          style={{
            backgroundColor: isSelected ? COLORS.secondary : "#f8f9fa",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <CardTitle
            className={`font-[Poppins] transition-colors duration-300 ${
              isSelected ? "text-white" : "text-gray-800"
            }`}
          >
            {title}
          </CardTitle>
          <p
            className={`text-sm transition-colors duration-300 ${
              isSelected ? "text-white opacity-90" : "text-gray-600"
            }`}
          >
            {price}
          </p>
        </CardHeader>
        <CardContent className="p-4">
          {imageSrc && (
            <div className="w-full h-32 mb-4 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
              <ImageWithFallback
                src={imageSrc}
                alt={title}
                width={120}
                height={100}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          )}
          <ul className="space-y-1 text-sm text-gray-600 font-[Poppins]">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start space-x-2"
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: COLORS.secondary }}
                ></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          {isSelected && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-[Poppins] italic text-center">
                Cliquez à nouveau pour désélectionner
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="mb-8 font-[Poppins]" style={{ borderRadius: "12px" }}>
      <CardContent className="p-8">
        {/* Header */}
        <div
          className="text-white p-4 mb-8"
          style={{ 
            backgroundColor: COLORS.primary,
            borderRadius: "8px"
          }}
        >
          <h1 className="text-2xl font-bold">
            1. RÉSERVATION DE L'ESPACE
          </h1>
        </div>

        {/* Stand Selection */}
        <div className="mb-8">
          <h2
            className="text-xl font-semibold mb-6 font-[Poppins]"
            style={{ color: COLORS.primary }}
          >
            Choisissez votre type de stand
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {getStandCard(
              "equipped",
              "STAND ÉQUIPÉ",
              "270 € / m² HT",
              [
                "Cloisons mélaminées - hauteur 2,50m",
                "Moquette coloris unique",
                "1 enseigne drapeau",
                "1 rail de 3 spots / 9 m²",
                "1 coffret électrique 1kW (pour tout besoin de puissance supérieure, voir plus bas au champ \"puissance électrique supérieure\")"
              ],
              standEquipeImage,
            )}

            {getStandCard(
              "ready",
              "Pack \"PRÊT À EXPOSER\"",
              "296 € / m² HT",
              [
                "Cloisons mélaminées - hauteur 2,50m",
                "Moquette coloris unique",
                "1 enseigne drapeau",
                "1 enseigne haute surélevée",
                "1 rail de 3 spots / 9 m²",
                "1 coffret électrique 1kW (pour tout besoin de puissance supérieure, voir plus bas au champ \"puissance électrique supérieure\")"
              ],
              pretAExposerImage,
            )}

            {getStandCard("bare", "STAND NU", "225 € / m² HT", [
              "Moquette coloris unique",
              "1 coffret électrique 1kW / 9m² (pour tout besoin de puissance supérieure, voir plus bas au champ \"puissance électrique supérieure\")"
            ])}
          </div>
        </div>

        {/* Stand Size Selection */}
        {reservationData.standType && (
          <Card
            className="mb-6"
            style={{ 
              borderColor: COLORS.secondary,
              borderWidth: "2px",
              borderRadius: "12px"
            }}
          >
            <CardHeader
              style={{ 
                backgroundColor: COLORS.secondary,
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px"
              }}
            >
              <CardTitle className="text-white font-[Poppins]">
                SURFACE ET OPTIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-[Poppins] font-medium">
                    Surface du stand (m²)
                    {reservationData.standType === 'equipped' && " - De 6 à 30 m² (par pas de 3m²)"}
                    {reservationData.standType === 'ready' && " - 6 choix disponibles (21 à 36 m²)"}
                    {reservationData.standType === 'bare' && " - De 6 à 30 m² (par pas de 3m²)"}
                  </Label>
                  <Select
                    value={reservationData.standSize}
                    onValueChange={(value) =>
                      onReservationChange("standSize", value)
                    }
                  >
                    <SelectTrigger 
                      className="mt-1 border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: "8px" }}
                    >
                      <SelectValue placeholder="Sélectionnez la surface" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSizes(reservationData.standType).map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} m²
                          {reservationData.standType === 'ready' && ` - ${getReadyToExposePrice(size)} € HT`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-[Poppins] font-medium">
                    Nombre d'angles ouverts (max {getMaxAngles(reservationData.standType)}) * sous réserve de disponibilité
                  </Label>
                  <Select
                    value={reservationData.standAngles.toString()}
                    onValueChange={(value) =>
                      onReservationChange(
                        "standAngles",
                        parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger 
                      className="mt-1 border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: "8px" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        0 angle - 0 €
                      </SelectItem>
                      <SelectItem value="1">
                        1 angle - 185 €
                      </SelectItem>
                      <SelectItem value="2">
                        2 angles - 370 €
                      </SelectItem>
                      {reservationData.standType === 'ready' && (
                        <>
                          <SelectItem value="3">
                            3 angles - 555 €
                          </SelectItem>
                          <SelectItem value="4">
                            4 angles - 740 €
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label className="font-[Poppins] font-medium">
                    Puissance électrique supérieure
                  </Label>
                  <Select
                    value={reservationData.electricityUpgrade}
                    onValueChange={(value) =>
                      onReservationChange(
                        "electricityUpgrade",
                        value,
                      )
                    }
                  >
                    <SelectTrigger 
                      className="mt-1 border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: "8px" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        Standard inclus (1kW)
                      </SelectItem>
                      {Object.entries(electricityPrices).map(
                        ([key, price]) => (
                          <SelectItem key={key} value={key}>
                            {key.toUpperCase()} - {price} €
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Co-exposition Section */}
        {reservationData.standType &&
          reservationData.standSize && (
            <Card
              className="mb-6"
              style={{ 
                borderColor: COLORS.primary,
                borderWidth: "2px",
                borderRadius: "12px"
              }}
            >
              <CardHeader
                style={{ 
                  backgroundColor: COLORS.primary,
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px"
                }}
              >
                <CardTitle className="text-white font-[Poppins]">
                  CO-EXPOSITION
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-[Poppins] mb-4">
                    {isCoExpositionEnabled
                      ? `La co-exposition est disponible pour votre stand de ${reservationData.standSize} m². Chaque co-exposant coûte ${coExpositionPrice} €.`
                      : `La co-exposition n'est disponible qu'à partir de 12 m² (inclus). Votre stand actuel fait ${reservationData.standSize} m².`}
                  </p>

                  {isCoExpositionEnabled && (
                    <Button
                      type="button"
                      onClick={addCoExposant}
                      className="mb-4 text-white"
                      style={{
                        backgroundColor: COLORS.secondary,
                        borderRadius: "8px"
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un co-exposant
                    </Button>
                  )}
                </div>

                {reservationData.coExposants.map(
                  (coExposant, index) => (
                    <Card
                      key={coExposant.id}
                      className="mb-4"
                      style={{ 
                        borderColor: COLORS.secondary,
                        borderWidth: "2px",
                        borderRadius: "12px"
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle
                            className="text-lg font-[Poppins]"
                            style={{ color: COLORS.primary }}
                          >
                            Co-exposant #{index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeCoExposant(coExposant.id)
                            }
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            style={{ borderRadius: "8px" }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-[Poppins] font-medium">
                              Nom de l'entreprise
                            </Label>
                            <Input
                              value={coExposant.nomEntreprise}
                              onChange={(e) =>
                                updateCoExposant(
                                  coExposant.id,
                                  "nomEntreprise",
                                  e.target.value,
                                )
                              }
                              className="mt-1 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                              style={{ borderRadius: "8px" }}
                            />
                          </div>

                          <div>
                            <Label className="font-[Poppins] font-medium">
                              Nom du responsable
                            </Label>
                            <Input
                              value={coExposant.nomResponsable}
                              onChange={(e) =>
                                updateCoExposant(
                                  coExposant.id,
                                  "nomResponsable",
                                  e.target.value,
                                )
                              }
                              className="mt-1 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                              style={{ borderRadius: "8px" }}
                            />
                          </div>

                          <div>
                            <Label className="font-[Poppins] font-medium">
                              Prénom du responsable
                            </Label>
                            <Input
                              value={
                                coExposant.prenomResponsable
                              }
                              onChange={(e) =>
                                updateCoExposant(
                                  coExposant.id,
                                  "prenomResponsable",
                                  e.target.value,
                                )
                              }
                              className="mt-1 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                              style={{ borderRadius: "8px" }}
                            />
                          </div>

                          <div>
                            <Label className="font-[Poppins] font-medium">
                              Téléphone direct
                            </Label>
                            <Input
                              value={coExposant.telResponsable}
                              onChange={(e) =>
                                updateCoExposant(
                                  coExposant.id,
                                  "telResponsable",
                                  e.target.value,
                                )
                              }
                              className="mt-1 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                              style={{ borderRadius: "8px" }}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label className="font-[Poppins] font-medium">
                              Email du responsable
                            </Label>
                            <Input
                              type="email"
                              value={coExposant.mailResponsable}
                              onChange={(e) =>
                                updateCoExposant(
                                  coExposant.id,
                                  "mailResponsable",
                                  e.target.value,
                                )
                              }
                              className="mt-1 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                              style={{ borderRadius: "8px" }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}

                {reservationData.coExposants.length > 0 && (
                  <div
                    className="mt-4 p-3"
                    style={{
                      backgroundColor: "#f0f9ff",
                      borderColor: COLORS.secondary,
                      border: "1px solid",
                      borderRadius: "8px"
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: COLORS.primary }}
                    >
                      Total co-exposition :{" "}
                      {reservationData.coExposants.length} x{" "}
                      {coExpositionPrice} € ={" "}
                      {reservationData.coExposants.length *
                        coExpositionPrice}{" "}
                      €
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        {/* Espace d'exposition extérieur */}
        <Card
          className="mb-6"
          style={{ 
            borderColor: COLORS.secondary,
            borderWidth: "2px",
            borderRadius: "12px"
          }}
        >
          <CardHeader
            style={{ 
              backgroundColor: COLORS.secondary,
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px"
            }}
          >
            <CardTitle className="text-white font-[Poppins]">
              ESPACE D'EXPOSITION EXTÉRIEUR (selon disponibilités)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200" style={{ borderRadius: "8px" }}>
              <p className="text-sm text-blue-800 font-[Poppins]">
                Pour les produits et démonstrations de taille importante, l'organisation offre un espace d'exposition en extérieur, situé entre l'entrée du salon et le hall d'exposition. L'acheminement et l'installation se font aux frais de l'exposant. Branchement électrique non inclus.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exteriorSpace"
                  checked={reservationData.exteriorSpace}
                  onCheckedChange={(checked) =>
                    onReservationChange(
                      "exteriorSpace",
                      checked,
                    )
                  }
                  className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                />
                <Label
                  htmlFor="exteriorSpace"
                  className="font-[Poppins]"
                >
                  Mise à disposition de la surface au sol, nue (50 € / m²)
                </Label>
              </div>

              {reservationData.exteriorSpace && (
                <div>
                  <Label className="font-[Poppins] font-medium">
                    Surface extérieure (m²) - Maximum 80 m²
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="80"
                    value={reservationData.exteriorSpaceSize}
                    onChange={(e) =>
                      onReservationChange(
                        "exteriorSpaceSize",
                        e.target.value,
                      )
                    }
                    className="mt-1 w-32 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gardenCottage"
                  checked={reservationData.gardenCottage}
                  onCheckedChange={(checked) =>
                    onReservationChange(
                      "gardenCottage",
                      checked,
                    )
                  }
                  disabled={isGardenCottageDisabled()}
                  className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                />
                <Label
                  htmlFor="gardenCottage"
                  className="font-[Poppins]"
                >
                  {getGardenCottageLabel()}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offre Micro-Stand */}
        <Card 
          className="mb-8"
          style={{ 
            borderColor: "#FFA500",
            borderWidth: "3px",
            borderRadius: "12px",
            backgroundColor: "#FFFBF0"
          }}
        >
          <CardHeader
            style={{ 
              backgroundColor: "#FFA500",
              borderTopLeftRadius: "9px",
              borderTopRightRadius: "9px"
            }}
          >
            <CardTitle className="text-white font-[Poppins] text-center">
              OFFRE MICRO-STAND ÉQUIPÉ DE 4M²
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-800 font-[Poppins] font-medium text-center">
                Offre réservée aux sociétés répondant à au moins 2 des critères suivants :
              </p>
              
              <ul className="space-y-2 text-sm text-gray-700 font-[Poppins] bg-white p-4 rounded-lg border border-orange-200">
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-orange-500"></span>
                  <span>Société constituée depuis le 01/01/2024</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-orange-500"></span>
                  <span>De moins de 10 salariés</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-orange-500"></span>
                  <span>Ayant un chiffre d'affaire annuel inférieur à 500 k€</span>
                </li>
              </ul>

              <div 
                className="text-center p-4 rounded-lg"
                style={{ 
                  backgroundColor: "#FFF3E0",
                  border: "2px solid #FFA500"
                }}
              >
                <p className="font-[Poppins] font-semibold text-orange-800 mb-2">
                  Conditions sur demande
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-orange-700 font-[Poppins]">
                    📞 <strong>0 800 059 135</strong>
                  </p>
                  <p className="text-sm text-orange-700 font-[Poppins]">
                    ✉️ <strong>mih@agence-porteduhainaut.fr</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Totaux */}
        <div
          className="p-6 mb-8 text-center"
          style={{ 
            backgroundColor: COLORS.primary, 
            color: 'white',
            borderRadius: "12px"
          }}
        >
          <h2 className="text-xl font-bold font-[Poppins]">
            TOTAL HT 1 : {totalHT1.toLocaleString('fr-FR')} €
          </h2>
          <p className="text-sm opacity-90">Réservation d'espace</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            className="px-8 py-3 font-[Poppins]"
            style={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              borderRadius: "8px"
            }}
            onClick={handleBack}
          >
            Retour
          </Button>
          <Button
            size="lg"
            className={`text-white px-12 py-3 font-[Poppins] font-semibold transition-colors duration-200 ${
              !canProceedToNext() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ 
              backgroundColor: canProceedToNext() ? COLORS.secondary : '#gray',
              borderRadius: "8px"
            }}
            onClick={handleNext}
            disabled={!canProceedToNext()}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}