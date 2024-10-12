import { createRouter, createWebHistory } from 'vue-router'

// Importing the views
import LoginView from '@/views/auth/LoginView.vue'
import VisitorView from '@/views/VisitorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/visitor',
      name: 'visitor',
      component: VisitorView
    }
  ]
})

export default router
