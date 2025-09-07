<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <CubeIcon class="inline w-6 h-6 mr-2" />
      Équipements optionnels
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Stand Equipment -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Équipement de stand</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="reserveMelamine" class="block text-sm font-medium text-gray-700 mb-2">
              Réserve 1 m² - {{ getPrice('reserveMelamine') }}€
            </label>
            <Field
              id="reserveMelamine"
              name="reserveMelamine"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.reserveMelamine"
              placeholder="0"
            />
          </div>


          <div>
            <label for="velum" class="block text-sm font-medium text-gray-700 mb-2">
              Vélum (m²)
            </label>
            <Field
              id="velum"
              name="velum"
              type="number"
              min="0"
              step="0.1"
              class="form-input"
              v-model.number="formData.velum"
              placeholder="0"
            />
          </div>

          <div>
            <label for="cloisonBoisTissu" class="block text-sm font-medium text-gray-700 mb-2">
              Cloison bois/tissu (ml)
            </label>
            <Field
              id="cloisonBoisTissu"
              name="cloisonBoisTissu"
              type="number"
              min="0"
              step="0.1"
              class="form-input"
              v-model.number="formData.cloisonBoisTissu"
              placeholder="0"
            />
          </div>

          <div>
            <label for="reserveBois" class="block text-sm font-medium text-gray-700 mb-2">
              Réserve
            </label>
            <Field
              id="reserveBois"
              name="reserveBois"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.reserveBois"
              placeholder="0"
            />
          </div>

          <div>
            <label for="railSpots" class="block text-sm font-medium text-gray-700 mb-2">
              Rail de 3 spots supp (1-3 max) - {{ getPrice('railSpots') }}€
            </label>
            <Field
              id="railSpots"
              name="railSpots"
              type="number"
              min="0"
              max="3"
              class="form-input"
              v-model.number="formData.railSpots"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Furniture -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Mobilier</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="mobilier_comptoir" class="block text-sm font-medium text-gray-700 mb-2">
              Comptoir - {{ getPrice('mobilier_comptoir') }}€
            </label>
            <Field
              id="mobilier_comptoir"
              name="mobilier_comptoir"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_comptoir"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_tabouret" class="block text-sm font-medium text-gray-700 mb-2">
              Tabouret
            </label>
            <Field
              id="mobilier_tabouret"
              name="mobilier_tabouret"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_tabouret"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_mangeDebout" class="block text-sm font-medium text-gray-700 mb-2">
              Mange-debout
            </label>
            <Field
              id="mobilier_mangeDebout"
              name="mobilier_mangeDebout"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_mangeDebout"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_chaise" class="block text-sm font-medium text-gray-700 mb-2">
              Chaise
            </label>
            <Field
              id="mobilier_chaise"
              name="mobilier_chaise"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_chaise"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_table120" class="block text-sm font-medium text-gray-700 mb-2">
              Table 120cm
            </label>
            <Field
              id="mobilier_table120"
              name="mobilier_table120"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_table120"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_packMangeDebout" class="block text-sm font-medium text-gray-700 mb-2">
              Pack mange-debout et 3 tabourets (max 4) - {{ getPrice('mobilier_packMangeDebout') }}€
            </label>
            <Field
              id="mobilier_packMangeDebout"
              name="mobilier_packMangeDebout"
              type="number"
              min="0"
              max="4"
              class="form-input"
              v-model.number="formData.mobilier_packMangeDebout"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_ecran52" class="block text-sm font-medium text-gray-700 mb-2">
              Écran 52" (max 2) - {{ getPrice('mobilier_ecran52') }}€
            </label>
            <Field
              id="mobilier_ecran52"
              name="mobilier_ecran52"
              type="number"
              min="0"
              max="2"
              class="form-input"
              v-model.number="formData.mobilier_ecran52"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_frigo140" class="block text-sm font-medium text-gray-700 mb-2">
              Frigo 140L
            </label>
            <Field
              id="mobilier_frigo140"
              name="mobilier_frigo140"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_frigo140"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_frigo260" class="block text-sm font-medium text-gray-700 mb-2">
              Frigo 260L
            </label>
            <Field
              id="mobilier_frigo260"
              name="mobilier_frigo260"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_frigo260"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_presentoir" class="block text-sm font-medium text-gray-700 mb-2">
              Présentoir
            </label>
            <Field
              id="mobilier_presentoir"
              name="mobilier_presentoir"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_presentoir"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_bandeau" class="block text-sm font-medium text-gray-700 mb-2">
              Bandeau
            </label>
            <Field
              id="mobilier_bandeau"
              name="mobilier_bandeau"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_bandeau"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_blocPrises" class="block text-sm font-medium text-gray-700 mb-2">
              Bloc prises
            </label>
            <Field
              id="mobilier_blocPrises"
              name="mobilier_blocPrises"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_blocPrises"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_fauteuil" class="block text-sm font-medium text-gray-700 mb-2">
              Fauteuil
            </label>
            <Field
              id="mobilier_fauteuil"
              name="mobilier_fauteuil"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_fauteuil"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_tableBasse" class="block text-sm font-medium text-gray-700 mb-2">
              Table basse
            </label>
            <Field
              id="mobilier_tableBasse"
              name="mobilier_tableBasse"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_tableBasse"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_gueridonHaut" class="block text-sm font-medium text-gray-700 mb-2">
              Guéridon haut
            </label>
            <Field
              id="mobilier_gueridonHaut"
              name="mobilier_gueridonHaut"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_gueridonHaut"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_poufCube" class="block text-sm font-medium text-gray-700 mb-2">
              Pouf cube
            </label>
            <Field
              id="mobilier_poufCube"
              name="mobilier_poufCube"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_poufCube"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_colonneVitrine" class="block text-sm font-medium text-gray-700 mb-2">
              Colonne vitrine
            </label>
            <Field
              id="mobilier_colonneVitrine"
              name="mobilier_colonneVitrine"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_colonneVitrine"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_comptoirVitrine" class="block text-sm font-medium text-gray-700 mb-2">
              Comptoir vitrine
            </label>
            <Field
              id="mobilier_comptoirVitrine"
              name="mobilier_comptoirVitrine"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_comptoirVitrine"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_porteManteaux" class="block text-sm font-medium text-gray-700 mb-2">
              Porte-manteaux
            </label>
            <Field
              id="mobilier_porteManteaux"
              name="mobilier_porteManteaux"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_porteManteaux"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_planteBambou" class="block text-sm font-medium text-gray-700 mb-2">
              Plante bambou
            </label>
            <Field
              id="mobilier_planteBambou"
              name="mobilier_planteBambou"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_planteBambou"
              placeholder="0"
            />
          </div>

          <div>
            <label for="mobilier_planteKentia" class="block text-sm font-medium text-gray-700 mb-2">
              Plante kentia
            </label>
            <Field
              id="mobilier_planteKentia"
              name="mobilier_planteKentia"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.mobilier_planteKentia"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick } from 'vue'
import { Field, useForm } from 'vee-validate'
import { CubeIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { getItemPricing } from '@/config/pricing'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.optionalEquipment)

// Helper function to get price for equipment
const getPrice = (itemId: string) => {
  const pricing = getItemPricing(itemId)
  return pricing ? pricing.price : 0
}

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
