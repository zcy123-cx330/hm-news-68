// 全局注册过滤器
import Vue from 'vue'
import moment from 'moment'
// 全局定义过滤器
Vue.filter('time', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})
