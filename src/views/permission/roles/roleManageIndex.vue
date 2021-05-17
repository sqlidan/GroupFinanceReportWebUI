<template>
    <div class="app-container">
        <el-row :gutter="100" style="margin-bottom:10px;">
            <el-col :span=4>
                <el-input placeholder="角色名称" v-model="search.roleName" size="mini" clearable ></el-input>
            </el-col>
            <el-col :span=18>
                <el-button type="primary" size="mini" @click="page.currentPage=1;getTableList()">搜索</el-button>
                <el-button type="primary" size="mini" @click="addTableRow()">新增角色</el-button>
                <!-- <el-button type="primary" size="mini" @click="skip()">跳转</el-button> -->
            </el-col>
        </el-row>
        <el-row style="height:calc(100% - 80px);">
            <el-form :rules="tableForm.rules" :model="tableForm"  ref="form" style="height:calc(100% - 15px)" >
            <el-table
                v-loading="table.loading"
                :data="tableForm.data"
                :cell-style="{padding: '5px'}" 
                stripe
                highlight-current-row
                height="100%"
                style="width: 100%;height:100%;"
                ref="table">
                <el-table-column type="index" align="center" label="序号" min-width="3%">
                    <template slot-scope="scope">
                        {{countIndex(scope.$index)}}
                    </template>
                </el-table-column>
                <el-table-column align="left" label="角色名称" min-width="50%">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isSet">
                            <el-form-item :prop="'data.' + scope.$index + '.displayName'" :rules='tableForm.rules.displayName'>
                                <el-input size="mini" maxlength="50"  v-model.trim="scope.row.displayName"></el-input>
                            </el-form-item>
                        </span>
                        <span v-else>{{scope.row.displayName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="creationTime" align="center" label="创建时间" min-width="20%">
                    <template slot-scope="scope">
                        {{scope.row.creationTime|parseTime()}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="20%">
                    <template slot-scope="scope" style="align-text:center;">
                        <div class="tableBtn"  @click="openRoleAuth(scope.row)">授权</div>
                        <div class="tableBtn"  @click="onClick(scope.row,scope.$index,true)">{{scope.row.isSet?'保存':"编辑"}}</div>

                        <el-popover v-if="!scope.row.isSet" placement="top" width="160" v-model="scope.row.popShow">
                            <p>是否确认删除？</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="scope.row.popShow = false">取消</el-button>
                                <el-button type="danger" size="mini" @click="removeRole(scope.row)">删除</el-button>
                            </div>
                            <div class="tableBtn" slot="reference" @click="removeTableRow(scope.row)">删除</div>
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
            >
            </el-pagination>
            </el-form>
        </el-row>
        <role-auth ref="roleAuth" :pshow="roleAuthComp.show" :pRoleID="roleAuthComp.roleId" @on-show-change="onRoleAuthShowChange"></role-auth>
    </div>
</template>
<style lang="scss" scoped>
    .roleMng{
        padding:20px
    }
</style>
<script>
import {getRoleList, insertRole, updateRoleName,deleteRoleById} from 'api/user/roles'
import {parseTime} from 'utils'
import roleAuth from './roleAuth'
import {setCookie, getCookie, delCookie} from 'utils/cookie'
import {tableMixin} from 'mixin/commTable'
export default {
    name:'roleManageIndex',
    components: {
        roleAuth
    },
    mixins: [tableMixin],
    data() {
        // console.log(table.data)
        return {
            search: {
                roleName: ''
            },
            tableForm: {
                rules: {
                    displayName:{ required: true, message: '请输入角色名称', trigger: 'blur' },
                },
                data:[],
                updateOldRow:{},    //修改之前的列
            },
            
            roleAuthComp: {
                roleId: '',
                show:false
            },
        }
    },
    methods: {
        // skip(){
        //     this.$router.push({name: 'userManageIndex',params:{id: '123'}})
        // },
        //打开授权对话框
        openRoleAuth(row){
            this.roleAuthComp.show = true
            this.roleAuthComp.roleId = row.id.toString()
            this.$refs.roleAuth.getPermissionsByRoleId(row.id)
            //this.$refs.roleAuth.initData()
        },
        onRoleAuthShowChange(val) {
            this.roleAuthComp.show = val
        },
        
        //获取角色列表
        getTableList() {
            let data = {
                FilterText: this.search.roleName,
                MaxResultCount: this.page.pageSize,
                SkipCount: (this.page.currentPage - 1) * this.page.pageSize
            }
            this.table.loading = true
            this.tableForm.data= []
            getRoleList(data).then(res => {
                this.table.loading = false
                if(res.success) {
                    
                    this.tableForm.data = res.result.items
                    this.tableForm.data.forEach(item => { 
                        this.$set(item, "isSet", false);
                        this.$set(item, "popShow", false);
                    });
                    this.page.total = res.result.totalCount
                }  
            })
        },
        //添加行
        addTableRow(){
            if(this.tableForm.data.filter(x=>x.isSet).length>0)
            {
                this.$message.warning('请提交后再添加行');
                return;
            }
            const newData={
                id:"",
                isDefault:false,
                displayName:"",
                isSet:true
            }

            //this.sensitiveList=[...this.sensitiveList,newData];
            this.tableForm.data.unshift(newData)
            this.$refs.table.bodyWrapper.scrollTop =0;
        },
        //删除行
        removeTableRow(row){     
            row.popShow = true
        },
        //删除角色
        removeRole(row){
            deleteRoleById({id:row.id}).then(res => {
                if(res.success) {
                    row.popShow = false
                    this.getTableList()
                }
            })
        },
        onClick(row, index, flag){
            let _this = this
            for (let item of this.tableForm.data) {
                if (item.isSet && item.id != row.id) {
                    this.$message.warning("请先保存当前编辑项");
                    return false;
                }
            }
            //取消操作
            if (!flag) {
                if (row.id=='')
                    this.tableForm.data.splice(index, 1);
                else
                {
                    row["isDefault"]=this.tableForm.updateOldRow["isDefault"]
                    row["displayName"]=this.tableForm.updateOldRow["displayName"]
                }
                row.isSet = !row.isSet;
            }
            else
            {
                if (row.isSet) { //保存
                    this.$refs["form"].validate((valid,tableForm)=>{
                        if (valid) {
                            let data = {
                                id:row["id"],
                                isDefault:row["isDefault"],
                                displayName:row["displayName"],
                            }
                            if(row.id=='')   //新增
                            {
                                let d = {
                                    grantedPermissionNames: [],
                                    role: data
                                }
                                insertRole(d).then(res => {
                                    if(res.success) {
                                        _this.getTableList()
                                    }
                                        
                                })
                            }
                            else   //修改
                            {
                                updateRoleName(data).then(res => {
                                    if(res.success) {
                                        _this.getTableList()
                                    }
                                        
                                })
                            }
                        }
                        else
                            return false
                    })
                    
                }
                else   //修改
                {
                    this.tableForm.updateOldRow={...row}
                    row.isSet = true;
                    
                }
            }
                
        }
    },
    created() {
        //console.log(parseTime(Date().toString(),'{y}-{m}-{d} {h}:{i}:{s}'))
        this.getTableList()
        console.log(getCookie("Abp.SystemUser"))
    }
}
</script>
