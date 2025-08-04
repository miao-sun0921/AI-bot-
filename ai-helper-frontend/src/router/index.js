import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chat-insight',
      name: 'ChatInsight',
      component: () => import('../views/ChatInsight.vue'),
    },
    {
      path: '/data-analysis',
      name: 'DataAnalysis',
      component: () => import('../views/DataAnalysis.vue'),
    },
    {
      path: '/ad-management',
      name: 'AdManagement',
      component: () => import('../views/AdManagement.vue'),
    },
    {
      path: '/',
      redirect: '/chat-insight',
    },
  ],
})

export default router
