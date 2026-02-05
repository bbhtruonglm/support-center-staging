/** Transform functions cho Ticket API */
// Import các types từ ticket types
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
 * @param stage - Stage từ API (optional)
 * @returns Status cho UI
 */
export function mapStageToStatus(stage?: TicketStage): 'pending' | 'processing' | 'completed' {
  // Kiểm tra stage có tồn tại không
  if (!stage) {
    return 'pending'
  }
  // Switch case để map stage sang status
  switch (stage) {
    // Case OPEN và REOPEN map sang pending
    case 'OPEN':
    case 'REOPEN':
      return 'pending'
    // Case PENDING, PROCESSING, RESOLVED map sang processing
    case 'PENDING':
    case 'PROCESSING':
      return 'processing'
    // Case CLOSED map sang completed
    case 'CLOSED':
    case 'RESOLVED':
      return 'completed'
    // Default trả về pending
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
    /** Tạo Date object từ ISO string */
    const DATE = new Date(iso_date)
    /** Lấy ngày và pad với số 0 phía trước nếu < 10 */
    const DAY = String(DATE.getDate()).padStart(2, '0')
    /** Lấy tháng (0-11) và pad với số 0 phía trước, cộng thêm 1 */
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
    /** Lấy năm */
    const YEAR = DATE.getFullYear()
    /** Lấy giờ và pad với số 0 phía trước nếu < 10 */
    const HOURS = String(DATE.getHours()).padStart(2, '0')
    /** Lấy phút và pad với số 0 phía trước nếu < 10 */
    const MINUTES = String(DATE.getMinutes()).padStart(2, '0')
    // Trả về chuỗi định dạng DD/MM/YYYY - HH:mm
    return `${DAY}/${MONTH}/${YEAR} - ${HOURS}:${MINUTES}`
  } catch (e) {
    // Nếu có lỗi thì trả về ISO date gốc
    return iso_date
  }
}

/**
 * Transform TicketItem sang FeedbackItem format
 * @param ticket - Ticket item từ API
 * @returns FeedbackItem
 */
export function transformTicketToFeedback(ticket: TicketItem): FeedbackItem {
  /** Lấy title từ ticket hoặc từ comment đầu tiên (tối đa 50 ký tự) */
  const TITLE =
    ticket?.title || ticket?.comments?.[0]?.content?.substring(0, 50) || 'Không có tiêu đề'

  /** Lấy content từ ticket hoặc từ comment đầu tiên */
  const CONTENT = ticket?.content || ticket?.comments?.[0]?.content || 'Không có nội dung'

  /** Map stage sang status bằng function mapStageToStatus */
  const STATUS = mapStageToStatus(ticket?.stage)

  /** Format date bằng function formatDate, fallback nếu không có */
  const DATE = ticket?.created_at ? formatDate(ticket?.created_at) : ''

  // Trả về FeedbackItem object
  return {
    // ID của ticket
    id: ticket?.id || '',
    // Title đã được xử lý
    title: TITLE,
    // Date đã được format
    date: DATE,
    // Status đã được map
    status: STATUS,
    // Content đã được xử lý
    content: CONTENT,
    // Customer unread count
    customer_unread_count: ticket?.customer_unread_count || 0,
  }
}

/**
 * Map tab key sang stage filter cho API
 * @param tab_key - Key của tab
 * @returns Stage filter array (undefined cho tab "Tất cả" sẽ không gửi stage trong request)
 */
export function mapTabToStageFilter(tab_key: TabKey): TicketStage[] | undefined {
  // Switch case để map tab key sang stage filter
  switch (tab_key) {
    // Tab "Gửi yêu cầu" map với OPEN và REOPEN
    case 'pending':
      return ['OPEN', 'REOPEN']
    // Tab "Đang xử lý" map với PENDING, PROCESSING, RESOLVED
    case 'processing':
      return ['PENDING', 'PROCESSING']
    // Tab "Hoàn thành" map với CLOSED
    case 'completed':
      return ['CLOSED', 'RESOLVED']
    // Tab "Tất cả" không filter - trả về undefined để không gửi stage trong request
    case 'all':
    default:
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
    /** Tạo Date object từ ISO string */
    const DATE = new Date(iso_date)
    /** Lấy giờ và pad với số 0 phía trước nếu < 10 */
    const HOURS = String(DATE.getHours()).padStart(2, '0')
    /** Lấy phút và pad với số 0 phía trước nếu < 10 */
    const MINUTES = String(DATE.getMinutes()).padStart(2, '0')
    /** Lấy giây và pad với số 0 phía trước nếu < 10 */
    const SECONDS = String(DATE.getSeconds()).padStart(2, '0')
    /** Lấy ngày và pad với số 0 phía trước nếu < 10 */
    const DAY = String(DATE.getDate()).padStart(2, '0')
    /** Lấy tháng (0-11) và pad với số 0 phía trước, cộng thêm 1 */
    const MONTH = String(DATE.getMonth() + 1).padStart(2, '0')
    /** Lấy năm */
    const YEAR = DATE.getFullYear()
    // Trả về chuỗi định dạng HH:mm:ss - DD/MM/YYYY
    return `${HOURS}:${MINUTES}:${SECONDS} - ${DAY}/${MONTH}/${YEAR}`
  } catch (e) {
    // Nếu có lỗi thì trả về ISO date gốc
    return iso_date
  }
}

