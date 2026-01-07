<template>
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col overflow-y-auto gap-2.5">
    <!-- Header -->
    <PageHeader :title="t('feedback.detailTitle')" />

    <!-- Content -->
    <div class="flex-1 flex flex-col p-2">
      <!-- Error State -->
      <div v-if="error_message && !is_loading" class="flex items-center justify-center py-10">
        <p class="text-sm text-red-500">{{ error_message }}</p>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="is_loading" class="flex flex-col gap-1">
        <!-- Chi tiết phản ánh Skeleton -->
        <div class="flex flex-col gap-1">
          <!-- Tiêu đề Skeleton -->
          <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </section>

          <!-- Danh mục Skeleton -->
          <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </section>

          <!-- Trạng thái Skeleton -->
          <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
            <div class="h-5 bg-gray-200 rounded w-20"></div>
          </section>

          <!-- Nội dung Skeleton -->
          <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
              <div class="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </section>

          <!-- Ảnh đính kèm Skeleton -->
          <section class="bg-white rounded-lg px-4 py-3 shadow-sm animate-pulse">
            <div class="h-3 bg-gray-200 rounded w-20 mb-2"></div>
            <div class="flex flex-wrap gap-2.5">
              <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
              <div class="w-20 h-20 bg-gray-200 rounded-xl"></div>
            </div>
          </section>
        </div>

        <!-- Tình trạng xử lý Skeleton -->
        <div class="flex flex-col gap-2 mt-2">
          <!-- Tiêu đề Skeleton -->
          <div class="py-3 border-b-2 border-gray-200 flex justify-center animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          <!-- Comments List Skeleton -->
          <div class="flex flex-col gap-2">
            <div v-for="i in 2" :key="i" class="bg-white rounded-xl p-3 shadow-sm animate-pulse">
              <!-- Avatar, Tên, vị trí, ngày Skeleton -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex gap-2 flex-1">
                  <!-- Avatar Skeleton -->
                  <div class="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
                  <!-- Tên, vị trí Skeleton -->
                  <div class="flex flex-col gap-1 flex-1">
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                    <div class="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <!-- Ngày Skeleton -->
                <div class="flex flex-col items-end gap-1 shrink-0">
                  <div class="h-3 bg-gray-200 rounded w-20"></div>
                  <div class="h-3 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
              <!-- Nội dung bình luận Skeleton -->
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-full"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chi tiết phản ánh -->
      <div v-else-if="ticket_detail" class="flex flex-col gap-1">
        <!-- Tiêu đề -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">{{ t('feedback.title') }}</h3>
          <p class="text-sm font-medium text-black">
            {{ ticket_detail.title || t('feedback.noTitle') }}
          </p>
        </section>

        <!-- Danh mục -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">{{ t('feedback.category') }}</h3>
          <p class="text-sm font-medium text-black">
            {{ getCategoryLabel(ticket_detail.category_id) }}
          </p>
        </section>

        <!-- Trạng thái -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">{{ t('feedback.status') }}</h3>
          <span
            :class="[
              'inline-block px-2 py-0.5 text-xs font-medium rounded-md whitespace-nowrap text-white',
              getStatusBadgeClass(ticket_detail.stage),
            ]"
          >
            {{ getStatusLabel(ticket_detail.stage) }}
          </span>
        </section>

        <!-- Nội dung -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">{{ t('feedback.content') }}</h3>
          <p class="text-sm font-medium text-black whitespace-pre-wrap">
            {{ ticket_detail.content || t('feedback.noContent') }}
          </p>
        </section>

        <!-- Ảnh đính kèm -->
        <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
          <h3 class="text-xs font-medium text-slate-700">{{ t('feedback.attachImages') }}</h3>
          <div class="flex flex-wrap gap-2.5">
            <!-- Empty State: Dashed Box -->
            <div
              v-if="
                !ticket_detail.attachments ||
                (Array.isArray(ticket_detail.attachments) && ticket_detail.attachments.length === 0)
              "
              class="w-20 h-20 py-5 px-3 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 text-xs bg-white"
            >
              <Camera :size="24" :stroke-width="1.5" class="text-gray-500" />
              <span class="text-xs text-gray-500">{{ t('feedback.takePhoto') }}</span>
            </div>
            <!-- Attachments -->
            <img
              v-else-if="Array.isArray(ticket_detail.attachments)"
              v-for="(attachment, index) in ticket_detail.attachments"
              :key="index"
              :src="typeof attachment === 'string' ? attachment : attachment.url || ''"
              :alt="`Attachment ${String(index + 1)}`"
              class="w-20 h-20 object-cover rounded-xl"
            />
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'

