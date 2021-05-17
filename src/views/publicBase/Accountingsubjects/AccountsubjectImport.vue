<template>
  <div class="app-container Accountsubject">
    <el-form size="mini" @submit.native.prevent>
    <el-row>
        <el-col :span="4">
            <el-form-item label="导入文件：" prop="filecontent" label-width="100px">
              <el-input
                size="mini"
                v-model="filecontent"
                placeholder="请选择导入文件"
                style="width:100%"
              ></el-input>
            </el-form-item>
          </el-col>
        <el-col :span="4">
          <el-form-item label prop label-width="10px">
            <!-- <el-button type="primary" size="mini" @click="onSearchBefore();getTableList()" >搜索</el-button> -->
        <upload pAcceptFormat=".xlsx,.xls" :pIsOss="false" @onCustomUpload="importaccount" style="margin-bottom:5px;display: inline-block;float:none !important;">
          <el-button type="primary" size="mini" style="margin-left:0px;">浏览</el-button>
        </upload>
         <!-- <el-button type="primary" size="mini" @click="openAddCountryComp">导入</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> 
      <el-table
      :cell-class-name="tableRowClassName"
        v-loading="table.loading"
        :data="TableDataList"
         :row-key = "getRowKeys"
        border
        stripe
        highlight-current-row
        fit
        height="calc(100% - 50px)"
        style="width: 100%"
        ref="table"
      >
       <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="50">
          <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
        </el-table-column>
       
        <el-table-column
          align="center"
          prop="accountcode"
          label="科目编码"
          min-width="12%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="accountName"
          show-overflow-tooltip
          label="科目名称"
          min-width="12%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="accountType"
          show-overflow-tooltip
          label="科目类型"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cashclassification"
          show-overflow-tooltip
          label="现金分类"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="direction"
          show-overflow-tooltip
          label="方向"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="auxiliaryaccounting"
          show-overflow-tooltip
          label="辅助核算"
          min-width="12%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="laststage"
          show-overflow-tooltip
          label="末级"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="unit"
          show-overflow-tooltip
          label="计量单位"
          min-width="12%"
        ></el-table-column>

        <!-- <el-table-column align="center" label="操作" min-width="7%">
          <template slot-scope="scope">
            <div class="tableBtn" @click="openUpdateCountryComp(scope.row)">编辑</div>
            <el-popover placement="top" width="160" v-model="scope.row.popShow">
              <p>是否确认删除？</p>
              <div style="text-align: right margin: 0">
                <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteSingleCountry(scope.row.id)">删除</el-button>
              </div>
              <div class="tableBtn" slot="reference">删除</div>
            </el-popover>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-pagination
        style="margin-top:10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total"
        :page-sizes="page.pageSelectArr"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination> -->
 
  </div>
</template>
<style lang="scss">
.Accountsubject {
  height: 100%;
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import upload from 'components/upload/upload'
import xlsx from 'xlsx'

export default {
  name: "AccountsubjectIndex",
  components: {upload},
  mixins: [tableMixin],
  data() {
    return {
      TableDataList:[],//表格数据,显示导入数据
     filecontent:""
    }
  },
  methods: {
    getRowKeys(row) {
            return row.id;
    },
    //获取国家列表
    getTableList() {

    },
    importaccount(file) {       
      this.filecontent=file.name;
      let contrast = {
        0: 'accountcode',
        1: 'accountName',
        2: 'accountType',
        3: 'cashclassification',
        4: 'direction',
        5: 'auxiliaryaccounting',
        6: 'laststage',
        7: 'unit'
      }
      let arr = []
      
      this.importFile(file, (data) => {
        this.table.loading = true;
        
        data[0].parseData.forEach((arrItem,i) => {
          if(i > 4) {
            let obj = {}
            for(let [index,item] of arrItem.entries()) {
              contrast[index] && (obj[contrast[index]] = item || '')
            }
          
            if(obj.accountcode !=="" && obj.accountcode !==null  && obj.accountcode !==undefined && obj.accountcode !=="科目编码" && obj.accountcode !=="【用友网络】")
            {                          
               arr.push(obj)
            }
             
          }
        });
           
        this.TableDataList=arr;   
         this.table.loading = false;       
      })
    },
    importFile(fileArr,  func) {
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
      
          const wb = xlsx.read(binary, {type: 'binary', raw: true,cellDates: true})
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
    },
  
  }
  
}
</script>