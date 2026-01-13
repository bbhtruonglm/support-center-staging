<script setup lang="ts">
/**
 * Component Example: Sử dụng useCommentStore
 *
 * Cách sử dụng:
 * 1. Import store và lấy state qua storeToRefs
 * 2. Gọi loadComments khi mount
 * 3. Gọi submitComment khi user gửi comment
 * 4. UI tự động update từ store (reactive)
 */

import { onMounted, ref } from 'vue'
import { useCommentStore } from '@/stores/comment'
import { storeToRefs } from 'pinia'
import { transformCommentToItem } from '@/api/ticket/transform'

/** Props: nhận ticket_id từ parent */
const props = defineProps<{
  ticket_id: number
}>()

/** Use comment store */
const comment_store = useCommentStore()

/**
 * Lấy reactive state từ store
 * Dùng storeToRefs để giữ tính reactive
 */
const {
  comments, // Danh sách comments thô từ API
  page, // Page hiện tại
  total_page, // Tổng số page
  total_comments, // Tổng số comments
  is_loading, // Đang load comments
  is_submitting, // Đang submit comment
} = storeToRefs(comment_store)

/** Local state cho input */
const new_comment_content = ref('')

/**
 * Load comments khi component mount
 */
onMounted(() => {
  if (props.ticket_id) {
    comment_store.loadComments(props.ticket_id)
  }
})

/**
 * Handle submit comment
 *
 * Flow:
 * 1. Validate input
 * 2. Gọi store.submitComment (sẽ tự append vào list)
 * 3. Clear input
 * 4. KHÔNG cần gọi loadComments lại
 */
async function handleSubmit() {
  if (!new_comment_content.value.trim()) return

  try {
    /**
     * Gọi action từ store
     * Store sẽ tự động:
     * - Gọi API createComment
     * - Thêm comment mới vào ĐẦU list
     * - Tăng total_comments
     * - KHÔNG reload list
     */
    await comment_store.submitComment(props.ticket_id, new_comment_content.value)

    /** Clear input sau khi thành công */
    new_comment_content.value = ''
  } catch (error) {
    /** Error đã được log ở store, có thể show toast ở đây */
    alert('Có lỗi xảy ra khi gửi bình luận')
  }
}

/**
 * Handle chuyển page
 * Khi user chuyển page, mới gọi loadComments để sync với backend
 */
async function handlePageChange(new_page: number) {
  await comment_store.loadComments(props.ticket_id, new_page)
}
</script>

<template>
  <div class="comment-section">
    <h3>Bình luận ({{ total_comments }})</h3>

    <!-- Loading State -->
    <div v-if="is_loading">Đang tải bình luận...</div>

    <!-- Comments List -->
    <div v-else id="comments-container" class="comments-list">
      <div v-for="comment in comments" :key="comment.id || comment.created_at" class="comment-item">
        <!-- Transform comment để hiển thị -->
        <div class="comment-header">
          <strong>{{ transformCommentToItem(comment).name }}</strong>
          <span>{{ transformCommentToItem(comment).date }}</span>
        </div>
        <div class="comment-content">
          {{ transformCommentToItem(comment).content }}
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="total_page > 1" class="pagination">
      <button @click="handlePageChange(page - 1)" :disabled="page === 1">Trước</button>
      <span>Trang {{ page }} / {{ total_page }}</span>
      <button @click="handlePageChange(page + 1)" :disabled="page === total_page">Sau</button>
    </div>

    <!-- Input Form -->
    <div class="comment-input">
      <textarea
        v-model="new_comment_content"
        placeholder="Nhập bình luận của bạn..."
        rows="3"
        :disabled="is_submitting"
      ></textarea>

      <button @click="handleSubmit" :disabled="is_submitting || !new_comment_content.trim()">
        {{ is_submitting ? 'Đang gửi...' : 'Gửi bình luận' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.comments-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 1rem;
}
.comment-item {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 4px;
}
.comment-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.pagination {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
}
</style>
