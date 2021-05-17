<template>
  <div class="app-container Accountsubject">
    <el-form size="mini" @submit.native.prevent label-width="100px">
    <el-row>
        <el-col :span="4">
            <el-form-item label="科目编码/名称：" >
               <el-input placeholder="科目编码/名称"  style="width:100%;" v-model="search.Subject" size="mini" clearable ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="科目类型：" >
               <el-input placeholder="科目类型"  style="width:100%;" v-model="search.SubjectType" size="mini" clearable ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="现金分类：" >
               <el-input placeholder="现金分类"  style="width:100%;" v-model="search.CashClass" size="mini" clearable ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="方向：" >
                 <el-select
                  v-model="search.Direction"
                  placeholder="方向"
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
            <el-form-item label="是否末级：" >
               <el-select
              v-model="search.LastStage"
              placeholder="是否末级"
              clearable
              filterable          
            >
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="4">
          <el-form-item label prop label-width="10px">
           <el-button type="primary" size="mini" @click="getTableList()" >搜索</el-button>        
            <el-button type="primary" size="mini" @click="openAddAccount()" v-if="checkBtnPeimission(subaccount.add.permission)">新增</el-button>
             <el-button type="primary" size="mini" @click="onBatchDelete()" :loading="bthloading" v-if="checkBtnPeimission(subaccount.delete.permission)">批量删除</el-button>
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
          prop="subjectCode"
          label="科目编码"
          min-width="12%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="subjectName"
          show-overflow-tooltip
          label="科目名称"
          min-width="12%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="subjectType"
          show-overflow-tooltip
          label="科目类型"
           sortable="custom"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cashClass"
          show-overflow-tooltip
          label="现金分类"
           sortable="custom"
          min-width="10%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="direction"
          show-overflow-tooltip
          label="方向"
           sortable="custom"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="assistAccounting"
          show-overflow-tooltip
          label="辅助核算"
          min-width="12%"
           sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="lastStage"
          show-overflow-tooltip
          label="是否末级"
          min-width="10%"
          sortable="custom"
        >
         <template slot-scope="scope">
           <span>{{scope.row.lastStage?"是":"否"}}</span>
         </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="unit"
          show-overflow-tooltip
          label="计量单位"
          min-width="12%"
           sortable="custom"
        ></el-table-column>
         <el-table-column align="center" label="操作" width="110" >
            <template slot-scope="scope" >
                <div class="tableBtn"  @click="openUpdateAccount(scope.row)"  v-if="checkBtnPeimission(subaccount.update.permission)">编辑</div>
                <div class="tableBtn"  @click="deletesinge(scope.row)"  v-if="checkBtnPeimission(subaccount.delete.permission)">删除</div>                      
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
     <EditAccountSubject  ref="EditAccountComp" :pshow="EditAccountComp.show" @on-show-change="onEditAccountCompShowChange"
          @on-save-success="onSaveSuccess">
        </EditAccountSubject>
  </div>
</template>
<style lang="scss">
.Accountsubject {
  height: 100%;
}
</style>
<script>
import { tableMixin } from "mixin/commTable"
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import { GetAccountSubjectQueryList,BathDeleteAccount } from "api/publicBase/Accountingsubjects";
import EditAccountSubject from  "./EditAccountSubject"
import {checkBtnPeimission,subaccount} from 'utils/btnRole'

export default {
  name: "AccountsubjectIndex",
  components: {EditAccountSubject},
  mixins: [tableMixin],
  data() {
    return {
      subaccount,
      TableDataList:[],//表格数据,显示导入数据
      search:{
        Subject:"",
        SubjectType:"",
        CashClass:"",
        Direction:"",
        LastStage:undefined
      },
      typeList:[],//借贷放向
      bthloading:false,
      EditAccountComp: {
          show: false
      },
    }
  },
  methods: {
    checkBtnPeimission,
    getRowKeys(row) {
            return row.id;
    },
     //添加查询combox
    setComBox() {
      getDicListByDitType({ BaseKeyValueTypeCode: "DIRECTION", Code: "", Name: ""  }).then(res => {
        this.typeList = res.result.comboxs;
      });
      
    },
    //获取国家列表
    getTableList() {
       let data=this.search;
       data.maxResultCount= this.page.pageSize;
       data.skipCount= (this.page.currentPage - 1)*this.page.pageSize;
       data.sorting= this.table.order.sort;
       this.table.loading = true;
       this.$refs.table.clearSelection();
        GetAccountSubjectQueryList(data).then(res => {
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
       this.$confirm('是否删除该会计科目?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                BathDeleteAccount([row.id]).then(res => {
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
        warnMsg("请选择要删除的会计科目");
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
        BathDeleteAccount(arr).then(res => {
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
    
    onEditAccountCompShowChange(val){
      this.EditAccountComp.show = val 
    },
    openUpdateAccount(row){
       this.$refs.EditAccountComp.pageType = 'update'
      this.EditAccountComp.show = true;    
      this.$refs.EditAccountComp.setComBox();

      this.$refs.EditAccountComp.GetAccountById(row.id);
    },
    openAddAccount(){
      this.EditAccountComp.show = true
      this.$refs.EditAccountComp.pageType = 'insert'
      this.$refs.EditAccountComp.setComBox();
    }
  
  },
  created() {
    this.setComBox();
  }
  
}
</script>