import fetch from 'utils/fetch';
//获取人员列表(用于组织机构添加人员方法)
export function getUserList(obj) {
    return fetch({
      url: '/DBService/api/services/app/OrganizationUnit/FindAllUsers',
      method: 'post',
      data:obj
    });
  }

//根据部门获取人员列表
export function getUserListByOrgId(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/FindAllUsers',
    method: 'post',
    data: obj
  });
}

//添加用户到部门
export function insertUserToOrg(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/AddUsersToOrganizationUnit',
    method: 'post',
    data:obj
  });
}

//查询所有用户(用户模块)
export function getAllUserList(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/GetAllUsers',
    method: 'get',
    params:obj
  });
}

//根据userID获取用户
export function getUserInfoById(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/NewGetUserForEdit',
    method: 'post',
    data:obj
  });
}

//创建用户
export function createUser(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/NewCreateOrUpdateUser',
    method: 'post',
    data:obj
  });
}

//修改用户
export function updateUser(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/NewCreateOrUpdateUser',
    method: 'post',
    data:obj
  });
}

//删除用户
export function deleteBatchUser(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/BatchDelete',
    method: 'post',
    data:obj
  });
}
//获取用户下拉
export function getUserComboBox(obj) {
  return fetch({
    url: '/DBService/api/services/app/PublicComboxAppSevrice/GetUserComboBoxForEdit',
    method: 'get',
    params:obj
  });
}

//获取部门及部门下的人员，树形显示
export function getOrganizationUnitsAndUsersComboBox(obj) {
  return fetch({
    url: '/DBService/api/services/app/Combox/GetOrganizationUnitsAndUsers',
    method: 'get',
    params:obj
  });
}

//根据用户Id获取详情,角色、部门显示名称非Id
export function getUserDetailById(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/GetUserDetailById',
    method: 'get',
    params:obj
  });
}
//重置密码
export function ResetPassword(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/ResetPassword',
    method: 'post',
    data:obj,
    msg:'重置'
  });
}
//修改密码
export function UpdatePassword(obj) {
  return fetch({
    url: '/DBService/api/services/app/Common/UpdatePassword',
    method: 'put',
    data:obj,
    msg:'修改'
  });
}
//锁定解锁用户
export function LockUser(obj) {
  return fetch({
    url: '/DBService/api/services/app/User/UpdateIsActiveSwitchAsync',
    method: 'post',
    data:obj,
  });
}