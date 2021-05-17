import fetch from 'utils/fetch';
//获取公告信息列表
export function getList(obj) {
  return fetch({
    url: '/DBService/api/services/app/GovernmentNoticeInfo/GetBaseGovernmentNotice',
    method: 'get',
    params: obj
  });
}

//根据ID获取公告信息
export function getOne(obj) {
  return fetch({
    url: '/DBService/api/services/app/GovernmentNoticeInfo/GetBaseGovernmentNoticeEdit',
    method: 'get',
    params: obj
  });
}

//新建或修改公告信息
export function createOrUpdateInfo(obj,msg) {
  return fetch({
    url: '/DBService/api/services/app/GovernmentNoticeInfo/AddEditBaseGovernmentNotice',
    method: 'post',
    data: obj,
    msg:msg
  });
}

//批量删除港口信息
export function batchDeleteInfo(obj) {
  return fetch({
    url: '/DBService/api/services/app/GovernmentNoticeInfo/BathDeleteBaseGovernmentNotice',
    method: 'post',
    data: obj,
    msg:"删除公告及规定"
  });
}
