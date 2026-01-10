<template>
  <!-- Container skeleton cho phần chi tiết phản ánh -->
  <div class="flex flex-col gap-1">
    <!-- Skeleton cho tiêu đề phản ánh -->
    <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
      <!-- Skeleton cho label "Tiêu đề" -->
      <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
      <!-- Skeleton cho nội dung tiêu đề -->
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    </section>

    <!-- Skeleton cho danh mục phản ánh -->
    <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
      <!-- Skeleton cho label "Danh mục" -->
      <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
      <!-- Skeleton cho nội dung danh mục -->
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </section>

    <!-- Skeleton cho trạng thái phản ánh -->
    <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
      <!-- Skeleton cho label "Trạng thái" -->
      <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
      <!-- Skeleton cho badge trạng thái -->
      <div class="h-5 bg-gray-200 rounded w-20"></div>
    </section>

    <!-- Skeleton cho nội dung phản ánh -->
    <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
      <!-- Skeleton cho label "Nội dung" -->
      <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
      <!-- Container cho các dòng skeleton nội dung -->
      <div class="space-y-2">
        <!-- Dòng 1 skeleton nội dung -->
        <div class="h-3 bg-gray-200 rounded w-full"></div>
        <!-- Dòng 2 skeleton nội dung -->
        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        <!-- Dòng 3 skeleton nội dung -->
        <div class="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </section>

    <!-- Skeleton cho ảnh đính kèm -->
    <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
      <!-- Skeleton cho label "Ảnh đính kèm" -->
      <div class="h-3 bg-gray-200 rounded w-20 mb-2"></div>
      <!-- Container flex wrap cho các skeleton ảnh -->
      <div class="flex flex-wrap gap-2.5">
        <!-- Skeleton ảnh 1 -->
        <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
        <!-- Skeleton ảnh 2 -->
        <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Component này không cần props hoặc logic
</script>

