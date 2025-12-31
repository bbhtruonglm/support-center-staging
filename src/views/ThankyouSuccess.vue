<template>
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header Section -->
    <header class="bg-white px-3 py-1 flex items-center gap-1 text-black">
      <!-- Back Button -->
      <button class="flex items-center justify-center w-6 h-6">
        <ChevronLeft
          :size="20"
          :stroke-width="2"
        />
      </button>

      <!-- Title -->
      <h1 class="text-base font-medium">Trung tâm hỗ trợ khách hàng</h1>
    </header>

    <!-- Navigation -->
    <div class="bg-white py-3 px-4 border-b border-gray-200 text-black">
      <div class="flex items-center justify-between">
        <button class="flex items-center gap-1 flex-1">
          <ArrowLeftCircle
            class="w-6 h-6 text-black"
            :stroke-width="2"
          />
          <span class="text-sm font-semibold">Quay lại</span>
        </button>
        <h1 class="text-base font-bold flex-1 text-center">Thư cảm ơn</h1>
        <div class="flex-1"></div>
      </div>
    </div>

    <!-- Form -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1 items-center justify-center pb-5">
        <img
          src="@/assets/ThankyouIcon.png"
          alt="thank you icon"
          class="h-30 w-30"
        />
        <p class="text-sm font-medium text-black">
          Cảm ơn quý khách đã gửi thông tin!
        </p>
      </div>
      <button class="py-2 px-3 bg-gray-500 text-white rounded-lg">
        Đang quay về màn hình chính (3)
      </button>
    </div>
  </div>
</template>

<script setup>
import { Camera, ChevronLeft, ArrowLeftCircle } from 'lucide-vue-next'
</script>
