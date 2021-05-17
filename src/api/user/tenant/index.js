import fetch from 'utils/fetch';
//获取下拉列表
export function getTenantList() {
    return fetch({
      url: '/DBService/api/services/app/Tenant/getTenantsComboItemDtoList',
      method: 'get'
    });
  }

//登陆选择租户时调用
export function IsTenantAvailable(obj) {
  return fetch({
    url: '/DBService/api/services/app/Account/IsTenantAvailable',
    method: 'POST',
    data: obj
  });
}
//获取租户列表
export function getTenants(obj){
  return fetch({
    url: '/DBService/api/services/app/Tenant/GetTenants',
    method: 'get',
    params:obj
  });
}
//获取单个租户编辑
export function getTenantForEdit(obj){
  return fetch({
    url: '/DBService/api/services/app/Tenant/GetTenantForEdit',
    method: 'get',
    params: obj
  });
}
//新增租户
export function createTenant(obj){
  return fetch({
    url: '/DBService/api/services/app/Tenant/CreateTenant',
    method: 'post',
    data:obj
  });
}


export function deleteTenant(obj){
  return fetch({
    url: '/DBService/api/services/app/Tenant/DeleteTenant',
    method: 'post',
    data:obj
  });
}
export function LogOut() {
  return fetch({
    url: '/DBService/api/TokenAuth/LogOut',
    method: 'get'
  });
}