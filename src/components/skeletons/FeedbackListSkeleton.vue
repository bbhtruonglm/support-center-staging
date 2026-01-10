<template>
  <!-- Container skeleton cho danh sách feedback -->
  <div class="flex flex-col gap-3 px-2">
    <!-- Render skeleton items -->
    <FeedbackListItemSkeleton v-for="i in count" :key="i" />
  </div>
</template>

<script setup lang="ts">
// H2: import components
// Import skeleton component cho một feedback list item
import FeedbackListItemSkeleton from './FeedbackListItemSkeleton.vue'

// H5: props, emits
/** Props: Số lượng skeleton items cần hiển thị */
const props = withDefaults(
  defineProps<{
    /** Số lượng skeleton items, mặc định là 3 */
    count?: number
  }>(),
  {
    count: 3,
  },
)
</script>

