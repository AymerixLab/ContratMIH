<template>
  <footer class="bg-gray-50 border-t border-gray-200 mt-16">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center text-sm text-gray-600">
        <p class="mb-2">
          <strong>Porte du Hainaut Développement</strong>
        </p>
        <p class="mb-2">
          « Salon Made in Hainaut » - rue Michel Rondet BP 28 - 59135 WALLERS-ARENBERG
        </p>
        <p class="mb-4">
          📞 Vert : 0 800 059 135 | 📧 mih@agence-porteduhainaut.fr
        </p>
        <p class="text-xs text-gray-500">
          Retrouvez toutes les infos sur : 
          <a href="https://www.salon-madeinhainaut.com" 
             target="_blank" 
             rel="noopener noreferrer"
             class="text-mih-coral hover:text-mih-coral-dark underline">
            www.salon-madeinhainaut.com
          </a>
        </p>
        <p class="mt-4 text-xs text-gray-400">
          © {{ new Date().getFullYear() }} Made in Hainaut. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No setup needed for this component
</script>