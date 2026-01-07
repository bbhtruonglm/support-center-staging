<template>
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 bg-slate-100">
      <PageHeader :title="t('feedback.detailTitle')" />
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col p-2">
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
                    <div class="w-8 h-8 bg-gray-200 rounded-xl shrink-0"></div>
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
              {{ getCategoryLabel(ticket_detail.workflow_id) }}
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
              <!-- Empty State: Text khi không có attachments -->
              <p
                v-if="
                  !ticket_detail.attachments ||
                  (Array.isArray(ticket_detail.attachments) &&
                    ticket_detail.attachments.length === 0)
                "
                class="text-sm font-medium text-black"
              >
                {{ t('feedback.noAttachments') }}
              </p>
              <!-- Attachments: Hiển thị danh sách ảnh khi có dữ liệu -->
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

          <!-- Tình trạng xử lý -->
          <div class="flex flex-col gap-2">
            <!-- Tiêu đề -->
            <div
              class="py-3 border-b-2 border-blue-700 flex justify-center text-sm text-blue-700 font-bold"
            >
              Tình trạng xử lý
            </div>

            <!-- Comments List -->
            <div v-if="is_loading_comments" class="flex flex-col gap-2">
              <!-- Comment Skeleton -->
              <div v-for="i in 2" :key="i" class="bg-white rounded-xl p-3 shadow-sm animate-pulse">
                <!-- Avatar, Tên, vị trí, ngày Skeleton -->
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div class="flex gap-2 flex-1">
                    <!-- Avatar Skeleton -->
                    <div class="w-8 h-8 bg-gray-200 rounded-xl shrink-0"></div>
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
            <div
              v-else-if="paginated_comments.length === 0"
              class="flex items-center justify-center py-10"
            >
              <p class="text-sm text-gray-500">Chưa có bình luận nào</p>
            </div>
            <div v-else class="flex flex-col gap-2">
              <!-- Comment Card -->
              <div
                v-for="comment in paginated_comments"
                :key="comment.id"
                class="bg-white rounded-xl p-3 shadow-sm"
              >
                <!-- Avatar, Tên, vị trí, ngày -->
                <div class="flex items-start justify-between gap-2">
                  <!--Avatar, Tên, vị trí -->
                  <div class="flex items-center gap-2 flex-1">
                    <!-- avatar -->
                    <img
                      :src="comment.avatar"
                      :alt="comment.name"
                      class="w-8 h-8 object-cover shrink-0 rounded-xl"
                    />
                    <!-- Tên, vị trí -->
                    <div class="flex flex-col gap-0.5 flex-1">
                      <p
                        :class="[
                          'text-sm text-black',
                          comment.is_bold ? 'font-bold' : 'font-medium',
                        ]"
                      >
                        {{ comment.name }}
                      </p>
                      <p class="text-xs text-slate-500">{{ comment.position }}</p>
                    </div>
                  </div>
                  <!-- Ngày -->
                  <div class="flex flex-col items-end shrink-0">
                    <p class="text-xs text-gray-500 whitespace-nowrap">Thêm mới lúc</p>
                    <p class="text-xs text-gray-500 whitespace-nowrap">{{ comment.date }}</p>
                  </div>
                </div>
                <!-- Nội dung bình luận -->
                <div class="py-1 text-black font-medium text-base">{{ comment.content }}</div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="total_pages > 0" class="flex items-center justify-between gap-1">
              <!-- Previous Button -->
              <button
                @click="goToPreviousPage"
                :disabled="current_page === 1"
                :class="[
                  'flex items-center gap-1 text-sm font-medium',
                  current_page === 1
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-950 cursor-pointer',
                ]"
              >
                <ChevronLeft :size="16" class="text-slate-950" />
                <span>Lùi</span>
              </button>

              <!-- Page Numbers -->
              <div class="flex items-center gap-1">
                <template v-for="(page, index) in visible_pages" :key="page">
                  <button
                    @click="goToPage(page)"
                    :class="[
                      'w-10 h-10 flex items-center justify-center text-sm rounded-lg',
                      page === current_page
                        ? 'text-slate-950 bg-white border border-gray-200'
                        : 'text-slate-950',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <!-- Hiển thị ellipsis sau số 1 khi trang hiện tại >= 4 -->
                  <span
                    v-if="
                      show_ellipsis_after_first &&
                      index === 0 &&
                      page === 1 &&
                      (() => {
                        const NEXT_PAGE = visible_pages[index + 1]
                        return NEXT_PAGE ? NEXT_PAGE - page > 1 : false
                      })()
                    "
                    class="text-sm text-gray-700 px-1"
                  >
                    ...
                  </span>
                  <!-- Hiển thị ellipsis trước trang cuối nếu có khoảng cách -->
                  <span
                    v-if="
                      show_ellipsis_before_last &&
                      index === visible_pages.length - 2 &&
                      (() => {
                        const NEXT_PAGE = visible_pages[index + 1]
                        return NEXT_PAGE ? NEXT_PAGE - page > 1 : false
                      })()
                    "
                    class="text-sm text-gray-700 px-1"
                  >
                    ...
                  </span>
                </template>
              </div>

              <!-- Next Button -->
              <button
                @click="goToNextPage"
                :disabled="current_page === total_pages"
                :class="[
                  'flex items-center gap-1 text-sm font-medium',
                  current_page === total_pages
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-slate-950 cursor-pointer',
                ]"
              >
                <span>Tiếp</span>
                <ChevronRight :size="16" class="text-slate-950" />
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

            <!-- Footer Button -->
            <button class="w-full bg-orange-500 text-white font-medium p-3 rounded-lg">
              Gửi bình luận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Camera, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'

