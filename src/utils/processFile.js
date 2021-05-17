import xlsx from 'xlsx'
import xlsxStyle from 'xlsxStyle'
import {deepClone} from 'utils'


const letterArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
export function getVal(val) {
  if(toString.call(val) === '[object Number]')
    return val
  else {
    return val || ''
  }

}




/**
 * 处理导入文件
 * @param {*} file  文件（支持多个文件） 
 * @param {*} Func  回调
 */
export function importFile(fileArr,  func) {
  fileArr = toString.call(fileArr) === '[object Array]' ? fileArr : [fileArr]
  let fileData = fileArr.map(item => {
    return {
      name: item.name,
      file: item,
      extensionName: (item.name.lastIndexOf('.') == -1 ? '' : item.name.substr(item.name.lastIndexOf('.')+1)).toLowerCase(), 
      parseData: null
    }
  })

  let parseXlsx = (file) => {
    let reader = new FileReader()
    reader.onload = (e) => {
      
      const bstr = e.target.result
  
      var binary = "";
      var bytes = new Uint8Array(bstr);
      var length = bytes.byteLength;
      for(var i = 0; i < length; i++) { 
          binary += String.fromCharCode(bytes[i]);
      }
  
      const wb = xlsx.read(binary, {type: 'binary'})
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = xlsx.utils.sheet_to_json(ws, {header: 1})
  
      fileData.find(item => item.name === file.name).parseData = data
      if(fileData.filter(item => !item.parseData).length === 0)
        func(fileData)
      
    }
    reader.readAsArrayBuffer(file)
  }

  let parseText = file => {
    let reader = new FileReader()
    reader.onload = (e) => {
      fileData.find(item => item.name === file.name).parseData = e.target.result
      if(fileData.filter(item => !item.parseData).length === 0)
        func(fileData)
    }
    reader.readAsText(file)
  }

  //修改标识
  fileData.forEach(item => {
    if(/xlsx|xls|XLS|XLSX/.test(item.extensionName))
      parseXlsx(item.file)
    else {
      parseText(item.file)
    }
  });
}



/**
 * 导出Excel
 * @param {Array} data        数据
 * @param {Object} header     标头
 * @param {string} fileName    文件名
 * @param {string} sheetName   sheet页名
 * @param {string} startRow    从第几行开始
 * @param {string} startCol    从第几列开始
 * @param {string} dataStyle   标题样式
 * @param {string} headerStyle 数据样式
 * @param {string} Func        回调方法
 */
//样式
//第几行开始，第几列开始
export function exportFile({title, titleStartRow = 0, titleStartCol = 0, data, header, fileName, sheetName = 'sheet1', startRow = 1, startCol = 0, dataStyle, headerStyle, Func}) {
  let ws = {}

  //处理data和header数据
  let titleArr = Object.values(header)
  let keyArr = Object.keys(header)
  data = data.map(item => {
    return keyArr.map(key => item[key])
  })
  data.unshift(titleArr)

  //
  ws = dataTable_to_sheetFormat(title, titleStartRow, titleStartCol, data, startRow, startCol, headerStyle, dataStyle)
  //列宽
  ws['!cols'] = siteColWidth(data)

  //回调处理
  Func && (ws = Func(ws))
  ws = setXlsxRange(ws)
  

  let wb = xlsx.utils.book_new();
  wb.SheetNames = [sheetName]
  wb.Sheets[sheetName] = ws;

  const workbookOut  = xlsxStyle.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  //下载
  saveAs(
    new Blob([s2ab(workbookOut)], 
    {
      type: 'application/octet-stream'
    }), 
    `${fileName}.xlsx`
  )
}

/**
 * 根据列索引获取列名   0->A  26->AA
 * @param {*} colIndex   列索引 
 */
