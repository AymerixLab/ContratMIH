<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <DocumentCheckIcon class="inline w-6 h-6 mr-2" />
      Validation et signature
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Summary -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Récapitulatif</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-gray-700 mb-2">Entreprise</h4>
            <p class="text-sm text-gray-600">{{ formStore.formData.company.raisonSociale }}</p>
            <p class="text-sm text-gray-600">{{ formStore.formData.company.adresse }}</p>
            <p class="text-sm text-gray-600">{{ formStore.formData.company.codePostal }} {{ formStore.formData.company.ville }}</p>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-700 mb-2">Contact</h4>
            <p class="text-sm text-gray-600">{{ formStore.formData.contact.contactNom }}</p>
            <p class="text-sm text-gray-600">{{ formStore.formData.contact.contactTel }}</p>
            <p class="text-sm text-gray-600">{{ formStore.formData.contact.contactMail }}</p>
          </div>
        </div>
      </div>

      <!-- Pricing Summary -->
      <div class="bg-blue-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tarification</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Réservation d'espace:</span>
            <span>{{ formStore.priceCalculation.section1Total.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between">
            <span>Équipements optionnels:</span>
            <span>{{ formStore.priceCalculation.section2Total.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between">
            <span>Produits complémentaires:</span>
            <span>{{ formStore.priceCalculation.section3Total.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between">
            <span>Communication:</span>
            <span>{{ formStore.priceCalculation.section4Total.toFixed(2) }} €</span>
          </div>
          <hr class="my-2">
          <div class="flex justify-between font-medium">
            <span>Total HT:</span>
            <span>{{ formStore.priceCalculation.totalHT.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between">
            <span>TVA (20%):</span>
            <span>{{ formStore.priceCalculation.tva.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between font-bold text-lg">
            <span>Total TTC:</span>
            <span>{{ formStore.priceCalculation.totalTTC.toFixed(2) }} €</span>
          </div>
          <hr class="my-2">
          <div class="flex justify-between text-green-600">
            <span>Acompte (50%):</span>
            <span>{{ formStore.priceCalculation.acompte.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between text-orange-600">
            <span>Solde:</span>
            <span>{{ formStore.priceCalculation.solde.toFixed(2) }} €</span>
          </div>
        </div>
      </div>

      <!-- Signature -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Signature du contrat</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="nomSignataire" class="block text-sm font-medium text-gray-700 mb-2">
              Nom du signataire <span class="text-red-500">*</span>
            </label>
            <Field
              id="nomSignataire"
              name="nomSignataire"
              type="text"
              class="form-input"
              :class="{ 'border-red-300': errors.nomSignataire }"
              v-model="formData.nomSignataire"
              placeholder="Nom et prénom du signataire"
            />
            <ErrorMessage name="nomSignataire" class="error-message" />
          </div>

          <div>
            <label for="dateSignature" class="block text-sm font-medium text-gray-700 mb-2">
              Date de signature <span class="text-red-500">*</span>
            </label>
            <Field
              id="dateSignature"
              name="dateSignature"
              type="date"
              class="form-input"
              :class="{ 'border-red-300': errors.dateSignature }"
              v-model="formData.dateSignature"
            />
            <ErrorMessage name="dateSignature" class="error-message" />
          </div>
        </div>

        <div class="mt-6">
          <div class="flex items-start">
            <Field
              id="acceptReglement"
              name="acceptReglement"
              type="checkbox"
              class="form-checkbox mt-1"
              :class="{ 'border-red-300': errors.acceptReglement }"
              v-model="formData.acceptReglement"
            />
            <label for="acceptReglement" class="ml-3 text-sm text-gray-700">
              J'accepte le règlement du salon et les conditions générales de vente.
              <span class="text-red-500">*</span>
            </label>
          </div>
          <ErrorMessage name="acceptReglement" class="error-message" />
        </div>
      </div>

      <!-- Progress Indicator -->
      <div v-if="pdfGeneration.isGenerating" class="border-t pt-6">
        <div class="bg-blue-50 p-6 rounded-lg">
          <h4 class="text-lg font-medium text-gray-900 mb-4">
            <ArrowPathIcon class="inline w-5 h-5 mr-2 animate-spin" />
            Génération en cours...
          </h4>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>{{ pdfGeneration.progress.step }}</span>
                <span>{{ pdfGeneration.progressPercent }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-mih-primary h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${pdfGeneration.progressPercent}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="pdfGeneration.isComplete" class="border-t pt-6">
        <div class="bg-green-50 p-6 rounded-lg">
          <div class="flex items-center">
            <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
            <h4 class="text-lg font-medium text-green-900">Génération terminée!</h4>
          </div>
          <p class="text-sm text-green-700 mt-2">
            Votre devis et contrat ont été générés avec succès et le téléchargement a démarré automatiquement.
          </p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="pdfGeneration.hasError" class="border-t pt-6">
        <div class="bg-red-50 p-6 rounded-lg">
          <div class="flex items-center">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2" />
            <h4 class="text-lg font-medium text-red-900">Erreur</h4>
          </div>
          <p class="text-sm text-red-700 mt-2">
            {{ pdfGeneration.error || pdfGeneration.result?.message || 'Une erreur est survenue lors de la génération.' }}
          </p>
          <button
            @click="pdfGeneration.reset"
            class="mt-3 text-sm text-red-600 hover:text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="border-t pt-6">
        <div class="space-y-4">
          <!-- Warning if no services selected -->
          <div v-if="!formStore.hasSelectedServices" class="bg-yellow-50 p-4 rounded-lg">
            <div class="flex items-center">
              <ExclamationTriangleIcon class="w-5 h-5 text-yellow-500 mr-2" />
              <p class="text-sm text-yellow-700">
                Attention: Aucun service n'a été sélectionné. Le montant total sera de 0€.
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="generateContract"
            :disabled="!meta.valid || pdfGeneration.isGenerating"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon v-if="pdfGeneration.isGenerating" class="inline w-4 h-4 mr-2 animate-spin" />
            <DocumentArrowDownIcon v-else class="inline w-4 h-4 mr-2" />
            {{ pdfGeneration.isGenerating ? 'Génération en cours...' : 'Générer le contrat et le devis' }}
          </button>

          <p class="text-xs text-gray-500 text-center">
            Un fichier ZIP contenant le devis PDF et le contrat PDF sera téléchargé automatiquement.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
import { 
  DocumentCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { usePdfGeneration } from '@/composables/usePdfGeneration'

const formStore = useFormStore()
const pdfGeneration = usePdfGeneration()

const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.signature)

const schema = yup.object({
  nomSignataire: yup.string().required('Le nom du signataire est requis'),
  dateSignature: yup.string().required('La date de signature est requise'),
  acceptReglement: yup.boolean().oneOf([true], 'Vous devez accepter le règlement')
})

const { errors, meta } = useForm({
  validationSchema: schema,
  initialValues: formData.value
})

watch(meta, (newMeta) => {
  emit('step-validated', newMeta.valid)
}, { immediate: true, deep: true })

// v-model writes through computed setter; avoid duplicate updates

const generateContract = async () => {
  if (!meta.value.valid) {
    return
  }

  try {
    await pdfGeneration.generatePdfs(
      formStore.formData,
      formStore.priceCalculation,
      true // Send to Google Sheets
    )
  } catch (error) {
    console.error('Contract generation failed:', error)
  }
}

// Set default date to today
onMounted(() => {
  if (!formData.value.dateSignature) {
    const today = new Date().toISOString().split('T')[0]
    formData.value.dateSignature = today
  }
})
</script>
