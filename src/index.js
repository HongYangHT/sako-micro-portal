/*
 * @Author: sam.hongyang
 * @LastEditors: sam.hongyang
 * @Description: 微前端工程入口，加载相关的配置文件
 * @Date: 2019-07-19 11:35:35
 * @LastEditTime: 2019-07-26 17:59:07
 */
import * as singleSpa from 'single-spa'
import { registerApp } from '@/micro'

import Vue from 'vue'
import 'iview/dist/styles/iview.css'
import { LoadingBar } from 'iview'

Vue.use(LoadingBar)

// NOTE: 测试静态图片和css中字体配置
// import img from './asset/img/qw.png'
// import react from './asset/img/react.png'
// eslint-disable-next-line
// new Vue({
//   el: "#app",
//   render: h =>
//     h(
//       "div",
//       {
//         class: "aaa"
//       },
//       [
//         h("img", {
//           attrs: {
//             src: img
//           }
//         }),
//         h("img", {
//           attrs: {
//             src: react
//           }
//         })
//       ]
//     )
// });

export function startSingleSpa() {
  let apps = []
  try {
    return new Promise(async (resolve, reject) => {
      window.appConfigs.forEach(async item => {
        // eslint-disable-next-line
        let app = await SystemJS.import(item);
        apps.push(registerApp(app))
      })
      await Promise.all(apps)
      resolve()
    })
  } catch (e) {
    console.error(`Can't load apps with ${e.message}`)
  }
}

startSingleSpa().then(() => {
  singleSpa.start()
  window.addEventListener('single-spa:before-routing-event', evt => {
    LoadingBar.start()
  })
  window.addEventListener('single-spa:routing-event', evt => {
    LoadingBar.finish()
  })
  window.addEventListener('single-spa:no-app-change', evt => {
    LoadingBar.error()
  })
})
