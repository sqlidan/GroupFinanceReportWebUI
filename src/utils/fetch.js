import axios from 'axios';
import {Message,MessageBox} from 'element-ui';
import store from '../store';
import {getToken} from 'utils/auth';
import {getCookie} from 'utils/cookie';
import {warnMsg, errorMsg, successMsg} from 'utils/messageBox'
import {data_priv} from './data'

axios.defaults.headers['Content-Type'] = 'application/json'


// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // timeout: 10 * 10000000, // 请求超时时间
  withCredentials: true,
  msg: '',
});

// request拦截器
service.interceptors.request.use(config => {
  //config.headers['Abp.TenantId'] = 1
  if(process.env.NODE_ENV === 'production'){
    config.url = 'http://222.173.95.170:9518'+config.url
  }
  if (getCookie('Abp.AuthToken')) {//store.getters.token
    config.headers['Authorization'] = 'Bearer ' + getCookie('Abp.AuthToken'); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }

  if (getCookie('Abp.TenantId')) {
    config.headers['Abp.TenantId'] = getCookie('Abp.TenantId'); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  // if (store.getters.tenantId) {
  //   config.headers['Abp.TenantId'] = store.getters.tenantId; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  // }

  return config;
}, error => {
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const res = response.data;
    if (response.status === '401') {

    }
    //状态码3001要特殊处理
    if(res.success && response.config.msg) {
      if(res.result && res.result.code == 3001){

      }else {
        successMsg(`${response.config.msg}成功`)
      }
        
    }
    

    if (response.status !== 200 && res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      return response.data;
    }
  },
  err => {
    
    if(err.response.data.success === false && err.response.data.error.code == 3000) {
      errorMsg(err.response.data.error.message)
    }
    //登录权限
    if(err.response.data.success === false && err.response.data.error.code === 0) {
      errorMsg(err.response.data.error.message)
    }

    if(err.code == 'ECONNABORTED' && err.message.indexOf('timeout')!=-1)
    {
      Message({
        message: '请求数据超时，请刷新页面后重试',
        duration:3000,
        showClose:true,
        type: 'error'
      });
    }
    return Promise.reject(err);
  }
);


export default service;
