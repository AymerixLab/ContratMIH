<template>
  <div
    class="fixed inset-x-0 z-50 flex flex-col items-center pointer-events-none"
    :class="['md:bottom-6 bottom-24']"
  >
    <div class="w-full max-w-md space-y-2 px-4">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto rounded-lg shadow-md border px-4 py-3 flex items-start gap-2"
          :class="toastClass(t.type)"
          role="status"
          aria-live="polite"
        >
          <span class="text-sm font-medium">{{ t.message }}</span>
          <button
            class="ml-auto text-xs opacity-70 hover:opacity-100"
            @click="dismiss(t.id)"
          >
            Fermer
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive } from 'vue'

type ToastType = 'success' | 'info' | 'warning' | 'error'
interface Toast { id: number; message: string; type: ToastType }

const toasts = reactive<Toast[]>([])
let nextId = 1

function toastClass(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800'
  }
}

function addToast(message: string, type: ToastType = 'info') {
  const id = nextId++
  toasts.push({ id, message, type })
  setTimeout(() => dismiss(id), 3200)
}

function dismiss(id: number) {
  const idx = toasts.findIndex(t => t.id === id)
  if (idx !== -1) toasts.splice(idx, 1)
}

function onToast(e: Event) {
  const ev = e as CustomEvent<{ message: string; type?: ToastType }>
  if (!ev.detail?.message) return
  addToast(ev.detail.message, ev.detail.type || 'info')
}

onMounted(() => {
  window.addEventListener('mih:toast', onToast as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('mih:toast', onToast as EventListener)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 200ms ease-out;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

