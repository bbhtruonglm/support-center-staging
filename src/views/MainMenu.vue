<template>
  <!-- Wrapper -->
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header -->
    <AppHeader />
    <!-- Main Content -->
    <section class="p-3 flex flex-col text-black text-sm">
      <!-- Profile -->
      <section class="flex flex-col items-center gap-3">
        <div
          class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
        >
          <img :src="avatarUrl" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <h2 class="text-lg font-semibold">Xin chào {{ customerName }}</h2>
      </section>
      <!-- Content -->
      <section class="py-3 flex flex-col gap-3">
        <div class="flex flex-col gap-2.5">
          <!-- Customer ID -->
          <InfoCard>
            <div class="flex items-center justify-between">
              <div class="flex flex-col text-sm">
                <span class="font-medium text-blue-700"> Mã khách hàng </span>
                <span class="font-medium">
                  {{ customerId }}
                </span>
              </div>
              <button @click="copyCustomerId" class="hover:cursor-pointer">
                <Copy :size="20" class="text-blue-700" :stroke-width="2" />
              </button>
            </div>
          </InfoCard>

          <!-- Contact -->
          <InfoCard class="flex flex-col py-0 px-4" title="Liên hệ với chúng tôi">
            <MenuItem
              :icon="PhoneIcon"
              title="0288.998.8688"
              subtitle="Tổng đài hỗ trợ khách hàng"
              type="tel"
            />

            <MenuItem
              :icon="MailSmallIcon"
              title="hotro@botbanhang.vn"
              subtitle="Email hỗ trợ khách hàng"
              type="email"
            />

            <MenuItem
              :icon="bbhIcon"
              title="Chat với chúng tôi"
              subtitle="Chat ngay trong App"
              to="/embed-web-chat"
            />

            <MenuItem
              :icon="zaloIcon"
              title="Chat qua Zalo"
              subtitle="Chat với chúng tôi qua Zalo"
              url="https://zalo.me/1591257820328477563"
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
        <section class="flex flex-col gap-2">
          <div class="flex flex-col items-center gap-2">
            <div class="w-24 h-24">
              <img :src="mailIcon" alt="Mail" class="w-full h-full object-contain" />
            </div>
            <p class="text-xs text-slate-500 text-center px-4">
              Chúng tôi luôn lắng nghe các phản hồi của <br />
              Quý Khách hàng để liên tục cải thiện Chất lượng - Dịch vụ.
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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import avatarImage from '@/assets/Avatar.png'
import mailIcon from '@/assets/MailIcon.png'
import bbhIcon from '@/assets/BBHIcon.png'
import zaloIcon from '@/assets/ZaloIcon.png'
import MailSmallIcon from '@/assets/MailSmallIcon.png'
import PhoneIcon from '@/assets/PhoneIcon.png'
import AlertIcon from '@/assets/Alerticon.png'

import { Copy, AlertCircle, CheckCircle } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import InfoCard from '@/components/InfoCard.vue'
import MenuItem from '@/components/MenuItem.vue'

const route = useRoute()

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
    return `https://cdn.botbanhang.vn/media/s/${clientId}/user`
  }
  return avatarImage
})

/** Tên khách hàng từ query */
const customerName = computed(() => {
  const name = route.query.user_name
  if (!name) return 'Quý khách'
  return decodeURIComponent(name as string)
})

/** Mã khách hàng từ query */
const customerId = computed(() => {
  return route.query.client_id || '---'
})

/** Copy mã khách hàng */
const copyCustomerId = async () => {
  if (!customerId.value || customerId.value === '---') return
  await navigator.clipboard.writeText(customerId.value as string)
}
</script>
