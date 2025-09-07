<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <BuildingOfficeIcon class="inline w-6 h-6 mr-2" />
      Votre identité
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Company Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label for="raisonSociale" class="block text-sm font-medium text-gray-700 mb-2">
            Raison sociale <span class="text-red-500">*</span>
          </label>
          <input
            id="raisonSociale"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.raisonSociale }"
            :aria-invalid="!!errors.raisonSociale"
            autocomplete="organization"
            v-model="formStore.formData.company.raisonSociale"
            placeholder="Nom de votre entreprise"
          />
          <div v-if="errors.raisonSociale" class="error-message">{{ errors.raisonSociale }}</div>
        </div>

        <div class="md:col-span-2">
          <label for="adresse" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse <span class="text-red-500">*</span>
          </label>
          <input
            id="adresse"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.adresse }"
            :aria-invalid="!!errors.adresse"
            autocomplete="street-address"
            v-model="formStore.formData.company.adresse"
            placeholder="Adresse complète"
          />
          <div v-if="errors.adresse" class="error-message">{{ errors.adresse }}</div>
        </div>

        <div>
          <label for="codePostal" class="block text-sm font-medium text-gray-700 mb-2">
            Code postal <span class="text-red-500">*</span>
          </label>
          <input
            id="codePostal"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.codePostal }"
            :aria-invalid="!!errors.codePostal"
            inputmode="numeric"
            autocomplete="postal-code"
            v-model="formStore.formData.company.codePostal"
            placeholder="59000"
          />
          <div v-if="errors.codePostal" class="error-message">{{ errors.codePostal }}</div>
        </div>

        <div>
          <label for="ville" class="block text-sm font-medium text-gray-700 mb-2">
            Ville <span class="text-red-500">*</span>
          </label>
          <input
            id="ville"
            type="text"
            class="form-input uppercase"
            :class="{ 'border-red-300': errors.ville }"
            :aria-invalid="!!errors.ville"
            autocomplete="address-level2"
            v-model="formStore.formData.company.ville"
            @input="(e) => formStore.formData.company.ville = (e.target as HTMLInputElement).value.toUpperCase()"
            placeholder="LILLE"
          />
          <div v-if="errors.ville" class="error-message">{{ errors.ville }}</div>
        </div>

        <div>
          <label for="pays" class="block text-sm font-medium text-gray-700 mb-2">
            Pays <span class="text-red-500">*</span>
          </label>
          <input
            id="pays"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.pays }"
            :aria-invalid="!!errors.pays"
            autocomplete="country-name"
            v-model="formStore.formData.company.pays"
            placeholder="France"
          />
          <div v-if="errors.pays" class="error-message">{{ errors.pays }}</div>
        </div>

        <div>
          <label for="telephone" class="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            id="telephone"
            type="tel"
            class="form-input"
            :class="{ 'border-red-300': errors.telephone }"
            :aria-invalid="!!errors.telephone"
            inputmode="tel"
            autocomplete="tel"
            v-model="formStore.formData.company.telephone"
            placeholder="03 20 00 00 00"
          />
          <div v-if="errors.telephone" class="error-message">{{ errors.telephone }}</div>
        </div>

        <div>
          <label for="siteInternet" class="block text-sm font-medium text-gray-700 mb-2">
            Site internet
          </label>
          <input
            id="siteInternet"
            type="url"
            class="form-input"
            :class="{ 'border-red-300': errors.siteInternet }"
            :aria-invalid="!!errors.siteInternet"
            autocomplete="url"
            v-model="formStore.formData.company.siteInternet"
            placeholder="www.exemple.fr"
            @blur="formatWebsite"
          />
          <div v-if="errors.siteInternet" class="error-message">{{ errors.siteInternet }}</div>
        </div>

        <div>
          <label for="siret" class="block text-sm font-medium text-gray-700 mb-2">
            SIRET <span class="text-red-500">*</span>
          </label>
          <input
            id="siret"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.siret }"
            :aria-invalid="!!errors.siret"
            inputmode="numeric"
            v-model="formStore.formData.company.siret"
            placeholder="12345678901234"
          />
          <div v-if="errors.siret" class="error-message">{{ errors.siret }}</div>
        </div>

        <div>
          <label for="tva" class="block text-sm font-medium text-gray-700 mb-2">
            TVA intracommunautaire
          </label>
          <input
            id="tva"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.tva }"
            :aria-invalid="!!errors.tva"
            v-model="formStore.formData.company.tva"
            placeholder="FR12345678901"
          />
          <div v-if="errors.tva" class="error-message">{{ errors.tva }}</div>
        </div>

        <div>
          <label for="enseigne" class="block text-sm font-medium text-gray-700 mb-2">
            Enseigne (nom du stand) <span class="text-red-500">*</span>
          </label>
          <input
            id="enseigne"
            type="text"
            class="form-input uppercase"
            :class="{ 'border-red-300': errors.enseigne }"
            :aria-invalid="!!errors.enseigne"
            autocomplete="organization"
            v-model="formStore.formData.company.enseigne"
            placeholder="NOM AFFICHÉ SUR LE STAND"
            @input="(e) => formStore.formData.company.enseigne = (e.target as HTMLInputElement).value.toUpperCase()"
          />
          <div v-if="errors.enseigne" class="error-message">{{ errors.enseigne }}</div>
        </div>
      </div>

      <!-- Membership checkboxes -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Statut</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <input
              id="membrePorte"
              type="checkbox"
              class="form-checkbox"
              v-model="formStore.formData.company.membrePorte"
            />
            <label for="membrePorte" class="ml-3 text-sm text-gray-700">
              Je suis membre de l'association Porte du Hainaut Développement
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              id="exposant2024"
              type="checkbox"
              class="form-checkbox"
              v-model="formStore.formData.company.exposant2024"
            />
            <label for="exposant2024" class="ml-3 text-sm text-gray-700">
              J'étais exposant en 2024
            </label>
          </div>
        </div>
      </div>

      <!-- Activities -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Activité (case à cocher)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div 
            v-for="activity in ACTIVITY_OPTIONS" 
            :key="activity"
            class="flex items-center"
          >
            <input
              :id="`activity-${activity}`"
              type="checkbox"
              :value="activity"
              class="form-checkbox"
              v-model="formStore.formData.company.activites"
            />
            <label :for="`activity-${activity}`" class="ml-3 text-sm text-gray-700">
              {{ activity }}
            </label>
          </div>
        </div>
        <!-- Autre activité field -->
        <div v-if="formStore.formData.company.activites.includes('Autre')" class="mt-4">
          <label for="autreActivite" class="block text-sm font-medium text-gray-700 mb-2">
            Précisez votre activité <span class="text-red-500">*</span>
          </label>
          <input
            id="autreActivite"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.autreActivite }"
            :aria-invalid="!!errors.autreActivite"
            v-model="formStore.formData.company.autreActivite"
            placeholder="Décrivez votre activité"
          />
          <div v-if="errors.autreActivite" class="error-message">{{ errors.autreActivite }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { ACTIVITY_OPTIONS } from '@/types/form'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

// Simple validation computed properties
const errors = computed(() => {
  const company = formStore.formData.company
  const errors: Record<string, string> = {}

  // Required fields
  if (!company.raisonSociale?.trim()) {
    errors.raisonSociale = 'La raison sociale est requise'
  }
  if (!company.adresse?.trim()) {
    errors.adresse = 'L\'adresse est requise'
  }
  if (!company.codePostal?.trim()) {
    errors.codePostal = 'Le code postal est requis'
  } else if (!/^\d{5}$/.test(company.codePostal)) {
    errors.codePostal = 'Le code postal doit contenir 5 chiffres'
  }
  if (!company.ville?.trim()) {
    errors.ville = 'La ville est requise'
  }
  if (!company.pays?.trim()) {
    errors.pays = 'Le pays est requis'
  }
  if (!company.siret?.trim()) {
    errors.siret = 'Le SIRET est requis'
  } else if (!/^\d{14}$/.test(company.siret)) {
    errors.siret = 'Le SIRET doit contenir 14 chiffres'
  }
  if (!company.enseigne?.trim()) {
    errors.enseigne = 'L\'enseigne (nom du stand) est requise'
  }

  // Optional field validation
  if (company.telephone?.trim() && !/^[\d\s\+\-\(\)]+$/.test(company.telephone)) {
    errors.telephone = 'Format de téléphone invalide'
  }
  if (company.siteInternet?.trim() && !isValidUrl(company.siteInternet)) {
    errors.siteInternet = 'Format d\'URL invalide'
  }
  if (company.tva?.trim() && !/^[A-Z]{2}\d{11}$/.test(company.tva)) {
    errors.tva = 'Format de TVA invalide (ex: FR12345678901)'
  }
  if (company.activites.includes('Autre') && !company.autreActivite?.trim()) {
    errors.autreActivite = 'Veuillez préciser votre activité'
  }

  return errors
})

// Form validity computed property
const isValid = computed(() => Object.keys(errors.value).length === 0)

// Watch for form validity changes
watch(isValid, (newIsValid) => {
  emit('step-validated', newIsValid)
}, { immediate: true })

// Simple URL validation helper
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : 'https://' + url)
    return true
  } catch {
    return false
  }
}

// Format website URL
const formatWebsite = () => {
  const company = formStore.formData.company
  if (company.siteInternet && !company.siteInternet.startsWith('http') && !company.siteInternet.startsWith('www.')) {
    company.siteInternet = 'www.' + company.siteInternet
  }
}

// Debug logging for raison sociale field
watch(
  () => formStore.formData.company.raisonSociale,
  (newValue, oldValue) => {
    console.log('🔄 CompanyIdentity: Raison sociale changed:', { oldValue, newValue })
  }
)
</script>
