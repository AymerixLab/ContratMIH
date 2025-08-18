<template>
  <div class="flex items-center justify-between py-6 border-t border-gray-200 bg-white rounded-lg shadow-sm px-6 mb-6">
    <button
      v-if="formStore.currentStep > 1"
      @click="formStore.previousStep()"
      class="btn-secondary"
      type="button"
    >
      <ArrowLeftIcon class="w-4 h-4 mr-2" />
      Précédent
    </button>
    <div v-else></div>

    <div class="text-sm text-gray-500 font-medium">
      Étape {{ formStore.currentStep }} sur {{ formStore.steps.length }}
    </div>

    <button
      v-if="formStore.currentStep < formStore.steps.length"
      @click="handleNextStep"
      :disabled="!canProceedToNext"
      class="btn-primary"
      type="button"
    >
      Suivant
      <ArrowRightIcon class="w-4 h-4 ml-2" />
    </button>
    <button
      v-else-if="formStore.currentStep === formStore.steps.length"
      @click="handleSubmit"
      :disabled="!isFormComplete"
      class="btn-primary"
      type="button"
    >
      <DocumentCheckIcon class="w-4 h-4 mr-2" />
      Générer le contrat
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  DocumentCheckIcon 
} from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()

const canProceedToNext = computed(() => {
  return formStore.stepValidation[formStore.currentStep]
})

const isFormComplete = computed(() => {
  return Object.values(formStore.stepValidation).every(Boolean)
})

const handleNextStep = () => {
  if (canProceedToNext.value) {
    formStore.nextStep()
  }
}

const handleSubmit = () => {
  if (isFormComplete.value) {
    // This will be implemented when we create the PDF generation logic
    console.log('Form submission ready')
    // Navigate to summary/generation step or trigger PDF generation
  }
}
</script>