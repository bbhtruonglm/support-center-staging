<template>
  <div class="flex flex-col h-full max-w-sm bg-slate-100 overflow-y-auto">
    <!-- Header Section -->
    <AppHeader />

    <!-- Content Wrapper -->
    <div class="flex-1 flex flex-col">
      <!-- Navigation Header -->
      <PageHeader title="Chat" />
      <Frame />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import Frame from '@/views/Frame.vue'
</script>
