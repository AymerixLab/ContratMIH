<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <UserIcon class="inline w-6 h-6 mr-2" />
      Coordonnées de contact
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Billing Address -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label for="factCodePostal" class="block text-sm font-medium text-gray-700 mb-2">
            Code postal facturation
          </label>
          <Field
            id="factCodePostal"
            name="factCodePostal"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.factCodePostal }"
            v-model="formData.factCodePostal"
            placeholder="59000"
          />
          <ErrorMessage name="factCodePostal" class="error-message" />
        </div>

        <div>
          <label for="factVille" class="block text-sm font-medium text-gray-700 mb-2">
            Ville facturation
          </label>
          <Field
            id="factVille"
            name="factVille"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.factVille }"
            v-model="formData.factVille"
            placeholder="Lille"
          />
          <ErrorMessage name="factVille" class="error-message" />
        </div>

        <div>
          <label for="factPays" class="block text-sm font-medium text-gray-700 mb-2">
            Pays facturation
          </label>
          <Field
            id="factPays"
            name="factPays"
            type="text"
            class="form-input"
            :class="{ 'border-red-300': errors.factPays }"
            v-model="formData.factPays"
            placeholder="France"
          />
          <ErrorMessage name="factPays" class="error-message" />
        </div>
      </div>

      <!-- Main Contact -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Contact principal</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="contactNom" class="block text-sm font-medium text-gray-700 mb-2">
              Nom <span class="text-red-500">*</span>
            </label>
            <Field
              id="contactNom"
              name="contactNom"
              type="text"
              class="form-input"
              :class="{ 'border-red-300': errors.contactNom }"
              v-model="formData.contactNom"
              placeholder="Nom du contact"
            />
            <ErrorMessage name="contactNom" class="error-message" />
          </div>

          <div>
            <label for="contactTel" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone <span class="text-red-500">*</span>
            </label>
            <Field
              id="contactTel"
              name="contactTel"
              type="tel"
              class="form-input"
              :class="{ 'border-red-300': errors.contactTel }"
              v-model="formData.contactTel"
              placeholder="03 20 00 00 00"
            />
            <ErrorMessage name="contactTel" class="error-message" />
          </div>

          <div>
            <label for="contactMail" class="block text-sm font-medium text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <Field
              id="contactMail"
              name="contactMail"
              type="email"
              class="form-input"
              :class="{ 'border-red-300': errors.contactMail }"
              v-model="formData.contactMail"
              placeholder="contact@exemple.fr"
            />
            <ErrorMessage name="contactMail" class="error-message" />
          </div>
        </div>
      </div>

      <!-- Responsible -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Responsable</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="respNom" class="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <Field
              id="respNom"
              name="respNom"
              type="text"
              class="form-input"
              v-model="formData.respNom"
              placeholder="Nom du responsable"
            />
          </div>

          <div>
            <label for="respPrenom" class="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <Field
              id="respPrenom"
              name="respPrenom"
              type="text"
              class="form-input"
              v-model="formData.respPrenom"
              placeholder="Prénom du responsable"
            />
          </div>

          <div>
            <label for="respTel" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <Field
              id="respTel"
              name="respTel"
              type="tel"
              class="form-input"
              v-model="formData.respTel"
              placeholder="03 20 00 00 00"
            />
          </div>

          <div>
            <label for="respMail" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Field
              id="respMail"
              name="respMail"
              type="email"
              class="form-input"
              v-model="formData.respMail"
              placeholder="responsable@exemple.fr"
            />
          </div>
        </div>
      </div>

      <!-- Operations Contact -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Contact opérationnel</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="opNom" class="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <Field
              id="opNom"
              name="opNom"
              type="text"
              class="form-input"
              v-model="formData.opNom"
              placeholder="Nom du contact opérationnel"
            />
          </div>

          <div>
            <label for="opPrenom" class="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <Field
              id="opPrenom"
              name="opPrenom"
              type="text"
              class="form-input"
              v-model="formData.opPrenom"
              placeholder="Prénom du contact opérationnel"
            />
          </div>

          <div>
            <label for="opTel" class="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <Field
              id="opTel"
              name="opTel"
              type="tel"
              class="form-input"
              v-model="formData.opTel"
              placeholder="03 20 00 00 00"
            />
          </div>

          <div>
            <label for="opMail" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Field
              id="opMail"
              name="opMail"
              type="email"
              class="form-input"
              v-model="formData.opMail"
              placeholder="operationnel@exemple.fr"
            />
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
import { UserIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.contact)

const schema = yup.object({
  contactNom: yup.string().required('Le nom du contact est requis'),
  contactTel: yup.string().required('Le téléphone du contact est requis'),
  contactMail: yup.string().email('Format d\'email invalide').required('L\'email du contact est requis')
})

const { errors, meta } = useForm({
  validationSchema: schema,
  initialValues: formData.value
})

watch(meta, (newMeta) => {
  emit('step-validated', newMeta.valid)
}, { immediate: true, deep: true })

// v-model writes through computed setter; avoid duplicate updates
</script>
