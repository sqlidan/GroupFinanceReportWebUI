<template>
  <el-container class="app-container dicMng">
    <el-header>
      <el-form size="mini" >
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="类型编码：">
              <el-input size="mini" v-model="search.typeCode" style="width:70%" placeholder="请输入类型编码" @keyup.enter.native="onSearchBefore();getTableList()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="字典项编码：">
              <el-input size="mini" v-model="search.code" style="width:65%" placeholder="请输入字典项编码" @keyup.enter.native="onSearchBefore();getTableList()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="字典项名称：">
              <el-input size="mini" v-model="search.name" style="width:65%" placeholder="请输入字典项名称" @keyup.enter.native="onSearchBefore();getTableList()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="margin-left:20px;">
            <el-button type="primary" size="mini" @click="page.currentPage=1;getTableList()">搜索</el-button>
            <el-button type="primary" size="mini" @click="addDicType()">新增类型</el-button>
            <el-button type="primary" size="mini" @click="editDicType()">编辑类型</el-button>
            <el-button type="primary" size="mini" @click="deleteDicType()">删除类型</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-container style="height:100%">
      <el-aside>
        <tree
          ref="tree"
          :pTreeDefaultProps="treeComp.config"
          :radio = "true"
          :pCheckStrictly="true"
          :pTreeData="treeComp.data"
          @on-node-click="onNodeClick"
        ></tree>
      </el-aside>
      <el-main class="dicMng-rightMain">
        <el-row>
          <span class="dicMng-rightMain-typeName">{{treeComp.currName}}</span>
          <el-button type="primary" size="mini" @click="addTableRow()">新增字典项</el-button>
        </el-row>
        <el-row style="height:calc(100% - 80px);margin-top:10px">
          <el-form
            :rules="tableForm.rules"
            :model="tableForm"
            ref="form"
            style="height:calc(100% - 15px)"
          >
            <el-table
              row-key="id"
              :data="tableForm.data"
              stripe
              height="100%"
              style="width: 100%;height:100%;"
              ref="table"
            >
              <el-table-column type="index" align="center" label="序号" min-width="3%">
                <template slot-scope="scope">{{countIndex(scope.$index)}}</template>
              </el-table-column>
              <el-table-column align="left" label="字典名称" min-width="20%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-form-item
                      :prop="'data.' + scope.$index + '.name'"
                      :rules="tableForm.rules.name"
                    >
                      <el-input size="mini" maxlength="50" v-model.trim="scope.row.name"></el-input>
                    </el-form-item>
                  </span>
                  <span v-else>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column align="left" label="字典编码" min-width="20%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-form-item
                      :prop="'data.' + scope.$index + '.code'"
                      :rules="tableForm.rules.code"
                    >
                      <el-input size="mini" maxlength="50" v-model.trim="scope.row.code"></el-input>
                    </el-form-item>
                  </span>
                  <span v-else>{{scope.row.code}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="字典类型" show-overflow-tooltip min-width="20%">
                <template slot-scope="scope">{{scope.row.systemSetting? '系统' : '自定义'}}</template>
              </el-table-column>
              <el-table-column align="center" label="备注" min-width="20%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <span v-if="scope.row.isSet">
                    <el-form-item
                      :prop="'data.' + scope.$index + '.remarks'"
                      :rules="tableForm.rules.code"
                    >
                      <el-input size="mini" maxlength="50" v-model.trim="scope.row.remarks"></el-input>
                    </el-form-item>
                  </span> -->
                  <span >{{scope.row.remarks}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" min-width="20%">
                <template slot-scope="scope" style="align-text:center;">
                  <div
                    class="tableBtn"
                    v-if="!scope.row.systemSetting"
                    @click="onClick(scope.row,scope.$index,true)"
                  >{{scope.row.isSet?'保存':"编辑"}}</div>
                  <el-popover
                    v-if="!scope.row.isSet"
                    placement="top"
                    width="160"
                    v-model="scope.row.popShow"
                  >
                    <p>是否确认删除？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
                      <el-button type="danger" size="mini" @click="deleteDicItem(scope.row.id)">删除</el-button>
                    </div>
                    <div class="tableBtn" slot="reference" v-if="!scope.row.systemSetting">删除</div>
                  </el-popover>
                  <div class="tableBtn" v-else @click="onClick(scope.row,scope.$index,false)">取消</div>
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
          </el-form>
        </el-row>
      </el-main>
    </el-container>
    <edit-dictionary-type ref="editDicTypeComp" :pshow="editDicComp.show" @on-show-change="onEditDicTypeCompShowChange" @on-save-success="getDictionaryTypeTree"></edit-dictionary-type>
  </el-container>
</template>
<style lang="scss">
.dicMng {
  height: 100%;
  .el-header {
    height: 45px !important;
    padding:0 !important;
  }
  .dicMng-rightMain {
    padding: 0 20px !important;
    height: 100% !important;
    .dicMng-rightMain-typeName {
      display:inline-block;
      min-width:100px;
      font-weight: 700;
    }
  }
  .templateTree .tree-message {
    margin-left: 5px;
    color: #606266 !important;
  }
}
</style>
<script>
import tree from "components/tree/tree";
import editDictionaryType from "./editDictionaryType";
import { getDicTypeTree, getDicList, createOrUpdateDicItem, deleteDicType, deleteDicItem } from "api/publicBase/dictionaryMng";
import { tableMixin } from "mixin/commTable";
import {warnMsg} from 'utils/messageBox'
export default {
  name: "dictionaryIndex",
  components: {
    tree,
    'edit-dictionary-type': editDictionaryType
  },
  
  mixins: [tableMixin],
  
  data() {
    return {
      search:{
        typeCode: '',
        code: '',
        name: '',
      },
      treeComp: {
        data: [],
        config: {
          children: "children",
          label: "typeName",
          id: "typeCode",
          pid: "parentCode",
          uuid: "id",
          disabled: "disabled",
          message: "message"
        },
        value: '',    //选择的id,用于提交或修改字典项
        currName: '', //当前选中的字典类型
      },
      tableForm: {
        rules: {
          code: { required: true, message: "请输入字典编码", trigger: "blur" },
          name: { required: true, message: "请输入字典名称", trigger: "blur" }
        },
        data: [],
        updateOldRow: {} //修改之前的列
      },
      editDicComp: {
        show: false
      }
    };
  },
  methods: {
    //删除字典项
    deleteDicItem(id) {
      deleteDicItem({id:id}).then(res=>{
        if(res.success)
          this.getTableList(this.treeComp.value)
      })
    },
    //删除字典类型
    deleteDicType() {
      if(this.$refs.tree.$refs.tree.getCheckedNodes(true,false).length === 0) {
          warnMsg('请选择要删除的字典类型')
          return
      }
      this.$confirm('是否删除该字典类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          deleteDicType({input: this.$refs.tree.$refs.tree.getCheckedNodes(true,false)[0].id}).then(res => {
              if(res.success)
                  this.getDictionaryTypeTree()
              }
          )
      }).catch(() => {
          
      });
    },
    //
    onEditDicTypeCompShowChange(val) {
      this.editDicComp.show = val
    },
    //添加字典类型
    addDicType() {
      this.editDicComp.show = true
      this.$refs.editDicTypeComp.getOrganizationTree()
    },
    //修改字典类型
    editDicType() {
      if(this.$refs.tree.$refs.tree.getCheckedNodes(false,false).length === 0) {
          warnMsg('请选择要修改的字典类型')
          return
      }
      
      if(this.$refs.tree.$refs.tree.getCheckedNodes(false,false).length > 1) {
          warnMsg('不能选择多个字典类型进行修改')
          return
      }

      this.editDicComp.show = true
      this.$refs.editDicTypeComp.getOrganizationTree()
      this.$refs.editDicTypeComp.getSingleDicItem(this.$refs.tree.$refs.tree.getCheckedNodes(false,false)[0].id)
      
    },
    //获取字典类型树
    getDictionaryTypeTree() {
      getDicTypeTree().then(res => {
        if (res.success) this.treeComp.data = res.result;
      });
    },
    //获取字典项列表
    getTableList(code) {
      this.search.typeCode =  code || this.search.typeCode 
      let data = {
        typeCode: this.search.typeCode,
        code: code ? '' : this.search.code,
        name: code ? '' : this.search.name,
        maxResultCount: this.page.pageSize,
        skipCount: (this.page.currentPage - 1)*this.page.pageSize,
      }
      this.tableForm.data = []
      this.table.loading = false;
      getDicList(data).then(res => {
        this.table.loading = true;
        this.page.total = res.result.totalCount
        if (res.success) {
          this.tableForm.data = res.result.items;
          this.tableForm.data.forEach(item => {
            this.$set(item, "isSet", false);
            this.$set(item, "popShow", false);
          });
        }
      });
    },
    //单击树节点事件
    onNodeClick(node) {
      if (!(node.children && node.children.length > 0)){
        this.treeComp.value = node.typeCode
        this.treeComp.currName = node.typeName
        this.getTableList(node.typeCode);
      }
    },

    //添加行
    addTableRow() {
      if(this.treeComp.value === ''){
        warnMsg("请先选择要添加的字典类型")
        return
      }
      if (this.tableForm.data.filter(x => x.isSet).length > 0) {
        warnMsg("请提交后再添加行")
        return;
      }
      const newData = {
        id: "",
        code: '',
        name: "",
        remarks:"",
        isSet: true
      };

      //this.sensitiveList=[...this.sensitiveList,newData];
      this.tableForm.data.unshift(newData);
      this.$refs.table.bodyWrapper.scrollTop = 0;
    },

    onClick(row, index, flag) {

      
      let _this = this;
      for (let item of this.tableForm.data) {
        if (item.isSet && item.id != row.id) {
          this.$message.warning("请先保存当前编辑项");
          return false;
        }
      }

      //取消操作
      if (!flag) {
        if (row.id == "") this.tableForm.data.splice(index, 1);
        else {
          row["code"] = this.tableForm.updateOldRow["code"];
          row["name"] = this.tableForm.updateOldRow["name"];
          row["remarks"] = this.tableForm.updateOldRow["remarks"];
        }
        row.isSet = !row.isSet;
      } else {
        if (row.isSet) {
          //保存
          this.$refs["form"].validate((valid, tableForm) => {
            if (valid) {
              let data = {
                id: row["id"],
                code: row["code"],
                name: row["name"],
                remarks: row['remarks'],
                baseKey_ValueTypeCode: this.treeComp.value,
              };
              if (row.id == "") {
                data.systemSetting = false
                //新增
                createOrUpdateDicItem({baseKey_Value:data}).then(res => {
                  if (res.success) {
                    _this.getTableList(this.treeComp.value);
                  }
                });
              } //修改
              else {
                data.systemSetting = row['systemSetting']
                createOrUpdateDicItem({baseKey_Value:data}).then(res => {
                  if (res.success) {
                    _this.getTableList(this.treeComp.value);
                  }
                });
              }
            } else return false;
          });
        } //修改
        else {
          this.tableForm.updateOldRow = { ...row };
          row.isSet = true;
        }
      }
    }
  },
  created() {
    this.getDictionaryTypeTree();
  }
};
</script>