import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/reader/:id',
      name: 'reader',
      component: () => import('../views/ReaderView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/import',
      name: 'import',
      component: () => import('../views/ImportView.vue'),
    },
    {
      path: '/batch-import',
      name: 'batch-import',
      component: () => import('../views/BatchImportView.vue'),
    },
    {
      path: '/test-import',
      name: 'test-import',
      component: () => import('../views/TestImportView.vue'),
    },
    {
      path: '/dev-reader',
      name: 'dev-reader',
      component: () => import('../components/DevReader.vue'),
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharacterGallery.vue'),
    },
  ],
})

export default router
