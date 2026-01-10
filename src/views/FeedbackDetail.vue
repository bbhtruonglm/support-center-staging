<template>
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 bg-slate-100">
      <PageHeader :title="t('feedback.detailTitle')" />
    </div>

    <!-- Scrollable Content -->
    <div ref="scrollable_content_ref" class="flex-1 overflow-y-auto">
      <div class="flex flex-col p-2 min-h-full">
        <!-- Error State -->
        <div
          v-if="error_message && !is_loading_initial"
          class="flex items-center justify-center py-10"
        >
          <p class="text-sm text-red-500">{{ error_message }}</p>
        </div>

        <!-- Skeleton Loading State -->
        <div v-if="is_loading_initial" class="flex flex-col">
          <!-- Skeleton component cho phần chi tiết phản ánh -->
          <FeedbackDetailSkeleton />

          <!-- Skeleton component cho phần tình trạng xử lý -->
          <CommentsListSkeleton />
        </div>

        <!-- Chi tiết phản ánh -->
        <div v-else-if="ticket_detail" class="flex flex-col flex-1 min-h-full">
          <div class="flex flex-col gap-1">
            <!-- Tiêu đề -->
            <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
              <h3 class="text-xs font-medium text-slate-700">
                {{ t('feedback.title') }}
              </h3>
              <p class="text-sm font-medium text-black">
                {{ ticket_detail.title || t('feedback.noTitle') }}
              </p>
            </section>

            <!-- Danh mục -->
            <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
              <h3 class="text-xs font-medium text-slate-700">
                {{ t('feedback.category') }}
              </h3>
              <p class="text-sm font-medium text-black">
                {{ getCategoryLabel(ticket_detail.workflow_id) }}
              </p>
            </section>

            <!-- Trạng thái -->
            <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
              <h3 class="text-xs font-medium text-slate-700">
                {{ t('feedback.status') }}
              </h3>
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
              <h3 class="text-xs font-medium text-slate-700">
                {{ t('feedback.content') }}
              </h3>
              <p class="text-sm font-medium text-black whitespace-pre-wrap">
                {{ ticket_detail.content || t('feedback.noContent') }}
              </p>
            </section>

            <!-- Ảnh đính kèm -->
            <section class="bg-white rounded-lg px-4 py-3 shadow-sm">
              <h3 class="text-xs font-medium text-slate-700">
                {{ t('feedback.attachImages') }}
              </h3>
              <div class="flex flex-wrap gap-2.5">
                <!-- Empty State: Giữ height để đồng bộ với skeleton -->
                <div
                  v-if="
                    !ticket_detail.attachments ||
                    (Array.isArray(ticket_detail.attachments) &&
                      ticket_detail.attachments.length === 0)
                  "
                  class="w-20 h-20 flex items-center"
                >
                  <p class="text-sm font-medium text-black whitespace-nowrap">
                    {{ t('feedback.noAttachments') }}
                  </p>
                </div>
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
          </div>

          <!-- Tình trạng xử lý -->
          <div class="flex flex-col gap-2 flex-1">
            <!-- Tiêu đề -->
            <div
              class="py-3 border-b-2 border-blue-700 flex justify-center text-sm text-blue-700 font-bold"
            >
              {{ t('feedback.processingStatus') }}
            </div>

            <!-- Comments List -->
            <!-- Skeleton component cho danh sách comments khi đang loading -->
            <!-- showTitle=false vì tiêu đề đã có sẵn ở trên -->
            <CommentsListSkeleton v-if="is_loading_comments" :show-title="false" />
            <div
              v-else-if="comments_list.length === 0"
              class="flex items-center justify-center py-10 flex-1"
            >
              <p class="text-sm text-gray-500">
                {{ t('feedback.noComments') }}
              </p>
            </div>
            <div v-else class="flex flex-col gap-2 flex-1">
              <!-- Comment Card -->
              <div
                v-for="comment in comments_list"
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
                      <p class="text-xs text-slate-500">
                        {{ comment.position }}
                      </p>
                    </div>
                  </div>
                  <!-- Ngày -->
                  <div class="flex flex-col items-end shrink-0">
                    <p class="text-xs text-gray-500 whitespace-nowrap">
                      {{ t('feedback.addedAt') }}
                    </p>
                    <p class="text-xs text-gray-500 whitespace-nowrap">
                      {{ comment.date }}
                    </p>
                  </div>
                </div>
                <!-- Nội dung bình luận -->
                <div class="py-1 text-black font-medium text-base">
                  {{ comment.content }}
                </div>
              </div>

              <!-- Spacer để đẩy phần gửi bình luận xuống cuối khi có ít comments -->
              <div class="flex-1"></div>
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
                <span>{{ t('feedback.previous') }}</span>
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
                <span>{{ t('feedback.next') }}</span>
                <ChevronRight :size="16" class="text-slate-950" />
              </button>
            </div>

            <!-- Bình luận -->
            <div class="flex flex-col gap-1.5">
              <h3 class="text-sm font-medium text-slate-950">
                {{ t('feedback.comment') }}
              </h3>
              <textarea
                v-model="comment_content"
                :placeholder="t('feedback.commentPlaceholder')"
                class="w-full resize-y px-4 py-3 text-sm rounded-md bg-white border border-gray-200 focus:outline-none text-black placeholder:text-gray-500 shadow-sm"
                rows="4"
                :disabled="is_sending_comment"
              ></textarea>
            </div>

            <!-- Footer Button -->
            <button
              @click="handleSendComment"
              :disabled="is_sending_comment || !comment_content.trim()"
              class="w-full bg-orange-500 cursor-pointer text-white font-medium p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ is_sending_comment ? t('feedback.sendingComment') : t('feedback.sendComment') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// H1: import runtime functions
