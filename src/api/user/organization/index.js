import fetch from 'utils/fetch';
//获取组织机构树
export function getOrganizatonTree() {
    return fetch({
      url: '/DBService/api/services/app/OrganizationUnit/GetNewOrganizationUnits',
      method: 'get'
    });
  }
//获取组织机构树（不统计部门子公司）
export function getOrganizatonTreeNoUsers(obj) {
  return fetch({
    url: '/DBService//api/services/app/Common/GetNewOrganizationUnitNoUsers',
    method: 'get',
    params:obj
  });
}
//根据公司获取下属部门
export function GetDeptUnitList(obj) {
  return fetch({
    url: '/DBService//api/services/app/Common/GetDeptUnitList',
    method: 'get',
    params:obj
  });
}
//根据公司获取部门所属
export function GetDepList(obj) {
  return fetch({
    url: '/DBService//api/services/app/Common/GetDepList',
    method: 'get',
    params:obj
  });
}
//查询公司下所有部门信息（下拉）
export function GetOrganizationUnitUsers(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/GetOrganizationUnitUsers',
    method: 'get',
    params:obj
  });
}
//查询公司下所有子公司信息
export function GetOrganizationUnitOrg(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/GetOrganizationUnitOrg',
    method: 'get',
    params:obj
  });
}

//根据部门ID获取公司详情
export function getOrgDetailById(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/GetOrganizationUnitForEdit',
    method: 'get',
    params:obj
  });
}

//根据部门ID获取部门详情
export function GetDepartmentForEdit(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/GetDepartmentForEdit',
    method: 'get',
    params:obj
  });
}
//添加部门
export function createdepartment(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/CreateDept',
    method: 'post',
    data: obj
  });
}

//修改部门
export function updatedepartment(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/UpdateDept',
    method: 'put',
    data: obj
  });
}
//修改部门
export function DeleteDept(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/DeleteDept',
    method: 'DELETE',
    params: obj
  });
}

//添加组织机构树
export function createOrganizaton(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/CreateOrganizationUnit',
    method: 'post',
    data: obj
  });
}

//修改组织机构树
export function updateOrganizaton(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/UpdateOrganizationUnit',
    method: 'put',
    data: obj
  });
}

//删除组织机构
export function deleteOrganizaton(obj) {
  return fetch({
    url: '/DBService/api/services/app/OrganizationUnit/DeleteOrganizationUnit',
    method: 'delete',
    params: obj
  });
}
