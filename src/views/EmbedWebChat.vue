<template>
  <div class="flex flex-col h-dvh md:max-w-sm bg-slate-100 overflow-y-auto">
    <!-- Header Section -->
    <!-- <AppHeader /> -->

    <!-- Content Wrapper -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Navigation Header -->
      <PageHeader title="Chat" />
      <div class="flex-1 relative h-full">
        <Frame />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// H1: import runtime functions
// (không có runtime functions trong component này)

// H2: import components
// Import component AppHeader để hiển thị header (hiện đang bị comment trong template)
import AppHeader from '@/components/AppHeader.vue'
// Import component PageHeader để hiển thị header với title "Chat"
import PageHeader from '@/components/PageHeader.vue'
// Import component Frame để hiển thị iframe web chat
import Frame from '@/views/Frame.vue'

// H3: import icon components
// (không có icon components trong component này)

// H4: import types
// (không có types trong component này)

// H5: props, emits
// Component này không có props và emits

// H6: i18n, store
// (không có i18n hoặc store trong component này)

// H7: variables
// Component này không có variables

// H8: lifecycle hooks
// Component này không có lifecycle hooks

// H9: watch, computed
// Component này không có watch hoặc computed

// H10: functions
// Component này không có functions
</script>
