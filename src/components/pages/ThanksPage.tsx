import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { COLORS } from '../../lib/constants';
import { FormData, ReservationData, AmenagementData, VisibiliteData, EngagementData } from '../../lib/types';
import { fillAndDownloadContractPdf } from '../../lib/pdfFiller';
import { DetailedSummary } from '../shared/DetailedSummary';

interface ThanksPageProps {
  formData: FormData;
  reservationData: ReservationData;
  amenagementData: AmenagementData;
  visibiliteData: VisibiliteData;
  engagementData: EngagementData;
  totalHT1: number;
  totalHT2: number;
  totalHT3: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
  onRestartFromReservation?: () => void;
}

export function ThanksPage({
  formData,
  reservationData,
  amenagementData,
  visibiliteData,
  engagementData,
  totalHT1,
  totalHT2,
  totalHT3,
  totalHT,
  tva,
  totalTTC,
  onRestartFromReservation
}: ThanksPageProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      // Remplit le PDF du contrat et lance le téléchargement (PDF aplati)
      await fillAndDownloadContractPdf(
        formData,
        reservationData,
        amenagementData,
        visibiliteData,
        engagementData
      );
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestartFromReservation = () => {
    if (onRestartFromReservation) {
      onRestartFromReservation();
    }
  };

  return (
    <div className="min-h-[60vh] py-8">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <Card className="mb-8 font-[Poppins]">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: COLORS.secondary }}
              >
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold mb-4" style={{ color: COLORS.primary }}>
                Devis réalisé avec succès !
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                Merci <strong>{formData.responsablePrenom} {formData.responsableNom}</strong> pour l'intérêt que vous portez au Salon Made in Hainaut 2026.
              </p>
            </div>

            {/* Récapitulatif financier rapide */}
            <div className="mb-6 p-6 rounded-lg text-left max-w-md mx-auto" style={{ backgroundColor: '#f0fdf4', borderColor: COLORS.secondary, border: '1px solid' }}>
              <h3 className="font-semibold mb-4 text-center" style={{ color: COLORS.primary }}>💰 Total de votre devis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Réservation d'espace :</span>
                  <span>{totalHT1.toLocaleString('fr-FR')} € HT</span>
                </div>
                <div className="flex justify-between">
                  <span>Aménagements :</span>
                  <span>{totalHT2.toLocaleString('fr-FR')} € HT</span>
                </div>
                <div className="flex justify-between">
                  <span>Visibilité & Communication :</span>
                  <span>{totalHT3.toLocaleString('fr-FR')} € HT</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%) :</span>
                  <span>{tva.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t" style={{ color: COLORS.primary }}>
                  <span>Total TTC :</span>
                  <span>{totalTTC.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                Vos documents (devis et contrat) ont été générés automatiquement.
              </p>
              
              <button
                type="button"
                className="inline-flex items-center justify-center px-8 py-3 font-[Poppins] font-semibold text-white rounded-lg transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ 
                  backgroundColor: COLORS.secondary,
                  focusRingColor: COLORS.secondary
                }}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Téléchargement en cours...
                  </>
                ) : (
                  'Si le téléchargement ne se lance pas, cliquez ici'
                )}
              </button>
            </div>

            {/* Restart Button */}
            {onRestartFromReservation && (
              <div className="mb-6">
                <Button 
                  variant="outline"
                  className="px-8 py-3 font-[Poppins] font-semibold transition-colors duration-200"
                  style={{ 
                    borderColor: COLORS.primary,
                    color: COLORS.primary
                  }}
                  onClick={handleRestartFromReservation}
                >
                  Reprendre depuis Réservation de l'espace
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Vos informations d'identité seront conservées
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fef2f2', borderColor: COLORS.primary, border: '1px solid' }}>
              <p className="text-sm text-gray-600">
                <strong>Besoin d'aide ?</strong><br />
                Contactez-nous au <strong style={{ color: COLORS.primary }}>0 800 059 135</strong><br />
                ou par email : <strong style={{ color: COLORS.secondary }}>mih@agence-porteduhainaut.fr</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Récapitulatif détaillé */}
        <DetailedSummary
          formData={formData}
          reservationData={reservationData}
          amenagementData={amenagementData}
          visibiliteData={visibiliteData}
        />
      </div>
    </div>
  );
}
