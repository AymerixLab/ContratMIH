<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <PlusCircleIcon class="inline w-6 h-6 mr-2" />
      Produits complémentaires
    </div>
    
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Scan Badges -->
        <div class="flex items-center">
          <Field
            id="scanBadges"
            name="scanBadges"
            type="checkbox"
            class="form-checkbox"
            v-model="formData.scanBadges"
          />
          <label for="scanBadges" class="ml-3 text-sm text-gray-700">
            Scan badges ({{ scanBadgesPrice }}€)
          </label>
        </div>

        <!-- Pass Soirée -->
        <div class="md:col-span-2">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Pass soirée</h3>
          
          <!-- Information about included passes -->
          <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 class="font-medium text-blue-900 mb-2">Pass inclus selon la taille de votre stand :</h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Stand 6 m² = 2 pass inclus</li>
              <li>• Stand 9 m² = 3 pass inclus</li>
              <li>• Stand 12 m² = 4 pass inclus</li>
              <li>• Stand 15 m² à 18 m² et plus = 6 pass inclus</li>
            </ul>
            <p v-if="includedPasses > 0" class="mt-2 font-medium text-blue-900">
              Votre stand inclut {{ includedPasses }} pass soirée
            </p>
          </div>

          <label for="passSoiree" class="block text-sm font-medium text-gray-700 mb-2">
            Pass soirée supplémentaires ({{ passSoireePrice }}€ par pass)
          </label>
          <Field
            id="passSoiree"
            name="passSoiree"
            type="number"
            min="0"
            class="form-input"
            v-model.number="formData.passSoiree"
            placeholder="0"
          />
          <p class="text-sm text-gray-600 mt-1">
            Total passes : {{ totalPasses }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { Field, useForm } from 'vee-validate'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { getIncludedPassCount, getItemPricing } from '@/config/pricing'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.additionalProducts)

// Calculate included passes based on current stand size
const includedPasses = computed(() => {
  const standSize = formStore.getCurrentStandSize
  return getIncludedPassCount(standSize)
})

const totalPasses = computed(() => {
  return includedPasses.value + formData.value.passSoiree
})

// Pricing information
const scanBadgesPrice = computed(() => {
  const pricing = getItemPricing('scanBadges')
  return pricing ? pricing.price : 0
})

const passSoireePrice = computed(() => {
  const pricing = getItemPricing('passSoiree')
  return pricing ? pricing.price : 0
})

const { meta, resetForm } = useForm({
  initialValues: formData.value,
  validateOnMount: false
})

watch(meta, (newMeta) => {
  emit('step-validated', true) // Always valid for this step
}, { immediate: true, deep: true })

// Watch for store data changes and reset form with new values
watch(formData, (newFormData) => {
  // Use nextTick to ensure DOM is updated before resetting form
  nextTick(() => {
    resetForm({ values: newFormData })
  })
}, { deep: true, immediate: true })

// v-model writes through computed setter; avoid duplicate updates
</script>
