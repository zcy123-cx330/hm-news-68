import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/user/Login'
import Register from '../views/user/Register'
import User from '../views/user/User.vue'
import UserEdit from '../views/user/UserEdit.vue'
import Demo from '../views/user/Demo.vue'
import MyFollow from '../views/user/MyFollow.vue'
import MyComment from '../views/user/MyComment.vue'
import MyStar from '../views/user/MyStar.vue'
import Index from '../views/news/Index.vue'
import Manage from '../views/news/Manage.vue'
import PostDetail from '../views/news/PostDetail.vue'
import Search from '../views/news/Search.vue'

Vue.use(VueRouter)

// 全局的把push的异常给处理了
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 指定的每一个路由规则都可以提供一个name属性
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  { path: '/user', component: User, name: 'user' },
  { path: '/user-edit', component: UserEdit, name: 'user-edit' },
  { path: '/demo', component: Demo, name: 'demo' },
  { path: '/my-follow', component: MyFollow, name: 'my-follow' },
  { path: '/mycomment', component: MyComment, name: 'mycomment' },
  { path: '/mystar', component: MyStar, name: 'mystar' },
  { path: '/', component: Index, name: 'index' },
  { path: '/manage', component: Manage, name: 'manage' },
  { path: '/post-detail/:id', component: PostDetail, name: 'post-detail' },
  { path: '/search', component: Search, name: 'search' }
]

const router = new VueRouter({
  routes
})

// 判断 to的path 是否是/user 判断用户是否是去个人中心
// 1. 如果不是去个人中心  next() 放行
// 2. 如果是去个人中心 判断是否有token
//  如果有， 放行
//  如果没有， 跳转到登录去
router.beforeEach(function(to, from, next) {
  // 只要路由发生跳转，跳转之前这个函数就要执行
  // console.log('前置导航守卫执行了')
  // console.log('to', to)
  // console.log('from', from)
  // if (to.name === 'user') {
  //   const token = localStorage.getItem('token')
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('/login')
  //   }
  // } else {
  //   next()
  // }
  const token = localStorage.getItem('token')
  // 需要拦截的所有页面
  const authUrls = ['/user', '/user-edit', '/my-follow', '/mycomment', '/mystar']
  // includes 代表包含所有的   ！取反
  if (!authUrls.includes(to.path) || token) {
    next()
  } else {
    router.push('/login')
  }
})
export default router
