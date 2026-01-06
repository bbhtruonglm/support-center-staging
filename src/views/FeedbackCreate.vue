<template>
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Navigation -->
    <PageHeader title="Tạo phản ánh" />

    <!-- Form -->
    <div class="p-3 flex flex-col gap-3">
      <!-- Title -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Tiêu đề góp ý <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Vui lòng nhập tiêu đề"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 bg-white"
        />
      </div>

      <!-- Service Type -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Loại dịch vụ <span class="text-red-500">*</span>
        </label>

        <!-- Select Dropdown -->
        <div ref="dropdownRef" class="relative">
          <div
            @click.stop="toggleDropdown"
            class="w-full px-6 py-3 rounded-xl border border-gray-200 bg-white flex items-center justify-between cursor-pointer"
          >
            <span
              :class="[
                'text-sm',
                selected_workflow ? 'font-semibold text-black' : 'text-gray-400',
              ]"
            >
              {{ selected_workflow?.name || 'Chọn loại dịch vụ' }}
            </span>

            <ChevronDown
              :size="20"
              class="text-slate-900 transition-transform"
              :class="{ 'rotate-180': is_dropdown_open }"
              :stroke-width="2"
            />
          </div>

          <!-- Dropdown Menu -->
          <div
            v-if="is_dropdown_open"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="workflow in workflow_list"
              :key="workflow.id"
              @click.stop="selectWorkflow(workflow)"
              class="px-6 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0"
              :class="{
                'bg-blue-50': selected_workflow?.id === workflow.id,
              }"
            >
              <div class="text-sm font-semibold text-black">{{ workflow.name }}</div>
              <div v-if="workflow.description" class="text-xs text-gray-500 mt-0.5">
                {{ workflow.description }}
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="is_loading_workflow" class="px-6 py-3 text-sm text-gray-500">
              Đang tải...
            </div>

            <!-- Empty State -->
            <div
              v-if="!is_loading_workflow && workflow_list.length === 0"
              class="px-6 py-3 text-sm text-gray-500"
            >
              Không có dịch vụ nào
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          Nội dung góp ý <span class="text-red-500">*</span>
        </label>
        <textarea
          rows="5"
          placeholder="Quý khách vui lòng nhập nội dung phản ánh"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 resize-none bg-white"
        ></textarea>
      </div>

      <!-- Images -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black"> Ảnh đính kèm </label>
        <span class="text-sm text-gray-500">Tối đa 6 ảnh</span>

        <div class="flex gap-2.5">
          <div
            class="py-5 px-3 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 text-xs bg-white"
          >
            <Camera :size="24" :stroke-width="1.5" class="text-gray-500" />
            Chụp ảnh
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button class="p-3 bg-blue-700 rounded-lg text-white font-medium text-sm">
        Gửi thông tin
      </button>

      <!-- Note -->
      <p class="text-xs text-slate-500 text-center leading-relaxed">
        Sau khi gửi phản ánh, chúng tôi sẽ tiếp nhận và liên lạc đến <br />
        Quý khách hàng sớm nhất và không quá 24 tiếng.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Camera, ChevronDown } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'

import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'

import { getWorkflowList, type WorkflowItem } from '@/api/ticket'

/** Ref cho dropdown container */
const dropdownRef = ref<HTMLElement | null>(null)

/** Danh sách workflow từ API */
const workflow_list = ref<WorkflowItem[]>([])

/** Workflow đã chọn */
const selected_workflow = ref<WorkflowItem | null>(null)

/** Trạng thái dropdown mở/đóng */
const is_dropdown_open = ref(false)

/** Trạng thái loading workflow */
const is_loading_workflow = ref(false)

/**
 * Toggle dropdown mở/đóng
 */
function toggleDropdown() {
  is_dropdown_open.value = !is_dropdown_open.value
}

/**
 * Chọn workflow
 * @param workflow - Workflow item được chọn
 */
function selectWorkflow(workflow: WorkflowItem) {
  selected_workflow.value = workflow
  is_dropdown_open.value = false
}

/**
 * Load danh sách workflow từ API
 */
async function loadWorkflowList() {
  is_loading_workflow.value = true

  try {
    const DATA = await getWorkflowList()
    workflow_list.value = DATA

    // Tự động chọn workflow đầu tiên nếu có
    if (DATA.length > 0 && !selected_workflow.value) {
      selected_workflow.value = DATA[0]
    }
  } catch (e: any) {
    console.error('Error loading workflow list:', e)
    toast.error(e.message || 'Không thể tải danh sách dịch vụ')
  } finally {
    is_loading_workflow.value = false
  }
}

/**
 * Đóng dropdown khi click bên ngoài
 */
function handleClickOutside(event: MouseEvent) {
  const TARGET = event.target as HTMLElement

  if (dropdownRef.value && !dropdownRef.value.contains(TARGET)) {
    is_dropdown_open.value = false
  }
}

/** Load data khi component mounted */
onMounted(() => {
  loadWorkflowList()
  document.addEventListener('click', handleClickOutside)
})

/** Cleanup khi component unmounted */
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
