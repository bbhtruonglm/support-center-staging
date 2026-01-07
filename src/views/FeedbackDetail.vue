<template>
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col overflow-y-auto gap-2.5">
    <!-- Header -->
    <PageHeader :title="t('feedback.detailTitle')" />

    <!-- Content -->
    <div class="flex-1 flex flex-col p-2">
      <!-- Chi tiết phản ánh -->
      <div class="flex flex-col gap-1">
        <!-- Tiêu đề -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">Tiêu đề</h3>
          <p class="text-sm font-medium text-black">Tôi ko thể chat được với khách</p>
        </section>

        <!-- Danh mục -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">Danh mục</h3>
          <p class="text-sm font-medium text-black">Phản ánh lỗi sản phẩm</p>
        </section>

        <!-- Trạng thái -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">Trạng thái</h3>
          <span
            class="inline-block px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap bg-blue-500 text-white"
          >
            Đang xử lý
          </span>
        </section>

        <!-- Nội dung -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">Nội dung</h3>
          <p class="text-sm font-medium text-black whitespace-pre-wrap">
            Khi tôi ấn vào input chat xong ấn gửi mà ko có đc
          </p>
        </section>

        <!-- Ảnh đính kèm -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">Ảnh đính kèm</h3>
          <div class="flex flex-wrap gap-2.5">
            <!-- Empty State: Dashed Box -->
            <div
              class="w-20 h-20 py-5 px-3 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 text-xs bg-white"
            >
              <Camera :size="24" :stroke-width="1.5" class="text-gray-500" />
              <span class="text-xs text-gray-500">Chụp ảnh</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Tình trạng xử lý -->
      <div class="flex flex-col gap-2">
        <!-- Tiêu đề -->
        <div
          class="py-3 border-b-2 border-blue-700 flex justify-center text-sm text-blue-700 font-bold"
        >
          Tình trạng xử lý
        </div>

        <!-- Comments List -->
        <div class="flex flex-col gap-2">
          <!-- Comment Card 1 -->
          <div class="bg-white rounded-xl p-3 shadow-sm">
            <!-- Avatar, Tên, vị trí, ngày -->
            <div class="flex items-start justify-between gap-2">
              <!--Avatar, Tên, vị trí -->
              <div class="flex gap-2 flex-1">
                <!-- avatar -->
                <img
                  src="/src/assets/Avatar.png"
                  alt="Avatar"
                  class="w-8 h-8 object-cover shrink-0"
                />
                <!-- Tên, vị trí -->
                <div class="flex flex-col gap-0.5 flex-1">
                  <p class="text-sm font-medium text-black">Hoàng Đức Mạnh</p>
                  <p class="text-xs text-slate-500">Dev - BU Hà Nội</p>
                </div>
              </div>
              <!-- Ngày -->
              <div class="flex flex-col items-end shrink-0">
                <p class="text-xs text-gray-500 whitespace-nowrap">Thêm mới lúc</p>
                <p class="text-xs text-gray-500 whitespace-nowrap">17:04:43 - 26/04/2024</p>
              </div>
            </div>
            <!-- Nội dung bình luận -->
            <div class="py-1 text-black font-medium text-base">Nội dung bình luận</div>
          </div>

          <!-- Comment Card 2 -->
          <div class="bg-white rounded-xl p-3 shadow-sm">
            <!-- Avatar, Tên, vị trí, ngày -->
            <div class="flex items-start justify-between gap-2">
              <!--Avatar, Tên, vị trí -->
              <div class="flex gap-2 flex-1">
                <!-- avatar -->
                <img
                  src="/src/assets/Avatar.png"
                  alt="Avatar"
                  class="w-8 h-8 object-cover shrink-0"
                />
                <!-- Tên, vị trí -->
                <div class="flex flex-col gap-0.5 flex-1">
                  <p class="text-sm font-bold text-black">Hoàng Đức Mạnh</p>
                  <p class="text-xs text-slate-500">Dev - BU Hà Nội</p>
                </div>
              </div>
              <!-- Ngày -->
              <div class="flex flex-col items-end shrink-0">
                <p class="text-xs text-gray-500 whitespace-nowrap">Thêm mới lúc</p>
                <p class="text-xs text-gray-500 whitespace-nowrap">17:04:43 - 26/04/2024</p>
              </div>
            </div>
            <!-- Nội dung bình luận -->
            <div class="py-1 text-black font-medium text-base">Nội dung bình luận</div>
          </div>

          <!-- Comment Card 3 -->
          <div class="bg-white rounded-xl p-3 shadow-sm">
            <!-- Avatar, Tên, vị trí, ngày -->
            <div class="flex items-start justify-between gap-2">
              <!--Avatar, Tên, vị trí -->
              <div class="flex gap-2 flex-1">
                <!-- avatar -->
                <img
                  src="/src/assets/Avatar.png"
                  alt="Avatar"
                  class="w-8 h-8 object-cover shrink-0"
                />
                <!-- Tên, vị trí -->
                <div class="flex flex-col gap-0.5 flex-1">
                  <p class="text-sm font-bold text-black">Hoàng Đức Mạnh</p>
                  <p class="text-xs text-slate-500">Dev - BU Hà Nội</p>
                </div>
              </div>
              <!-- Ngày -->
              <div class="flex flex-col items-end shrink-0">
                <p class="text-xs text-gray-500 whitespace-nowrap">Thêm mới lúc</p>
                <p class="text-xs text-gray-500 whitespace-nowrap">17:04:43 - 26/04/2024</p>
              </div>
            </div>
            <!-- Nội dung bình luận -->
            <div class="py-1 text-black font-medium text-base">Nội dung bình luận</div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between gap-1">
          <!-- Previous Button -->
          <button class="flex items-center gap-1 text-sm text-gray-700">
            <ChevronLeft :size="16" :stroke-width="2" />
            <span>Lùi</span>
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-700 rounded">
              1
            </button>
            <button
              class="w-8 h-8 flex items-center justify-center text-sm text-white bg-gray-300 border border-gray-400 rounded"
            >
              2
            </button>
            <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-700 rounded">
              3
            </button>
            <span class="text-sm text-gray-700 px-1">...</span>
            <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-700 rounded">
              4
            </button>
          </div>

          <!-- Next Button -->
          <button class="flex items-center gap-1 text-sm text-gray-700">
            <span>Tiếp</span>
            <ChevronRight :size="16" :stroke-width="2" />
          </button>
        </div>

        <!-- Bình luận -->
        <div class="flex flex-col gap-1.5">
          <h3 class="text-sm font-medium text-slate-950">Bình luận</h3>

          <textarea
            placeholder="Nhập nội dung bình luận của bạn"
            class="w-full px-4 py-3 text-sm rounded-md border border-gray-200 resize-none focus:outline-none text-black placeholder:text-gray-500"
            rows="4"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Camera, ChevronLeft, ChevronRight, Paperclip } from 'lucide-vue-next'

import PageHeader from '@/components/PageHeader.vue'

/** i18n instance */
const { t } = useI18n()
</script>
