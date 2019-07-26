/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 微前端模块加载器, 用于判断相关路由情况
 * @Date: 2019-07-19 14:26:18
 * @LastEditTime: 2019-07-26 17:56:05
 */
import * as singleSpa from 'single-spa'

// hash 模式,项目路由用的是hash模式会用到该函数
export function hashPrefix(app) {
  return function(location) {
    let isShow = false
    // 如果该应用 有多个需要匹配的路劲
    if (isArray(app.path)) {
      app.path.forEach(path => {
        if (location.hash.startsWith(`#${path}`)) {
          isShow = true
        }
      })
    }
    // 普通情况
    else if (location.hash.startsWith(`#${app.path || app.url}`)) {
      isShow = true
    }
    return isShow
  }
}

// pushState 模式
export function pathPrefix(app) {
  return function(location) {
    let isShow = false
    // 如果该模块 有多个需要匹配的路径
    if (isArray(app.path)) {
      app.path.forEach(path => {
        if (
          location.pathname.indexOf(`${path}`) === 0 ||
          location.pathname.indexOf(`${path}/`) === 0
        ) {
          isShow = true
        }
      })
    }
    // 普通情况
    else if (
      location.pathname.indexOf(`${app.path || app.url}`) === 0 ||
      location.pathname.indexOf(`${app.path || app.url}/`) === 0
    ) {
      isShow = true
    }
    return isShow
  }
}

// 应用注册
export async function registerApp(params) {
  const customProps = {
    domElement: `#${params.name}`
  }
  await singleSpa.registerApplication(
    params.name,
    // eslint-disable-next-line
    async () => await SystemJS.import(params.main),
    params.mode === 'history' ? pathPrefix(params) : hashPrefix(params),
    customProps
  )

  if (params.base && location.pathname === '/') {
    singleSpa.navigateToUrl(params.path)
  }
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}
