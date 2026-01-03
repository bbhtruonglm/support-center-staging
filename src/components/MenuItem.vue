<template>
  <component
    :is="component_tag"
    :href="href_link"
    :to="to"
    @click="handleClick"
    :class="[
      'flex items-center justify-between w-full py-2 border-b border-gray-200 last:border-0 text-left cursor-pointer',
      is_loading && 'opacity-50 cursor-not-allowed pointer-events-none',
    ]"
  >
    <div class="flex items-center gap-3">
      <img v-if="icon" :src="icon" alt="Icon" class="w-8 h-8 object-contain" />
      <div class="flex flex-col items-start gap-0.5">
        <span class="text-sm font-medium">{{ title }}</span>
        <span v-if="subtitle" class="text-xs">
          {{ subtitle }}
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <slot name="right-icon" />
      <Loader2 v-if="is_loading" :size="20" class="text-slate-900 animate-spin" :stroke-width="2" />
      <ChevronRight v-else :size="20" class="text-slate-900" :stroke-width="2" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronRight, Loader2 } from 'lucide-vue-next'

/** Interface cho props */
interface IProps {
  /** Icon hiển thị bên trái */
  icon?: string
  /** Tiêu đề chính */
  title: string
  /** Tiêu đề phụ bên dưới */
  subtitle?: string
  /** Loại item: số điện thoại, email hoặc nút thường */
  type?: 'tel' | 'email' | 'button'
  /** Đường dẫn URL ngoài */
  url?: string
  /** Đường dẫn internal router */
  to?: string | object
}

/** Khai báo props đầu vào */
const props = defineProps<IProps>()

/** Trạng thái loading
 * Dùng để chặn click liên tục và hiển thị icon loading
 */
const is_loading = ref<boolean>(false)

/** Thời gian delay giữa các lần click (ms) */
const CLICK_DELAY = 500

/**
 * Xử lý click với delay
 * Chặn người dùng spam click bằng cách thêm delay
 * @param e - Sự kiện click
 */
const handleClick = (e: Event) => {
  // Kiểm tra nếu đang trong trạng thái loading (đã click trước đó)
  if (is_loading.value) {
    // Ngăn chặn hành vi mặc định của thẻ (ví dụ redirect)
    e.preventDefault()
    // Ngăn chặn sự kiện nổi bọt
    e.stopPropagation()
    // Dừng hàm tại đây
    return
  }

  // Nếu chưa loading, set trạng thái thành true để bắt đầu xử lý
  is_loading.value = true

  // Thiết lập timeout để reset trạng thái loading về false
  setTimeout(() => {
    is_loading.value = false
  }, CLICK_DELAY) // Sau khoảng thời gian CLICK_DELAY (500ms)
}

/**
 * Xác định thẻ HTML hoặc Component để render
 * Dựa vào props truyền vào để quyết định là thẻ a, button hay RouterLink
 */
const component_tag = computed<string>(() => {
  // Nếu có prop 'to', đây là link nội bộ -> dùng RouterLink
  if (props.to) return 'RouterLink'

  // Nếu là loại 'tel', 'email' hoặc có 'url' ngoài -> dùng thẻ a
  if (props.type === 'tel' || props.type === 'email' || props.url) return 'a'

  // Mặc định trả về thẻ button
  return 'button'
})

/**
 * Tạo đường dẫn href cho thẻ a
 * Xử lý logic tạo chuỗi href dựa trên loại (tel, email) hoặc url
 */
const href_link = computed<string | undefined>(() => {
  // Nếu có url cụ thể, trả về url đó
  if (props.url) return props.url

  // Nếu loại là email, format theo chuẩn mailto:
  if (props.type === 'email') return `mailto:${props.title}`

  // Nếu loại là tel, format theo chuẩn tel:
  // Đồng thời dùng regex loại bỏ các ký tự không phải số (trừ dấu +)
  if (props.type === 'tel') return `tel:${props?.title?.replace(/[^\d+]/g, '')}`

  // Các trường hợp còn lại không cần href
  return undefined
})
</script>
