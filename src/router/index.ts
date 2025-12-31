import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: () => import('@/views/MainMenu.vue'),
    },
    {
      path: '/feedback-list',
      name: 'Feedback-list',
      component: () => import('@/views/FeedbackList.vue'),
    },
    {
      path: '/feedback-list-empty',
      name: 'Feedback-list-empty',
      component: () => import('@/views/FeedbackListEmpty.vue'),
    },
    {
      path: '/feedback-create',
      name: 'Feedback-create',
      component: () => import('@/views/FeedbackCreate.vue'),
    },
    {
      path: '/thankyou-create',
      name: 'Thankyou-create',
      component: () => import('@/views/ThankyouCreate.vue'),
    },
    {
      path: '/thankyou-success',
      name: 'Thankyou-success',
      component: () => import('@/views/ThankyouSuccess.vue'),
    },
    {
      path: '/embed-web-chat',
      name: 'Embed-web-chat',
      component: () => import('@/views/EmbedWebChat.vue'),
    },
  ],
})

export default router
