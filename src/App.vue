<template>
  <div id="app" class="min-h-screen bg-mih-light">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <ProgressIndicator />
        <StepNavigator />
        <FormContainer />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useFormStore } from '@/stores/form'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'
import StepNavigator from '@/components/StepNavigator.vue'
import FormContainer from '@/components/FormContainer.vue'

const formStore = useFormStore()

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

onMounted(() => {
  // Load saved form data on app start
  formStore.loadFromStorage()
})
</script>

<style scoped>
#app {
  font-feature-settings: 'cv03', 'cv04', 'cv11';
}
</style>