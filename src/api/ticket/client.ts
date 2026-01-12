/** Ticket API client configuration */
// Import axios và các types từ axios
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/** Constant định nghĩa base URL cho Ticket API từ env */
const TICKET_API_BASE_URL = import.meta.env.VITE_BASE_API_TICKET_URL

/** Constant định nghĩa base URL cho Chatbox API để lấy merchant token từ env */
const CHATBOX_API_BASE_URL =
  'https://chatbox-api.34.142.177.104.sslip.io/v1/n4_service' ||
  import.meta.env.VITE_CHATBOX_API_URL ||
  'https://chatbox-service-v3.botbanhang.vn'

/**
 * Interface định nghĩa response từ API get_merchant_token
 * API trả về flat object chứa customer_token
 */
interface MerchantTokenResponse {
  /** Token của customer (quan trọng nhất) */
  customer_token?: string

  // Các field khác (để debug hoặc fallback)
  id?: string
  identifier_id?: string
}

/**
 * Function: Lấy token_user từ localStorage
 * Token này được lưu từ URL query params khi vào app (Main Menu)
 * @returns Token string hoặc null nếu không có
 */
function getTokenUserFromStorage(): string | null {
  try {
    // Lấy token_user từ localStorage (được lưu ở MainMenu.vue)
    return localStorage.getItem('token_user')
  } catch (error) {
    console.error('Error getting token_user from localStorage:', error)
    return null
  }
}

/**
 * Function: Lấy merchant token
 * Logic:
 * 1. Kiểm tra trong localStorage xem có merchant_token chưa
 * 2. Nếu có -> return luôn
 * 3. Nếu chưa -> Gọi API lấy -> Lưu vào localStorage -> return
 * @returns Promise chứa merchant token string
 */
export async function getMerchantToken(): Promise<string> {
  try {
    // 1. Kiểm tra localStorage trước
    const STORED_TOKEN = localStorage.getItem('merchant_token')
    if (STORED_TOKEN) {
      return STORED_TOKEN
    }

    // 2. Nếu chưa có, tiến hành gọi API
    const TOKEN_USER = getTokenUserFromStorage()

    if (!TOKEN_USER) {
      throw new Error('Missing token_user in localStorage')
    }

    // Gọi API lấy merchant token
    const RESPONSE = await axios.post<MerchantTokenResponse>(
      `${CHATBOX_API_BASE_URL}/app/chatbot_user/get_merchant_token`,
      {}, // Body rỗng
      {
        headers: {
          // Header Authorization chứa token_user
          Authorization: TOKEN_USER,
          Accept: 'application/json, text/plain, */*',
        },
      },
    )

    // Lấy customer_token từ nested data object của response
    const RESPONSE_DATA = RESPONSE.data as any
    const TOKEN = RESPONSE_DATA?.data?.customer_token || RESPONSE_DATA?.customer_token
    const IDENTIFIER_ID = RESPONSE_DATA?.data?.identifier_id || RESPONSE_DATA?.identifier_id

    if (!TOKEN) {
      throw new Error('API response missing customer_token')
    }

    // 3. Lưu vào localStorage để dùng cho các request sau
    localStorage.setItem('merchant_token', TOKEN)
    if (IDENTIFIER_ID) {
      localStorage.setItem('identifier_id', IDENTIFIER_ID)
    }

    return TOKEN
  } catch (error: any) {
    console.error('Error fetching merchant token:', error)
    throw error
  }
}

/**
 * Function: Clear stored merchant token
 * Sử dụng khi cần force refresh token (ví dụ logout hoặc hết hạn)
 */
export function clearMerchantToken(): void {
  localStorage.removeItem('merchant_token')
  localStorage.removeItem('identifier_id')
}

/** Export axios instance cho Ticket API */
export const ticketApiClient: AxiosInstance = axios.create({
  baseURL: TICKET_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Request interceptor: Inject merchant token vào header */
ticketApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Nếu chưa có header access-token thì mới inject
    if (!config.headers['access-token']) {
      try {
        const TOKEN = await getMerchantToken()
        config.headers['access-token'] = TOKEN
      } catch (error) {
        console.error('Failed to inject merchant token:', error)
        // Vẫn cho request đi tiếp để server trả 401 nếu cần
      }
    }

    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
