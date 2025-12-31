<template>
  <iframe
    ref="iframe_ref"
    v-if="url"
    :src="url"
    className="w-dvw h-dvh sm:max-w-sm"
    title="Embedded Content"
    sandbox="allow-scripts allow-same-origin allow-popups"
    @load="OnIframeLoad"
  />
</template>

<script setup lang="ts">
// import type { IEnv } from '@/interfaces'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

/** router */
const route = useRoute()

/** link iframe */
const url = ref('')

/** reference tới iframe */
const iframe_ref = ref<HTMLIFrameElement | null>(null)

/** cờ check iframe đã ready chưa */
const is_iframe_ready = ref(false)

/** queue lưu các message từ mobile khi iframe chưa ready */
const pending_messages = ref<any[]>([])

onMounted(() => {
  /** Đường dẫn host của merchant */
  //   const $HOST: IEnv = ENV[import.meta.env.VITE_APP_ENV || 'development']

  /** id page */
  const ID = route.params.id as string

  /** Validate ID */
  if (!ID || !/^[a-zA-Z0-9_-]+$/.test(ID)) {
    console.log('ID khong hop le')
  }

  /** Iframe URL */
  const IFRAME_URL = 'https://chatbox-embed-ui.botbanhang.vn'

  /** IFRAME SOURCE */
  url.value = `${IFRAME_URL}/view-screen?page_id=${encodeURIComponent('493168686296126')}`
  // url.value = `http://192.168.1.19:5174/view-screen?page_id=${encodeURIComponent(
  //   ID,
  // )}`

  /** Xử lý sự kiện message */
  window.addEventListener('message', handleMessageEvent)
})

onUnmounted(() => {
  /** Xóa sự kiện message */
  window.removeEventListener('message', handleMessageEvent)
})

/** xử lý khi iframe load xong */
function OnIframeLoad() {
  console.log('[BRIDGE] Iframe loaded (native @load event)')

  /** đợi thêm 1 giây để JS trong iframe khởi tạo xong */
  setTimeout(() => {
    console.log('[BRIDGE] Delayed flush after 1s')

    /** đánh dấu iframe đã ready */
    is_iframe_ready.value = true

    /** flush tất cả pending messages */
    FlushPendingMessages()
  }, 1000)
}

/** forward message vào iframe */
function ForwardToIframe(payload: any) {
  /** đổi from thành 'parent-app' khi forward */
  const FORWARD_PAYLOAD = { ...payload, from: 'parent-app' }

  iframe_ref.value?.contentWindow?.postMessage(
    FORWARD_PAYLOAD,
    '*', // production: IFRAME_ORIGIN
  )
  console.log('[BRIDGE] Forwarded to iframe:', FORWARD_PAYLOAD)
}

/** flush tất cả pending messages vào iframe */
function FlushPendingMessages() {
  if (pending_messages.value.length === 0) return

  console.log(`[BRIDGE] Flushing ${pending_messages.value.length} pending messages`)

  pending_messages.value.forEach((payload) => {
    ForwardToIframe(payload)
  })

  /** clear queue sau khi flush */
  pending_messages.value = []
}

/** hàm xử lý sự kiện message */
function handleMessageEvent(event: MessageEvent) {
  let PAYLOAD: any

  /** Parse payload an toàn */
  try {
    PAYLOAD = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
  } catch (e) {
    return
  }
  /** =================================================
   *  🆕 LOGIC BỔ SUNG – Native → forward iframe
   * ================================================= */

  /** Nhận postMessage từ mobile app và forward vào iframe */
  if (PAYLOAD?.from === 'parent-app') {
    console.log('[BRIDGE] Receive from Native:', PAYLOAD)

    /** chờ 3 giây để iframe load xong rồi mới forward */
    setTimeout(() => {
      console.log('[BRIDGE] Delayed forward after 3s')
      ForwardToIframe(PAYLOAD)
    }, 3000)
    return
  }
  /** =================================================
   *  LOGIC CŨ – GIỮ NGUYÊN (KHÔNG ĐỘNG)
   * ================================================= */

  if (PAYLOAD?.status === 'READY') {
    console.log('[BRIDGE] Iframe is READY')
    /** đánh dấu iframe đã ready */
    is_iframe_ready.value = true

    /** flush tất cả pending messages */
    FlushPendingMessages()

    const SAVED = localStorage.getItem(`${PAYLOAD.key}`)
    console.log('SAVED', SAVED)

    if (SAVED && iframe_ref.value?.contentWindow) {
      iframe_ref.value.contentWindow.postMessage(
        {
          from: 'RETION_EMBED',
          type: 'CLIENT_ID',
          data_embed_chat: SAVED,
        },
        '*', // production thì check domain
      )
    }
  }

  if (PAYLOAD?.from === 'BBH-EMBED-IFRAME' && PAYLOAD.type === 'CLIENT_ID') {
    console.log('[BRIDGE] Iframe confirmed ready via BBH-EMBED-IFRAME')

    /** đánh dấu iframe đã ready */
    if (!is_iframe_ready.value) {
      is_iframe_ready.value = true
      /** flush tất cả pending messages */
      FlushPendingMessages()
    }

    localStorage.setItem(`${PAYLOAD.key}`, JSON.stringify(PAYLOAD.data_embed_chat))

    console.log('[SDK] Saved:', PAYLOAD.data_embed_chat)
  }
}
</script>
