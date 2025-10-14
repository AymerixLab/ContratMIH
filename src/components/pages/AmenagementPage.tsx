import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Minus } from 'lucide-react';
import { AmenagementData, ReservationData } from '../../lib/types';
import { COLORS, amenagementPrices, couleursMoquette, couleursPouf } from '../../lib/constants';

interface AmenagementPageProps {
  amenagementData: AmenagementData;
  reservationData?: ReservationData;
  onAmenagementChange: (field: string, value: any) => void;
  totalHT1: number;
  totalHT2: number;
  onBack: () => void;
  onNext: () => void;
}

export function AmenagementPage({
  amenagementData,
  reservationData,
  onAmenagementChange,
  totalHT1,
  totalHT2,
  onBack,
  onNext
}: AmenagementPageProps) {
  const handleNext = () => {
    window.scrollTo(0, 0);
    onNext();
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  // Fonction pour changer la quantité avec boutons +/-
  const updateQuantity = (field: string, delta: number) => {
    const currentValue = amenagementData[field as keyof AmenagementData] as number;
    const newValue = Math.max(0, currentValue + delta);

    onAmenagementChange(field, newValue);
  };

  // Composant pour les champs avec compteur
  const QuantityField = ({ 
    field, 
    label, 
    price, 
    unit = "unité",
    description 
  }: { 
    field: string; 
    label: string; 
    price: number; 
    unit?: string;
    description?: string;
  }) => {
    const value = amenagementData[field as keyof AmenagementData] as number;
    const total = value * price;

    return (
      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: "#e5e7eb", borderRadius: "8px" }}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <Label className="font-[Poppins] font-medium text-gray-800">{label}</Label>
            {description && (
              <p className="text-sm text-gray-600 mt-1 font-[Poppins]">{description}</p>
            )}
            <p className="text-sm font-semibold mt-1" style={{ color: COLORS.primary }}>
              {price}€ / {unit}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(field, -1)}
              disabled={value <= 0}
              className="w-8 h-8 p-0"
              style={{ borderColor: COLORS.secondary, borderRadius: "6px" }}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Input
              type="number"
              min="0"
              value={value}
              onChange={(e) => onAmenagementChange(field, parseInt(e.target.value) || 0)}
              className="w-16 text-center font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
              style={{ borderRadius: "6px" }}
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(field, 1)}
              className="w-8 h-8 p-0"
              style={{ borderColor: COLORS.secondary, borderRadius: "6px" }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
              {total.toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Calcul des pass soirée inclus
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
            2. AMÉNAGEMENTS OPTIONNELS
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Tous les tarifs sont HT
          </p>
        </div>

        {/* ÉQUIPEMENTS STANDS */}
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
              ÉQUIPEMENTS STANDS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <QuantityField
                field="reservePorteMelamine"
                label="Réserve d'1m² avec porte"
                price={amenagementPrices.reservePorteMelamine}
                description="Si cloisons mélaminées"
              />

              <QuantityField
                field="reservePorteBois"
                label="Réserve d'1m² avec porte"
                price={amenagementPrices.reservePorteBois}
                description="Si cloisons bois"
              />

              <QuantityField
                field="velumStand"
                label="Velum"
                price={amenagementPrices.velumStand}
                unit="m²"
                description="Tissu tendu sur le dessus de votre stand"
              />

              <QuantityField
                field="cloisonBoisGainee"
                label="Cloison bois gainée tissu"
                price={amenagementPrices.cloisonBoisGainee}
                unit="ml"
              />

              <QuantityField
                field="bandeauSignaletique"
                label="Bandeau signalétique"
                price={amenagementPrices.bandeauSignaletique}
                unit="ml"
                description="Pourtour stand"
              />

              <QuantityField
                field="railSpots"
                label="Rail de 3 spots supplémentaires"
                price={amenagementPrices.railSpots}
              />

              {/* Moquette avec sélecteur de couleur */}
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: "#e5e7eb", borderRadius: "8px" }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium text-gray-800">Moquette coloris différent</Label>
                    <p className="text-sm font-semibold mt-1" style={{ color: COLORS.primary }}>
                      {amenagementPrices.moquetteDifferente}€ / m²
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity('moquetteDifferente', -1)}
                      disabled={amenagementData.moquetteDifferente <= 0}
                      className="w-8 h-8 p-0"
                      style={{ borderColor: COLORS.secondary, borderRadius: "6px" }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="0"
                      value={amenagementData.moquetteDifferente}
                      onChange={(e) => onAmenagementChange('moquetteDifferente', parseInt(e.target.value) || 0)}
                      className="w-16 text-center font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: "6px" }}
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity('moquetteDifferente', 1)}
                      className="w-8 h-8 p-0"
                      style={{ borderColor: COLORS.secondary, borderRadius: "6px" }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                      {(amenagementData.moquetteDifferente * amenagementPrices.moquetteDifferente).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>

                {amenagementData.moquetteDifferente > 0 && (
                  <div>
                    <Label className="font-[Poppins] font-medium text-sm">Couleur souhaitée</Label>
                    <Select 
                      value={amenagementData.moquetteCouleur} 
                      onValueChange={(value) => onAmenagementChange('moquetteCouleur', value)}
                    >
                      <SelectTrigger 
                        className="mt-1 border-[#3DB5A0] focus:ring-[#3DB5A0]"
                        style={{ borderRadius: "6px" }}
                      >
                        <SelectValue placeholder="Choisir une couleur" />
                      </SelectTrigger>
                      <SelectContent>
                        {couleursMoquette.map((couleur) => (
                          <SelectItem key={couleur} value={couleur.toLowerCase()}>
                            {couleur}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MOBILIER */}
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
              MOBILIER
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <QuantityField
                field="comptoir"
                label="Comptoir"
                price={amenagementPrices.comptoir}
              />

              <QuantityField
                field="tabouret"
                label="Tabouret"
                price={amenagementPrices.tabouret}
              />

              <QuantityField
                field="mangeDebout"
                label="Mange-debout"
                price={amenagementPrices.mangeDebout}
              />

              <QuantityField
                field="chaise"
                label="Chaise"
                price={amenagementPrices.chaise}
              />

              <QuantityField
                field="table120x60"
                label="Table 120 x 60 cm"
                price={amenagementPrices.table120x60}
              />

              <QuantityField
                field="mange3Tabourets"
                label="Mange-debout + 3 tabourets"
                price={amenagementPrices.mange3Tabourets}
              />

              <QuantityField
                field="ecran52"
                label="Écran 52 pouces sur pied"
                price={amenagementPrices.ecran52}
                description="Entrée HDMI, VGA"
              />

              <QuantityField
                field="refrigerateur140"
                label="Réfrigérateur 140 L"
                price={amenagementPrices.refrigerateur140}
                description="85x60x60"
              />

              <QuantityField
                field="refrigerateur240"
                label="Réfrigérateur 260 L"
                price={amenagementPrices.refrigerateur240}
                description="140x60x60"
              />

              <QuantityField
                field="presentoirA4"
                label="Présentoir pour document A4"
                price={amenagementPrices.presentoirA4}
              />

              <QuantityField
                field="blocPrises"
                label="Bloc de 3 prises"
                price={amenagementPrices.blocPrises}
              />

              <QuantityField
                field="fauteuil"
                label="Fauteuil"
                price={amenagementPrices.fauteuil}
              />

              <QuantityField
                field="tableBasse"
                label="Table basse ronde"
                price={amenagementPrices.tableBasse}
                description="Diamètre 60cm"
              />

              <QuantityField
                field="gueridonHaut"
                label="Guéridon haut"
                price={amenagementPrices.gueridonHaut}
                description="120cm"
              />

              <QuantityField
                field="colonneVitrine"
                label="Colonne vitrine"
                price={amenagementPrices.colonneVitrine}
              />

              <QuantityField
                field="comptoirVitrine"
                label="Comptoir vitrine"
                price={amenagementPrices.comptoirVitrine}
              />

              <QuantityField
                field="porteManteux"
                label="Porte-manteaux sur pied"
                price={amenagementPrices.porteManteux}
              />

              <QuantityField
                field="planteBambou"
                label="Plante bambou"
                price={amenagementPrices.planteBambou}
                description="Avec pot blanc"
              />

              <QuantityField
                field="planteKentia"
                label="Plante kentia"
                price={amenagementPrices.planteKentia}
                description="Avec pot blanc"
              />

              {/* Pouf cube avec sélecteur de couleur */}
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors" style={{ borderColor: "#e5e7eb", borderRadius: "8px" }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium text-gray-800">Pouf cube</Label>
                    <p className="text-sm text-gray-600 mt-1 font-[Poppins]">40x40x40 cm</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: COLORS.primary }}>
                      {amenagementPrices.poufCube}€ / unité
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity('poufCube', -1)}
                      disabled={amenagementData.poufCube <= 0}
                      className="w-8 h-8 p-0"
                      style={{ borderColor: COLORS.secondary, borderRadius: "6px" }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="0"
                      value={amenagementData.poufCube}
                      onChange={(e) => onAmenagementChange('poufCube', parseInt(e.target.value) || 0)}
                      className="w-16 text-center font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: "6px" }}
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity('poufCube', 1)}
                      className="w-8 h-8 p-0"
                      style={{ borderColor: COLORS.secondary, borderRadius: "6px" }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
                      {(amenagementData.poufCube * amenagementPrices.poufCube).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>

                {amenagementData.poufCube > 0 && (
                  <div>
                    <Label className="font-[Poppins] font-medium text-sm">Couleur souhaitée</Label>
                    <Select 
                      value={amenagementData.poufCouleur} 
                      onValueChange={(value) => onAmenagementChange('poufCouleur', value)}
                    >
                      <SelectTrigger 
                        className="mt-1 border-[#3DB5A0] focus:ring-[#3DB5A0]"
                        style={{ borderRadius: "6px" }}
                      >
                        <SelectValue placeholder="Choisir une couleur" />
                      </SelectTrigger>
                      <SelectContent>
                        {couleursPouf.map((couleur) => (
                          <SelectItem key={couleur} value={couleur.toLowerCase()}>
                            {couleur}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Totaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className="p-6 text-center"
            style={{ 
              backgroundColor: COLORS.secondary, 
              color: 'white',
              borderRadius: "12px"
            }}
          >
            <h2 className="text-xl font-bold font-[Poppins]">
              TOTAL HT 1 : {totalHT1.toLocaleString('fr-FR')} €
            </h2>
            <p className="text-sm opacity-90">Réservation d'espace</p>
          </div>
          <div 
            className="p-6 text-center"
            style={{ 
              backgroundColor: COLORS.primary, 
              color: 'white',
              borderRadius: "12px"
            }}
          >
            <h2 className="text-xl font-bold font-[Poppins]">
              TOTAL HT 2 : {totalHT2.toLocaleString('fr-FR')} €
            </h2>
            <p className="text-sm opacity-90">Aménagements</p>
          </div>
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
            className="text-white px-12 py-3 font-[Poppins] font-semibold transition-colors duration-200"
            style={{ 
              backgroundColor: COLORS.secondary,
              borderRadius: "8px"
            }}
            onClick={handleNext}
          >
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}