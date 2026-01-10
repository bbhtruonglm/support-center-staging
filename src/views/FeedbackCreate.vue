<template>
  <div class="w-full h-full max-w-sm bg-slate-100 flex flex-col overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Navigation -->
    <PageHeader :title="t('feedback.createTitle')" />

    <!-- Form -->
    <div class="p-3 flex flex-col gap-3">
      <!-- Title -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          {{ t('feedback.feedbackTitle') }}
          <span class="text-red-500">{{ t('feedback.required') }}</span>
        </label>
        <input
          v-model="form_title"
          type="text"
          :placeholder="t('feedback.feedbackTitlePlaceholder')"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 bg-white"
        />
      </div>

      <!-- Service Type -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          {{ t('feedback.serviceType') }}
          <span class="text-red-500">{{ t('feedback.required') }}</span>
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
              {{ selected_workflow?.name || t('feedback.selectServiceType') }}
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
              <div class="text-sm font-semibold text-black">
                {{ workflow.name }}
              </div>
              <div v-if="workflow.description" class="text-xs text-gray-500 mt-0.5">
                {{ workflow.description }}
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="is_loading_workflow" class="px-6 py-3 text-sm text-gray-500">
              {{ t('common.loading') }}
            </div>

            <!-- Empty State -->
            <div
              v-if="!is_loading_workflow && workflow_list.length === 0"
              class="px-6 py-3 text-sm text-gray-500"
            >
              {{ t('feedback.noServiceAvailable') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          {{ t('feedback.content') }}
          <span class="text-red-500">{{ t('feedback.required') }}</span>
        </label>
        <textarea
          v-model="form_content"
          rows="5"
          :placeholder="t('feedback.contentPlaceholder')"
          class="w-full px-6 py-3 text-sm rounded-xl border border-gray-200 resize-none bg-white"
        ></textarea>
      </div>

      <!-- Images -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-black">
          {{ t('feedback.attachImages') }}
        </label>
        <span class="text-sm text-gray-500">{{ t('feedback.maxImages') }}</span>

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
            <span class="text-xs mt-1">{{ t('feedback.takePhoto') }}</span>
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
        {{ is_submitting ? t('feedback.sending') : t('feedback.sendInfo') }}
      </button>

      <!-- Note -->
      <p class="text-xs text-slate-500 text-center leading-relaxed">
        {{ t('feedback.note') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// H1: import runtime functions
// Import các reactive functions từ Vue
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
// Import router hook để điều hướng
import { useRouter } from 'vue-router'
// Import i18n hook để sử dụng translation function
import { useI18n } from 'vue-i18n'

// H2: import components
// Import component AppHeader để hiển thị header
import AppHeader from '@/components/AppHeader.vue'
// Import component PageHeader để hiển thị page header
import PageHeader from '@/components/PageHeader.vue'

// H3: import icon components
// Import icon Camera và ChevronDown từ lucide-vue-next
import { Camera, ChevronDown } from 'lucide-vue-next'

// H4: import types
// Import API functions và type WorkflowItem từ ticket API
import { createForm, createTicket, type WorkflowItem } from '@/api/ticket'

// H5: props, emits
// Component này không có props và emits

// H6: i18n, store
// Import toast từ vue3-toastify để hiển thị thông báo
import { toast } from 'vue3-toastify'
// Import workflow store để quản lý state của workflows
import { useWorkflowStore } from '@/stores/workflow'

/** Router instance */
const router = useRouter()

/** i18n instance */
const { t } = useI18n()

/** Workflow store để lấy workflow list từ cache */
const workflow_store = useWorkflowStore()

// H7: variables
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

// H8: lifecycle hooks
/** Lifecycle hook chạy khi component được mount vào DOM */
onMounted(() => {
  // Gọi function load workflow list
  loadWorkflowList()
  // Thêm event listener để đóng dropdown khi click bên ngoài
  document.addEventListener('click', handleClickOutside)
})

/** Lifecycle hook chạy khi component được unmount khỏi DOM */
onUnmounted(() => {
  // Xóa event listener khi component unmount
  document.removeEventListener('click', handleClickOutside)
})

// H9: watch, computed
/**
 * Watch workflow list để tự động chọn workflow đầu tiên khi load xong
 */
watch(
  // Theo dõi sự thay đổi của workflow_list
  () => workflow_list.value,
  // Callback chạy khi workflow_list thay đổi
  (new_list) => {
    // Tự động chọn workflow đầu tiên nếu có và chưa chọn workflow nào
    if (new_list.length > 0 && !selected_workflow.value && new_list[0]) {
      // Set workflow đầu tiên làm workflow đã chọn
      selected_workflow.value = new_list[0]
    }
  },
  // Options với immediate: true để trigger ngay khi component mount
  { immediate: true },
)

// H10: functions
/**
 * Toggle dropdown mở/đóng
 */
function toggleDropdown() {
  // Đảo ngược trạng thái dropdown (mở thành đóng, đóng thành mở)
  is_dropdown_open.value = !is_dropdown_open.value
}

/**
 * Chọn workflow
 * @param workflow - Workflow item được chọn
 */
function selectWorkflow(workflow: WorkflowItem) {
  // Set workflow đã chọn
  selected_workflow.value = workflow
  // Đóng dropdown sau khi chọn
  is_dropdown_open.value = false
}

/**
 * Load danh sách workflow từ store (chỉ gọi API nếu chưa load)
 */
async function loadWorkflowList() {
  try {
    // Gọi function load workflow list từ store
    await workflow_store.loadWorkflowList()
  } catch (e: any) {
    // Log error ra console để debug
    console.error('Error loading workflow list:', e)
    // Hiển thị toast error với message từ error hoặc message mặc định
    toast.error(e.message || t('feedback.loadServiceError'))
  }
}

/**
 * Trigger file input để chọn/chụp ảnh
 */
function triggerFileInput() {
  // Gọi click() trên file input để mở file picker
  fileInputRef.value?.click()
}

/**
 * Xử lý khi chọn ảnh
 * @param event - File input change event
 */
function handleImageSelect(event: Event) {
  /** Cast event.target sang HTMLInputElement */
  const TARGET = event.target as HTMLInputElement
  /** Lấy danh sách files từ input */
  const FILES = TARGET.files

  // Nếu không có files thì return sớm
  if (!FILES || FILES.length === 0) return

  /** Tính số ảnh còn lại có thể thêm */
  const REMAINING_SLOTS = MAX_IMAGES - image_previews.value.length

  // Nếu không còn slot thì hiển thị error và return
  if (REMAINING_SLOTS <= 0) {
    toast.error(t('feedback.maxImagesExceeded', { count: MAX_IMAGES.toString() }))
    return
  }

  /** Lấy số lượng file sẽ thêm (không vượt quá số slot còn lại) */
  const FILES_TO_ADD = Math.min(FILES.length, REMAINING_SLOTS)

  // Duyệt qua từng file và convert sang base64
  for (let i = 0; i < FILES_TO_ADD; i++) {
    /** Lấy file tại index i */
    const FILE = FILES[i]

    // Kiểm tra file có tồn tại không
    if (!FILE) {
      continue
    }

    // Kiểm tra file có phải là ảnh không
    if (!FILE.type.startsWith('image/')) {
      toast.error(t('feedback.selectImageFile'))
      continue
    }

    /** Constant định nghĩa kích thước file tối đa (5MB) */
    const MAX_SIZE = 5 * 1024 * 1024
    // Kiểm tra kích thước file có vượt quá MAX_SIZE không
    if (FILE.size > MAX_SIZE) {
      toast.error(t('feedback.imageSizeExceeded', { name: FILE.name }))
      continue
    }

    /** Tạo FileReader instance để convert file sang base64 */
    const READER = new FileReader()

    // Callback khi đọc file thành công
    READER.onload = (e) => {
      /** Lấy kết quả từ FileReader */
      const RESULT = e.target?.result as string

      // Nếu có kết quả thì thêm vào previews và attachments
      if (RESULT) {
        image_previews.value.push(RESULT)
        form_attachments.value.push(RESULT)
      }
    }

    // Callback khi đọc file thất bại
    READER.onerror = () => {
      toast.error(t('feedback.cannotReadFile', { name: FILE.name }))
    }

    // Bắt đầu đọc file dưới dạng data URL (base64)
    READER.readAsDataURL(FILE)
  }

  // Reset input để có thể chọn lại file giống nhau
  if (TARGET) {
    TARGET.value = ''
  }

  // Nếu có file bị bỏ qua do vượt quá số lượng
  if (FILES.length > FILES_TO_ADD) {
    // Hiển thị warning về số file đã thêm
    toast.warning(
      t('feedback.onlyAddedImages', {
        added: FILES_TO_ADD.toString(),
        max: MAX_IMAGES.toString(),
      }),
    )
  }
}

/**
 * Xóa ảnh khỏi danh sách
 * @param index - Index của ảnh cần xóa
 */
function removeImage(index: number) {
  // Xóa ảnh khỏi danh sách previews tại index
  image_previews.value.splice(index, 1)
  // Xóa ảnh khỏi danh sách attachments tại index
  form_attachments.value.splice(index, 1)
}

/**
 * Validate form trước khi submit
 * @returns true nếu form hợp lệ, false nếu không
 */
function validateForm(): boolean {
  // Kiểm tra title có tồn tại và không rỗng không
  if (!form_title.value || form_title.value.trim() === '') {
    toast.error(t('feedback.enterTitle'))
    return false
  }

  // Kiểm tra content có tồn tại và không rỗng không
  if (!form_content.value || form_content.value.trim() === '') {
    toast.error(t('feedback.enterContent'))
    return false
  }

  // Kiểm tra workflow đã được chọn chưa
  if (!selected_workflow.value) {
    toast.error(t('feedback.selectService'))
    return false
  }

  // Form hợp lệ
  return true
}

/**
 * Handle submit form
 */
async function handleSubmit() {
  // Validate form trước khi submit
  if (!validateForm()) {
    return
  }

  // Kiểm tra đang submit thì không cho submit lại
  if (is_submitting.value) {
    return
  }

  // Set trạng thái submitting thành true
  is_submitting.value = true

  try {
    // Kiểm tra lại selected_workflow (đã validate nhưng để chắc chắn)
    if (!selected_workflow.value) {
      toast.error(t('feedback.selectService'))
      return
    }

    // Bước 1: Tạo form với form_data
    /** Object chứa dữ liệu form để gửi lên API */
    const FORM_DATA = {
      title: form_title.value.trim(),
      content: form_content.value.trim(),
      attachments: form_attachments.value,
    }

    // Gọi API để tạo form
    /** Response từ API createForm */
    const FORM_RESPONSE = await createForm(FORM_DATA)

    // Bước 2: Tạo ticket từ workflow_id và ticket_form_id
    /** Object chứa dữ liệu ticket để gửi lên API */
    const TICKET_REQUEST = {
      workflow_id: selected_workflow.value.workflow_id,
      ticket_form_id: FORM_RESPONSE.id,
    }

    // Gọi API để tạo ticket
    await createTicket(TICKET_REQUEST)

    // Hiển thị thông báo thành công
    toast.success(t('feedback.submitSuccess'))
    // Navigate đến trang danh sách feedback
    router.push('/feedback-list')
  } catch (e: any) {
    // Log error ra console để debug
    console.error('Error submitting feedback:', e)
    // Hiển thị toast error với message từ error hoặc message mặc định
    toast.error(e.message || t('feedback.submitError'))
  } finally {
    // Luôn set trạng thái submitting thành false sau khi hoàn thành
    is_submitting.value = false
  }
}

/**
 * Đóng dropdown khi click bên ngoài
 */
function handleClickOutside(event: MouseEvent) {
  /** Cast event.target sang HTMLElement */
  const TARGET = event.target as HTMLElement

  // Kiểm tra click có nằm ngoài dropdown container không
  if (dropdownRef.value && !dropdownRef.value.contains(TARGET)) {
    // Đóng dropdown nếu click bên ngoài
    is_dropdown_open.value = false
  }
}
</script>
