//数据仓库
const pageFlag = 'axios'+Math.random().toString().replace(/\D/g, "")
function Data(){
  this.pageFlag = pageFlag
  this.cache = {}
}
Data.prototype = {
  key:function(page){
      let descriptor = {},unlock = page[this.pageFlag]
      if(!unlock){    
          unlock = Data.uid++
          page[this.pageFlag] = unlock
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

export var data_priv = new Data()