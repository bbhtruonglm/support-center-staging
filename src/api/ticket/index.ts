/** Ticket API - Main entry point */
// Import ticket API client
import { ticketApiClient } from './client'
// Import transform function để map tab sang stage filter
import { mapTabToStageFilter } from './transform'
// Import các types từ ticket types
import type {
  TicketItem,
  TabKey,
  WorkflowItem,
  FormData,
  CreateFormResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  GetCommentResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  GetTicketRequest,
  CountTicketResponse,
} from '@/types/ticket'

/**
 * API: Lấy danh sách ticket theo stage filter
 * @param tab_key - Key của tab để filter (optional)
 * @param skip - Số lượng bản ghi bỏ qua (mặc định 0)
 * @param take - Số lượng bản ghi lấy (mặc định 10)
 * @returns Promise chứa danh sách TicketItem
 */
export async function getTicketList(
  tab_key?: TabKey,
  skip: number = 0,
  take: number = 10,
): Promise<TicketItem[]> {
  try {
    /** Map tab key sang stage filter */
    const STAGE_FILTER = tab_key ? mapTabToStageFilter(tab_key) : undefined

    /** Tạo payload request */
    const PAYLOAD: GetTicketRequest = {
      skip,
      take,
    }

    // Chỉ thêm stage vào payload nếu có filter
    if (STAGE_FILTER && STAGE_FILTER.length > 0) {
      // Thêm stage filter vào payload
      PAYLOAD.stage = STAGE_FILTER
    }

    /** Gọi API POST để lấy danh sách ticket với filter */
    const RESPONSE = await ticketApiClient.post<TicketItem[]>('get_ticket', PAYLOAD)

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error loading ticket list:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tải danh sách phản ánh'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
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

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error loading workflow list:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tải danh sách dịch vụ'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
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

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error creating form:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tạo form'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
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

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error creating ticket:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tạo ticket'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
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

    /** Tìm ticket theo ID trong danh sách */
    const TICKET = RESPONSE.data.find((ticket) => ticket.id === ticket_id)

    // Nếu không tìm thấy ticket thì throw error
    if (!TICKET) {
      throw new Error('Không tìm thấy phản ánh')
    }

    // Trả về ticket đã tìm thấy
    return TICKET
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error loading ticket detail:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tải chi tiết phản ánh'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Xử lý lỗi không tìm thấy ticket
    if (error.message === 'Không tìm thấy phản ánh') {
      // Throw lại error không tìm thấy
      throw error
    }

    // Throw error network nếu không có response
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Lấy danh sách comments theo ticket_id và page
 * @param ticket_id - ID của ticket (số)
 * @param page - Số trang cần lấy (mặc định 1)
 * @returns Promise chứa GetCommentResponse
 */
export async function getComments(
  ticket_id: number,
  page: number = 1,
): Promise<GetCommentResponse> {
  try {
    /** Gọi API POST để lấy danh sách comments */
    const RESPONSE = await ticketApiClient.post<GetCommentResponse>('get_comment', {
      ticket_id,
      page,
    })

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error loading comments:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tải danh sách bình luận'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Tạo comment mới
 * @param request - Request chứa ticket_id và content
 * @returns Promise chứa CreateCommentResponse
 */
export async function createComment(request: CreateCommentRequest): Promise<CreateCommentResponse> {
  try {
    /** Gọi API POST để tạo comment */
    const RESPONSE = await ticketApiClient.post<CreateCommentResponse>('create_comment', request)

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error creating comment:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể gửi bình luận'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
    throw new Error('Không thể kết nối đến server')
  }
}

/**
 * API: Lấy số lượng ticket đang xử lý
 * @returns Promise chứa CountTicketResponse
 */
export async function getTicketCount(): Promise<CountTicketResponse> {
  try {
    /** Gọi API POST để lấy số lượng ticket */
    const RESPONSE = await ticketApiClient.post<CountTicketResponse>('/count_ticket', {})

    // Trả về data từ response
    return RESPONSE.data
  } catch (error: any) {
    // Log error ra console để debug
    console.error('Error loading ticket count:', error)

    // Xử lý lỗi từ response
    if (error.response) {
      /** Status code từ response */
      const STATUS = error.response.status
      /** Error message từ response hoặc message mặc định */
      const MESSAGE = error.response.data?.message || 'Không thể tải số lượng khiếu nại'
      // Throw error với message
      throw new Error(MESSAGE)
    }

    // Throw error network nếu không có response
    throw new Error('Không thể kết nối đến server')
  }
}

/** Export types để sử dụng ở các component */
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
  CreateCommentRequest,
  CreateCommentResponse,
  CommentItem,
  GetTicketRequest,
  CountTicketResponse,
} from '@/types/ticket'
