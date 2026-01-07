<template>
  <div class="flex flex-col h-full max-w-sm bg-slate-100 overflow-y-auto">
    <!-- Content Wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Navigation Header -->
      <PageHeader title="Phản ánh" />

      <div class="flex-1 flex flex-col py-3 gap-3">
        <!-- Tabs -->
        <TabNav v-model="activeTab" :tabs="tabs" />

        <!-- Content -->
        <div class="flex-1 flex flex-col items-center pt-10 gap-3">
          <!-- Empty State Image -->
          <div class="flex items-center justify-center">
            <!-- Mail Icon Placeholder -->
            <img :src="MailIcon" alt="No Feedback" class="w-25 h-25 object-contain z-10" />
          </div>
          <p class="text-xs text-gray-600 text-center px-4 whitespace-nowrap">
            Chúng tôi luôn lắng nghe các phản hồi của <br />
            Quý Khách hàng để liên tục cải thiện Chất lượng - Dịch vụ.
          </p>
        </div>

        <!-- Footer Button -->
        <div class="p-2 px-2.75 bg-white mt-auto">
          <button class="w-full bg-orange-500 text-white font-medium p-3 rounded-lg">
            Tạo mới phản ánh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Bell } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import TabNav from '@/components/TabNav.vue'
import MailIcon from '@/assets/MailIcon.png'

const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Gửi yêu cầu' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn thành' },
]
</script>

<style scoped>
/* Scoped styles if needed */
</style>
