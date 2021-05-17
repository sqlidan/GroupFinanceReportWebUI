import fetch from 'utils/fetch';
import fetchNoJson from 'utils/fetchNoJson';
export function loginByEmail(userinfo) {
  return fetch({
    url: '/DBService/api/TokenAuth/Authenticate',
    method: 'post',
    data: userinfo
  });
}

export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/invalid',
    method: 'post',
    params: { token }
  });
}

export function getInfo(token) {
  return fetch({
    url: '/DBService/AbpUserConfiguration/GetAll',
    method: 'get',
    //params: { token }
  });
}

export function getMenus(token) {
  return fetch({
    url: '/api/admin/user/front/menus',
    method: 'get',
    params: { token }
  });
}

export function getAllMenus() {
  return fetch({
    url: '/api/admin/user/front/menu/all',
    method: 'get'
  });
}
