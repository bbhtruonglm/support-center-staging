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
        <h1 class="text-base font-bold flex-1 text-center">Tạo phản ánh</h1>
        <div class="flex-1"></div>
      </div>
    </div>

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
          <span class="text-sm font-semibold text-black">
            Hỗ trợ khách hàng
          </span>

          <ChevronDown
            :size="20"
            class="text-slate-900"
            :stroke-width="2"
          />
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
            <Camera
              :size="24"
              :stroke-width="1.5"
              class="text-gray-500"
            />
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
import {
  Camera,
  ChevronLeft,
  ArrowLeftCircle,
  ChevronDown,
} from 'lucide-vue-next'
</script>
