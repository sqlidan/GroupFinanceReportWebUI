import fetch from 'utils/fetch';

//查询特殊费用信息
export function GetSpecialFeeQueryList(obj) {
    return fetch({
      url: '/DBService/api/services/app/SpecialFee/GetSpecialFeeQueryList',
      method: 'get',
      params:obj
    });
  }
  //获取单个特殊费用信息
export function GetSpecialFeeById(obj) {
  return fetch({
    url: '/DBService/api/services/app/SpecialFee/GetSpecialFeeByIdAsync',
    method: 'get',
    params:obj
  });
}

  //新增编辑特殊费用信息
export function CreateOrUpdateSpecialFee(obj) {
    return fetch({
      url: '/DBService/api/services/app/SpecialFee/CreateOrUpdateSpecialFee',
      method: 'post',
      data:obj,
      msg:"保存"
    });
  }

  //批量删除特殊费用信息
export function BathDeleteSpecialFee(obj) {
    return fetch({
      url: '/DBService/api/services/app/SpecialFee/BathDeleteSpecialFee',
      method: 'post',
      data:obj,
      msg:"删除"
    });
  }
