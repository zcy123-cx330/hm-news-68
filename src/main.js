import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/base.less'
import './style/iconfont.css'
import Vant from 'vant'
// 导入amfe-flexible库
import 'amfe-flexible'
import HmHeader from './components/HmHeader.vue'
// 导入HMLOGIN
import HmLog from './components/HmLog.vue'
import 'vant/lib/index.css'
// 导入axios
import axios from 'axios'

// 把axios挂载到vue的原型上
Vue.prototype.$axios = axios
// 给axios配置默认的baseURL,基准地址
axios.defaults.baseURL = 'http://localhost:3000'
// 全局注册login
Vue.component('hm-log', HmLog)
// 全局注册组件头部
Vue.component('hm-header', HmHeader)
// import Vue from 'vue'
// import { Button } from 'vant'
Vue.use(Vant)
// Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
