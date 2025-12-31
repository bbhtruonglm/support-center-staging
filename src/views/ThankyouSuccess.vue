<template>
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Navigation -->
    <PageHeader title="Thư cảm ơn" />

    <!-- Form -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1 items-center justify-center pb-5">
        <img src="@/assets/ThankyouIcon.png" alt="thank you icon" class="h-30 w-30" />
        <p class="text-sm font-medium text-black">Cảm ơn quý khách đã gửi thông tin!</p>
      </div>
      <button class="py-2 px-3 bg-gray-500 text-white rounded-lg">
        Đang quay về màn hình chính (3)
      </button>
    </div>
  </div>
</template>

<script setup>
import { Camera } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>
