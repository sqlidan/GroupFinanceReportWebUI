<template>
    <div class="budimport" v-loading="divLoading">
        <el-dialog title="预算导入" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="1600px"
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
        <el-form size="mini" ref="ruleForm"  @submit.native.prevent label-width="100px">
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
                <el-form-item label="所属部门：" prop="deptcode" style="position:relative;" >               
                    <el-select v-model="form.deptcode"  clearable filterable collapse-tags placeholder="请选择部门" style="width:100%">
                        <el-option v-for="item in deptreeComp.data" :key="item.nodeId" :label="item.nodeName" :value="item.nodeUUid"></el-option>
                    </el-select>             
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
                <el-table-column
                align="center"
                prop="LinNO"
                label="行号"
                show-overflow-tooltip
                >        
                </el-table-column>
            
                <el-table-column
                align="center"
                prop="ParentProjectName"
                label="父级项目"
                 width="150"
                show-overflow-tooltip
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="ProjectName"
                label="项目"
                 width="150"
                show-overflow-tooltip
                >              
                </el-table-column>
               
                <el-table-column
                align="center"
                prop="AnnualTotal"
                
                show-overflow-tooltip
                label="全年预算"
                 width="110"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="January"    
                show-overflow-tooltip
                label="1月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="February"    
                show-overflow-tooltip
                label="2月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="March"
                sortable="3月预算"
                show-overflow-tooltip
                label="3月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="April"          
                show-overflow-tooltip
                label="4月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="May"     
                show-overflow-tooltip
                label="5月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="June"         
                show-overflow-tooltip
                label="6月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="July"         
                show-overflow-tooltip
                label="7月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="August"         
                show-overflow-tooltip
                label="8月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="September"         
                show-overflow-tooltip
                label="9月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="October"        
                show-overflow-tooltip
                label="10月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="November"        
                show-overflow-tooltip
                label="11月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="December"        
                show-overflow-tooltip
                label="12月预算"
                 width="100"
                ></el-table-column>    
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
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import {ImportBudget} from 'api/DataImport/Budget'
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'

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
                    deptcode:"" ,
                    year:undefined           
                }
                this.deptreeComp.data=[];
                this.choosedTreeNode=[];
                this.$emit("on-show-change",newValue);
            }
        }
    },
    data() {
        return {
            SetKesDept:{
                value:'nodeUUid',
                label:'nodeName',
                children:'children',
                checkStrictly :true 
            },//自定义  级联选择器value label      
            windowShow: this.pshow,
            divLoading:false,
            bthloading:false,
            TableDataList:[],//表格数据,显示导入数据
            filecontent:"",
            tabActiveName:"budget0",
             treeComp: {
                show: false,
                data: [],
                choosedTreeNodeId: [],  //回显树节点ID
            },
            deptreeComp: {
                data: [],
            },
             choosedTreeNode: [],
             form:{
                  code:"",
                  deptcode:"" ,
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
            //{IsShowdep:true}
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result;
                // this.treeComp.data.forEach(item=>{
                //     if(item.children.length<1)
                //     {
                //         item.children=undefined;
                //     }
                //     else{
                //          item.children=getTreeData(item.children);
                //     }
                // });
                
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
        //根据公司获取部门
        getdeplist(code){
            this.form.deptcode=[];
            this.deptreeComp.data=[];
            GetDeptUnitList({code:code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })

        },
        //
        onNodeClick(clickNode)   //choosedNodeID
        {
            // this.form.parentId = clickNode.nodeId
           // this.choosedTreeNode = clickNode;
        //    if(this.choosedTreeNode.length>0)
        //    {
        //         var code=this.choosedTreeNode[this.choosedTreeNode.length-1];
        //         this.getdeplist(code);

        //    }
        //    else{
        //         this.form.deptcode=[];
        //         this.deptreeComp.data=[];
        //    }
            this.form.code = clickNode.length > 0 ? clickNode[0].nodeUUid : ''
            this.choosedTreeNode=clickNode;
            this.getdeplist(this.form.code);
                      
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
            0: 'LinNO',
            1: 'ParentProjectName',
            2: 'ProjectName',
            3: 'AnnualTotal',
            4: 'January',
            5: 'February',
            6: 'March',
            7: 'April',
            8: 'May',
            9: 'June',
            10: 'July',
            11: 'August',
            12: 'September',
            13: 'October',
            14: 'November',
            15: 'December'
        }
         let contrastName = {
            0: '行号',
            1: '父级项目',
            2: '项目',
            3: '全年预算合计',
            4: '1月预算数',
            5: '2月预算数',
            6: '3月预算数',
            7: '4月预算数',
            8: '5月预算数',
            9: '6月预算数',
            10: '7月预算数',
            11: '8月预算数',
            12: '9月预算数',
            13: '10月预算数',
            14: '11月预算数',
            15: '12月预算数'
        }
        this.TableDataList=[];

        var showmsg="";
    
    
        this.importFile(file, (data) => {
            this.divLoading = true;     
            var allTableDataList=[];//所有的工作表数据

            data[0].parseData.forEach((arrItem,i) => {
                
                var filemsg="";
                //获取的单个工作表数据信息
                var tabledata={
                    name:arrItem.name
                };
                let arr = [];
                var firno=false;//从行号下一行开始
                var firfeename="";//存储父级项目
                arrItem.data.forEach(dataitem=>{
                         var msg="";
                        let obj = {}
                        for(let [index,item] of dataitem.entries()) { 
                         contrast[index] && (obj[contrast[index]] = item || '')
                        
                         if(index>2 && item !=="" && item !=null && item !==undefined && item !=="-")
                         {
                             contrast[index] && (obj[contrast[index]] = item || '')
                             
                            // var amt=Number(item).toFixed(2);                          
                             //contrast[index] && (obj[contrast[index]] = amt || '')
                                var amt=item.toString();
                                var num = amt.split(".");
                                if(num.length>1)
                                {                             
                                    var showname=contrastName[index];
                                    if(num[1].length>2)
                                    {
                                        if(msg=="")
                                        {
                                            msg=showname;
                                        }
                                        else{
                                            msg+="、"+showname;
                                        }   

                                }
                               
                               
                               // contrast[index] && (obj[contrast[index]] = showname || '')

                            }                            
                            
                         }
                        //  else{
                        //      contrast[index] && (obj[contrast[index]] = item || '')
                        //  }
                        }
                        if(firno) {
                            if( (obj.ParentProjectName !=="" && obj.ParentProjectName !==null && obj.ParentProjectName !==undefined )
                            ||(obj.ProjectName !=="" && obj.ProjectName !==null && obj.ProjectName !==undefined ) )
                            {              
                            
                                if(obj.ParentProjectName ==="" || obj.ParentProjectName ===null || obj.ParentProjectName ===undefined)
                                {
                                obj.ParentProjectName=firfeename;
                                }   
                                else 
                                {
                                firfeename=obj.ParentProjectName;
                                }
                                arr.push(obj);               
                            }   
                            else if(obj.LinNO==="费用合计")     
                             {
                                  obj.ParentProjectName=obj.LinNO;
                                  obj.LinNO="0";
                                  arr.push(obj);
                             }     
                        }
                        else{
                            if(obj.LinNO==="行号"){
                                firno=true;
                            }          
                        }
                        if(msg!=="")
                        {
                                filemsg+="第" + obj.LinNO + "行数据"+msg+"<br>";
                        }

                })
                tabledata.data=arr;
                allTableDataList.push(tabledata) ;
                if(filemsg!=="")
                {
                     var msg=arrItem.name+"下的" +filemsg+"，小数点超过两位，请将该行数据重新核算后导入<br>";
                     showmsg+=msg;
                }
        
            });
            if(showmsg==="")
            {
                 this.TableDataList=allTableDataList;   
            }
            else{
                this.TableDataList=[];
               // showmsg+="小数点超过两位，请将该行数据重新核算后导入"
                htmlMsg(showmsg,{type: "warning", duration: 0, showClose: true});
            }
            this.TableDataList=allTableDataList;   
            this.divLoading = false;       
        })
     },
    importFile(fileArr,  func) {
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
        //    else{
        //        warnMsg("请选择所属公司");
        //         return;
        //    }
            
            let data={
                      code:this.form.code,
                      deptcode:this.form.deptcode,
                      year:this.form.year.getFullYear(),
                      data:this.TableDataList
                  };
             this.bthloading=true;
              ImportBudget(data).then(res => {
                if(res.success)
                {
                  this.bthloading=false;
                  if(res.result.success && res.result.code==="3001")
                  {
                      successMsg("预算导入成功");

                  }
                  else if(res.result.msg !=="" && res.result.msg !==null && res.result.msg !==undefined)
                  {
                      htmlMsg(res.result.msg,{type: "warning", duration: 0, showClose: true});
                  }
                  else{
                      warnMsg("预算导入失败");
                  }
                    
                }
            })
            .catch(err=>{
                this.bthloading=false;
            });
                //   var showmsg=JSON.stringify(data);
                //   //htmlMsg(showmsg);//
                //   htmlMsg(showmsg.toString(),{type: "warning", duration: 0, showClose: true});
                 
        },
    }
}
</script>