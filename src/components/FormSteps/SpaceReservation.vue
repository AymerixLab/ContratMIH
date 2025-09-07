<template>
  <div class="card animate-fade-in">
    <div class="section-header">
      <BuildingStorefrontIcon class="inline w-6 h-6 mr-2" />
      Réservation d'espace
    </div>
    
    <div class="p-6 space-y-8">
      <!-- Stand Type Selection Cards -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-6">Choisissez votre type de stand</h3>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Stand Équipé Card -->
          <div 
            class="relative border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden"
            :class="[
              selectedStandType === 'standEquipe' 
                ? 'border-mih-coral bg-mih-coral/5 ring-2 ring-mih-coral ring-opacity-20' 
                : 'border-gray-200 hover:border-mih-coral/50'
            ]"
            @click="selectStandType('standEquipe')"
          >
            <!-- Image Section -->
            <div class="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
              <img 
                src="/src/assets/equipe.jpeg" 
                alt="Stand Équipé" 
                class="w-full h-full object-contain"
              />
              <!-- Selection Indicator -->
              <div 
                class="absolute top-3 left-3 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center"
                :class="selectedStandType === 'standEquipe' ? 'border-mih-coral' : 'border-gray-300'"
              >
                <div 
                  v-if="selectedStandType === 'standEquipe'" 
                  class="w-3 h-3 rounded-full bg-mih-coral"
                ></div>
              </div>
              <!-- Selected Badge -->
              <div 
                v-if="selectedStandType === 'standEquipe'"
                class="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium"
              >
                ✓ Sélectionné
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-lg text-gray-900">Stand Équipé</h4>
                <div class="text-right">
                  <div class="text-sm font-medium text-mih-coral">{{ STAND_PRICING.standEquipe.pricePerM2 }}€/m²</div>
                  <div class="text-xs text-gray-500">{{ STAND_PRICING.standEquipe.minSize }}-{{ STAND_PRICING.standEquipe.maxSize }}m²</div>
                </div>
              </div>
            
            <p class="text-sm text-gray-600 mb-4">{{ STAND_PRICING.standEquipe.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="text-xs font-medium text-gray-700 mb-2">Inclus :</div>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="item in STAND_PRICING.standEquipe.included" :key="item" class="flex items-center">
                  <CheckIcon class="w-3 h-3 text-mih-green mr-2" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Stand Équipé Configuration -->
            <div v-if="selectedStandType === 'standEquipe'" class="mt-6 space-y-4 border-t pt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Taille du stand
                </label>
                <select 
                  v-model="formData.standEquipeSurface"
                  class="form-input"
                  @change="updatePricing"
                >
                  <option :value="0">Sélectionner une taille</option>
                  <option 
                    v-for="size in STAND_EQUIPE_SIZES" 
                    :key="size.value" 
                    :value="size.value"
                  >
                    {{ size.label }} - {{ calculateStandPrice('standEquipe', size.value) }}€
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Stand angle (max 2) - Supplément {{ STAND_PRICING.standEquipeAngle.pricePerM2 }}€/m²
                </label>
                <input 
                  v-model.number="formData.standEquipeAngle"
                  type="number"
                  min="0"
                  max="2"
                  class="form-input"
                  @change="updatePricing"
                />
              </div>
            </div>
            </div>
          </div>

          <!-- Stand Prêt à Exposer Card -->
          <div 
            class="relative border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden"
            :class="[
              selectedStandType === 'standPretAExposer' 
                ? 'border-mih-coral bg-mih-coral/5 ring-2 ring-mih-coral ring-opacity-20' 
                : 'border-gray-200 hover:border-mih-coral/50'
            ]"
            @click="selectStandType('standPretAExposer')"
          >
            <!-- Image Section -->
            <div class="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100">
              <img 
                src="/src/assets/pret_expose.jpeg" 
                alt="Stand Prêt à Exposer" 
                class="w-full h-full object-contain"
              />
              <!-- Selection Indicator -->
              <div 
                class="absolute top-3 left-3 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center"
                :class="selectedStandType === 'standPretAExposer' ? 'border-mih-coral' : 'border-gray-300'"
              >
                <div 
                  v-if="selectedStandType === 'standPretAExposer'" 
                  class="w-3 h-3 rounded-full bg-mih-coral"
                ></div>
              </div>
              <!-- Selected Badge -->
              <div 
                v-if="selectedStandType === 'standPretAExposer'"
                class="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium"
              >
                ✓ Sélectionné
              </div>
            </div>
            
            <!-- Content Section -->
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold text-lg text-gray-900">Stand Prêt à Exposer</h4>
                <div class="text-right">
                  <div class="text-sm font-medium text-mih-coral">Clé en main</div>
                  <div class="text-xs text-gray-500">12-18m²</div>
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mb-4">Solution complète avec mobilier et décoration inclus</p>
            
            <!-- Pack Options -->
            <div v-if="selectedStandType === 'standPretAExposer'" class="mt-6 space-y-4 border-t pt-4">
              <div class="grid grid-cols-1 gap-3">
                <label v-for="pack in PACK_OPTIONS" :key="pack.key" class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    :value="pack.key === 'pack12' ? 12 : pack.key === 'pack15' ? 15 : 18"
                    v-model.number="selectedPack"
                    type="radio"
                    name="pack"
                    class="form-radio mr-3"
                    @change="updatePack"
                  />
                  <div class="flex-1">
                    <div class="font-medium">{{ pack.label }}</div>
                    <div class="text-sm text-gray-600">{{ pack.description }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-mih-coral">{{ pack.price }}€</div>
                  </div>
                </label>
              </div>
              
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Supplément angle (max 4) - {{ STAND_PRICING.standPretAExposer.packAngles.pricePerPack }}€ par pack
                </label>
                <input 
                  v-model.number="formData.packAngles"
                  type="number"
                  min="0"
                  max="4"
                  class="form-input"
                  @change="updatePricing"
                />
              </div>
            </div>
            </div>
          </div>

          <!-- Stand Nu Card -->
          <div 
            class="relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg"
            :class="[
              selectedStandType === 'standNu' 
                ? 'border-mih-coral bg-mih-coral/5 ring-2 ring-mih-coral ring-opacity-20' 
                : 'border-gray-200 hover:border-mih-coral/50'
            ]"
            @click="selectStandType('standNu')"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div 
                  class="w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center"
                  :class="selectedStandType === 'standNu' ? 'border-mih-coral' : 'border-gray-300'"
                >
                  <div 
                    v-if="selectedStandType === 'standNu'" 
                    class="w-2 h-2 rounded-full bg-mih-coral"
                  ></div>
                </div>
                <h4 class="font-semibold text-lg text-gray-900">Stand Nu</h4>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-mih-coral">{{ STAND_PRICING.standNu.pricePerM2 }}€/m²</div>
                <div class="text-xs text-gray-500">{{ STAND_PRICING.standNu.minSize }}-{{ STAND_PRICING.standNu.maxSize }}m²</div>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-4">{{ STAND_PRICING.standNu.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="text-xs font-medium text-gray-700 mb-2">Inclus :</div>
              <ul class="text-xs text-gray-600 space-y-1">
                <li v-for="item in STAND_PRICING.standNu.included" :key="item" class="flex items-center">
                  <CheckIcon class="w-3 h-3 text-mih-green mr-2" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- Stand Nu Configuration -->
            <div v-if="selectedStandType === 'standNu'" class="mt-6 space-y-4 border-t pt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Surface ({{ STAND_PRICING.standNu.minSize }}-{{ STAND_PRICING.standNu.maxSize }}m²)
                </label>
                <input 
                  v-model.number="formData.standNuSurface"
                  type="number"
                  :min="STAND_PRICING.standNu.minSize"
                  :max="STAND_PRICING.standNu.maxSize"
                  class="form-input"
                  :class="{ 'border-red-300': standNuSurfaceError }"
                  @input="updatePricing"
                />
                <p v-if="standNuSurfaceError" class="text-red-500 text-sm mt-1">{{ standNuSurfaceError }}</p>
                <div v-if="formData.standNuSurface > 0" class="text-sm text-gray-600 mt-1">
                  Prix: {{ calculateStandPrice('standNu', formData.standNuSurface) }}€
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Stand nu angle - Supplément {{ STAND_PRICING.standNuAngle.pricePerM2 }}€/m²
                </label>
                <input 
                  v-model.number="formData.standNuAngle"
                  type="number"
                  min="0"
                  class="form-input"
                  @input="updatePricing"
                />
                <div v-if="formData.standNuAngle > 0" class="text-sm text-gray-600 mt-1">
                  Prix: {{ calculateStandPrice('standNuAngle', formData.standNuAngle) }}€
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Options -->
      <div class="border-t pt-8" v-if="selectedStandType">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Options supplémentaires</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Electrical Power -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Puissance électrique
            </label>
            <div class="space-y-2">
              <div 
                v-for="option in POWER_PRICING" 
                :key="option.value"
                class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{ 'border-mih-coral bg-mih-coral/5': formData.puissance === option.value }"
                @click="formData.puissance = option.value; updatePricing()"
              >
                <input 
                  type="radio"
                  :value="option.value"
                  v-model="formData.puissance"
                  class="form-radio mr-3"
                />
                <div class="flex-1">
                  <div class="font-medium">{{ option.label }}</div>
                </div>
                <div class="text-right font-medium text-mih-coral">
                  {{ option.price }}€
                </div>
              </div>
            </div>
          </div>

          <!-- Outdoor Space -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Espace extérieur
            </label>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 mb-2">
                  Surface ({{ OUTDOOR_PRICING.surfaceExterieur.minSize }}-{{ OUTDOOR_PRICING.surfaceExterieur.maxSize }}m²) - {{ OUTDOOR_PRICING.surfaceExterieur.pricePerM2 }}€/m²
                </label>
                <input 
                  v-model.number="formData.surfaceExterieur"
                  type="number"
                  :min="OUTDOOR_PRICING.surfaceExterieur.minSize"
                  :max="OUTDOOR_PRICING.surfaceExterieur.maxSize"
                  class="form-input"
                  :class="{ 'border-red-300': surfaceExterieurError }"
                  @input="updatePricing"
                />
                <p v-if="surfaceExterieurError" class="text-red-500 text-sm mt-1">{{ surfaceExterieurError }}</p>
                <div v-if="formData.surfaceExterieur > 0" class="text-sm text-gray-600 mt-1">
                  Prix: {{ formData.surfaceExterieur * OUTDOOR_PRICING.surfaceExterieur.pricePerM2 }}€
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-600 mb-2">
                  Garden Cottage {{ requiresCottage ? '(obligatoire)' : '' }} - {{ OUTDOOR_PRICING.cottage.price }}€
                </label>
                <input 
                  v-model.number="formData.cottage"
                  type="number"
                  min="0"
                  class="form-input"
                  :class="{ 'border-red-300': cottageError }"
                  @input="updatePricing"
                />
                <p v-if="cottageError" class="text-red-500 text-sm mt-1">{{ cottageError }}</p>
              </div>
            </div>
          </div>

          <!-- Moquette Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Couleur de moquette
            </label>
            <select 
              v-model="formData.moquetteCouleur"
              class="form-input"
              @change="updatePricing"
            >
              <option value="">Sélectionner une couleur</option>
              <option 
                v-for="color in PRICING_MOQUETTE_COLORS" 
                :key="color.value" 
                :value="color.value"
              >
                {{ color.label }} {{ color.price > 0 ? `(+${color.price}€/m²)` : '' }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Co-Exposants Section -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Co-Exposants 
          <span class="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
            Surface: {{ totalSurface }}m² | Can add: {{ canAddCoExposant }}
          </span>
        </h3>
        <div v-if="!canAddCoExposant" class="text-sm text-gray-500 mb-4">
          Les co-exposants ne sont disponibles qu'à partir de 12m² de surface totale.
        </div>
        <div v-else class="space-y-4">
          <div v-if="(formData.coExposants || []).length === 0" class="text-sm text-gray-600 mb-4">
            Option co-exposant : +400€ par co-exposant
          </div>
          
          <!-- Co-Exposants List -->
          <div v-for="(coExposant, index) in (formData.coExposants || [])" :key="index" class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-medium text-gray-900">Co-Exposant {{ index + 1 }} (+400€)</h4>
              <button 
                @click="removeCoExposant(index)"
                type="button"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="coExposant.nomEntreprise"
                  type="text"
                  class="form-input"
                  placeholder="Nom de l'entreprise"
                  @input="updatePricing"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="coExposant.nom"
                  type="text"
                  class="form-input"
                  placeholder="Nom du responsable"
                  @input="updatePricing"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="coExposant.prenom"
                  type="text"
                  class="form-input"
                  placeholder="Prénom du responsable"
                  @input="updatePricing"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="coExposant.email"
                  type="email"
                  class="form-input"
                  placeholder="email@exemple.fr"
                  @input="updatePricing"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="coExposant.telephone"
                  type="tel"
                  class="form-input"
                  placeholder="03 20 00 00 00"
                  @input="updatePricing"
                />
              </div>
            </div>
          </div>
          
          <!-- Add Co-Exposant Button -->
          <button
            @click="addCoExposant"
            type="button"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 hover:border-mih-coral hover:text-mih-coral transition-colors"
            :disabled="!canAddCoExposant"
          >
            + Ajouter un co-exposant (+400€)
          </button>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="border-t pt-6">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start">
            <InformationCircleIcon class="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 class="font-medium text-yellow-800">Information</h4>
              <p class="text-sm text-yellow-700 mt-1">
                Pour toute information complémentaire contactez-nous au <strong>06 85 91 32 69</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import { useForm } from 'vee-validate'
import { BuildingStorefrontIcon, CheckIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { STAND_EQUIPE_SIZES, MOQUETTE_COLORS } from '@/types/form'
import { 
  STAND_PRICING, 
  POWER_PRICING, 
  OUTDOOR_PRICING, 
  MOQUETTE_COLORS as PRICING_MOQUETTE_COLORS,
  calculateStandPricing 
} from '@/config/pricing'

const formStore = useFormStore()
const emit = defineEmits<{
  'step-validated': [isValid: boolean]
}>()

const formData = computed(() => formStore.formData.spaceReservation)
const selectedStandType = computed(() => formData.value.selectedStandType)

// Pack selection helper
const selectedPack = ref<number>(0)

const PACK_OPTIONS = [
  {
    key: 'pack12',
    label: 'Pack 12m²',
    price: STAND_PRICING.standPretAExposer.pack12.price,
    description: STAND_PRICING.standPretAExposer.pack12.description
  },
  {
    key: 'pack15', 
    label: 'Pack 15m²',
    price: STAND_PRICING.standPretAExposer.pack15.price,
    description: STAND_PRICING.standPretAExposer.pack15.description
  },
  {
    key: 'pack18',
    label: 'Pack 18m²', 
    price: STAND_PRICING.standPretAExposer.pack18.price,
    description: STAND_PRICING.standPretAExposer.pack18.description
  }
]

// Total surface calculation for co-exposant availability
const totalSurface = computed(() => {
  let total = 0
  
  // Stand Équipé
  if (formData.value.standEquipeSurface > 0) {
    total += formData.value.standEquipeSurface
  }
  
  // Stand Nu
  if (formData.value.standNuSurface > 0) {
    total += formData.value.standNuSurface
  }
  
  // Packs (mutually exclusive)
  if (formData.value.pack12 > 0) total += 12
  else if (formData.value.pack15 > 0) total += 15
  else if (formData.value.pack18 > 0) total += 18
  
  console.log('📏 Total surface calculation:', {
    standEquipe: formData.value.standEquipeSurface,
    standNu: formData.value.standNuSurface,
    pack12: formData.value.pack12,
    pack15: formData.value.pack15,
    pack18: formData.value.pack18,
    total
  })
  
  return total
})

const canAddCoExposant = computed(() => {
  const surface = totalSurface.value
  console.log('🔍 Co-exposant check: totalSurface =', surface, ', canAdd =', surface >= 12)
  return surface >= 12
})

// Co-Exposant methods
const addCoExposant = () => {
  if (canAddCoExposant.value) {
    // Ensure the coExposants array exists
    if (!formData.value.coExposants) {
      formData.value.coExposants = []
    }
    
    formData.value.coExposants.push({
      nomEntreprise: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    })
    updatePricing()
  }
}

const removeCoExposant = (index: number) => {
  if (formData.value.coExposants && index >= 0 && index < formData.value.coExposants.length) {
    formData.value.coExposants.splice(index, 1)
    updatePricing()
  }
}

// Validation computed properties
const standNuSurfaceError = computed(() => {
  if (formData.value.standNuSurface > 0 && (formData.value.standNuSurface < STAND_PRICING.standNu.minSize || formData.value.standNuSurface > STAND_PRICING.standNu.maxSize)) {
    return `La surface doit être entre ${STAND_PRICING.standNu.minSize} et ${STAND_PRICING.standNu.maxSize} m²`
  }
  return null
})

const surfaceExterieurError = computed(() => {
  if (formData.value.surfaceExterieur > 0 && (formData.value.surfaceExterieur < OUTDOOR_PRICING.surfaceExterieur.minSize || formData.value.surfaceExterieur > OUTDOOR_PRICING.surfaceExterieur.maxSize)) {
    return `La surface extérieure doit être entre ${OUTDOOR_PRICING.surfaceExterieur.minSize} et ${OUTDOOR_PRICING.surfaceExterieur.maxSize} m²`
  }
  return null
})

const requiresCottage = computed(() => {
  return formData.value.surfaceExterieur > 0 && !selectedStandType.value
})

const cottageError = computed(() => {
  if (requiresCottage.value && !formData.value.cottage) {
    return 'Garden Cottage obligatoire si aucun stand intérieur'
  }
  return null
})

const { meta, resetForm } = useForm({
  initialValues: formData.value,
  validateOnMount: false
})

// Watch for store data changes and reset form with new values
watch(formData, (newFormData) => {
  // Use nextTick to ensure DOM is updated before resetting form
  nextTick(() => {
    resetForm({ values: newFormData })
  })
}, { deep: true, immediate: true })

// Functions
const selectStandType = (standType: 'standEquipe' | 'standPretAExposer' | 'standNu') => {
  formStore.selectStandType(standType)
  updatePricing()
}

const calculateStandPrice = (standType: string, size: number) => {
  return calculateStandPricing(standType, size)
}

const updatePack = () => {
  // Clear all packs first
  formData.value.pack12 = 0
  formData.value.pack15 = 0  
  formData.value.pack18 = 0
  
  // Set selected pack
  if (selectedPack.value === 12) formData.value.pack12 = 1
  if (selectedPack.value === 15) formData.value.pack15 = 1
  if (selectedPack.value === 18) formData.value.pack18 = 1
  
  updatePricing()
}

const updatePricing = () => {
  // Trigger reactivity and validation
  const isValid = !standNuSurfaceError.value && !surfaceExterieurError.value && !cottageError.value && selectedStandType.value
  emit('step-validated', isValid)
}

// Watch for validation errors
watch([standNuSurfaceError, surfaceExterieurError, cottageError, selectedStandType], () => {
  const isValid = !standNuSurfaceError.value && !surfaceExterieurError.value && !cottageError.value && selectedStandType.value
  emit('step-validated', isValid)
}, { immediate: true })

// Initialize pack selection
watch(() => formData.value, (newData) => {
  if (newData.pack12 > 0) selectedPack.value = 12
  else if (newData.pack15 > 0) selectedPack.value = 15 
  else if (newData.pack18 > 0) selectedPack.value = 18
  else selectedPack.value = 0
}, { immediate: true })
</script>

<style scoped>
.form-radio {
  @apply w-4 h-4 text-mih-coral border-gray-300 focus:ring-mih-coral focus:ring-2;
}
</style>