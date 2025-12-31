<template>
  <div class="bg-white py-3 px-4 border-b border-gray-200 text-black">
    <div class="flex items-center justify-between">
      <button class="flex items-center gap-1 flex-1 cursor-pointer" @click="handleBack">
        <ArrowLeftCircle class="w-6 h-6 text-black" :stroke-width="2" />
        <span class="text-sm font-semibold">{{ backText }}</span>
      </button>
      <h1 class="text-base font-bold flex-1 text-center">{{ title }}</h1>
      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeftCircle } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title: string
    backText?: string
  }>(),
  {
    backText: 'Quay lại',
  },
)

const emit = defineEmits<{
  (e: 'back'): void
}>()

const router = useRouter()

const handleBack = () => {
  emit('back')
  router.back()
}
</script>
