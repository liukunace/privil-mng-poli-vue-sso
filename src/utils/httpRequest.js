import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'
import login from '@/oauth2/utils/loginUtil.js'
import config from '@/oauth2/config/config.js'


const http2 = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http2.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
// http2.interceptors.response.use(response => {
//   if (response.data && response.data.code === 401) { // 401, token失效
//     console.log("token 失效 --- httpRequest--line 29");
//     //Vue.cookie.set('token', "51bff8e465f48533581d92112");
//     //clearLoginInfo()
//     //login.logout(Vue, config.local_base_url + config.home_url + '');
//     //router.push({ name: 'login' })
//     //var url = 'https://cas.server.com:843/cas/oauth2.0/authorize?response_type=code&client_id=helloworld&redirect_uri=http://localhost:8001'
//     //window.location.href = url

// //清除cookie
//     // let usernametemp = this.$cookies.get("username");
//     //     this.$cookies.remove(usernametemp);
//     //     this.$token.deleteToken();
//     //     localStorage.removeItem("ms_username");
// //重新登录
//     // var logouturi =
//     //   config.base_oauth_url +
//     //   config.logout_url +
//     //   "?service=" +
//     //   config.local_base_url +
//     //   "/"; 
//     // window.location.href = logouturi;

//   }
//   return response
// }, error => {
//   return Promise.reject(error)
// })

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http2.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http2.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http2.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

const http = http2;

export default http
