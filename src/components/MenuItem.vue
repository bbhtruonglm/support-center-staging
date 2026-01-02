<template>
  <component
    :is="componentTag"
    :href="href"
    :to="to"
    @click="handleClick"
    :class="[
      'flex items-center justify-between w-full py-2 border-b border-gray-200 last:border-0 text-left cursor-pointer',
      isLoading && 'opacity-50 cursor-not-allowed pointer-events-none',
    ]"
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
    <div class="flex items-center gap-3">
      <slot name="right-icon" />
      <Loader2 v-if="isLoading" :size="20" class="text-slate-900 animate-spin" :stroke-width="2" />
      <ChevronRight v-else :size="20" class="text-slate-900" :stroke-width="2" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  icon?: string
  title: string
  subtitle?: string
  type?: 'tel' | 'email' | 'button'
  url?: string
  to?: string | object
}>()

/** Trạng thái loading */
const isLoading = ref(false)

/** Thời gian delay giữa các lần click (ms) */
const CLICK_DELAY = 500

/** Xử lý click với delay */
const handleClick = (e: Event) => {
  if (isLoading.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, CLICK_DELAY)
}

const componentTag = computed(() => {
  if (props.to) return 'RouterLink'
  if (props.type === 'tel' || props.type === 'email' || props.url) return 'a'
  return 'button'
})

const href = computed(() => {
  if (props.url) return props.url
  if (props.type === 'email') return `mailto:${props.title}`
  if (props.type === 'tel') return `tel:${props.title.replace(/[^\d+]/g, '')}`
  return undefined
})
</script>
