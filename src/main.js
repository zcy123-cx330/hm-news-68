import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 全局通用样式
import './style/base.less'
import './style/iconfont.css'

// 导入amfe-flexible库
import 'amfe-flexible'

// 全局注册组件
import './utils/global.js'
// 全局注册axios请求
import './utils/request.js'
// 全局注册过滤器
import './utils/filters.js'
// 全局导入vant
import './utils/vant.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
