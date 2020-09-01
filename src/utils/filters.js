// 全局注册过滤器
import Vue from 'vue'
import moment from 'moment'
// 全局定义过滤器
Vue.filter('time', input => {
  return moment(input).format('YYYY-MM-DD')
})
