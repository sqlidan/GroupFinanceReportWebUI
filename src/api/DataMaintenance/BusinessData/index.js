import fetch from 'utils/fetch';

//查询业务数据信息
export function GetBusinessDataQueryList(obj) {
    return fetch({
      url: '/DBService/api/services/app/BusinessData/GetBusinessDataQueryList',
      method: 'get',
      params:obj
    });
  }
  //获取单个业务数据信息
export function GetBusinessDataById(obj) {
  return fetch({
    url: '/DBService/api/services/app/BusinessData/GetBusinessDataByIdAsync',
    method: 'get',
    params:obj
  });
}

  //新增编辑业务数据信息
export function CreateOrUpdateBusinessData(obj) {
    return fetch({
      url: '/DBService/api/services/app/BusinessData/CreateOrUpdateBusinessData',
      method: 'post',
      data:obj,
      msg:"保存"
    });
  }

  //批量删除业务数据信息
export function BathDeleteBusinessData(obj) {
    return fetch({
      url: '/DBService/api/services/app/BusinessData/BathDeleteBusinessData',
      method: 'post',
      data:obj,
      msg:"删除"
    });
  }
