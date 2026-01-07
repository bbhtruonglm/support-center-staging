/**
 * Ticket API - Main entry point
 */
import { ticketApiClient } from './client'
import { transformTicketToFeedback, mapTabToStageFilter } from './transform'
import type {
  TicketItem,
  FeedbackItem,
  TabKey,
  WorkflowItem,
  FormData,
  CreateFormResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  GetCommentResponse,
  GetTicketRequest,
} from '@/types/ticket'

/**
 * API: Lấy danh sách ticket theo stage filter
 * @param tab_key - Key của tab để filter (optional)
 * @param skip - Số lượng bản ghi bỏ qua (mặc định 0)
 * @param take - Số lượng bản ghi lấy (mặc định 10)
 * @returns Promise chứa object với feedbackList và ticketList
 */
export async function getTicketList(
  tab_key?: TabKey,
  skip: number = 0,
  take: number = 10,
): Promise<{ feedbackList: FeedbackItem[]; ticketList: TicketItem[] }> {
  try {
    /** Map tab key sang stage filter */
    const STAGE_FILTER = tab_key ? mapTabToStageFilter(tab_key) : undefined

    /** Tạo payload request */
    const PAYLOAD: GetTicketRequest = {
      skip,
      take,
    }

    /** Chỉ thêm stage vào payload nếu có filter */
    if (STAGE_FILTER && STAGE_FILTER.length > 0) {
      PAYLOAD.stage = STAGE_FILTER
    }

    /** Gọi API POST để lấy danh sách ticket với filter */
    const RESPONSE = await ticketApiClient.post<TicketItem[]>('get_ticket', PAYLOAD)

    /** Transform data từ TicketItem sang FeedbackItem */
    const TRANSFORMED_DATA = RESPONSE.data.map(transformTicketToFeedback)

    return {
      feedbackList: TRANSFORMED_DATA,
      ticketList: RESPONSE.data,
    }
  } catch (error: any) {
    console.error('Error loading ticket list:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE = error.response.data?.message || 'Không thể tải danh sách phản ánh'
      throw new Error(MESSAGE)
    }

    /** Xử lý lỗi network */
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Lấy danh sách workflow
 * @returns Promise chứa danh sách WorkflowItem
 */
export async function getWorkflowList(): Promise<WorkflowItem[]> {
  try {
    /** Gọi API POST để lấy danh sách workflow */
    const RESPONSE = await ticketApiClient.post<WorkflowItem[]>('get_workflow', {})

    return RESPONSE.data
  } catch (error: any) {
    console.error('Error loading workflow list:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE = error.response.data?.message || 'Không thể tải danh sách dịch vụ'
      throw new Error(MESSAGE)
    }

    /** Xử lý lỗi network */
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Tạo form với form_data
 * @param form_data - Dữ liệu form (title, content, attachments)
 * @returns Promise chứa CreateFormResponse
 */
export async function createForm(form_data: FormData): Promise<CreateFormResponse> {
  try {
    /** Gọi API POST để tạo form */
    const RESPONSE = await ticketApiClient.post<CreateFormResponse>('create_form', {
      form_data,
    })

    return RESPONSE.data
  } catch (error: any) {
    console.error('Error creating form:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE = error.response.data?.message || 'Không thể tạo form'
      throw new Error(MESSAGE)
    }

    /** Xử lý lỗi network */
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Tạo ticket từ workflow_id và ticket_form_id
 * @param request - Request chứa workflow_id và ticket_form_id
 * @returns Promise chứa CreateTicketResponse
 */
export async function createTicket(request: CreateTicketRequest): Promise<CreateTicketResponse> {
  try {
    /** Gọi API POST để tạo ticket */
    const RESPONSE = await ticketApiClient.post<CreateTicketResponse>('create_ticket', request)

    return RESPONSE.data
  } catch (error: any) {
    console.error('Error creating ticket:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE = error.response.data?.message || 'Không thể tạo ticket'
      throw new Error(MESSAGE)
    }

    /** Xử lý lỗi network */
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Lấy chi tiết ticket theo ID
 * @param ticket_id - ID của ticket (UUID)
 * @returns Promise chứa TicketItem
 */
export async function getTicketDetail(ticket_id: string): Promise<TicketItem> {
  try {
    /** Gọi API POST để lấy danh sách ticket */
    const RESPONSE = await ticketApiClient.post<TicketItem[]>('get_ticket', {})

    /** Tìm ticket theo ID */
    const TICKET = RESPONSE.data.find((ticket) => ticket.id === ticket_id)

    if (!TICKET) {
      throw new Error('Không tìm thấy phản ánh')
    }

    return TICKET
  } catch (error: any) {
    console.error('Error loading ticket detail:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE = error.response.data?.message || 'Không thể tải chi tiết phản ánh'
      throw new Error(MESSAGE)
    }

    /** Xử lý lỗi không tìm thấy */
    if (error.message === 'Không tìm thấy phản ánh') {
      throw error
    }

    /** Xử lý lỗi network */
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Lấy danh sách comments theo ticket_id
 * @param ticket_id - ID của ticket (số)
 * @returns Promise chứa GetCommentResponse
 */
export async function getComments(ticket_id: number): Promise<GetCommentResponse> {
  try {
    /** Gọi API POST để lấy danh sách comments */
    const RESPONSE = await ticketApiClient.post<GetCommentResponse>('get_comment', {
      ticket_id,
    })

    return RESPONSE.data
  } catch (error: any) {
    console.error('Error loading comments:', error)

    /** Xử lý lỗi từ response */
    if (error.response) {
      const STATUS = error.response.status
      const MESSAGE = error.response.data?.message || 'Không thể tải danh sách bình luận'
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
  WorkflowItem,
  FormData,
  CreateFormResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  GetCommentResponse,
  CommentItem,
  GetTicketRequest,
} from '@/types/ticket'
