import fetch from 'utils/fetch';
  //公司注册
  export function getCompanyRegiste(obj) {
    return fetch({
      url: '/DBService/api/services/app/Register/CompanyRegister',
      method: 'post',
      data:obj
    });
  }
    //个人注册
export function getUserRegister(obj) {
    return fetch({
      url: '/DBService/api/services/app/Register/UserRegister',
      method: 'post',
      data:obj
    });
  }
      //上传
export function getAnnexUpload(obj) {
  return fetch({
    url: '/DBService/api/services/app/Annex/AnnexUpload',
    method: 'post',
    data:obj
  });
}
//检验公司名是否存在
export function getCompanyByCompanyCNName(obj) {
  return fetch({
    url: '/DBService/api/services/app/Register/GetCompanyByCompanyCNName',
    method: 'get',
    params:obj
  });
}