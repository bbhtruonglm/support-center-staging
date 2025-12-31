<template>
  <div class="flex flex-col h-full max-w-sm bg-slate-100 overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Content Wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Navigation Header -->
      <PageHeader title="Phản ánh" />

      <div class="flex-1 flex flex-col py-3 gap-3">
        <!-- Tabs -->
        <TabNav v-model="activeTab" :tabs="tabs" />

        <!-- Feedback List Content -->
        <div class="flex-1 overflow-y-auto text-black">
          <div class="flex flex-col gap-2.5 px-2">
            <div
              v-for="(item, index) in filteredFeedbackList"
              :key="index"
              class="bg-white rounded-lg px-4 py-1 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
            >
              <!-- Title & Status Row -->
              <div class="flex items-start justify-between gap-2 border-b border-gray-200 py-2">
                <h3 class="text-sm font-semibold flex-1 line-clamp-1">
                  {{ item.title }}
                </h3>
                <span
                  :class="[
                    'px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap',
                    getStatusClass(item.status),
                  ]"
                >
                  {{ getStatusLabel(item.status) }}
                </span>
              </div>

              <!-- Date & Support Row -->
              <div class="flex items-center justify-between gap-1 py-2">
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar :size="12" class="text-gray-500" />
                  <span>Ngày : {{ item.date }}</span>
                </div>
                <div class="flex items-center gap-1 text-xs text-gray-500">
                  <Bookmark :size="12" class="text-gray-500" />
                  <span>Hỗ trợ</span>
                </div>
              </div>

              <!-- Content Description -->
              <p class="text-sm line-clamp-3">
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Button -->
        <div class="p-3 bg-white mt-auto">
          <button class="w-full bg-orange-500 text-white font-medium py-3 rounded-lg">
            Tạo mới phản ánh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, MessageCircle, Bookmark } from 'lucide-vue-next'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import TabNav from '@/components/TabNav.vue'

const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Gửi yêu cầu' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn thành' },
]

const feedbackList = ref([
  {
    title: 'Chăm sóc khách hàng quá kém',
    date: '15/05/2024 - 15:32',
    status: 'pending',
    content:
      'Tôi không hài lòng về thái độ và cách xử lý vấn đề của nhân viên nguyễn văn a, bạn đó ăn nói cọc lốc, ko đi thẳng vào ...',
  },
  {
    title: 'Chăm sóc khách hàng quá kém',
    date: '15/05/2024 - 15:32',
    status: 'processing',
    content:
      'Tôi không hài lòng về thái độ và cách xử lý vấn đề của nhân viên nguyễn văn a, bạn đó ăn nói cọc lốc, ko đi thẳng vào ...',
  },
  {
    title: 'Chăm sóc khách hàng quá kém',
    date: '15/05/2024 - 15:32',
    status: 'processing',
    content:
      'Tôi không hài lòng về thái độ và cách xử lý vấn đề của nhân viên nguyễn văn a, bạn đó ăn nói cọc lốc, ko đi thẳng vào ...',
  },
  {
    title: 'Chăm sóc khách hàng quá kém, th...',
    date: '15/05/2024 - 15:32',
    status: 'completed',
    content:
      'Tôi không hài lòng về thái độ và cách xử lý vấn đề của nhân viên nguyễn văn a, bạn đó ăn nói cọc lốc, ko đi thẳng vào ...',
  },
  {
    title: 'Chăm sóc khách hàng quá kém',
    date: '15/05/2024 - 15:32',
    status: 'completed',
    content:
      'Tôi không hài lòng về thái độ và cách xử lý vấn đề của nhân viên nguyễn văn a, bạn đó ăn nói cọc lốc, ko đi thẳng vào ...',
  },
])

const filteredFeedbackList = computed(() => {
  if (activeTab.value === 'all') return feedbackList.value
  return feedbackList.value.filter((item) => item.status === activeTab.value)
})

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-orange-500 text-white',
    processing: 'bg-blue-500 text-white',
    completed: 'bg-green-600 text-white',
  }
  return classes[status] || classes.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Gửi yêu cầu',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
  }
  return labels[status] || 'Gửi yêu cầu'
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
