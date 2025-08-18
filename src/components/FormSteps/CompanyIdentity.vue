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
          <Field
            id="raisonSociale"
            name="raisonSociale"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.raisonSociale }"
            :aria-invalid="!!errors.raisonSociale"
            autocomplete="organization"
            v-model="formData.raisonSociale"
            placeholder="Nom de votre entreprise"
          />
          <ErrorMessage name="raisonSociale" class="error-message" />
        </div>

        <div class="md:col-span-2">
          <label for="adresse" class="block text-sm font-medium text-gray-700 mb-2">
            Adresse <span class="text-red-500">*</span>
          </label>
          <Field
            id="adresse"
            name="adresse"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.adresse }"
            :aria-invalid="!!errors.adresse"
            autocomplete="street-address"
            v-model="formData.adresse"
            placeholder="Adresse complète"
          />
          <ErrorMessage name="adresse" class="error-message" />
        </div>

        <div>
          <label for="codePostal" class="block text-sm font-medium text-gray-700 mb-2">
            Code postal <span class="text-red-500">*</span>
          </label>
          <Field
            id="codePostal"
            name="codePostal"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.codePostal }"
            :aria-invalid="!!errors.codePostal"
            inputmode="numeric"
            autocomplete="postal-code"
            v-model="formData.codePostal"
            placeholder="59000"
          />
          <ErrorMessage name="codePostal" class="error-message" />
        </div>

        <div>
          <label for="ville" class="block text-sm font-medium text-gray-700 mb-2">
            Ville <span class="text-red-500">*</span>
          </label>
          <Field
            id="ville"
            name="ville"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.ville }"
            :aria-invalid="!!errors.ville"
            autocomplete="address-level2"
            v-model="formData.ville"
            placeholder="Lille"
          />
          <ErrorMessage name="ville" class="error-message" />
        </div>

        <div>
          <label for="pays" class="block text-sm font-medium text-gray-700 mb-2">
            Pays <span class="text-red-500">*</span>
          </label>
          <Field
            id="pays"
            name="pays"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.pays }"
            :aria-invalid="!!errors.pays"
            autocomplete="country-name"
            v-model="formData.pays"
            placeholder="France"
          />
          <ErrorMessage name="pays" class="error-message" />
        </div>

        <div>
          <label for="telephone" class="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <Field
            id="telephone"
            name="telephone"
            type="tel"
            class="form-input"
            inputmode="tel"
            autocomplete="tel"
            v-model="formData.telephone"
            placeholder="03 20 00 00 00"
          />
          <ErrorMessage name="telephone" class="error-message" />
        </div>

        <div>
          <label for="fax" class="block text-sm font-medium text-gray-700 mb-2">
            Fax
          </label>
          <Field
            id="fax"
            name="fax"
            type="tel"
            class="form-input"
            inputmode="tel"
            autocomplete="tel"
            v-model="formData.fax"
            placeholder="03 20 00 00 00"
          />
        </div>

        <div>
          <label for="siteInternet" class="block text-sm font-medium text-gray-700 mb-2">
            Site internet
          </label>
          <Field
            id="siteInternet"
            name="siteInternet"
            type="url"
            class="form-input"
            autocomplete="url"
            v-model="formData.siteInternet"
            placeholder="https://www.exemple.fr"
          />
          <ErrorMessage name="siteInternet" class="error-message" />
        </div>

        <div>
          <label for="siret" class="block text-sm font-medium text-gray-700 mb-2">
            SIRET
          </label>
          <Field
            id="siret"
            name="siret"
            type="text"
            class="form-input"
            inputmode="numeric"
            v-model="formData.siret"
            placeholder="12345678901234"
          />
          <ErrorMessage name="siret" class="error-message" />
        </div>

        <div>
          <label for="tva" class="block text-sm font-medium text-gray-700 mb-2">
            TVA intracommunautaire
          </label>
          <Field
            id="tva"
            name="tva"
            type="text"
            class="form-input"
            v-model="formData.tva"
            placeholder="FR12345678901"
          />
          <ErrorMessage name="tva" class="error-message" />
        </div>

        <div>
          <label for="enseigne" class="block text-sm font-medium text-gray-700 mb-2">
            Enseigne (nom du stand)
          </label>
          <Field
            id="enseigne"
            name="enseigne"
            type="text"
            class="form-input"
            autocomplete="organization"
            v-model="formData.enseigne"
            placeholder="Nom affiché sur le stand"
          />
        </div>
      </div>

      <!-- Membership checkboxes -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Statut</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <Field
              id="membrePorte"
              name="membrePorte"
              type="checkbox"
              class="form-checkbox"
              v-model="formData.membrePorte"
            />
            <label for="membrePorte" class="ml-3 text-sm text-gray-700">
              Je suis membre de l'association Porte du Hainaut Développement
            </label>
          </div>
          
          <div class="flex items-center">
            <Field
              id="exposant2024"
              name="exposant2024"
              type="checkbox"
              class="form-checkbox"
              v-model="formData.exposant2024"
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
            <Field
              :id="`activity-${activity}`"
              name="activites"
              type="checkbox"
              :value="activity"
              class="form-checkbox"
              v-model="formData.activites"
            />
            <label :for="`activity-${activity}`" class="ml-3 text-sm text-gray-700">
              {{ activity }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'
import { BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { ACTIVITY_OPTIONS } from '@/types/form'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

// Form data reactive reference
const formData = computed(() => formStore.formData.company)

// Validation schema
const schema = yup.object({
  raisonSociale: yup.string().required('La raison sociale est requise'),
  adresse: yup.string().required('L\'adresse est requise'),
  codePostal: yup.string()
    .required('Le code postal est requis')
    .matches(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),
  ville: yup.string().required('La ville est requise'),
  pays: yup.string().required('Le pays est requis'),
  telephone: yup.string().matches(/^[\d\s\+\-\(\)]+$/, 'Format de téléphone invalide'),
  siteInternet: yup.string().url('Format d\'URL invalide'),
  siret: yup.string().matches(/^\d{14}$/, 'Le SIRET doit contenir 14 chiffres'),
  tva: yup.string().matches(/^[A-Z]{2}\d{11}$/, 'Format de TVA invalide (ex: FR12345678901)')
})

const { errors, meta } = useForm({
  validationSchema: schema,
  initialValues: formData.value
})

// Watch for form validity changes
watch(meta, (newMeta) => {
  emit('step-validated', newMeta.valid)
}, { immediate: true, deep: true })

// Watch for form data changes and save them
// v-model writes through computed setter; avoid duplicate updates that can cause loops
</script>
