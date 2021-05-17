import {getToken } from 'utils/auth';



//对数组根据日期进行排序 时间字段为createDate
export function sortByDate(data) {
    return data.sort(function(a,b) {
      let Bdate = parseTime(b.createDate);
      let Adate = parseTime(a.createDate);
      return Date.parse(Bdate.replace(/-/g,"/"))-Date.parse(Adate.replace(/-/g,"/"));
    });
}

//根据id获取数据字典值
export function parseDic(val) {
  if (val) {
    let cachestr = window.localStorage.getItem('DicCaches');
    let caches = null;
    if (cachestr && cachestr.length > 0) {
      caches = JSON.parse(cachestr);
      let cacheValue = caches.find((item, index) => { if (item.key == val) { return item }});
      if (cacheValue != null && cacheValue != undefined && cacheValue.create) {
        let time = new Date().getTime() - Number(cacheValue.create)
        if (cacheValue && cacheValue.value && cacheValue.value.length > 0) {
          if (time <= 60000) {
            return cacheValue.value;
          } else {
            caches.splice(caches.find((item, index) => { if (item.key == val) { return index }}), 1);
          }
        }
      }
    } else {
      caches = [];
    }
    let dicName = null;
    var ajax = new XMLHttpRequest();
    // 第二步： 设置状态监听函数
    ajax.onreadystatechange = function(){
        // 第五步：在监听函数中，判断readyState=4 && status=200表示请求成功
        if(ajax.readyState==4 && ajax.status==200){
            // 第六步： 使用responseText、responseXML接受响应数据，并使用原生JS操作DOM进行显示
            let res = JSON.parse(ajax.responseText);
            if (res.ok) {
              dicName = res.returndata.name;
              caches.push({
                key: val,
                value: dicName,
                create: new Date().getTime()
              })
              window.localStorage.setItem('DicCaches', JSON.stringify(caches));
            } else {
              dicName = val;
            }
        }
    }
    // 第三步： open一个链接
    ajax.open("GET",`/api/base/dic/code/${val}`,false);//true异步请求，false同步
    ajax.setRequestHeader('Authorization', getToken());
    // 第四步： send一个请求。 可以发送对象和字符串，不需要传递数据发送null
    ajax.send(null);

    return dicName;
  }
}

/**
 * 时间格式转化
 * @param {*} time 
 * @param {*} cFormat 
 */
export function parseTime(time, cFormat='{y}-{m}-{d} {h}:{i}:{s}') {
  if (arguments.length === 0) {
    return null;
  }
  if (!time) {
    return '';
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time == 'object') {
    date = time;
  } else if (typeof time == 'string') {
    date = new Date(time);
  } else {
    date = new Date(parseInt(time));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * 时间格式转化
 * @param {*} time 
 * @param {*} cFormat 
 */
export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}


export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
}

//金额格式化
export function numFormat(val) {
  val = val.toString().replace(/\$|\,/g,'');
  if(isNaN(val)) {
    val = "0";
  }
  let sign = (val == (val = Math.abs(val)));
  val = Math.floor(val*100+0.50000000001);
  let cents = val%100;
  val = Math.floor(val/100).toString();
  if(cents<10) {
     cents = "0" + cents
  }
  for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++) {
      val = val.substring(0,val.length-(4*i+3))+',' + val.substring(val.length-(4*i+3));
  }

  return (((sign)?'':'-') + val + '.' + cents);
}

//数字转大写
export function numberToChies(amount){//形参
 // 汉字的数字
 const cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
 // 基本单位
 const cnIntRadice = ["", "拾", "佰", "仟"];
 // 对应整数部分扩展单位
 const cnIntUnits = ["", "万", "亿", "兆"];
 // 对应小数部分单位
 const cnDecUnits = ["角", "分"];
 // 整数金额时后面跟的字符
 const cnInteger = "整";
 // 整型完以后的单位
 const cnIntLast = "元";
 // 最大处理的数字
 const maxNum = 9999999999999999.99;
 // 金额整数部分
 let integerNum;
 // 金额小数部分
 let decimalNum;
 // 输出的中文金额字符串
 let chineseStr = "";
 // 分离金额后用的数组，预定义
 let parts;
 if (amount === "") {
     return "";
 }
 amount = parseFloat(amount);
 if (amount >= maxNum) {
     // 超出最大处理数字
     return "";
 }
 if (amount === 0) {
     chineseStr = cnNums[0] + cnIntLast + cnInteger;
     return chineseStr;
 }
 // 转换为字符串
 amount = amount.toString();
 if (amount.indexOf(".") === -1) {
     integerNum = amount;

     decimalNum = "";
 } else {
     parts = amount.split(".");
     integerNum = parts[0];
     decimalNum = parts[1].substr(0, 4);
 }
 // 获取整型部分转换
 if (parseInt(integerNum, 10) > 0) {
     let zeroCount = 0;
     const IntLen = integerNum.length;
     for (let i = 0; i < IntLen; i++) {
         const n = integerNum.substr(i, 1);
         const p = IntLen - i - 1;
         const q = p / 4;
         const m = p % 4;
         if (n === "0") {
             zeroCount++;
         } else {
             if (zeroCount > 0) {
                 chineseStr += cnNums[0];
             }
             // 归零
             zeroCount = 0;
             //alert(cnNums[parseInt(n)])
             chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
         }
         if (m === 0 && zeroCount < 4) {
             chineseStr += cnIntUnits[q];
         }
     }
     chineseStr += cnIntLast;
 }
 // 小数部分
 if (decimalNum !== "") {
     const decLen = decimalNum.length;
     for (let i = 0; i < decLen; i++) {
         const n = decimalNum.substr(i, 1);
         if (n !== "0") {
             chineseStr += cnNums[Number(n)] + cnDecUnits[i];
         }
     }
 }
 if (chineseStr === "") {
     chineseStr += cnNums[0] + cnIntLast + cnInteger;
 } else if (decimalNum === "") {
     chineseStr += cnInteger;
 }
 return chineseStr;
}
