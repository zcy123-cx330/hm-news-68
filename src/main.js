import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/base.less'
import './style/iconfont.css'
import Vant from 'vant'
// 导入amfe-flexible库
import 'amfe-flexible'
import HmHeader from './components/HmHeader.vue'

import 'vant/lib/index.css'
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
