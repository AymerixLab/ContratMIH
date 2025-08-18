<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <MegaphoneIcon class="inline w-6 h-6 mr-2" />
      Communication
    </div>
    
    <div class="p-6 space-y-6">
      <!-- Visual Communication -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Communication visuelle</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="visu_packComplet" class="block text-sm font-medium text-gray-700 mb-2">
              Pack complet
            </label>
            <Field
              id="visu_packComplet"
              name="visu_packComplet"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.visu_packComplet"
              placeholder="0"
            />
          </div>

          <div>
            <label for="visu_comptoir" class="block text-sm font-medium text-gray-700 mb-2">
              Comptoir
            </label>
            <Field
              id="visu_comptoir"
              name="visu_comptoir"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.visu_comptoir"
              placeholder="0"
            />
          </div>

          <div>
            <label for="visu_hautCloisons" class="block text-sm font-medium text-gray-700 mb-2">
              Haut de cloisons
            </label>
            <Field
              id="visu_hautCloisons"
              name="visu_hautCloisons"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.visu_hautCloisons"
              placeholder="0"
            />
          </div>

          <div>
            <label for="visu_cloisonComplete" class="block text-sm font-medium text-gray-700 mb-2">
              Cloison complète
            </label>
            <Field
              id="visu_cloisonComplete"
              name="visu_cloisonComplete"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.visu_cloisonComplete"
              placeholder="0"
            />
          </div>

          <div>
            <label for="visu_enseigneHaute" class="block text-sm font-medium text-gray-700 mb-2">
              Enseigne haute
            </label>
            <Field
              id="visu_enseigneHaute"
              name="visu_enseigneHaute"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.visu_enseigneHaute"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Amélioration Communication -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Amélioration communication</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label for="ameli_invitations" class="block text-sm font-medium text-gray-700 mb-2">
              Invitations
            </label>
            <Field
              id="ameli_invitations"
              name="ameli_invitations"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_invitations"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_demiPage" class="block text-sm font-medium text-gray-700 mb-2">
              1/2 page
            </label>
            <Field
              id="ameli_demiPage"
              name="ameli_demiPage"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_demiPage"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_unePage" class="block text-sm font-medium text-gray-700 mb-2">
              1 page
            </label>
            <Field
              id="ameli_unePage"
              name="ameli_unePage"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_unePage"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_deuxiemeCouverture" class="block text-sm font-medium text-gray-700 mb-2">
              2ème de couverture
            </label>
            <Field
              id="ameli_deuxiemeCouverture"
              name="ameli_deuxiemeCouverture"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_deuxiemeCouverture"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_quatriemeCouverture" class="block text-sm font-medium text-gray-700 mb-2">
              4ème de couverture
            </label>
            <Field
              id="ameli_quatriemeCouverture"
              name="ameli_quatriemeCouverture"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_quatriemeCouverture"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_logoPlan" class="block text-sm font-medium text-gray-700 mb-2">
              Logo sur plan
            </label>
            <Field
              id="ameli_logoPlan"
              name="ameli_logoPlan"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_logoPlan"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_goodies" class="block text-sm font-medium text-gray-700 mb-2">
              Goodies
            </label>
            <Field
              id="ameli_goodies"
              name="ameli_goodies"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_goodies"
              placeholder="0"
            />
          </div>

          <div>
            <label for="ameli_hotesse" class="block text-sm font-medium text-gray-700 mb-2">
              Hôtesse
            </label>
            <Field
              id="ameli_hotesse"
              name="ameli_hotesse"
              type="number"
              min="0"
              class="form-input"
              v-model.number="formData.ameli_hotesse"
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
import { MegaphoneIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.communication)

const { meta } = useForm({
  initialValues: formData.value
})

watch(meta, (newMeta) => {
  emit('step-validated', true) // Always valid for this step
}, { immediate: true, deep: true })

// v-model writes through computed setter; avoid duplicate updates
</script>
