/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CDN_BASE_URL: string
  readonly VITE_SUPPORT_PHONE: string
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_ZALO_OA_URL: string
  readonly VITE_CHAT_IFRAME_URL: string
  readonly VITE_CHAT_PAGE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-toastify' {
  import { Plugin } from 'vue'

  export interface ToastContainerOptions {
    autoClose?: number
    position?:
      | 'top-right'
      | 'top-left'
      | 'top-center'
      | 'bottom-right'
      | 'bottom-left'
      | 'bottom-center'
    [key: string]: any
  }

  export const toast: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
  }

  const Vue3Toastify: Plugin
  export default Vue3Toastify
}
