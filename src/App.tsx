import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CurrentPage } from './lib/types';
import { calculateTotalHT1, calculateTotalHT2, calculateTotalHT3 } from './lib/utils';
import { useFormData } from './hooks/useFormData';
import { fillAndDownloadContractPdf } from './lib/pdfFiller';
import { generateContractZip } from './lib/documentGenerator';
import { submitFormData } from './lib/api';
import { Header } from './components/shared/Header';
import { ProgressIndicator } from './components/shared/ProgressIndicator';
import { IdentityPage } from './components/pages/IdentityPage';
import { ReservationPage } from './components/pages/ReservationPage';
import { AmenagementPage } from './components/pages/AmenagementPage';
import { VisibilitePage } from './components/pages/VisibilitePage';
import { EngagementPage } from './components/pages/EngagementPage';
import { ThanksPage } from './components/pages/ThanksPage';
import { mockFormData, mockReservationData, mockAmenagementData, mockVisibiliteData, mockEngagementData } from './lib/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('identity');
  const [totalHT1, setTotalHT1] = useState(0);
  const [totalHT2, setTotalHT2] = useState(0);
  const [totalHT3, setTotalHT3] = useState(0);
  const [savedIdentityData, setSavedIdentityData] = useState(null);
  
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
    isPhoneValid
  } = useFormData();

  // Calcul automatique des totaux
  useEffect(() => {
    setTotalHT1(calculateTotalHT1(reservationData));
  }, [reservationData]);

  useEffect(() => {
    setTotalHT2(calculateTotalHT2(amenagementData));
  }, [amenagementData]);

  useEffect(() => {
    setTotalHT3(calculateTotalHT3(visibiliteData));
  }, [visibiliteData]);

  // Calculs finaux
  const totalHT = totalHT1 + totalHT2 + totalHT3;
  const tva = totalHT * 0.20;
  const totalTTC = totalHT + tva;

  // Dev/test: URL ?pdfMock=1 génère un PDF rempli avec des données mock
  useEffect(() => {
    if ((import.meta as any).env?.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('pdfMock')) {
        fillAndDownloadContractPdf(
          mockFormData,
          mockReservationData,
          mockAmenagementData,
          mockVisibiliteData,
          mockEngagementData,
          { mockAll: true }
        ).catch((e) => console.error('PDF mock generation failed', e));
      } else if (params.has('pdfFieldsCsv')) {
        import('./lib/pdfFiller').then(m => m.downloadContractPdfFieldsCsv()).catch((e) => console.error(e));
      }
    }
  }, []);

  const handleComplete = async () => {
    const submittedAt = new Date().toISOString();
    const totals = {
      totalHT1,
      totalHT2,
      totalHT3,
      totalHT,
      tva,
      totalTTC,
    };

    // Sauvegarder les données d'identité pour un éventuel retour
    setSavedIdentityData(formData);

    try {
      await submitFormData({
        formData,
        reservationData,
        amenagementData,
        visibiliteData,
        engagementData,
        totals,
        submittedAt,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde en base de données:', error);
    }

    try {
      await generateContractZip(
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
        totalTTC
      );
    } catch (error) {
      console.error('Erreur lors de la génération du contrat:', error);
    } finally {
      setCurrentPage('thanks');
    }
  };

  const handleRestartFromReservation = () => {
    if (savedIdentityData) {
      // Restaurer les données d'identité et remettre à zéro le reste
      loadIdentityData(savedIdentityData);
      resetDataFromReservation();
    }
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
            onBack={() => setCurrentPage('amenagements')}
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
            totalHT={totalHT}
            tva={tva}
            totalTTC={totalTTC}
            onBack={() => setCurrentPage('visibilite')}
            onComplete={handleComplete}
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
            totalHT={totalHT}
            tva={tva}
            totalTTC={totalTTC}
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
