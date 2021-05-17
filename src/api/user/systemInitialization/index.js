import fetch from 'utils/fetch';
//导入箱型信息
export function ImportCtnInfo(obj) {
    return fetch({
      url: '/DBService/api/services/app/ImportBasedata/ImportCtnInfo',
      method: 'post',
      data:obj
    });
  }

//导入国家
export function ImportCountry(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImportCountry',
    method: 'post',
    data: obj
  });
}

//导入港口
export function ImportPort(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImportPort',
    method: 'post',
    data:obj
  });
}

//导入船舶基础资料
export function ImprtShip(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImprtShip',
    method: 'post',
    data:obj
  });
}

//导入船公司箱型对照表
export function ImportCtnTypeContrast(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImportCtnTypeContrast',
    method: 'post',
    data:obj
  });
}

//导入包装类型
export function ImportPackageType(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImportPackageType',
    method: 'post',
    data:obj
  });
}

//导入包装类型对照表
export function ImportShipperPackageContrast(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImportShipperPackageContrast',
    method: 'post',
    data:obj
  });
}

//导入港口名称对照表
export function ImportPortContrast(obj) {
  return fetch({
    url: '/DBService/api/services/app/ImportBasedata/ImportPortContrast',
    method: 'post',
    data:obj
  });
}

