import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: () => import('@/views/MainMenu.vue'),
    },
  ],
})

export default router
