import fetch from 'utils/fetch';
//根据用户工号获取用户所在的租户列表
export function getTenantByUserCode(obj) {
  return fetch({
    url: '/DBService/api/Login/GetTenantByUserCode',
    method: 'get',
    params: obj
  });
}

//根据用户工号获取用户所在的租户列表
export function singleLogIn(obj) {
  return fetch({
    url: '/DBService/api/Login/SingleLogIn',
    method: 'post',
    data: obj
  });
}