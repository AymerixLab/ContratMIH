import { useEffect, useRef, useState, type UIEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
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
  totalHT4: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
  onBack: () => void;
  onComplete: () => void;
}

const REGULATION_PDF_URL = new URL('../../assets/Reglement.pdf', import.meta.url).href;

const REGULATION_SECTIONS = [
  {
    title: '1. Conditions générales de ventes',
    paragraphs: [
      'Le présent règlement a pour objet de définir les règles applicables à l’admission et à la participation des exposants à l’édition 2026 du Salon Made in Hainaut.',
      'Porte du Hainaut Développement, ci-après désigné « l’Organisateur », se réserve la possibilité de modifier ou de compléter le présent règlement, sans préavis, dans l’intérêt du respect de la sécurité des personnes et des biens. L’Organisateur en informera l’exposant par tous moyens appropriés.'
    ]
  },
  {
    title: '2. Participation',
    paragraphs: [
      'Le contrat de participation doit être adressé à Porte du Hainaut Développement « Salon Made in Hainaut », rue Michel Rondet - BP 28 - 59135 WALLERS-ARENBERG et marque l’acceptation pleine et entière de l’exposant au présent règlement.',
      'Seules les demandes entièrement remplies et dûment signées, accompagnées du paiement prévu pourront être prises en considération, sous réserve de l’encaissement complet.',
      'Les paiements sont à libeller à l’ordre de « Porte du Hainaut Développement ».'
    ]
  },
  {
    title: '3. Conditions de règlement',
    paragraphs: [
      'Le paiement de la location doit être fait aux deux échéances définies. L’exposant doit verser, au moment de sa demande de participation, une première échéance égale à 50 % du montant total TTC de sa réservation. En cas de désistement du fait de l’exposant, ce premier paiement partiel reste définitivement acquis à l’Organisateur.',
      'Cent pour cent du montant total TTC du contrat de participation devra être payé le 06 mai 2026 au plus tard. Tout défaut de paiement aux échéances fixées entraîne de plein droit des pénalités de retard au taux mensuel égal à deux fois le taux de l’intérêt légal et autorise l’Organisateur à annuler la mise à disposition du stand et modifier l’emplacement concédé.',
      'Le défaut de paiement du solde dans le délai fixé donne à l’Organisateur, sans mise en demeure préalable, le droit de retirer l’admission de l’exposant et/ou d’entraîner la déchéance de l’emplacement. Dans tous les cas, le montant total de la facture est dû.'
    ]
  },
  {
    title: '4. Défaut d’occupation – Annulation',
    paragraphs: [
      'La signature de la demande de participation constitue un engagement ferme. Toute annulation entraîne le paiement d’une indemnité par l’exposant et doit être adressée par lettre recommandée avec accusé de réception.',
      'Si le désistement intervient avant le 20 avril 2026, 50 % du montant total de la facture sera dû à titre d’indemnité. Passé ce délai, l’intégralité du règlement demeure exigible.',
      'Tout stand non occupé le jour de l’ouverture à 10h sera repris par l’Organisateur, sans indemnité possible, même si l’emplacement a pu être reloué. L’Organisateur peut reporter la manifestation ou changer les horaires si nécessaire, sans que cela ne justifie une annulation par l’exposant.'
    ]
  },
  {
    title: '5. Affectation des stands',
    paragraphs: [
      'L’Organisateur est seul juge de l’implantation des stands, statue sur les admissions et répartitions, ainsi que sur la surface attribuée, sans obligation de motivation.',
      'Seule l’émission de la facture de location d’espace constitue une preuve d’admission, sous réserve de l’encaissement complet. L’Organisateur tient notamment compte de la date de retour des dossiers.'
    ]
  },
  {
    title: '6. Obligations de l’exposant',
    paragraphs: [
      'Aucune société non affiliée ne peut être hébergée sur un stand sans accord écrit de l’Organisateur. Toute admission engage définitivement l’exposant au respect du présent règlement et des règlements complémentaires communiqués.',
      'Les exposants s’engagent à ne présenter que des produits conformes à la réglementation française et à ne pas commettre d’actes de contrefaçon ou de concurrence déloyale. La distribution de documents est limitée au stand et soumise à autorisation pour des articles non exposés.',
      'L’aménagement des stands doit respecter les limites et hauteurs fixées, ainsi que les éléments fournis par l’Organisateur. Les matériaux ajoutés doivent être ignifugés et toute infraction peut entraîner le démontage du stand aux frais de l’exposant.',
      'Les détériorations causées aux installations ou locaux sont évaluées et facturées à l’exposant. L’installation doit être terminée la veille de l’ouverture et un responsable doit rester présent jusqu’au démontage complet.'
    ]
  },
  {
    title: '7. Assurances',
    paragraphs: [
      'L’Organisateur décline toute responsabilité en cas de dommages aux biens exposés. Une assurance responsabilité civile a été souscrite par l’Organisateur qui, ainsi que ses assureurs, renonce à tout recours contre les exposants sauf malveillance.',
      'Les exposants doivent présenter une assurance responsabilité civile avec clause de renonciation à recours envers Porte du Hainaut Développement et la commune de Wallers, ainsi qu’une assurance dommages conseillée couvrant bris, vols ou détériorations.'
    ]
  },
  {
    title: '8. Sécurité',
    paragraphs: [
      'Les produits et services présentés doivent respecter les normes de sécurité. Lors de la visite de la Commission de Sécurité, l’exposant doit être présent sur le stand et fournir les procès-verbaux de réaction au feu des matériaux utilisés.',
      'L’utilisation de machines en fonctionnement, moteurs thermiques, liquides inflammables, générateurs de fumées, substances radioactives, rayons X, lasers ou drones est soumise à une réglementation particulière et nécessite une demande préalable auprès du chargé de sécurité agréé.'
    ]
  },
  {
    title: '9. Limitation de responsabilité',
    paragraphs: [
      'L’Organisateur n’est pas responsable des dommages immatériels, indirects ou spéciaux, ni des pertes de profit ou de jouissance subies par l’exposant ou un tiers.',
      'En cas de dommages directs, la responsabilité de l’Organisateur est limitée au montant versé pour l’admission de l’exposant.'
    ]
  },
  {
    title: '10. Prestations exclusives et entreprises agréées',
    paragraphs: [
      'Les prestations exclusives de Porte du Hainaut Développement couvrent notamment les fluides, la sécurité, le gardiennage, les télécommunications, l’accrochage des charges, le chauffage, la climatisation, le nettoyage, l’accueil, le bar et la restauration.',
      'Seules les entreprises agréées par l’Organisateur sont habilitées à effectuer les travaux et à fournir le matériel dans le cadre du salon. L’exposant doit prendre soin du matériel mis à disposition, sous peine de supporter les coûts de remplacement.'
    ]
  },
  {
    title: '11. Guide de l’exposant',
    paragraphs: [
      'Les détails pratiques relatifs à la participation sont fournis dans le « Guide de l’Exposant » communiqué après l’attribution des stands.'
    ]
  },
  {
    title: '12. Accrochage de charges',
    paragraphs: [
      'Toute accroche doit faire l’objet d’une demande préalable auprès de Porte du Hainaut Développement. Pour des raisons de sécurité, l’exposant doit recourir aux services de l’Organisateur pour l’accrochage de charges à partir de la charpente du bâtiment.'
    ]
  },
  {
    title: '13. Résistance au sol',
    paragraphs: [
      'La résistance au sol est de 0,5 tonne par mètre carré. Les manutentions doivent en tenir compte et les surcharges ou travaux lourds requièrent l’accord du service technique.',
      'Les chariots et appareils de manutention doivent être équipés de roues à bandage caoutchouté. Il est interdit de trouer ou fixer des éléments au sol, toute dégradation restant à la charge de l’exposant.'
    ]
  },
  {
    title: '14. Parking',
    paragraphs: [
      'Le stationnement aux abords du site de Wallers-Arenberg est strictement réglementé. Les opérations de chargement et déchargement doivent s’effectuer depuis l’aire de livraison et pour une durée limitée selon les directives du service de sécurité.'
    ]
  },
  {
    title: '15. Nuisances et environnement',
    paragraphs: [
      'L’exposant doit adopter une attitude conforme aux intérêts du salon et à l’image de l’Organisateur. Toute attitude nuisible peut entraîner l’exclusion immédiate.',
      'L’Organisateur peut faire enlever toute installation nuisant à l’aspect général ou considérée comme dangereuse. Toute animation sonore doit être préalablement approuvée.'
    ]
  },
  {
    title: '16. Animaux',
    paragraphs: [
      'L’introduction d’animaux est interdite dans l’enceinte du site de Wallers-Arenberg.'
    ]
  },
  {
    title: '17. Stockage des emballages',
    paragraphs: [
      'L’Organisateur ne dispose pas de locaux pour entreposer les emballages vides. Les exposants doivent les retirer au fur et à mesure du montage.'
    ]
  },
  {
    title: '18. Réception des colis',
    paragraphs: [
      'Les colis peuvent être livrés sur site pendant le montage aux risques de l’expéditeur, à condition d’indiquer clairement le nom du salon, de la société, de son représentant et le numéro du stand. Aucun colis ne sera accepté avant le montage.'
    ]
  },
  {
    title: '19. Contrôle des accès',
    paragraphs: [
      'L’accès au site est réglementé par le service de sécurité pendant le montage, le démontage et l’ouverture du salon. L’Organisateur peut refuser l’entrée ou expulser toute personne dont l’attitude ou la tenue porterait atteinte à l’image de la manifestation ou qui refuserait d’appliquer les règles de sécurité.'
    ]
  },
  {
    title: '20. Clause attributive de juridiction',
    paragraphs: [
      'En cas de litige relatif au présent règlement, compétence expresse est attribuée aux tribunaux de Valenciennes, même en cas de pluralité de défendeurs ou d’appel en garantie.'
    ]
  },
  {
    title: '21. Obligations',
    paragraphs: [
      'L’exposant atteste que le travail sera réalisé par des salariés employés régulièrement au regard des articles L143-3, L143-5, L341-6 et L620-3 du Code du travail. Il s’engage à respecter les obligations en matière de rémunération, de déclaration préalable d’embauche et d’emploi de travailleurs étrangers autorisés.'
    ]
  },
  {
    title: '22. RGPD',
    paragraphs: [
      'Les informations collectées sont utilisées pour gérer la participation au Salon Made in Hainaut et respecter les obligations légales. Elles sont conservées pendant la durée du contrat augmentée des délais légaux applicables.',
      'Conformément au RGPD, les droits d’accès, de rectification, d’effacement, de limitation, de portabilité, d’opposition et d’information en cas de violation peuvent être exercés auprès de DPD@agglo-porteduhainaut.fr ou du Service DPD Avenue Michel Rondet, 59135 Wallers.'
    ]
  }
] as const;

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
  totalHT4,
  totalHT,
  tva,
  totalTTC,
  onBack,
  onComplete
}: EngagementPageProps) {
  const [showRegulationModal, setShowRegulationModal] = useState(false);
  const [hasScrolledRegulation, setHasScrolledRegulation] = useState(false);
  const [manualAcknowledgement, setManualAcknowledgement] = useState(false);
  const regulationContainerRef = useRef<HTMLDivElement | null>(null);
  const regulationSentinelRef = useRef<HTMLDivElement | null>(null);
  
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

  useEffect(() => {
    if (showRegulationModal) {
      setHasScrolledRegulation(false);
      setManualAcknowledgement(false);
      if (regulationContainerRef.current) {
        regulationContainerRef.current.scrollTop = 0;
      }
    }
  }, [showRegulationModal]);

  useEffect(() => {
    if (!showRegulationModal) return;

    const container = regulationContainerRef.current;
    const sentinel = regulationSentinelRef.current;

    if (!container || !sentinel) return;

    if (container.scrollHeight <= container.clientHeight) {
      setHasScrolledRegulation(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasScrolledRegulation(true);
        }
      },
      {
        root: container,
        threshold: 0.99
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [showRegulationModal]);

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

  const handleAcceptanceChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setShowRegulationModal(true);
      return;
    }

    onEngagementChange('accepteReglement', false);
  };

  const handleRegulationScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollHeight <= target.clientHeight) {
      setHasScrolledRegulation(true);
      return;
    }

    const distanceToBottom = target.scrollHeight - (target.scrollTop + target.clientHeight);

    if (distanceToBottom <= 16) {
      setHasScrolledRegulation(true);
    }
  };

  const handleConfirmAcceptance = () => {
    onEngagementChange('accepteReglement', true);
    setShowRegulationModal(false);
  };

  const handleDismissModal = () => {
    setShowRegulationModal(false);
    setHasScrolledRegulation(false);
    setManualAcknowledgement(false);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      handleDismissModal();
    }
  };

  const handleManualAcknowledgementChange = (checked: boolean | 'indeterminate') => {
    setManualAcknowledgement(checked === true);
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
                <span className="font-[Poppins]">Produits complémentaires (HT 3)</span>
                <span className="font-semibold">{totalHT3.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-[Poppins]">Visibilité & Communication (HT 4)</span>
                <span className="font-semibold">{totalHT4.toLocaleString('fr-FR')} €</span>
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
                  Un premier acompte de <span className="font-semibold">50 % du montant total TTC</span> sera payé à la signature du contrat. Je soussigné <span className="font-semibold">{formData.responsableNom} {formData.responsablePrenom}</span>, responsable de <span className="font-semibold">{formData.raisonSociale || formData.enseigne}</span>, joins un acompte de <span className="font-semibold">{(totalTTC * 0.5).toLocaleString('fr-FR')} €</span> par chèque, à l'ordre de Porte du Hainaut Développement.
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
                  <h4 className="font-semibold font-[Poppins]" style={{ color: COLORS.primary }}>Le règlement :</h4>
                </div>
                <div className="space-y-2 text-sm font-[Poppins]">
                  <p>- soit par chèque, à l'ordre de Porte du Hainaut Développement</p>
                  <p>- soit par virement bancaire, sur le compte <span className="font-semibold">n°FR76 1627 5500 0008 1039 1006 262 - BIC CEPAFRPP627</span>. Dans ce cas, tous les frais bancaires éventuellement dus sont à la charge de l'exposant.</p>
                </div>
              </div>

              {/* Facture complémentaire */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <p className="text-sm font-[Poppins] leading-relaxed">
                  <span className="font-semibold">Toute commande après signature du contrat de réservation</span> fera l'objet d'une facturation complémentaire, dont le règlement sera à effectuer au <span className="font-semibold">plus tard le 06 mai 2026</span>.
                </p>
              </div>

              {/* Retour document */}
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg" style={{ borderRadius: "8px" }}>
                <p className="text-sm font-[Poppins] leading-relaxed font-semibold" style={{ color: COLORS.primary }}>
                  📝 À retourner impérativement signé avec le dossier dûment complété.
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
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="accepteReglement"
                  checked={engagementData.accepteReglement}
                  onCheckedChange={handleAcceptanceChange}
                  className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] mt-1"
                />
                <Label
                  htmlFor="accepteReglement"
                  className="font-[Poppins] leading-relaxed items-start gap-1 flex-wrap"
                >
                  <span>
                    J'accepte que mes informations saisies soient conservées à des fins de suivi. Je certifie l'exactitude des informations fournies. Mon inscription sera définitive une fois les documents téléchargés tamponnés et signés au nom du responsable de mon entreprise à l'adresse suivante :
                  </span>
                  <a
                    href="mailto:mih@agence-porteduhainaut.fr"
                    className="font-semibold underline"
                    style={{ color: COLORS.primary }}
                  >
                    mih@agence-porteduhainaut.fr
                  </a>
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
      <Dialog open={showRegulationModal} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Règlement du Salon Made in Hainaut</DialogTitle>
            <DialogDescription>
              Faites défiler l'intégralité du règlement avant de confirmer votre acceptation.
            </DialogDescription>
          </DialogHeader>
          <div
            ref={regulationContainerRef}
            onScroll={handleRegulationScroll}
            className="max-h-[70vh] overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-4"
          >
            <div className="space-y-6">
              {REGULATION_SECTIONS.map((section) => (
                <section
                  key={section.title}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: COLORS.primary }}
                  >
                    {section.title}
                  </h3>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div ref={regulationSentinelRef} aria-hidden className="h-1 w-full" />
          </div>
          <a
            href={REGULATION_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold underline"
            style={{ color: COLORS.secondary }}
          >
            Télécharger le règlement au format PDF
          </a>
          <div className="mt-4 flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
            <Checkbox
              id="manualAcknowledgement"
              checked={manualAcknowledgement}
              onCheckedChange={handleManualAcknowledgementChange}
              className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] mt-1"
            />
            <Label htmlFor="manualAcknowledgement" className="text-sm leading-relaxed">
              Je confirme avoir pris connaissance du règlement du Salon Made in Hainaut. En cas de difficulté pour faire défiler le document, ouvrez-le via le lien de téléchargement ci-dessus puis cochez cette case.
            </Label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDismissModal}>
              J'ai besoin de plus de temps
            </Button>
            <Button onClick={handleConfirmAcceptance} disabled={!hasScrolledRegulation && !manualAcknowledgement}>
              J'ai lu et j'accepte le règlement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}