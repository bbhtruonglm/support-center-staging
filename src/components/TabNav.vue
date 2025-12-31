<template>
  <div class="flex items-center overflow-x-auto no-scrollbar bg-zinc-100 p-1">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      @click="$emit('update:modelValue', tab.key)"
      class="flex-1 px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors rounded-sm"
      :class="[
        modelValue === tab.key
          ? 'bg-white shadow-[0_1px_3px_0_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] text-zinc-950 border border-gray-100'
          : 'text-zinc-500 hover:text-zinc-700',
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  key: string
  label: string
}

defineProps<{
  modelValue: string
  tabs: Tab[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
