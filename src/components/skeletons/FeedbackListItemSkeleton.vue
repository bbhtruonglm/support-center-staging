<template>
  <!-- Skeleton cho một feedback list item -->
  <div class="bg-white rounded-lg px-4 py-1 shadow-sm animate-pulse">
    <!-- Title & Status Row Skeleton -->
    <div class="flex items-start justify-between border-b border-gray-200 py-2">
      <!-- Container flex-1 cho title skeleton -->
      <div class="flex-1">
        <!-- Skeleton cho title -->
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <!-- Skeleton cho status badge -->
      <div class="h-5 bg-gray-200 rounded w-20"></div>
    </div>

    <!-- Container flex column cho phần nội dung -->
    <div class="flex flex-col py-2">
      <!-- Date & Support Row Skeleton -->
      <div class="flex items-center justify-between">
        <!-- Container flex cho date skeleton bên trái -->
        <div class="flex items-center gap-1">
          <!-- Skeleton cho calendar icon -->
          <div class="h-3 w-3 bg-gray-200 rounded"></div>
          <!-- Skeleton cho date text -->
          <div class="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <!-- Container flex cho support skeleton bên phải -->
        <div class="flex items-center gap-1">
          <!-- Skeleton cho bookmark icon -->
          <div class="h-3 w-3 bg-gray-200 rounded"></div>
          <!-- Skeleton cho support text -->
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      <!-- Content Description Skeleton -->
      <div class="space-y-2 mt-2">
        <!-- Dòng 1 skeleton nội dung -->
        <div class="h-3 bg-gray-200 rounded w-full"></div>
        <!-- Dòng 2 skeleton nội dung -->
        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        <!-- Dòng 3 skeleton nội dung -->
        <div class="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component này không cần props hoặc logic
</script>