// Import các reactive functions từ Vue
import { ref, computed, onMounted, watch, nextTick } from 'vue'
// Import router hooks để lấy route params và điều hướng
import { useRoute, useRouter } from 'vue-router'
// Import i18n hook để sử dụng translation function
import { useI18n } from 'vue-i18n'

// H2: import components
// Import component PageHeader để hiển thị header
import PageHeader from '@/components/PageHeader.vue'
// Import skeleton component cho phần chi tiết phản ánh
import FeedbackDetailSkeleton from '@/components/skeletons/FeedbackDetailSkeleton.vue'
// Import skeleton component cho danh sách comments
import CommentsListSkeleton from '@/components/skeletons/CommentsListSkeleton.vue'

// H3: import icon components
// Import icon ChevronLeft và ChevronRight từ lucide-vue-next
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// H4: import types
// Import API functions và type TicketItem từ ticket API
import { getTicketDetail, getComments, createComment, type TicketItem } from '@/api/ticket'
// Import transform functions để map stage và transform comment
import { mapStageToStatus, transformCommentToItem } from '@/api/ticket/transform'
// Import types TicketStage và CommentItem
import type { TicketStage, CommentItem } from '@/types/ticket'

// H5: props, emits
// Component này không có props và emits

// H6: i18n, store
// Import toast từ vue3-toastify để hiển thị thông báo
import { toast } from 'vue3-toastify'
// Import ticket store để quản lý state của tickets
import { useTicketStore } from '@/stores/ticket'
// Import workflow store để quản lý state của workflows
import { useWorkflowStore } from '@/stores/workflow'

/** Router instance: route để lấy params từ URL */
const route = useRoute()
/** Router instance: router để điều hướng programmatically */
const router = useRouter()

/** i18n instance: t function để translate text từ locale files */
const { t } = useI18n()

/** Ticket store instance: để lấy ticket từ cache và quản lý ticket state */
const ticket_store = useTicketStore()

/** Workflow store instance: để lấy workflow list từ cache và quản lý workflow state */
const workflow_store = useWorkflowStore()

// H7: variables
/** Reactive ref: Chi tiết ticket từ router state hoặc API, null khi chưa load */
const ticket_detail = ref<TicketItem | null>(null)

