import fetch from 'utils/fetch';
//获取基础汇率列表
export function getExchangeRateList(obj) {
  return fetch({
    url: '/DBService/api/services/app/ExchangeRate/GetExchangeRateList',
    method: 'get',
    params: obj,
  });
}
//添加或修改基础汇率
export function exchangeRateAddEdit(obj,msg) {
  return fetch({
    url: '/DBService/api/services/app/ExchangeRate/ExchangeRateAddEdit',
    method: 'post',
    data: obj,
    msg:msg
  });
}
//根据Id获取基础汇率详情
export function getExchangeRateSingle(obj) {
  return fetch({
    url: '/DBService/api/services/app/ExchangeRate/GetExchangeRateSingle',
    method: 'get',
    params: obj,
  });
}
//批量删除基础汇率
export function batchDelete(obj) {
  return fetch({
    url: '/DBService/api/services/app/ExchangeRate/BatchDelete',
    method: 'post',
    data: obj,
    msg:"删除基础汇率"
  });
}