export function getColFlag(colIndex) {
  colIndex += 1
  let floorVal = Math.floor(colIndex / 26)
  if(floorVal === 0)
    return letterArr[colIndex - 1] 
  else {
    let remainder = colIndex % 26
    if(remainder === 0) {
      remainder = 25
      floorVal--
      return floorVal === 0 ? letterArr[remainder] : letterArr[floorVal] + letterArr[remainder]
    }
    else {
      return letterArr[floorVal - 1] + letterArr[remainder - 1]
    }
  }
}

/**
 * 根据列名获取列索引  A->0  AA->26
 * @param {*} colFlag  
 */
export function getColIndex(colFlag) {
  return colFlag.match(/[A-Z]{1}/g).reduce((total,currentValue,currentIndex) => {
    return total + letterArr.findIndex(ele => ele === currentValue) + (currentIndex ? 1 : 0)
  }, 0)
}

//合并单元格
export function mergeCell(ws, startCell, endCell) {
  if(!ws['!merges'])
  ws['!merges'] = []

  let startCol = getColIndex(startCell.match(/^[A-Z]+/)[0])
  let startRow = parseInt(startCell.match(/^[A-Z]+(\d+)$/)[1]) - 1
  let endCol = getColIndex(endCell.match(/^[A-Z]+/)[0])
  let endRow = parseInt(endCell.match(/^[A-Z]+(\d+)$/)[1]) - 1

  ws['!merges'].push({
    s: {
      c: startCol,    //列
      r: startRow     //行
    },
    e: {
      c: endCol,      //列
      r: endRow       //行
    }
  })
}


/**
 * 设置xlsx范围
 * @param {*} ws 
 */
function setXlsxRange(ws) {
  let numSortFunc = (val1, val2) => {
    if(val1 < val2)
      return -1
    else if(val1 > val2)
      return 1
    else
      return 0
  }


  let keyArr = Object.keys(ws)
  //rowArr = [...new Set(arr.map(item => item.match(/^[A-Z]/g)?.[0]))].filter(item=>item)
  let rowArr = [...new Set(keyArr.map(item => {
    let regArr = item.match(/^[A-Z]+/)
    if(regArr && toString.call(regArr) === '[object Array]' && regArr.length > 0)
      return getColIndex(regArr[0])
      // return regArr[0].match(/[A-Z]{1}/g).reduce((total,currentValue,currentIndex) => {
      //   return total + letterArr.findIndex(ele => ele === currentValue) + (currentIndex ? 1 : 0)
      // }, 0)
    else
      return undefined
  }))].filter(item => item != undefined).sort(numSortFunc)
  let colArr = [...new Set(keyArr.map(item => {
    let regArr = item.match(/^[A-Z]+(\d+)$/)
    if(regArr && toString.call(regArr) === '[object Array]' && regArr.length > 1) 
      return (parseInt(regArr[1]) - 1)
    else
      return undefined
  }))].filter(item => item != undefined).sort(numSortFunc)

  let range = {
    s: {
      c: rowArr[0],
      r: colArr[0]
    },
    e: {
      c: rowArr[rowArr.length - 1],
      r: colArr[colArr.length - 1]
    }
  }
  ws['!ref'] = xlsx.utils.encode_range(range)
  return ws

  //字母排序算法（未完）
  // rowArr.sort((val1, val2) => {
  //   if(val1.length > val2.length)
  //     return 1
  //   else if(val1.length < val2.length) {
  //     return -1
  //   }
  //   else {
  //     let val1V = val1.match(/[A-Z]{1}/g).reduce((total,currentValue) => {
  //       return total + letterArr.findIndex(currentValue) + 1
  //     }, 0)
  //     let val2V = val2.match(/[A-Z]{1}/g).reduce((total,currentValue) => {
  //       return total + letterArr.findIndex(currentValue) + 1
  //     }, 0)
  //     if(val1V > val2V)
  //       return 1
  //     else if(val1V < val2V)
  //       return -1
  //     else
  //       return 0
  //   }
  // })
}

/**
 * 设置表格列宽
 * @param {*} data 
 */
