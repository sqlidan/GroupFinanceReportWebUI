<template>
  <div class="app-container budgetimport" >
    <el-form size="mini" @submit.native.prevent label-width="70px">
    <el-row>
        <el-col :span="5">
               <el-form-item label="公司：" prop="" style="position:relative;" >            
                    
                    <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode" style="width:100%"></tree-select>
                    <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                        <!-- <tree ref='treeComp' :pCheckStrictly="true"  :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                            @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree> -->
                        <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                          @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                    </div>
                </el-form-item>
            <!-- <el-form-item label="公司：" prop="filecontent" >        
                <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode" style="width:100%"></tree-select>
                <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                    <tree ref='treeComp' :pCheckStrictly="true"  :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                        @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>
                </div>
            </el-form-item> -->
          </el-col>
           <el-col :span="4">
            <el-form-item label="部门归属：" prop="" label-width="90px">
                <el-select v-model="search.depcode"  
                 placeholder="请选择部门" 
                 style="width:100%"  
                 clearable
                 filterable     >
                        <el-option v-for="item in deptreeComp.data" 
                        :key="item.nodeId"
                        :label="item.nodeName" 
                        :value="item.nodeName"></el-option>
                    </el-select>   
            </el-form-item>
          </el-col>
           <el-col :span="3">
                <el-form-item label="所属年份：" prop="budyear" style="position:relative;" label-width="90px">               
                    <el-date-picker v-model="budyear" 
                    type="year" 
                    placeholder="所属年份"    
                    style="width:100%"
                     ></el-date-picker>    
                </el-form-item>
            </el-col>
             <!-- <el-col :span="3">
                <el-form-item label="所属月份：" prop="month" style="position:relative;" >               
                     <el-select v-model="search.month" multiple collapse-tags placeholder="请选择部门" style="width:100%">
                        <el-option v-for="item in monthlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>   
                </el-form-item>
            </el-col> -->
             <el-col :span="4">
            <el-form-item label="预算类别：" prop="budgettype" label-width="90px">
             <el-select
              v-model="search.budgettype"
              placeholder="预算类别"
              clearable
              filterable          
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.displayText"
                :value="item.value"
              ></el-option>
            </el-select>
            </el-form-item>
          </el-col>
          
         <el-col :span="4">
            <el-form-item label="是否提交：" prop="budgettype" label-width="90px">
             <el-select
              v-model="search.IsSubmit"
              placeholder="是否提交"
              clearable
              filterable          
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="4">
            <el-form-item label="是否撤回：" prop="budgettype" label-width="90px">
             <el-select
              v-model="search.IsWithdraw"
              placeholder="是否撤回"
              clearable
              filterable          
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
    </el-row>
    <el-row>
        <el-col :span="5">
            <el-form-item label="项目：" prop="feename" >
              <el-input placeholder="项目"  style="width:100%;" v-model="search.feename" size="mini" clearable ></el-input>
            </el-form-item>
          </el-col>
          
        <el-col :span="12">
          <el-form-item label prop label-width="10px">
          <el-button type="primary" size="mini" @click="getTableList()">搜索</el-button>
            
          <el-button type="primary" size="mini" @click="Importdata()" v-if="checkBtnPeimission(budimport.Createbud.permission)">导入</el-button>
          <el-button type="primary" size="mini" @click="onBatchDelete()" :loading="bthloading" v-if="checkBtnPeimission(budimport.Deletebud.permission)">批量删除</el-button>
          <el-button type="primary" size="mini" @click="SubmitBudget()" :loading="bthloading" v-if="checkBtnPeimission(budimport.Submitbud.permission)">提交</el-button>
          <el-button type="primary" size="mini" @click="CancelSubmit()" :loading="bthloading" v-if="checkBtnPeimission(budimport.CancelSubmitbud.permission)">取消提交</el-button>
          <el-button type="primary" size="mini" @click="AgreeCancelSubmit()" :loading="bthloading" v-if="checkBtnPeimission(budimport.AgreeCancelSubmitbud.permission)">同意取消提交</el-button>
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
                height="calc(100% - 130px)"
                style="width: 100%"
                ref="table"
                @sort-change="sortChange"
                @selection-change="onSelectChange"
            >
            <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column>
                <!-- <el-table-column type="index" align="center" label="序号" width="50">
                <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
                </el-table-column> -->
                <el-table-column
                align="center"
                prop="company"
                label="公司"
                show-overflow-tooltip
                sortable="custom"
                 width="200"
                >        
                </el-table-column>
                  <el-table-column
                align="center"
                prop="dept"
                label="部门归属"
                show-overflow-tooltip
                 sortable="custom"
                  width="150"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="nccdept"
                label="部门"
                show-overflow-tooltip
                 sortable="custom"
                  width="150"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="budgettypename"
                label="预算类别"
                show-overflow-tooltip
                 sortable="custom"
                  width="120"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="year"
                label="年份"
                show-overflow-tooltip
                 sortable="custom"
                  width="100"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="linNO"
                label="行号"
                show-overflow-tooltip
                 sortable="custom"
                  width="100"
                >        
                </el-table-column>
            
                <el-table-column
                align="center"
                prop="parentProjectName"
                label="父级项目"
                show-overflow-tooltip
                sortable="custom"
                width="150"
                >        
                </el-table-column>
                <el-table-column
                align="center"
                prop="projectName"
                label="项目"
                show-overflow-tooltip
                sortable="custom"
                width="150"
                >              
                </el-table-column>
               
                <el-table-column
                align="center"
                prop="annualTotal"              
                show-overflow-tooltip
                label="全年预算"
                width="110"
                sortable="custom"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="january"    
                show-overflow-tooltip
                label="1月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="february"    
                show-overflow-tooltip
                label="2月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="march"
                sortable="3月预算"
                show-overflow-tooltip
                label="3月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="april"          
                show-overflow-tooltip
                label="4月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="may"     
                show-overflow-tooltip
                label="5月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="june"         
                show-overflow-tooltip
                label="6月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="july"         
                show-overflow-tooltip
                label="7月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="august"         
                show-overflow-tooltip
                label="8月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="september"         
                show-overflow-tooltip
                label="9月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="october"        
                show-overflow-tooltip
                label="10月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="november"        
                show-overflow-tooltip
                label="11月预算"
                 width="100"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="december"        
                show-overflow-tooltip
                label="12月预算"
                 width="100"
                ></el-table-column>    
                <el-table-column
                  align="center"
                  prop="isSubmit"
                  label="是否提交"
                  width="100"
                  :show-overflow-tooltip="true"
                   sortable="custom"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.isSubmit?"是":"否"}}</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  align="center"
                  prop="isWithdraw"
                  label="是否撤回"
                  width="100"
                  :show-overflow-tooltip="true"
                   sortable="custom"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.isWithdraw?"是":"否"}}</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  align="center"
                  prop="lastWithdraw"
                  label="最后申请撤回时间"
                  width="150"
                  :show-overflow-tooltip="true"
                   sortable="custom"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.lastWithdraw | parseTime()}}</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  align="center"
                  prop="lastWithdrawUserName"
                  label="最后申请撤回人"
                  width="150"
                  :show-overflow-tooltip="true"
                   sortable="custom"
                >
                </el-table-column>
                  <el-table-column
                  align="center"
                  prop="lastagreeWithdraw"
                  label="最后申请撤回同意时间"
                  width="170"
                  :show-overflow-tooltip="true"
                   sortable="custom"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.lastagreeWithdraw | parseTime()}}</span>
                  </template>
                </el-table-column>
                 <el-table-column
                  align="center"
                  prop="lastagreeWithdrawUserName"
                  label="最后申请撤回同意人"
                  width="170"
                  :show-overflow-tooltip="true"
                   sortable="custom"
                >
                </el-table-column>
                
                <el-table-column align="center" label="操作" width="110" fixed="right">
                    <template slot-scope="scope"  v-if="scope.row.isSubmit!==true">
                        <div class="tableBtn"  @click="openUpdatebudget(scope.row)" v-if="checkBtnPeimission(budimport.Editbud.permission)">编辑</div>
                        <div class="tableBtn"  @click="deletesinge(scope.row)" v-if="checkBtnPeimission(budimport.Deletebud.permission)">删除</div>                      
                    </template>
                  </el-table-column>
     
            </el-table>
             <el-pagination
                style="margin-top:10px;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-size="page.pageSize"
                :total="page.total"
                :page-sizes="page.pageSelectArr"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        <BudImport ref="ImportComp" :pshow="ImportComp.show" @on-show-change="onImportCompShowChange"
          @on-save-success="onSaveSuccess"
        ></BudImport>
       <EditBudget  ref="EditBudgetComp" :pshow="EditBudgetComp.show" @on-show-change="onEditBudgetCompShowChange"
          @on-save-success="onSaveSuccess">
        </EditBudget>
  </div>
