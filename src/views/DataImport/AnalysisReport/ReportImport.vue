<template>
    <div class="budimport" >
        <el-dialog title="经营报表导入" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="1600px"
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
        <el-form size="mini" ref="ruleForm"  @submit.native.prevent label-width="100px">
          <el-row>
           <el-col :span="6">
                <el-form-item label="所属公司：" prop="code" style="position:relative;" >                      
                    <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode" style="width:100%"></tree-select>
                    <div class="editOrgComp-row-tree" v-show="treeComp.show" >                
                        <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                          @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                    </div>
                                 
                </el-form-item>
            </el-col>        
              <el-col :span="3">
                <el-form-item label="所属年份：" prop="year" style="position:relative;" >               
                    <el-date-picker v-model="form.year" 
                    type="year" 
                    placeholder="年份"     
                    style="width:100%"
                     ></el-date-picker>    
                </el-form-item>
            </el-col>
        <el-col :span="5">
            <el-form-item label="导入文件：" prop="filecontent" >
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
    <el-row style="height:600px">
   <el-tabs v-model="tabActiveName" type="card">
        <el-tab-pane
            v-for="(item, index) in TableDataList"
            :key="index"
            :label="item.name"
            :name="'budget'+index"
        
        >       
          <el-table
            :cell-class-name="tableRowClassName"
                v-loading="table.loading"
                :data="TableDataList[index].data"
                :row-key = "getRowKeys"
                border
                stripe
                highlight-current-row
                fit
                height="550px"
                style="width: 100%"
                ref="table"
            >
            <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column>
                <!-- <el-table-column type="index" align="center" label="序号" width="50">
                <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
                </el-table-column> -->
            
               <el-table-column v-for=" (titem, tindex) in TableDataList[index].showListNameList" 
               :key="tindex" 
               :label="titem.cellName"
                :width="tindex===0?'50px':'150'" 
                align="center" 
                 show-overflow-tooltip
               >
                <template slot-scope="scope"  v-if="titem.issecond===false">               
                    <span v-if="titem.dataName==='feename'" >
                            {{ (scope.row["feename1"]==="" || scope.row["feename1"]===null || scope.row["feename1"]===undefined)? scope.row[titem.dataName] :scope.row["feename1"]}}
                            </span>
                           <span v-else>{{ scope.row[titem.dataName] }}</span>
                </template>
                  <el-table-column  v-for=" (setitem, setindex) in titem.secondetitle"  
                    :key="setindex" 
                    :label="setitem.cellName"
                      width="150" 
                      align="center" 
                      show-overflow-tooltip                   
                      :v-if="titem.issecond===true">
                        <!-- <span >{{ setitem.dataName }}</span> -->
                      <template slot-scope="scope">
                          
                           <span >{{ scope.row[setitem.dataName] }}</span>
                      </template>
                  </el-table-column>
            </el-table-column>
              
            </el-table>
       
        </el-tab-pane>
    </el-tabs>
    </el-row>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="windowShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="save()" size="small">确 定</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>
