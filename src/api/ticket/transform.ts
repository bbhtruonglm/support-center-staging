/**
 * Transform functions cho Ticket API
 */
import type { TicketItem, FeedbackItem, TicketStage, TabKey } from '@/types/ticket'

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