/** Reactive ref: Trạng thái loading ticket detail, true khi đang gọi API */
const is_loading = ref(false)

/** Reactive ref: Thông báo lỗi khi load ticket detail thất bại, null khi không có lỗi */
const error_message = ref<string | null>(null)

/** Reactive ref: Danh sách comments từ API của trang hiện tại, empty array khi chưa load hoặc không có */
const comments_list = ref<CommentItem[]>([])

/** Reactive ref: Tổng số trang comments từ API, 0 khi chưa load hoặc không có comments */
const total_pages = ref(0)

/** Reactive ref: Trạng thái loading comments, true khi đang gọi API getComments */
const is_loading_comments = ref(false)

/** Reactive ref: Trang hiện tại của comments pagination, bắt đầu từ 1 */
const current_page = ref(1)

/** Reactive ref: Nội dung comment đang nhập trong textarea, empty string khi chưa nhập */
const comment_content = ref('')

/** Reactive ref: Trạng thái đang gửi comment, true khi đang gọi API createComment */
const is_sending_comment = ref(false)

/** Reactive ref: Reference đến scrollable content container element để scroll programmatically */
const scrollable_content_ref = ref<HTMLElement | null>(null)

// H8: lifecycle hooks
/** Lifecycle hook chạy khi component được mount vào DOM */
onMounted(async () => {
  // Đợi workflow list load xong để đảm bảo có data khi render category
  await workflow_store.loadWorkflowList()
  // Sau đó mới load ticket detail
  loadTicketDetail()
})

// H9: watch, computed
/**
 * Computed property: Kiểm tra có đang loading không (bao gồm cả workflow và ticket)
 * @returns true nếu đang loading, false nếu đã load xong
 */
const is_loading_initial = computed(() => {
  // Kiểm tra đang load workflow hoặc ticket detail hoặc chưa có ticket detail và error
  return (
    workflow_store.is_loading || is_loading.value || (!ticket_detail.value && !error_message.value)
  )
})

/**
 * Computed property: Tính toán danh sách số trang hiển thị trong pagination
 * Logic: Hiển thị tối đa 5 số trang với ellipsis khi cần
 * @returns Array các số trang cần hiển thị
 */
const visible_pages = computed(() => {
  // Mảng chứa các số trang sẽ hiển thị
  const PAGES: number[] = []
  /** Tổng số trang từ API */
  const TOTAL = total_pages.value
  /** Trang hiện tại đang xem */
  const CURRENT = current_page.value

  // Nếu tổng số trang <= 3, hiển thị tất cả các trang
  if (TOTAL <= 3) {
    // Loop từ 1 đến TOTAL để thêm tất cả các trang vào mảng
    for (let i = 1; i <= TOTAL; i++) {
      PAGES.push(i)
    }
  } else {
    // Nếu tổng số trang >= 4, cần logic phức tạp hơn với ellipsis
    // Trường hợp 1: Đang ở trang đầu (trang 1 hoặc 2)
    if (CURRENT <= 2) {
      // Thêm các trang đầu: 1, 2, 3
      for (let i = 1; i <= 3; i++) {
        PAGES.push(i)
      }
      // Thêm trang cuối
      PAGES.push(TOTAL)
    } else if (CURRENT >= TOTAL - 1) {
      // Trường hợp 2: Đang ở trang cuối
      // Thêm trang đầu
      PAGES.push(1)
      // Thêm các trang cuối: TOTAL-2, TOTAL-1, TOTAL
      for (let i = TOTAL - 2; i <= TOTAL; i++) {
        PAGES.push(i)
      }
    } else {
      // Trường hợp 3: Đang ở trang giữa
      // Thêm trang đầu
      PAGES.push(1)
      // Thêm trang hiện tại và 2 trang xung quanh
      for (let i = CURRENT - 1; i <= CURRENT + 1; i++) {
        PAGES.push(i)
      }
      // Thêm trang cuối
      PAGES.push(TOTAL)
    }
  }

  // Trả về mảng các số trang cần hiển thị
  return PAGES
})

