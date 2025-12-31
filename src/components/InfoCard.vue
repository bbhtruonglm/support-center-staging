<template>
  <section class="bg-white rounded-lg px-4 py-2 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
    <div v-if="title" class="border-b border-gray-200 py-2">
      <h3 class="text-base font-medium">{{ title }}</h3>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
