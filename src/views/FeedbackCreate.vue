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
          v-model="form_title"
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
              :class="['text-sm', selected_workflow ? 'font-semibold text-black' : 'text-gray-400']"
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
          v-model="form_content"
          rows="5"
          placeholder="Quý khách vui lòng nhập nội dung phản ánh"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 resize-none bg-white"
        ></textarea>
      </div>

      <!-- Images -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black"> Ảnh đính kèm </label>
        <span class="text-sm text-gray-500">Tối đa 6 ảnh</span>

        <div class="flex flex-wrap gap-2.5">
          <!-- Preview Images -->
          <div
            v-for="(image, index) in image_previews"
            :key="index"
            class="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white"
          >
            <img :src="image" alt="Preview" class="w-full h-full object-cover" />
            <button
              @click="removeImage(index)"
              class="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>

          <!-- Add Image Button -->
          <div
            v-if="image_previews.length < 6"
            @click="triggerFileInput"
            class="w-20 h-20 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 text-xs bg-white cursor-pointer hover:border-gray-400"
          >
            <Camera :size="24" :stroke-width="1.5" class="text-gray-500" />
            <span class="text-xs mt-1">Chụp ảnh</span>
          </div>

          <!-- Hidden File Input -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            @change="handleImageSelect"
            class="hidden"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        @click="handleSubmit"
        :disabled="is_submitting"
        :class="[
          'p-3 rounded-lg text-white font-medium text-sm',
          is_submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700',
        ]"
      >
        {{ is_submitting ? 'Đang gửi...' : 'Gửi thông tin' }}
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Camera, ChevronDown, X } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'

import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'

import { createForm, createTicket, type WorkflowItem } from '@/api/ticket'
import { useWorkflowStore } from '@/stores/workflow'

/** Router instance */
const router = useRouter()

/** Workflow store để lấy workflow list từ cache */
const workflow_store = useWorkflowStore()

/** Ref cho dropdown container */
const dropdownRef = ref<HTMLElement | null>(null)

/** Ref cho file input */
const fileInputRef = ref<HTMLInputElement | null>(null)

/** Danh sách workflow từ store (computed để reactive) */
const workflow_list = computed(() => workflow_store.workflow_list)

/** Workflow đã chọn */
const selected_workflow = ref<WorkflowItem | null>(null)

/** Trạng thái dropdown mở/đóng */
const is_dropdown_open = ref(false)

/** Trạng thái loading workflow từ store (computed để reactive) */
const is_loading_workflow = computed(() => workflow_store.is_loading)

/** Form title */
const form_title = ref('')

/** Form content */
const form_content = ref('')

/** Danh sách preview ảnh (base64) */
const image_previews = ref<string[]>([])

/** Form attachments (base64 strings) */
const form_attachments = ref<string[]>([])

/** Trạng thái đang submit */
const is_submitting = ref(false)

/** Số lượng ảnh tối đa */
const MAX_IMAGES = 6

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
 * Load danh sách workflow từ store (chỉ gọi API nếu chưa load)
 */
async function loadWorkflowList() {
  try {
    await workflow_store.loadWorkflowList()
  } catch (e: any) {
    console.error('Error loading workflow list:', e)
    toast.error(e.message || 'Không thể tải danh sách dịch vụ')
  }
}

/**
 * Watch workflow list để tự động chọn workflow đầu tiên khi load xong
 */
watch(
  () => workflow_list.value,
  (new_list) => {
    /** Tự động chọn workflow đầu tiên nếu có và chưa chọn workflow nào */
    if (new_list.length > 0 && !selected_workflow.value && new_list[0]) {
      selected_workflow.value = new_list[0]
    }
  },
  { immediate: true },
)

/**
 * Trigger file input để chọn/chụp ảnh
 */
function triggerFileInput() {
  fileInputRef.value?.click()
}

/**
 * Xử lý khi chọn ảnh
 * @param event - File input change event
 */
