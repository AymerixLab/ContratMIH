<template>
  <div class="sticky top-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-900 flex items-center">
        <CalculatorIcon class="w-5 h-5 mr-2 text-mih-coral" />
        Estimation
      </h3>
      <div v-if="formStore.formData.company.membrePorte" class="text-xs bg-mih-green text-white px-2 py-1 rounded-full">
        Membre PORTE -10%
      </div>
    </div>
    
    <div class="space-y-3">
      <!-- Stand Selection -->
      <div v-if="standTotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">{{ standDescription }}</span>
        <span class="font-medium">{{ standTotal.toFixed(2) }}€</span>
      </div>
      
      <!-- Power -->
      <div v-if="powerTotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">Électricité</span>
        <span class="font-medium">{{ powerTotal.toFixed(2) }}€</span>
      </div>
      
      <!-- Outdoor -->
      <div v-if="outdoorTotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">Espace extérieur</span>
        <span class="font-medium">{{ outdoorTotal.toFixed(2) }}€</span>
      </div>
      
      <!-- Equipment -->
      <div v-if="equipmentTotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">Équipements</span>
        <span class="font-medium">{{ equipmentTotal.toFixed(2) }}€</span>
      </div>
      
      <!-- Additional Products -->
      <div v-if="productsTotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">Produits suppl.</span>
        <span class="font-medium">{{ productsTotal.toFixed(2) }}€</span>
      </div>
      
      <!-- Communication -->
      <div v-if="communicationTotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">Communication</span>
        <span class="font-medium">{{ communicationTotal.toFixed(2) }}€</span>
      </div>
      
      <!-- Divider -->
      <hr class="my-3" v-if="subtotal > 0">
      
      <!-- Subtotal -->
      <div v-if="subtotal > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">Sous-total HT</span>
        <span class="font-medium">{{ subtotal.toFixed(2) }}€</span>
      </div>
      
      <!-- PORTE Discount -->
      <div v-if="porteDiscount > 0" class="flex justify-between text-sm text-mih-green">
        <span>Remise membre PORTE (-10%)</span>
        <span>-{{ porteDiscount.toFixed(2) }}€</span>
      </div>
      
      <!-- Total HT -->
      <div v-if="totalHT > 0" class="flex justify-between text-sm">
        <span class="text-gray-700 font-medium">Total HT</span>
        <span class="font-semibold">{{ totalHT.toFixed(2) }}€</span>
      </div>
      
      <!-- VAT -->
      <div v-if="vat > 0" class="flex justify-between text-sm text-gray-600">
        <span>TVA (20%)</span>
        <span>{{ vat.toFixed(2) }}€</span>
      </div>
      
      <!-- Total TTC -->
      <div v-if="totalTTC > 0" class="flex justify-between text-base font-bold text-mih-coral border-t pt-3">
        <span>Total TTC</span>
        <span>{{ totalTTC.toFixed(2) }}€</span>
      </div>
      
      <!-- Payment Terms -->
      <div v-if="totalTTC > 0" class="text-xs text-gray-500 border-t pt-3 space-y-1">
        <div class="flex justify-between">
          <span>Acompte (50%)</span>
          <span>{{ deposit.toFixed(2) }}€</span>
        </div>
        <div class="flex justify-between">
          <span>Solde</span>
          <span>{{ balance.toFixed(2) }}€</span>
        </div>
      </div>
      
      <!-- No selection message -->
      <div v-if="subtotal === 0" class="text-sm text-gray-500 text-center py-4">
        Sélectionnez vos options pour voir le prix
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CalculatorIcon } from '@heroicons/vue/24/outline'
import { useFormStore } from '@/stores/form'
import { 
  STAND_PRICING, 
  POWER_PRICING, 
  OUTDOOR_PRICING, 
  EQUIPMENT_PRICING,
  ADDITIONAL_PRODUCTS_PRICING,
  COMMUNICATION_PRICING,
  MOQUETTE_COLORS,
  getItemPricing,
  calculateStandPricing,
  TVA_RATE,
  PORTE_MEMBER_DISCOUNT
} from '@/config/pricing'

const formStore = useFormStore()

