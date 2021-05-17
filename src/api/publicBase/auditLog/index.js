import fetch from 'utils/fetch';
//获取审计日志
export function GetAuditLogLists(obj) {
  return fetch({
    url: '/DBService/api/services/app/AuditLog/GetAuditLogLists',
    method: 'get',
    params: obj
  });
}
