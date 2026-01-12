/**
 * Types và interfaces cho Ticket API
 */

/**
 * Interface định nghĩa workflow action
 */
export interface WorkflowAction {
  /** Stage của action */
  stage?: string

  /** Tiêu đề action */
  title?: string

  /** Mô tả action */
  description?: string

  /** ID nhân viên */
  employee_id?: string

  /** ID phòng ban */
  department_id?: string
}

/**
 * Interface định nghĩa workflow data
 */
export interface WorkflowData {
  /** Trạng thái active */
  active?: boolean

  /** Danh sách actions */
  actions?: WorkflowAction[]

  /** Deadline timestamp */
  deadline?: number

  /** Trạng thái confirmed */
  confirmed?: boolean

  /** Thời gian giới hạn */
  time_limit?: number
}

/**
 * Interface định nghĩa contact info
 */
export interface ContactInfo {
  /** ID contact */
  id?: string

  /** Avatar URL */
  avatar?: string

  /** Họ */
  last_name?: string

  /** Tên */
  first_name?: string

  /** Identifier ID */
  identifier_id?: string
}

/**
 * Interface định nghĩa department
 */
export interface Department {
  /** ID department */
  id?: string

  /** MongoDB ID */
  _id?: string

  /** Tên department */
  name?: string

  /** Type */
  type?: string

  /** Archive status */
  archive?: boolean

  /** User ID */
  user_id?: string

  /** Branch ID */
  branch_id?: string

  /** Created at */
  createdAt?: string

  /** Updated at */
  updatedAt?: string

  /** Business ID */
  business_id?: string

  /** Can archive flag */
  can_archive?: boolean
}

/**
 * Interface định nghĩa employee info
 */
export interface EmployeeInfo {
  /** Avatar URL */
  avatar?: string

  /** Thông tin trụ sở */
  branch?: Branch

  /** Họ */
  last_name?: string

  /** Tên */
  first_name?: string

  /** Thông tin phòng ban */
  department?: Department | string

  /** Vị trí/chức vụ */
  position?: string
}

/**
 * Interface định nghĩa comment
 */
export interface TicketComment {
  /** ID comment */
  id?: string

  /** Scope */
  scope?: string

  /** Type */
  type?: string

  /** Ticket ID */
  ticket_id?: number

  /** Nội dung comment */
  content?: string

  /** Danh sách attachments */
  attachments?: any[]

  /** Contact ID */
  contact_id?: string

  /** Contact info */
  contact_info?: ContactInfo | null

  /** Employee info */
  employee_info?: EmployeeInfo | null

  /** Business ID */
  business_id?: string

  /** Branch ID */
  branch_id?: string

  /** Department ID */
  department_id?: string | null

  /** Team ID */
  team_id?: string | null

  /** Employee ID */
  employee_id?: string | null

  /** User ID */
  user_id?: string | null

  /** Thời gian tạo */
  created_at?: string

  /** Thời gian cập nhật */
  updated_at?: string

  /** Thông tin trụ sở */
  branch?: Branch
}

/**
 * Stage type từ API
 */
export type TicketStage = 'OPEN' | 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED' | 'REOPEN'

/**
 * Interface định nghĩa Ticket item từ API
 */
export interface TicketItem {
  /** ID ticket */
  id?: string

  /** Ticket ID số */
  ticket_id?: number

  /** Contact ID */
  contact_id?: string

  /** Contact info */
  contact_info?: ContactInfo | null

  /** Ticket form ID */
  ticket_form_id?: string

  /** Scope */
  scope?: string

  /** Stage hiện tại */
  stage?: TicketStage

  /** Tiêu đề ticket */
  title?: string | null

  /** Nội dung ticket */
  content?: string | null

  /** App request */
  app_request?: any | null

  /** Requester ID */
  requester_id?: string | null

  /** Requester name */
  requester_name?: string | null

  /** Requester email */
  requester_email?: string | null

  /** Requester phone */
  requester_phone?: string | null

  /** Assignee type */
  assignee_type?: string | null

  /** Assignee ID */
  assignee_id?: string | null

  /** Labels */
  labels?: any | null

  /** Workflow ID */
  workflow_id?: number

  /** Workflow data */
  workflow_data?: WorkflowData[]

  /** Category ID */
  category_id?: number

  /** Internal note */
  internal_note?: string | null

  /** Source */
  source?: string | null

  /** Page name */
  page_name?: string | null

  /** Attachments */
  attachments?: any | null

  /** Total comments */
  total_comments?: number | null

  /** Warning time */
  warning_time?: number | null

  /** Location */
  location?: string | null

  /** Link */
  link?: string

  /** Priority */
  priority?: string

  /** Response time */
  response_time?: string

  /** Resolution time */
  resolution_time?: string

  /** Customer rating */
  customer_rating?: number | null

  /** Current rating */
  current_rating?: number | null

  /** Reopen stage */
  reopen_stage?: string

  /** Notify department */
  notify_department?: string

  /** Notify overdue department */
  notify_overdue_department?: string

  /** Notify overdue time */
  notify_overdue_time?: number

  /** Notify customer method */
  notify_customer_method?: string

  /** Trigger app */
  trigger_app?: string | null

  /** Trigger app module */
  trigger_app_module?: string | null

  /** Trigger app ID */
  trigger_app_id?: string | null

  /** Timeboxing ID */
  timeboxing_id?: string | null

  /** Business ID */
  business_id?: string

  /** Branch ID */
  branch_id?: string

