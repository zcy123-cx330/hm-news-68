/*
// 用于全局注册组件
*/
import Vue from 'vue'
import HmHeader from '../components/HmHeader.vue'
import HmLog from '../components/HmLog.vue'
import HmNavItiem from '../components/HmNavItem.vue'
// 全局注册导航栏
Vue.component('hm-navitem', HmNavItiem)
// 全局注册login
Vue.component('hm-log', HmLog)
// 全局注册组件头部
Vue.component('hm-header', HmHeader)
