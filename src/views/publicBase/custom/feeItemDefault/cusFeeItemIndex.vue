<template>
  <div class="app-container cusFeeItem">
  
      <el-row style="margin-bottom:10px;">
        <el-col :span="5">
          
            <el-button type="primary" size="mini" @click="openAddFeeItemDefaultComp" >新增</el-button>
            <el-button type="primary" size="mini" @click="onBatchDelete" >批量删除</el-button>
         
        </el-col>
      </el-row>
  

    <el-row class="cusFeeItem-tableRow">
      <el-table
      :cell-class-name="tableRowClassName"
       v-loading="table.loading"
        :data="cusFeeItemList"
        :row-key="getRowKeys"
        @selection-change="onSelectChange"
        border
        stripe
        highlight-current-row
        fit
        height="100%"
        style="width: 100%;height:100%"
        ref="table"
        @sort-change="sortChange"
      >
       <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="50">
          <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
        </el-table-column>      
        <el-table-column align="center" prop="busType"  show-overflow-tooltip sortable="custom" label="业务类型" min-width="10%"></el-table-column>
        <el-table-column  align="center"  prop="feeName"  sortable="custom" show-overflow-tooltip label="费目"  min-width="10%" ></el-table-column>
        <el-table-column align="center"  prop="remarks" show-overflow-tooltip label="备注" min-width="10%" ></el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <div class="tableBtn" @click="openUpdateFeeItemDefaultComp(scope.row,false)" >编辑</div>
            <el-popover placement="top" width="160" v-model="scope.row.popShow">
              <p>是否确认删除？</p>
              <div style="text-align: right margin: 0">
                <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
                <el-button type="danger" size="mini" @click="deleteSingleFeeItemDefault(scope.row.id)">删除</el-button>
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
    <create-fee-item :pshow.sync="createFeeItemComp.show" ref="createFeeItemComp" @on-save-success="onSaveSuccess"></create-fee-item>
  </div>
</template>
<style lang="scss">
.cusFeeItem {
  height:100%;
  .cusFeeItem-tableRow {
    height: calc(100% - 50px);
     .el-table__body-wrapper {
      height: calc(100% - 51px) !important;
    }
  }
    
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import {
  getAllFeeItemDefaultList,
  deleteBatchFeeItemDefault
} from "api/publicBase/custom/cusFeeItem"
import { Server } from "net"
import createFeeItem from "./createFeeItem"
import {checkBtnPeimission} from 'utils/btnRole'
import {warnMsg} from 'utils/messageBox'
export default {
  name: "cusFeeItemIndex",
  components: {createFeeItem},
  mixins: [tableMixin],
  data() {
    return {
      cusFeeItemList:[],
      createFeeItemComp: {
        show: false,
      },
    }
  },
  methods: {
     checkBtnPeimission,
    getRowKeys(row) {
      return row.id.toString()
    },
    //获取费目列表
    getTableList() {
      this.tableData = []
      this.table.loading = true
      let data = {
        ShipperId: this.$route.query.id,
        maxResultCount: this.page.pageSize,
        skipCount: (this.page.currentPage - 1) * this.page.pageSize,
        sorting: this.table.order.sort
      }

      getAllFeeItemDefaultList(data).then(res => {
          this.table.loading = false
        if (res.success) {
          this.cusFeeItemList = res.result.items
          this.cusFeeItemList.forEach(item => {
            this.$set(item, "popShow", false)
          })
          this.page.total = res.result.totalCount
        }
      })
    },
    //删除单个费目
    deleteSingleFeeItemDefault(id) {
      deleteBatchFeeItemDefault([id]).then(res => {
        this.batchDeleteSearch()
      })
    },
    //打开新增费目窗口
    openAddFeeItemDefaultComp() {
      this.createFeeItemComp.show = true
      this.$refs.createFeeItemComp.getBusinessTypeProcess()
    }, 
    //打开编辑费目窗口
    openUpdateFeeItemDefaultComp(row,isDisabled) {
      this.createFeeItemComp.show = true
      this.$refs.createFeeItemComp.getFeeItemDefaultInfoById(row.id)
      this.$refs.createFeeItemComp.getBusinessTypeProcess()
    },
    //批量删除 
    onBatchDelete() {
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要删除的费目")
        return
      }
      this.$confirm("是否确定删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(({ value }) => {
        let arr = this.table.choosedRow.map(item => item.id)
        deleteBatchFeeItemDefault(arr).then(res => {
          this.batchDeleteSearch()
           this.$refs.table.clearSelection()
         
        })
      })
    },
     oncreateFeeItemDefaultCompShowChange(val) {
            this.createFeeItemDefaultComp.show = val 
        },
          //新增或编辑用户成功事件
        onSaveSuccess(){
             this.getTableList()
        },
  },
}
</script>