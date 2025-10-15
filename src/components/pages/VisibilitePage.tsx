import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { VisibiliteData, ReservationData, AmenagementData } from '../../lib/types';
import { COLORS, visibilitePrices } from '../../lib/constants';

// Import des images de signalétique
import packCompletImage from 'figma:asset/1cbc7581d9d6c894971112a8406a67150a3cb62e.png'; // Pack Signalétique complet
import signaletiqueComptoir from 'figma:asset/2de195124806517919438c639c6aa46474db3f13.png'; // Signalétique comptoir
import signaletiqueHautCloisons from 'figma:asset/3f5c98faccdae0268f7a43932d844a4fa3589a8b.png'; // Signalétique haut de cloisons
import signaletiqueCloisonComplete from 'figma:asset/74b059042d7dc3c15b204ca2da8d99cd3c868cd5.png'; // Signalétique cloison complète
import signaletiqueEnseigneHaute from 'figma:asset/caaa6bda67f0c9c0327ee0a294c8443162bbb5d9.png'; // Signalétique enseigne haute

interface VisibilitePageProps {
  visibiliteData: VisibiliteData;
  reservationData?: ReservationData;
  amenagementData?: AmenagementData;
  onVisibiliteChange: (field: string, value: any) => void;
  totalHT1: number;
  totalHT2: number;
  totalHT3: number;
  totalHT4: number;
  onBack: () => void;
  onNext: () => void;
}

