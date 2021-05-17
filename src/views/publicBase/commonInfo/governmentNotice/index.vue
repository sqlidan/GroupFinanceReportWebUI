<template>
  <div class="app-container goNotice" style="height:85%">
    <el-form size="mini" label-width="65px" label-position="left" @submist.native.prevent>
      <el-row :gutter="24">
        <el-col :span="4">
          <el-form-item label="公告类型：" prop>
            <el-select
              v-model="search.noticeTypeCode"
              placeholder="公告类型"
              clearable
              filterable
              multiple
              collapse-tags
              @change="onSearchBefore();getTableList()"
            >
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="公告内容：" prop>
            <el-input
              placeholder="全文/摘要"
              v-model="search.abstractContent"
              size="mini"
              clearable
              @keyup.enter.native="onSearchBefore();getTableList()"
               @change="onSearchBefore();getTableList()"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="创建人：" prop>
            <el-select
              v-model="search.creatorUserId"
              placeholder="创建人"
              clearable
              filterable
              style="width:100%"
              @change="onSearchBefore();getTableList()"
            >
              <el-option
                v-for="item in UserList"
                :key="item.value"
                :label="item.displayText"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间：" prop>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerRangeOptions"
              @change="onSearchBefore();getTableList()"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label prop>
            <el-button type="primary" size="mini" @click="onSearchBefore(); getTableList()">搜索</el-button>
            <el-button type="primary" size="mini" @click="newCreate">新增</el-button>
            <el-button type="primary" size="mini" @click="batchDeleteInfo">批量删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="userTableList"
      :row-key="getRowKeys"
      :cell-class-name="tableRowClassName"
      @selection-change="onSelectChange"
      v-loading="table.loading"
      border
      stripe
      highlight-current-row
      fit
      height="100%"
      style="width:100%;height:100%; "
      ref="table"
      @sort-change="sortChange"
    >
      <!-- <el-table-column type="index" align="center" label="序号">
                    <template slot-scope="scope">
                        {{countIndex(scope.$index)}}
                    </template>
      </el-table-column>-->
      <el-table-column :reserve-selection="true" type="selection" width="40"></el-table-column>
      <el-table-column type="index" align="center" label="序号" show-overflow-tooltip min-width="10%">
        <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="noticeTypeName"
        label="公告类型"
        sortable="noticeTypeName"
        show-overflow-tooltip
        min-width="10%"
      ></el-table-column>
      <!-- <el-table-column
        align="center"
        prop="customDistrictName"
        label="关区"
        sortable="customDistrictName"
        show-overflow-tooltip
        min-width="10%"
      ></el-table-column>-->
      <el-table-column
        align="center"
        prop="noticeNO"
        label="公告编号"
        sortable="noticeNO"
        show-overflow-tooltip
        min-width="15%"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="noticeintro"
        label="公告摘要"
        show-overflow-tooltip
        min-width="15%"
        sortable="noticeintro"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="fullTest"
        label="全文"
        show-overflow-tooltip
        min-width="15%"
        sortable="fullTest"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="filePath"
        label="附件"
        show-overflow-tooltip
        min-width="15%"
        sortable="filePath"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="creatorUser"
        label="创建人"
        show-overflow-tooltip
        min-width="15%"
        sortable="creatorUser"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="creationTime"
        label="创建日期"
        sortable="creationTime"
        min-width="10%"
      >
        <template slot-scope="scope">{{scope.row.creationTime|parseTime()}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="13%">
        <template slot-scope="scope">
          <div class="tableBtn" @click="updateInfo(scope.row.id)">编辑</div>
          <el-popover placement="top" width="160" v-model="scope.row.popShow">
            <p>是否确认删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
              <el-button type="danger" size="mini" @click="deleteinfo(scope.row.id)">删除</el-button>
            </div>
            <div class="tableBtn" slot="reference">删除</div>
          </el-popover>
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

    <add-Update
      ref="addOrUpdateComp"
      :pshow="addOrUpdateShow"
      @on-show-change="addOrUpdateClose"
      @on-save-success="onSaveSuccess"
    ></add-Update>
  </div>
</template>

<style lang="scss">
.goNotice {
  .el-form-item__label {
    padding: 0 5px 0 0;
  }
}
</style>


<script>
import { tableMixin } from "mixin/commTable";
import { warnMsg } from "utils/messageBox";
import { pickerRangeOptions } from "consts/common";
import { parseTime } from "utils/index";
import { getUserComboBox } from "api/user/user";
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import {
  getList,
  getOne,
  createOrUpdateInfo,
  batchDeleteInfo
} from "api/publicBase/others/governmentNotice";

import addOrUpdate from "./addOrUpdate";
export default {
  mixins: [tableMixin],
  name: "governmentNoticeIndex",
  components: {
    "add-Update": addOrUpdate
  },

  data() {
    return {
      userTableList: [],
      selectedPortCode: "0",
      dateRange: [], //时间范围
      startTime: "", //开始时间
      endTime: "", //结束时间
      //定义快捷筛选时间
      pickerRangeOptions,
      typeList: [],
      UserList: [],
      search: {
        noticeTypeCode: [],
        abstractContent: "",
        creatorUserId: "",
        maxResultCount: 10,
        skipCount: 0
      },

      treeComp: {
        show: false,
        data: []
      },
      choosedTreeNode: [],
      addOrUpdateShow: false,
      addOrUpdateShow2: false
    };
  },
  methods: {
    getRowKeys(row) {
      return row.id.toString();
    },

    //获取用户下拉
    getUserList() {
      getUserComboBox().then(res => {
        this.UserList = res.result.userName;
      });
    },

    //查询公告
    getTableList() {
      this.tableData = [];
      this.table.loading = true;
      if (
        this.dateRange != "" &&
        this.dateRange != 0 &&
        this.dateRange != null
      ) {
        this.startTime = parseTime(this.dateRange[0]);
        this.endTime = parseTime(this.dateRange[1]);
      } else {
        this.startTime = "";
        this.endTime = "";
      }

      let data = {
        isOnlyGetRecycleData: false,
        noticeTypeCode: this.search.noticeTypeCode.join(","),
        abstractContent: this.search.abstractContent,
        creatorUserId: this.search.creatorUserId,
        startTime: this.startTime,
        endTime: this.endTime,
        maxResultCount: this.page.pageSize,
        skipCount: (this.page.currentPage - 1) * this.page.pageSize,
        filter: this.search.name,
        sorting: this.table.order.sort
      };

      getList(data)
        .then(res => {
          if (res.success) {
            this.table.loading = false;
            this.userTableList = res.result.items;
            this.userTableList.forEach(item => {
              this.$set(item, "popShow", false);
            });
            this.page.total = res.result.totalCount;
          }
        })
        .catch(err => {
          this.table.loading = false;
        });
    },
    //关闭公告弹窗  刷新公告
    addOrUpdateClose(val) {
      this.addOrUpdateShow = val;
    },

    //添加或修改成功事件
    onSaveSuccess() {
      this.getTableList();
    },

    //添加查询combox
    setComBox() {
      getDicListByDitType({ TypeCode: "NOTICETYPE" }).then(res => {
        this.typeList = res.result;
      });
    },

    //新增公告
    newCreate() {
      //this.getBankByID();
      this.addOrUpdateShow = true;
      this.$refs.addOrUpdateComp.setCombox();
    },
    //修改公告
    updateInfo(bankID) {
      this.addOrUpdateShow = true;
      this.$refs.addOrUpdateComp.setCombox();
      this.$refs.addOrUpdateComp.getInfoByID(bankID);
    },

    //单体删除公告
    deleteinfo(id) {
      batchDeleteInfo([id]).then(res => {
        this.$refs.table.clearSelection();
        this.getTableList();
      });
    },

    //批量删除公告
    batchDeleteInfo() {
      if (this.table.choosedRow.length === 0) {
        warnMsg("请选择要删除的公告");
        return;
      }
      this.$confirm("是否确定删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(({ value }) => {
        let arr = this.table.choosedRow.map(item => item.id);

        batchDeleteInfo(arr).then(res => {
          this.$refs.table.clearSelection();
          this.getTableList();
        });
      });
    }
  },
  created() {
    this.setComBox();
    this.getTableList();
    this.getUserList();
  }
};
</script>
