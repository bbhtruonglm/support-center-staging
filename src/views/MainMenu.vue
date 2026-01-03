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
          <img :src="avatarUrl" alt="Profile" class="w-full h-full object-contain" />
        </div>
        <h2 class="text-lg font-semibold">{{ t('mainMenu.greeting') }} {{ customerName }}</h2>
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
                <span class="font-medium">
                  {{ customerId }}
                </span>
              </div>
              <button
                @click="copyCustomerId"
                :disabled="isCopyLoading"
                :class="[
                  'hover:cursor-pointer',
                  isCopyLoading && 'opacity-50 cursor-not-allowed pointer-events-none',
                ]"
              >
                <Loader2
                  v-if="isCopyLoading"
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
              :title="SUPPORT_PHONE"
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

            <!-- <MenuItem
              :icon="AlertIcon"
              title="Khiếu nại & Báo lỗi"
              subtitle="Tiếp nhận ý kiến khách hàng"
            >
              <template #right-icon>
                <div class="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                  <span class="text-xs font-medium text-white">2</span>
                </div>
              </template>
            </MenuItem> -->
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useI18n } from 'vue-i18n'

import InfoCard from '@/components/InfoCard.vue'
import MenuItem from '@/components/MenuItem.vue'

import { Copy, Loader2 } from 'lucide-vue-next'

import avatarDefault from '@/assets/avt-default.jpg'
import mailIcon from '@/assets/MailIcon.png'
import bbhIcon from '@/assets/BBHIcon.png'
import zaloIcon from '@/assets/ZaloIcon.png'
import MailSmallIcon from '@/assets/MailSmallIcon.png'
import PhoneIcon from '@/assets/PhoneIcon.png'

/** CDN base URL từ env */
const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL

/** Số điện thoại hỗ trợ từ env */
const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE

/** Email hỗ trợ từ env */
const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL

/** URL Zalo từ env */
const ZALO_OA_URL = import.meta.env.VITE_ZALO_OA_URL

/** router */
const route = useRoute()

/** i18n */
const { t } = useI18n()

/** Lưu params vào localStorage */
onMounted(() => {
  try {
    const query = route.query
    if (!query) return

    Object.keys(query).forEach((key) => {
      const value = query[key]
      if (value !== undefined && value !== null) {
        localStorage.setItem(key, String(value))
      }
    })
  } catch (error) {
    console.error('Error saving params to localStorage:', error)
  }
})

/** Avatar URL based on client_id */
const avatarUrl = computed(() => {
  const clientId = route.query.client_id
  if (clientId) {
    return `${CDN_BASE_URL}/media/s/${clientId}/user`
  }
  return avatarDefault
})

/** Tên khách hàng từ query */
const customerName = computed(() => {
  const name = route.query.user_name
  if (!name) return t('mainMenu.defaultCustomerName')
  return decodeURIComponent(name as string)
})

/** Mã khách hàng từ query */
const customerId = computed(() => {
  return route.query.client_id || '---'
})

/** Trạng thái loading của nút copy */
const isCopyLoading = ref(false)

/** Thời gian delay giữa các lần click (ms) */
const CLICK_DELAY = 500

/** Copy mã khách hàng */
const copyCustomerId = async () => {
  if (!customerId.value || customerId.value === '---' || isCopyLoading.value) return

  isCopyLoading.value = true

  try {
    await navigator.clipboard.writeText(customerId.value as string)
    toast.success(t('mainMenu.copySuccess'))
  } catch (e) {
    toast.error(t('mainMenu.copyError'))
  } finally {
    setTimeout(() => {
      isCopyLoading.value = false
    }, CLICK_DELAY)
  }
}
</script>
