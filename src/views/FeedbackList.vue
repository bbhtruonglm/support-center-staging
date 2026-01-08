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
    <div ref="scrollContainer" class="flex-1 overflow-y-auto" @scroll="handleScroll">
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
              <div class="flex items-start justify-between border-b border-gray-200 py-2">
                <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div class="h-5 bg-gray-200 rounded w-20"></div>
              </div>

              <div class="flex flex-col py-2">
                <!-- Date & Support Row Skeleton -->
                <div class="flex items-center justify-between">
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
                <div class="space-y-2 mt-2">
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
                  <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State: No feedback or Invalid client_id -->
          <div
            v-else-if="!is_valid || feedbackList.length === 0"
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
              v-for="item in feedbackList"
              :key="item.id"
              @click="navigateToDetail(item.id)"
              class="bg-white rounded-lg px-4 py-1 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <!-- Title & Status Row -->
              <div class="flex items-start justify-between border-b border-gray-200 py-2">
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

              <div class="flex flex-col py-2">
                <!-- Date & Support Row -->
                <div class="flex items-center justify-between">
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

            <!-- Loading More Skeleton -->
            <div v-if="is_loading_more" class="flex flex-col gap-3">
              <div
                v-for="i in 2"
                :key="`skeleton-${i}`"
                class="bg-white rounded-lg px-4 py-1 shadow-sm animate-pulse"
              >
                <!-- Title & Status Row Skeleton -->
                <div class="flex items-start justify-between border-b border-gray-200 py-2">
                  <div class="flex-1">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div class="h-5 bg-gray-200 rounded w-20"></div>
                </div>

                <div class="flex flex-col py-2">
                  <!-- Date & Support Row Skeleton -->
                  <div class="flex items-center justify-between">
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
                  <div class="space-y-2 mt-2">
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                    <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Bookmark } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

import PageHeader from '@/components/PageHeader.vue'
import TabNav from '@/components/TabNav.vue'
import MailIcon from '@/assets/MailIcon.png'

import { useApiContext } from '@/composables/useApiContext'
import { getTicketList, type TicketItem } from '@/api/ticket'
import { transformTicketToFeedback } from '@/api/ticket/transform'
import type { FeedbackItem } from '@/types/ticket'

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

/** Trạng thái loading more */
const is_loading_more = ref(false)

/** Số lượng bản ghi đã skip */
const skip = ref(0)

/** Số lượng bản ghi mỗi lần load */
const TAKE = 10

/** Còn dữ liệu để load không */
const has_more = ref(true)

/** Ref đến scroll container */
const scrollContainer = ref<HTMLElement | null>(null)

/**
 * Watch activeTab để reload data khi tab thay đổi
 * immediate: false để tránh trigger khi component mount (đã có onMounted)
 */
watch(
  activeTab,
  (new_value, old_value) => {
    /** Chỉ reload nếu giá trị thực sự thay đổi (không phải lần đầu mount) */
    if (old_value !== undefined && new_value !== old_value) {
      /** Reset pagination khi đổi tab */
      resetPagination()
      loadFeedbackList(true)
    }
  },
  { immediate: false },
)

/**
 * Reset pagination về trạng thái ban đầu
 */
function resetPagination() {
  skip.value = 0
  has_more.value = true
  feedbackList.value = []
  ticketMap.value.clear()
  /** Reset loading states để cancel các request đang chạy */
  is_loading_more.value = false
}

/**
 * Load danh sách feedback từ Ticket API
 * @param is_reset - Nếu true thì reset danh sách, nếu false thì append vào danh sách hiện tại
 */
async function loadFeedbackList(is_reset: boolean = false) {
  // Kiểm tra context hợp lệ
  if (!is_valid.value) {
    resetPagination()
    return
  }

  // Kiểm tra nếu đang loading thì không gọi tiếp (tránh duplicate calls)
  if (is_reset && is_loading.value) {
    return
  }

  // Kiểm tra nếu không còn dữ liệu để load
  if (!is_reset && !has_more.value) {
    return
  }

  // Kiểm tra nếu đang load more thì không load tiếp
  if (!is_reset && is_loading_more.value) {
    return
  }

  // Nếu reset thì set skip về 0
  const CURRENT_SKIP = is_reset ? 0 : skip.value

  // Set loading state
  if (is_reset) {
    is_loading.value = true
  } else {
    is_loading_more.value = true
  }

  try {
    /** Gọi Ticket API để lấy danh sách ticket với skip và take */
    const TICKET_LIST = await getTicketList(activeTab.value, CURRENT_SKIP, TAKE)

    /** Transform TicketItem sang FeedbackItem để hiển thị */
    const TRANSFORMED_LIST = TICKET_LIST.map(transformTicketToFeedback)

    /** Nếu reset thì thay thế, nếu không thì append */
    if (is_reset) {
      feedbackList.value = TRANSFORMED_LIST
      ticketMap.value.clear()
      /** Reset skip về số lượng đã load */
      skip.value = TICKET_LIST.length
    } else {
      feedbackList.value = [...feedbackList.value, ...TRANSFORMED_LIST]
      /** Cập nhật skip bằng cách cộng thêm số lượng vừa load */
      skip.value += TICKET_LIST.length
    }

    /** Lưu TicketItem vào map để truyền qua router state */
    TICKET_LIST.forEach((ticket) => {
      ticketMap.value.set(ticket.id, ticket)
    })

    /** Kiểm tra has_more: nếu số lượng trả về ít hơn TAKE thì không còn dữ liệu */
    if (TICKET_LIST.length < TAKE) {
      has_more.value = false
    } else {
      /** Nếu số lượng bằng TAKE thì có thể còn dữ liệu */
      has_more.value = true
    }
  } catch (e: any) {
    console.error('Error loading feedback list:', e)
    toast.error(e.message || 'Có lỗi xảy ra khi tải danh sách phản ánh')
    if (is_reset) {
      resetPagination()
    }
  } finally {
    if (is_reset) {
      is_loading.value = false
    } else {
      is_loading_more.value = false
    }
  }
}

/**
 * Handle scroll event để detect khi scroll gần cuối
 */
function handleScroll() {
  /** Không load more nếu đang loading (reset hoặc load more) */
  if (!scrollContainer.value || is_loading_more.value || is_loading.value || !has_more.value) {
    return
  }

  const CONTAINER = scrollContainer.value
  const SCROLL_TOP = CONTAINER.scrollTop
  const SCROLL_HEIGHT = CONTAINER.scrollHeight
  const CLIENT_HEIGHT = CONTAINER.clientHeight

  /** Khi scroll đến gần cuối (còn 100px) thì load more */
  const THRESHOLD = 100
  if (SCROLL_TOP + CLIENT_HEIGHT >= SCROLL_HEIGHT - THRESHOLD) {
    loadFeedbackList(false)
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
  loadFeedbackList(true)
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
