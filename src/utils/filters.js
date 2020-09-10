// 全局注册过滤器
import Vue from 'vue'
import moment from 'moment'
// 给moment全局的定义语言环境
moment.locale('zh-CN')
// 全局定义过滤器
Vue.filter('time', (input, str = 'YYYY-MM-DD') => {
  return moment(input).format(str)
})

Vue.filter('now', input => {
  return moment(input).fromNow()
})
