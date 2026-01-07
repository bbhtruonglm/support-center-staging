<template>
  <iframe
    ref="iframe_ref"
    v-if="url"
    :src="url"
    class="w-full h-full md:max-w-sm"
    :title="t('chat.embeddedContent')"
    sandbox="allow-scripts allow-same-origin allow-popups"
    @load="OnIframeLoad"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

/** Chat iframe URL từ env */
const CHAT_IFRAME_URL = import.meta.env.VITE_CHAT_IFRAME_URL

/** Chat page ID từ env */
const CHAT_PAGE_ID = import.meta.env.VITE_CHAT_PAGE_ID

/** i18n */
const { t, locale } = useI18n()

/** link iframe */
const url = ref('')

/** reference tới iframe */
const iframe_ref = ref<HTMLIFrameElement | null>(null)

/** cờ check iframe đã ready chưa */
const is_iframe_ready = ref(false)

/** id page từ env */
const page_id = ref(CHAT_PAGE_ID)

onMounted(() => {
  // validate page_id
  if (!page_id.value || !/^[a-zA-Z0-9_-]+$/.test(page_id.value)) {
    console.log('PAGE_ID khong hop le')
  }

  /** Lấy locale từ i18n (đã được setup với fallback logic) */
  const CURRENT_LOCALE = locale.value

  /** IFRAME SOURCE với */
  url.value = `${CHAT_IFRAME_URL}/view-screen/?page_id=${page_id.value}&locale=${CURRENT_LOCALE}`

  /** Xử lý sự kiện message */
  window.addEventListener('message', handleMessageEvent)
})

onUnmounted(() => {
  /** Xóa sự kiện message */
  window.removeEventListener('message', handleMessageEvent)
})

/** xử lý khi iframe load xong */
function OnIframeLoad() {
  // console.log('[BRIDGE] Iframe loaded (native @load event)')

  /** đợi thêm 1 giây để JS trong iframe khởi tạo xong */
  setTimeout(() => {
    is_iframe_ready.value = true
  }, 1000)
}

/** forward message vào iframe */
function ForwardToIframe(payload: any) {
  /** Lấy thông tin user */
  const USER_INFO = {
    user_name: localStorage.getItem('user_name'),
    user_phone: localStorage.getItem('user_phone'),
    user_email: localStorage.getItem('user_email'),
    client_id: localStorage.getItem('client_id'),
    page_id: page_id.value,
  }

  /** Loại bỏ các giá trị null/undefined khỏi USER_INFO */
  const CLEAN_USER_INFO = Object.fromEntries(
    Object.entries(USER_INFO).filter(([_, v]) => v != null),
  )

  /** đổi from thành 'parent-app' & kèm thông tin user */
  const FORWARD_PAYLOAD = {
    ...CLEAN_USER_INFO, // Storage base
    ...payload, // Payload overrides storage
    page_id: page_id.value, // Always include page_id
    from: 'parent-app',
  }
  // post message
  iframe_ref.value?.contentWindow?.postMessage(FORWARD_PAYLOAD, CHAT_IFRAME_URL)
  // console.log('[BRIDGE] Forwarded to iframe:', FORWARD_PAYLOAD)
}

/** hàm xử lý sự kiện message */
function handleMessageEvent(event: MessageEvent) {
  // Khai báo payload
  let payload: any
  // console.log('[BRIDGE] Received message:', event.data)

  // Parse payload an toàn
  try {
    payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
  } catch (e) {
    return
  }

  /**
   * 🆕 Handle IFRAME_READY from Chatbot Iframe
   * Khi iframe load xong sẽ bắn message này ra -> Gửi data user vào
   */
  if (payload?.from === 'IFRAME_CHATBOT' && payload?.type === 'IFRAME_READY') {
    // console.log('[BRIDGE] Received IFRAME_READY from Iframe')
    is_iframe_ready.value = true
    ForwardToIframe({})
    return
  }

  /**
   * LOGIC:
   * 1. Iframe load xong -> gửi postMessage 'READY' kèm 'key'
   * 2. Parent nhận 'READY' -> kiểm tra localStorage theo 'key'
   * 3. Nếu có data -> gửi lại cho Iframe (type: 'CLIENT_ID')
   */
  if (payload?.status === 'READY') {
    // console.log('[BRIDGE] Iframe is READY')
    // đánh dấu iframe đã ready
    is_iframe_ready.value = true

    /** Lấy thông tin cố định từ localStorage theo yêu cầu */
    const DATA_SEND = {
      user_name: localStorage.getItem('user_name'),
      user_phone: localStorage.getItem('user_phone'),
      user_email: localStorage.getItem('user_email'),
      client_id: localStorage.getItem('client_id'),
      page_id: page_id.value,
    }

    // console.log('Sending INFO to iframe:', DATA_SEND)

    if (iframe_ref.value?.contentWindow) {
      iframe_ref.value.contentWindow.postMessage(
        {
          from: 'RETION_EMBED',
          type: 'CLIENT_ID',
          data_embed_chat: JSON.stringify(DATA_SEND),
        },
        CHAT_IFRAME_URL,
      )
    }
  }

  /** Logic lưu ngược lại từ Iframe vào localStorage (nếu cần) */
  if (payload?.from === 'BBH-EMBED-IFRAME' && payload.type === 'CLIENT_ID') {
    // console.log('[BRIDGE] Iframe confirmed ready via BBH-EMBED-IFRAME')

    /** đánh dấu iframe đã ready */
    is_iframe_ready.value = true

    localStorage.setItem(`${payload.key}`, JSON.stringify(payload.data_embed_chat))

    // console.log('[SDK] Saved:', payload.data_embed_chat)
  }
}
</script>
