# Rapport de validation du PDF Mock

Date: 02/10/2025 00:33:55

## Résumé

- Erreurs détectées: 6
- Avertissements: 0

## Détails des erreurs


### 1. TOTAL HT 01 - Réservation d'espace

- **Formule**: `Somme des lignes section 1`
- **Attendu**: 7460.00€
- **Actuel (PDF)**: 8230.00€
- **Écart**: +770.00€


### 2. TOTAL HT 02 - Aménagements optionnels

- **Formule**: `Somme des lignes section 2`
- **Attendu**: 3553.00€
- **Actuel (PDF)**: 3853.00€
- **Écart**: +300.00€


### 3. TOTAL HT 03 - Produits complémentaires + Visibilité

- **Formule**: `Somme des lignes section 3`
- **Attendu**: 11480.00€
- **Actuel (PDF)**: 11180.00€
- **Écart**: -300.00€


### 4. TOTAUX FINAUX - Total HT

- **Formule**: `HT01 + HT02 + HT03`
- **Attendu**: 22493.00€
- **Actuel (PDF)**: 23263.00€
- **Écart**: +770.00€


### 5. TOTAUX FINAUX - TVA 20%

- **Formule**: `Total HT × 20%`
- **Attendu**: 4498.60€
- **Actuel (PDF)**: 4652.60€
- **Écart**: +154.00€


### 6. TOTAUX FINAUX - Total TTC

- **Formule**: `Total HT + TVA`
- **Attendu**: 26991.60€
- **Actuel (PDF)**: 27915.60€
- **Écart**: +924.00€


## Avertissements

✅ Aucun avertissement

## Totaux récapitulatifs

| Section | Calculé | PDF | Écart |
|---------|---------|-----|-------|
| HT 01 | 7460.00€ | 8230€ | 770.00€ |
| HT 02 | 3553.00€ | 3853€ | 300.00€ |
| HT 03 | 11480.00€ | 11180€ | -300.00€ |
| **Total HT** | **22493.00€** | **23263€** | **770.00€** |
| TVA 20% | 4498.60€ | 4652.6€ | 154.00€ |
| **Total TTC** | **26991.60€** | **27915.6€** | **924.00€** |