  /** Department ID */
  department_id?: string | null

  /** Team ID */
  team_id?: string | null

  /** Employee ID */
  employee_id?: string | null

  /** User ID */
  user_id?: string | null

  /** Archived */
  archived?: boolean

  /** Meta data */
  meta_data?: any | null

  /** Thời gian tạo */
  created_at?: string

  /** Thời gian cập nhật */
  updated_at?: string

  /** Danh sách comments */
  comments?: TicketComment[]
  /** Ticket form info */
  ticket_form_info?: TicketFormInfo
}

/**
 * Interface định nghĩa feedback item cho component
 */
export interface FeedbackItem {
  /** ID ticket (UUID) */
  id?: string

  /** Tiêu đề feedback */
  title?: string

  /** Ngày tạo feedback */
  date?: string

  /** Trạng thái feedback */
  status?: 'pending' | 'processing' | 'completed'

  /** Nội dung feedback */
  content?: string
}

/**
 * Tab key type
 */
export type TabKey = 'all' | 'pending' | 'processing' | 'completed'

/**
 * Interface định nghĩa request để lấy danh sách ticket
 */
export interface GetTicketRequest {
  /** Số lượng bản ghi bỏ qua (skip) */
  skip?: number

  /** Số lượng bản ghi lấy (take) */
  take?: number

  /** Danh sách stage để filter */
  stage?: TicketStage[]
}

/**
 * Interface định nghĩa workflow item từ API get_workflow
 */
export interface WorkflowItem {
  /** ID workflow */
  id?: string

  /** Tên workflow */
  name?: string

  /** Mô tả workflow */
  description?: string

  /** Workflow ID số */
  workflow_id?: number
}

/**
 * Interface định nghĩa form data để tạo form
 */
export interface FormData {
  /** Tiêu đề */
  title?: string

  /** Nội dung */
  content?: string

  /** Danh sách attachments */
  attachments?: string[]
}

/**
 * Interface định nghĩa response từ API create_form
 */
export interface CreateFormResponse {
  /** ID form */
  id?: string

  /** Scope */
  scope?: string | null

  /** Form data */
  form_data?: FormData

  /** Contact ID */
  contact_id?: string

  /** Business ID */
  business_id?: string

  /** Branch ID */
  branch_id?: string

  /** Department ID */
  department_id?: string | null

  /** Team ID */
  team_id?: string | null

  /** Employee ID */
  employee_id?: string | null

  /** User ID */
  user_id?: string | null

  /** Thời gian tạo */
  created_at?: string

  /** Thời gian cập nhật */
  updated_at?: string
}

/**
 * Interface định nghĩa request để tạo ticket
 */
export interface CreateTicketRequest {
  /** Workflow ID */
  workflow_id?: number

  /** Ticket form ID */
  ticket_form_id?: string
}

/**
 * Interface định nghĩa ticket form info trong response create_ticket
 */
export interface TicketFormInfo {
  /** ID form */
  id?: string

  /** Scope */
  scope?: string | null

  /** Form data */
  form_data?: {
    /** Tiêu đề */
    title?: string

    /** Nội dung */
    content?: string

    /** Danh sách attachments */
    attachments?: string[]
  }

  /** Contact ID */
  contact_id?: string

  /** Business ID */
  business_id?: string

  /** Branch ID */
  branch_id?: string

  /** Department ID */
  department_id?: string | null

  /** Team ID */
  team_id?: string | null

  /** Employee ID */
  employee_id?: string | null

  /** User ID */
  user_id?: string | null

  /** Thời gian tạo */
  created_at?: string

  /** Thời gian cập nhật */
  updated_at?: string
}

/**
 * Interface định nghĩa response từ API create_ticket
 */
export interface CreateTicketResponse extends TicketItem {
  /** Ticket form info */
  ticket_form_info?: TicketFormInfo
}

/**
 * Interface định nghĩa response từ API get_comment
 */
export interface GetCommentResponse {
  /** Tổng số comments */
  total_comments?: number

  /** Tổng số trang */
  total_page?: number

  /** Danh sách comments */
  comments?: TicketComment[]
}

/**
 * Interface định nghĩa comment item cho UI
 */
export interface CommentItem {
  /** ID comment */
  id?: string

  /** Tên người comment */
  name?: string

  /** Vị trí/chức vụ */
  position?: string

  /** Avatar URL */
  avatar?: string

  /** Nội dung comment */
  content?: string

  /** Ngày comment */
  date?: string

  /** Có in đậm tên không */
  is_bold?: boolean

  /** Danh sách attachments (URL ảnh) */
  attachments?: string[]

  /** thông tin trụ sở */
  branch?: Branch
}

/**
 * Interface định nghĩa branch
 */
export interface Branch {
  /** ID trụ sở */
  id?: string

  /** MongoDB ID */
  _id?: string

  /** Tên trụ sở */
  name?: string
}

/**
 * Interface định nghĩa request để tạo comment
 */
export interface CreateCommentRequest {
  /** Ticket ID (số) */
  ticket_id?: number

  /** Nội dung comment */
  content?: string
}

/**
 * Interface định nghĩa response từ API create_comment
 */
export interface CreateCommentResponse extends TicketComment {}

/**
 * Interface định nghĩa response từ API count_ticket
 */
export interface CountTicketResponse {
  /** Số lượng ticket đang xử lý */
  processing?: number
}

/**
 * Interface định nghĩa response từ API customer/upload_file
 */
export interface UploadFileResponse {
  /** URL của file đã upload */
  url?: string
}
