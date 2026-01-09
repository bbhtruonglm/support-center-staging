import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TicketItem } from '@/types/ticket'

/**
 * Store quản lý ticket data
 * Dùng để cache ticket detail và tránh lỗi DataCloneError khi navigate
 */
export const useTicketStore = defineStore('ticket', () => {
  /** Map lưu ticket detail theo ID (UUID) */
  const ticket_cache = ref<Map<string, TicketItem>>(new Map())

  /**
   * Lưu ticket vào cache
   * @param ticket - TicketItem cần lưu
   */
  function setTicket(ticket: TicketItem) {
    if (ticket?.id) {
      ticket_cache.value.set(ticket.id, ticket)
    }
  }

  /**
   * Lấy ticket từ cache theo ID
   * @param ticket_id - ID của ticket (UUID)
   * @returns TicketItem nếu có trong cache, null nếu không có
   */
  function getTicket(ticket_id: string): TicketItem | null {
    return ticket_cache.value.get(ticket_id) || null
  }

  /**
   * Xóa ticket khỏi cache
   * @param ticket_id - ID của ticket cần xóa
   */
  function removeTicket(ticket_id: string) {
    ticket_cache.value.delete(ticket_id)
  }

  /**
   * Xóa toàn bộ cache
   */
  function clearCache() {
    ticket_cache.value.clear()
  }

  /**
   * Kiểm tra ticket có trong cache không
   * @param ticket_id - ID của ticket
   * @returns true nếu có trong cache, false nếu không
   */
  function hasTicket(ticket_id: string): boolean {
    return ticket_cache.value.has(ticket_id)
  }

  return {
    setTicket,
    getTicket,
    removeTicket,
    clearCache,
    hasTicket,
  }
})
