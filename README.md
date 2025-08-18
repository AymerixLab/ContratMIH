# Générateur de Contrats MIH 2026

Application Vue.js moderne pour générer des contrats de participation au **Salon Made in Hainaut 2026**. Cette application web offre une interface utilisateur intuitive avec un formulaire en 7 étapes pour créer automatiquement des devis et contrats PDF.

## 🚀 Technologies

- **Vue 3** avec Composition API et TypeScript
- **Vite** pour le développement et la construction
- **Tailwind CSS** pour le design moderne
- **Pinia** pour la gestion d'état
- **VeeValidate + Yup** pour la validation des formulaires
- **jsPDF** pour la génération de PDF côté client

## ⚡ Démarrage rapide

### Prérequis
- Node.js 18+ recommandé

### Installation et lancement
```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Construction pour la production
npm run build

# Prévisualisation de la version de production
npm run preview
```

L'application sera accessible sur `http://localhost:8001/` (ou le prochain port disponible).

## 🔧 Configuration

1. Copiez `.env.example` vers `.env`
2. Configurez l'URL Google Sheets :
   ```bash
   VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/VOTRE_SCRIPT_ID/exec
   ```

## 📋 Fonctionnalités

### Interface utilisateur
- **Formulaire en 7 étapes** avec indicateur de progression
- **Validation en temps réel** avec messages d'erreur personnalisés
- **Calculs automatiques** des montants HT, TVA, TTC
- **Sauvegarde automatique** des données dans le navigateur
- **Design responsive** adapté à tous les appareils

### Génération de documents
- **Devis PDF** professionnel avec détail des prestations
- **Contrat PDF** pré-rempli basé sur les modèles officiels
- **Archive ZIP** contenant les deux documents
- **Nomenclature automatique** avec nom de l'entreprise

### Intégration de données
- **Export vers Google Sheets** pour la collecte de données
- **Persistence locale** pour éviter la perte de données
- **Gestion d'erreurs** robuste avec messages utilisateur

## 🏗️ Architecture

```
src/
├── components/
│   ├── FormSteps/          # 7 composants d'étapes du formulaire
│   ├── AppHeader.vue       # En-tête de l'application
│   ├── AppFooter.vue       # Pied de page
│   ├── FormContainer.vue   # Routeur d'étapes avec transitions
│   └── ProgressIndicator.vue # Indicateur de progression
├── services/
│   ├── pdfGenerator.ts     # Service de génération PDF
│   └── googleSheets.ts     # Intégration Google Sheets
├── stores/
│   └── form.ts            # Store Pinia pour l'état du formulaire
├── types/
│   ├── form.ts            # Types TypeScript des données
│   └── pdf.ts             # Types pour la génération PDF
└── utils/
    └── imageLoader.ts     # Chargement des images de contrat
```

### Étapes du formulaire
1. **Identité de l'entreprise** - Informations société, activités, adhésion
2. **Coordonnées contacts** - Adresse facturation, contacts comptabilité et opérationnels
3. **Réservation d'espace** - Types de stands, alimentation électrique, espace extérieur
4. **Aménagements optionnels** - Mobilier, présentoirs, équipements techniques
5. **Produits complémentaires** - Scan de badges, pass soirées
6. **Communication** - Signalétique, publicité catalogue, services promotionnels
7. **Résumé contrat** - Révision finale, signature et génération PDF

## 🔌 Intégration Google Sheets

Pour collecter automatiquement les données des formulaires :

1. Créez une nouvelle feuille Google Sheets
2. Ajoutez les en-têtes de colonnes (voir modèles fournis)
3. Créez un script Apps Script avec gestion CORS :

```javascript
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(data.date), data.raisonSociale, data.email,
    Number(data.totalHT), Number(data.totalTTC),
    JSON.stringify(data.prestations)
    // ... autres champs
  ]);
  
  return ContentService.createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*');
}
```

4. Déployez comme application web avec accès public
5. Copiez l'URL `/exec` dans votre fichier `.env`

## 🎨 Personnalisation

### Couleurs et design
Les couleurs de marque sont définies dans `tailwind.config.js` :
- Corail principal : `#e85d40`
- Vert secondaire : `#009E70`

### Tarification
Mettez à jour les prix dans `src/stores/form.ts` dans l'objet `pricing`.

### Modèles de contrat
Remplacez les images PNG dans le répertoire racine et `src/assets/` pour personnaliser les modèles de contrat.

## 🧪 Développement

```bash
# Vérification des types TypeScript
npm run type-check

# Linting avec correction automatique
npm run lint
```

## 📄 Licence

Ce projet est fourni sous licence MIT et peut être librement modifié pour répondre à vos besoins.