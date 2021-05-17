import fetch from 'utils/fetch';

//合资公司预算导入
export function ImportReport(obj) {
    return fetch({
      url: '/DBService/api/services/app/AnalysisReport/ImportReportAsync',
      method: 'post',
      data:obj
    });
  }

  //合资公司预算查询
export function GetReportQueryList(obj) {
  return fetch({
    url: '/DBService/api/services/app/AnalysisReport/PostReportQueryList',
    method: 'post',
    data:obj
  });
}
//获取单个合资公司预算信息
export function GetReportById(obj) {
  return fetch({
    url: '/DBService/api/services/app/AnalysisReport/GetReportById',
    method: 'get',
    params:obj
  });
}
//新增编辑合资公司预算
export function CreateOrUpdateReport(obj) {
  return fetch({
    url: '/DBService/api/services/app/AnalysisReport/CreateOrUpdateReport',
    method: 'post',
    data:obj,
    msg:"保存"
  });
}
//删除合资公司预算
export function BathDeleteBudget(obj) {
  return fetch({
    url: '/DBService/api/services/app/AnalysisReport/BathDeleteBudget',
    method: 'post',
    data:obj,
    msg:"删除"
  });
}



