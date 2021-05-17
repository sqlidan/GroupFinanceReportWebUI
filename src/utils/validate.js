
/* 是否是公司邮箱*/
export function isWscnEmail(str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@wallstreetcn\.com$/i;
  return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
  //const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

  const urlregex= /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]*$/;
  
  return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

//英文特殊字符
export const englishOrCharacter = /^[^0-9\u4e00-\u9fa5]+$/
//税号
export const taxNumber = /^[0-9a-zA-Z]{18}$/
//中文特殊字符
export const chineOrCharacter = /^[^0-9a-zA-Z]+$/
//英文数字
export const englishOrNumber = /^[0-9a-zA-Z_]*$/
//英文数字空格
export const englishOrNumber2 = /^[0-9a-zA-Z_ ]*$/
//英文
export const english = /^[a-zA-Z]+$/
//数字
export const numbers = /^[0-9]+$/
//中文数字
export const chineOrNumbers = /^[0-9\u4e00-\u9fa5]*$/
//仅零0
export const zeros = /^(0)(\.[0]+)?$/g
//小数或整数或0
export const decimals = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g

//#region 这些不常用
//小数或0（不包括整数）
export const decimalsNoZNums = /^[+-]?[0-9]+.?[0-9]*$/
//（正）小数或0（不包括整数）
export const positiveDecimalsNoZNums = /^[+]?[0-9]+.?[0-9]*$/
//（正）整数（不包括0）
export const positiveNumsNoZ = /^[+]?[1-9]\d*$/
//（正）整数或（正）小数或0（用于可以为0的金额）
export const positiveDecimals = /^[+]?(0|([1-9]\d*))(\.\d+)?$/g
//#endregion

//不能输入英文
export const noEnglish = /^[^a-zA-Z]+$/
//不能输入中文
export const noChinese = /^[^\u4e00-\u9fa5]+$/
//不能输入中文和空格
export const noChineseSpace = /^[^\u4e00-\u9fa5 ]+$/
//不能输入中文跟英文
export const noChineseEnglish = /^[^a-zA-Z\u4e00-\u9fa5]+$/
//中文跟英文
export const chineseOrEnglish = /^[a-zA-Z\u4e00-\u9fa5]+$/
//中文、英文和特殊字符
export const chineseOrEnglishOrCharacter = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/
//手机
export const mobile = /^1\d{10}$/
//电话
export const telephone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
//邮箱
export const email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
//url
export const url = /^((https?|ftp):\/\/)?([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
//中文
export const chinese = /^[\u4e00-\u9fa5]+$/
//邮编
export const zipCode = /^[1-9][0-9]{5}$/
//船期规则拆分    数字转成0
export const shitRullSpiltNum = /[/\-]?\d{1}/
//生成船期规则验证   
export const shitDataRull = /^([a-zA-Z]|[/\-]?\d{1}){0,12}$/
//生成船次规则验证6位   
export const shitDataRule = /^([a-zA-Z]|[/\-]?\d{1}){0,6}$/
//拆分船期规则
export const spiltShitDataRull = /[a-zA-z0-9]{1}|(-[1-9]{1})/g
//获取时区正则
export const getTimeZone = /[/\-]?\d{1,2}/   ////(?<=UTC)[/\-]?\d{1,2}/
//箱号验证正则
export const containerNumber = /^[a-zA-Z]{4}[0-9]{7}$/
//不能输入特殊字符
export const noCharacter = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/

