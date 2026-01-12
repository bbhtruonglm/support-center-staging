<template>
  <!-- Wrapper -->
  <div class="w-full h-full md:max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header -->
    <!-- <AppHeader /> -->
    <!-- Main Content -->
    <section class="p-3 flex flex-col text-black text-sm flex-1">
      <!-- Profile -->
      <section class="flex flex-col items-center gap-3">
        <div
          class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
        >
          <img :src="avatar_url" alt="Profile" class="w-full h-full object-contain" />
        </div>
        <h2 class="text-lg font-semibold">{{ t('mainMenu.greeting') }} {{ customer_name }}</h2>
      </section>
      <!-- Content -->
      <section class="py-3 flex flex-col gap-3 flex-1">
        <div class="flex flex-col gap-2.5">
          <!-- Customer ID -->
          <InfoCard>
            <div class="flex items-center justify-between">
              <div class="flex flex-col text-sm">
                <span class="font-medium text-blue-700">
                  {{ t('mainMenu.customerId') }}
                </span>
                <span class="font-medium">{{ customer_id }}</span>
              </div>
              <button
                @click="copyCustomerId"
                :disabled="is_copy_loading"
                :class="[
                  'hover:cursor-pointer',
                  is_copy_loading && 'opacity-50 cursor-not-allowed pointer-events-none',
                ]"
              >
                <Loader2
                  v-if="is_copy_loading"
                  :size="20"
                  class="text-blue-700 animate-spin"
                  :stroke-width="2"
                />
                <Copy v-else :size="20" class="text-blue-700" :stroke-width="2" />
              </button>
            </div>
          </InfoCard>

          <!-- Contact -->
          <InfoCard class="flex flex-col py-0 px-4" :title="t('mainMenu.contactUs')">
            <MenuItem
              :icon="PhoneIcon"
              :title="formatted_support_phone"
              :subtitle="t('mainMenu.supportHotline')"
              type="tel"
            />

            <MenuItem
              :icon="MailSmallIcon"
              :title="SUPPORT_EMAIL"
              :subtitle="t('mainMenu.supportEmail')"
              type="email"
            />

            <MenuItem
              :icon="bbhIcon"
              :title="t('mainMenu.chatWithUs')"
              :subtitle="t('mainMenu.chatInApp')"
              to="/embed-web-chat"
            />

            <MenuItem
              :icon="zaloIcon"
              :title="t('mainMenu.chatViaZalo')"
              :subtitle="t('mainMenu.chatViaZaloDesc')"
              :url="ZALO_OA_URL"
            />

            <MenuItem
              :icon="AlertIcon"
              :title="t('mainMenu.complaints')"
              :subtitle="t('mainMenu.complaintsDesc')"
              to="/feedback-list"
            >
              <template #right-icon>
                <div
                  v-if="ticket_count > 0"
                  class="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"
                >
                  <span class="text-xs font-medium text-white">{{ ticket_count }}</span>
                </div>
              </template>
            </MenuItem>
          </InfoCard>

          <!-- Specialists -->
          <!-- <InfoCard class="flex flex-col py-0 px-4" title="Chuyên viên riêng của quý khách">
            <MenuItem
              :icon="zaloIcon"
              title="Nguyễn Văn A"
              subtitle="Chat với Chuyên viên kinh doanh"
            />

            <MenuItem
              :icon="zaloIcon"
              title="Nguyễn Văn B"
              subtitle="Chat với Chuyên viên kỹ thuật"
            />
          </InfoCard> -->
        </div>
        <!-- Footer -->
        <section class="flex flex-col gap-2 mt-auto">
          <div class="flex flex-col items-center gap-2">
            <div class="w-24 h-24">
              <img :src="mailIcon" alt="Mail" class="w-full h-full object-contain" />
            </div>
            <p class="text-xs text-slate-500 text-center px-4">
              {{ t('mainMenu.footerMessage') }}
            </p>
          </div>
          <!-- <div class="flex gap-3 px-8">
            <button
              class="flex-1 flex items-center justify-center gap-2 p-2 bg-stone-500 rounded-lg"
            >
              <AlertCircle :size="20" class="text-white" :stroke-width="2" />
              <span class="text-sm font-medium text-white"> Phản ánh </span>
            </button>
            <button
              class="flex-1 flex items-center justify-center gap-2 p-2 bg-green-500 rounded-lg"
            >
              <CheckCircle :size="20" class="text-white" :stroke-width="2" />
              <span class="text-sm font-medium text-white"> Thư cảm ơn </span>
            </button>
          </div> -->
        </section>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
