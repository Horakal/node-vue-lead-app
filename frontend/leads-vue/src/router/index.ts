import { createRouter, createWebHistory } from 'vue-router'
import LeadForm from '../components/LeadForm.vue'
import Login from '../components/Login.vue'
import AdminPanel from '../components/AdminPanel.vue'
import LeadDetails from '../components/LeadDetails.vue'
import apiClient from '@/api/api'
const routes = [
  { path: '/', component: LeadForm, name: 'LeadForm' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/admin', component: AdminPanel, name: 'AdminPanel', meta: { requiresAuth: true } },
  { path: '/leads/:id', component: LeadDetails, name: 'LeadDetails', meta: { requiresAuth: true } },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  try {
    const response = await apiClient.get('/api/protected')
    if (response.data && response.data.user) {
      return next()
    }
    return next({ name: 'Login' })
  } catch {
    return next({ name: 'Login' })
  }
})

export default router
