/**
 * Ticket API client configuration
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/**
 * Base URL cho Ticket API từ env
 */
const TICKET_API_BASE_URL = import.meta.env.VITE_BASE_API_TICKET_URL

/**
 * Access Token fix cứng
 */
const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkNjUyOTU1LWM5NTAtNDdjYy05ZGQ4LTYzOWYyMmYwOTMzZSIsImlhdCI6MTc2NzY3MzA1NSwiZXhwIjoxNzcwMjY1MDU1fQ.a04b0uPiRScMJMVIxWMyawa6VXPqg0R6lmoPrBBhAsw'

/**
 * Tạo axios instance cho Ticket API
 */
export const ticketApiClient: AxiosInstance = axios.create({
  baseURL: TICKET_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor: Đảm bảo access token luôn được thêm vào header
 */
ticketApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // API yêu cầu header tên là "access-token" thay vì "Authorization"
    if (!config.headers['access-token']) {
      config.headers['access-token'] = ACCESS_TOKEN
    }

    // Đảm bảo Content-Type header được set
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    // Xử lý lỗi request
    return Promise.reject(error)
  },
)