/**
 * Computed property: Kiểm tra có cần hiển thị ellipsis sau số 1 không
 * Ellipsis hiển thị khi có khoảng cách giữa trang 1 và trang tiếp theo
 * @returns true nếu cần hiển thị ellipsis sau số 1, false nếu không
 */
const show_ellipsis_after_first = computed(() => {
  /** Trang hiện tại đang xem */
  const CURRENT = current_page.value
  /** Tổng số trang từ API */
  const TOTAL = total_pages.value

  // Nếu tổng số trang < 4 hoặc trang hiện tại < 4, không cần ellipsis
  if (TOTAL < 4 || CURRENT < 4) {
    // Trả về false vì không cần hiển thị ellipsis
    return false
  }

  /** Lấy danh sách các trang hiển thị */
  const PAGES = visible_pages.value
  // Nếu không có trang nào hoặc trang đầu không phải là 1, không hiển thị ellipsis
  if (PAGES.length === 0 || PAGES[0] !== 1) {
    // Trả về false vì không cần hiển thị ellipsis
    return false
  }

  /** Kiểm tra có khoảng cách giữa số 1 và trang tiếp theo không */
  const SECOND_PAGE = PAGES[1]
  return SECOND_PAGE ? SECOND_PAGE - 1 > 1 : false
})

/**
 * Computed property: Kiểm tra có cần hiển thị ellipsis trước trang cuối không
 * Ellipsis hiển thị khi có khoảng cách giữa trang gần cuối và trang cuối
 * @returns true nếu cần hiển thị ellipsis trước trang cuối, false nếu không
 */
const show_ellipsis_before_last = computed(() => {
  /** Tổng số trang từ API */
  const TOTAL = total_pages.value
  // Nếu tổng số trang < 4, không cần ellipsis
  if (TOTAL < 4) {
    // Trả về false vì không cần hiển thị ellipsis
    return false
  }

  /** Lấy danh sách các trang hiển thị */
  const PAGES = visible_pages.value
  // Nếu không có trang nào, không hiển thị ellipsis
  if (PAGES.length === 0) {
    // Trả về false vì không cần hiển thị ellipsis
    return false
  }

  /** Lấy trang cuối cùng trong danh sách hiển thị */
  const LAST_PAGE = PAGES[PAGES.length - 1]
  /** Lấy trang gần cuối (trang thứ 2 từ cuối) */
  const SECOND_LAST_PAGE = PAGES[PAGES.length - 2]

  // Nếu không có đủ 2 trang, không hiển thị ellipsis
  if (!LAST_PAGE || !SECOND_LAST_PAGE) {
    // Trả về false vì không cần hiển thị ellipsis
    return false
  }

  // Kiểm tra có khoảng cách giữa trang gần cuối và trang cuối không
  return LAST_PAGE - SECOND_LAST_PAGE > 1
})

/** Watch route params: Theo dõi thay đổi của ticket ID trong URL - Khi ID thay đổi (navigate giữa các ticket khác nhau), reload ticket detail */
watch(
  // Theo dõi route.params.id (ticket_id dạng string)
  () => route.params.id,
  // Callback chạy khi ID thay đổi
  (new_id, old_id) => {
    // Chỉ reload nếu ID thực sự thay đổi (không phải lần đầu mount)
    if (old_id !== undefined && new_id !== old_id) {
      // Gọi hàm load ticket detail với ID mới
      loadTicketDetail()
    }
  },
)

// H10: functions
/** Function: Chuyển đến trang trước trong pagination - Kiểm tra điều kiện trước khi chuyển trang và load comments cho trang mới */
async function goToPreviousPage() {
  // Kiểm tra: trang hiện tại > 1, có ticket_id, và có tổng số trang > 0
  if (current_page.value > 1 && ticket_detail.value?.ticket_id && total_pages.value > 0) {
    /** Tính toán số trang mới (trang hiện tại - 1) */
    const NEW_PAGE = current_page.value - 1
    // Load comments cho trang mới với ticket_id và số trang mới
    await loadComments(ticket_detail.value.ticket_id, NEW_PAGE)
  }
}

