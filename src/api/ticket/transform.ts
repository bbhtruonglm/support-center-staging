/**
 * Transform functions cho Ticket API
 */
import type {
  TicketItem,
  FeedbackItem,
  TicketStage,
  TabKey,
  TicketComment,
  CommentItem,
} from '@/types/ticket'

/**
 * Map stage từ API sang status cho UI
 * @param stage - Stage từ API
 * @returns Status cho UI
 */
export function mapStageToStatus(stage: TicketStage): 'pending' | 'processing' | 'completed' {
  switch (stage) {
    case 'OPEN':
    case 'REOPEN':
      return 'pending'
    case 'PENDING':
    case 'PROCESSING':
    case 'RESOLVED':
      return 'processing'
    case 'CLOSED':
      return 'completed'
    default:
      return 'pending'
  }
}

/**
 * Format date từ ISO string sang định dạng hiển thị
 * @param iso_date - ISO date string
 * @returns Date string định dạng DD/MM/YYYY - HH:mm
 */
export function formatDate(iso_date: string): string {
  try {
    const DATE = new Date(iso_date)
    const DAY = String(DATE.getDate()).padStart(2, '0')
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
    const YEAR = DATE.getFullYear()
    const HOURS = String(DATE.getHours()).padStart(2, '0')
    const MINUTES = String(DATE.getMinutes()).padStart(2, '0')
    return `${DAY}/${MONTH}/${YEAR} - ${HOURS}:${MINUTES}`
  } catch (e) {
    return iso_date
  }
}

/**
 * Transform TicketItem sang FeedbackItem format
 * @param ticket - Ticket item từ API
 * @returns FeedbackItem
 */
export function transformTicketToFeedback(ticket: TicketItem): FeedbackItem {
  /** Lấy title từ ticket hoặc từ comment đầu tiên */
  const TITLE =
    ticket.title || ticket.comments?.[0]?.content?.substring(0, 50) || 'Không có tiêu đề'

  /** Lấy content từ ticket hoặc từ comment đầu tiên */
  const CONTENT = ticket.content || ticket.comments?.[0]?.content || 'Không có nội dung'

  /** Map stage sang status */
  const STATUS = mapStageToStatus(ticket.stage)

  /** Format date */
  const DATE = formatDate(ticket.created_at)

  return {
    id: ticket.id,
    title: TITLE,
    date: DATE,
    status: STATUS,
    content: CONTENT,
  }
}

/**
 * Map tab key sang stage filter cho API
 * @param tab_key - Key của tab
 * @returns Stage filter hoặc undefined
 */
export function mapTabToStageFilter(tab_key: TabKey): TicketStage[] | undefined {
  switch (tab_key) {
    case 'pending':
      // Tab "Gửi yêu cầu" map với OPEN và REOPEN
      return ['OPEN', 'REOPEN']
    case 'processing':
      // Tab "Đang xử lý" map với PENDING, PROCESSING, RESOLVED
      return ['PENDING', 'PROCESSING', 'RESOLVED']
    case 'completed':
      // Tab "Hoàn thành" map với CLOSED
      return ['CLOSED']
    case 'all':
    default:
      // Tab "Tất cả" không filter - hiển thị toàn bộ ticket
      return undefined
  }
}

/**
 * Format date cho comment (HH:mm:ss - DD/MM/YYYY)
 * @param iso_date - ISO date string
 * @returns Date string định dạng HH:mm:ss - DD/MM/YYYY
 */
export function formatCommentDate(iso_date: string): string {
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
 * Transform TicketComment sang CommentItem format
 * @param comment - Ticket comment từ API
 * @returns CommentItem
 */
export function transformCommentToItem(comment: TicketComment): CommentItem {
  /** Lấy thông tin từ contact_info hoặc employee_info */
  const CONTACT_INFO = comment.contact_info
  const EMPLOYEE_INFO = comment.employee_info

  /** Xác định tên người comment */
  let NAME = 'Không xác định'
  if (CONTACT_INFO) {
    const FIRST_NAME = CONTACT_INFO.first_name || ''
    const LAST_NAME = CONTACT_INFO.last_name || ''
    NAME = `${FIRST_NAME} ${LAST_NAME}`.trim() || 'Không xác định'
  } else if (EMPLOYEE_INFO) {
    /** Nếu có employee_info, có thể lấy tên từ đây */
    NAME = EMPLOYEE_INFO.name || 'Nhân viên'
  }

  /** Xác định avatar */
  let AVATAR = '/src/assets/systemAvatar.png'
  if (CONTACT_INFO?.avatar) {
    AVATAR = CONTACT_INFO.avatar
  } else if (EMPLOYEE_INFO?.avatar) {
    AVATAR = EMPLOYEE_INFO.avatar
  }

  /** Xác định vị trí/chức vụ */
  let POSITION = ''
  if (EMPLOYEE_INFO) {
    /** Nếu là employee, có thể lấy position từ employee_info */
    POSITION = EMPLOYEE_INFO.position || EMPLOYEE_INFO.department || ''
  } else if (CONTACT_INFO) {
    /** Nếu là customer, hiển thị "Khách hàng" */
    POSITION = 'Khách hàng'
  }

  /** Format date */
  const DATE = formatCommentDate(comment.created_at)

  /** Xác định is_bold: employee comments sẽ in đậm */
  const IS_BOLD = !!EMPLOYEE_INFO

  return {
    id: comment.id,
    name: NAME,
    position: POSITION,
    avatar: AVATAR,
    content: comment.content,
    date: DATE,
    is_bold: IS_BOLD,
  }
}