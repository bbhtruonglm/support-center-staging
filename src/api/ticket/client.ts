/** Ticket API client configuration */
// Import axios và các types từ axios
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/** Constant định nghĩa base URL cho Ticket API từ env */
const TICKET_API_BASE_URL = import.meta.env.VITE_BASE_API_TICKET_URL

/** Constant định nghĩa access token fix cứng */
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkNjUyOTU1LWM5NTAtNDdjYy05ZGQ4LTYzOWYyMmYwOTMzZSIsImlhdCI6MTc2NzY3MzA1NSwiZXhwIjoxNzcwMjY1MDU1fQ.a04b0uPiRScMJMVIxWMyawa6VXPqg0R6lmoPrBBhAsw'

/** Export axios instance cho Ticket API */
export const ticketApiClient: AxiosInstance = axios.create({
  // Set base URL từ constant
  baseURL: TICKET_API_BASE_URL,
  // Set timeout là 30 giây
  timeout: 30000,
  // Set default headers
  headers: {
    // Set Content-Type là application/json
    'Content-Type': 'application/json',
  },
})

/** Request interceptor: Đảm bảo access token luôn được thêm vào header */
ticketApiClient.interceptors.request.use(
  // Success callback khi request được gửi
  (config: InternalAxiosRequestConfig) => {
    // Kiểm tra nếu chưa có access-token header
    if (!config.headers['access-token']) {
      // Thêm access-token vào header với giá trị từ constant
      config.headers['access-token'] = ACCESS_TOKEN
    }

    // Kiểm tra nếu chưa có Content-Type header
    if (!config.headers['Content-Type']) {
      // Set Content-Type là application/json
      config.headers['Content-Type'] = 'application/json'
    }

    // Trả về config đã được chỉnh sửa
    return config
  },
  // Error callback khi request bị lỗi
  (error) => {
    // Reject promise với error
    return Promise.reject(error)
  },
)
