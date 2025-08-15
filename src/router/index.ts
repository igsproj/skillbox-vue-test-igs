import NotFoundView from '@/views/NotFoundView.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(),
  routes: [
    {
      path: '/init1',
      name: 'init1',
      props: true,
      component: () => import('../views/CustomSelectorView1.vue')
    },
    {
      path: '/init2',
      name: 'init2',
      props: true,
      component: () => import('../views/CustomSelectorView2.vue')
    },
    {
      path: '/init3',
      name: 'init3',
      component: () => import('../views/CustomSelectorView3.vue')
    },
    {
      path: '/init4',
      name: 'init4',
      component: () => import('../views/CustomSelectorView4.vue')
    },
    {
      path: '/init5',
      name: 'init5',
      component: () => import('../views/CustomSelectorView5.vue')
    },
    {
      path: '/init6',
      name: 'init6',
      component: () => import('../views/CustomSelectorView6.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ]
})

export default router
