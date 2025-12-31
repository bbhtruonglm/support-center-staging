<template>
  <div class="flex flex-col h-full max-w-sm bg-slate-100 overflow-y-auto">
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

    <!-- Content Wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Navigation Header -->
      <div class="bg-white py-3 px-4 border-b border-gray-200 text-black">
        <div class="flex items-center justify-between">
          <button class="flex items-center gap-1 flex-1">
            <ArrowLeftCircle
              class="w-6 h-6 text-black"
              :stroke-width="2"
            />
            <span class="text-sm font-semibold">Quay lại</span>
          </button>
          <h1 class="text-base font-bold flex-1 text-center">Phản ánh</h1>
          <div class="flex-1"></div>
        </div>
      </div>

      <div class="flex-1 flex flex-col py-3 gap-3">
        <!-- Tabs -->
        <div
          class="flex items-center overflow-x-auto no-scrollbar bg-zinc-100 p-1"
        >
          <button
            class="flex-1 px-3 py-1 bg-white rounded shadow-[0_1px_3px_0_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] text-sm font-medium text-zinc-950 border border-gray-100 whitespace-nowrap"
          >
            Tất cả
          </button>
          <button
            class="flex-1 px-3 py-1 text-sm font-medium text-zinc-500 whitespace-nowrap"
          >
            Gửi yêu cầu
          </button>
          <button
            class="flex-1 px-3 py-1 text-sm font-medium text-zinc-500 whitespace-nowrap"
          >
            Đang xử lý
          </button>
          <button
            class="flex-1 px-3 py-1 text-sm font-medium text-zinc-500 whitespace-nowrap"
          >
            Hoàn thành
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 flex flex-col items-center pt-10 gap-3">
          <!-- Empty State Image -->
          <div class="flex items-center justify-center">
            <!-- Mail Icon Placeholder -->
            <img
              :src="MailIcon"
              alt="No Feedback"
              class="w-25 h-25 object-contain z-10"
            />
          </div>
          <p class="text-xs text-gray-600 text-center px-4 whitespace-nowrap">
            Chúng tôi luôn lắng nghe các phản hồi của <br />
            Quý Khách hàng để liên tục cải thiện Chất lượng - Dịch vụ.
          </p>
        </div>

        <!-- Footer Button -->
        <div class="p-2 px-2.75 bg-white mt-auto">
          <button
            class="w-full bg-orange-500 text-white font-medium p-3 rounded-lg"
          >
            Tạo mới phản ánh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  ChevronLeft,
  ArrowLeftCircle,
  Bell,
  ChevronDown,
  ChevronLeftCircle,
} from 'lucide-vue-next'
import MailIcon from '@/assets/MailIcon.png'
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