/**
 * Transform TicketComment sang CommentItem format
 * @param comment - Ticket comment từ API
 * @returns CommentItem
 */
export function transformCommentToItem(comment: TicketComment): CommentItem {
  /** Lấy thông tin từ contact_info */
  const CONTACT_INFO = comment?.contact_info
  /** Lấy thông tin từ employee_info */
  const EMPLOYEE_INFO = comment?.employee_info

  // Xác định tên người comment
  let NAME = 'Không xác định'
  // Nếu có contact_info thì lấy tên từ đó
  if (CONTACT_INFO) {
    /** Lấy first_name từ contact_info hoặc rỗng */
    const FIRST_NAME = CONTACT_INFO?.first_name || ''
    /** Lấy last_name từ contact_info hoặc rỗng */
    const LAST_NAME = CONTACT_INFO?.last_name || ''
    // Ghép first_name và last_name, trim và set mặc định nếu rỗng
    NAME = `${FIRST_NAME} ${LAST_NAME}`.trim() || 'Không xác định'
  } else if (EMPLOYEE_INFO) {
    // Nếu có employee_info thì lấy tên từ đó
    /** Lấy first_name từ employee_info hoặc rỗng */
    const FIRST_NAME = EMPLOYEE_INFO?.first_name || ''
    /** Lấy last_name từ employee_info hoặc rỗng */
    const LAST_NAME = EMPLOYEE_INFO?.last_name || ''
    // Ghép first_name và last_name, trim và set mặc định là "Nhân viên"
    NAME = `${FIRST_NAME} ${LAST_NAME}`.trim() || 'Nhân viên'
  }

  // Xác định avatar với giá trị mặc định
  let AVATAR = '/src/assets/systemAvatar.png'
  // Nếu có avatar từ contact_info thì dùng
  if (CONTACT_INFO?.avatar) {
    AVATAR = CONTACT_INFO?.avatar || AVATAR
  } else if (EMPLOYEE_INFO?.avatar) {
    // Nếu có avatar từ employee_info thì dùng
    AVATAR = EMPLOYEE_INFO?.avatar || AVATAR
  }

  // Xác định vị trí/chức vụ
  let POSITION = ''
  // Nếu là employee thì lấy position từ employee_info
  if (EMPLOYEE_INFO) {
    // Nếu có position field thì dùng nó
    if (EMPLOYEE_INFO?.position) {
      POSITION = EMPLOYEE_INFO?.position || ''
    } else if (EMPLOYEE_INFO?.department) {
      // Nếu department là object thì lấy name từ object
      if (typeof EMPLOYEE_INFO?.department === 'object' && EMPLOYEE_INFO?.department?.name) {
        POSITION = EMPLOYEE_INFO?.department?.name || ''
      } else if (typeof EMPLOYEE_INFO?.department === 'string') {
        // Nếu department là string thì dùng trực tiếp
        POSITION = EMPLOYEE_INFO?.department || ''
      }
    }
  } else if (CONTACT_INFO) {
    // Nếu là customer thì hiển thị "Khách hàng"
    POSITION = 'Khách hàng'
  }

  // Nếu có branch thì thêm vào POSITION
  if (EMPLOYEE_INFO?.branch?.name && POSITION) {
    // Append branch name vào POSITION với dấu gạch ngang (dùng optional chaining để an toàn)
    POSITION = `${POSITION} - ${EMPLOYEE_INFO?.branch?.name || ''}`
  } else if (EMPLOYEE_INFO?.branch?.name && !POSITION) {
    // Nếu không có POSITION thì chỉ dùng branch name (dùng optional chaining để an toàn)
    POSITION = EMPLOYEE_INFO?.branch?.name || ''
  }

  /** Format date bằng function formatCommentDate, fallback nếu không có */
  const DATE = comment?.created_at ? formatCommentDate(comment?.created_at) : ''

  /** Xác định is_bold: employee comments sẽ in đậm */
  const IS_BOLD = !!EMPLOYEE_INFO

  /** Xử lý attachments: map sang string array */
  const ATTACHMENTS = Array.isArray(comment?.attachments)
    ? comment?.attachments.map((att) => (typeof att === 'string' ? att : att?.url || '')) || []
    : []

  // Trả về CommentItem object
  return {
    // ID của comment
    id: comment?.id,
    // Tên đã được xử lý
    name: NAME,
    // Vị trí/chức vụ đã được xử lý
    position: POSITION,
    // Avatar đã được xử lý
    avatar: AVATAR,
    // Content từ comment
    content: comment?.content,
    // Date đã được format
    date: DATE,
    // Flag is_bold đã được xác định
    is_bold: IS_BOLD,
    // Attachments đã được xử lý
    attachments: ATTACHMENTS,
    // Branch từ comment
    branch: comment?.branch,
  }
}
