import { useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DetailedSummary } from '../shared/DetailedSummary';
import { EngagementData, FormData, ReservationData, AmenagementData, VisibiliteData } from '../../lib/types';
import { COLORS } from '../../lib/constants';

interface EngagementPageProps {
  engagementData: EngagementData;
  formData: FormData;
  reservationData: ReservationData;
  amenagementData: AmenagementData;
  visibiliteData: VisibiliteData;
  onEngagementChange: (field: string, value: any) => void;
  totalHT1: number;
  totalHT2: number;
  totalHT3: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
  onBack: () => void;
  onComplete: () => void;
}

export function EngagementPage({
  engagementData,
  formData,
  reservationData,
  amenagementData,
  visibiliteData,
  onEngagementChange,
  totalHT1,
  totalHT2,
  totalHT3,
  totalHT,
  tva,
  totalTTC,
  onBack,
  onComplete
}: EngagementPageProps) {
  
  // Générer automatiquement la date et l'heure du jour
  useEffect(() => {
    if (!engagementData.dateSignature) {
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      onEngagementChange('dateSignature', dateStr);
    }
  }, [engagementData.dateSignature, onEngagementChange]);

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  const handleComplete = () => {
    if (!engagementData.accepteReglement) {
      alert('Veuillez accepter les conditions pour continuer.');
      return;
    }
    onComplete();
  };

  return (
    <Card className="mb-8 font-[Poppins]" style={{ borderRadius: "12px" }}>
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-white p-4 rounded-lg mb-8" style={{ backgroundColor: COLORS.primary, borderRadius: "8px" }}>
          <h1 className="text-2xl font-bold">4. ENGAGEMENT CONTRACTUEL</h1>
          <p className="text-sm opacity-90 mt-1">
            Vérifiez le détail de votre sélection avant de finaliser votre inscription
          </p>
        </div>

        {/* Récapitulatif détaillé */}
        <DetailedSummary
          formData={formData}
          reservationData={reservationData}
          amenagementData={amenagementData}
          visibiliteData={visibiliteData}
        />

        {/* Récapitulatif des totaux */}
        <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.secondary, borderWidth: "2px", borderRadius: "12px" }}>
          <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.secondary, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
            <CardTitle className="text-white font-[Poppins]">RÉCAPITULATIF DES COÛTS</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-[Poppins]">Réservation d'espace (HT 1)</span>
                <span className="font-semibold">{totalHT1.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-[Poppins]">Aménagements (HT 2)</span>
                <span className="font-semibold">{totalHT2.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-[Poppins]">Visibilité & Communication (HT 3)</span>
                <span className="font-semibold">{totalHT3.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-400">
                <span className="font-[Poppins] font-semibold">TOTAL HT</span>
                <span className="font-bold text-lg">{totalHT.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-[Poppins]">TVA (20%)</span>
                <span className="font-semibold">{tva.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between items-center py-3 border-2 border-green-500 rounded-lg px-4" style={{ backgroundColor: '#f0f9ff', borderRadius: "8px" }}>
                <span className="font-[Poppins] font-bold text-lg" style={{ color: COLORS.primary }}>TOTAL TTC</span>
                <span className="font-bold text-xl" style={{ color: COLORS.primary }}>{totalTTC.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditions de règlement */}
        <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.primary, borderWidth: "2px", borderRadius: "12px" }}>
          <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.primary, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
            <CardTitle className="text-white font-[Poppins]">CONDITIONS DE RÈGLEMENT</CardTitle>
            <p className="text-white text-sm opacity-90">À adresser à l'ordre de Porte du Hainaut Développement.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Acompte */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <h4 className="font-semibold font-[Poppins]" style={{ color: COLORS.primary }}>Acompte :</h4>
                </div>
                <p className="text-sm font-[Poppins] leading-relaxed">
                  Un premier acompte de <span className="font-semibold">50 % du montant total TTC</span> sera payé à la signature du contrat. Je soussigné, joins un acompte de <span className="font-semibold">{(totalTTC * 0.5).toLocaleString('fr-FR')} €</span> par chèque, à l'ordre de Porte du Hainaut Développement.
                </p>
              </div>

              {/* Solde */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h4 className="font-semibold font-[Poppins]" style={{ color: COLORS.primary }}>Solde :</h4>
                </div>
                <p className="text-sm font-[Poppins] leading-relaxed">
                  Le solde de la facture devra être réglé au <span className="font-semibold">plus tard le 06 mai 2026</span>.
                </p>
              </div>

              {/* Virement bancaire */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <h4 className="font-semibold font-[Poppins]" style={{ color: COLORS.primary }}>Le règlement par virement :</h4>
                </div>
                <div className="space-y-2 text-sm font-[Poppins]">
                  <p>- soit par chèque, à l'ordre de Porte du Hainaut Développement</p>
                  <p>- soit par virement bancaire, sur le compte <span className="font-semibold">n°30004 01039 00421006 262 - BIC CEPAFRPP627</span>. Dans ce cas, tous les frais bancaires éventuellement dus sont à la charge de l'exposant.</p>
                </div>
              </div>

              {/* Facture complémentaire */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <p className="text-sm font-[Poppins] leading-relaxed">
                  <span className="font-semibold">Toute commande après signature du contrat de réservation</span> sera l'objet d'une facturation complémentaire, dont le règlement sera à effectuer au <span className="font-semibold">plus tard le 06 mai 2026</span>.
                </p>
              </div>

              {/* Retour document */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <p className="text-sm font-[Poppins] leading-relaxed font-semibold" style={{ color: COLORS.primary }}>
                  📝 À retourner impérativement signé par courrier avec le dossier dûment complété.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conditions d'acceptation */}
        <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.secondary, borderWidth: "2px", borderRadius: "12px" }}>
          <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.secondary, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
            <CardTitle className="text-white font-[Poppins]">CONDITIONS D'ACCEPTATION</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="accepteReglement"
                  checked={engagementData.accepteReglement}
                  onCheckedChange={(checked) => onEngagementChange('accepteReglement', checked)}
                  className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] mt-1"
                />
                <Label htmlFor="accepteReglement" className="font-[Poppins] leading-relaxed">
                  J'accepte que mes informations saisies soit conservé à des fins de suivie. Je certifie l'exactitude des informations fournies. Mon inscription sera définitive une fois les documents téléchargés seront tamponné et signé au nom du responsable de mon entreprise à l'adresse suivante <span className="font-semibold" style={{ color: COLORS.primary }}>mih@agence-porteduhainaut.fr</span>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature et cachet */}
        <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.primary, borderWidth: "2px", borderRadius: "12px" }}>
          <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.primary, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
            <CardTitle className="text-white font-[Poppins]">SIGNATURE ET CACHET</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-[Poppins] font-medium">Date et heure de signature</Label>
                <Input 
                  value={engagementData.dateSignature}
                  readOnly
                  className="mt-1 font-[Poppins] bg-gray-50 border-[#3DB5A0]"
                  style={{ borderRadius: "8px" }}
                />
                <p className="text-xs text-gray-500 mt-1">Date et heure générées automatiquement</p>
              </div>

              <div>
                <Label htmlFor="cachetSignature" className="font-[Poppins] font-medium">
                  Cachet et signature de l'entreprise
                </Label>
                <Input 
                  id="cachetSignature"
                  value={engagementData.cachetSignature}
                  onChange={(e) => onEngagementChange('cachetSignature', e.target.value)}
                  placeholder="Signature électronique ou mention 'Lu et approuvé'"
                  className="mt-1 font-[Poppins] border-[#3DB5A0] focus:ring-[#3DB5A0]"
                  style={{ borderRadius: "8px" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information importante */}
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: COLORS.primary, color: 'white', borderRadius: "8px" }}>
          <h3 className="font-bold mb-3 font-[Poppins]">📄 GÉNÉRATION AUTOMATIQUE DES DOCUMENTS</h3>
          <p className="font-[Poppins] leading-relaxed">
            En validant ce formulaire, un fichier ZIP contenant votre devis détaillé et votre contrat de participation 
            sera automatiquement généré et téléchargé. Ces documents devront être tamponnés et signés par le responsable 
            de votre entreprise puis retournés à l'adresse : <span className="font-semibold">mih@agence-porteduhainaut.fr</span>
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            className="px-8 py-3 font-[Poppins]"
            style={{ borderColor: COLORS.primary, color: COLORS.primary, borderRadius: "8px" }}
            onClick={handleBack}
          >
            Retour
          </Button>
          <Button 
            size="lg"
            className={`text-white px-12 py-3 font-[Poppins] font-semibold transition-colors duration-200 ${
              !engagementData.accepteReglement ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: engagementData.accepteReglement ? COLORS.secondary : '#gray', borderRadius: "8px" }}
            onClick={handleComplete}
            disabled={!engagementData.accepteReglement}
          >
            Valider et Générer les Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}