import PageHeader from '@/components/PageHeader.vue'
import { getTicketDetail, type TicketItem } from '@/api/ticket'
import { mapStageToStatus } from '@/api/ticket/transform'
import type { TicketStage } from '@/types/ticket'

/** Router instance */
const route = useRoute()

/** i18n instance */
const { t } = useI18n()

/** Chi tiết ticket từ API */
const ticket_detail = ref<TicketItem | null>(null)

/** Trạng thái loading */
const is_loading = ref(false)

/** Thông báo lỗi */
const error_message = ref<string | null>(null)

/**
 * Format date cho comment (HH:mm:ss - DD/MM/YYYY)
 * @param iso_date - ISO date string
 * @returns Date string định dạng HH:mm:ss - DD/MM/YYYY
 */
function formatCommentDate(iso_date: string): string {
  try {
    const DATE = new Date(iso_date)
    const HOURS = String(DATE.getHours()).padStart(2, '0')
    const MINUTES = String(DATE.getMinutes()).padStart(2, '0')
    const SECONDS = String(DATE.getSeconds()).padStart(2, '0')
    const DAY = String(DATE.getDate()).padStart(2, '0')
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
    const YEAR = DATE.getFullYear()
    return `${HOURS}:${MINUTES}:${SECONDS} - ${DAY}/${MONTH}/${YEAR}`
  } catch (e) {
    return iso_date
  }
}

/**
 * Get label cho category
 * @param category_id - ID của category
 * @returns Label string
 */
function getCategoryLabel(category_id: number): string {
  // Tạm thời fix cứng, có thể map từ API sau
  return 'Phản ánh lỗi sản phẩm'
}

/**
 * Get CSS class cho status badge
 * @param stage - Stage từ API
 * @returns CSS class string
 */
function getStatusBadgeClass(stage: TicketStage): string {
  const STATUS = mapStageToStatus(stage)
  const CLASSES = {
    pending: 'bg-orange-500',
    processing: 'bg-blue-500',
    completed: 'bg-green-600',
  }
  return CLASSES[STATUS] || CLASSES.pending
}

/**
 * Get label cho status
 * @param stage - Stage từ API
 * @returns Label string
 */
function getStatusLabel(stage: TicketStage): string {
  const STATUS = mapStageToStatus(stage)
  const LABELS = {
    pending: 'Gửi yêu cầu',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
  }
  return LABELS[STATUS] || 'Gửi yêu cầu'
}

/**
 * Load chi tiết ticket từ API
 */
async function loadTicketDetail() {
  /** Lấy ticket ID từ route params */
  const TICKET_ID = route.params.id as string

  if (!TICKET_ID) {
    error_message.value = 'Không tìm thấy ID phản ánh'
    return
  }

  /** Set loading state */
  is_loading.value = true
  error_message.value = null

  try {
    /** Gọi API để lấy chi tiết ticket */
    const DATA = await getTicketDetail(TICKET_ID)
    ticket_detail.value = DATA
  } catch (e: any) {
    console.error('Error loading ticket detail:', e)
    const ERROR_MSG = e.message || 'Có lỗi xảy ra khi tải chi tiết phản ánh'
    error_message.value = ERROR_MSG
    toast.error(ERROR_MSG)
  } finally {
    is_loading.value = false
  }
}

/** Load data khi component mounted */
onMounted(() => {
  loadTicketDetail()
})
</script>
