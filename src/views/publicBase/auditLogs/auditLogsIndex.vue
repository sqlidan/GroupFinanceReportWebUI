<template>
  <div class="app-container auditLog">
    <el-form size="mini" @submit.native.prevent>
      <el-row style="margin-bottom:10px">
        <el-col :span="6">
          <el-form-item label="执行时间:" prop label-width="68px">
            <el-date-picker
              v-model="submitDateRange"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerRangeOptions"
              @change="onSearchBefore();getTableList()"
              clearable
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="服务名称:" prop label-width="80px">
            <el-input
              placeholder="服务名称"
              v-model="search.ServiceName"
              size="mini"
              clearable
              @keyup.enter.native="getTableList()"
            ></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="4">
          <el-form-item label="方法名:" prop label-width="80px">
            <el-input
              placeholder="方法名"
              v-model="search.MethodName"
              size="mini"
              clearable
              @keyup.enter.native="getTableList()"
            ></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="4"  >
          <el-form-item label prop label-width="10px">
            <el-button type="primary" size="mini" @click="onSearchBefore();getTableList()">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="auditLog-tableRow">
      <el-table
      :cell-class-name="tableRowClassName"
       v-loading="table.loading"
        :data="tableData"
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
          prop="tenantId"
          sortable="custom"
          label="租户"
          min-width="4%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="userName"
          sortable="custom"
          show-overflow-tooltip
          label="用户名"
          min-width="5%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="serviceName"
          sortable="custom"
          show-overflow-tooltip
          label="服务名称"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="methodName"
          sortable="custom"
          show-overflow-tooltip
          label="方法名"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="parameters"
          sortable="custom"
          show-overflow-tooltip
          label="参数"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="executionTime"
          ortable="custom"
          show-overflow-tooltip
          label="执行时间"
          min-width="5%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="executionDuration"
           sortable="custom"
          show-overflow-tooltip
          label="执行期限"
          min-width="5%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="clientIpAddress"
           sortable="custom"
          show-overflow-tooltip
          label="客户端地址"
          min-width="6%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="clientName"
           sortable="custom"
          show-overflow-tooltip
          label="客户端名称"
          min-width="6%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="browserInfo"
           sortable="custom"
          show-overflow-tooltip
          label="浏览器信息"
          min-width="6%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="exception"
           sortable="custom"
          show-overflow-tooltip
          label="错误信息"
          min-width="5%"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          prop="impersonatorUserId"
           sortable="custom"
          show-overflow-tooltip
          label="模拟用户"
          min-width="5%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="impersonatorTenantId"
           sortable="custom"
          show-overflow-tooltip
          label="模拟租户"
          min-width="5%"
        ></el-table-column> -->
        <el-table-column
          align="center"
          prop="customData"
           sortable="custom"
          show-overflow-tooltip
          label="客户数据"
          min-width="5%"
        ></el-table-column>
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
  </div>
</template>
<script>
import { tableMixin } from "mixin/commTable"
import { pickerRangeOptions } from "consts/common";
import { parseTime } from "utils";
import {warnMsg, errorMsg, successMsg} from 'utils/messageBox'
import { GetAuditLogLists } from "api/publicBase/auditLog"
export default {
  name: "AuditLogsIndex",
  components: {},
  mixins: [tableMixin],
  data() {
    return {
      pickerRangeOptions,
      tableData:[],
      submitDateRange:[],
      search:{
        ServiceName:"",
        MethodName:"",
      }
    }
  },
  methods:{
    getRowKeys(row) {
      return row.id.toString()
    },
    getTableList(){
      this.tableData = [];
      this.table.loading = true;
      let data = {
        ServiceName:this.search.ServiceName,
        MethodName:this.search.MethodName,
        ExecutionBeginTime: null,
        ExecutionEndTime: null,
        maxResultCount: this.page.pageSize,
        skipCount: (this.page.currentPage - 1) * this.page.pageSize,
        sorting: this.table.order.sort
      };
      if (
        this.submitDateRange != null &&
        this.submitDateRange != undefined &&
        this.submitDateRange.length > 0
      ) {
        data.ExecutionBeginTime = parseTime(this.submitDateRange[0]);
        data.ExecutionEndTime = parseTime(this.submitDateRange[1]);
      } else {
        data.ExecutionBeginTime = null;
        data.ExecutionEndTime = null;
      }
      GetAuditLogLists(data).then(res => {
        this.table.loading = false;
        if (res.success) {
          this.tableData = res.result || [];
          this.tableData.forEach(item => {
            this.$set(item, "popShow", false);
          });
          this.page.total = res.result.totalCount;
        }
      });
    } 
  },
  created(){

  }
}
</script>
<style lang="scss">
.auditLog{
  height: 100%;
  .auditLog-tableRow {
    height: calc(100% - 130px);
    .el-table__body-wrapper {
      height: calc(100% - 51px) !important;
    }
  }
}
</style>