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
import { Loader2 } from 'lucide-react';

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
  submissionError: string | null;
  isSubmitting: boolean;
}

const REGULATION_PDF_URL = new URL('../../assets/Reglement.pdf', import.meta.url).href;

const formatSignatureDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const REGULATION_SECTIONS = [
  {
    title: '1. Conditions générales de ventes',
    paragraphs: [
      'Le présent règlement a pour objet de définir les règles applicables à l’admission et à la participation des exposants à l’édition 2026 du salon Made in Hainaut.',
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
      'Le paiement de la location doit être fait aux deux échéances ci-après définies. L’exposant doit verser, au moment de sa demande de participation, une première échéance égale à 50 % du montant total TTC de sa réservation. En cas de désistement du fait de l’exposant, ce premier paiement partiel reste définitivement acquis à l’Organisateur. (voir chapitre 4 : défaut d’occupation - annulation).',
      '100 % du montant total TTC du contrat de participation devra être payé le 06 mai 2026 au plus tard. Tout défaut de paiement aux échéances fixées entraîne de plein droit, et sans mise en demeure préalable, des pénalités de retard au taux mensuel égal à deux fois le taux de l’intérêt légal et entraîne le droit pour l’Organisateur d’annuler la mise à disposition du stand et modifier l’emplacement concédé.',
      'Le défaut de paiement du solde de la participation dans le délai fixé donne à l’Organisateur, sans mise en demeure préalable, le droit de retirer l’admission de l’exposant et/ou entraîne la déchéance de l’emplacement de celui-ci. Dans toutes ces hypothèses, le montant total de la facture est dû à l’Organisateur.'
    ]
  },
  {
    title: '4. Défaut d’occupation – Annulation',
    paragraphs: [
      'La signature de la demande de participation constitue un engagement ferme. L’annulation de la participation entraîne le paiement d’une indemnité par l’exposant.',
      'L’annulation ne sera prise en compte que si elle est adressée par l’exposant à l’Organisateur par lettre recommandée avec demande d’avis de réception. Si le désistement intervient, par lettre recommandée avec demande d’avis de réception reçue avant le 20 avril 2026, 50 % du montant total de la facture sera dû à titre d’indemnité.',
      'Pour toute annulation non reçue dans ces conditions, le règlement complet de la facture reste dû par l’exposant à l’Organisateur. Tout stand non occupé le jour de l’ouverture à 10h sera repris par l’Organisateur, sans que l’exposant ne puisse prétendre à aucune indemnité, même si l’Organisateur a pu relouer l’emplacement initialement réservé.',
      'L’Organisateur se réserve le droit de reporter la manifestation et de changer les horaires indiqués notamment en cas de force majeure ou pour toute autre raison qui nécessiterait une telle modification. Le report de la manifestation ou le changement d’horaires ne peut pas justifier une annulation totale ou partielle de réservation de la part des exposants.'
    ]
  },
  {
    title: '5. Affectation des stands',
    paragraphs: [
      'L’Organisateur est seul juge de l’implantation des stands. Il statue sur les admissions et la répartition des stands, le nombre d’exposants et leur surface sans être obligé de motiver sa décision.',
      'La décision d’admission ou de répartition des stands ne pourra donner lieu à une quelconque indemnité. Seule l’émission de la facture de location d’espace par l’Organisateur constitue une preuve de l’admission de l’exposant, sous réserve du complet encaissement.',
      'L’Organisateur tiendra notamment compte dans le cadre des attributions de la date de retour des dossiers.'
    ]
  },
  {
    title: '6. Obligations de l’exposant',
    paragraphs: [
      'Il n’est pas admis qu’un exposant héberge une société non affiliée sur son stand, sans l’accord préalable et écrit de l’Organisateur. Toute admission engage définitivement et irrévocablement son souscripteur qui accepte strictement les dispositions du présent règlement, ainsi que les règlements spéciaux qui lui seront adressés dans les dossiers de l’exposant.',
      'Tout manquement à ces règlements par l’exposant peut entraîner son exclusion, sans que celui-ci ne puisse demander le remboursement des sommes versées ni d’indemnité de quelque nature que ce soit.',
      'Produits exposés, exclusivités, fraudes, concurrence déloyale, contrefaçons : Les exposants s’engagent à ne présenter que des produits ou matériels conformes à la nomenclature établie par l’Organisateur et à la réglementation française, à ne procéder à aucune publicité susceptible d’induire en erreur ou de tromper le public et à ne commettre aucun acte de contrefaçon ou de concurrence déloyale.',
      'Les circulaires, brochures, catalogues, imprimés, primes ou objets de toute nature ne pourront être distribués par les exposants que sur leur stand. Aucun prospectus relatif à des articles non-exposés ne pourra être distribué sans l’autorisation écrite et préalable de l’Organisateur.',
      'La distribution ou la vente de journaux, périodiques, prospectus, brochures, billets de tombola, insignes, bons de participation, etc., même si elle a trait à une œuvre ou manifestation de bienfaisance, les enquêtes dites de sondage, sont interdites à l’entrée du salon sauf dérogation accordée par l’Organisateur.',
      'Les exposants s’engagent à ne présenter enfin que les fabrications ou services pour lesquels ils ont été admis à l’exposition. L’Organisateur peut à tout moment exiger que soient retirés immédiatement de l’exposition les objets litigieux.',
      'Le non-respect de ces obligations entraîne de plein droit l’exclusion temporaire ou définitive du salon. L’Organisateur peut interdire l’entrée de l’exposition à toute personne s’étant livrée à des actes préjudiciables à l’un des exposants.',
      'L’exposant garantit l’Organisateur de tout recours, réclamation ou revendication de tiers fondées sur des faits de concurrence déloyale ou de contrefaçon et de façon générale sur l’atteinte à leurs droits des tiers par l’exposant et garantit l’Organisateur de tous dommages et intérêts et frais exposés en conséquence, en ce compris les honoraires d’avocat.',
      'Installation des stands : L’implantation des stands incombe à l’Organisateur. Les exposants peuvent aménager l’emplacement qui leur est alloué en tenant compte des impératifs suivants :',
      '- respecter les limites du stand attribué et ne pas empiéter sur les allées, respecter la hauteur limite des stands fixée à 2,5m, sauf dérogation écrite.',
      '- respecter et ne pas modifier les éléments mis en place par l’Organisateur tels que : enseigne, moquette, éclairage, boîtier électrique, fluides.',
      '- s’assurer que tous les accessoires ajoutés par eux pour l’aménagement ou la décoration de leur stand sont ignifugés ou ininflammables, conformément à la réglementation en vigueur.',
      'Ainsi l’exposant peut décorer son stand selon son goût dans le cadre des obligations précitées, après approbation de l’Organisateur de sa proposition de décoration.',
      'Toute infraction à cette obligation peut entraîner le démontage immédiat du stand. En cas d’infraction, l’exposant s’engage à faire déposer à ses frais et à ses risques et périls, les éléments en contravention avec le projet accepté.',
      'À défaut, l’Organisateur se substitue à l’exposant, aux frais et sous la responsabilité de ce dernier. L’approbation de l’Organisateur ne vaut pas validation de la décoration de l’exposant et ne saurait engager sa responsabilité. Cette approbation ne vaut que pour assurer une certaine homogénéité du salon et son image auprès du public.',
      'Toutes détériorations causées par les installations des exposants ou les marchandises exposées, aux installations fournies par l’Organisateur, au sol et locaux mis à leur disposition seront évaluées par les représentants de l’Organisation et facturées aux exposants responsables.',
      'L’installation des stands devra être terminée la veille de l’ouverture du salon en raison du contrôle de la Commission de Sécurité. L’enceinte du salon sera interdite aux véhicules la veille et le jour de l’ouverture du salon et pendant la durée de l’exposition. L’Organisateur n’accordera pas de dérogation à cette règle que pour des motifs impérieux.',
      'Jusqu’au déménagement complet des stands, il est fait obligation à tous les exposants de prévoir un responsable sur stand afin d’éviter notamment les vols.',
      'Sécurité des produits et services : Les produits ou services présentés sur les stands par les exposants doivent être conformes aux normes de sécurité en vigueur. Les exposants assument l’entière responsabilité des éventuelles défectuosités des dits produits ou services sans que la responsabilité de l’Organisateur ne puisse être recherchée.'
    ]
  },
  {
    title: '7. Assurances',
    paragraphs: [
      'L’organisateur décline toute responsabilité concernant les dommages de toute nature pouvant survenir aux biens exposés pour toutes causes que ce soit.',
      'L’Organisateur a souscrit une assurance responsabilité civile en tant qu’Organisateur. Du seul fait de sa participation au salon, l’exposant ainsi que ses assureurs renoncent à tout recours, non seulement contre Porte du Hainaut Développement et/ou la CAPH et/ou la ville de Wallers, leurs personnels, leurs préposés ou toute personne sous leur garde.',
      'De son côté, l’Organisateur renonce également à tout recours contre les exposants, le cas de malveillance excepté. Les clauses de renonciation à recours visées au sein du présent article s’appliquent tant à l’Organisateur qu’à ses assureurs.',
      'Les exposants sont donc invités à se munir des assurances suivantes et d’en présenter l’attestation auprès du commissariat technique, lors de leur arrivée sur le site : une assurance à responsabilité civile à caractère obligatoire, avec clause de renonciation à recours envers Porte du Hainaut Développement et la commune de Wallers, une assurance facultative mais conseillée pour tout dommage (bris, vols, détérioration…) causé à leur matériel, comportant également une clause de renonciation à recours envers Porte du Hainaut Développement et la commune de Wallers.'
    ]
  },
  {
    title: '8. Sécurité',
    paragraphs: [
      'Les produits ou services présentés sur les stands par les exposants doivent être conformes aux normes de sécurité en vigueur. Lors de la visite de la Commission de Sécurité, la veille ou le jour de l’ouverture du salon, l’exposant doit obligatoirement être présent sur le stand et être en mesure de fournir les procès-verbaux de réaction au feu de tous les matériaux utilisés.',
      'Les exposants assument l’entière responsabilité des éventuelles défectuosités des dits produits ou services sans que la responsabilité de l’Organisateur puisse être recherchée.',
      'Le dossier de sécurité de la manifestation est assuré par un chargé de sécurité agréé par Porte du Hainaut Développement. En matière de sécurité, il est l’unique interlocuteur. C’est à lui qu’il faut adresser les demandes d’autorisation particulières concernant l’aménagement du stand par l’exposant.',
      'L’utilisation de machines en fonctionnement, moteurs thermiques ou à combustion, liquides inflammables, générateurs de fumées, substances radioactives, rayons X, lasers fait l’objet d’une réglementation particulière. Idem, l’utilisation de drones volants fera l’objet d’une demande préalable.',
      'L’exposant concerné s’oblige à prendre contact avec le chargé de sécurité agréé pour toute utilisation d’appareils précités.'
    ]
  },
  {
    title: '9. Limitation de responsabilité',
    paragraphs: [
      'L’Organisateur ne pourra en aucun cas être tenu responsable des dommages immatériels, indirects, accessoires ou spéciaux ou des dommages résultant d’une perte de profit, d’un manque à gagner, de privation d’usage subi par l’exposant ou par un tiers, et ce même si l’Organisateur est informé de la possible survenance de ces dommages.',
      'En cas de dommages directs, si la responsabilité de l’Organisateur était recherchée, celle-ci serait limitée à la somme versée pour l’admission de l’exposant.'
    ]
  },
  {
    title: '10. Prestations exclusives et entreprises agréées',
    paragraphs: [
      'Les prestations exclusives à Porte du Hainaut Développement sont : les fluides, la sécurité, le gardiennage, les télécommunications, l’accrochage des charges (cf. article 12), le chauffage et la climatisation, le nettoyage, l’accueil, le bar et la restauration générale.',
      'Les entreprises agréées par l’organisateur sont seules habilitées à effectuer les travaux et à fournir le matériel dans le cadre du salon. L’exposant devra prendre soin du matériel mis à sa disposition, sous peine de supporter le coût du remplacement du matériel détérioré.'
    ]
  },
  {
    title: '11. Guide de l’exposant',
    paragraphs: [
      'Tous les renseignements concernant les détails de la participation de l’exposant au salon lui sont fournis dans le « Guide de l’Exposant », adressé à chaque participant après attribution des stands.'
    ]
  },
  {
    title: '12. Accrochage de charges',
    paragraphs: [
      'Les accroches doivent obligatoirement faire l’objet de demande préalable circonstanciée auprès de Porte du Hainaut Développement. Pour des raisons de sécurité, l’exposant s’oblige à faire appel aux services de Porte du Hainaut Développement pour l’accrochage de charges à partir de la charpente du bâtiment.'
    ]
  },
  {
    title: '13. Résistance au sol',
    paragraphs: [
      'La résistance au sol est de 0,5T / m2. Il faut tenir compte de ces résistances non seulement pour l’installation du matériel exposé mais également pour les manutentions.',
      'Les surcharges ponctuelles et travaux lourds devront obtenir l’accord du service technique de Porte du Hainaut Développement.',
      'Les chariots et autres appareils de manutention doivent être équipés de roues à bandage caoutchouté. L’exposant ne peut en aucun cas trouer les sols ou y fixer quoi que ce soit.',
      'Dans le cas contraire, toute dégradation des sols du fait de l’exposant est à la charge de l’exposant. Il lui appartient donc de prendre toutes mesures permettant d’assurer la protection des sols en cas de risque.'
    ]
  },
  {
    title: '14. Parking',
    paragraphs: [
      'Le stationnement aux abords du site de Wallers Arenberg est strictement réglementé. Le déchargement et chargement de matériel peuvent s’effectuer à partir de l’aire de livraison pour une durée limitée, suivant les directives qui seront appliquées par le service de sécurité.'
    ]
  },
  {
    title: '15. Nuisances et environnement',
    paragraphs: [
      'L’exposant se doit d’avoir une attitude conforme aux intérêts généraux du salon et à l’image de l’Organisateur, notamment à l’égard des visiteurs et des autres participants.',
      'À ce titre, il s’engage en cas de litige ou de contestation avec l’Organisateur ou autres exposants, à ne rien faire qui puisse nuire au bon déroulement du salon. Toute attitude nuisible au bon déroulement du salon pourra entraîner l’exclusion immédiate de l’exposant.',
      'L’Organisateur se réserve le droit de faire enlever toute installation nuisant à l’aspect général du salon, ou tout matériel dégageant des odeurs nauséabondes, ou considéré comme dangereux. L’Organisateur en informera l’exposant avant d’y procéder.',
      'Toute animation musicale (DJ, groupe, etc.) ou utilisation d’une sono doivent être soumises à l’approbation de l’Organisateur.'
    ]
  },
  {
    title: '16. Animaux',
    paragraphs: [
      'L’introduction d’animaux est interdite dans l’enceinte du site de Wallers Arenberg.'
    ]
  },
  {
    title: '17. Stockage des emballages',
    paragraphs: [
      'Porte du Hainaut Développement ne dispose pas de locaux susceptibles d’entreposer les emballages vides pendant la période d’exposition.',
      'Ceux-ci doivent être emportés au fur et à mesure du montage par les exposants.'
    ]
  },
  {
    title: '18. Réception des colis',
    paragraphs: [
      'Les colis envoyés par les exposants pourront être livrés au site de Wallers Arenberg pendant le montage, aux risques et périls de l’expéditeur, dans la mesure où le nom de l’exposition, celui de la société concernée, celui de son représentant et le numéro du stand seront clairement indiqués sur le colis.',
      'Les colis ne pourront être acceptés avant le montage (voir informations pratiques dans le « Guide de l’Exposant »).'
    ]
  },
  {
    title: '19. Contrôle des accès',
    paragraphs: [
      'L’accès au site de Wallers Arenberg est réglementé par le service de sécurité pour les périodes de montage et de démontage et pour la durée de l’ouverture du salon.',
      'L’Organisateur se réserve le droit d’interdire l’accès au salon ou d’expulser toute personne dont l’attitude ou la tenue vestimentaire sera jugée incompatible avec l’image de marque de l’établissement et de la manifestation ou qui refuserait de se conformer au règlement de sécurité des lieux.'
    ]
  },
  {
    title: '20. Clause attributive de juridiction',
    paragraphs: [
      'En cas de difficulté d’interprétation du présent règlement et de litige pouvant surgir à l’occasion de la conclusion et de l’exécution du contrat, notamment pendant l’exposition, il est fait attribution expresse de compétence aux tribunaux de Valenciennes, et ce même en cas de pluralité de défendeurs ou d’appels de garantie.'
    ]
  },
  {
    title: '21. Obligations',
    paragraphs: [
      'L’exposant atteste sur l’honneur et certifie que le travail réalisé à cette occasion sera effectué par des salariés employés régulièrement au regard des articles L 143-3, L143-5,L341-6 et L620-3 du code du travail.',
      'Les articles L143-3 et L143-5 du code du travail sont relatifs au mode de paiement du salarié : obligation de remettre un bulletin de salaire et de tenir un livre de paie.',
      'L’article L341-6 du code du travail est relatif à l’interdiction de faire travailler un étranger non muni du titre l’autorisant à exercer une activité salariée en France.',
      'L’article L620-3 est relatif à l’obligation de faire une déclaration préalable d’embauche à l’administration concernée et de tenir un registre des mouvements du personnel.'
    ]
  },
  {
    title: '22. RGPD',
    paragraphs: [
      '« Les informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé par la Porte du Hainaut Développement, dans le but d’assurer la gestion de votre participation au Salon Made in Hainaut et de respect de nos obligations légales.',
      'Elles sont conservées pendant la durée du contrat augmentée des délais légaux applicables. Conformément aux lois « informatique & liberté » et « RGPD », vous pouvez exercer vos droits suivants : Le droit d’accès, le droit de rectification, le droit à l’effacement, le droit à la limitation du traitement, le droit à la portabilité des données, le droit d’opposition au traitement des données, le droit à être informé d’une violation des données en cas de risques élevés pour les intéressés.',
      'Elles peuvent exercer leur droit en s’adressant à DPD@agglo-porteduhainaut.fr ou Service DPD Avenue Michel Rondet, 59135 Wallers »'
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
  onComplete,
  submissionError,
  isSubmitting
}: EngagementPageProps) {
  const [showRegulationModal, setShowRegulationModal] = useState(false);
  const [hasScrolledRegulation, setHasScrolledRegulation] = useState(false);
  const [manualAcknowledgement, setManualAcknowledgement] = useState(false);
  const regulationContainerRef = useRef<HTMLDivElement | null>(null);
  const regulationSentinelRef = useRef<HTMLDivElement | null>(null);
  const submissionMessages = submissionError ? submissionError.split(' • ').filter(Boolean) : [];
  
  // Générer automatiquement la date et l'heure du jour
  useEffect(() => {
    if (!engagementData.dateSignature) {
      onEngagementChange('dateSignature', formatSignatureDate(new Date()));
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
    if (isSubmitting) {
      return;
    }
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
              <div className="flex items-start gap-3">
                <Checkbox
                  id="accepteCommunication"
                  checked={engagementData.accepteCommunication}
                  onCheckedChange={(checked) => onEngagementChange('accepteCommunication', checked === true)}
                  className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0] mt-1"
                />
                <Label
                  htmlFor="accepteCommunication"
                  className="font-[Poppins] leading-relaxed"
                >
                  J’accepte de recevoir des informations et invitations concernant les événements organisés par Porte du Hainaut Développement.
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature et cachet */}
        <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.primary, borderWidth: "2px", borderRadius: "12px" }}>
          <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.primary, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
            {/* <CardTitle className="text-white font-[Poppins]">SIGNATURE ET CACHET</CardTitle> */}
            <CardTitle className="text-white font-[Poppins]">SIGNATURE</CardTitle>
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

              {/* <div>
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
              </div> */}
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

        {submissionError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold text-red-800 mb-2">Impossible de finaliser l'inscription</p>
            {submissionMessages.length > 1 ? (
              <ul className="list-disc list-inside space-y-1">
                {submissionMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            ) : (
              <p>{submissionMessages[0] ?? submissionError}</p>
            )}
          </div>
        )}

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
              !engagementData.accepteReglement || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: engagementData.accepteReglement ? COLORS.secondary : '#gray', borderRadius: "8px" }}
            onClick={handleComplete}
            disabled={!engagementData.accepteReglement || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              'Valider et Générer les Documents'
            )}
          </Button>
        </div>
      </CardContent>
      <Dialog open={showRegulationModal} onOpenChange={handleModalOpenChange}>
      <DialogContent
        className="sm:max-w-4xl w-full overflow-hidden"
        style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}
      >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Règlement du Salon Made in Hainaut</DialogTitle>
            <DialogDescription>
              Faites défiler l'intégralité du règlement avant de confirmer votre acceptation.
            </DialogDescription>
          </DialogHeader>
          <div
            ref={regulationContainerRef}
            onScroll={handleRegulationScroll}
            className="flex-1 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-4"
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
            className="mt-4 inline-block text-sm font-semibold underline flex-shrink-0"
            style={{ color: COLORS.secondary }}
          >
            Télécharger le règlement au format PDF
          </a>
          <div className="mt-4 flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 flex-shrink-0">
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
          <DialogFooter className="flex-shrink-0">
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