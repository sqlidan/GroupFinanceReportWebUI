<template>
  <div class="app-container tenant">
 <el-form size="mini" @submit.native.prevent>
      <el-row style="margin-bottom:10px">
        <el-col :span="4">
          <el-form-item label="租户名称：">
            <el-input
              placeholder="租户名称"
              style="width:70%"
              v-model="search.tenantname"
              size="mini"
              @keyup.enter.native='onSearchBefore();getTableList()'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label prop>
            <el-button type="primary" size="mini" @click="onSearchBefore();getTableList()" >搜索</el-button>
            <el-button type="primary" size="mini" @click="openCreateTenantComp" >新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row class="tenant-tableRow">
      <el-table
      :cell-class-name="tableRowClassName"
       v-loading="table.loading"
        :data="tenantTableList"
        :row-key="getRowKeys"
        @selection-change="onSelectChange"
        border
        stripe
        highlight-current-row
        fit
        height="100%"
        style="width: 100%height:100%"
        ref="table"
        @sort-change="sortChange"
      >
        <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column>
         <el-table-column type="index" align="center" label="序号" width="50">
          <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="tenancyName"
          sortable="custom"
          show-overflow-tooltip
          label="登陆名"
          min-width="15%"
        ></el-table-column>

        <el-table-column
          align="center"
          prop="name"
          sortable="custom"
          show-overflow-tooltip
          label="姓名（公司名）"
          min-width="15%"
        ></el-table-column>
<!-- 
        <el-table-column
          align="center"
          prop="isActive"
          sortable="custom"
          show-overflow-tooltip
          label="是否激活"
          min-width="15%"
        ></el-table-column> -->


     

      <el-table-column
          align="center"
          prop="connectionString"
          sortable="custom"
          show-overflow-tooltip
          label="连接字符串"
          min-width="30%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="creationTime"
          sortable="custom"
          show-overflow-tooltip
          label="创建时间"
          min-width="15%"
        >
        <template slot-scope="scope">{{scope.row.creationTime|parseTime('{y}-{m}-{d}')}}</template>
        </el-table-column>
         <el-table-column align="center" label="操作" min-width="7%">
          <template slot-scope="scope">
            <div class="tableBtn" @click="openUpdateTenantComp(scope.row)" >编辑</div>

            <el-popover placement="top" width="160" v-model="scope.row.popShow">
              <p>是否确认删除？</p>
              <div style="text-align: right margin: 0">
                <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
                <el-button type="danger" size="mini" @click="delTenant(scope.row.id)">删除</el-button>
              </div>
              <div class="tableBtn" slot="reference" >删除</div>
            </el-popover>

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
    </el-row>
    <create-tenant ref="createTenantComp" :pshow="createTenantComp.show" @on-show-change="oncreateTenantCompShowChange"  @on-save-success="onSaveSuccess"></create-tenant>
  </div>
</template>
<style lang="scss">
.tenant {
  height: 100%;
  .tenant-tableRow {
    height: calc(100% - 150px);
  }
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import {
  getTenants,
  deleteTenant
} from "api/user/tenant"
import {warnMsg} from 'utils/messageBox'
import createTenant from './createTenant'
export default {
  name: "tenementIndex",
  mixins: [tableMixin],
  data() {
    return {
      tenantTableList: [],
      //查询
      search: {
        tenantname: ""
      },
      //新增
       createTenantComp: {
        show: false
      },
    };
  },
  components: {
    'create-tenant': createTenant
  },
  methods: {
    getRowKeys(row) {
      return row.id.toString()
    },
    //获取租户
    getTableList() {
      this.tableData = []
      this.table.loading = true
      let data = {
        Filter: this.search.tenantname,
        sorting: this.table.order.sort,
        maxResultCount: this.page.pageSize,
        skipCount: (this.page.currentPage - 1) * this.page.pageSize,
      };
      getTenants(data).then(res => {
         this.table.loading = false
        if (res.success) {
          this.tenantTableList = res.result.items
          this.page.total = res.result.totalCount
        }
      });
    },
    delTenant(id){
      //删除租户
      deleteTenant({id:id}).then(res=>{
        this.table.loading=false;
        if(res.success){
          this.getTableList();
        }
      });
    },
     //打开新增租户页面
    openCreateTenantComp() {
     this.createTenantComp.show = true
    },
    //打开编辑租户页面
     openUpdateTenantComp(row) {
     this.createTenantComp.show = true;
     this.$refs.createTenantComp.getOneTenant(row.id)
    },
    //新增或编辑租户成功事件
    onSaveSuccess() {
      this.getTableList()
    },
    oncreateTenantCompShowChange(val) {
      this.createTenantComp.show = val
    },
  },
  created() {
    this.getTableList()
  }
}
</script>
