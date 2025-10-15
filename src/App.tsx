import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CurrentPage } from './lib/types';
import { calculateTotals } from './lib/calculateTotals';
import { useFormData } from './hooks/useFormData';
import { generateContractZipBlob, downloadZipFromBlob, ZipAsset } from './lib/documentGenerator';
import { submitFormData, uploadSubmissionDocument } from './lib/api';
import { Header } from './components/shared/Header';
import { ProgressIndicator } from './components/shared/ProgressIndicator';
import { IdentityPage } from './components/pages/IdentityPage';
import { ReservationPage } from './components/pages/ReservationPage';
import { AmenagementPage } from './components/pages/AmenagementPage';
import { ComplementairesPage } from './components/pages/ComplementairesPage';
import { VisibilitePage } from './components/pages/VisibilitePage';
import { EngagementPage } from './components/pages/EngagementPage';
import { ThanksPage } from './components/pages/ThanksPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('identity');
  const [savedIdentityData, setSavedIdentityData] = useState(null);
  const [zipAsset, setZipAsset] = useState<ZipAsset | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    reservationData,
    amenagementData,
    visibiliteData,
    engagementData,
    villeSuggestions,
    showVilleSuggestions,
    isLoadingVilles,
    handleInputChange,
    handleSiretChange,
    handleTvaIntraChange,
    handleActiviteChange,
    handleVilleChange,
    handlePaysChange,
    handleCodePostalChange,
    selectVille,
    handleEnseigneChange,
    handleReservationChange,
    handleAmenagementChange,
    handleVisibiliteChange,
    handleEngagementChange,
    resetDataFromReservation,
    loadIdentityData,
    addCoExposant,
    removeCoExposant,
    updateCoExposant,
    isSiretValid,
    isTvaIntraValid,
    handlePhoneChange,
    isPhoneValid,
    isEmailValid
  } = useFormData();

  const totalsBreakdown = useMemo(() => calculateTotals(reservationData, amenagementData, visibiliteData), [reservationData, amenagementData, visibiliteData]);
  const totalHT1 = totalsBreakdown.ht1;
  const totalHT2 = totalsBreakdown.ht2;
  const totalHT3 = totalsBreakdown.ht3;
  const totalHT4 = totalsBreakdown.ht4;
  const totalHT = totalsBreakdown.ht;
  const tva = totalsBreakdown.tva;
  const totalTTC = totalsBreakdown.ttc;

  const collectSubmissionIssues = () => {
    const issues: string[] = [];

    const emailChecks: Array<{ value: string; label: string; required?: boolean }> = [
      { value: formData.contactComptaMail, label: "Email (Comptabilité)", required: true },
      { value: formData.responsableMail, label: "Email (Responsable de l'entreprise)", required: true },
      { value: formData.respOpMail, label: "Email (Responsable opérationnel)", required: true },
    ];

    emailChecks.forEach(({ value, label, required }) => {
      const trimmed = value.trim();
      if (required && trimmed === '') {
        issues.push(`${label} est requis.`);
      } else if (trimmed !== '' && !isEmailValid(trimmed)) {
        issues.push(`${label} est invalide.`);
      }
    });

    reservationData.coExposants.forEach((coExposant, index) => {
      const labelSuffix = `co-exposant #${index + 1}`;
      if (!coExposant.nomEntreprise.trim()) {
        issues.push(`Le nom de l'entreprise du ${labelSuffix} est requis.`);
      }
      const emailValue = coExposant.mailResponsable.trim();
      if (emailValue !== '' && !isEmailValid(emailValue)) {
        issues.push(`L'email du responsable du ${labelSuffix} est invalide.`);
      }
    });

    return issues;
  };

  const handleComplete = async () => {
    const issues = collectSubmissionIssues();
    if (issues.length > 0) {
      setSubmissionError(issues.join(' \u2022 '));
      window.scrollTo(0, 0);
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    const submittedAt = new Date().toISOString();
    const totals = {
      totalHT1,
      totalHT2,
      totalHT3,
      totalHT4,
      totalHT,
      tva,
      totalTTC,
    };

    // Sauvegarder les données d'identité pour un éventuel retour
    setSavedIdentityData(formData);

    let createdSubmissionId: string | null = null;
    try {
      const submissionResponse = await submitFormData({
        formData,
        reservationData,
        amenagementData,
        visibiliteData,
        engagementData,
        totals,
        submittedAt,
      });
      createdSubmissionId = submissionResponse.id;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde en base de données:', error);
      setSubmissionError(error instanceof Error ? error.message : 'Erreur inconnue lors de la sauvegarde.');
      setIsSubmitting(false);
      return;
    }

    let generatedAsset: ZipAsset | null = null;
    try {
      generatedAsset = await generateContractZipBlob(
        formData,
        reservationData,
        amenagementData,
        visibiliteData,
        engagementData,
        totalHT1,
        totalHT2,
        totalHT3,
        totalHT4,
        totalHT,
        tva,
        totalTTC
      );
      setZipAsset(generatedAsset);
      downloadZipFromBlob(generatedAsset.blob, generatedAsset.filename);
    } catch (error) {
      console.error('Erreur lors de la génération du contrat:', error);
    } finally {
      setCurrentPage('thanks');
    }

    if (createdSubmissionId && generatedAsset) {
      uploadSubmissionDocument(createdSubmissionId, generatedAsset.blob, generatedAsset.filename).catch((error) => {
        console.error('Erreur lors de l’envoi des documents:', error);
      });
    }

    setIsSubmitting(false);
  };

  const handleRestartFromReservation = () => {
    if (savedIdentityData) {
      // Restaurer les données d'identité et remettre à zéro le reste
      loadIdentityData(savedIdentityData);
      resetDataFromReservation();
    }
    setZipAsset(null);
    setCurrentPage('reservation');
  };

  // Variants pour les animations de transition entre pages
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: -20,
      scale: 0.98
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'identity':
        return (
          <IdentityPage
            formData={formData}
            villeSuggestions={villeSuggestions}
            showVilleSuggestions={showVilleSuggestions}
            isLoadingVilles={isLoadingVilles}
            onInputChange={handleInputChange}
            onSiretChange={handleSiretChange}
            onTvaIntraChange={handleTvaIntraChange}
            onActiviteChange={handleActiviteChange}
            onVilleChange={handleVilleChange}
            onPaysChange={handlePaysChange}
            onCodePostalChange={handleCodePostalChange}
            onSelectVille={selectVille}
            onEnseigneChange={handleEnseigneChange}
            isSiretValid={isSiretValid}
            isTvaIntraValid={isTvaIntraValid}
            onPhoneChange={handlePhoneChange}
            isPhoneValid={isPhoneValid}
            isEmailValid={isEmailValid}
            onNext={() => setCurrentPage('reservation')}
          />
        );
      case 'reservation':
        return (
          <ReservationPage
            reservationData={reservationData}
            onReservationChange={handleReservationChange}
            totalHT1={totalHT1}
            onBack={() => setCurrentPage('identity')}
            onNext={() => setCurrentPage('amenagements')}
            addCoExposant={addCoExposant}
            removeCoExposant={removeCoExposant}
            updateCoExposant={updateCoExposant}
            isEmailValid={isEmailValid}
          />
        );
      case 'amenagements':
        return (
          <AmenagementPage
            amenagementData={amenagementData}
            reservationData={reservationData}
            onAmenagementChange={handleAmenagementChange}
            totalHT1={totalHT1}
            totalHT2={totalHT2}
            onBack={() => setCurrentPage('reservation')}
            onNext={() => setCurrentPage('complementaires')}
          />
        );
      case 'complementaires':
        return (
          <ComplementairesPage
            amenagementData={amenagementData}
            reservationData={reservationData}
            onAmenagementChange={handleAmenagementChange}
            totalHT1={totalHT1}
            totalHT2={totalHT2}
            totalHT3={totalHT3}
            onBack={() => setCurrentPage('amenagements')}
            onNext={() => setCurrentPage('visibilite')}
          />
        );
      case 'visibilite':
        return (
          <VisibilitePage
            visibiliteData={visibiliteData}
            reservationData={reservationData}
            amenagementData={amenagementData}
            onVisibiliteChange={handleVisibiliteChange}
            totalHT1={totalHT1}
            totalHT2={totalHT2}
            totalHT3={totalHT3}
            totalHT4={totalHT4}
            onBack={() => setCurrentPage('complementaires')}
            onNext={() => setCurrentPage('engagement')}
          />
        );
      case 'engagement':
        return (
          <EngagementPage
            engagementData={engagementData}
            formData={formData}
            reservationData={reservationData}
            amenagementData={amenagementData}
            visibiliteData={visibiliteData}
            onEngagementChange={handleEngagementChange}
            totalHT1={totalHT1}
            totalHT2={totalHT2}
            totalHT3={totalHT3}
            totalHT4={totalHT4}
            totalHT={totalHT}
            tva={tva}
            totalTTC={totalTTC}
            onBack={() => setCurrentPage('visibilite')}
            onComplete={handleComplete}
            submissionError={submissionError}
            isSubmitting={isSubmitting}
          />
        );
      case 'thanks':
        return (
          <ThanksPage
            formData={formData}
            reservationData={reservationData}
            amenagementData={amenagementData}
            visibiliteData={visibiliteData}
            engagementData={engagementData}
            totalHT1={totalHT1}
            totalHT2={totalHT2}
            totalHT3={totalHT3}
            totalHT4={totalHT4}
            totalHT={totalHT}
            tva={tva}
            totalTTC={totalTTC}
            zipAsset={zipAsset}
            onRestartFromReservation={savedIdentityData ? handleRestartFromReservation : undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Header />
        </motion.div>
        
        {currentPage !== 'thanks' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <ProgressIndicator currentPage={currentPage} />
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
