<template>
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Navigation -->
    <PageHeader title="Tạo phản ánh" />

    <!-- Form -->
    <div class="p-3 flex flex-col gap-3">
      <!-- Title -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Tiêu đề góp ý <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Vui lòng nhập tiêu đề"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 bg-white"
        />
      </div>

      <!-- Service Type -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Loại dịch vụ <span class="text-red-500">*</span>
        </label>

        <!-- Fake Select -->
        <div
          class="w-full px-6 py-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between cursor-pointer"
        >
          <span class="text-sm font-semibold text-black"> Hỗ trợ khách hàng </span>

          <ChevronDown :size="20" class="text-slate-900" :stroke-width="2" />
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Nội dung góp ý <span class="text-red-500">*</span>
        </label>
        <textarea
          rows="5"
          placeholder="Quý khách vui lòng nhập nội dung phản ánh"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 resize-none bg-white"
        ></textarea>
      </div>

      <!-- Images -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black"> Ảnh đính kèm </label>
        <span class="text-sm text-gray-500">Tối đa 6 ảnh</span>

        <div class="flex gap-2.5">
          <div
            class="py-5 px-3 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 text-xs bg-white"
          >
            <Camera :size="24" :stroke-width="1.5" class="text-gray-500" />
            Chụp ảnh
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button class="p-3 bg-blue-700 rounded-lg text-white font-medium text-sm">
        Gửi thông tin
      </button>

      <!-- Note -->
      <p class="text-xs text-slate-500 text-center leading-relaxed">
        Sau khi gửi phản ánh, chúng tôi sẽ tiếp nhận và liên lạc đến <br />
        Quý khách hàng sớm nhất và không quá 24 tiếng.
      </p>
    </div>
  </div>
</template>

<script setup>
import { Camera, ChevronDown } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
</script>