export function VisibilitePage({
  visibiliteData,
  reservationData,
  amenagementData,
  onVisibiliteChange,
  totalHT1,
  totalHT2,
  totalHT3,
  totalHT4,
  onBack,
  onNext
}: VisibilitePageProps) {
  const handleNext = () => {
    window.scrollTo(0, 0);
    onNext();
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  // Vérifier si un comptoir a été réservé dans les aménagements
  const comptoirReserve = amenagementData ? (
    amenagementData.comptoir > 0 || amenagementData.comptoirVitrine > 0
  ) : false;

  const standSurface = reservationData?.standSize ? parseInt(reservationData.standSize, 10) || 0 : 0;
  const packSignaletiqueTotal = standSurface > 0 ? standSurface * visibilitePrices.packSignaletiqueComplet : 0;
  const signaletiqueHautTotal = standSurface > 0 ? standSurface * visibilitePrices.signaletiqueHautCloisons : 0;

  const handleCloisonChange = (value: string) => {
    const numValue = Math.max(0, parseInt(value, 10) || 0);
    onVisibiliteChange('signalethqueCloisons', numValue);
  };

  // Gestionnaires de clic pour les cartes
  const handleCardClick = (field: string, currentValue: boolean, disabled = false) => {
    if (!disabled) {
      onVisibiliteChange(field, !currentValue);
    }
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
            3. VISIBILITÉ & COMMUNICATION
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Tous les tarifs sont HT
          </p>
        </div>

        {/* HABILLAGE ET VISIBILITÉ DE VOTRE STAND */}
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
              HABILLAGE ET VISIBILITÉ DE VOTRE STAND
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Pack signalétique complet */}
              <div 
                className={`text-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.packSignaletiqueComplet 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "12px", borderWidth: "2px" }}
                onClick={() => handleCardClick('packSignaletiqueComplet', visibiliteData.packSignaletiqueComplet)}
              >
                <div className="w-full h-32 mb-3 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50">
                  <ImageWithFallback 
                    src={packCompletImage}
                    alt="Pack Signalétique Complet"
                    width={120}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <Checkbox 
                    checked={visibiliteData.packSignaletiqueComplet}
                    onCheckedChange={(checked) => onVisibiliteChange('packSignaletiqueComplet', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <Label className="font-[Poppins] text-sm font-medium cursor-pointer">Pack signalétique complet</Label>
                </div>
                <div className="text-xs text-gray-600 mb-2 font-[Poppins]">
                  Enseigne Haute, stickage haut de cloisons, stickage pourtour stand au sol, stickage comptoir
                </div>
                <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
                  {visibilitePrices.packSignaletiqueComplet} € / m²
                </p>
                {standSurface > 0 && (
                  <p className="text-xs text-gray-600 font-[Poppins] mt-1">
                    Total {packSignaletiqueTotal.toLocaleString('fr-FR')} € pour {standSurface} m²
                  </p>
                )}
              </div>

              {/* Signalétique comptoir */}
              <div 
                className={`text-center p-4 border rounded-lg transition-all duration-300 ${
                  !comptoirReserve 
                    ? 'opacity-50 cursor-not-allowed bg-gray-50'
                    : visibiliteData.signaletiqueComptoir
                      ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105 cursor-pointer'
                      : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105 cursor-pointer'
                }`}
                style={{ borderRadius: "12px", borderWidth: "2px" }}
                onClick={() => handleCardClick('signaletiqueComptoir', visibiliteData.signaletiqueComptoir, !comptoirReserve)}
              >
                <div className="w-full h-32 mb-3 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50">
                  <ImageWithFallback 
                    src={signaletiqueComptoir}
                    alt="Signalétique Comptoir"
                    width={120}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <Checkbox 
                    checked={visibiliteData.signaletiqueComptoir}
                    onCheckedChange={(checked) => onVisibiliteChange('signaletiqueComptoir', checked)}
                    disabled={!comptoirReserve}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <Label className={`font-[Poppins] text-sm font-medium cursor-pointer ${!comptoirReserve ? 'text-gray-400' : ''}`}>
                    Signalétique comptoir*
                  </Label>
                </div>
                <div className="text-xs text-gray-600 mb-2 font-[Poppins]">
                  Signalétique façade comptoir par stickage
                </div>
                <p className={`font-bold text-lg ${comptoirReserve ? '' : 'text-gray-400'}`} 
                   style={{ color: comptoirReserve ? COLORS.primary : undefined }}>
                  {visibilitePrices.signaletiqueComptoir} €
                </p>
                {!comptoirReserve && (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-xs text-orange-700 font-[Poppins]">
                      *Vous devez d'abord réserver un comptoir dans la rubrique mobilier
                    </p>
                  </div>
                )}
              </div>

              {/* Signalétique haut de cloisons */}
              <div 
                className={`text-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.signaletiqueHautCloisons 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "12px", borderWidth: "2px" }}
                onClick={() => handleCardClick('signaletiqueHautCloisons', visibiliteData.signaletiqueHautCloisons)}
              >
                <div className="w-full h-32 mb-3 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50">
                  <ImageWithFallback 
                    src={signaletiqueHautCloisons}
                    alt="Signalétique Haut de Cloisons"
                    width={120}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <Checkbox 
                    checked={visibiliteData.signaletiqueHautCloisons}
                    onCheckedChange={(checked) => onVisibiliteChange('signaletiqueHautCloisons', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <Label className="font-[Poppins] text-sm font-medium cursor-pointer">Signalétique haut de cloisons</Label>
                </div>
                <div className="text-xs text-gray-600 mb-2 font-[Poppins]">
                  Visuel unique (type logo) sur les 6 cloisons, format L0,95m x H0,50m
                </div>
                <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
                  {visibilitePrices.signaletiqueHautCloisons} € / m²
                </p>
                {standSurface > 0 && (
                  <p className="text-xs text-gray-600 font-[Poppins] mt-1">
                    Total {signaletiqueHautTotal.toLocaleString('fr-FR')} € pour {standSurface} m²
                  </p>
                )}
              </div>

              {/* Signalétique cloison complète */}
              <div 
                className="text-center p-4 border rounded-lg hover:shadow-lg transition-all duration-300"
                style={{ borderRadius: "12px", borderWidth: "2px", borderColor: "#e5e7eb" }}
              >
                <div className="w-full h-32 mb-3 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50">
                  <ImageWithFallback 
                    src={signaletiqueCloisonComplete}
                    alt="Signalétique Cloison Complète"
                    width={120}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="text-center mb-2">
                  <Label className="font-[Poppins] font-medium text-sm">Signalétique cloison complète*</Label>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Input 
                      type="number"
                      min="0"
                      value={visibiliteData.signalethqueCloisons}
                      onChange={(e) => handleCloisonChange(e.target.value)}
                      className="w-16 h-8 text-center font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2 font-[Poppins]">
                  L0,96m x H2,4m - Visuel différent possible sur chaque cloison
                </div>
                <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
                  {visibiliteData.signalethqueCloisons > 0 
                    ? `${(visibiliteData.signalethqueCloisons * visibilitePrices.signalethqueCloisons).toLocaleString('fr-FR')} €`
                    : `${visibilitePrices.signalethqueCloisons} € / cloison`
                  }
                </p>
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-700 font-[Poppins]">
                    *Tarif : 185 € par cloison. Un raidisseur métallique s'intercale entre chaque cloison
                  </p>
                </div>
              </div>

              {/* Signalétique enseigne haute */}
              <div 
                className={`text-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.signaletiqueEnseigneHaute 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "12px", borderWidth: "2px" }}
                onClick={() => handleCardClick('signaletiqueEnseigneHaute', visibiliteData.signaletiqueEnseigneHaute)}
              >
                <div className="w-full h-32 mb-3 flex items-center justify-center rounded-lg overflow-hidden bg-gray-50">
                  <ImageWithFallback 
                    src={signaletiqueEnseigneHaute}
                    alt="Signalétique Enseigne Haute"
                    width={120}
                    height={100}
                    className="object-contain max-w-full max-h-full"
                  />
                </div>
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <Checkbox 
                    checked={visibiliteData.signaletiqueEnseigneHaute}
                    onCheckedChange={(checked) => onVisibiliteChange('signaletiqueEnseigneHaute', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <Label className="font-[Poppins] text-sm font-medium cursor-pointer">Signalétique enseigne haute</Label>
                </div>
                <div className="text-xs text-gray-600 mb-2 font-[Poppins]">
                  Mise en avant de votre logo société (L1m x H0,95m)
                </div>
                <p className="font-bold text-lg" style={{ color: COLORS.primary }}>
                  {visibilitePrices.signaletiqueEnseigneHaute} €
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AMÉLIORATION DE VISIBILITÉ ET COMMUNICATION */}
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
              AMÉLIORATION DE VISIBILITÉ ET COMMUNICATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.demiPageCatalogue 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('demiPageCatalogue', visibiliteData.demiPageCatalogue)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.demiPageCatalogue}
                    onCheckedChange={(checked) => onVisibiliteChange('demiPageCatalogue', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">1/2 page quadri dans le catalogue des exposants</Label>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.demiPageCatalogue} €
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.pageCompleeteCatalogue 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('pageCompleeteCatalogue', visibiliteData.pageCompleeteCatalogue)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.pageCompleeteCatalogue}
                    onCheckedChange={(checked) => onVisibiliteChange('pageCompleeteCatalogue', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">1 page quadri dans le catalogue des exposants</Label>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.pageCompleeteCatalogue} €
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.deuxiemeCouverture 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('deuxiemeCouverture', visibiliteData.deuxiemeCouverture)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.deuxiemeCouverture}
                    onCheckedChange={(checked) => onVisibiliteChange('deuxiemeCouverture', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">Deuxième de couverture dans le catalogue</Label>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.deuxiemeCouverture} €
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.quatriemeCouverture 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('quatriemeCouverture', visibiliteData.quatriemeCouverture)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.quatriemeCouverture}
                    onCheckedChange={(checked) => onVisibiliteChange('quatriemeCouverture', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">Quatrième de couverture dans le catalogue</Label>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.quatriemeCouverture} €
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.logoplanSalon 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('logoplanSalon', visibiliteData.logoplanSalon)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.logoplanSalon}
                    onCheckedChange={(checked) => onVisibiliteChange('logoplanSalon', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">Votre logo sur le plan du salon affiché à l'entrée du pavillon</Label>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.logoplanSalon} €
                    </p>
                  </div>
                </div>
              </div>

              {/* NOUVEAUX ÉLÉMENTS */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.documentationSacVisiteur 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('documentationSacVisiteur', visibiliteData.documentationSacVisiteur)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.documentationSacVisiteur}
                    onCheckedChange={(checked) => onVisibiliteChange('documentationSacVisiteur', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">Votre documentation commerciale ou goodies dans le sac visiteur</Label>
                    <p className="text-xs text-gray-600 mt-1 font-[Poppins]">
                      3 000 sacs – 4 entreprises maximum
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.documentationSacVisiteur} €
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  visibiliteData.distributionHotesse 
                    ? 'border-[#3DB5A0] bg-green-50 shadow-md transform scale-105' 
                    : 'border-gray-300 hover:border-[#3DB5A0] hover:shadow-lg hover:scale-105'
                }`}
                style={{ borderRadius: "8px", borderWidth: "2px" }}
                onClick={() => handleCardClick('distributionHotesse', visibiliteData.distributionHotesse)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    checked={visibiliteData.distributionHotesse}
                    onCheckedChange={(checked) => onVisibiliteChange('distributionHotesse', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] pointer-events-none"
                  />
                  <div className="flex-1">
                    <Label className="font-[Poppins] font-medium cursor-pointer">Distribution de votre communication par 1 hôtesse à l'entrée du salon</Label>
                    <p className="text-xs text-gray-600 mt-1 font-[Poppins]">
                      700 € / jour (2 jours obligatoires = 1 400 €)
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: COLORS.primary }}>
                      {visibilitePrices.distributionHotesse.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COCKTAIL ÉVÉNEMENTIEL */}
        <Card
          className="mb-6"
          style={{ 
            borderColor: COLORS.secondary,
            borderWidth: "2px",
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`
          }}
        >
          <CardHeader>
            <CardTitle className="text-white font-[Poppins] text-center text-xl">
              🥂 COCKTAIL ÉVÉNEMENTIEL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-white">
            <div className="space-y-4">
              <p className="font-[Poppins] leading-relaxed text-center">
                Le Site Minier d'Arenberg - La Porte du Hainaut sur lequel se déroule le salon Made in Hainaut 
                depuis sa création est un lieu chargé d'Histoire, classé au <strong>Patrimoine Mondial de l'Unesco</strong>. 
              </p>
              
              <p className="font-[Poppins] leading-relaxed text-center">
                Afin de recevoir vos clients/prospects/partenaires dans des conditions originales et exceptionnelles, 
                nous vous proposons l'organisation de <strong>cocktails déjeunatoires ou dînatoires clé en main</strong> au sein de l'un 
                des espaces remarquables de ce site minier (sommet du chevalement, salle des aérations, etc).
              </p>
              
              <div className="text-center py-4 bg-white bg-opacity-20 rounded-lg" style={{ borderRadius: "8px" }}>
                <p className="text-xl font-semibold font-[Poppins]" style={{ color: COLORS.primary }}>
                  ⇒ Contactez-nous pour plus de détails et un chiffrage personnalisé
                </p>
              </div>
              
              <div className="text-center">
                <p className="font-[Poppins] text-sm opacity-90">
                  Retrouvez toutes les infos sur : <span className="font-semibold underline">www.salon-madeinhainaut.com</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Totaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div 
            className="p-6 text-center"
            style={{ 
              backgroundColor: COLORS.secondary, 
              color: 'white',
              borderRadius: "12px"
            }}
          >
            <h2 className="text-xl font-bold font-[Poppins]">
              TOTAL HT 3 : {totalHT3.toLocaleString('fr-FR')} €
            </h2>
            <p className="text-sm opacity-90">Produits complémentaires</p>
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
              TOTAL HT 4 : {totalHT4.toLocaleString('fr-FR')} €
            </h2>
            <p className="text-sm opacity-90">Visibilité & Communication</p>
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