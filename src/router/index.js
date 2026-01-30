import { createRouter, createWebHistory } from 'vue-router'
import CardsPage from '../pages/CardsPage.vue'
import WordsPage from '../pages/WordsPage.vue'
import WordsSettings from '../pages/TablePage.vue'
import Test from '../components/Test.vue'   
const routes = [
  {
    path: '/',
    name: 'Cards',
    component: CardsPage
  },
  {
    path: '/words',
    name: 'Words',
    component: WordsPage
  },
  {
    path: '/wordsSettings',
    name: 'WordsSettings',
    component: WordsSettings
  },
   {
    path: '/test',
    name: 'Test',
    component: Test
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