</template>
<style lang="scss">
.budgetimport {
  height: 100%;
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
 
  //class="el-tabs el-tabs--card el-tabs--top"
//  .el-tabs el-tabs--card el-tabs--top{
//       height: 50%;
//   }
// .el-tabs--card .el-tabs__content {
//       height: 50%;
//   }
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import BudImport from "./BudImport"
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {getOrganizatonTreeNoUsers,GetDeptUnitList,GetDepList} from 'api/user/organization'
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import {GetBudgetQueryList,DeleteBudget,SubmitBudget,CancelSubmit,AgreeCancelSubmit} from 'api/DataImport/Budget'
import {warnMsg,successMsg} from 'utils/messageBox'
import EditBudget from "./EditBudget"
import {checkBtnPeimission,budimport} from 'utils/btnRole'

export default {
  name: "budgetImportIndex",
  components: {BudImport,EditBudget,
                treeSelect,
                tree
              },
  mixins: [tableMixin],
  data() {
    return {
      budimport,
      TableDataList:[],//表格数据,显示导入数据
      budyear:new Date(),
      bthloading:false,
      search:{
        code:"",
        depcode:"",
        feename:"",
        budgettype:"",
        IsSubmit:"",
        IsWithdraw:""

      },
      typeList:[],//预算类别
      ImportComp: {
                show: false
            },
      EditBudgetComp: {
          show: false
      },
      treeComp: {
              show: false,
              data: [],
              choosedTreeNodeId: [],  //回显树节点ID
          },
      deptreeComp: {
          data: [],
      },
      choosedTreeNode: [],
    }
  },
  methods: {
    checkBtnPeimission,
    getRowKeys(row) {
            return row.id;
    },
     //添加查询combox
    setComBox() {
      getDicListByDitType({ BaseKeyValueTypeCode: "BUDGETTYPE", Code: "", Name: ""  }).then(res => {
        this.typeList = res.result.comboxs;
      });
      
    },
    //获取组织树
        getOrganizationTree() {
            //{IsShowdep:true}
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result;
                if(res.result.length>0)
                {
                  this.onNodeClick([res.result[0]]);
                  this.treeComp.choosedTreeNodeId=[res.result[0].nodeId]
                } 
            })
        },
        //根据公司获取部门
        getdeplist(){
            this.search.depcode="";
            this.deptreeComp.data=[];
            GetDepList({code:this.search.code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })

        },
        //树数据回调事件
        onNodeClick(clickNode)   //choosedNodeID
        {
            this.search.code = clickNode.length > 0 ? clickNode[0].nodeUUid : ''
            this.choosedTreeNode=clickNode;
            this.getdeplist();
        },
        //
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
    //获取列表
    getTableList() {
      if(this.search.code==="" || this.search.code===null ||this.search.code===undefined)
      {
        warnMsg("请选择公司");
        return;
      }
      let data=this.search;
      if(this.budyear!=="" && this.budyear!==null && this.budyear!==undefined)
      {
        data.year=this.budyear.getFullYear();

      }
      else{
         data.year=null;
      }
      
      data.maxResultCount= this.page.pageSize;
      data.skipCount= (this.page.currentPage - 1)*this.page.pageSize;
      data.sorting= this.table.order.sort;
      this.table.loading = true;
      this.$refs.table.clearSelection();
      GetBudgetQueryList(data).then(res => {
          if(res.success)
          {
             this.table.loading = false;
             this.TableDataList = res.result.items;
             this.page.total = res.result.totalCount
          }
              
        }).catch(err=>{
           this.table.loading = false;
        }) 

    },
    Importdata(){
       
         var dd=new Date();
        this.$refs.ImportComp.form.year=dd;
        this.$refs.ImportComp.getOrganizationTree();
         this.ImportComp.show = true;
        // this.$refs.ImportComp.pageType = 'insert'
        // this.$refs.ImportComp.GetRoleList()
        // this.$refs.ImportComp.getOrganizationTree()
    },
    onImportCompShowChange(val){
      this.ImportComp.show = val 
    },
    onEditBudgetCompShowChange(val){
      this.EditBudgetComp.show = val 
    },
    onSaveSuccess(){
      this.getTableList();

    },
    deletesinge(row){
       this.$confirm('是否删除该预算信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                DeleteBudget([row.id]).then(res => {
                    if(res.success)
                        this.onSaveSuccess()
                    }
                )
            }).catch(() => {
                
            });
    },
      //批量删除
    onBatchDelete() {
     
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要删除的预算信息");
        return;
      }
      this.$confirm("是否确定删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(({ value }) => {
        let arr = this.table.choosedRow.map(item => {
          return item.id;
        });
          this.bthloading=true;
        DeleteBudget(arr).then(res => {
           this.bthloading=false;
          this.$refs.table.clearSelection();
          this.onSaveSuccess();
         
        }) .catch(err=>{
           this.bthloading=false;
        });
      });
    },
    SubmitBudget() {
     
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要提交的预算信息");
        return;
      }
      var selecs=this.table.choosedRow;
      if (selecs.filter(item=>item.isSubmit ===true).length>0) {
        warnMsg("存在已提交的预算信息");
        return;
      }
      this.$confirm("是否确定提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(({ value }) => {
        let arr = this.table.choosedRow.map(item => {
          return item.id;
        });
        this.bthloading=true;
        SubmitBudget(arr).then(res => {
           this.bthloading=false;
          this.$refs.table.clearSelection();
          this.onSaveSuccess();
         
        })
        .catch(err=>{
           this.bthloading=false;
        });
      });
    },
      CancelSubmit() {
     
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要取消提交的预算信息");
        return;
      }
      var selecs=this.table.choosedRow;
      if (selecs.filter(item=>item.isSubmit !==true).length>0) {
        warnMsg("存在未提交的预算信息");
        return;
      }
      if (selecs.filter(item=>item.isWithdraw ===true).length>0) {
        warnMsg("存在已提交撤回的预算信息");
        return;
      }
      this.$confirm("是否确定取消提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(({ value }) => {
        let arr = this.table.choosedRow.map(item => {
          return item.id;
        });
        this.bthloading=true;
        CancelSubmit(arr).then(res => {
           this.bthloading=false;
          this.$refs.table.clearSelection();
          this.onSaveSuccess();
         
        })
        .catch(err=>{
           this.bthloading=false;
        });
      });
    },
     AgreeCancelSubmit() {
     
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要同意取消提交的预算信息");
        return;
      }
      var selecs=this.table.choosedRow;
      if (selecs.filter(item=>item.isSubmit !==true).length>0) {
        warnMsg("存在未提交的预算信息");
        return;
      }
       if (selecs.filter(item=>item.isWithdraw !==true).length>0) {
        warnMsg("存在未提交撤回的预算信息");
        return;
      }
      this.$confirm("是否确定同意取消提交", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(({ value }) => {
        let arr = this.table.choosedRow.map(item => {
          return item.id;
        });
        this.bthloading=true;
        AgreeCancelSubmit(arr).then(res => {
           this.bthloading=false;
          this.$refs.table.clearSelection();
          this.onSaveSuccess();
         
        })
        .catch(err=>{
           this.bthloading=false;
        });
      });
    },
    openUpdatebudget(row){
       this.$refs.EditBudgetComp.pageType = 'update'
      //this.$refs.editOrganizatonComp.form.name=''
      this.EditBudgetComp.show = true;
      //获取组织树
      this.$refs.EditBudgetComp.getOrganizationTree();
      this.$refs.EditBudgetComp.setComBox();

      this.$refs.EditBudgetComp.GetBudgetById(row.id);
    }

  
  },
  created() {
    this.setComBox();
    this.getOrganizationTree();
  }
  
}
</script>