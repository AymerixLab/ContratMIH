import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Minus } from 'lucide-react';
import { AmenagementData, ReservationData } from '../../lib/types';
import { COLORS, amenagementPrices, getPassSoireeInclus } from '../../lib/constants';

interface ComplementairesPageProps {
  amenagementData: AmenagementData;
  reservationData?: ReservationData;
  onAmenagementChange: (field: string, value: any) => void;
  totalHT1: number;
  totalHT2: number;
  totalHT3: number;
  onBack: () => void;
  onNext: () => void;
}

export function ComplementairesPage({
  amenagementData,
  reservationData,
  onAmenagementChange,
  totalHT1,
  totalHT2,
  totalHT3,
  onBack,
  onNext
}: ComplementairesPageProps) {
  const handleNext = () => {
    window.scrollTo(0, 0);
    onNext();
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  const passInclus = reservationData?.standSize ? getPassSoireeInclus(reservationData.standSize) : 0;
  const maxPassComplementaires = Math.max(0, 15 - passInclus);

  const updatePassQuantity = (delta: number) => {
    const nextValue = Math.max(0, Math.min(amenagementData.passSoiree + delta, maxPassComplementaires));
    onAmenagementChange('passSoiree', nextValue);
  };

  const handlePassInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(event.target.value, 10) || 0);
    onAmenagementChange('passSoiree', Math.min(value, maxPassComplementaires));
  };

  return (
    <Card className="mb-8 font-[Poppins]" style={{ borderRadius: '12px' }}>
      <CardContent className="p-8">
        <div
          className="text-white p-4 mb-8"
          style={{
            backgroundColor: COLORS.secondary,
            borderRadius: '8px'
          }}
        >
          <h1 className="text-2xl font-bold">
            3. PRODUITS COMPLÉMENTAIRES
          </h1>
          <p className="text-sm opacity-90 mt-1">
            Tous les tarifs sont HT
          </p>
        </div>

        <Card
          className="mb-6"
          style={{
            borderColor: COLORS.secondary,
            borderWidth: '2px',
            borderRadius: '12px'
          }}
        >
          <CardHeader
            style={{
              backgroundColor: COLORS.secondary,
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px'
            }}
          >
            <CardTitle className="text-white font-[Poppins]">
              PRODUITS COMPLÉMENTAIRES
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-green-50 border-green-200" style={{ borderRadius: '8px' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={amenagementData.scanBadges}
                    onCheckedChange={(checked) => onAmenagementChange('scanBadges', checked)}
                    className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                  />
                  <Label className="font-[Poppins] font-semibold">
                    SCAN BADGES VISITEURS - {amenagementPrices.scanBadges} € / stand exposant
                  </Label>
                </div>
                <p className="text-sm text-gray-700 font-[Poppins]">
                  Mise à disposition d'une application mobile utilisable sur votre propre téléphone portable pour le scan des badges visiteurs.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200" style={{ borderRadius: '8px' }}>
                <h4 className="font-semibold mb-2 font-[Poppins] text-blue-800">
                  PASS SOIRÉE - {amenagementPrices.passSoiree} € / unité
                </h4>
                <p className="text-sm text-gray-700 mb-3 font-[Poppins]">
                  Le pass soirée donne accès à la soirée professionnelle du 21 mai 2026. Chaque exposant bénéficie d'un nombre de pass en fonction de la surface réservée et peut commander des pass complémentaires.
                </p>

                {reservationData?.standSize && (
                  <div className="mb-4 p-3 bg-blue-100 rounded-md" style={{ borderRadius: '6px' }}>
                    <p className="text-sm font-semibold text-blue-900 font-[Poppins]">
                      Votre stand de {reservationData.standSize} m² inclut {passInclus} pass soirée{passInclus > 1 ? 's' : ''} gratuit{passInclus > 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-3 font-[Poppins]">
                  <strong>Nombre de pass soirée selon la surface :</strong><br />
                  Stand 6 m² : 2 | 9 m² : 3 | 12 m² : 4 | 15 m² : 5 | 18 m² et plus : 6
                </p>

                <div className="flex items-center space-x-3">
                  <Label className="font-[Poppins] font-medium">Pass complémentaires</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updatePassQuantity(-1)}
                      disabled={amenagementData.passSoiree <= 0}
                      className="w-8 h-8 p-0"
                      style={{ borderColor: COLORS.secondary, borderRadius: '6px' }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>

                    <Input
                      type="number"
                      min="0"
                      value={amenagementData.passSoiree}
                      onChange={handlePassInputChange}
                      className="w-16 text-center font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                      style={{ borderRadius: '6px' }}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updatePassQuantity(1)}
                      disabled={amenagementData.passSoiree >= maxPassComplementaires}
                      className="w-8 h-8 p-0"
                      style={{ borderColor: COLORS.secondary, borderRadius: '6px' }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>

                    <span className="text-sm text-gray-600 font-[Poppins] ml-2">
                      = {(amenagementData.passSoiree * amenagementPrices.passSoiree).toLocaleString('fr-FR')} €
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200" style={{ borderRadius: '8px' }}>
                <h4 className="font-semibold mb-2 font-[Poppins] text-yellow-800">BADGES EXPOSANTS</h4>
                <p className="text-sm text-gray-700 font-[Poppins] mb-2">
                  Commandez vos badges exposants depuis l'espace dédié une fois l'inscription validée.
                </p>
                <p className="text-sm font-semibold text-yellow-800 font-[Poppins]">
                  Plus d'infos : www.salon-madeinhainaut.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="p-6 text-center"
            style={{
              backgroundColor: COLORS.secondary,
              color: 'white',
              borderRadius: '12px'
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
              borderRadius: '12px'
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
              borderRadius: '12px'
            }}
          >
            <h2 className="text-xl font-bold font-[Poppins]">
              TOTAL HT 3 : {totalHT3.toLocaleString('fr-FR')} €
            </h2>
            <p className="text-sm opacity-90">Produits complémentaires</p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="px-8 py-3 font-[Poppins]"
            style={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
              borderRadius: '8px'
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
              borderRadius: '8px'
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