/** Function: Chuyển đến trang tiếp theo trong pagination - Kiểm tra điều kiện trước khi chuyển trang và load comments cho trang mới */
async function goToNextPage() {
  // Kiểm tra: trang hiện tại < tổng số trang, có ticket_id, và có tổng số trang > 0
  if (
    current_page.value < total_pages.value &&
    ticket_detail.value?.ticket_id &&
    total_pages.value > 0
  ) {
    /** Tính toán số trang mới (trang hiện tại + 1) */
    const NEW_PAGE = current_page.value + 1
    // Load comments cho trang mới với ticket_id và số trang mới
    await loadComments(ticket_detail.value.ticket_id, NEW_PAGE)
  }
}

/**
 * Function: Chuyển đến trang cụ thể trong pagination
 * @param page - Số trang cần chuyển đến (phải >= 1 và <= total_pages)
 */
async function goToPage(page: number) {
  // Kiểm tra: page hợp lệ (>= 1 và <= total_pages), có ticket_id, và có tổng số trang > 0
  if (
    page >= 1 &&
    page <= total_pages.value &&
    ticket_detail.value?.ticket_id &&
    total_pages.value > 0
  ) {
    // Load comments cho trang được chỉ định với ticket_id và số trang
    await loadComments(ticket_detail.value.ticket_id, page)
  }
}

/**
 * Function: Lấy label cho category từ workflow_id
 * Sử dụng workflow store để lấy tên workflow tương ứng với workflow_id
 * @param workflow_id - ID của workflow từ ticket detail
 * @returns Label string của category (tên workflow)
 */
function getCategoryLabel(workflow_id: number): string {
  // Sử dụng workflow store để lấy tên workflow từ workflow_id
  return workflow_store.getWorkflowName(workflow_id)
}

/**
 * Function: Lấy CSS class cho status badge dựa trên stage
 * Map stage từ API sang status, sau đó trả về CSS class tương ứng
 * @param stage - Stage từ API (ticket stage)
 * @returns CSS class string cho badge (bg-orange-500, bg-blue-500, hoặc bg-green-600)
 */
function getStatusBadgeClass(stage: TicketStage): string {
  /** Map stage từ API sang status (pending, processing, completed) */
  const STATUS = mapStageToStatus(stage)
  /** Object chứa mapping giữa status và CSS class tương ứng */
  const CLASSES = {
    // Status pending: màu cam
    pending: 'bg-orange-500',
    // Status processing: màu xanh dương
    processing: 'bg-blue-500',
    // Status completed: màu xanh lá
    completed: 'bg-green-600',
  }
  // Trả về class tương ứng với status, mặc định là pending nếu không tìm thấy
  return CLASSES[STATUS] || CLASSES.pending
}

/**
 * Function: Lấy label text cho status dựa trên stage
 * Map stage từ API sang status, sau đó trả về label text đã được translate
 * @param stage - Stage từ API (ticket stage)
 * @returns Label string đã được translate (từ i18n)
 */
function getStatusLabel(stage: TicketStage): string {
  /** Map stage từ API sang status (pending, processing, completed) */
  const STATUS = mapStageToStatus(stage)
  /** Object chứa mapping giữa status và label text đã được translate */
  const LABELS = {
    // Label cho status pending
    pending: t('feedback.pending'),
    // Label cho status processing
    processing: t('feedback.processing'),
    // Label cho status completed
    completed: t('feedback.completed'),
  }
  // Trả về label tương ứng với status, mặc định là pending nếu không tìm thấy
  return LABELS[STATUS] || t('feedback.pending')
}

