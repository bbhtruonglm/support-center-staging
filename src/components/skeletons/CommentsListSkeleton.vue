<template>
  <!-- Container skeleton cho phần tình trạng xử lý -->
  <div class="flex flex-col gap-2">
    <!-- Skeleton cho tiêu đề "Tình trạng xử lý" - chỉ hiển thị khi showTitle = true -->
    <div
      v-if="showTitle"
      class="py-3 border-b-2 border-gray-200 flex justify-center animate-pulse"
    >
      <!-- Skeleton cho text tiêu đề -->
      <div class="h-4 bg-gray-200 rounded w-32"></div>
    </div>

    <!-- Container skeleton cho danh sách comments -->
    <div class="flex flex-col gap-2">
      <!-- Render skeleton comment items -->
      <div
        v-for="i in count"
        :key="i"
        class="bg-white rounded-xl p-3 shadow-sm animate-pulse"
      >
        <!-- Container flex cho avatar, tên, vị trí, ngày skeleton -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <!-- Container flex cho avatar và thông tin bên trái -->
          <div class="flex gap-2 flex-1">
            <!-- Skeleton cho avatar -->
            <div class="w-8 h-8 bg-gray-200 rounded-xl shrink-0"></div>
            <!-- Container flex column cho tên và vị trí skeleton -->
            <div class="flex flex-col gap-1 flex-1">
              <!-- Skeleton cho tên -->
              <div class="h-4 bg-gray-200 rounded w-24"></div>
              <!-- Skeleton cho vị trí -->
              <div class="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <!-- Container flex column cho ngày skeleton bên phải -->
          <div class="flex flex-col items-end gap-1 shrink-0">
            <!-- Skeleton cho label ngày -->
            <div class="h-3 bg-gray-200 rounded w-20"></div>
            <!-- Skeleton cho giá trị ngày -->
            <div class="h-3 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
        <!-- Container cho skeleton nội dung bình luận -->
        <div class="space-y-2">
          <!-- Dòng 1 skeleton nội dung comment -->
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <!-- Dòng 2 skeleton nội dung comment -->
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// H5: props, emits
/** Props: Số lượng skeleton comment items cần hiển thị và có hiển thị tiêu đề không */
const props = withDefaults(
  defineProps<{
    /** Số lượng skeleton items, mặc định là 2 */
    count?: number
    /** Có hiển thị tiêu đề skeleton không, mặc định là true */
    showTitle?: boolean
  }>(),
  {
    count: 2,
    showTitle: true,
  },
)
</script>

