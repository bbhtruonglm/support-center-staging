/** Composable để sử dụng API context trong Vue components */
// Import các reactive functions từ Vue
import { computed, ref, watch } from 'vue'
// Import router hook để lấy route query
import { useRoute } from 'vue-router'

/** Interface định nghĩa client context */
export interface ClientContext {
  /** Mã client ID từ query parameter */
  client_id: string | null

  /** Tên người dùng đã được decode */
  user_name: string | null

  /** Locale hiện tại (vi hoặc en) */
  locale: string
}

/**
 * Lấy giá trị từ URL query params hoặc localStorage
 * Ưu tiên URL query params, fallback về localStorage
 * @param key - Key cần lấy
 * @returns Giá trị string hoặc null
 */
function getParamValue(key: string): string | null {
  /** URL search params từ window location */
  const URL_PARAMS = new URLSearchParams(window.location.search)

  /** Lấy từ URL query params trước */
  const URL_VALUE = URL_PARAMS.get(key)

  // Nếu có trong URL thì trả về luôn
  if (URL_VALUE) {
    return URL_VALUE
  }

  // Nếu không có trong URL thì lấy từ localStorage
  try {
    /** Lấy giá trị từ localStorage */
    const STORAGE_VALUE = localStorage.getItem(key)
    // Trả về giá trị từ localStorage
    return STORAGE_VALUE
  } catch (e) {
    // Log error nếu localStorage không khả dụng
    console.error(`Error reading localStorage for key "${key}":`, e)
    // Trả về null nếu có lỗi
    return null
  }
}

/**
 * Lấy client context từ query parameters của URL hoặc localStorage
 * Ưu tiên đọc từ URL, fallback về localStorage
 * @returns ClientContext object chứa thông tin đã được parse
 */
function getClientContext(): ClientContext {
  /** Lấy client_id từ URL hoặc localStorage */
  const CLIENT_ID = getParamValue('client_id')

  /** Lấy user_name từ URL hoặc localStorage (chưa decode) */
  const USER_NAME_RAW = getParamValue('user_name')
  /** Decode user_name nếu có, nếu không thì null */
  const USER_NAME = USER_NAME_RAW ? decodeURIComponent(USER_NAME_RAW) : null

  /** Lấy locale từ URL hoặc localStorage (chưa xử lý) */
  const LOCALE_RAW = getParamValue('locale')
  /** Xác định locale: nếu là 'en' thì 'en', còn lại thì 'vi' */
  const LOCALE = LOCALE_RAW === 'en' ? 'en' : 'vi'

  // Trả về ClientContext object
  return {
    // Client ID đã được lấy
    client_id: CLIENT_ID,
    // User name đã được decode
    user_name: USER_NAME,
    // Locale đã được xác định
    locale: LOCALE,
  }
}

/**
 * Composable trả về API context và các computed properties
 * @returns Object chứa context và các helper functions
 */
export function useApiContext() {
  /** Vue router instance */
  const route = useRoute()

  /** Client context được lấy từ query params */
  const context = ref<ClientContext>(getClientContext())

  // Watch route query để update context khi URL thay đổi
  watch(
    // Theo dõi sự thay đổi của route.query
    () => route.query,
    // Callback chạy khi query thay đổi
    () => {
      // Cập nhật context từ URL hiện tại
      context.value = getClientContext()
    },
    // Options với deep: true để theo dõi nested properties
    { deep: true },
  )

  /**
   * Computed property kiểm tra context có hợp lệ không
   * Context hợp lệ khi có client_id
   */
  const is_valid = computed(() => {
    // Trả về true nếu có client_id, false nếu không
    return !!context.value.client_id
  })

  /**
   * Computed property lấy client_id
   */
  const client_id = computed(() => {
    // Trả về client_id từ context
    return context.value.client_id
  })

  /**
   * Computed property lấy user_name đã decode
   */
  const user_name = computed(() => {
    // Trả về user_name từ context
    return context.value.user_name
  })

  /**
   * Computed property lấy locale hiện tại
   */
  const locale = computed(() => {
    // Trả về locale từ context
    return context.value.locale
  })

  /**
   * Function để refresh context từ URL hiện tại
   */
  function refreshContext() {
    // Cập nhật context từ URL hiện tại
    context.value = getClientContext()
  }

  // Trả về object chứa context và các helper functions
  return {
    // Client context object
    context,

    // Flag kiểm tra context hợp lệ
    is_valid,

    // Client ID từ query params
    client_id,

    // User name đã decode
    user_name,

    // Locale hiện tại
    locale,

    // Function refresh context
    refreshContext,
  }
}

