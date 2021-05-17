<template>
    <div class="app-container userMng">
        <el-form size="mini" label-width="100px">
        <el-row  style="margin-bottom:10px;">
            <el-col :span="4">
                <el-form-item label="用户名：" prop="">
                    <el-input placeholder="用户名"  style="width:70%;" v-model="search.name" size="mini" clearable ></el-input>
                    <!-- <el-input size="mini" v-model="form.userName" placeholder="请输入登陆账户"></el-input> -->
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="所属公司：" prop="orgId" style="position:relative;" >
                    <!-- <el-cascader :options="treeComp.data" clearable  filterable style="width:100%" :props="SetKesDept"></el-cascader> -->
                    
                    <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode" style="width:100%"></tree-select>
                    <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                        <tree ref='treeComp' :pCheckStrictly="true"  :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                            @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="所属部门：" prop="orgId" style="position:relative;" >               
                    <el-select v-model="search.deptcodes" multiple collapse-tags placeholder="请选择部门" style="width:100%">
                        <el-option v-for="item in deptreeComp.data" :key="item.nodeId" :label="item.nodeName" :value="item.nodeUUid"></el-option>
                    </el-select>             
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="所属角色：" prop="">
                    <el-select v-model="search.roleIds" multiple collapse-tags placeholder="请选择角色" style="width:100%">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.displayName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="" prop="">
                    <el-button type="primary" size="mini" @click="onSearchBefore();getTableList();">搜索</el-button>
                    <el-button type="primary" size="mini" @click="openAddUserComp()">新增用户</el-button>
                    <el-button type="primary" size="mini" @click="onBatchDelete()">批量删除</el-button>
                </el-form-item>
            </el-col>
        </el-row>
        </el-form>
        <el-row style="height:calc(100% - 110px)">
            <el-table
                :cell-class-name="tableRowClassName"
                :data = "userTableList"
                :row-key = "getRowKeys"
                v-loading = "table.loading"
                 @selection-change = "onSelectChange"
                border stripe highlight-current-row fit
                height="100%"
                :cell-style="{padding: '5px'}" 
                style="width: 100%;height:100%;" 
                ref="table">
                <!-- <el-table-column type="index" align="center" label="序号">
                    <template slot-scope="scope">
                        {{countIndex(scope.$index)}}
                    </template>
                </el-table-column> -->
                <el-table-column :reserve-selection="true" type="selection" width="50"></el-table-column>
                <el-table-column align="center" prop="name" label="姓名" show-overflow-tooltip  width="120"></el-table-column>
                <el-table-column align="center" prop="userName" label="用户名" show-overflow-tooltip  width="120"></el-table-column>
                <!-- <el-table-column align="center" prop="companyWorkNo" label="公司编号" show-overflow-tooltip  width="100"></el-table-column> -->
                <el-table-column align="center" prop="surname" label="公司名称"  show-overflow-tooltip width="200"></el-table-column>
                <el-table-column align="center" prop="dpts" label="部门" show-overflow-tooltip  width="150"></el-table-column>
                <el-table-column align="center" prop="roles" label="角色" show-overflow-tooltip  width="100"></el-table-column>
                <el-table-column align="center" prop="telNumber" label="电话" show-overflow-tooltip  width="120"></el-table-column>
                <el-table-column align="center" prop="phoneNumber" label="手机" show-overflow-tooltip  width="120"></el-table-column>
                <el-table-column align="center" prop="emailAddress" label="邮箱" show-overflow-tooltip width="120"></el-table-column>
                <el-table-column align="center" prop="sex" label="性别" show-overflow-tooltip width="80">
                    <template slot-scope="scope">
                        {{scope.row.sex == 0 ? '男' : '女'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="isLockoutEnabled" label="是否锁定" show-overflow-tooltip width="100">
                    <template slot-scope="scope">
                        {{scope.row.isLockoutEnabled ? '是' : '否'}}
                    </template>
                    </el-table-column>
                <el-table-column align="center" prop="creationTime" label="创建时间" show-overflow-tooltip  width="120">
                    <template slot-scope="scope">
                        {{scope.row.creationTime|parseTime('{y}-{m}-{d}')}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div class="tableBtn"  @click="openUpdateUserComp(scope.row)">编辑</div>
                        <div class="tableBtn"  @click="lock(scope.row,false)" v-if="!scope.row.isLockoutEnabled">锁定</div>
                        <div class="tableBtn"  @click="lock(scope.row,true)" v-if="scope.row.isLockoutEnabled">解锁</div>
                        <el-popover placement="top" width="160" v-model="scope.row.popShow">
                            <p>是否确认删除？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
                                <el-button type="danger" size="mini" @click="deleteSingleUser(scope.row.id)">删除</el-button>
                            </div>
                            <div class="tableBtn" slot="reference">删除</div>
                        </el-popover>
                        <el-popover placement="top" width="160" v-model="scope.row.pop1Show">
                            <p>是否重置密码？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="scope.row.pop1Show = false">取消</el-button>
                                <el-button type="danger" size="mini" @click="ResetPassword(scope.row.id)">确定</el-button>
                            </div>
                            <div class="tableBtn" slot="reference">重置密码</div>
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
            >
            </el-pagination>
        </el-row>
        <create-user ref="createUserComp" :pshow="createUserComp.show" @on-show-change="onCreateUserCompShowChange"
        @on-save-success="onSaveSuccess"
        ></create-user>
    </div>
</template>
<style lang="scss">
.userMng{
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
import {tableMixin} from 'mixin/commTable'
import createUser  from './createUser'
import {getAllUserList,deleteBatchUser,ResetPassword,LockUser} from 'api/user/user'
import {warnMsg,successMsg} from 'utils/messageBox'

import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'

import {getRoleSelectList} from 'api/user/roles'
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
export default {
    name: 'userManageIndex',
    mixins: [tableMixin],
    components: {
        createUser,
        treeSelect,
        tree
    },
    data() {
        return {
          SetKesDept:{
                value:'nodeUUid',
                label:'nodeName',
                children:'children'
            },//自定义  级联选择器value label
            userTableList: [],
            search: {
                name: '',
                code:"",
                roleIds: [],
                orgId: '',
                deptcodes:[],
            },
            roleList: [],
            treeComp: {
                show: false,
                data: [],
            },
            deptreeComp: {
                data: [],
            },
            choosedTreeNode: [],
            createUserComp: {
                show: false
            }
        }
    },
    methods: {
        getRowKeys(row) {
            return row.id.toString();
        },
        //获取用户列表
        getTableList() {
            
            let data = {
                Organization:this.search.deptcodes,
                code:this.search.code,
                role: this.search.roleIds.map(item => parseInt(item)),
                maxResultCount: this.page.pageSize,
                skipCount: (this.page.currentPage - 1)*this.page.pageSize,
                filter: this.search.name
            }
           
            this.tableData = []
            
            this.table.loading = true;
            getAllUserList(data).then(res => {
                this.table.loading = false;
                if(res.success) {
                    this.userTableList = res.result.items
                    this.userTableList.forEach(item => { 
                        this.$set(item, "popShow", false);
                        this.$set(item, "pop1Show", false);
                    });
                    this.page.total = res.result.totalCount
                }
            })
            .catch(err=>{
                 this.table.loading = false;
            })
        },
        //打开添加用户窗口
        openAddUserComp() {
            this.createUserComp.show = true
            this.$refs.createUserComp.pageType = 'insert'
            this.$refs.createUserComp.GetRoleList()
            this.$refs.createUserComp.getOrganizationTree()
        },
        //打开修改用户窗口
        openUpdateUserComp(row) {
            this.createUserComp.show = true
            this.$refs.createUserComp.pageType = 'update'
            this.$refs.createUserComp.getUserInfoById(row.id)
            this.$refs.createUserComp.GetRoleList()
            this.$refs.createUserComp.getOrganizationTree()
        },
        onCreateUserCompShowChange(val) {
            this.createUserComp.show = val 
        },
        //锁定解锁
        lock(row,val){
            let data = {
                id : row.id,
                switchValue : val
            }
            LockUser(data).then(res => {
                this.getTableList()
                if(val){
                    successMsg('解锁成功！')
                }else{
                    successMsg('锁定成功！')
                }
            })
        },
        //添加或修改用户成功事件
        onSaveSuccess(){
            this.getTableList()
        },
        //重置密码
        ResetPassword(id){
          ResetPassword({id:id}).then(res => {
            })
        },
        //批量删除
        onBatchDelete(){
            if(this.table.choosedRow.length === 0) {
                warnMsg('请选择要删除的人员')
                return
            }
            this.$confirm('是否确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(({ value }) => {
               let arr = this.table.choosedRow.map(item=>item.id)
                deleteBatchUser(arr).then(res => {
                    this.batchDeleteSearch()
                    this.$refs.table.clearSelection()
                    //this.getTableList()
                })
            }) 
        },
        //删除单个用户
        deleteSingleUser(id) {
            deleteBatchUser([id]).then(res => {
                this.getTableList()
            })
        },

        //获取角色列表
        GetRoleList() {
            getRoleSelectList().then(res => {
                if(res.success) {
                    this.roleList = res.result
                }  
            })
        },
        //获取组织树
        getOrganizationTree() {
            //{IsShowdep:true}
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result
            })
        },
        //根据公司获取部门
        getdeplist(){
            this.search.deptcodes=[];
            this.deptreeComp.data=[];
            GetDeptUnitList({code:this.search.code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })

        },
        //树数据回调事件
        onNodeClick(clickNode)   //choosedNodeID
        {
            // this.form.parentId = clickNode.nodeId
            this.choosedTreeNode = clickNode;
            this.search.code=clickNode.nodeUUid;
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
        
    },
    created() {
        this.getTableList()
        this.GetRoleList()
        this.getOrganizationTree()
    },

}
</script>