/** Function: Scroll lên đầu trang scrollable content - Sử dụng nextTick để đảm bảo DOM đã được cập nhật trước khi scroll */
function scrollToTop() {
  // Sử dụng nextTick để đợi DOM được cập nhật trước khi scroll
  nextTick(() => {
    // Kiểm tra xem ref đến scrollable container có tồn tại không
    if (scrollable_content_ref.value) {
      // Scroll đến đầu trang với animation smooth
      scrollable_content_ref.value.scrollTo({
        // Scroll đến vị trí top = 0
        top: 0,
        // Sử dụng smooth scroll animation
        behavior: 'smooth',
      })
    }
  })
}

/**
 * Function: Load comments từ API theo ticket_id và page
 * Xử lý loading state, transform data, và error handling
 * @param ticket_id - Ticket ID (số) để lấy comments
 * @param page - Số trang cần lấy (mặc định 1)
 */
async function loadComments(ticket_id: number, page: number = 1) {
  // Kiểm tra nếu đang loading thì không gọi tiếp để tránh duplicate calls
  if (is_loading_comments.value) {
    return
  }

  /** Đảm bảo page là số nguyên dương hợp lệ (>= 1) */
  const VALID_PAGE = Math.max(1, Math.floor(page))

  // Set loading state thành true để hiển thị skeleton loading
  is_loading_comments.value = true

  // Scroll lên đầu trang khi chuyển trang để user thấy nội dung mới ngay
  scrollToTop()

  try {
    /** Gọi API để lấy danh sách comments với ticket_id và page */
    const RESPONSE = await getComments(ticket_id, VALID_PAGE)

    /** Transform comments từ API format sang format CommentItem */
    const TRANSFORMED_COMMENTS = RESPONSE.comments.map(transformCommentToItem)

    // Cập nhật danh sách comments với data đã được transform
    comments_list.value = TRANSFORMED_COMMENTS

    // Cập nhật total_page từ response của API
    total_pages.value = RESPONSE.total_page

    // Cập nhật current_page để đồng bộ với page đã gọi API
    current_page.value = VALID_PAGE
  } catch (e: any) {
    // Log error ra console để debug
    console.error('Error loading comments:', e)
    /** Lấy error message từ exception hoặc dùng message mặc định từ i18n */
    const ERROR_MSG = e.message || t('feedback.loadCommentsError')

    // Xử lý đặc biệt cho lỗi PAGE_NOT_FOUND - không hiển thị toast error
    if (ERROR_MSG === 'PAGE_NOT_FOUND' || ERROR_MSG.includes('PAGE_NOT_FOUND')) {
      // Set empty array và reset total_page về 0
      comments_list.value = []
      total_pages.value = 0
      // Reset về trang 1
      current_page.value = 1
    } else {
      // Hiển thị toast error cho các lỗi khác
      toast.error(ERROR_MSG)
      // Set empty array và reset total_page nếu có lỗi
      comments_list.value = []
      total_pages.value = 0
      // Reset về trang 1
      current_page.value = 1
    }
  } finally {
    // Luôn set loading state thành false sau khi hoàn thành
    is_loading_comments.value = false
  }
}

/** Function: Gửi comment mới cho ticket - Validate input, gọi API, reload comments, và hiển thị thông báo */
async function handleSendComment() {
  // Kiểm tra ticket detail và content có tồn tại không
  if (!ticket_detail.value || !comment_content.value.trim()) {
    // Return sớm nếu không có ticket detail hoặc content rỗng
    return
  }

  // Set loading state thành true để disable button và hiển thị loading state
  is_sending_comment.value = true

  try {
    // Gọi API để tạo comment mới với ticket_id và content đã được trim
    await createComment({
      // Ticket ID từ ticket detail
      ticket_id: ticket_detail.value.ticket_id,
      // Content đã được trim để loại bỏ khoảng trắng đầu cuối
      content: comment_content.value.trim(),
    })

    // Clear input sau khi gửi thành công
    comment_content.value = ''

    // Reload comments để hiển thị comment mới vừa tạo (reset về trang 1)
    if (ticket_detail.value.ticket_id) {
      // Reset về trang 1
      current_page.value = 1
      // Load lại comments từ trang 1
      await loadComments(ticket_detail.value.ticket_id, 1)
    }

    // Hiển thị thông báo thành công từ i18n
    toast.success(t('feedback.sendCommentSuccess'))
  } catch (e: any) {
    // Log error ra console để debug
    console.error('Error sending comment:', e)
    /** Lấy error message từ exception hoặc dùng message mặc định từ i18n */
    const ERROR_MSG = e.message || t('feedback.sendCommentError')
    // Hiển thị toast error với message lỗi
    toast.error(ERROR_MSG)
  } finally {
    // Luôn set loading state thành false sau khi hoàn thành
    is_sending_comment.value = false
  }
}