function handleImageSelect(event: Event) {
  const TARGET = event.target as HTMLInputElement
  const FILES = TARGET.files

  if (!FILES || FILES.length === 0) return

  /** Tính số ảnh còn lại có thể thêm */
  const REMAINING_SLOTS = MAX_IMAGES - image_previews.value.length

  if (REMAINING_SLOTS <= 0) {
    toast.error(`Chỉ được tải tối đa ${MAX_IMAGES} ảnh`)
    return
  }

  /** Lấy số lượng file sẽ thêm (không vượt quá số slot còn lại) */
  const FILES_TO_ADD = Math.min(FILES.length, REMAINING_SLOTS)

  /** Duyệt qua từng file và convert sang base64 */
  for (let i = 0; i < FILES_TO_ADD; i++) {
    const FILE = FILES[i]

    // Kiểm tra file có tồn tại không
    if (!FILE) {
      continue
    }

    // Kiểm tra file có phải là ảnh không
    if (!FILE.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      continue
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (FILE.size > MAX_SIZE) {
      toast.error(`Ảnh ${FILE.name} vượt quá 5MB`)
      continue
    }

    /** Convert file sang base64 */
    const READER = new FileReader()

    READER.onload = (e) => {
      const RESULT = e.target?.result as string

      if (RESULT) {
        image_previews.value.push(RESULT)
        form_attachments.value.push(RESULT)
      }
    }

    READER.onerror = () => {
      toast.error(`Không thể đọc file ${FILE.name}`)
    }

    READER.readAsDataURL(FILE)
  }

  // Reset input để có thể chọn lại file giống nhau
  if (TARGET) {
    TARGET.value = ''
  }

  // Nếu có file bị bỏ qua do vượt quá số lượng
  if (FILES.length > FILES_TO_ADD) {
    toast.warning(`Chỉ thêm được ${FILES_TO_ADD} ảnh. Tối đa ${MAX_IMAGES} ảnh`)
  }
}

/**
 * Xóa ảnh khỏi danh sách
 * @param index - Index của ảnh cần xóa
 */
function removeImage(index: number) {
  image_previews.value.splice(index, 1)
  form_attachments.value.splice(index, 1)
}

/**
 * Validate form trước khi submit
 * @returns true nếu form hợp lệ, false nếu không
 */
function validateForm(): boolean {
  // Kiểm tra title
  if (!form_title.value || form_title.value.trim() === '') {
    toast.error('Vui lòng nhập tiêu đề góp ý')
    return false
  }

  // Kiểm tra content
  if (!form_content.value || form_content.value.trim() === '') {
    toast.error('Vui lòng nhập nội dung góp ý')
    return false
  }

  // Kiểm tra workflow đã chọn
  if (!selected_workflow.value) {
    toast.error('Vui lòng chọn loại dịch vụ')
    return false
  }

  return true
}

/**
 * Handle submit form
 */
async function handleSubmit() {
  // Validate form
  if (!validateForm()) {
    return
  }

  // Kiểm tra đang submit thì không cho submit lại
  if (is_submitting.value) {
    return
  }

  is_submitting.value = true

  try {
    // Kiểm tra lại selected_workflow (đã validate nhưng để chắc chắn)
    if (!selected_workflow.value) {
      toast.error('Vui lòng chọn loại dịch vụ')
      return
    }

    // Bước 1: Tạo form với form_data
    const FORM_DATA = {
      title: form_title.value.trim(),
      content: form_content.value.trim(),
      attachments: form_attachments.value,
    }

    const FORM_RESPONSE = await createForm(FORM_DATA)

    // Bước 2: Tạo ticket từ workflow_id và ticket_form_id
    const TICKET_REQUEST = {
      workflow_id: selected_workflow.value.workflow_id,
      ticket_form_id: FORM_RESPONSE.id,
    }

    await createTicket(TICKET_REQUEST)

    // Thành công: hiển thị thông báo và navigate
    toast.success('Gửi phản ánh thành công!')
    router.push('/feedback-list')
  } catch (e: any) {
    console.error('Error submitting feedback:', e)
    toast.error(e.message || 'Có lỗi xảy ra khi gửi phản ánh')
  } finally {
    is_submitting.value = false
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

