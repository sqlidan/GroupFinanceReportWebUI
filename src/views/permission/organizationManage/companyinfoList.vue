<template>
  <div class="companyinfoList" style="height:100%;padding:10px 0px 0px">
    
    <el-card shadow="always" style="width:100%;height:100%" body-style="height:100%" class="bill-card" >
        <el-row style="padding-bottom:10px">
            <el-button type="primary" size="small" @click="openInsertOrganization()" v-if="checkBtnPeimission(orgPage.addOrg.permission)">新增公司</el-button>          
        </el-row>
      <el-table
        :cell-class-name = "tableRowClassName"
        :data = "cominfoList"
        :row-key = "getRowKeys"
        v-loading="table.loading"
        @sort-change="sortChange"
        border stripe highlight-current-row fit
        :cell-style = "{padding: '0px'}"        
        height = "calc(100% - 70px)"               
        style = "width: 100%;pa"
        ref = "table"      
      >
        <!-- <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" align="center" label="序号" width="60">
          <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="code"
          label="公司编码"
         width="120"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          prop="parentCode"
          label="上级公司编码"
          min-width="15%"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column> -->
          <el-table-column
          align="center"
          prop="displayName"
          label="公司全称"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="shortName"
          width="150"
          label="公司简称"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
         <el-table-column
          align="center"
          prop="region"
          label="大区"
          width="100"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
          <el-table-column
          align="center"
          prop="bu"
          label="BU"
          width="100"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="isJointVenture"
          label="是否合资公司"
         width="120"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{scope.row.isJointVenture?"是":"否"}}</span>
          </template>
        </el-table-column>
      
        
        <el-table-column
          align="center"
          prop="isBudget"
          label="预算是否按部门"
          width="130"
          :show-overflow-tooltip="true"
          sortable="custom"
        >
        <template slot-scope="scope">
            <span>{{scope.row.isBudget?"是":"否"}}</span>
          </template>
        </el-table-column>
         <el-table-column
          align="center"
          prop="occupyShares"
          label="占股"
          width="100"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="110">
            <template slot-scope="scope">
                <div class="tableBtn"  @click="openUpdateOrganization(scope.row)">编辑</div>
                <div class="tableBtn"  @click="deleteOrganization(scope.row)">删除</div>                      
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
      ></el-pagination>
    </el-card>
   <edit-organization ref="editOrganizatonComp" :pshow="editOrganizationComp.show" @on-show-change="closeOrgCompShowChange" @on-save-success="onSaveSuccess"></edit-organization>
   
  </div>
</template>
<style lang="scss">
.companyinfoList {
  .bill-card {
    .el-table th {
      padding: 0px 0;
    }
  
  }
 
}
</style>
<script>
import { tableMixin } from "mixin/commTable";
import { pickerOptions } from "consts/common";
import {checkBtnPeimission,orgPage} from 'utils/btnRole'
import {GetOrganizationUnitOrg,deleteOrganizaton} from 'api/user/organization'
import editOrganization from './editOrganization'

export default {
  name: "companyinfoListIndex",
  mixins: [tableMixin],
  props: {},
  components: {editOrganization},
  data() {
    return {
      orgPage,
      //引用日期快捷组件
      pickerOptions,
      editOrganizationComp: {
            show:false,
        },
      cominfoList: [],
      code:"",//公司编码
      Id:"",//公司id    
      currparnode:[]   
    };
  },
  methods: {
        checkBtnPeimission,
    getRowKeys(row) {
      return row.id.toString();
    },
    //关闭添加部门弹出框
        closeOrgCompShowChange(val) {
            this.editOrganizationComp.show = val
        },

    getTableList() {
      this.cominfoList = []; 
       this.table.loading = true
        let data = {
            Id: this.Id,
            code: this.code,
            maxResultCount: this.page.pageSize,
            skipCount: (this.page.currentPage - 1)*this.page.pageSize,
            sorting: this.table.order.sort
        }
        GetOrganizationUnitOrg(data).then(res => {
            this.table.loading = false
            if(res.success) {
                this.cominfoList = res.result.items
                this.page.total = res.result.totalCount
                
            }
        })
        .catch(err=>{
           this.table.loading = false;
        })    

    },
    //打开新建部门
        openInsertOrganization() {
            this.$refs.editOrganizatonComp.type = 'insert'
            this.editOrganizationComp.show = true
            //获取组织树           
            this.$refs.editOrganizatonComp.getOrganizationTree();
            this.$refs.editOrganizatonComp.Initparent(this.currparnode);
        },
        //打开修改部门
        openUpdateOrganization(row) {
           
            this.$refs.editOrganizatonComp.type = 'update'
            //this.$refs.editOrganizatonComp.form.name=''
            this.editOrganizationComp.show = true
            //获取组织树
            this.$refs.editOrganizatonComp.getOrganizationTree()

            this.$refs.editOrganizatonComp.getOrgDetailById(row.id)

        },
        //删除组织机构
        deleteOrganization(row) {
                     
            this.$confirm('是否删除该公司?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteOrganizaton({id: row.id}).then(res => {
                    if(res.success)
                        this.onSaveSuccess()
                    }
                )
            }).catch(() => {
                
            });
            
            
        },
      
    //添加或修改成功事件
    onSaveSuccess() {
      this.getTableList();
       this.$emit("on-save-success")
    }
  }
};
</script>