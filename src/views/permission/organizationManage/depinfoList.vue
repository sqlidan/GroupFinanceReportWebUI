<template>
  <div class="depinfoList" style="height:100%;padding:10px 0px 0px">
    
    <el-card shadow="always" style="width:100%;height:100%" body-style="height:100%" class="bill-card" >
         <el-row style="padding-bottom:10px">
            <el-button type="primary" size="small" @click="openInsertOrganization()" v-if="checkBtnPeimission(orgPage.addOrg.permission)">新增部门</el-button>          
        </el-row>
      <el-table
        :cell-class-name = "tableRowClassName"
        :data = "depdataList"
        :row-key = "getRowKeys"
        v-loading="table.loading"
        @sort-change="sortChange"
        border stripe highlight-current-row fit
        :cell-style = "{padding: '0px'}"        
        height = "calc(100% - 70px)"        
        style = "width: 100%"
        ref = "table"      
      >
        <!-- <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column> -->
        <el-table-column type="index" align="center" label="序号" width="60">
          <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="depCode"
          label="经营报表部门编码"
          width="180"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
          <el-table-column
          align="center"
          prop="depName"
          label="经营报表部门归属"
          width="200"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          prop="depNCCCode"
          label="对应NCC部门代码"
          min-width="15%"
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column> -->
         <el-table-column
          align="center"
          prop="depNCCName"
          label="对应NCC部门名称"      
          :show-overflow-tooltip="true"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="isProfit"
          label="利润"
          width="120"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{scope.row.isProfit?"是":"否"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="isCost"
          label="成本"
         width="120"
          :show-overflow-tooltip="true"
          sortable="custom"
        >
        <template slot-scope="scope">
            <span>{{scope.row.isCost?"是":"否"}}</span>
          </template>
          </el-table-column>
        
        <el-table-column
          align="center"
          prop="isFee"
          label="费用"
          width="120"
          :show-overflow-tooltip="true"
          sortable="custom"
        >
        <template slot-scope="scope">
            <span>{{scope.row.isFee?"是":"否"}}</span>
          </template>
        </el-table-column>
         <el-table-column align="center" label="操作"  width="120">
                    <template slot-scope="scope">
                        <div class="tableBtn"  @click="openUpdatedDept(scope.row)">编辑</div>
                        <div class="tableBtn"  @click="deleteDept(scope.row)">删除</div>                      
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
   <edit-Department ref="editDeptComp" :pshow="editDeptComp.show" @on-show-change="closeOrgCompShowChange" @on-save-success="onSaveSuccess"></edit-Department>
   
  </div>
</template>
<style lang="scss">
.depinfoList {
  .bill-card {
      height: 100%;
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
import {GetOrganizationUnitUsers,DeleteDept} from 'api/user/organization'
import editDepartment from './editDepartment'

export default {
  name: "depinfoListIndex",
  mixins: [tableMixin],
  props: {},
  components: {
    "edit-Department":editDepartment
    },
  data() {
    return {
        orgPage,
      //引用日期快捷组件
      pickerOptions,
      editDeptComp: {
            show:false,
        },
      depdataList: [],
      code:"",//公司编码
      Id:"",//公司id
      currparnode:[]//当前父级node
     
    };
  },
  methods: {
       checkBtnPeimission,
    getRowKeys(row) {
      return row.id.toString();
    },
    
    getTableList() {
      this.depdataList = [];     
      this.table.loading = true
        let data = {
            Id: this.Id,
            code: this.code,
            maxResultCount: this.page.pageSize,
            skipCount: (this.page.currentPage - 1)*this.page.pageSize,
            sorting: this.table.order.sort
        }
        GetOrganizationUnitUsers(data).then(res => {
            this.table.loading = false
            if(res.success) {
                this.depdataList = res.result.items
                this.page.total = res.result.totalCount
                
            }
        })
        .catch(err=>{
           this.table.loading = false;
        }) 

    },
    //关闭添加部门弹出框
        closeOrgCompShowChange(val) {
            this.editDeptComp.show = val
        },
    //打开新建部门
        openInsertOrganization() {
            this.$refs.editDeptComp.type = 'insert'
            this.editDeptComp.show = true;
            this.$refs.editDeptComp.Initparent(this.currparnode);
            //获取组织树
            this.$refs.editDeptComp.getOrganizationTree();
            
        },
        //打开修改部门
        openUpdatedDept(row) {
           
            this.$refs.editDeptComp.type = 'update'
          
            this.editDeptComp.show = true
            //获取组织树
            this.$refs.editDeptComp.getOrganizationTree()

            this.$refs.editDeptComp.getOrgDetailById(row.id)

        },
        //删除组织机构
        deleteDept(row) {                     
            this.$confirm('是否删除该部门?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                DeleteDept({id: row.id}).then(res => {
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