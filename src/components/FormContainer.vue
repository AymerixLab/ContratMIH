<template>
  <div class="form-container">
    <Transition name="slide" mode="out-in">
      <component 
        :is="currentStepComponent" 
        :key="formStore.currentStep"
        @step-validated="handleStepValidation"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'
import CompanyIdentity from '@/components/FormSteps/CompanyIdentity.vue'
import ContactDetails from '@/components/FormSteps/ContactDetails.vue'
import SpaceReservation from '@/components/FormSteps/SpaceReservation.vue'
import OptionalEquipment from '@/components/FormSteps/OptionalEquipment.vue'
import AdditionalProducts from '@/components/FormSteps/AdditionalProducts.vue'
import Communication from '@/components/FormSteps/Communication.vue'
import ContractSummary from '@/components/FormSteps/ContractSummary.vue'

const formStore = useFormStore()

const stepComponents = {
  1: CompanyIdentity,
  2: ContactDetails,
  3: SpaceReservation,
  4: OptionalEquipment,
  5: AdditionalProducts,
  6: Communication,
  7: ContractSummary
}

const currentStepComponent = computed(() => {
  return stepComponents[formStore.currentStep as keyof typeof stepComponents]
})

const handleStepValidation = (isValid: boolean) => {
  formStore.validateStep(formStore.currentStep, isValid)
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.form-container {
  min-height: 500px;
}
</style>