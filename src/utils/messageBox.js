import {Message,Notification} from 'element-ui';
/**
* 错误提示框
*/
export function errorMsg(msg, duration=0){
    Message({
        message: msg,
        type: 'error',
        showClose: true,
        duration: duration
      });
}
/**
* 警告提示框
*/
export function warnMsg(msg, duration=3000){
    Message({
        message: msg,
        type: 'warning',
        duration: duration
      });
}
/**
* 成功提示框
*/
export function successMsg(msg, duration=3000){
    Message({
        message: msg,
        type: 'success',
        duration: duration,
        showClose: true,
      });
}

/**
 * html提示框
 */
export function htmlMsg(html, {type="error", duration=3000, showClose=false}) {
  var msg="<div style='width:800px;word-wrap:break-word;height:400px;overflow-y:scroll'>"+html+"</div>";
  Message({
    dangerouslyUseHTMLString: true,
    type: type,
    message: msg,
    showClose: showClose,
    duration: duration
  })
}



//警告通知
export function warnNotify(msg='11',duration=0) {
  Notification({
    title: '警告',
    message: msg,
    type: 'warning',
    duration: duration,
  });
}

