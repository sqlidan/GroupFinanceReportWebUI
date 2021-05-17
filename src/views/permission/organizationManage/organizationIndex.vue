<template>
    <el-container class="orgMng">
        <el-aside style="padding:20px 0px 20px 20px;width:420px !important;">
          
                <tree ref="tree" @on-node-click="onNodeClick" :pCheckStrictly="true" :pTreeData="treeComp.data" :pDisableClickNodeExpend="false"></tree>
            
        </el-aside>
        <el-main class="height:100%">
            <el-header style="height:30px;">
                <span style="padding-right:15px">{{currcomdep}}</span>
                <!-- <el-button type="primary" size="small" @click="openInsertOrganization()" v-if="checkBtnPeimission(orgPage.addOrg.permission)">{{orgPage.addOrg.name}}</el-button> -->
                <el-button type="primary" size="small" @click="openUpdateOrganization()" v-if="checkBtnPeimission(orgPage.updateOrg.permission)">{{orgPage.updateOrg.name}}</el-button>
                <el-button type="primary" size="small" @click="deleteOrganization()" v-if="checkBtnPeimission(orgPage.deleteOrg.permission)">{{orgPage.deleteOrg.name}}</el-button>
                

            </el-header>
            <el-main style="height:calc(100% - 30px)">
                 <el-tabs v-model="tab" type="card" @tab-click="tabChange" style="width:99%">
                    <el-tab-pane label="部门" name="1"></el-tab-pane>
                    <el-tab-pane label="公司" name="2"></el-tab-pane>
                </el-tabs>
                <el-row style="height:calc(100% - 40px);width:99%;margin-top:-20px">
                    <depinfoList
                    ref="depComp"
                    v-show="tab==='1'"   
                    @on-save-success="onSaveSuccess"           
                
                    ></depinfoList>
                    <companyinfoList
                    ref="companyComp"
                    v-show="tab==='2'"
                    @on-save-success="onSaveSuccess"
                                 
                    ></companyinfoList>
                </el-row>
                
                
            </el-main>
            
        </el-main>
        <edit-organization ref="editOrganizatonComp" :pshow="editOrganizationComp.show" @on-show-change="closeOrgCompShowChange" @on-save-success="onSaveSuccess"></edit-organization>
       
    </el-container>