function siteColWidth(data) {
  //设置worksheet每列的最大宽度
  const colWidth = data.map(row => row.map(val => {
    /*先判断是否为null/undefined*/
    if (!val) {
      return {
        'wch': 10
      };
    }
    else {
      //todo ?. ??编译错误
      //let len = (val.toString().match(/^[\u4e00-\u9fa5]/g)?.length ?? 0) * 2 + (val.toString().match(/[^(\u4e00-\u9fa5)]/g)?.length ?? 0) * 2
      let chineseArr = val.toString().match(/[\u4e00-\u9fa5]/g)
      let noChineseArr = val.toString().match(/[^(\u4e00-\u9fa5)]/g)
      let len = ((chineseArr && chineseArr.length) || 0) * 2 + ((noChineseArr && noChineseArr.length) || 0)
      // console.log(val.toString(),val.toString().length,len,chineseArr,noChineseArr)
      return {
        'wch': len
      }
    }
  }))
  /*以第一行为初始值*/
  let result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'];
      }
    }
  }
  return result;
}

/**
 * 设置表格宽度
 * @param {
 * ws  
 * colFlag   单元格   A1、B5
 * type      类型     wpx、width、wch
 * width     类型为wpx、width时的宽度值，wch会自动检测宽度
 * }  
 */
export function customColWidth({ws, colFlag, type='wch', width}) {
  if(!(ws && colFlag)) {
    console.error('ws and colFlag is require')
    return
  }

  if(!ws['!cols'])
    ws['!cols'] = []

  //列索引
  let regArr = colFlag.match(/^[A-Z]+/)
  let colIndex = 0
  if(regArr && toString.call(regArr) === '[object Array]' && regArr.length > 0) {
    colIndex = getColIndex(regArr[0])
    // colIndex = regArr[0].match(/[A-Z]{1}/g).reduce((total,currentValue,currentIndex) => {
    //   return total + letterArr.findIndex(ele => ele === currentValue) + (currentIndex ? 1 : 0)
    // }, 0)
  }
  else
    return

  if(type === 'wch') {
    let val = ws[colFlag] && ws[colFlag]['v'].toString()
    if(val) {
      let chineseArr = val.toString().match(/[\u4e00-\u9fa5]/g)
      let noChineseArr = val.toString().match(/[^(\u4e00-\u9fa5)]/g)
      let len = ((chineseArr && chineseArr.length) || 0) * 2 + ((noChineseArr && noChineseArr.length) || 0)
      if(ws['!cols'][colIndex] && ws['!cols'][colIndex].wch &&  ws['!cols'][colIndex].wch < len)
        ws['!cols'][colIndex] = {wch: len}
      if(!ws['!cols'][colIndex])
        ws['!cols'][colIndex] = {wch: len}
    }
    else
    ws['!cols'][colIndex] = {wch: 10}
  }
  else {
    ws['!cols'][colIndex] = {[type]: width}
  }
}

/**
 * 导出自定义数据处理
 * @param {
 * val      值
 * rowNum   行(索引以0开始)
 * colNum   列(索引以0开始)
 * style    样式
 * }  
 */
export function dataCustom_to_sheetFormat({val, rowNum, colNum, style={}}) {
  let cellStyle = {
    font: {
      sz: 12,
      color: {
          rgb: '000'
      },
      bold: false,
    },
    alignment: {
      horizontal: "center" ,
      vertical: "center"
    },
    border: { // 设置边框
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
    },
  }

  let cell = {
    v: val,
    s: {...Object.assign(deepClone(cellStyle), style)}//R === 0 ? (headerStyle || headerCellStyle) : (dataStyle || dataCellStyle)
  }

  let cell_ref = xlsx.utils.encode_cell({
    r: rowNum,
    c: colNum
  })
  return {
    [cell_ref]: cell
  }
}