// H1: import runtime functions
// Import các reactive functions từ Vue
import { computed, onMounted, ref } from 'vue'
// Import router hook để lấy route params
import { useRoute } from 'vue-router'
// Import i18n hook để sử dụng translation function
import { useI18n } from 'vue-i18n'

// H2: import components
// Import component InfoCard để hiển thị thông tin
import InfoCard from '@/components/InfoCard.vue'
// Import component MenuItem để hiển thị menu item
import MenuItem from '@/components/MenuItem.vue'
// Import API function để lấy số lượng ticket
import { getTicketCount } from '@/api/ticket'

// H3: import icon components
// Import icon Copy và Loader2 từ lucide-vue-next
import { Copy, Loader2 } from 'lucide-vue-next'

// H4: import types
// Component này không có types import

// H5: props, emits
// Component này không có props và emits

// H6: i18n, store
// Import toast từ vue3-toastify để hiển thị thông báo
import { toast } from 'vue3-toastify'

/** Avatar default asset */
import avatarDefault from '@/assets/avt-default.jpg'

/** Mail icon asset */
import mailIcon from '@/assets/MailIcon.png'

/** BBH icon asset */
import bbhIcon from '@/assets/BBHIcon.png'

/** Zalo icon asset */
import zaloIcon from '@/assets/ZaloIcon.png'

/** Mail small icon asset */
import MailSmallIcon from '@/assets/MailSmallIcon.png'

/** Phone icon asset */
import PhoneIcon from '@/assets/PhoneIcon.png'

/** Alert icon asset */
import AlertIcon from '@/assets/Alerticon.png'

/** Router instance */
const route = useRoute()

/** i18n instance */
const { t } = useI18n()

// H7: variables
/** CDN base URL từ env */
const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL

/** Số điện thoại hỗ trợ từ env */
const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE

/** Email hỗ trợ từ env */
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL

/** URL Zalo từ env */
const ZALO_OA_URL = import.meta.env.VITE_ZALO_OA_URL

/** Trạng thái loading của nút copy */
const is_copy_loading = ref(false)

/** Thời gian delay giữa các lần click (ms) */
const CLICK_DELAY = 500

/** Số lượng ticket đang xử lý */
const ticket_count = ref(0)

// H8: lifecycle hooks
/** Lifecycle hook chạy khi component được mount vào DOM */
onMounted(async () => {
  try {
    /** Lấy object query parameters từ URL hiện tại */
    const QUERY = route.query

    // Kiểm tra nếu không có query param nào thì dừng hàm
    if (!QUERY) return

    // Duyệt qua từng key trong object query
    Object.keys(QUERY).forEach((key) => {
      /** Lấy giá trị của param tương ứng với key */
      const VALUE = QUERY[key]

      // Nếu giá trị hợp lệ (khác null/undefined) thì lưu vào localStorage
      if (VALUE != null) {
        // Lưu giá trị vào localStorage với key tương ứng
        localStorage.setItem(key, String(VALUE))
      }
    })
  } catch (error) {
    // Log error ra console để debug
    console.error('Error saving params to localStorage:', error)
  }

  // Gọi API để lấy số lượng ticket đang xử lý
  try {
    /** Response từ API count ticket */
    const RESPONSE = await getTicketCount()
    // Cập nhật số lượng ticket từ response
    ticket_count.value = RESPONSE?.processing || 0
  } catch (error) {
    // Log error ra console để debug
    console.error('Error loading ticket count:', error)
    // Set về 0 nếu có lỗi
    ticket_count.value = 0
  }
})

// H9: watch, computed
/** Computed property format số điện thoại hiển thị dạng XXXX.XXX.XXXX */
const formatted_support_phone = computed(() => {
  // Loại bỏ ký tự không phải số nếu có
  const PHONE = SUPPORT_PHONE?.replace(/\D/g, '') || ''

  // Format theo nhóm 4-3-4 nếu đủ 11 số
  if (PHONE.length === 11) {
    // Replace với pattern 4-3-4 và thêm dấu chấm
    return PHONE.replace(/(\d{4})(\d{3})(\d{4})/, '$1.$2.$3')
  }

  // Format theo nhóm 4-3-3 nếu 10 số (dự phòng)
  if (PHONE.length === 10) {
    // Replace với pattern 4-3-3 và thêm dấu chấm
    return PHONE.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3')
  }

  // Trả về nguyên gốc nếu không đúng định dạng
  return SUPPORT_PHONE
})

