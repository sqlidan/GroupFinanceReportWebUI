import fetch from 'utils/fetch';

//科目余额导入
export function ImportAccountBalance(obj) {
    return fetch({
      url: '/DBService/api/services/app/AccountBalance/ImportAccountBalance',
      method: 'post',
      data:obj
    });
  }

  //科目余额查询
export function InquireAccountBalance(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/InquireAccountBalance',
    method: 'post',
    data:obj
  });
}
//获取单个科目余额信息
export function GetAccountBalanceById(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/GetAccountBalanceById',
    method: 'get',
    params:obj
  });
}
//新增编辑科目余额
export function CreateOrUpdateAccountBalance(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/CreateOrUpdateAccountBalance',
    method: 'post',
    data:obj,
    msg:"保存"
  });
}
//删除科目余额
export function Dels(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/Dels',
    method: 'post',
    data:obj,
    msg:"删除"
  });
}
//科目余额提交
export function SubmitAccountBalance(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/SubmitAccountBalance',
    method: 'post',
    data:obj,
    msg:"提交"
  });
}
//科目余额取消提交
export function CancelSubmit(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/CancelSubmit',
    method: 'post',
    data:obj,
    msg:"提交取消"
  });
}
//同意科目余额取消提交
export function AgreeCancelSubmit(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountBalance/AgreeCancelSubmit',
    method: 'post',
    data:obj,
    msg:"同意取消"
  });
}


