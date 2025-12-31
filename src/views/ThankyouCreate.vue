<template>
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Navigation -->
    <PageHeader title="Thư cảm ơn" />

    <!-- Form -->
    <div class="p-3 flex flex-col gap-3">
      <!-- Thank You Banner -->
      <div
        class="w-full rounded-xl overflow-hidden bg-[url('@/assets/ThankyouBackground.png')] bg-size-[100%_267%] bg-no-repeat bg-center flex items-start px-3 py-3.75 gap-2.75"
      >
        <!-- Icon -->
        <img src="@/assets/ThankyouIcon.png" alt="thank you icon" class="w-25 h-25 shrink-0" />

        <!-- Text -->
        <p class="text-sm text-slate-700">
          Nơi để Quý khách gửi lời ghi nhận tới tập thể Cán bộ nhân viên vì những nỗ lực mang lại
          trải nghiệm tốt nhất đến Quý khách!
        </p>
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Tiêu đề <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Vui lòng nhập tiêu đề"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 bg-white"
        />
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Nội dung ghi nhận <span class="text-red-500">*</span>
        </label>
        <textarea
          rows="5"
          placeholder="Quý khách vui lòng nhập nội dung"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 resize-none bg-white"
        ></textarea>
      </div>

      <!-- Images -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-900"> Ảnh đính kèm </label>
        <span class="text-sm text-gray-500">Tối đa 6 ảnh</span>

        <div class="flex gap-2.5">
          <div
            class="py-5 px-3 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 text-xs bg-white"
          >
            <Camera :size="24" :stroke-width="1.5" class="text-gray-400" />
            Chụp ảnh
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button class="p-3 bg-blue-700 rounded-lg text-white font-medium text-sm">
        Gửi thông tin
      </button>
    </div>
  </div>
</template>

<script setup>
import { Camera } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>