import PageHeader from '@/components/PageHeader.vue'
import { getTicketDetail, getComments, type TicketItem } from '@/api/ticket'
import { mapStageToStatus, transformCommentToItem } from '@/api/ticket/transform'
import type { TicketStage, CommentItem } from '@/types/ticket'

/** Router instance */
const route = useRoute()
const router = useRouter()

/** i18n instance */
const { t } = useI18n()

/** Chi tiết ticket từ router state hoặc API */
const ticket_detail = ref<TicketItem | null>(null)

/** Trạng thái loading */
const is_loading = ref(false)

/** Thông báo lỗi */
const error_message = ref<string | null>(null)

/** Danh sách comments từ API */
const comments_list = ref<CommentItem[]>([])

/** Tổng số trang từ API */
const total_pages = ref(0)

/** Trạng thái loading comments */
const is_loading_comments = ref(false)

/** Số lượng comments mỗi trang */
const ITEMS_PER_PAGE = 20

/** Trang hiện tại */
const current_page = ref(1)

/**
 * Computed property: Danh sách comments của trang hiện tại
 */
const paginated_comments = computed(() => {
  const START_INDEX = (current_page.value - 1) * ITEMS_PER_PAGE
  const END_INDEX = START_INDEX + ITEMS_PER_PAGE
  return comments_list.value.slice(START_INDEX, END_INDEX)
})

/**
 * Computed property: Danh sách số trang hiển thị
 */
const visible_pages = computed(() => {
  const PAGES: number[] = []
  const TOTAL = total_pages.value
  const CURRENT = current_page.value

  if (TOTAL <= 3) {
    // Nếu tổng số trang <= 3, hiển thị tất cả
    for (let i = 1; i <= TOTAL; i++) {
      PAGES.push(i)
    }
  } else {
    // Nếu tổng số trang >= 4, luôn hiển thị ellipsis trước trang cuối
    if (CURRENT <= 2) {
      // Trang đầu: hiển thị 1, 2, 3, ..., TOTAL
      for (let i = 1; i <= 3; i++) {
        PAGES.push(i)
      }
      PAGES.push(TOTAL)
    } else if (CURRENT >= TOTAL - 1) {
      // Trang cuối: hiển thị 1, ..., TOTAL-2, TOTAL-1, TOTAL
      PAGES.push(1)
      for (let i = TOTAL - 2; i <= TOTAL; i++) {
        PAGES.push(i)
      }
    } else {
      // Trang giữa: hiển thị 1, ..., CURRENT-1, CURRENT, CURRENT+1, ..., TOTAL
      PAGES.push(1)
      for (let i = CURRENT - 1; i <= CURRENT + 1; i++) {
        PAGES.push(i)
      }
      PAGES.push(TOTAL)
    }
  }

  return PAGES
})

/**
 * Computed property: Có hiển thị ellipsis sau số 1 không
 * Hiển thị ellipsis sau số 1 khi trang hiện tại >= 4
 */
const show_ellipsis_after_first = computed(() => {
  const CURRENT = current_page.value
  const TOTAL = total_pages.value

  if (TOTAL < 4 || CURRENT < 4) {
    return false
  }

  const PAGES = visible_pages.value
  if (PAGES.length === 0 || PAGES[0] !== 1) {
    return false
  }

  // Kiểm tra xem có khoảng cách giữa số 1 và trang tiếp theo không
  const SECOND_PAGE = PAGES[1]
  return SECOND_PAGE ? SECOND_PAGE - 1 > 1 : false
})