/** Computed property trả về avatar URL dựa trên client_id */
const avatar_url = computed(() => {
  /** Lấy client_id từ query params */
  const CLIENT_ID = route.query.client_id

  // Nếu có client_id thì trả về URL CDN tương ứng
  if (CLIENT_ID) {
    // Tạo URL CDN với client_id
    return `${CDN_BASE_URL}/media/s/${CLIENT_ID}/user`
  }

  // Nếu không có thì trả về avatar mặc định
  return avatarDefault
})

/** Computed property trả về tên khách hàng từ query */
const customer_name = computed(() => {
  /** Lấy tên từ params */
  const NAME = route.query.user_name

  // Nếu không có tên thì trả về mặc định
  if (!NAME) {
    return t('mainMenu.defaultCustomerName')
  }

  // Decode URI component để hiển thị đúng tiếng Việt
  return decodeURIComponent(NAME as string)
})

/** Computed property trả về mã khách hàng từ query */
const customer_id = computed<string>(() => {
  /** Lấy giá trị client_id từ URL query */
  const CLIENT_ID = route.query.client_id

  // Nếu là array thì lấy phần tử đầu tiên
  if (Array.isArray(CLIENT_ID)) {
    // Trả về phần tử đầu tiên hoặc giá trị mặc định
    return CLIENT_ID[0] || '---'
  }

  // Trả về giá trị ID hoặc mặc định
  return CLIENT_ID || '---'
})

// H10: functions
/** Copy mã khách hàng */
async function copyCustomerId() {
  /** Lấy giá trị ID hiện tại */
  const CUSTOMER_ID = customer_id.value

  // Kiểm tra điều kiện: không có ID, ID mặc định '---', hoặc đang loading thì thoát
  if (!CUSTOMER_ID || CUSTOMER_ID === '---' || is_copy_loading.value) {
    // Hiển thị error toast nếu không có customer ID
    toast.error(t('mainMenu.not_found_customer_id'))
    // Return sớm vì không có customer ID hợp lệ hoặc đang loading
    return
  }

  // Set trạng thái đang xử lý thành true
  is_copy_loading.value = true

  try {
    // Ưu tiên dùng Navigator Clipboard API (chỉ hoạt động trên HTTPS hoặc Localhost)
    if (navigator.clipboard && window.isSecureContext) {
      // Gọi Clipboard API để copy text
      await navigator.clipboard.writeText(CUSTOMER_ID)
    } else {
      // Fallback cho Mobile / HTTP (tránh lỗi trên môi trường dev không có HTTPS)
      /** Tạo thẻ textarea ẩn để chứa text */
      const TEXT_AREA = document.createElement('textarea')
      // Set giá trị cần copy vào textarea
      TEXT_AREA.value = CUSTOMER_ID

      // Style để ẩn khỏi view nhưng vẫn select được
      TEXT_AREA.style.position = 'fixed'
      TEXT_AREA.style.left = '-9999px'
      TEXT_AREA.style.top = '0'

      // Thêm textarea vào DOM
      document.body.appendChild(TEXT_AREA)
      // Focus vào textarea
      TEXT_AREA.focus()
      // Select text trong textarea
      TEXT_AREA.select()

      // Thực hiện lệnh copy native
      const SUCCESSFUL = document.execCommand('copy')
      // Xóa textarea khỏi DOM
      document.body.removeChild(TEXT_AREA)

      // Nếu copy thất bại thì throw error
      if (!SUCCESSFUL) {
        throw new Error('Copy fallback failed')
      }
    }

    // Hiển thị thông báo thành công
    toast.success(t('mainMenu.copySuccess'))
  } catch (e) {
    // Log error ra console để debug
    console.error('Copy error:', e)
    // Hiển thị thông báo lỗi nếu copy thất bại
    toast.error(t('mainMenu.copyError'))
  } finally {
    // Tắt trạng thái loading sau khoảng thời gian delay
    setTimeout(() => {
      // Set trạng thái loading thành false
      is_copy_loading.value = false
    }, CLICK_DELAY)
  }
}
</script>
