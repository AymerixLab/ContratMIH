<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <BuildingStorefrontIcon class="inline w-6 h-6 mr-2" />
      Réservation d'espace
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Equipped Stands -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Stands équipés</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="standEquipeSurface" class="block text-sm font-medium text-gray-700 mb-2">
              Stand équipé - Surface (m²)
            </label>
            <Field
              id="standEquipeSurface"
              name="standEquipeSurface"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.standEquipeSurface"
              placeholder="0"
            />
          </div>

          <div>
            <label for="standEquipeAngle" class="block text-sm font-medium text-gray-700 mb-2">
              Stand équipé - Angle (m²)
            </label>
            <Field
              id="standEquipeAngle"
              name="standEquipeAngle"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.standEquipeAngle"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Pack Options -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Packs</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="pack12" class="block text-sm font-medium text-gray-700 mb-2">
              Pack 12 m²
            </label>
            <Field
              id="pack12"
              name="pack12"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.pack12"
              placeholder="0"
            />
          </div>

          <div>
            <label for="pack15" class="block text-sm font-medium text-gray-700 mb-2">
              Pack 15 m²
            </label>
            <Field
              id="pack15"
              name="pack15"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.pack15"
              placeholder="0"
            />
          </div>

          <div>
            <label for="pack18" class="block text-sm font-medium text-gray-700 mb-2">
              Pack 18 m²
            </label>
            <Field
              id="pack18"
              name="pack18"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.pack18"
              placeholder="0"
            />
          </div>

          <div>
            <label for="packAngles" class="block text-sm font-medium text-gray-700 mb-2">
              Pack Angles
            </label>
            <Field
              id="packAngles"
              name="packAngles"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.packAngles"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Bare Stands -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Stands nus</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="standNuSurface" class="block text-sm font-medium text-gray-700 mb-2">
              Stand nu - Surface (m²)
            </label>
            <Field
              id="standNuSurface"
              name="standNuSurface"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.standNuSurface"
              placeholder="0"
            />
          </div>

          <div>
            <label for="standNuAngle" class="block text-sm font-medium text-gray-700 mb-2">
              Stand nu - Angle (m²)
            </label>
            <Field
              id="standNuAngle"
              name="standNuAngle"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.standNuAngle"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Power -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Puissance électrique</h3>
        <div class="space-y-3">
          <div 
            v-for="option in POWER_OPTIONS" 
            :key="option.value"
            class="flex items-center"
          >
            <Field
              :id="`power-${option.value}`"
              name="puissance"
              type="radio"
              :value="option.value"
              class="form-radio"
              v-model="formData.puissance"
            />
            <label :for="`power-${option.value}`" class="ml-3 text-sm text-gray-700">
              {{ option.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Additional Options -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Options supplémentaires</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="surfaceExterieur" class="block text-sm font-medium text-gray-700 mb-2">
              Surface extérieur (m²)
            </label>
            <Field
              id="surfaceExterieur"
              name="surfaceExterieur"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.surfaceExterieur"
              placeholder="0"
            />
          </div>

          <div>
            <label for="cottage" class="block text-sm font-medium text-gray-700 mb-2">
              Cottage
            </label>
            <Field
              id="cottage"
              name="cottage"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.cottage"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Field, useForm } from 'vee-validate'
import { BuildingStorefrontIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { POWER_OPTIONS } from '@/types/form'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.spaceReservation)

const { meta } = useForm({
  initialValues: formData.value
})

watch(meta, (newMeta) => {
  emit('step-validated', true) // Always valid for this step
}, { immediate: true, deep: true })

// v-model writes through computed setter; avoid duplicate updates
</script>
