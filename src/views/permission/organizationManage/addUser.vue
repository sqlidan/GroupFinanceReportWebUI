<template>
    <div class="addUser">
        <el-dialog title="新增用户" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="800px" 
        v-loading="table.loading"
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-row :gutter="60" style="margin-bottom:10px">
                <el-col :span=8>
                    <el-input size="mini" placeholder="输入人员名称" v-model="search.userName"> </el-input>
                </el-col>
                <el-col :span=16>
                    <el-button type="primary" size="mini" @click="page.currentPage=1;getTableList()">搜索</el-button>
                </el-col>
            </el-row>
            <el-row class="addUser-tableRow">
                <el-table :data="tableData" ref="table" :row-key="getRowKeys" @selection-change="onSelectChange" height="100%" stripe style="width: 100%;height:100%;">
                    <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" align="left" label="人员名称" ></el-table-column>
                    <el-table-column prop="workNo" align="center" label="工号" ></el-table-column>
                    <el-table-column prop="email" align="center" label="个人邮箱" ></el-table-column>
                    <el-table-column prop="unitNames" align="center" label="所属部门" ></el-table-column>
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

            <span slot="footer" class="dialog-footer">
                <el-button @click="windowShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="save()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="scss">
.addUser {
    .el-dialog{height:600px;}
    .el-dialog__body{height:calc(100% - 110px);}

    .addUser-tableRow {
        height:calc(100% - 80px);
    }
}
    
</style>
<script>
import {tableMixin} from 'mixin/commTable'
import {getUserList, insertUserToOrg} from 'api/user/user'
export default {
    mixins: [tableMixin],
    props:{
        pshow: {
            type: Boolean,
            default: false
        },
        pOrgId: {
            type: String,
            default: ''
        },
    },
    watch: {
        pshow(newValue, oldValue){
            this.windowShow = newValue;
            
        },
        windowShow(newValue, oldValue){

            if(!newValue)  //窗口关闭
            {
                this.$refs.table.clearSelection()
                this.$emit("on-show-change",newValue);
            }
        }
    },
    data() {
        return {
            windowShow: this.pshow,
            search: {
                userName: '',
            },
            tableData: [],
        }
    },
    methods: {
        getRowKeys(row) {
            return row.id.toString();
        },
        //保存
        save() {
            let data = {
                organizationUnitId: this.pOrgId,
                userIds: this.table.choosedRow.map(item=>item.id)
            }
            insertUserToOrg(data).then(res => {
                if(res.success) {
                    this.$emit("on-refreshOrgLisg");
                    this.windowShow = false
                    
                }
            })
        },
        //获取用户列表
        getTableList() {
            this.table.loading = true
            this.tableData = []
            let data = {
                organizationUnitId: this.pOrgId,
                maxResultCount: this.page.pageSize,
                skipCount: (this.page.currentPage - 1)*this.page.pageSize,
                filter: this.search.userName,
                type: 2,
            }
            getUserList(data).then(res => {
                this.table.loading = false
                if(res.success) {
                    this.tableData = res.result.items
                    this.page.total = res.result.totalCount
                    
                }
            })
        }
    },
    mounted() {
        //this.page.pageSize = 5
        
    }
}
</script>