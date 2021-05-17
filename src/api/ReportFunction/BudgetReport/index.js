import fetch from 'utils/fetch';

//报表查询
export function InquireProfitStatement(obj) {
    return fetch({
      url: '/DBService/api/services/app/Report/InquireProfitStatement',
      method: 'post',
      data:obj
    });
  }
//报表导出
export function ExportFile(obj) {
  return fetch({
    url: '/DBService/api/services/app/Report/ExportFile',
    method: 'post',
    data:obj,
    msg:'导出'
  });
}


  





