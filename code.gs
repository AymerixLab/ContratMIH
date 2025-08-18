function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function blank(v) {
  // Renvoie une chaîne vide si v est 0 ou vide ; sinon retourne v
  return (v === null || v === undefined || v === '' || Number(v) === 0) ? '' : v;
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Feuille1');
  const data = JSON.parse(e.postData.contents || '{}');

  // Numéro et montant de TVA
  const tvaNumber = data.tvaNumber || data.tvaIntracommunautaire || '';
  const tvaAmount = data.tvaAmount !== undefined ? Number(data.tvaAmount) : (data.tva ? Number(data.tva) : 0);

  // Ajoutez une ligne en respectant l’ordre des colonnes de votre tableur.
  // Utilisez `blank()` pour éviter d’inscrire des 0 inutiles.
  sheet.appendRow([
    data.date || '',
    data.signataire || '',
    data.raisonSociale || '',
    data.adresse || '',
    data.codePostal || '',
    data.ville || '',
    data.pays || '',
    data.telephone || '',
    data.fax || '',
    data.siteInternet || '',
    data.siret || '',
    tvaNumber,
    data.membrePorte || '',
    data.exposant2024 || '',
    data.activites || '',
    data.factCodePostal || '',
    data.factVille || '',
    data.factPays || '',
    data.contactNom || '',
    data.contactTel || '',
    data.contactMail || '',
    data.respNom || '',
    data.respPrenom || '',
    data.respTel || '',
    data.respMail || '',
    data.opNom || '',
    data.opPrenom || '',
    data.opTel || '',
    data.opMail || '',
    data.enseigne || '',
    // Quantités des sections (Réservation d’espace)
    blank(data.standEquipeSurface),
    blank(data.standEquipeAngle),
    blank(data.pack12),
    blank(data.pack15),
    blank(data.pack18),
    blank(data.packAngles),
    blank(data.standNuSurface),
    blank(data.standNuAngle),
    blank(data.puissance),          // puissance est la valeur choisie (0, 220, 260, 350)
    blank(data.surfaceExterieur),
    blank(data.cottage),
    // Quantités des aménagements optionnels
    blank(data.reserveMelamine),
    blank(data.moquetteDiff),
    blank(data.velum),
    blank(data.cloisonBoisTissu),
    blank(data.reserveBois),
    blank(data.railSpots),
    // Mobilier (20 colonnes)
    blank(data.mobilier.comptoir),
    blank(data.mobilier.tabouret),
    blank(data.mobilier.mangeDebout),
    blank(data.mobilier.chaise),
    blank(data.mobilier.table120),
    blank(data.mobilier.packMangeDebout),
    blank(data.mobilier.ecran52),
    blank(data.mobilier.frigo140),
    blank(data.mobilier.frigo260),
    blank(data.mobilier.presentoir),
    blank(data.mobilier.bandeau),
    blank(data.mobilier.blocPrises),
    blank(data.mobilier.fauteuil),
    blank(data.mobilier.tableBasse),
    blank(data.mobilier.gueridonHaut),
    blank(data.mobilier.poufCube),
    blank(data.mobilier.colonneVitrine),
    blank(data.mobilier.comptoirVitrine),
    blank(data.mobilier.porteManteaux),
    blank(data.mobilier.planteBambou),
    blank(data.mobilier.planteKentia),
    // Produits complémentaires
    blank(data.scanBadges),
    blank(data.passSoiree),
    // Signalétique
    blank(data.signaletique.packComplet),
    blank(data.signaletique.comptoir),
    blank(data.signaletique.hautCloisons),
    blank(data.signaletique.cloisonComplete),
    blank(data.signaletique.enseigneHaute),
    // Visibilité & communication
    blank(data.communication.invitations),
    blank(data.communication.demiPage),
    blank(data.communication.unePage),
    blank(data.communication.deuxiemeCouverture),
    blank(data.communication.quatriemeCouverture),
    blank(data.communication.logoPlan),
    blank(data.communication.goodies),
    blank(data.communication.hotesse),
    // Totaux financiers
    blank(data.totalSection1),
    blank(data.totalSection2),
    blank(data.totalSection3),
    blank(data.totalSection4),
    blank(data.totalHT),
    blank(tvaAmount),
    blank(data.totalTTC),
    blank(data.acompte),
    blank(data.solde),
    // Liste détaillée des prestations (JSON) – facultatif
    JSON.stringify(data.prestations || [])
  ]);

  return ContentService.createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*');
}
