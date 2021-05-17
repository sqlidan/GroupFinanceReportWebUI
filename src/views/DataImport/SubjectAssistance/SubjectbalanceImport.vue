<template>
  <div class="app-container auxibalimport">
     <el-dialog title="预算导入" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="1600px"
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
    <el-form size="mini" @submit.native.prevent label-width="100px">
    <el-row>
       <el-col :span="6">
                <el-form-item label="所属公司：" prop="code" style="position:relative;" >
                    <!-- <el-cascader v-model="choosedTreeNode"  
                    :show-all-levels="false" 
                    :options="treeComp.data" 
                    clearable  filterable 
                    style="width:100%" 
                    :props="SetKesDept"
                    @change="onNodeClick"
                    ></el-cascader> -->
                       
                    <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode" style="width:100%"></tree-select>
                    <div class="editOrgComp-row-tree" v-show="treeComp.show" >                
                        <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                          @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                    </div>
                                 
                </el-form-item>
            </el-col>
              <el-col :span="4">
                <el-form-item label="所属月份：" prop="budtime" style="position:relative;" >               
                    <el-date-picker v-model="budtime" 
                    type="month" 
                    placeholder="年份"     
                    style="width:100%"
                     ></el-date-picker>    
                </el-form-item>
            </el-col>
        <el-col :span="5">
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
          <el-button type="primary" size="mini" @click="Importdata" :loading="bthloading">导入</el-button>
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
        height="600px"
        style="width: 100%"
        ref="table"
      >
        <el-table-column type="index" align="center" label="序号" width="50">
          <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
        </el-table-column>
       
        <el-table-column
          align="center"
          prop="remarks"
          label="摘要"
          show-overflow-tooltip
         width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="subjectCode"
          show-overflow-tooltip
          label="科目编码"
         width="130"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="subjectName"
          show-overflow-tooltip
          label="科目名称"
         
        ></el-table-column>
        <el-table-column
          align="center"
          prop="depCode"
          show-overflow-tooltip
          label="部门编码"
         width="130"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="depname"
          show-overflow-tooltip
          label="部门名称"
        width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="direction1"
          show-overflow-tooltip
          label="方向"
          width="80"
        ></el-table-column>
        <el-table-column  align="center" label="期初余额">
            <el-table-column
              align="center"
              prop="openingBalance"
              show-overflow-tooltip
              label="本币"
              width="100"
            ></el-table-column>
        </el-table-column>
           <el-table-column  align="center" label="本期借方">
            <el-table-column
              align="center"
              prop="currentDebit"
              show-overflow-tooltip
              label="本币"
              width="100"
            ></el-table-column>
        </el-table-column>
         <el-table-column  align="center" label="本期贷方">
            <el-table-column
              align="center"
              prop="currentLender"
              show-overflow-tooltip
              label="本币"
             width="100"
            ></el-table-column>
        </el-table-column>
         <el-table-column  align="center" label="借方累计">
            <el-table-column
              align="center"
              prop="debitaccumulation"
              show-overflow-tooltip
              label="本币"
              width="100"
            ></el-table-column>
        </el-table-column>
         <el-table-column  align="center" label="贷方累计">
            <el-table-column
              align="center"
              prop="creditAccumulation"
              show-overflow-tooltip
              label="本币"
             width="100"
            ></el-table-column>
        </el-table-column>
         <el-table-column
          align="center"
          prop="direction2"
          show-overflow-tooltip
          label="方向"
          width="80"
        ></el-table-column>
        <el-table-column  align="center" label="期末余额">
            <el-table-column
              align="center"
              prop="endingbalance"
              show-overflow-tooltip
              label="本币"
             width="100"
            ></el-table-column>
        </el-table-column>
      </el-table>
     </el-dialog>
 
  </div>
