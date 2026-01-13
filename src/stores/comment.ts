import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getComments, createComment } from '@/api/ticket'
import type { TicketComment } from '@/types/ticket'

/**
 * Store quản lý comments cho Ticket
 *
 * UX-First Approach:
 * - Khi tạo comment mới, KHÔNG gọi lại getComments API
 * - Append comment mới trực tiếp vào danh sách hiện tại
 * - Giữ nguyên page hiện tại (không reset về page 1)
 * - User thấy comment mới ngay lập tức mà không bị gián đoạn
 *
 * Trade-off được chấp nhận:
 * - Comment mới có thể không theo đúng thứ tự phân trang của backend
 * - Pagination sẽ được sync lại khi user chuyển page hoặc reload
 */
export const useCommentStore = defineStore('comment', () => {
  // --- State ---

  /** Danh sách comments hiện tại đang hiển thị */
  const comments = ref<TicketComment[]>([])

  /** Tổng số comments (từ server + local newly created) */
  const total_comments = ref<number>(0)

  /** Page hiện tại */
  const page = ref<number>(1)

  /** Tổng số trang */
  const total_page = ref<number>(1)

  /** Trạng thái loading danh sách */
  const is_loading = ref<boolean>(false)

  /** Trạng thái đang submit comment */
  const is_submitting = ref<boolean>(false)

  // --- Actions ---

  /**
   * Load comments từ server
   * Gọi khi: mount component, chuyển page, reload
   *
   * @param ticket_id ID của ticket
   * @param page_param Page cần load (optional, default = 1)
   */
  async function loadComments(ticket_id: number, page_param: number = 1) {
    try {
      is_loading.value = true

      /** Gọi API lấy danh sách comment */
      const response = await getComments(ticket_id, page_param)

      /** Cập nhật state từ response */
      comments.value = response.comments || []
      total_comments.value = response.total_comments || 0
      total_page.value = response.total_page || 1
      page.value = page_param
    } catch (error) {
      console.error('Error loading comments:', error)
      throw error
    } finally {
      is_loading.value = false
    }
  }

  /**
   * Tạo comment mới - Optimized UX
   *
   * Flow:
   * 1. Gọi API createComment
   * 2. Nếu đang ở trang 1:
   *    - Append comment mới vào đầu list (KHÔNG gọi API)
   * 3. Nếu đang ở trang khác (2, 3...):
   *    - Giữ nguyên trang hiện tại (không reload)
   *    - Comment mới sẽ thấy khi user quay về trang 1
   *
   * Lý do thiết kế này:
   * - Trang 1: UX tối ưu, thấy ngay
   * - Trang khác: Không làm mất context người dùng đang xem
   *
   * @param ticket_id ID ticket
   * @param content Nội dung comment
   */
  async function submitComment(ticket_id: number, content: string) {
    try {
      is_submitting.value = true

      /** 1. Gọi API tạo comment */
      const new_comment = await createComment({
        ticket_id,
        content,
      })

      /**
       * 2. Xử lý UI update dựa trên page hiện tại
       */
      if (page.value === 1) {
        /**
         * Đang ở trang 1: Append vào đầu list
         * - KHÔNG gọi API (tối ưu UX)
         * - User thấy ngay lập tức
         * - Không có loading state
         */
        comments.value.unshift(new_comment)
        total_comments.value++
      } else {
        /**
         * Đang ở trang khác:
         * - Giữ nguyên trang hiện tại (không reload)
         * - Chỉ tăng total_comments
         * - Comment mới sẽ được load khi user quay về trang 1
         * - Tránh việc comment hiện sai vị trí (ở cuối trang hiện tại)
         */
        total_comments.value++
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      throw error
    } finally {
      is_submitting.value = false
    }
  }

  /**
   * Reset store state
   * Gọi khi: unmount component hoặc chuyển sang ticket khác
   */
  function $reset() {
    comments.value = []
    total_comments.value = 0
    page.value = 1
    total_page.value = 1
    is_loading.value = false
    is_submitting.value = false
  }

  return {
    // State
    comments,
    total_comments,
    page,
    total_page,
    is_loading,
    is_submitting,

    // Actions
    loadComments,
    submitComment,
    $reset,
  }
})
