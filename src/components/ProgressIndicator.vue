<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ currentStepData?.title }}
      </h2>
      <div class="text-sm text-gray-500">
        {{ formStore.progressPercent }}% complété
      </div>
    </div>
    
    <!-- Progress bar -->
    <div class="w-full bg-gray-200 rounded-full h-3 mb-6">
      <div 
        class="bg-gradient-to-r from-mih-coral to-mih-coral-dark h-3 rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${formStore.progressPercent}%` }"
      ></div>
    </div>
    
    <!-- Step indicators -->
    <div class="overflow-x-auto scrollbar-hide -mx-2 px-2">
      <div class="flex items-center md:justify-between gap-3 md:gap-0 snap-x snap-mandatory">
        <div 
          v-for="step in formStore.steps" 
          :key="step.id"
          class="flex flex-col items-center flex-none md:flex-1 min-w-[64px] snap-center"
        >
        <!-- Step circle -->
        <div 
          class="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
          :class="[stepCircleClass(step), { 'cursor-pointer hover:scale-105': canNavigateToStep(step.id) }]"
          @click="canNavigateToStep(step.id) && formStore.setCurrentStep(step.id)"
        >
          <CheckIcon v-if="step.isCompleted" class="w-4 h-4 md:w-5 md:h-5" />
          <span v-else>{{ step.id }}</span>
        </div>
        
        <!-- Step label -->
        <div 
          class="mt-2 text-xs text-center max-w-16 md:max-w-20 leading-tight"
          :class="{
            'text-mih-coral font-medium': step.id === formStore.currentStep,
            'text-gray-600': step.id !== formStore.currentStep && !step.isCompleted,
            'text-mih-green font-medium': step.isCompleted
          }"
        >
          {{ step.title }}
        </div>
        
        <!-- Connector line -->
        <div 
          v-if="step.id < formStore.steps.length"
          class="hidden md:block absolute h-0.5 bg-gray-300 top-5 left-1/2 transform -translate-y-1/2"
          :class="{
            'bg-mih-green': step.isCompleted,
            'bg-gray-300': !step.isCompleted
          }"
          style="width: calc(100% / 7 - 2.5rem); margin-left: 1.25rem;"
        ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { useFormStore } from '@/stores/form'
import type { FormStep } from '@/types/form'

const formStore = useFormStore()

const currentStepData = computed(() => 
  formStore.steps.find(step => step.id === formStore.currentStep)
)

const stepCircleClass = (step: FormStep) => {
  if (step.isCompleted) {
    return 'bg-mih-green text-white'
  }
  if (step.id === formStore.currentStep) {
    return 'bg-mih-coral text-white'
  }
  return 'bg-gray-300 text-gray-600'
}

const canNavigateToStep = (stepId: number) => {
  // Allow navigation to completed steps and the current step
  return stepId <= formStore.currentStep || formStore.steps[stepId - 1]?.isCompleted
}
</script>

<style scoped>
.step-connector {
  position: relative;
}

.step-connector::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: calc(100vw / 7 - 2rem);
  height: 2px;
  background-color: #e5e7eb;
  transform: translateY(-50%);
  z-index: -1;
}

.step-connector.completed::after {
  background-color: #009E70;
}

@media (max-width: 768px) {
  .step-connector::after {
    display: none;
  }
}
</style>
