import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormData } from '../../lib/types';
import { validateIdentityPage, isFieldInError, getFieldTitle } from '../../lib/utils';
import { COLORS } from '../../lib/constants';

interface IdentityPageProps {
  formData: FormData;
  villeSuggestions: { nom: string; codePostal: string }[];
  showVilleSuggestions: boolean;
  isLoadingVilles: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  onSiretChange: (value: string) => void;
  onTvaIntraChange: (value: string) => void;
  onActiviteChange: (activite: string, checked: boolean) => void;
  onVilleChange: (field: string, value: string) => void;
  onPaysChange: (field: string, value: string) => void;
  onCodePostalChange: (field: string, value: string) => void;
  onSelectVille: (villeName: string) => void;
  onEnseigneChange: (value: string) => void;
  isSiretValid: (siret: string) => boolean;
  isTvaIntraValid: (tva: string) => boolean;
  onPhoneChange: (field: string, value: string) => void;
  isPhoneValid: (phone: string) => boolean;
  onNext: () => void;
}

export function IdentityPage({
  formData,
  villeSuggestions,
  showVilleSuggestions,
  isLoadingVilles,
  onInputChange,
  onSiretChange,
  onTvaIntraChange,
  onActiviteChange,
  onVilleChange,
  onPaysChange,
  onCodePostalChange,
  onSelectVille,
  onEnseigneChange,
  isSiretValid,
  isTvaIntraValid,
  onPhoneChange,
  isPhoneValid,
  onNext
}: IdentityPageProps) {
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [countryDetected, setCountryDetected] = useState(false);

  // Optimisation : Mémoriser les champs valides pour éviter les re-calculs
  const validFields = useMemo(() => {
    const fields: string[] = [];
    const stringFields = [
      'raisonSociale', 'enseigne', 'adresse', 'codePostal', 'ville', 'pays', 'tel', 
      'siteInternet', 'siret', 'tvaIntra', 'facturationAdresse', 'facturationCP', 
      'facturationVille', 'facturationPays', 'contactComptaNom', 'contactComptaTel', 
      'contactComptaMail', 'responsableNom', 'responsablePrenom', 'responsableTel', 
      'responsableMail', 'respOpNom', 'respOpPrenom', 'respOpTel', 'respOpMail', 'autreActivite'
    ];
    
    stringFields.forEach(field => {
      const value = formData[field as keyof FormData] as string;
      if (value && value.trim() !== '') {
        // Validation spéciale pour Siret, TVA et téléphones
        if (field === 'siret') {
          if (isSiretValid(value)) fields.push(field);
        } else if (field === 'tvaIntra') {
          if (isTvaIntraValid(value)) fields.push(field);
        } else if (field === 'tel' || field === 'contactComptaTel' || field === 'responsableTel' || field === 'respOpTel') {
          if (isPhoneValid(value)) fields.push(field);
        } else {
          fields.push(field);
        }
      }
    });
    
    return fields;
  }, [
    formData.raisonSociale, formData.enseigne, formData.adresse, formData.codePostal, 
    formData.ville, formData.pays, formData.tel, formData.siteInternet, formData.siret, 
    formData.tvaIntra, formData.facturationAdresse, formData.facturationCP, 
    formData.facturationVille, formData.facturationPays, formData.contactComptaNom, 
    formData.contactComptaTel, formData.contactComptaMail, formData.responsableNom, 
    formData.responsablePrenom, formData.responsableTel, formData.responsableMail, 
    formData.respOpNom, formData.respOpPrenom, formData.respOpTel, formData.respOpMail, 
    formData.autreActivite, isSiretValid, isTvaIntraValid, isPhoneValid
  ]);

  // Animation variants simplifiées
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { 
      opacity: 0, 
      y: -20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Effet pour l'animation de détection du pays
  useEffect(() => {
    if (formData.pays && formData.pays !== '') {
      setCountryDetected(true);
      const timer = setTimeout(() => setCountryDetected(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [formData.pays]);

  const handleNext = useCallback(() => {
    const missingFields = validateIdentityPage(formData);
    
    if (missingFields.length > 0) {
      setErrorFields(missingFields);
      setShowErrors(true);
      
      // Scroll vers le premier champ en erreur
      setTimeout(() => {
        const firstErrorField = document.querySelector(`[data-error="true"]`) as HTMLElement;
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }
    
    setErrorFields([]);
    setShowErrors(false);
    window.scrollTo(0, 0);
    onNext();
  }, [formData, onNext]);

  // Fonction pour déterminer les statuts des champs
  const getFieldStatus = useCallback((field: string) => {
    const isError = isFieldInError(field, errorFields);
    let hasFormatError = false;
    
    if (field === 'siret' && formData.siret && !isSiretValid(formData.siret)) {
      hasFormatError = true;
    }
    if (field === 'tvaIntra' && formData.tvaIntra && !isTvaIntraValid(formData.tvaIntra)) {
      hasFormatError = true;
    }
    // Validation pour les champs téléphone
    if ((field === 'tel' || field === 'contactComptaTel' || field === 'responsableTel' || field === 'respOpTel') && 
        formData[field as keyof FormData] && !isPhoneValid(formData[field as keyof FormData] as string)) {
      hasFormatError = true;
    }
    
    const isValid = validFields.includes(field) && !isError && !hasFormatError;
    
    return { isError, hasFormatError, isValid };
  }, [errorFields, formData.siret, formData.tvaIntra, formData.tel, formData.contactComptaTel, formData.responsableTel, formData.respOpTel, validFields, isSiretValid, isTvaIntraValid, isPhoneValid]);

  // Fonction pour obtenir les messages informatifs
  const getFieldMessage = useCallback((field: string) => {
    if (field === 'siret' && formData.siret && formData.siret.length > 0) {
      return `${formData.siret.length}/14 chiffres`;
    }
    if (field === 'tvaIntra' && formData.tvaIntra && formData.tvaIntra.length > 0) {
      return `${formData.tvaIntra.length}/13 caractères (2 lettres + 11 chiffres)`;
    }
    // Messages pour les champs téléphone
    if (field === 'tel' && formData.tel && formData.tel.length > 0) {
      return `${formData.tel.length} chiffres (minimum 8)`;
    }
    if (field === 'contactComptaTel' && formData.contactComptaTel && formData.contactComptaTel.length > 0) {
      return `${formData.contactComptaTel.length} chiffres (minimum 8)`;
    }
    if (field === 'responsableTel' && formData.responsableTel && formData.responsableTel.length > 0) {
      return `${formData.responsableTel.length} chiffres (minimum 8)`;
    }
    if (field === 'respOpTel' && formData.respOpTel && formData.respOpTel.length > 0) {
      return `${formData.respOpTel.length} chiffres (minimum 8)`;
    }
    return '';
  }, [formData.siret, formData.tvaIntra, formData.tel, formData.contactComptaTel, formData.responsableTel, formData.respOpTel]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 font-[Poppins]"
    >
      <Card className="mb-8">
        <CardContent className="p-8">
          {/* Header animé */}
          <motion.div 
            variants={headerVariants}
            className="text-white p-4 rounded-lg mb-8 relative overflow-hidden"
            style={{ backgroundColor: COLORS.primary }}
          >
            <h1 className="text-2xl font-bold relative z-10">VOTRE IDENTITÉ</h1>
          </motion.div>

          {/* Message d'erreur global */}
          <AnimatePresence>
            {showErrors && errorFields.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <h3 className="font-semibold text-red-800 mb-2">Veuillez remplir les champs obligatoires suivants :</h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {errorFields.map((field) => (
                    <li key={field}>{getFieldTitle(field)}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Informations de base */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.secondary }}>
              <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.secondary }}>
                <CardTitle className="text-white font-[Poppins]">INFORMATIONS DE BASE</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Raison sociale */}
                  <div className="relative">
                    <Label 
                      htmlFor="raisonSociale"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('raisonSociale').isError ? 'text-red-600' : 
                        getFieldStatus('raisonSociale').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Raison sociale *
                      {getFieldStatus('raisonSociale').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="raisonSociale"
                      value={formData.raisonSociale}
                      onChange={(e) => onInputChange('raisonSociale', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('raisonSociale').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('raisonSociale').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('raisonSociale').isError}
                    />
                    {getFieldStatus('raisonSociale').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Enseigne */}
                  <div className="relative">
                    <Label 
                      htmlFor="enseigne"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('enseigne').isError ? 'text-red-600' : 
                        getFieldStatus('enseigne').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Enseigne (nom du stand) *
                      {getFieldStatus('enseigne').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="enseigne"
                      value={formData.enseigne}
                      onChange={(e) => onEnseigneChange(e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('enseigne').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('enseigne').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('enseigne').isError}
                    />
                    {getFieldStatus('enseigne').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Adresse */}
                  <div className="relative">
                    <Label 
                      htmlFor="adresse"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('adresse').isError ? 'text-red-600' : 
                        getFieldStatus('adresse').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Adresse *
                      {getFieldStatus('adresse').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="adresse"
                      value={formData.adresse}
                      onChange={(e) => onInputChange('adresse', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('adresse').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('adresse').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('adresse').isError}
                    />
                    {getFieldStatus('adresse').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Code postal */}
                  <div className="relative">
                    <Label 
                      htmlFor="codePostal" 
                      className={`font-[Poppins] font-medium ${isFieldInError('codePostal', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Code postal *
                    </Label>
                    <div className="relative">
                      <Input 
                        id="codePostal"
                        value={formData.codePostal}
                        onChange={(e) => onCodePostalChange('codePostal', e.target.value)}
                        className={`mt-1 font-[Poppins] transition-all duration-200 ${
                          isFieldInError('codePostal', errorFields) 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                        }`}
                        data-error={isFieldInError('codePostal', errorFields)}
                        placeholder="59135 (France) ou 1000 (Belgique)"
                      />
                      <AnimatePresence>
                        {isLoadingVilles && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1"
                          >
                            <Loader2 className="h-4 w-4 animate-spin text-[#3DB5A0]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Ville */}
                  <div className="relative">
                    <Label 
                      htmlFor="ville" 
                      className={`font-[Poppins] font-medium ${isFieldInError('ville', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Ville *
                    </Label>
                    <Input 
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => onVilleChange('ville', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('ville', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('ville', errorFields)}
                      placeholder={formData.pays === 'FRANCE' ? 'Ex: VALENCIENNES' : formData.pays === 'BELGIQUE' ? 'Ex: BRUXELLES' : 'Ville (auto-complétée par code postal)'}
                    />
                    
                    {/* Suggestions de villes */}
                    <AnimatePresence>
                      {showVilleSuggestions && villeSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                        >
                          <div className="p-2 text-xs text-gray-500 font-[Poppins] border-b">
                            Plusieurs villes trouvées pour ce code postal en {formData.pays} :
                          </div>
                          {villeSuggestions.map((ville, index) => (
                            <button
                              key={`${ville.nom}-${index}`}
                              onClick={() => onSelectVille(ville.nom)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 font-[Poppins] text-sm transition-colors duration-150"
                            >
                              {ville.nom}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Pays */}
                  <div className="relative">
                    <Label 
                      htmlFor="pays" 
                      className={`font-[Poppins] font-medium ${isFieldInError('pays', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Pays *
                      <AnimatePresence>
                        {countryDetected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-block ml-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#3DB5A0] inline" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Label>
                    <Input 
                      id="pays"
                      value={formData.pays}
                      onChange={(e) => onPaysChange('pays', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('pays', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : countryDetected
                          ? 'border-[#3DB5A0] focus:ring-[#3DB5A0]'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('pays', errorFields)}
                      placeholder={formData.pays || "Auto-détecté par code postal"}
                    />
                  </div>

                  {/* Téléphone - Chiffres uniquement */}
                  <div className="relative">
                    <Label 
                      htmlFor="tel"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('tel').isError || getFieldStatus('tel').hasFormatError ? 'text-red-600' : 
                        getFieldStatus('tel').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Téléphone *
                      {getFieldStatus('tel').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="tel"
                      type="tel"
                      value={formData.tel}
                      onChange={(e) => onPhoneChange('tel', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('tel').isError || getFieldStatus('tel').hasFormatError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('tel').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('tel').isError || getFieldStatus('tel').hasFormatError}
                      placeholder="Chiffres uniquement (ex: 0123456789)"
                    />
                    {(getFieldStatus('tel').isError || getFieldStatus('tel').hasFormatError) && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {getFieldMessage('tel') && (
                      <div className={`text-xs mt-1 transition-colors duration-200 ${
                        getFieldStatus('tel').hasFormatError ? 'text-red-500' : 
                        getFieldStatus('tel').isValid ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {getFieldMessage('tel')}
                      </div>
                    )}
                  </div>

                  {/* Site internet */}
                  <div className="relative">
                    <Label 
                      htmlFor="siteInternet"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('siteInternet').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Site internet
                      {getFieldStatus('siteInternet').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="siteInternet"
                      type="url"
                      value={formData.siteInternet}
                      onChange={(e) => onInputChange('siteInternet', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('siteInternet').isValid
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                    />
                  </div>

                  {/* Siret */}
                  <div className="relative">
                    <Label 
                      htmlFor="siret"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('siret').isError || getFieldStatus('siret').hasFormatError ? 'text-red-600' : 
                        getFieldStatus('siret').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Siret *
                      {getFieldStatus('siret').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="siret"
                      value={formData.siret}
                      onChange={(e) => onSiretChange(e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('siret').isError || getFieldStatus('siret').hasFormatError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('siret').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('siret').isError || getFieldStatus('siret').hasFormatError}
                      placeholder="14 chiffres (ex: 12345678901234)"
                    />
                    {(getFieldStatus('siret').isError || getFieldStatus('siret').hasFormatError) && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {getFieldMessage('siret') && (
                      <div className={`text-xs mt-1 transition-colors duration-200 ${
                        getFieldStatus('siret').hasFormatError ? 'text-red-500' : 
                        getFieldStatus('siret').isValid ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {getFieldMessage('siret')}
                      </div>
                    )}
                  </div>

                  {/* TVA Intercommunautaire */}
                  <div className="relative">
                    <Label 
                      htmlFor="tvaIntra"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('tvaIntra').isError || getFieldStatus('tvaIntra').hasFormatError ? 'text-red-600' : 
                        getFieldStatus('tvaIntra').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      TVA Intercommunautaire *
                      {getFieldStatus('tvaIntra').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="tvaIntra"
                      value={formData.tvaIntra}
                      onChange={(e) => onTvaIntraChange(e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('tvaIntra').isError || getFieldStatus('tvaIntra').hasFormatError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('tvaIntra').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('tvaIntra').isError || getFieldStatus('tvaIntra').hasFormatError}
                      placeholder="2 lettres + 11 chiffres (ex: FR12345678901)"
                    />
                    {(getFieldStatus('tvaIntra').isError || getFieldStatus('tvaIntra').hasFormatError) && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {getFieldMessage('tvaIntra') && (
                      <div className={`text-xs mt-1 transition-colors duration-200 ${
                        getFieldStatus('tvaIntra').hasFormatError ? 'text-red-500' : 
                        getFieldStatus('tvaIntra').isValid ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {getFieldMessage('tvaIntra')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="membreAssociation"
                      checked={formData.membreAssociation}
                      onCheckedChange={(checked) => onInputChange('membreAssociation', checked)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="membreAssociation" className="font-[Poppins]">
                      Membre de Porte du Hainaut Développement
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="exposant2024"
                      checked={formData.exposant2024}
                      onCheckedChange={(checked) => onInputChange('exposant2024', checked)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="exposant2024" className="font-[Poppins]">
                      J'étais exposant en 2024
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Secteur d'activité */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.primary }}>
              <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.primary }}>
                <CardTitle className="text-white font-[Poppins]">SECTEUR D'ACTIVITÉ</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="mb-4 text-sm text-gray-600 font-[Poppins]">
                  Sélectionnez au moins une activité correspondant à votre secteur :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="industrie"
                      checked={formData.activites.industrie}
                      onCheckedChange={(checked) => onActiviteChange('industrie', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="industrie" className="font-[Poppins]">Industrie</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="transportLogistique"
                      checked={formData.activites.transportLogistique}
                      onCheckedChange={(checked) => onActiviteChange('transportLogistique', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="transportLogistique" className="font-[Poppins]">Transport & logistique</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="btpConstructionLogement"
                      checked={formData.activites.btpConstructionLogement}
                      onCheckedChange={(checked) => onActiviteChange('btpConstructionLogement', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="btpConstructionLogement" className="font-[Poppins]">BTP construction & logement</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="environnementEnergie"
                      checked={formData.activites.environnementEnergie}
                      onCheckedChange={(checked) => onActiviteChange('environnementEnergie', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="environnementEnergie" className="font-[Poppins]">Environnement Énergie et développement durable</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="servicesEntreprises"
                      checked={formData.activites.servicesEntreprises}
                      onCheckedChange={(checked) => onActiviteChange('servicesEntreprises', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="servicesEntreprises" className="font-[Poppins]">Services aux entreprises</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="imageNouvellesTechnologies"
                      checked={formData.activites.imageNouvellesTechnologies}
                      onCheckedChange={(checked) => onActiviteChange('imageNouvellesTechnologies', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="imageNouvellesTechnologies" className="font-[Poppins]">Image & nouvelles technologies</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tourismeBienEtre"
                      checked={formData.activites.tourismeBienEtre}
                      onCheckedChange={(checked) => onActiviteChange('tourismeBienEtre', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="tourismeBienEtre" className="font-[Poppins]">Tourisme & bien-être</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="autre"
                      checked={formData.activites.autre}
                      onCheckedChange={(checked) => onActiviteChange('autre', checked as boolean)}
                      className="data-[state=checked]:bg-[#3DB5A0] data-[state=checked]:border-[#3DB5A0]"
                    />
                    <Label htmlFor="autre" className="font-[Poppins]">Autre</Label>
                  </div>
                </div>

                {formData.activites.autre && (
                  <div className="mt-4">
                    <Label 
                      htmlFor="autreActivite" 
                      className={`font-[Poppins] font-medium ${isFieldInError('autreActivite', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Précisez votre secteur d'activité :
                    </Label>
                    <Input 
                      id="autreActivite"
                      value={formData.autreActivite}
                      onChange={(e) => onInputChange('autreActivite', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('autreActivite', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('autreActivite', errorFields)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Adresse de facturation */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.secondary }}>
              <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.secondary }}>
                <CardTitle className="text-white font-[Poppins]">ADRESSE DE FACTURATION</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label 
                      htmlFor="facturationAdresse" 
                      className={`font-[Poppins] font-medium ${isFieldInError('facturationAdresse', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Adresse *
                    </Label>
                    <Input 
                      id="facturationAdresse"
                      value={formData.facturationAdresse}
                      onChange={(e) => onInputChange('facturationAdresse', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('facturationAdresse', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('facturationAdresse', errorFields)}
                    />
                  </div>

                  <div>
                    <Label 
                      htmlFor="facturationCP" 
                      className={`font-[Poppins] font-medium ${isFieldInError('facturationCP', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Code postal *
                    </Label>
                    <Input 
                      id="facturationCP"
                      value={formData.facturationCP}
                      onChange={(e) => onCodePostalChange('facturationCP', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('facturationCP', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('facturationCP', errorFields)}
                    />
                  </div>

                  <div>
                    <Label 
                      htmlFor="facturationVille" 
                      className={`font-[Poppins] font-medium ${isFieldInError('facturationVille', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Ville *
                    </Label>
                    <Input 
                      id="facturationVille"
                      value={formData.facturationVille}
                      onChange={(e) => onVilleChange('facturationVille', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('facturationVille', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('facturationVille', errorFields)}
                    />
                  </div>

                  <div>
                    <Label 
                      htmlFor="facturationPays" 
                      className={`font-[Poppins] font-medium ${isFieldInError('facturationPays', errorFields) ? 'text-red-600' : ''}`}
                    >
                      Pays *
                    </Label>
                    <Input 
                      id="facturationPays"
                      value={formData.facturationPays}
                      onChange={(e) => onPaysChange('facturationPays', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        isFieldInError('facturationPays', errorFields) 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={isFieldInError('facturationPays', errorFields)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact comptabilité */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.primary }}>
              <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.primary }}>
                <CardTitle className="text-white font-[Poppins]">CONTACT COMPTABILITÉ</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label 
                      htmlFor="contactComptaNom"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('contactComptaNom').isError ? 'text-red-600' : 
                        getFieldStatus('contactComptaNom').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Nom *
                      {getFieldStatus('contactComptaNom').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="contactComptaNom"
                      value={formData.contactComptaNom}
                      onChange={(e) => onInputChange('contactComptaNom', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('contactComptaNom').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('contactComptaNom').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('contactComptaNom').isError}
                    />
                    {getFieldStatus('contactComptaNom').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="contactComptaTel"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('contactComptaTel').isError || getFieldStatus('contactComptaTel').hasFormatError ? 'text-red-600' : 
                        getFieldStatus('contactComptaTel').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Téléphone *
                      {getFieldStatus('contactComptaTel').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="contactComptaTel"
                      type="tel"
                      value={formData.contactComptaTel}
                      onChange={(e) => onPhoneChange('contactComptaTel', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('contactComptaTel').isError || getFieldStatus('contactComptaTel').hasFormatError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('contactComptaTel').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('contactComptaTel').isError || getFieldStatus('contactComptaTel').hasFormatError}
                      placeholder="Chiffres uniquement (ex: 0123456789)"
                    />
                    {(getFieldStatus('contactComptaTel').isError || getFieldStatus('contactComptaTel').hasFormatError) && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {getFieldMessage('contactComptaTel') && (
                      <div className={`text-xs mt-1 transition-colors duration-200 ${
                        getFieldStatus('contactComptaTel').hasFormatError ? 'text-red-500' : 
                        getFieldStatus('contactComptaTel').isValid ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {getFieldMessage('contactComptaTel')}
                      </div>
                    )}
                  </div>

                  <div className="relative md:col-span-2">
                    <Label 
                      htmlFor="contactComptaMail"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('contactComptaMail').isError ? 'text-red-600' : 
                        getFieldStatus('contactComptaMail').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Email *
                      {getFieldStatus('contactComptaMail').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="contactComptaMail"
                      type="email"
                      value={formData.contactComptaMail}
                      onChange={(e) => onInputChange('contactComptaMail', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('contactComptaMail').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('contactComptaMail').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('contactComptaMail').isError}
                    />
                    {getFieldStatus('contactComptaMail').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>  
            </Card>
          </motion.div>

          {/* Responsable stand */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.secondary }}>
              <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.secondary }}>
                <CardTitle className="text-white font-[Poppins]">RESPONSABLE DU STAND</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label 
                      htmlFor="responsableNom"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('responsableNom').isError ? 'text-red-600' : 
                        getFieldStatus('responsableNom').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Nom *
                      {getFieldStatus('responsableNom').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="responsableNom"
                      value={formData.responsableNom}
                      onChange={(e) => onInputChange('responsableNom', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('responsableNom').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('responsableNom').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('responsableNom').isError}
                    />
                    {getFieldStatus('responsableNom').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="responsablePrenom"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('responsablePrenom').isError ? 'text-red-600' : 
                        getFieldStatus('responsablePrenom').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Prénom *
                      {getFieldStatus('responsablePrenom').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="responsablePrenom"
                      value={formData.responsablePrenom}
                      onChange={(e) => onInputChange('responsablePrenom', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('responsablePrenom').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('responsablePrenom').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('responsablePrenom').isError}
                    />
                    {getFieldStatus('responsablePrenom').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="responsableTel"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('responsableTel').isError || getFieldStatus('responsableTel').hasFormatError ? 'text-red-600' : 
                        getFieldStatus('responsableTel').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Téléphone *
                      {getFieldStatus('responsableTel').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="responsableTel"
                      type="tel"
                      value={formData.responsableTel}
                      onChange={(e) => onPhoneChange('responsableTel', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('responsableTel').isError || getFieldStatus('responsableTel').hasFormatError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('responsableTel').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('responsableTel').isError || getFieldStatus('responsableTel').hasFormatError}
                      placeholder="Chiffres uniquement (ex: 0123456789)"
                    />
                    {(getFieldStatus('responsableTel').isError || getFieldStatus('responsableTel').hasFormatError) && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {getFieldMessage('responsableTel') && (
                      <div className={`text-xs mt-1 transition-colors duration-200 ${
                        getFieldStatus('responsableTel').hasFormatError ? 'text-red-500' : 
                        getFieldStatus('responsableTel').isValid ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {getFieldMessage('responsableTel')}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="responsableMail"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('responsableMail').isError ? 'text-red-600' : 
                        getFieldStatus('responsableMail').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Email *
                      {getFieldStatus('responsableMail').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="responsableMail"
                      type="email"
                      value={formData.responsableMail}
                      onChange={(e) => onInputChange('responsableMail', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('responsableMail').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('responsableMail').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('responsableMail').isError}
                    />
                    {getFieldStatus('responsableMail').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Responsable opérationnel */}
          <motion.div variants={itemVariants}>
            <Card className="mb-6 rounded-lg" style={{ borderColor: COLORS.primary }}>
              <CardHeader className="rounded-t-lg" style={{ backgroundColor: COLORS.primary }}>
                <CardTitle className="text-white font-[Poppins]">RESPONSABLE OPÉRATIONNEL</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label 
                      htmlFor="respOpNom"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('respOpNom').isError ? 'text-red-600' : 
                        getFieldStatus('respOpNom').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Nom *
                      {getFieldStatus('respOpNom').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="respOpNom"
                      value={formData.respOpNom}
                      onChange={(e) => onInputChange('respOpNom', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('respOpNom').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('respOpNom').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('respOpNom').isError}
                    />
                    {getFieldStatus('respOpNom').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="respOpPrenom"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('respOpPrenom').isError ? 'text-red-600' : 
                        getFieldStatus('respOpPrenom').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Prénom *
                      {getFieldStatus('respOpPrenom').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="respOpPrenom"
                      value={formData.respOpPrenom}
                      onChange={(e) => onInputChange('respOpPrenom', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('respOpPrenom').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('respOpPrenom').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('respOpPrenom').isError}
                    />
                    {getFieldStatus('respOpPrenom').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="respOpTel"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('respOpTel').isError || getFieldStatus('respOpTel').hasFormatError ? 'text-red-600' : 
                        getFieldStatus('respOpTel').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Téléphone *
                      {getFieldStatus('respOpTel').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="respOpTel"
                      type="tel"
                      value={formData.respOpTel}
                      onChange={(e) => onPhoneChange('respOpTel', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('respOpTel').isError || getFieldStatus('respOpTel').hasFormatError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('respOpTel').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('respOpTel').isError || getFieldStatus('respOpTel').hasFormatError}
                      placeholder="Chiffres uniquement (ex: 0123456789)"
                    />
                    {(getFieldStatus('respOpTel').isError || getFieldStatus('respOpTel').hasFormatError) && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {getFieldMessage('respOpTel') && (
                      <div className={`text-xs mt-1 transition-colors duration-200 ${
                        getFieldStatus('respOpTel').hasFormatError ? 'text-red-500' : 
                        getFieldStatus('respOpTel').isValid ? 'text-green-500' : 'text-gray-500'
                      }`}>
                        {getFieldMessage('respOpTel')}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Label 
                      htmlFor="respOpMail"
                      className={`font-[Poppins] font-medium transition-colors duration-200 ${
                        getFieldStatus('respOpMail').isError ? 'text-red-600' : 
                        getFieldStatus('respOpMail').isValid ? 'text-green-600' : ''
                      }`}
                    >
                      Email *
                      {getFieldStatus('respOpMail').isValid && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-1" />
                      )}
                    </Label>
                    <Input 
                      id="respOpMail"
                      type="email"
                      value={formData.respOpMail}
                      onChange={(e) => onInputChange('respOpMail', e.target.value)}
                      className={`mt-1 font-[Poppins] transition-all duration-200 ${
                        getFieldStatus('respOpMail').isError
                          ? 'border-red-500 focus:ring-red-500' 
                          : getFieldStatus('respOpMail').isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-[#3DB5A0] focus:ring-[#3DB5A0] hover:border-gray-400'
                      }`}
                      data-error={getFieldStatus('respOpMail').isError}
                    />
                    {getFieldStatus('respOpMail').isError && (
                      <div className="absolute right-3 top-8 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bouton de navigation */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-end"
          >
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
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}