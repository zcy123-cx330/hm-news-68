import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/base.less'
import './style/iconfont.css'
import Vant from 'vant'
import 'vant/lib/index.css'
// import Vue from 'vue'
// import { Button } from 'vant'
Vue.use(Vant)
// Vue.use(Button)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
