<template>
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 bg-slate-100">
      <PageHeader title="Phản ánh" />
      <!-- Sticky Tabs -->
      <div class="py-3">
        <TabNav v-model="activeTab" :tabs="tabs" />
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col pb-3 gap-3">
        <!-- Feedback List Content -->
        <div class="flex-1 text-black">
          <!-- Skeleton Loading State -->
          <div v-if="is_loading" class="flex flex-col gap-3 px-2">
            <div
              v-for="i in 3"
              :key="i"
              class="bg-white rounded-lg px-4 py-1 shadow-sm animate-pulse"
            >
              <!-- Title & Status Row Skeleton -->
              <div class="flex items-start justify-between gap-2 border-b border-gray-200 py-2">
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div class="h-5 bg-gray-200 rounded w-20"></div>
              </div>

              <!-- Date & Support Row Skeleton -->
              <div class="flex items-center justify-between gap-1 py-2">
                <div class="flex items-center gap-1">
                  <div class="h-3 w-3 bg-gray-200 rounded"></div>
                  <div class="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div class="flex items-center gap-1">
                  <div class="h-3 w-3 bg-gray-200 rounded"></div>
                  <div class="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>

              <!-- Content Description Skeleton -->
              <div class="py-1 space-y-2">
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                <div class="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>

          <!-- Empty State: No feedback or Invalid client_id -->
          <div
            v-else-if="!is_valid || filteredFeedbackList?.length === 0"
            class="flex-1 flex flex-col items-center pt-10 gap-3"
          >
            <!-- Empty State Image -->
            <div class="flex items-center justify-center">
              <!-- Mail Icon Placeholder -->
              <img :src="MailIcon" alt="No Feedback" class="w-25 h-25 object-contain z-10" />
            </div>
            <p class="text-xs text-gray-600 text-center px-4 whitespace-nowrap">
              Chúng tôi luôn lắng nghe các phản hồi của <br />
              Quý Khách hàng để liên tục cải thiện Chất lượng - Dịch vụ.
            </p>
          </div>

          <!-- Feedback List -->
          <div v-else class="flex flex-col gap-3 px-2">
            <div
              v-for="item in filteredFeedbackList"
              :key="item.id"
              @click="navigateToDetail(item.id)"
              class="bg-white rounded-lg px-4 py-1 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <!-- Title & Status Row -->
              <div class="flex items-start justify-between gap-2 border-b border-gray-200 py-2">
                <h3 class="text-sm font-semibold flex-1 line-clamp-1">
                  {{ item.title }}
                </h3>
                <span
                  :class="[
                    'px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap',
                    getStatusClass(item.status),
                  ]"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>

              <!-- Date & Support Row -->
              <div class="flex items-center justify-between gap-1 py-2">
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar :size="12" class="text-gray-500" />
                  <span>Ngày : {{ item.date }}</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <Bookmark :size="12" class="text-gray-500" />
                  <span>Hỗ trợ</span>
                </div>
              </div>

              <!-- Content Description -->
              <p class="text-sm line-clamp-3">
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Footer Button -->
    <div class="sticky bottom-0 z-10 px-3 py-2 bg-white">
      <button
        @click="navigateToCreate"
        class="w-full bg-orange-500 text-white font-medium py-3 rounded-lg"
      >
        Tạo mới phản ánh
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Bookmark } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

import PageHeader from '@/components/PageHeader.vue'
import TabNav from '@/components/TabNav.vue'
import MailIcon from '@/assets/MailIcon.png'

import { useApiContext } from '@/composables/useApiContext'
import { getTicketList, type FeedbackItem, type TicketItem } from '@/api/ticket'

/** Router instance */
const router = useRouter()

/** i18n instance */
const { t } = useI18n()

/** API context từ composable */
const { is_valid } = useApiContext()

/** Tab đang active */
const activeTab = ref<'all' | 'pending' | 'processing' | 'completed'>('all')

/** Danh sách tabs */
const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Gửi yêu cầu' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn thành' },
]

/** Danh sách feedback từ API */
const feedbackList = ref<FeedbackItem[]>([])

/** Map lưu TicketItem theo ID để truyền qua router state */
const ticketMap = ref<Map<string, TicketItem>>(new Map())

/** Trạng thái loading */
const is_loading = ref(false)

/**
 * Computed property: Danh sách feedback đã được filter theo tab
 */
const filteredFeedbackList = computed(() => {
  return feedbackList.value
})

/**
 * Watch activeTab để reload data khi tab thay đổi
 */
watch(activeTab, () => {
  loadFeedbackList()
})

/**
 * Load danh sách feedback từ Ticket API
 */
async function loadFeedbackList() {
  // Kiểm tra context hợp lệ
  if (!is_valid.value) {
    feedbackList.value = []
    ticketMap.value.clear()
    return
  }

  // Set loading state
  is_loading.value = true

  try {
    /** Gọi Ticket API để lấy danh sách ticket */
    const DATA = await getTicketList(activeTab.value)
    feedbackList.value = DATA.feedbackList

    /** Lưu TicketItem vào map để truyền qua router state */
    ticketMap.value.clear()
    DATA.ticketList.forEach((ticket) => {
      ticketMap.value.set(ticket.id, ticket)
    })
  } catch (e: any) {
    console.error('Error loading feedback list:', e)
    toast.error(e.message || 'Có lỗi xảy ra khi tải danh sách phản ánh')
    feedbackList.value = []
    ticketMap.value.clear()
  } finally {
    is_loading.value = false
  }
}

/**
 * Get CSS class cho status badge
 * @param status - Trạng thái feedback
 * @returns CSS class string
 */
function getStatusClass(status: string) {
  const CLASSES = {
    pending: 'bg-orange-500 text-white',
    processing: 'bg-blue-500 text-white',
    completed: 'bg-green-600 text-white',
  }
  return CLASSES[status as keyof typeof CLASSES] || CLASSES.pending
}

/**
 * Get label cho status
 * @param status - Trạng thái feedback
 * @returns Label string
 */
function getStatusLabel(status: string) {
  const LABELS = {
    pending: 'Gửi yêu cầu',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
  }
  return LABELS[status as keyof typeof LABELS] || 'Gửi yêu cầu'
}

/**
 * Navigate đến trang tạo feedback mới
 */
function navigateToCreate() {
  router.push('/feedback-create')
}

/**
 * Navigate đến trang chi tiết feedback
 * @param ticket_id - ID của ticket
 */
function navigateToDetail(ticket_id: string) {
  /** Lấy TicketItem từ map */
  const TICKET = ticketMap.value.get(ticket_id)

  if (TICKET) {
    /** Truyền TicketItem qua router state */
    router.push({
      name: 'Feedback-detail',
      params: { id: ticket_id },
      state: { ticket: TICKET },
    })
  } else {
    /** Fallback: nếu không tìm thấy trong map thì vẫn navigate với ID */
    router.push(`/feedback-detail/${ticket_id}`)
  }
}

/** Load data khi component mounted */
onMounted(() => {
  // Nếu không có client_id thì không cần load data
  if (!is_valid.value) {
    return
  }
  loadFeedbackList()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