/**
 * Function: Load chi tiết ticket từ cache hoặc API
 * Ưu tiên lấy từ Pinia store (cache), nếu không có thì gọi API
 * Sau khi load ticket, sẽ load comments cho ticket đó
 */
async function loadTicketDetail() {
  // Kiểm tra nếu đang loading thì không gọi tiếp để tránh duplicate calls
  if (is_loading.value) {
    // Return sớm để tránh duplicate calls
    return
  }

  /** Lấy ticket ID từ route params (từ URL) - là ticket_id dạng string */
  const TICKET_ID_PARAM = route.params.id as string

  // Kiểm tra xem có ticket ID không
  if (!TICKET_ID_PARAM) {
    // Nếu không có thì set error message và return
    error_message.value = t('feedback.ticketIdNotFound')
    // Return sớm vì không có ticket ID
    return
  }

  /** Convert ticket_id từ string sang number */
  const TICKET_ID_NUMBER = Number(TICKET_ID_PARAM)

  // Kiểm tra xem ticket_id có hợp lệ không (phải là số)
  if (isNaN(TICKET_ID_NUMBER)) {
    // Nếu không phải số thì set error message và return
    error_message.value = t('feedback.ticketIdNotFound')
    // Return sớm vì ticket_id không hợp lệ
    return
  }

  /** Kiểm tra xem có ticket trong Pinia store không - tìm theo ticket_id */
  const CACHED_TICKET = ticket_store.getTicketByTicketId(TICKET_ID_NUMBER)
  // Check tồn tại trong cache và ticket_id trùng khớp
  if (CACHED_TICKET && CACHED_TICKET.ticket_id === TICKET_ID_NUMBER) {
    // Sử dụng ticket từ store, không cần gọi API
    ticket_detail.value = CACHED_TICKET
    // Load comments cho ticket này sau khi đã có ticket detail
    if (CACHED_TICKET.ticket_id) {
      // Gọi load comments với ticket_id từ cached ticket
      await loadComments(CACHED_TICKET.ticket_id)
    }
    // Return sớm để không gọi API
    return
  }

  // Nếu không có trong store, gọi API để load ticket detail
  // Set loading state thành true để hiển thị skeleton loading
  is_loading.value = true
  // Reset error message về null trước khi gọi API mới
  error_message.value = null

  try {
    /** Gọi API để lấy chi tiết ticket với TICKET_ID_NUMBER */
    const DATA = await getTicketDetail(TICKET_ID_NUMBER)
    // Cập nhật ticket_detail với data từ API
    ticket_detail.value = DATA

    // Lưu ticket vào store để cache cho lần sau
    ticket_store.setTicket(DATA)

    // Load comments cho ticket này sau khi đã có ticket detail
    if (DATA.ticket_id) {
      // Gọi load comments với ticket_id từ API response
      await loadComments(DATA.ticket_id)
    }
  } catch (e: any) {
    // Log error ra console để debug
    console.error('Error loading ticket detail:', e)
    /** Lấy error message từ exception hoặc dùng message mặc định từ i18n */
    const ERROR_MSG = e.message || t('feedback.loadDetailError')
    // Set error message để hiển thị trên UI
    error_message.value = ERROR_MSG
    // Hiển thị toast error với message lỗi
    toast.error(ERROR_MSG)
  } finally {
    // Luôn set loading state thành false sau khi hoàn thành
    is_loading.value = false
  }
}
</script>
