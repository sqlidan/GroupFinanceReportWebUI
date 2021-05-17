import fetch from 'utils/fetch';

//获取费目列表
export function getList(obj) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/GetFeeItemList',
    method: 'get',
    params: obj
  });
}


//根据id获取费目编辑
export function getSingle(obj) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/GetFeeItemSingle',
    method: 'get',
    params: obj
  });
}

//批量删除费目信息
export function batchDelete(obj) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/BatchDelete',
    method: 'post',
    data: obj,
    msg: "删除费目"
  });
}


//创建费目信息
export function addEdit(obj, msg) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/FeeItemAddEdit',
    method: 'post',
    data: obj,
    msg: msg
  });
}

//获取税收分类编码id下拉
export function getTaxClassificationID(obj) {
  return fetch({
    url: '/DBService/api/services/app/PublicComboxAppSevrice/GetTaxClassificationID',
    method: 'get',
    params: obj,
  });

}

//提交财务功能
export function submitFinanceOperate(obj) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/SubmitFinance',
    method: 'post',
    data: obj,
    msg: "提交财务"
  });
}

//财务审核功能
export function financialAuditOperate(obj) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/FinancialAudit',
    method: 'post',
    data: obj,
    msg: "财务审核"
  });
}

//财务驳回功能
export function financialRejectOperate(obj) {
  return fetch({
    url: '/DBService/api/services/app/FeeItem/FinancialReject',
    method: 'post',
    data: obj,
    msg: "财务驳回"
  });
}