// Stand pricing calculation
const standTotal = computed(() => {
  const space = formStore.formData.spaceReservation
  let total = 0
  
  switch (space.selectedStandType) {
    case 'standEquipe':
      if (space.standEquipeSurface > 0) {
        total += calculateStandPricing('standEquipe', space.standEquipeSurface)
      }
      if (space.standEquipeAngle > 0) {
        total += space.standEquipeAngle * STAND_PRICING.standEquipeAngle.pricePerM2
      }
      break
    case 'standPretAExposer':
      if (space.pack12 > 0) total += STAND_PRICING.standPretAExposer.pack12.price
      if (space.pack15 > 0) total += STAND_PRICING.standPretAExposer.pack15.price
      if (space.pack18 > 0) total += STAND_PRICING.standPretAExposer.pack18.price
      if (space.packAngles > 0) total += space.packAngles * STAND_PRICING.standPretAExposer.packAngles.pricePerPack
      break
    case 'standNu':
      if (space.standNuSurface > 0) {
        total += calculateStandPricing('standNu', space.standNuSurface)
      }
      if (space.standNuAngle > 0) {
        total += space.standNuAngle * STAND_PRICING.standNuAngle.pricePerM2
      }
      break
  }
  
  return total
})

const standDescription = computed(() => {
  const space = formStore.formData.spaceReservation
  switch (space.selectedStandType) {
    case 'standEquipe':
      return `Stand équipé ${space.standEquipeSurface}m²${space.standEquipeAngle > 0 ? ` + angle ${space.standEquipeAngle}m²` : ''}`
    case 'standPretAExposer':
      let desc = 'Pack '
      if (space.pack12 > 0) desc += '12m²'
      else if (space.pack15 > 0) desc += '15m²'
      else if (space.pack18 > 0) desc += '18m²'
      if (space.packAngles > 0) desc += ` + ${space.packAngles} angle(s)`
      return desc
    case 'standNu':
      return `Stand nu ${space.standNuSurface}m²${space.standNuAngle > 0 ? ` + angle ${space.standNuAngle}m²` : ''}`
    default:
      return 'Stand'
  }
})

// Power pricing
const powerTotal = computed(() => {
  const option = POWER_PRICING.find(p => p.value === formStore.formData.spaceReservation.puissance)
  return option?.price || 0
})

// Outdoor pricing
const outdoorTotal = computed(() => {
  const space = formStore.formData.spaceReservation
  let total = 0
  
  if (space.surfaceExterieur > 0) {
    total += space.surfaceExterieur * OUTDOOR_PRICING.surfaceExterieur.pricePerM2
  }
  if (space.cottage > 0) {
    total += space.cottage * OUTDOOR_PRICING.cottage.price
  }
  
  // Moquette color supplement
  if (space.moquetteCouleur && space.moquetteCouleur !== 'gris') {
    const colorOption = MOQUETTE_COLORS.find(c => c.value === space.moquetteCouleur)
    if (colorOption?.price && space.standEquipeSurface > 0) {
      total += space.standEquipeSurface * colorOption.price
    }
  }
  
  return total
})

// Equipment pricing
const equipmentTotal = computed(() => {
  const equipment = formStore.formData.optionalEquipment
  let total = 0
  
  Object.entries(equipment).forEach(([key, value]) => {
    if (typeof value === 'number' && value > 0) {
      const pricing = getItemPricing(key)
      if (pricing) {
        total += value * pricing.price
      }
    }
  })
  
  return total
})

// Additional products pricing
const productsTotal = computed(() => {
  const products = formStore.formData.additionalProducts
  let total = 0
  
  if (products.scanBadges) {
    const scanPricing = getItemPricing('scanBadges')
    if (scanPricing) total += scanPricing.price
  }
  
  if (products.passSoiree > 0) {
    const passPricing = getItemPricing('passSoiree')
    if (passPricing) total += products.passSoiree * passPricing.price
  }
  
  return total
})

// Communication pricing
const communicationTotal = computed(() => {
  const communication = formStore.formData.communication
  let total = 0
  
  Object.entries(communication).forEach(([key, value]) => {
    if (typeof value === 'number' && value > 0) {
      const pricing = getItemPricing(key)
      if (pricing) {
        total += value * pricing.price
      }
    }
  })
  
  return total
})

// Totals
const subtotal = computed(() => {
  return standTotal.value + powerTotal.value + outdoorTotal.value + equipmentTotal.value + productsTotal.value + communicationTotal.value
})

const porteDiscount = computed(() => {
  return formStore.formData.company.membrePorte ? subtotal.value * PORTE_MEMBER_DISCOUNT : 0
})

const totalHT = computed(() => {
  return subtotal.value - porteDiscount.value
})

const vat = computed(() => {
  return totalHT.value * TVA_RATE
})

const totalTTC = computed(() => {
  return totalHT.value + vat.value
})

const deposit = computed(() => {
  return totalTTC.value * 0.5
})

const balance = computed(() => {
  return totalTTC.value - deposit.value
})
</script>