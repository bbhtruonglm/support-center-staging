/**
 * Composable để sử dụng API context trong Vue components
 */
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Interface định nghĩa client context
 */
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
    const STORAGE_VALUE = localStorage.getItem(key)
    return STORAGE_VALUE
  } catch (e) {
    // Nếu localStorage không khả dụng thì trả về null
    console.error(`Error reading localStorage for key "${key}":`, e)
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

  /** Lấy user_name từ URL hoặc localStorage và decode */
  const USER_NAME_RAW = getParamValue('user_name')
  const USER_NAME = USER_NAME_RAW ? decodeURIComponent(USER_NAME_RAW) : null

  /** Lấy locale từ URL hoặc localStorage, mặc định là 'vi' */
  const LOCALE_RAW = getParamValue('locale')
  const LOCALE = LOCALE_RAW === 'en' ? 'en' : 'vi'

  return {
    client_id: CLIENT_ID,
    user_name: USER_NAME,
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

  /**
   * Watch route query để update context khi URL thay đổi
   */
  watch(
    () => route.query,
    () => {
      context.value = getClientContext()
    },
    { deep: true },
  )

  /**
   * Computed property kiểm tra context có hợp lệ không
   * Context hợp lệ khi có client_id
   */
  const is_valid = computed(() => {
    return !!context.value.client_id
  })

  /**
   * Computed property lấy client_id
   */
  const client_id = computed(() => {
    return context.value.client_id
  })

  /**
   * Computed property lấy user_name đã decode
   */
  const user_name = computed(() => {
    return context.value.user_name
  })

  /**
   * Computed property lấy locale hiện tại
   */
  const locale = computed(() => {
    return context.value.locale
  })

  /**
   * Function để refresh context từ URL hiện tại
   */
  function refreshContext() {
    context.value = getClientContext()
  }

  return {
    /** Client context object */
    context,

    /** Flag kiểm tra context hợp lệ */
    is_valid,

    /** Client ID từ query params */
    client_id,

    /** User name đã decode */
    user_name,

    /** Locale hiện tại */
    locale,

    /** Function refresh context */
    refreshContext,
  }
}

