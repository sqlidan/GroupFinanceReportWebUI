/**
 * Created by jiachenpan on 16/11/18.
 */

 export function parseTime(time, cFormat) {
   if (arguments.length === 0) {
     return null;
   }
   if(!time || (time instanceof Date && isNaN(time.getTime())))   //判断日期是否Invalid Date
    return ''
   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
   let date;
   if (typeof time == 'object') {
     date = time;
   } else {
     if (('' + time).length === 10) time = parseInt(time) * 1000;
     date = new Date(time);
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

// 格式化时间
 export function getQueryObject(url) {
   url = url == null ? window.location.href : url;
   const search = url.substring(url.lastIndexOf('?') + 1);
   const obj = {};
   const reg = /([^?&=]+)=([^?&=]*)/g;
   search.replace(reg, (rs, $1, $2) => {
     const name = decodeURIComponent($1);
     let val = decodeURIComponent($2);
     val = String(val);
     obj[name] = val;
     return rs;
   });
   return obj;
 }


/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
 export function getByteLen(val) {
   let len = 0;
   for (let i = 0; i < val.length; i++) {
     if (val[i].match(/[^\x00-\xff]/ig) != null) {
       len += 1;
     } else { len += 0.5; }
   }
   return Math.floor(len);
 }

 export function cleanArray(actual) {
   const newArray = [];
   for (let i = 0; i < actual.length; i++) {
     if (actual[i]) {
       newArray.push(actual[i]);
     }
   }
   return newArray;
 }

 export function param(json) {
   if (!json) return '';
   return cleanArray(Object.keys(json).map(key => {
     if (json[key] === undefined) return '';
     return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
   })).join('&');
 }

 export function param2Obj(url) {
   const search = url.split('?')[1];
   if (!search) {
     return {}
   }
   return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
 }

 export function html2Text(val) {
   const div = document.createElement('div');
   div.innerHTML = val;
   return div.textContent || div.innerText;
 }

 export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

   if (typeof target !== 'object') {
     target = {};
   }
   if (Array.isArray(source)) {
     return source.slice();
   }
   for (const property in source) {
     if (source.hasOwnProperty(property)) {
       const sourceProperty = source[property];
       if (typeof sourceProperty === 'object') {
         target[property] = objectMerge(target[property], sourceProperty);
         continue;
       }
       target[property] = sourceProperty;
     }
   }
   return target;
 }


 export function scrollTo(element, to, duration) {
   if (duration <= 0) return;
   const difference = to - element.scrollTop;
   const perTick = difference / duration * 10;
   setTimeout(() => {
    //  console.log(new Date())
     element.scrollTop = element.scrollTop + perTick;
     if (element.scrollTop === to) return;
     scrollTo(element, to, duration - 10);
   }, 10);
 }

 export function toggleClass(element, className) {
   if (!element || !className) {
     return;
   }
   let classString = element.className;
   const nameIndex = classString.indexOf(className);
   if (nameIndex === -1) {
     classString += '' + className;
   } else {
     classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
   }
   element.className = classString;
 }

 

 export function getTime(type) {
   if (type === 'start') {
     return new Date().getTime() - 3600 * 1000 * 24 * 90
   } else {
     return new Date(new Date().toDateString())
   }
 }

 export function debounce(func, wait, immediate) {
   let timeout, args, context, timestamp, result;

   const later = function() {
    // 据上一次触发时间间隔
     const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
     if (last < wait && last > 0) {
       timeout = setTimeout(later, wait - last);
     } else {
       timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
       if (!immediate) {
         result = func.apply(context, args);
         if (!timeout) context = args = null;
       }
     }
   };

   return function(...args) {
     context = this;
     timestamp = +new Date();
     const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
     if (!timeout) timeout = setTimeout(later, wait);
     if (callNow) {
       result = func.apply(context, args);
       context = args = null;
     }

     return result;
   };
 }


 export function deepClone(source) {
   if (!source && typeof source !== 'object') {
     throw new Error('error arguments', 'shallowClone');
   }
   const targetObj = source.constructor === Array ? [] : {};
   for (const keys in source) {
     if (source.hasOwnProperty(keys)) {
       if (source[keys] && (toString.call(source[keys]) === '[object Object]' || toString.call(source[keys]) === '[object Array]')) {
         targetObj[keys] = source[keys].constructor === Array ? [] : {};
         targetObj[keys] = deepClone(source[keys]);
       } else {
         targetObj[keys] = source[keys];
       }
     }
   }
   return targetObj;
 }

 
/**
* 格式化字符串
* 用法:
.formatString("{0}-{1}","a","b");
*/
export function formatString() {
  for (var i = 1; i < arguments.length; i++) {
      var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      arguments[0] = arguments[0].replace(exp, arguments[i]);
  }
  return arguments[0];
};


/**
 * 去前后空格
 */
export function trim(s){
  return s.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * 去除最后逗号(去除最后所有逗号)
 */
export function clearEndComma(s){
  return s.replace(/,*$/g, "");
};


/**
* 数组转字符串
* 用法:
.formatString("-",["a","b"]);
*/
export function arrayToString() {
  var s="";
  for (var i = 0; i < arguments[1].length; i++) {
      s+=arguments[1][i]+arguments[0];
  }
  return s.substring(0,s.length-1);
};


/**
* 格式化时间显示方式
* 用法:format="yyyy-MM-dd hh:mm:ss";
*/
export function formatDate(v, format) {
  if (!v) return "";
  var d = v;
  if (typeof v === 'string') {
      if (v.indexOf("/Date(") > -1)
          d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
      else
          d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
  }
  var o = {
      "M+": d.getMonth() + 1,  //month
      "d+": d.getDate(),       //day
      "h+": d.getHours(),      //hour
      "m+": d.getMinutes(),    //minute
      "s+": d.getSeconds(),    //second
      "q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
      "S": d.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
  }
  return format;
};



/**
* 排序
* 
*/
export function sort(obj1, obj2, field='index') {
  var val1 = obj1[field];
  var val2 = obj2[field];
  if (val1 < val2) {
      return -1;
  } else if (val1 > val2) {
      return 1;
  } else {
      return 0;
  }            
}

/**
* 生成唯一码
*/
export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  var r = (d + Math.random()*16)%16 | 0;
  d = Math.floor(d/16);
  return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

export function timeStringParse(timeStr) {
  var timeArr = timeStr.match(/\d{2}/g)
  return new Date(1990,1,1,parseInt(timeArr[0]),parseInt(timeArr[1]))
}

/**
 * 下载文件（同时下载多文件时使用）
 * @param url 
 */
export function downloadFile(url){
  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; // 防止影响页面
  iframe.style.height = 0; // 防止影响页面
  iframe.src = url; 
  document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
  setTimeout(()=>{
    iframe.remove();
  }, 5 * 60 * 1000);
}
