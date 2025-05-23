import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '../views/LoginPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    props: route => ({ token: route.query.token }),
    children: [
      {
        path: '',
        redirect: '/tabs/tab1',
      },
      {
        path: 'tab1',
        component: () => import('@/views/RecordingPage.vue'),
        props: true
      },
      {
        path: 'tab2',
        props: true,
        component: () => import('@/views/MapPage.vue')
      },
      {
        path: 'tab3',
        props: true,
        component: () => import('@/views/SavedPage.vue')
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsPage.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignUpPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
