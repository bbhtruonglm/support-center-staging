// Import ref từ Vue để tạo reactive reference
import { ref } from 'vue'
// Import defineStore từ Pinia để tạo store
import { defineStore } from 'pinia'
// Import API function để lấy danh sách workflow
import { getWorkflowList } from '@/api/ticket'
// Import type WorkflowItem từ ticket types
import type { WorkflowItem } from '@/types/ticket'

/** Store quản lý workflow data - Dùng để cache workflow list và tránh gọi API nhiều lần */
export const useWorkflowStore = defineStore('workflow', () => {
  /** Danh sách workflow từ API */
  const workflow_list = ref<WorkflowItem[]>([])

  /** Trạng thái loading workflow */
  const is_loading = ref(false)

  /** Flag để đánh dấu đã load workflow list chưa */
  const is_loaded = ref(false)

  /**
   * Load danh sách workflow từ API
   * Chỉ gọi API nếu chưa load hoặc force reload
   * @param force_reload - Force reload lại từ API (mặc định false)
   */
  async function loadWorkflowList(force_reload: boolean = false): Promise<void> {
    // Nếu đã load và không force reload thì không gọi API
    if (is_loaded.value && !force_reload) {
      return
    }

    // Kiểm tra nếu đang loading thì không gọi tiếp để tránh duplicate calls
    if (is_loading.value) {
      return
    }

    // Set loading state thành true
    is_loading.value = true

    try {
      /** Gọi API để lấy danh sách workflow */
      const DATA = await getWorkflowList()
      // Cập nhật workflow_list với data từ API
      workflow_list.value = DATA
      // Set flag is_loaded thành true sau khi load thành công
      is_loaded.value = true
    } catch (e: any) {
      // Log error ra console để debug
      console.error('Error loading workflow list:', e)
      // Reset is_loaded để có thể retry sau
      is_loaded.value = false
      // Throw lại error để component có thể xử lý
      throw e
    } finally {
      // Luôn set loading state thành false sau khi hoàn thành
      is_loading.value = false
    }
  }

  /**
   * Lấy workflow theo workflow_id
   * @param workflow_id - ID của workflow (số)
   * @returns WorkflowItem nếu tìm thấy, null nếu không tìm thấy
   */
  function getWorkflowById(workflow_id: number): WorkflowItem | null {
    // Tìm workflow trong list theo workflow_id hoặc trả về null
    return workflow_list.value.find((item) => item.workflow_id === workflow_id) || null
  }

  /**
   * Lấy tên workflow theo workflow_id
   * @param workflow_id - ID của workflow (số)
   * @returns Tên workflow nếu tìm thấy, fallback string nếu không tìm thấy
   */
  function getWorkflowName(workflow_id: number): string {
    /** Lấy workflow từ cache theo workflow_id */
    const WORKFLOW = getWorkflowById(workflow_id)
    // Trả về tên workflow nếu có, nếu không thì trả về fallback string
    return WORKFLOW ? WORKFLOW.name : `Workflow ${workflow_id}`
  }

  /**
   * Xóa cache workflow list
   */
  function clearCache() {
    // Reset workflow_list về mảng rỗng
    workflow_list.value = []
    // Reset flag is_loaded về false
    is_loaded.value = false
  }

  // Trả về các state và functions của store
  return {
    // Danh sách workflow từ API
    workflow_list,
    // Trạng thái loading workflow
    is_loading,
    // Flag đánh dấu đã load workflow list chưa
    is_loaded,
    // Function để load danh sách workflow từ API
    loadWorkflowList,
    // Function để lấy workflow theo workflow_id
    getWorkflowById,
    // Function để lấy tên workflow theo workflow_id
    getWorkflowName,
    // Function để xóa cache workflow list
    clearCache,
  }
})
