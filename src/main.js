import Vue from 'vue';
import App from './App';
import router from './router';
import {constantRouterMap} from './router'
import store from './store';
import ElementUI from 'element-ui';
// import '@/assets/element-variables.scss'; // 换肤版本element-ui css
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css';// Progress 进度条 样式
import 'normalize.css/normalize.css';// normalize.css 样式格式化
import 'assets/iconfont/iconfont'; // iconfont 具体图标见https://github.com/PanJiaChen/vue-element-admin/wiki
import * as filters from './filters'; // 全局vue filter
import Multiselect from 'vue-multiselect';// 使用的一个多选框组件，element-ui的select不能满足所有需求
//import 'vue-multiselect/dist/vue-multiselect.min.css';// 多选框组件css
import Sticky from 'components/Sticky'; // 粘性header组件
import vueWaves from './directive/waves';// 水波纹指令
import errLog from 'store/errLog';// error log组件
import {getCookie} from 'utils/cookie';
import Icon from 'vue-svg-icon/Icon.vue' //引入
import './directives'
import {warnMsg} from 'utils/messageBox'

import bigDataSelect from './components/select/bigDataSelect'
import bigDataSelectColor from './components/select/bigDataSelectColor'
import VueQuillEditor from 'vue-quill-editor'
import Print from 'vue-print-nb'

import './styles/index.scss'; // 全局自定义的css样式
Vue.component('big-data-select', bigDataSelect)
Vue.component('big-data-select-color', bigDataSelectColor)
//Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
// Vue.component('icon-svg', IconSvg)
Vue.component('icon', Icon)
Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.use(VueQuillEditor);
Vue.use(Print);  //注册
// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

// register global progress.
 //const whiteList = ['/login', '/authredirect',];// 不重定向白名单
let whiteList = []
function whiteListDispose(arr) {
  constantRouterMap.forEach(item => {
    if(item.children && item.children.length > 0) {
      item.children.forEach(item1 => {
        whiteList.push(item.path + ((item1.path!='' && item1.path!='/')?'/':'') + item1.path)
      })
    }
    else {
      whiteList.push(item.path)
    }
  })
}
whiteListDispose(constantRouterMap)

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next()
  }else if (getCookie('Abp.AuthToken')) {   
    if (to.path === '/login') {
      next()
    } else {
      if (store.getters.addRouters.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(info => { // 拉取user_info
          
          const roles = Object.keys(info.result.auth.grantedPermissions)
          
          if(!info.result.auth.grantedPermissions||roles.length==0){
            warnMsg('当前用户没有权限')
            next({path:'/login'})
            // let baseUrl = process.env.REQUEST_SPLICING_QGIL_SSO_BASE_URL || '';
            // let codeCallbackUrl = process.env.REQUEST_SPLICING_QGIL_SSO_CODE_CALLBACK;
            // let pageUrl = window.location.href;
            // pageUrl = encodeURIComponent(pageUrl);
            // codeCallbackUrl = encodeURIComponent(codeCallbackUrl + pageUrl);
            // baseUrl = baseUrl + codeCallbackUrl;
            // window.location.href = baseUrl;
            return
          }
          store.dispatch('GenerateRoutes', { roles }).then((routeParse) => { // 根据roles权限生成可访问的路由表
            router.addRoutes(routeParse) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' });
          })
          // let baseUrl = process.env.REQUEST_SPLICING_QGIL_SSO_BASE_URL || '';
          // let codeCallbackUrl = process.env.REQUEST_SPLICING_QGIL_SSO_CODE_CALLBACK;
          // let pageUrl = window.location.href;
          // pageUrl = encodeURIComponent(pageUrl);
          // codeCallbackUrl = encodeURIComponent(codeCallbackUrl + pageUrl);
          // baseUrl = baseUrl + codeCallbackUrl;
          // window.location.href = baseUrl;
        })
      } else {
        next();
      }
    }
  } else {
    // next();
    //   return
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      // let baseUrl = process.env.REQUEST_SPLICING_QGIL_SSO_BASE_URL || '';
      // let codeCallbackUrl = process.env.REQUEST_SPLICING_QGIL_SSO_CODE_CALLBACK;
      // let pageUrl = window.location.href;
      // pageUrl = encodeURIComponent(pageUrl);
      // codeCallbackUrl = encodeURIComponent(codeCallbackUrl + pageUrl);
      // baseUrl = baseUrl + codeCallbackUrl;
      // window.location.href = baseUrl;
       //NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue(),
    charts: []
  }
})

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
