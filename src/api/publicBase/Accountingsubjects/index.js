import fetch from 'utils/fetch';

//查询会计科目信息
export function GetAccountSubjectQueryList(obj) {
    return fetch({
      url: '/DBService/api/services/app/AccountSubject/GetAccountSubjectQueryList',
      method: 'get',
      params:obj
    });
  }
  //获取单个会计科目信息
export function GetAccountById(obj) {
  return fetch({
    url: '/DBService/api/services/app/AccountSubject/GetAccountByIdAsync',
    method: 'get',
    params:obj
  });
}

  //新增编辑会计科目信息
export function CreateOrUpdateAccount(obj) {
    return fetch({
      url: '/DBService/api/services/app/AccountSubject/CreateOrUpdateAccount',
      method: 'post',
      data:obj,
      msg:"保存"
    });
  }

  //批量删除会计科目信息
export function BathDeleteAccount(obj) {
    return fetch({
      url: '/DBService/api/services/app/AccountSubject/BathDeleteAccount',
      method: 'post',
      data:obj,
      msg:"删除"
    });
  }