//导出表格数据处理
function dataTable_to_sheetFormat(title, titleStartRow, titleStartCol, data, startRow, startCol, headerStyle, dataStyle) {
  let ws = {}
  // //范围
  // let range = {
  //   s: {
  //     c: 10000000,
  //     r: 10000000
  //   },
  //   e: {
  //     c: 0,
  //     r: 0
  //   }
  // }

  let headerCellStyle = {
    font: {
      sz: 10,
      color: {
          rgb: '000'
      },
      bold: false,
    },
    alignment: {
      horizontal: "center" ,
      vertical: "center"
    },
    border: { // 设置边框
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
    },
  }
  let dataCellStyle = {
    font: {
      sz: 10,
      color: {
          rgb: '000'
      }
    },
    alignment: {
      horizontal: "center" ,
      vertical: "center"
    },
    border: { // 设置边框
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
    }
  }

  let titleCellStyle = {
    font: {
      sz: 18,
      color: {
          rgb: '000'
      },
      bold: true,
    },
    alignment: {
      horizontal: "center" ,
      vertical: "center"
    },
    // border: { // 设置边框
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     left: { style: 'thin' },
    //     right: { style: 'thin' }
    // }
  }

  let getStyle = rowNum => {
    if(rowNum === 0 && headerStyle)
      return deepClone(headerStyle)
    if(rowNum === 0 && !headerStyle)
      return deepClone(headerCellStyle)
    if(rowNum !== 0 && dataStyle)
      return deepClone(dataStyle)
    if(rowNum !== 0 && !dataStyle)
      return deepClone(dataCellStyle)
    return null
  }
  
  let cell = {
    v: title,
    s: {...titleCellStyle}
  }
  let cell_ref = xlsx.utils.encode_cell({
    r: titleStartRow,
    c: titleStartCol
  })
  ws[cell_ref] = cell

  //格式化数据为sheet
  let rNum = 0
  let cNum = 0
  for(let R = 0; R < data.length; R++) {
    for(let C = 0; C < data[R].length; C++) {
      rNum = R + startRow
      cNum = C + startCol
      // range.s.r > rNum && (range.s.r = rNum)
      // range.s.c > cNum && (range.s.c = cNum)
      // range.e.r < rNum && (range.e.r = rNum)
      // range.e.c < cNum && (range.e.c = cNum)
      
      let cell = {
        v: data[R][C] || '',
        s: {...getStyle(R)}//R === 0 ? (headerStyle || headerCellStyle) : (dataStyle || dataCellStyle)
      }
      if(cell.v === null)
        continue

      let cell_ref = xlsx.utils.encode_cell({
        r: rNum,
        c: cNum
      })
      if(toString.call(cell.v) === '[object Number]')
        cell.t = 'n'
      else if (toString.call(cell.v) === '[object Boolean]')
        cell.t = 'b'
      else if (toString.call(cell.v) === '[object Date]') {
        cell.t = 'd'
      } 
      else
        cell.t = 's'

      ws[cell_ref] = cell
    }
  }
  // //如果有标题
  // if(title) {
  //   range.s.r > titleStartRow && (range.s.r = titleStartRow)
  //   range.s.c > titleStartCol && (range.s.c = titleStartCol)
  // }
  // if(range.s.c < 10000000)
  //   ws['!ref'] = xlsx.utils.encode_range(range)
  return ws
}


function saveAs(obj, fileName) {
  var tmpa = document.createElement("a");
  tmpa.download = fileName || "下载";
  tmpa.href = URL.createObjectURL(obj);
  tmpa.click();
  setTimeout(function () {
      URL.revokeObjectURL(obj);
  }, 100);
}

function s2ab(s) {
  if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
  } else {
      var buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
      return buf;
  }
}


//数据仓库
const expando = 'db'+Math.random().toString().replace(/\D/g, "")
function Data(){
  this.expando = expando
  this.cache = {}
}
Data.prototype = {
  key:function(page){
      let descriptor = {},unlock = page[this.expando]
      if(!unlock){    
          unlock = Data.uid++
          page[this.expando] = unlock
      }
          
      if(!this.cache[unlock])
          this.cache[unlock] = {}
      return unlock
  },  
  get:function(page,key){
      var cache = this.cache[this.key(page)]
      return key === undefined ? cache : cache[key]
  }
}
Data.uid = 1
var data_priv = new Data()