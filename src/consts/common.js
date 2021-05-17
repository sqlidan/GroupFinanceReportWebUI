//是否AGM检验国,是否疫区
export const equClassifyList = [{value: "0",label: "否"},{value: "1",label: "是"}]

//周
export const weekObj = {SUN: 7, SAT: 6, FRI: 5, THU: 4, WED: 3, TUE: 2, MON: 1}

//单个时间日期的快捷变量
export const pickerOptions = {
    shortcuts: [{
        text: '今天',
        onClick(picker) {
        picker.$emit('pick', new Date());
        }
    }, {
        text: '昨天',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
        }
    }, {
        text: '一周前',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
        }
    }]
}

//时间日期范围的快捷变量
export const pickerRangeOptions ={
    shortcuts: [
        {
            text: '最近一周',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
        }]
}

// module.exports = {
//     pickerOptions: {
//         shortcuts: [{
//             text: '今天',
//             onClick(picker) {
//             picker.$emit('pick', new Date());
//             }
//         }, {
//             text: '昨天',
//             onClick(picker) {
//             const date = new Date();
//             date.setTime(date.getTime() - 3600 * 1000 * 24);
//             picker.$emit('pick', date);
//             }
//         }, {
//             text: '一周前',
//             onClick(picker) {
//             const date = new Date();
//             date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
//             picker.$emit('pick', date);
//             }
//         }]
//     },
//     searchpickerOptions: {
//         shortcuts: [
//             {
//                 text: '最近一周',
//                 onClick(picker) {
//                     const end = new Date();
//                     const start = new Date();
//                     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//                     picker.$emit('pick', [start, end]);
//                 }
//             }, {
//                 text: '最近一个月',
//                 onClick(picker) {
//                     const end = new Date();
//                     const start = new Date();
//                     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
//                     picker.$emit('pick', [start, end]);
//                 }
//             }, {
//                 text: '最近三个月',
//                 onClick(picker) {
//                     const end = new Date();
//                     const start = new Date();
//                     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
//                     picker.$emit('pick', [start, end]);
//                 }
//             }]
//     },
// }