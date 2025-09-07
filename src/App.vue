<template>
  <div id="app" class="min-h-screen bg-mih-light">
    <AppHeader />
    <!-- Offline banner -->
    <div v-if="!isOnline" class="bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm py-2 text-center">
      Mode hors-ligne — envoi différé<span v-if="queueCount > 0"> · {{ queueCount }} en attente</span>
    </div>
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-7xl mx-auto pb-28 md:pb-0">
        <div class="flex justify-center">
          <div class="lg:grid lg:grid-cols-12 lg:gap-8 w-full max-w-6xl">
            <!-- Main Form Area -->
            <div class="lg:col-span-8">
              <ProgressIndicator />
              <StepNavigator />
              <FormContainer />
            </div>
            
            <!-- Pricing Calculator Sidebar -->
            <div class="lg:col-span-4 mt-8 lg:mt-0">
              <PricingCalculator />
            </div>
          </div>
        </div>
      </div>
    </main>
    <ToastContainer />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useFormStore } from '@/stores/form'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'
import StepNavigator from '@/components/StepNavigator.vue'
import FormContainer from '@/components/FormContainer.vue'
import PricingCalculator from '@/components/PricingCalculator.vue'
import { googleSheetsService } from '@/services/googleSheets'
import ToastContainer from '@/components/ToastContainer.vue'

const formStore = useFormStore()
const isOnline = ref<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)
const queueCount = ref<number>(0)

// SEO and PWA meta tags
useHead({
  title: 'Contrat de participation MIH 2026',
  meta: [
    { name: 'description', content: 'Générateur de contrats de participation pour le Salon Made in Hainaut 2026' },
    { name: 'keywords', content: 'salon, made in hainaut, contrat, participation, 2026' },
    { name: 'author', content: 'Porte du Hainaut Développement' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'theme-color', content: '#e85d40' },
    { property: 'og:title', content: 'Contrat de participation MIH 2026' },
    { property: 'og:description', content: 'Générateur de contrats de participation pour le Salon Made in Hainaut 2026' },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ]
})

const updateOnline = () => {
  isOnline.value = navigator.onLine
  if (isOnline.value) {
    googleSheetsService.flushQueue()
  }
}
const onQueueUpdate = (e: Event) => {
  const ev = e as CustomEvent<number>
  queueCount.value = ev.detail || 0
}

onMounted(() => {
  // Load saved form data on app start
  formStore.loadFromStorage()
  // Initialize network listeners
  window.addEventListener('online', updateOnline)
  window.addEventListener('offline', updateOnline)
  window.addEventListener('mih:queue-updated', onQueueUpdate as EventListener)
  // Initialize queue count and attempt flush on startup
  googleSheetsService.getQueueLength().then(c => { queueCount.value = c })
  if (navigator.onLine) {
    googleSheetsService.flushQueue()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('online', updateOnline)
  window.removeEventListener('offline', updateOnline)
  window.removeEventListener('mih:queue-updated', onQueueUpdate as EventListener)
})
</script>

<style scoped>
#app {
  font-feature-settings: 'cv03', 'cv04', 'cv11';
}
</style>
