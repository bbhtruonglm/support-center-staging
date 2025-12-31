<template>
  <button
    class="flex items-center justify-between w-full py-2 border-b border-gray-200 last:border-0"
  >
    <div class="flex items-center gap-3">
      <img v-if="icon" :src="icon" alt="Icon" class="w-8 h-8 object-contain" />
      <div class="flex flex-col items-start gap-0.5">
        <span class="text-sm font-medium">{{ title }}</span>
        <span v-if="subtitle" class="text-xs">
          {{ subtitle }}
        </span>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <slot name="right-icon" />
      <ChevronRight :size="20" class="text-slate-900" :stroke-width="2" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  icon?: string
  title: string
  subtitle?: string
}>()
</script>
