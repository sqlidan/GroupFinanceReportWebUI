<template>
  <div class="app-container SpecialFee">
    <el-form size="mini" @submit.native.prevent label-width="100px">
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
                <el-select v-model="search.depcode"  
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
          <el-col :span="4">
            <el-form-item label="预算类别："  label-width="90px">
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
                <el-form-item label="所属月份：" prop="month" style="position:relative;" label-width="90px">               
                     <el-select v-model="search.month"  placeholder="请选择月份" style="width:100%" clearable filterable>
                        <el-option v-for="item in monthlist" 
                        :key="item.value" 
                        :label="item.label" 
                        :value="item.value">

                        </el-option>
                    </el-select>   
                </el-form-item>
            </el-col>
        <el-col :span="4">
          <el-form-item label prop label-width="10px">
           <el-button type="primary" size="mini" @click="getTableList()">搜索</el-button>       
            <el-button type="primary" size="mini" @click="openAdd()" v-if="checkBtnPeimission(specialfee.add.permission)">新增</el-button>
            <el-button type="primary" size="mini" @click="onBatchDelete()" :loading="bthloading" v-if="checkBtnPeimission(specialfee.delete.permission)">批量删除</el-button>
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
        height="calc(100% - 80px)"
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
          prop="dispalyname"
          label="公司"       
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="depname"
          show-overflow-tooltip
          label="部门"
          min-width="50%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="budgetType"
          show-overflow-tooltip
          label="预算类别"
          min-width="35%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="project"
          show-overflow-tooltip
          label="科目"
          min-width="35%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="year"
          show-overflow-tooltip
          label="年"
          min-width="25%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="month"
          show-overflow-tooltip
          label="月"
          min-width="25%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="amount"
          show-overflow-tooltip
          label="金额"
          min-width="35%"
           sortable="custom"
        >
        </el-table-column>
        
         <el-table-column align="center" label="操作" width="130" >
            <template slot-scope="scope" >
                <div class="tableBtn"  @click="openUpdate(scope.row)"  v-if="checkBtnPeimission(specialfee.update.permission)">编辑</div>
                <div class="tableBtn"  @click="deletesinge(scope.row)"  v-if="checkBtnPeimission(specialfee.delete.permission)">删除</div>                      
            </template>
          </el-table-column>
      
      </el-table>
      <el-pagination
        style="margin-top:10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total"
        :page-sizes="page.pageSelectArr"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
     <EditSpecialFee  ref="EditComp" :pshow="EditComp.show" @on-show-change="onEditCompShowChange"
          @on-save-success="onSaveSuccess">
        </EditSpecialFee>
  </div>
</template>
<style lang="scss">
.SpecialFee {
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
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import { GetSpecialFeeQueryList,BathDeleteSpecialFee } from "api/DataMaintenance/SpecialFee";
import EditSpecialFee from  "./EditSpecialFee"
import {warnMsg,successMsg} from 'utils/messageBox'
import {checkBtnPeimission,specialfee} from 'utils/btnRole'

export default {
  name: "SpecialFeeIndex",
  components: { treeSelect,
                tree,EditSpecialFee},
  mixins: [tableMixin],
  data() {
    return {
      specialfee,
      TableDataList:[],//表格数据,显示导入数据
      search:{
         code:"",
         depcode:"",
         month:"",
         budgettype:""
      },
      typeList:[],//借贷放向
      bthloading:false,
      EditComp: {
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
      budyear:new Date(),
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
            GetDeptUnitList({code:this.search.code}).then(res => {
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
    //获取国家列表
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
        GetSpecialFeeQueryList(data).then(res => {
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
    deletesinge(row){
       this.$confirm('是否删除该特殊费用?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                BathDeleteSpecialFee([row.id]).then(res => {
                    if(res.success)
                        this.getTableList()
                    }
                )
            }).catch(() => {
                
            });
    },
     //批量删除
    onBatchDelete() {
     
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要删除的特殊费用");
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
        BathDeleteSpecialFee(arr).then(res => {
           this.bthloading=false;
          this.$refs.table.clearSelection();
          this.getTableList();
         
        }) .catch(err=>{
           this.bthloading=false;
        });
      });
    },
     onSaveSuccess(){
      this.getTableList();
    },
    
    onEditCompShowChange(val){
      this.EditComp.show = val 
    },
    openUpdate(row){
       this.$refs.EditComp.pageType = 'update'
      this.EditComp.show = true;    
      this.$refs.EditComp.setComBox();
       this.$refs.EditComp.getOrganizationTree();

      this.$refs.EditComp.GetSpecialFeeById(row.id);
    },
    openAdd(){
      this.EditComp.show = true
      this.$refs.EditComp.pageType = 'insert'
      this.$refs.EditComp.setComBox();
       this.$refs.EditComp.getOrganizationTree();
    }
  
  },
  created() {
    this.setComBox();
    this.getOrganizationTree();
  }
  
}
</script>