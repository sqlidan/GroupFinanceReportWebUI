import fetch from 'utils/fetch'
//获取字典类型树
export function getDicTypeTree(obj) {
    return fetch({
      url: '/DBService/api/services/app/BaseKey_ValueType/GetAllTypeList',
      method: 'get',
      params: obj,
    })
  }

//新增修改字典类型
export function createOrUpdateDicType(obj) {
  return fetch({
    url: '/DBService/api/services/app/BaseKey_ValueType/CreateOrUpdateBaseKey_ValueType',
    method: 'post',
    data: obj,
  })
}

//删除字典类型
export function deleteDicType(obj) {
  return fetch({
    url: '/DBService/api/services/app/BaseKey_ValueType/DeleteBaseKey_ValueType',
    method: 'post',
    params: obj,
  })
}



//获取字典项列表
export function getDicList(obj) {
  return fetch({
    url: '/DBService/api/services/app/BaseKey_Value/GetBaseKey_Value',
    method: 'get',
    params: obj,
  })
}

//根据ID获取单个字典项
export function getSingleDicItem(obj) {
  return fetch({
    url: '/DBService/api/services/app/BaseKey_ValueType/GetSingle',
    method: 'get',
    params: obj,
  })
}

//新增修改字典项
export function createOrUpdateDicItem(obj) {
  return fetch({
    url: '/DBService/api/services/app/BaseKey_Value/CreateOrUpdateBaseKey_Value',
    method: 'post',
    data: obj,
  })
}

//删除字典项
export function deleteDicItem(obj) {
  return fetch({
    url: '/DBService/api/services/app/BaseKey_Value/DeleteBaseKey_Value',
    method: 'post',
    params: obj,
  })
}

//根据字典类型获取字典数据（用于下拉框）
export function getDicListByDitType(obj) {
  return fetch({
    url: '/DBService/api/services/app/PublicComboxAppSevrice/GetBaseKeyValueComboBox',
    method: 'get',
    params: obj,
  })
}
// 获取国家下拉
export function getCountryComboBox(obj) {
  return fetch({
    url: '/DBService/api/services/app/PublicComboxAppSevrice/GetCountryComboBox',
    method: 'get',
    params: obj,
  })
}
// 获取城市下拉
export function getCityComboBox(obj) {
  return fetch({
    url: '/DBService/api/services/app/PublicComboxAppSevrice/GetCityComboBox',
    method: 'get',
    params: obj,
  })
}

