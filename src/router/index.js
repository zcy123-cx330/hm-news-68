import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register'

Vue.use(VueRouter)

const routes = [
  // 指定的每一个路由规则都可以提供一个name属性
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' }
]

const router = new VueRouter({
  routes
})

export default router