</template>
<style lang="scss">
.orgMng{
    height:100%;
    .templateTree .tree-message{margin-left:5px ;color:#606266 !important;}
    .orgMng-left{
        width:400px;
        
    }
}
</style>
<script>
import tree from 'components/tree/tree'
import editOrganization from './editOrganization'
import {getUserListByOrgId} from 'api/user/user'
import {tableMixin} from 'mixin/commTable'
import {getOrganizatonTree,deleteOrganizaton} from 'api/user/organization'
import {warnMsg} from 'utils/messageBox'
import {checkBtnPeimission,orgPage} from 'utils/btnRole'
import companyinfoList from './companyinfoList'
import depinfoList from './depinfoList'

export default {
    name:'organizationIndex',
    mixins: [tableMixin],
    components:{
        tree,
        editOrganization,
        companyinfoList,depinfoList
    },
    
    data(){
        return {
            orgPage,
            tableData: [],
            editOrganizationComp: {
                show:false,
            },      
            treeComp: {
                data: [],
                currNodeID:'',
                currcode:""
            },
            tab:"1",
            currcomdep:""//当前选择
        }
    },
    methods:{
        checkBtnPeimission,
        
        onNodeClick(node){
            this.page.currentPage = 1
            this.treeComp.currNodeID = node.nodeId;
            this.treeComp.currcode = node.nodeUUid;
            this.currcomdep= node.nodeName;
            this.$refs.depComp.currparnode=[node];
            this.$refs.companyComp.currparnode=[node];
            this.getcondeplist();

           
            //this.getTableList()
        },
        getcondeplist()
        {
            //选中后初始加载
              if (this.tab === "1") {      
                this.$refs.depComp.Id =  this.treeComp.currNodeID;
                this.$refs.depComp.code =  this.treeComp.currcode;
                this.$refs.depComp.getTableList();
            } else if (this.tab === "2") {
                this.$refs.companyComp.Id =  this.treeComp.currNodeID;
                this.$refs.companyComp.code =  this.treeComp.currcode;
            
                this.$refs.companyComp.getTableList();
            }

        },
        getRowKeys(row) {
            return row.id.toString();
        },

        //关闭添加部门弹出框
        closeOrgCompShowChange(val) {
            this.editOrganizationComp.show = val
        },      
        //打开新建部门
        openInsertOrganization() {
            this.$refs.editOrganizatonComp.type = 'insert'
            this.editOrganizationComp.show = true
            //获取组织树
            this.$refs.editOrganizatonComp.getOrganizationTree()
        },
        //打开修改部门
        openUpdateOrganization() {
            if(this.$refs.tree.$refs.tree.getCheckedNodes(false,false).length === 0) {
                warnMsg('请选择要修改的公司')
                return
            }
            
            if(this.$refs.tree.$refs.tree.getCheckedNodes(false,false).length > 1) {
                warnMsg('不能选择多个公司进行修改')
                return
            }
            this.$refs.editOrganizatonComp.type = 'update'
            //this.$refs.editOrganizatonComp.form.name=''
            this.editOrganizationComp.show = true
            //获取组织树
            this.$refs.editOrganizatonComp.getOrganizationTree()

            this.$refs.editOrganizatonComp.getOrgDetailById(this.$refs.tree.$refs.tree.getCheckedNodes(false,false)[0].nodeId)

        },
        //删除组织机构
        deleteOrganization() {
            
            if(this.$refs.tree.$refs.tree.getCheckedNodes(true,false).length === 0) {
                warnMsg('请选择要删除的公司')
                return
            }
            this.$confirm('是否删除该公司?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteOrganizaton({id: this.$refs.tree.$refs.tree.getCheckedNodes(true,false)[0].nodeId}).then(res => {
                    if(res.success)
                        this.onSaveSuccess()
                    }
                )
            }).catch(() => {
                
            });
            
            
        },

        //获取组织机构树
        getOrganizatonTree() {
            this.$refs.tree.loading = true
            getOrganizatonTree().then(res => {
                if(res.success)
                    this.treeComp.data = res.result
                    this.$refs.tree.loading = false
                }
            )
        },

        //获取用户列表
        getTableList() {
            this.tableData = []
            this.table.loading = true
            let data = {
                organizationUnitId: this.treeComp.currNodeID,
                type: 1,
                maxResultCount: this.page.pageSize,
                skipCount: (this.page.currentPage - 1)*this.page.pageSize,
                filter: ''
            }
            getUserListByOrgId(data).then(res => {
                this.table.loading = false
                if(res.success) {
                    this.tableData = res.result.items
                    this.page.total = res.result.totalCount
                    
                }
            })
        },
         //tab切换
    tabChange(tab) {
        if( this.treeComp.currNodeID !=="" &&  this.treeComp.currNodeID !==null)
        {
            if (tab.name === "1") {      
                this.$refs.depComp.Id =  this.treeComp.currNodeID;
                this.$refs.depComp.code =  this.treeComp.currcode;
                
                this.$refs.depComp.getTableList();
            } else if (tab.name === "2") {
                this.$refs.companyComp.Id =  this.treeComp.currNodeID;
                this.$refs.companyComp.code =  this.treeComp.currcode;
            
                this.$refs.companyComp.getTableList();
            }
        }
        else{
            if (tab.name === "1") {      
                this.$refs.depComp.Id =  "";
                this.$refs.depComp.code =  "";
                
                this.$refs.depComp.depdataList = [];
            } else if (tab.name === "2") {
                this.$refs.companyComp.Id =  "";
                this.$refs.companyComp.code =  "";
            
                this.$refs.companyComp.cominfoList = [];
            }
        }        
      },
      onSaveSuccess(id)
      {
         this.getOrganizatonTree();
          this.getcondeplist();

      }
    },
    mounted() { 
        this.getOrganizatonTree()
   
    },
    created(){

    },
}
</script>