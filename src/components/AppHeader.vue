<template>
  <header class="bg-white px-3 py-1 flex items-center gap-1 text-black">
    <button class="flex items-center justify-center w-6 h-6" @click="$emit('back')">
      <ChevronLeft :size="20" :stroke-width="2" />
    </button>
    <h1 class="text-base font-medium">{{ title }}</h1>
  </header>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: 'Trung tâm hỗ trợ khách hàng',
  },
)

defineEmits<{
  (e: 'back'): void
}>()
</script>
