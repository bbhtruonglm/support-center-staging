import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getWorkflowList } from '@/api/ticket'
import type { WorkflowItem } from '@/types/ticket'

/**
 * Store quản lý workflow data
 * Dùng để cache workflow list và tránh gọi API nhiều lần
 */
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
    /** Nếu đã load và không force reload thì không gọi API */
    if (is_loaded.value && !force_reload) {
      return
    }

    /** Kiểm tra nếu đang loading thì không gọi tiếp (tránh duplicate calls) */
    if (is_loading.value) {
      return
    }

    /** Set loading state */
    is_loading.value = true

    try {
      /** Gọi API để lấy danh sách workflow */
      const DATA = await getWorkflowList()
      workflow_list.value = DATA
      is_loaded.value = true
    } catch (e: any) {
      console.error('Error loading workflow list:', e)
      /** Reset is_loaded để có thể retry sau */
      is_loaded.value = false
      throw e
    } finally {
      is_loading.value = false
    }
  }

  /**
   * Lấy workflow theo workflow_id
   * @param workflow_id - ID của workflow (số)
   * @returns WorkflowItem nếu tìm thấy, null nếu không tìm thấy
   */
  function getWorkflowById(workflow_id: number): WorkflowItem | null {
    return workflow_list.value.find((item) => item.workflow_id === workflow_id) || null
  }

  /**
   * Lấy tên workflow theo workflow_id
   * @param workflow_id - ID của workflow (số)
   * @returns Tên workflow nếu tìm thấy, fallback string nếu không tìm thấy
   */
  function getWorkflowName(workflow_id: number): string {
    const WORKFLOW = getWorkflowById(workflow_id)
    return WORKFLOW ? WORKFLOW.name : `Workflow ${workflow_id}`
  }

  /**
   * Xóa cache workflow list
   */
  function clearCache() {
    workflow_list.value = []
    is_loaded.value = false
  }

  return {
    workflow_list,
    is_loading,
    is_loaded,
    loadWorkflowList,
    getWorkflowById,
    getWorkflowName,
    clearCache,
  }
})
