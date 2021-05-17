//国际中转 航次类
export class TransferShipVoy {
  constructor() {
    this.id = ''         //航次ID
    this.shipId = ''     //船舶ID
    this.shipNameEN = '' //英文船名
    this.shipNameCN = '' //中文船名
    this.imVoy = ''      //进口航次号
    this.exVoy = ''      //出口航次号
    this.terminalId = '' //靠泊码头ID
    this.terminalName = ''//靠泊码头名称
    this.gqdm = ''       //关区代码
    this.zzeta = ''      //预计抵港时间
  }
}