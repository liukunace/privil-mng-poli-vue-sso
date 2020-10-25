/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import token from '@/oauth2/utils/token.js'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
import config from '@/oauth2/config/config.js'

import oauth2login from '@/oauth2/login/oauth2login';
import oauth2logout from '@/oauth2/login/oauth2logout';

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  //{ path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  // {
  //   path: '/oautflogirxfxfX6acojcofaciasdfcas',
  //   name: 'login',
  //   component: oauth2login
  // },
  // {
  //   path: '/logout',
  //   name: 'oauth2logout',
  //   component: oauth2logout
  // }
]

const loginRouteLocal={
  path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' }
}

const loginRouteSSO={
  path: '/oautflogirxfxfX6acojcofaciasdfcas',
  name: 'login',
  component: oauth2login
}

const logoutRouteSSO={
  path: '/logout',
  name: 'oauth2logout',
  component: oauth2logout
}

if(config.using){
  globalRoutes.push(loginRouteSSO);
  globalRoutes.push(logoutRouteSSO);
}else{
  globalRoutes.push(loginRouteLocal);
}

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
  ],

  //if sso 注释以下内容
  // beforeEnter(to, from, next) {
  //   let token = Vue.cookie.get('token')
  //   if (!token || !/\S/.test(token)) {
  //     clearLoginInfo()
  //     console.log("token 失效 --- router.js--line 78");
  //     next({ name: 'login' })
  //     //this.$router.push({ name: 'login' }) //       //this.$router.未定义
  //   }
  //   next()
  // }

}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {

  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    if(config.using){
      http({
        //url: http.adornUrl('/sys/menu/nav'),
        url: http.adornUrl('/mas/navall/admin'),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          fnAddDynamicMenuRoutes(data.menuList) // 此处只需要配置动态路由，菜单缓存在初次进home后组装
          router.options.isAddDynamicMenuRoutes = true
          next({ ...to, replace: true })
        } else {
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
          next()
        }
      }).catch((e) => {
        console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
        //Vue.login.reLogin(Vue);//reLogin undefined
      })
    }else{
      http({
        url: http.adornUrl('/sys/menu/nav'),
        method: 'get',
        params: http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var sysmenuList = [];
          var len = data.menuList.length;
          for (var i = 0; i < len; i++) {
            if (data.menuList[i].menuId < 1000) {
              sysmenuList.push(data.menuList[i]);
            }
          }
          fnAddDynamicMenuRoutes(data.menuList)
          router.options.isAddDynamicMenuRoutes = true
          sessionStorage.setItem('menuList', JSON.stringify(sysmenuList || '[]'))
          sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
          next({ ...to, replace: true })
        } else {
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
          next()
        }
      }).catch((e) => {
        console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
        router.push({ name: 'login' })
        //var url = 'https://cas.server.com:843/cas/oauth2.0/authorize?response_type=code&client_id=helloworld&redirect_uri=http://localhost:8001'
        //window.location.href = url
      })

    }
  }
    //else over

})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))

  }
}

export default router
