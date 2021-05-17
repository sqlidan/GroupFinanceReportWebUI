import fetch from 'utils/fetch';
//获取角色列表
export function getRoleList(obj) {
    return fetch({
      url: '/DBService/api/services/app/Role/GetRoles',
      method: 'get',
      params:obj
    });
  }

//添加角色
export function insertRole(obj) {
  return fetch({
    url: '/DBService/api/services/app/Role/CreateOrUpdateRole',
    method: 'POST',
    data:obj
  });
}

//根据角色ID获取权限
export function getPermissionsByRoleId(obj){
  return fetch({
    url: '/DBService/api/services/app/Role/GetPermissionsbyRoleId',
    method: 'get',
    params:obj
  })
}

//修改角色名称
export function updateRoleName(obj) {
  return fetch({
    url: '/DBService/api/services/app/Role/UpdateRoleNameAsync',
    method: 'put',
    data:obj
  });
}

//修改菜单按钮权限
export function updateRolePermissions(obj) {
  return fetch({
    url: '/DBService/api/services/app/Role/UpdateRolePermissionsAsync',
    method: 'put',
    data:obj
  });
}

//删除角色
export function deleteRoleById(obj) {
  return fetch({
    url: '/DBService/api/services/app/Role/DeleteRole',
    method: 'delete',
    params:obj
  });
}

//获取角色下拉列表
export function getRoleSelectList(obj) {
  return fetch({
    url: '/DBService/api/services/app/Common/GetRolesList',
    method: 'get',
    params:obj
  });
}