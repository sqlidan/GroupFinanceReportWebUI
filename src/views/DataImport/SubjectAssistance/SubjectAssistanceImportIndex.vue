<template>
  <div class="app-container sujectassimport" >
    <el-form size="mini" @submit.native.prevent label-width="70px">
    <el-row>
        <el-col :span="5">
               <el-form-item label="公司：" prop="" style="position:relative;" >            
                    
                     <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode" style="width:100%"></tree-select>
                    <div class="editOrgComp-row-tree" v-show="treeComp.show" >                       
                        <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                          @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                    </div>
                  
                </el-form-item>     
          </el-col>
           <el-col :span="4">
            <el-form-item label="部门：" prop="">
                <el-select v-model="search.DeptCode"  
                 placeholder="请选择部门" 
                 style="width:100%"  
                 clearable
                 filterable     >
                        <el-option v-for="item in deptreeComp.data" 
                        :key="item.nodeId"
                        :label="item.nodeName" 
                        :value="item.nodeUUid"></el-option>
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
             <el-col :span="3">
                <el-form-item label="月份：" prop="Month" style="position:relative;">               
                     <el-select v-model="search.Month"  placeholder="请选择月份" style="width:100%" 
                      multiple 
                      collapse-tags  
                      clearable filterable>
                        <el-option v-for="item in monthlist" 
                        :key="item.value" 
                        :label="item.label" 
                        :value="item.value">

                        </el-option>
                    </el-select>   
                </el-form-item>
            </el-col>
            
          
         <el-col :span="3">
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
            <el-col :span="3">
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
          <el-col :span="2">
          <el-form-item label prop label-width="10px">
          <el-button type="primary" size="mini" @click="getTableList()">搜索</el-button>
          <el-button type="primary" size="mini" @click="Importdata()" v-if="checkBtnPeimission(AccountBalanceImport.import.permission)">导入</el-button>   
          </el-form-item>
        </el-col>
    </el-row>
    <el-row>
        <!-- <el-col :span="5">
            <el-form-item label="项目：" prop="feename" >
              <el-input placeholder="项目"  style="width:100%;" v-model="search.feename" size="mini" clearable ></el-input>
            </el-form-item>
          </el-col> -->
          
        <el-col :span="12">
          <el-form-item label prop label-width="10px">
                  
        <el-button type="primary" size="mini" @click="openAdd()" v-if="checkBtnPeimission(AccountBalanceImport.Createbud.permission)">新增</el-button>
          <el-button type="primary" size="mini" @click="onBatchDelete()" :loading="bthloading" v-if="checkBtnPeimission(AccountBalanceImport.Deletebud.permission)">批量删除</el-button>
          <el-button type="primary" size="mini" @click="SubmitBudget()" :loading="bthloading" v-if="checkBtnPeimission(AccountBalanceImport.Submitbud.permission)">提交</el-button>
          <el-button type="primary" size="mini" @click="CancelSubmit()" :loading="bthloading" v-if="checkBtnPeimission(AccountBalanceImport.CancelSubmitbud.permission)">取消提交</el-button>
          <el-button type="primary" size="mini" @click="AgreeCancelSubmit()" :loading="bthloading" v-if="checkBtnPeimission(AccountBalanceImport.AgreeCancelSubmitbud.permission)">同意取消提交</el-button>
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
                <el-table-column type="index" align="center" label="序号" width="50">
                <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
                </el-table-column>
               <el-table-column
                align="center"
                prop="company"
                show-overflow-tooltip
                label="公司"
                 sortable="custom"
                ></el-table-column>
              <!-- <el-table-column
                align="center"
                prop="deptCode"
                show-overflow-tooltip
                label="部门编码"
                 width="120"
                ></el-table-column> -->
                <el-table-column
                align="center"
                prop="depname"
                show-overflow-tooltip
                label="部门名称"
                width="150"
                 sortable="custom"
                ></el-table-column>
               <el-table-column
                align="center"
                prop="year"
                show-overflow-tooltip
                label="年"
                width="80"
                 sortable="custom"
                ></el-table-column>
                 <el-table-column
                align="center"
                prop="month"
                show-overflow-tooltip
                label="月"
               width="80"
                sortable="custom"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="subjectCode"
                show-overflow-tooltip
                label="科目编码"
               width="120"
                sortable="custom"
                ></el-table-column>
                <el-table-column
                align="center"
                prop="subjectName"
                show-overflow-tooltip
                label="科目名称"
                width="180"
                 sortable="custom"
                ></el-table-column>

                <el-table-column
                align="center"
                prop="direction"
                show-overflow-tooltip
                label="方向"
                width="100"
                 sortable="custom"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="amount"
                  show-overflow-tooltip
                  label="本期金额"
                  width="130"
                  ></el-table-column>
                <el-table-column
                align="center"
                prop="remarks"
                label="摘要"
                show-overflow-tooltip
                 width="130"
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
                 <!-- <el-table-column
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
                </el-table-column> -->
                
                <el-table-column align="center" label="操作" width="110" >
                    <template slot-scope="scope" v-if="scope.row.isSubmit!==true">
                        <div class="tableBtn"  @click="openUpdateSubject(scope.row)" v-if="checkBtnPeimission(AccountBalanceImport.Editbud.permission)">编辑</div>
                        <div class="tableBtn"  @click="deletesinge(scope.row)" v-if="checkBtnPeimission(AccountBalanceImport.Deletebud.permission)">删除</div>                      
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
        <SubjectbalanceImport ref="ImportComp" :pshow="ImportComp.show" @on-show-change="onImportCompShowChange"
          @on-save-success="onSaveSuccess"
        ></SubjectbalanceImport>
       <EditSubject  ref="EditSubjectComp" :pshow="EditSubjectComp.show" @on-show-change="onEditSubjectCompShowChange"
          @on-save-success="onSaveSuccess">
        </EditSubject>
  </div>
