<template>
  <div
    class="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-gray-200 px-4 py-3 pb-[env(safe-area-inset-bottom)]
           md:static md:z-auto md:bg-white md:backdrop-blur-0 md:px-6 md:py-6 md:rounded-lg md:shadow-sm md:mb-6 flex items-center justify-between">
    <button
      v-if="formStore.currentStep > 1"
      @click="formStore.previousStep()"
      class="btn-secondary min-h-[44px]"
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
      class="btn-primary min-h-[44px]"
      type="button"
    >
      Suivant
      <ArrowRightIcon class="w-4 h-4 ml-2" />
    </button>
    <button
      v-else-if="formStore.currentStep === formStore.steps.length"
      @click="handleSubmit"
      :disabled="!isFormComplete"
      class="btn-primary min-h-[44px]"
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

function focusFirstInvalid() {
  // Try to find first invalid field in the current view
  const root = document.querySelector('.form-container') || document
  const el = root.querySelector('[aria-invalid="true"], .border-red-300') as HTMLElement | null
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => el.focus?.(), 200)
  }
}

const handleNextStep = () => {
  if (canProceedToNext.value) {
    formStore.nextStep()
  } else {
    focusFirstInvalid()
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
