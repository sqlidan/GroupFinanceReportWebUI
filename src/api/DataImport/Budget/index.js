import fetch from 'utils/fetch';

//预算导入
export function ImportBudget(obj) {
    return fetch({
      url: '/DBService/api/services/app/Budget/ImportBudget',
      method: 'post',
      data:obj
    });
  }

  //预算查询
export function GetBudgetQueryList(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/GetBudgetQueryList',
    method: 'get',
    params:obj
  });
}
//获取单个预算信息
export function GetBudgetById(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/GetBudgetById',
    method: 'get',
    params:obj
  });
}
//新增编辑预算
export function CreateOrUpdateBudget(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/CreateOrUpdateBudget',
    method: 'post',
    data:obj,
    msg:"保存"
  });
}
//删除预算
export function DeleteBudget(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/BathDeleteBudget',
    method: 'post',
    data:obj,
    msg:"删除"
  });
}
//预算提交
export function SubmitBudget(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/SubmitBudget',
    method: 'post',
    data:obj,
    msg:"提交"
  });
}
//预算取消提交
export function CancelSubmit(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/CancelSubmit',
    method: 'post',
    data:obj,
    msg:"提交取消"
  });
}
//同意预算取消提交
export function AgreeCancelSubmit(obj) {
  return fetch({
    url: '/DBService/api/services/app/Budget/AgreeCancelSubmit',
    method: 'post',
    data:obj,
    msg:"同意取消"
  });
}