<style lang="scss">
.budimport{
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
    
</style>
<script>
import { tableMixin } from "mixin/commTable"
import upload from 'components/upload/upload'
import xlsx from 'xlsx'
import {warnMsg,successMsg,htmlMsg} from 'utils/messageBox'
import {getOrganizatonTreeNoUsers} from 'api/user/organization'
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {ImportReport} from 'api/DataImport/AnalysisReport'

export default {
    components:{ upload, treeSelect,
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
                this. tabActiveName="budget0";
                this.form = {     
                    code:"",
                    year:undefined           
                }
                this.treeComp.choosedTreeNodeId=[];
                this.choosedTreeNode=[];
                this.$emit("on-show-change",newValue);
            }
        }
    },
    data() {
        return {      
            windowShow: this.pshow,
            bthloading:false,
            TableDataList:[],//表格数据,显示导入数据
            filecontent:"",
            tabActiveName:"budget0",
             treeComp: {
                show: false,
                data: [],
                choosedTreeNodeId: [],  //回显树节点ID
            },
           
             choosedTreeNode: [],
             form:{
                  code:"",
                   year:undefined  
             },       
                      
        }
    },
    methods: {
       getRowKeys(row) {
            return row.id;
       },
        //获取组织树
        getOrganizationTree() {
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result;             
                
            })
        },
        getTreeData(data){
            for(let i=0;i<data.length;i++){
                if(data[i].children.length<1){
                // child若为空数组，则将child设为undefined
                data[i].children=undefined;
                }else {
                // child若不为空数组，则继续 递归调用 本方法
                getTreeData(data[i].children);
                }
            }
            return data;
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
          
          
          this.TableDataList=[];
          //数据后台
          let contrast = {
              0: 'orderid',
              1: 'feename',
              2: 'feename1',
              3: 'allbudget',
              4: 'actcomtotal',
              5: 'combudschedule',
              6: 'cumulbudget',
              7: 'cumcompbudget',
              8: 'budget1',
              9: 'actbudget1',
              10: 'compbudget1',
              11: 'budget2',
              12: 'actbudget2',
              13: 'compbudget2',
              14: 'budget3',
              15: 'actbudget3',
              16: 'compbudget3',
              17: 'budget4',
              18: 'actbudget4',
              19: 'compbudget4',
              20: 'budget5',
              21: 'actbudget5',
              22: 'compbudget5',
              23: 'budget6',
              24: 'actbudget6',
              25: 'compbudget6',
              26: 'budget7',
              27: 'actbudget7',
              28: 'compbudget7',
              29: 'budget8',
              30: 'actbudget8',
              31: 'compbudget8',
              32: 'budget9',
              33: 'actbudget9',
              34: 'compbudget9',
              35: 'budget10',
              36: 'actbudget10',
              37: 'compbudget10',
              38: 'budget11',
              39: 'actbudget11',
              40: 'compbudget11',
              41: 'budget12',
              42: 'actbudget12',
              43: 'compbudget12'
            }

         
            this.importFile(file, (data) => {
              
              var allTableDataList=[];//所有的工作表数据

              data[0].parseData.forEach((arrItem,i) => {
                  
                if(arrItem.name==="利润表" || arrItem.name==="成本明细表-小计" || arrItem.name==="费用表-小计"){
                        //获取的单个工作表数据信息
                      var tabledata={
                          name:arrItem.name
                      };
                    
                      let shownnamelist=[];//获取列名
                      var firno=false;//从行号一行开始;
                      var firrowno=0;//获取行号所在行的行号
                      //   arrItem.data.forEach((dataitem,index)=>{            
                      //     if(dataitem[0]=="行号"){
                      //       firrowno=index;
                      //         //throw new Error("");
                      //      }                     
                      //  })

                        let arr = [];
                        var lastrow=arrItem.data.length;
                        arrItem.data.forEach((dataitem,index)=>{                                                     
                            if(firno && index <lastrow) {
                              let obj = {} 
                              for(let [index,item] of dataitem.entries()) {
                               // var celldata=Number(item.toString());
                                contrast[index] && (obj[contrast[index]] = item || '')
                              }
                                if( (obj.feename !=="" && obj.feename !==null && obj.feename !==undefined )
                                ||(obj.feename1 !=="" && obj.feename1 !==null && obj.feename1 !==undefined )  )
                                { 
                                  if(obj.feename ==="注：" )
                                  {
                                    lastrow=index;
                                  }   
                                                        
                                  else {
                                  
                                    arr.push(obj)  
                                  }       
                                                            
                                } 
                                else if(obj.orderid=="费用合计"){
                                    obj.feename=obj.orderid;
                                    obj.orderid="0";
                                    arr.push(obj)  
                                }             
                            }
                            else if( index <lastrow){
                              if(dataitem[0]=="行号"){
                                  firrowno=index;  
                                  firno=true;                  
                                }                            
                            }
                              

                      })

                      var title1= arrItem.data[firrowno];//标题所在行
                      var title2=[];
                      if(arrItem.data.length>firrowno+1)
                      {
                        title2= arrItem.data[firrowno+1];//第二行标题所在行

                      }
                      var ismerge=false;//是否是合并单元格
                      var hbrowno=0;
                      title1.forEach((item,index)=>{
                        if(item!==""  && item !==null && item !==undefined)
                        {            
                          //当前未为合并标题 ,二级标题列追加到以及标题列
                          if(ismerge===true)
                          {
                            for(var t=hbrowno;t<index;t++)
                            {
                              if(title2[t] !=="" && title2[t] !==null && title2[t] !==undefined)
                                {                           
                                    var sectitle={
                                      cellName:title2[t],
                                      dataName:contrast[t]
                                    };                    
                                  shownnamelist[shownnamelist.length-1].secondetitle.push(sectitle);
                                }
                              
                            }
                            
                          }
                          //默认该标题列不是合并单元格
                          ismerge=false;
                          var tltle={
                            cellName:item,
                            issecond:false,
                            secondetitle:[],
                            dataName:contrast[index]
                          }
                          if(title2.length>index)
                          {
                            //当该二级标题列数据不为空时默认为合并标题列
                            if(title2[index] !=="" && title2[index] !==null && title2[index] !==undefined)
                            {
                              ismerge=true;
                              hbrowno=index;
                              tltle.issecond=true;
                              if(index===title1.length-1)
                              {
                                for(var t=index;t<title2.length;t++)
                                {
                                  if(title2[t] !=="" && title2[t] !==null && title2[t] !==undefined)
                                    {                         
                                        var sectitle={
                                          cellName:title2[t],
                                          dataName:contrast[t]
                                        };                    
                                      tltle.secondetitle.push(sectitle);
                                    }
                                  
                                }
                              }
                              // var sectitle={
                              //    cellName:title2[index],
                              //    dataName:contrast[index]
                              // };
                              // tltle.secondetitle.push(sectitle);                  

                            }
                          }            
                          shownnamelist.push(tltle);

                        }
                                  

                      });
                      

                        
                      tabledata.data=arr;
                      tabledata.showListNameList=shownnamelist;
                      allTableDataList.push(tabledata) ;
                }
          
              });
                
              this.TableDataList=allTableDataList;   
              this.table.loading = false;       
            })
    },
    importFile(fileArr,  func) {
     this.table.loading = true; 
      fileArr = toString.call(fileArr) === '[object Array]' ? fileArr : [fileArr]
      let fileData = fileArr.map(item => {
        return {
          name: item.name,
          file: item,
          extensionName: (item.name.lastIndexOf('.') == -1 ? '' : item.name.substr(item.name.lastIndexOf('.')+1)).toLowerCase(), 
          parseData: []
        }
      })

      let parseXlsx = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
          
          const bstr = e.target.result
      
          var binary = "";
          var bytes = new Uint8Array(bstr);
          var length = bytes.byteLength;
          for(var i = 0; i < length; i++) { 
              binary += String.fromCharCode(bytes[i]);
          }
      
          const wb = xlsx.read(binary, {type: 'binary', raw: true,cellDates: true})
    


          var parseData=[];
          wb.SheetNames.forEach((item,index) => {
              const wsname = wb.SheetNames[index];
              const ws = wb.Sheets[wsname];
             const data = xlsx.utils.sheet_to_json(ws, {header: 1})
             let nowdata={
                 name:item,
                 data:data
             }
            parseData.push(nowdata);
         });
            fileData.find(item => item.name === file.name).parseData = parseData;
            if(fileData.filter(item => !item.parseData).length === 0)
                func(fileData)
          
        }
        reader.readAsArrayBuffer(file)
      }

      //修改标识
      fileData.forEach(item => {
        if(/xlsx|xls|XLS|XLSX/.test(item.extensionName))
          parseXlsx(item.file)
        else {
            this.table.loading = false; 
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
           var arr=[];
           this.TableDataList.forEach(item=>{
             var datalist=[];
             let currdata={
               Name:item.name
             }
              item.data.forEach(daitem=>{
                for(var i=1 ;i<13;i++)
                {                          
                  let savedata={
                    LinNO:daitem.orderid,
                    TotalBudget:daitem.allbudget,
                    CompletedTotal:daitem.actcomtotal,
                    Month:i,
                    BudgetAmount:daitem["budget"+i],
                    CompletedAmount:daitem["actbudget"+i],
                  }
                  datalist.push(savedata);

                }

              })
              currdata.Data=datalist;
              arr.push(currdata);
           })
            
            let data={
                      code:this.form.code,                     
                      year:this.form.year.getFullYear(),
                      Data:arr
                  };
             this.bthloading=true;
              ImportReport(data).then(res => {
                if(res.success)
                {
                  this.bthloading=false;
                  successMsg("经营报表导入成功");
                    
                }
            })
            .catch(err=>{
                this.bthloading=false;
            });
                  // var showmsg=JSON.stringify(data);
                  // htmlMsg(showmsg.toString(),{type: "warning", duration: 0, showClose: true});
                 
        },
    }
}
</script>