/**
 * Ticket API - Main entry point
 */
import { ticketApiClient } from './client'
import { transformTicketToFeedback, mapTabToStageFilter } from './transform'
import type { TicketItem, FeedbackItem, TabKey } from '@/types/ticket'

/**
 * API: Lấy danh sách ticket theo stage filter
 * @param tab_key - Key của tab để filter (optional)
 * @returns Promise chứa danh sách FeedbackItem đã transform
 */
export async function getTicketList(tab_key?: TabKey): Promise<FeedbackItem[]> {
  try {
    /** Map tab key sang stage filter */
    const STAGE_FILTER = tab_key ? mapTabToStageFilter(tab_key) : undefined

    /** Gọi API POST để lấy danh sách ticket (luôn lấy tất cả, filter ở client) */
    const RESPONSE = await ticketApiClient.post<TicketItem[]>('get_ticket', {})

    /** Filter tickets theo stage trước khi transform */
    let FILTERED_TICKETS = RESPONSE.data

    if (STAGE_FILTER && STAGE_FILTER.length > 0) {
      FILTERED_TICKETS = RESPONSE.data.filter((ticket) =>
        STAGE_FILTER.includes(ticket.stage),
      )
    }

    /** Transform data từ TicketItem sang FeedbackItem */
    const TRANSFORMED_DATA = FILTERED_TICKETS.map(transformTicketToFeedback)

    return TRANSFORMED_DATA
  } catch (error: any) {
    console.error('Error loading ticket list:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE =
        error.response.data?.message || 'Không thể tải danh sách phản ánh'
      throw new Error(MESSAGE)
    }

    /** Xử lý lỗi network */
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * Export types để sử dụng ở các component
 */
export type {
  TicketItem,
  FeedbackItem,
  TabKey,
  TicketStage,
  WorkflowAction,
  WorkflowData,
  ContactInfo,
  TicketComment,
} from '@/types/ticket'