</template>
<style lang="scss">
.auxibalimport {
  .country-tableRow {
    .tableX .el-table--scrollable-x .el-table__body-wrapper {       
        overflow: auto !important;
    }
    
      .chsEqp{
            width:100%;
            .textPromt{float:left;}
            .chsEqp-select{height:26px;line-height: 24px;}
            i{float: right;margin-top: 6px;}
        }
        .editOrgComp-row-tree{
                position:absolute;
                top:40px;
                left:70px;
                background-color: #fff;
                z-index: 10;
                padding:0;
                margin:0;
                width:300px;
                height:450px;
                clear: both;

                
            }
  }
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import upload from 'components/upload/upload'
import xlsx from 'xlsx'
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {warnMsg,successMsg,htmlMsg} from 'utils/messageBox'
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import{ImportAccountBalance} from 'api/DataImport/SubjectAssistance'

export default {
  components: {upload, treeSelect,
                tree},
  mixins: [tableMixin],
      props:{
        pshow: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        pshow(newValue, oldValue){
            this.windowShow = newValue;
            
        },
        windowShow(newValue, oldValue){
            if(this.$refs["ruleForm"])
                this.$refs["ruleForm"].resetFields();   //清空验证

            if(!newValue)  //窗口关闭
            {
                this.TableDataList=[];
                this.filecontent="";
                this.form = {     
                    code:""   
                }
                // this.deptreeComp.data=[];
                this.choosedTreeNode=[];
                this.$emit("on-show-change",newValue);
            }
        }
    },
  data() {
    return {
       windowShow: this.pshow,
       TableDataList:[],//表格数据,显示导入数据
       filecontent:"",
       daterange:"",
       budtime:new Date(),
       currency:"",
       bthloading:false,
      treeComp: {
              show: false,
              data: [],
              choosedTreeNodeId: [],  //回显树节点ID
          },
      choosedTreeNode: [],
      form:{
          code:""
      },    
    }
  },
  methods: {
    getRowKeys(row) {
            return row.id;
    },
     //获取组织树
        getOrganizationTree() {
            //{IsShowdep:true}
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result;
                
            })
        },
        //
        onNodeClick(clickNode)   //choosedNodeID
        {           
            this.form.code = clickNode.length > 0 ? clickNode[0].nodeUUid : ''
            this.choosedTreeNode=clickNode;
                      
        },
         onClickOutSide() {
            if(this.treeComp.show==true){
                this.treeComp.show=false;
                this.$refs.chooseEquNode.iconChange()
            }
        },
         //单击树选择框控件
        ontreeShowChange(val) {
            this.treeComp.show=val;
        },

    importaccount(file) {       
      this.filecontent=file.name;
  
      let contrast = {
        0: 'remarks',
        1: 'subjectCode',
        2: 'subjectName',
        3: 'depCode',
        4: 'depname',
        5: 'direction1',
        6: 'openingBalance',
        7: 'currentDebit',
        8: 'currentLender',
        9: 'debitaccumulation',
        10: 'creditAccumulation',
        11: 'direction2',
        12: 'endingbalance',
      }
       let contrast2 = {
        0: 'subjectCode',
        1: 'subjectName',
        2: 'direction1',
        3: 'openingBalance',
        4: 'currentDebit',
        5: 'currentLender',
        6: 'debitaccumulation',
        7: 'creditAccumulation',
        8: 'direction2',
        9: 'endingbalance'
      }
      let arr = []
      this.TableDataList=[];
      this.importFile(file, (data) => {
        this.table.loading = true;
        var isremarks=true;
        data[0].parseData.forEach((arrItem,i) => {
         
          if(i > 3) {
            let obj = {}
            for(let [index,item] of arrItem.entries()) {
              
               if(isremarks==true)
               {
                 contrast[index] && (obj[contrast[index]] = item || '')
               }
               else{
                 contrast2[index] && (obj[contrast2[index]] = item || '')
               }
              
            }
             if(i==4)
             {
               this.daterange=obj.remarks;
             }
             else if(i==5)
             {
               this.currency=obj.remaks;
             }
             else if (i==6){
               if(obj.remarks!=="摘要"){
                 isremarks=false;

               }
             }
             else if(obj.subjectCode !=="" && obj.subjectCode !==null  && obj.subjectCode !==undefined && obj.subjectCode !=="科目编码" && obj.subjectCode !=="总计")
             {   
               if(!obj.subjectCode.includes("核算单位") 
                  && !obj.subjectCode.includes("制单人") 
                  && !obj.subjectCode.includes("打印时间")) {
                    obj.openingBalance=this.setnumber( obj.openingBalance);
                    obj.currentDebit=this.setnumber( obj.currentDebit);
                    obj.currentLender=this.setnumber( obj.currentLender);
                    obj.debitaccumulation=this.setnumber( obj.debitaccumulation);
                    obj.creditAccumulation=this.setnumber( obj.creditAccumulation);
                    obj.endingbalance=this.setnumber( obj.endingbalance);

                     arr.push(obj);                            
               }                      
               
             }           
          }
        });
           
        this.TableDataList=arr;   
         this.table.loading = false;       
      })
    },
    setnumber(amttxt){
      var amt=amttxt.replace(/,/g, '');
      amt=amt.replace(/\s*/g,"");
      var namt=Number(amt);
      if( namt!==undefined)
      {
        return namt;
      }
        
      return amttxt;
       

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
    //导入
        Importdata() {
            var code="";
           if(this.form.code==="" || this.form.code===null || this.form.code===undefined)
           {
                warnMsg("请选择所属公司");
                return;
           }
           if(this.budtime==="" || this.budtime===null || this.budtime===undefined)
           {
                warnMsg("请选择所属时间");
                return;
           }
           var arr=[];
           this.TableDataList.forEach(item=>{
             var dep=item.depCode===undefined?"":(item.depCode);
             if(!dep.includes("~"))
             {
                let badata={
                  Remarks:item.remarks,
                  SubjectCode:item.subjectCode,
                  SubjectName:item.subjectName,
                  DepCode:dep,
                  CurrentDebit:item.currentDebit,
                  CurrentLender:item.currentLender
                };            
                arr.push(badata);
             }
             //dep=dep.replace("~","");
             
            
           })
                     
            let data={
                      Code:this.form.code,
                      Year:this.budtime.getFullYear(),
                      Month:this.budtime.getMonth()+1,
                      Data:arr
                  };
             this.bthloading=true;
              ImportAccountBalance(data).then(res => {
                if(res.success)
                {
                  this.bthloading=false;
                  if(res.result.success && res.result.code==="3001")
                  {
                      successMsg("科目余额导入成功");

                  }
                  else if(res.result.msg !=="" && res.result.msg !==null && res.result.msg !==undefined)
                  {
                      htmlMsg(res.result.msg,{type: "warning", duration: 0, showClose: true});
                  }
                  else{
                      warnMsg("科目余额导入失败");
                  }
                    
                }
            })
            .catch(err=>{
                this.bthloading=false;
            });
                  // var showmsg=JSON.stringify(data);
                  // //htmlMsg(showmsg);//
                  // htmlMsg(showmsg.toString(),{type: "warning", duration: 0, showClose: true});
                 
        },
  
  }
  
}
</script>