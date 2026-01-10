// Import ref từ Vue để tạo reactive reference
import { ref } from 'vue'
// Import defineStore từ Pinia để tạo store
import { defineStore } from 'pinia'
// Import type TicketItem từ ticket types
import type { TicketItem } from '@/types/ticket'

/** Store quản lý ticket data - Dùng để cache ticket detail và tránh lỗi DataCloneError khi navigate */
export const useTicketStore = defineStore('ticket', () => {
  /** Map lưu ticket detail theo ID (UUID) */
  const ticket_cache = ref<Map<string, TicketItem>>(new Map())

  /**
   * Lưu ticket vào cache
   * @param ticket - TicketItem cần lưu
   */
  function setTicket(ticket: TicketItem) {
    // Kiểm tra ticket có ID không
    if (ticket?.id) {
      // Lưu ticket vào cache với key là ticket.id
      ticket_cache.value.set(ticket.id, ticket)
    }
  }

  /**
   * Lấy ticket từ cache theo ID (UUID)
   * @param ticket_id - ID của ticket (UUID)
   * @returns TicketItem nếu có trong cache, null nếu không có
   */
  function getTicket(ticket_id: string): TicketItem | null {
    // Lấy ticket từ cache hoặc trả về null nếu không có
    return ticket_cache.value.get(ticket_id) || null
  }

  /**
   * Lấy ticket từ cache theo ticket_id (số)
   * @param ticket_id - Ticket ID số của ticket
   * @returns TicketItem nếu có trong cache, null nếu không có
   */
  function getTicketByTicketId(ticket_id: number): TicketItem | null {
    // Duyệt qua tất cả tickets trong cache để tìm theo ticket_id
    for (const TICKET of ticket_cache.value.values()) {
      // Nếu ticket_id trùng khớp thì trả về ticket đó
      if (TICKET.ticket_id === ticket_id) {
        return TICKET
      }
    }
    // Trả về null nếu không tìm thấy
    return null
  }

  /**
   * Xóa ticket khỏi cache
   * @param ticket_id - ID của ticket cần xóa
   */
  function removeTicket(ticket_id: string) {
    // Xóa ticket khỏi cache theo ID
    ticket_cache.value.delete(ticket_id)
  }

  /**
   * Xóa toàn bộ cache
   */
  function clearCache() {
    // Xóa tất cả tickets khỏi cache
    ticket_cache.value.clear()
  }

  /**
   * Kiểm tra ticket có trong cache không
   * @param ticket_id - ID của ticket
   * @returns true nếu có trong cache, false nếu không
   */
  function hasTicket(ticket_id: string): boolean {
    // Kiểm tra ticket có tồn tại trong cache không
    return ticket_cache.value.has(ticket_id)
  }

  // Trả về các functions và state của store
  return {
    // Function để lưu ticket vào cache
    setTicket,
    // Function để lấy ticket từ cache theo ID (UUID)
    getTicket,
    // Function để lấy ticket từ cache theo ticket_id (số)
    getTicketByTicketId,
    // Function để xóa ticket khỏi cache
    removeTicket,
    // Function để xóa toàn bộ cache
    clearCache,
    // Function để kiểm tra ticket có trong cache không
    hasTicket,
  }
})