/**
 * Computed property: Có hiển thị ellipsis trước trang cuối không
 * Hiển thị ellipsis trước trang cuối nếu tổng số trang >= 4
 */
const show_ellipsis_before_last = computed(() => {
  const TOTAL = total_pages.value
  if (TOTAL < 4) {
    return false
  }

  const PAGES = visible_pages.value
  if (PAGES.length === 0) {
    return false
  }

  const LAST_PAGE = PAGES[PAGES.length - 1]
  const SECOND_LAST_PAGE = PAGES[PAGES.length - 2]

  // Kiểm tra xem có khoảng cách giữa trang gần cuối và trang cuối không
  if (!LAST_PAGE || !SECOND_LAST_PAGE) {
    return false
  }

  // Luôn hiển thị ellipsis trước trang cuối nếu có khoảng cách
  return LAST_PAGE - SECOND_LAST_PAGE > 1
})

/**
 * Chuyển đến trang trước
 */
function goToPreviousPage() {
  if (current_page.value > 1) {
    current_page.value--
  }
}

/**
 * Chuyển đến trang tiếp theo
 */
function goToNextPage() {
  if (current_page.value < total_pages.value) {
    current_page.value++
  }
}

/**
 * Chuyển đến trang cụ thể
 * @param page - Số trang cần chuyển đến
 */
function goToPage(page: number) {
  if (page >= 1 && page <= total_pages.value) {
    current_page.value = page
  }
}

/**
 * Get label cho category từ workflow_id
 * @param workflow_id - ID của workflow từ ticket detail
 * @returns Label string
 */
function getCategoryLabel(workflow_id: number): string {
  /** Workflow ID được lấy trực tiếp từ ticket detail */
  /** Tạm thời hiển thị workflow_id, có thể cập nhật sau nếu API cung cấp thêm thông tin */
  return `Workflow ${workflow_id}`
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
 * Load comments từ API
 * @param ticket_id - Ticket ID (số) để lấy comments
 */
async function loadComments(ticket_id: number) {
  /** Set loading state */
  is_loading_comments.value = true

  try {
    /** Gọi API để lấy danh sách comments */
    const RESPONSE = await getComments(ticket_id)

    /** Transform comments từ API sang format CommentItem */
    const TRANSFORMED_COMMENTS = RESPONSE.comments.map(transformCommentToItem)

    /** Cập nhật danh sách comments */
    comments_list.value = TRANSFORMED_COMMENTS

    /** Cập nhật total_page từ API */
    total_pages.value = RESPONSE.total_page

    /** Reset về trang đầu tiên */
    current_page.value = 1
  } catch (e: any) {
    console.error('Error loading comments:', e)
    const ERROR_MSG = e.message || 'Có lỗi xảy ra khi tải danh sách bình luận'
    toast.error(ERROR_MSG)
    /** Set empty array và reset total_page nếu có lỗi */
    comments_list.value = []
    total_pages.value = 0
  } finally {
    is_loading_comments.value = false
  }
}

/**
 * Load chi tiết ticket từ router state hoặc API
 */
async function loadTicketDetail() {
  /** Lấy ticket ID từ route params */
  const TICKET_ID = route.params.id as string

  if (!TICKET_ID) {
    error_message.value = 'Không tìm thấy ID phản ánh'
    return
  }

  /** Kiểm tra xem có ticket trong router state không */
  const HISTORY_STATE = window.history.state as { ticket?: TicketItem } | null
  const STATE_TICKET = HISTORY_STATE?.ticket

  if (STATE_TICKET && STATE_TICKET.id === TICKET_ID) {
    /** Sử dụng ticket từ router state, không cần gọi API */
    ticket_detail.value = STATE_TICKET
    /** Load comments cho ticket này */
    if (STATE_TICKET.ticket_id) {
      await loadComments(STATE_TICKET.ticket_id)
    }
    return
  }

  /** Nếu không có trong state, gọi API (fallback) */
  /** Set loading state */
  is_loading.value = true
  error_message.value = null

  try {
    /** Gọi API để lấy chi tiết ticket */
    const DATA = await getTicketDetail(TICKET_ID)
    ticket_detail.value = DATA

    /** Load comments cho ticket này */
    if (DATA.ticket_id) {
      await loadComments(DATA.ticket_id)
    }
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
