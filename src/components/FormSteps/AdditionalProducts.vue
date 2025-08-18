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
            Scan badges (150 €)
          </label>
        </div>

        <!-- Pass Soirée -->
        <div>
          <label for="passSoiree" class="block text-sm font-medium text-gray-700 mb-2">
            Pass soirée (nombre)
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Field, useForm } from 'vee-validate'
import { PlusCircleIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.additionalProducts)

const { meta } = useForm({
  initialValues: formData.value
})

watch(meta, (newMeta) => {
  emit('step-validated', true) // Always valid for this step
}, { immediate: true, deep: true })

// v-model writes through computed setter; avoid duplicate updates
</script>