</template>
<style lang="scss">
.sujectassimport {
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
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import SubjectbalanceImport from "./SubjectbalanceImport"
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import {warnMsg,successMsg} from 'utils/messageBox'
import {checkBtnPeimission,AccountBalanceImport} from 'utils/btnRole'
import EditSubject from "./EditSubject"
import{InquireAccountBalance,Dels,SubmitAccountBalance,CancelSubmit,AgreeCancelSubmit} from 'api/DataImport/SubjectAssistance'


export default {
  components: {SubjectbalanceImport,
                treeSelect,
                tree,EditSubject
              },
  mixins: [tableMixin],
  data() {
    return {
      AccountBalanceImport,
      TableDataList:[],//表格数据,显示导入数据
      budyear:new Date(),
      bthloading:false,
      search:{
        Code:"",
        DeptCode:"",
        Month:[],
        IsSubmit:"",
        IsWithdraw:""

      },
      ImportComp: {
                show: false
            },
      EditSubjectComp: {
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
      monthlist:[
          {
              label:"1月",
              value:1,
          },
           {
              label:"2月",
              value:2,
          },
           {
              label:"3月",
              value:3,
          },
           {
              label:"4月",
              value:4,
          },
           {
              label:"5月",
              value:5,
          },
           {
              label:"6月",
              value:6,
          },
           {
              label:"7月",
              value:7,
          },
           {
              label:"8月",
              value:8,
          },
           {
              label:"9月",
              value:9,
          },
           {
              label:"10月",
              value:10,
          },
           {
              label:"11月",
              value:11,
          },
           {
              label:"12月",
              value:12,
          }
      ]
    }
  },
  methods: {
    checkBtnPeimission,
    getRowKeys(row) {
            return row.id;
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
            this.search.DeptCode="";
            this.deptreeComp.data=[];
            GetDeptUnitList({code:this.search.Code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })

        },
        //树数据回调事件
        onNodeClick(clickNode)   //choosedNodeID
        {
            this.search.Code = clickNode.length > 0 ? clickNode[0].nodeUUid : ''
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
      if(this.search.Code==="" || this.search.Code===null ||this.search.Code===undefined)
      {
        warnMsg("请选择公司");
        return;
      }
      let data=this.search;
      if(this.budyear!=="" && this.budyear!==null && this.budyear!==undefined)
      {
        data.Year=this.budyear.getFullYear();

      }
      else{
         data.Year=null;
      }
      
      data.maxResultCount= this.page.pageSize;
      data.skipCount= (this.page.currentPage - 1)*this.page.pageSize;
      data.sorting= this.table.order.sort;
      this.table.loading = true;
      this.$refs.table.clearSelection();
      InquireAccountBalance(data).then(res => {
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
         this.$refs.ImportComp.getOrganizationTree();
         this.ImportComp.show = true;
      
    },
    onImportCompShowChange(val){
      this.ImportComp.show = val 
    },
    onEditSubjectCompShowChange(val){
      this.EditSubjectComp.show = val 
    },
    onSaveSuccess(){
      this.getTableList();

    },
    deletesinge(row){
       this.$confirm('是否删除该科目辅助余额信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Dels([row.id]).then(res => {
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
        warnMsg("请选择要删除的科目辅助余额信息");
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
        Dels(arr).then(res => {
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
        warnMsg("请选择要提交的科目辅助余额信息");
        return;
      }
      var selecs=this.table.choosedRow;
      if (selecs.filter(item=>item.isSubmit ===true).length>0) {
        warnMsg("存在已提交的科目辅助余额信息");
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
        SubmitAccountBalance(arr).then(res => {
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
        warnMsg("请选择要取消提交的科目辅助余额信息");
        return;
      }
      var selecs=this.table.choosedRow;
      if (selecs.filter(item=>item.isSubmit !==true).length>0) {
        warnMsg("存在未提交的科目辅助余额信息");
        return;
      }
      if (selecs.filter(item=>item.isWithdraw ===true).length>0) {
        warnMsg("存在已提交撤回的科目辅助余额信息");
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
        warnMsg("请选择要同意取消提交的科目辅助余额信息");
        return;
      }
      var selecs=this.table.choosedRow;
      if (selecs.filter(item=>item.isSubmit !==true).length>0) {
        warnMsg("存在未提交的科目辅助余额信息");
        return;
      }
       if (selecs.filter(item=>item.isWithdraw !==true).length>0) {
        warnMsg("存在未提交撤回的科目辅助余额信息");
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
    openUpdateSubject(row){
        this.$refs.EditSubjectComp.pageType = 'update'
    
       this.EditSubjectComp.show = true;
       //获取组织树
       this.$refs.EditSubjectComp.getOrganizationTree();

       this.$refs.EditSubjectComp.GetAccountBalanceById(row.id);
    },
     openAdd(){
      this.EditSubjectComp.show = true
      this.$refs.EditSubjectComp.pageType = 'insert';     
       this.$refs.EditSubjectComp.getOrganizationTree();
    }

  
  },
  created() {
    this.getOrganizationTree();
  }
  
}
</script>