<template>
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 bg-slate-100">
      <PageHeader :title="t('feedback.listTitle')" />
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
          <!-- Skeleton component cho danh sách feedback khi đang loading -->
          <FeedbackListSkeleton v-if="is_loading" :count="3" />

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
              {{ t('feedback.emptyMessage') }}
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
                    <span>{{ t('feedback.date') }} : {{ item.date }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-xs text-gray-500">
                    <Bookmark :size="12" class="text-gray-500" />
                    <span>{{ t('feedback.support') }}</span>
                  </div>
                </div>

                <!-- Content Description -->
                <p class="text-sm line-clamp-3">{{ item.content }}</p>
              </div>
            </div>

            <!-- Loading More Skeleton - chỉ hiện khi còn data -->
            <!-- Skeleton component cho danh sách feedback khi đang load more -->
            <div v-if="is_loading_more && has_more" class="flex flex-col gap-3">
              <FeedbackListItemSkeleton v-for="i in 2" :key="`skeleton-${i}`" />
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
        {{ t('feedback.createNew') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// H1: import runtime functions
// Import các runtime functions từ Vue
import { ref, computed, onMounted, watch } from 'vue'
// Import useRouter từ vue-router để điều hướng
import { useRouter } from 'vue-router'
// Import useI18n từ vue-i18n để dịch text
import { useI18n } from 'vue-i18n'

// H2: import components
// Import component PageHeader để hiển thị header
import PageHeader from '@/components/PageHeader.vue'
// Import component TabNav để hiển thị tabs
import TabNav from '@/components/TabNav.vue'
// Import skeleton component cho danh sách feedback khi loading
import FeedbackListSkeleton from '@/components/skeletons/FeedbackListSkeleton.vue'
// Import skeleton component cho một feedback item khi load more
import FeedbackListItemSkeleton from '@/components/skeletons/FeedbackListItemSkeleton.vue'

// H3: import icon components
// Import icon Calendar và Bookmark từ lucide-vue-next
import { Calendar, Bookmark } from 'lucide-vue-next'

// H4: import types
// Import function getTicketList và type TicketItem từ ticket API
import { getTicketList, type TicketItem } from '@/api/ticket'
// Import function transformTicketToFeedback để chuyển đổi TicketItem sang FeedbackItem
import { transformTicketToFeedback } from '@/api/ticket/transform'
// Import type FeedbackItem để định nghĩa kiểu dữ liệu
import type { FeedbackItem } from '@/types/ticket'

// H5: props, emits
// Component này không có props hoặc emits

// H6: i18n, store
// Import toast từ vue3-toastify để hiển thị thông báo
import { toast } from 'vue3-toastify'
// Import composable useApiContext để lấy API context
import { useApiContext } from '@/composables/useApiContext'
// Import ticket store từ Pinia để cache ticket data
import { useTicketStore } from '@/stores/ticket'

/** Mail icon asset để hiển thị khi không có feedback */
import MailIcon from '@/assets/MailIcon.png'

/** Router instance để điều hướng */
const router = useRouter()

/** i18n instance để dịch text */
const { t } = useI18n()

/** API context từ composable để kiểm tra tính hợp lệ */
const { is_valid } = useApiContext()

/** Ticket store để cache ticket data */
const ticket_store = useTicketStore()

// H7: variables
/** Tab đang active (all, pending, processing, completed) */
const activeTab = ref<'all' | 'pending' | 'processing' | 'completed'>('all')

/** Danh sách feedback từ API đã được transform */
const feedbackList = ref<FeedbackItem[]>([])

/** Map lưu TicketItem theo ID để truyền qua router state */
const ticketMap = ref<Map<string, TicketItem>>(new Map())

/** Trạng thái loading lần đầu */
const is_loading = ref(false)

/** Trạng thái loading more (pagination) */
const is_loading_more = ref(false)

/** Flag để track khi đang đổi tab */
const is_changing_tab = ref(false)

/** Số lượng bản ghi đã skip trong pagination */
const skip = ref(0)

/** Constant định nghĩa số lượng bản ghi load mỗi lần từ API */
const TAKE = 10

/** Flag kiểm tra còn dữ liệu để load thêm không */
const has_more = ref(true)

/** Ref đến scroll container DOM element */
const scrollContainer = ref<HTMLElement | null>(null)

// H8: lifecycle hooks
/** Hook chạy khi component được mount vào DOM */
onMounted(() => {
  // Kiểm tra tính hợp lệ của API context trước khi load data
  if (!is_valid.value) {
    return
  }
  // Gọi function loadFeedbackList với is_reset = true để load dữ liệu lần đầu
  loadFeedbackList(true)
})

// H9: watch, computed
/** Computed property để tạo danh sách tabs với label đã được dịch */
const tabs = computed(() => [
  // Tab "Tất cả" với key là 'all'
  { key: 'all', label: t('feedback.all') },
  // Tab "Chờ xử lý" với key là 'pending'
  { key: 'pending', label: t('feedback.pending') },
  // Tab "Đang xử lý" với key là 'processing'
  { key: 'processing', label: t('feedback.processing') },
  // Tab "Hoàn thành" với key là 'completed'
  { key: 'completed', label: t('feedback.completed') },
])

/** Watch activeTab để reload data khi tab thay đổi - immediate: false để tránh trigger khi component mount */
watch(
  // Theo dõi sự thay đổi của activeTab
  activeTab,
  // Callback function được gọi khi activeTab thay đổi
  (new_value, old_value) => {
    // Chỉ reload nếu giá trị thực sự thay đổi (không phải lần đầu mount)
    if (old_value !== undefined && new_value !== old_value) {
      // Set flag đang đổi tab để tránh load more
      is_changing_tab.value = true
      // Reset pagination khi đổi tab
      resetPagination()
      // Gọi loadFeedbackList với is_reset = true để load lại dữ liệu từ đầu
      loadFeedbackList(true).finally(() => {
        // Reset flag sau khi load xong
        is_changing_tab.value = false
      })
    }
  },
  // Options object với immediate: false để không trigger khi component mount
  { immediate: false },
)

// H10: functions
/** Reset pagination về trạng thái ban đầu */
function resetPagination() {
  // Reset skip về 0
  skip.value = 0
  // Reset has_more về true
  has_more.value = true
  // Reset feedbackList về mảng rỗng
  feedbackList.value = []
  // Clear ticketMap
  ticketMap.value.clear()
  // Reset is_loading về false
  is_loading.value = false
  // Reset is_loading_more về false
  is_loading_more.value = false
}

/**
 * Load danh sách feedback từ Ticket API
 * @param is_reset - Nếu true thì reset danh sách, nếu false thì append vào danh sách hiện tại
 */
async function loadFeedbackList(is_reset: boolean = false) {
  // Kiểm tra is_valid trước khi gọi API
  if (!is_valid.value) {
    // Nếu không hợp lệ thì reset pagination và return
    resetPagination()
    // Return sớm vì context không hợp lệ
    return
  }

  // Nếu đang reset và đang loading thì không gọi tiếp để tránh duplicate requests
  if (is_reset && is_loading.value) {
    // Return sớm để tránh duplicate requests
    return
  }

  // Nếu không phải reset và không còn dữ liệu thì không load tiếp
  if (!is_reset && !has_more.value) {
    // Return sớm vì không còn dữ liệu để load
    return
  }

  // Nếu không phải reset và đang load more thì không load tiếp để tránh duplicate requests
  if (!is_reset && is_loading_more.value) {
    // Return sớm để tránh duplicate requests
    return
  }

  /** Tính toán CURRENT_SKIP: nếu reset thì về 0, nếu không thì dùng skip hiện tại */
  const CURRENT_SKIP = is_reset ? 0 : skip.value

  // Nếu reset thì set is_loading = true
  if (is_reset) {
    is_loading.value = true
  } else {
    // Nếu không reset thì set is_loading_more = true
    is_loading_more.value = true
  }

  try {
    /** Gọi API getTicketList với activeTab, CURRENT_SKIP và TAKE */
    const TICKET_LIST = await getTicketList(activeTab.value, CURRENT_SKIP, TAKE)

    /** Map từng TicketItem sang FeedbackItem bằng function transformTicketToFeedback */
    const TRANSFORMED_LIST = TICKET_LIST.map(transformTicketToFeedback)

    // Kiểm tra is_reset để quyết định thay thế hay append
    if (is_reset) {
      // Nếu reset thì thay thế toàn bộ danh sách
      feedbackList.value = TRANSFORMED_LIST
      // Clear ticketMap để bắt đầu lại
      ticketMap.value.clear()
      // Set skip = số lượng đã load
      skip.value = TICKET_LIST.length
    } else {
      // Nếu không reset thì append vào danh sách hiện tại
      feedbackList.value = [...feedbackList.value, ...TRANSFORMED_LIST]
      // Cộng thêm số lượng vừa load vào skip hiện tại
      skip.value += TICKET_LIST.length
    }

    // Duyệt qua từng ticket trong TICKET_LIST
    TICKET_LIST.forEach((ticket) => {
      // Lưu ticket vào map với key là ticket.id
      ticketMap.value.set(ticket.id, ticket)
    })

    // Kiểm tra số lượng ticket trả về
    if (TICKET_LIST.length < TAKE) {
      // Nếu ít hơn TAKE thì không còn dữ liệu để load
      has_more.value = false
    } else {
      // Nếu bằng TAKE thì có thể còn dữ liệu để load tiếp
      has_more.value = true
    }
  } catch (e: any) {
    // Log lỗi ra console để debug
    console.error('Error loading feedback list:', e)
    // Hiển thị toast error với message từ error hoặc message mặc định
    toast.error(e.message || t('feedback.loadListError'))
    // Nếu đang reset thì reset pagination khi có lỗi
    if (is_reset) {
      resetPagination()
    }
  } finally {
    // Reset loading state tương ứng
    if (is_reset) {
      // Nếu reset thì reset is_loading
      is_loading.value = false
    } else {
      // Nếu không reset thì reset is_loading_more
      is_loading_more.value = false
    }
  }
}

/** Handle scroll event để detect khi scroll gần cuối */
function handleScroll() {
  // Kiểm tra các điều kiện để không load more
  if (
    // Nếu scrollContainer chưa được gán thì return
    !scrollContainer.value ||
    // Nếu đang load more thì return
    is_loading_more.value ||
    // Nếu đang loading thì return
    is_loading.value ||
    // Nếu không còn dữ liệu thì return
    !has_more.value ||
    // Nếu đang đổi tab thì return
    is_changing_tab.value
  ) {
    return
  }

  /** Lấy reference đến scroll container element */
  const CONTAINER = scrollContainer.value
  /** Lấy vị trí scroll hiện tại (từ đầu container) */
  const SCROLL_TOP = CONTAINER.scrollTop
  /** Lấy chiều cao tổng của nội dung (bao gồm phần bị ẩn) */
  const SCROLL_HEIGHT = CONTAINER.scrollHeight
  /** Lấy chiều cao hiển thị của container (viewport) */
  const CLIENT_HEIGHT = CONTAINER.clientHeight

  /** Constant định nghĩa khoảng cách từ cuối để trigger load more (100px) */
  const THRESHOLD = 100
  // Kiểm tra nếu scroll position + viewport height >= tổng height - threshold
  if (SCROLL_TOP + CLIENT_HEIGHT >= SCROLL_HEIGHT - THRESHOLD) {
    // Gọi loadFeedbackList với is_reset = false để load thêm dữ liệu
    loadFeedbackList(false)
  }
}

/**
 * Get CSS class cho status badge
 * @param status - Trạng thái feedback
 * @returns CSS class string
 */
function getStatusClass(status: string) {
  /** Object chứa mapping giữa status và CSS class */
  const CLASSES = {
    // Class cho status pending: màu cam
    pending: 'bg-orange-500 text-white',
    // Class cho status processing: màu xanh dương
    processing: 'bg-blue-500 text-white',
    // Class cho status completed: màu xanh lá
    completed: 'bg-green-600 text-white',
  }
  // Trả về class tương ứng với status, nếu không tìm thấy thì dùng pending
  return CLASSES[status as keyof typeof CLASSES] || CLASSES.pending
}

/**
 * Get label cho status
 * @param status - Trạng thái feedback
 * @returns Label string
 */
function getStatusLabel(status: string) {
  /** Object chứa mapping giữa status và label đã được dịch */
  const LABELS = {
    // Label cho status pending
    pending: t('feedback.pending'),
    // Label cho status processing
    processing: t('feedback.processing'),
    // Label cho status completed
    completed: t('feedback.completed'),
  }
  // Trả về label tương ứng với status, nếu không tìm thấy thì dùng pending
  return LABELS[status as keyof typeof LABELS] || t('feedback.pending')
}

/** Navigate đến trang tạo feedback mới */
function navigateToCreate() {
  // Sử dụng router.push để điều hướng đến route '/feedback-create'
  router.push('/feedback-create')
}

/**
 * Navigate đến trang chi tiết feedback
 * @param ticket_id - ID của ticket
 */
function navigateToDetail(ticket_id: string) {
  /** Lấy TicketItem từ ticketMap bằng ticket_id */
  const TICKET = ticketMap.value.get(ticket_id)

  // Kiểm tra nếu có ticket trong map
  if (TICKET) {
    // Lưu ticket vào Pinia store để cache, FeedbackDetail sẽ đọc từ store
    ticket_store.setTicket(TICKET)
  }

  // Sử dụng router.push với name và params để điều hướng
  router.push({
    // Tên route là 'Feedback-detail'
    name: 'Feedback-detail',
    // Truyền id qua params
    params: { id: ticket_id },
  })
}
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
