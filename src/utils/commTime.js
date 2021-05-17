import {parseTime} from './index'

//时间字符串转时间
export function stringToTime(stringTime) {
    if(toString.call(stringTime) === "[object Date]")
        return stringTime
    else
        return new Date(parseTime(stringTime,'{y}/{m}/{d} {h}:{i}:{s}'))
}

/**
 * 时区计算
 * @time 时间
 * @timeZone time时区
 * @computeTimeZone 要计算时区
 * return 计算时区的time
 */
export function timeZoneCompute(time,timeZone,computeTimeZone) {
    let val = timeZone - computeTimeZone
    return val < 0 ? new Date(time.getTime() + Math.abs(val)*60*60*1000) : new Date(time.getTime() - val*60*60*1000)
}

//时间间隔
export function timeInterval(time1, time2) {
    return time1.getTime() - time2.getTime()
}

/**
 * 周内间隔天数(可能跨1周)
 * @minWeek 日期小的周
 * @maxWeek 日期大的周
 */
export function weekIntervalDayNum(minWeek, maxWeek){
    minWeek = Number(minWeek)
    maxWeek = Number(maxWeek)
    return maxWeek - minWeek >= 0 ? maxWeek - minWeek : maxWeek + 7 - minWeek
}

//天数间隔
export function getNumberOfDays(date1,date2){//获得天数
  //date1：开始日期，date2结束日期
  var a1 = Date.parse(new Date(date1));
  var a2 = Date.parse(new Date(date2));
  var day = parseInt((a2-a1)/ (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
  return day
}

//当前日期（时间为0）
export function getCurrentDate(){
  let current = new Date()
  return new Date(current.getFullYear(), current.getMonth(), current.getDate())
}

/**
 * 添加天
 * @param {*} date 时间
 * @param {*} day  要添加的天数
 */
export function addDay(date, day){
  return new Date(date.getTime() + day * 24 * 60 * 60 * 1000)

}