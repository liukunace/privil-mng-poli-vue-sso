import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'

Vue.use(VueCookie)
Vue.config.productionTip = false

import VueResource from 'vue-resource'
Vue.use(VueResource);

Vue.prototype.$cookies = VueCookie;

import querystring from 'querystring'
Vue.prototype.$querystring = querystring;

import axios from 'axios'
Vue.prototype.$ajax = axios;

import token from '@/oauth2/utils/token.js'
import login from '@/oauth2/utils/loginUtil.js'
import config from '@/oauth2/config/config.js'

Vue.prototype.$config = config;
let abc=config.using
if(abc){
  Vue.prototype.$token = token;
  Vue.prototype.$login = login;
}

// 挂载全局
Vue.prototype.$httpk = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

import ol from 'zmap-ui/src/ol/ol.js';
import Defined from 'zmap-ui/src/components/zmapConfig.js'
Vue.prototype.$ol = ol;
Vue.prototype.$def = Defined

import ZMapUI from 'zmap-ui'
import 'zmap-ui/dist/zmap.css'
Vue.use(ZMapUI)


// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
