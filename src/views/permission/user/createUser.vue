<template>
    <div class="createUser">
        <el-dialog :title="pageType === 'insert' ? '新增用户信息' : '编辑用户信息'" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="800px" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-form size="mini" :model="form" ref="ruleForm" :rules="rules" label-width="100px" >
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="真实姓名：" prop="realName">
                            <el-input size="mini" maxlength="10" v-model="form.realName" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="登陆账户：" prop="userName">
                            <el-input size="mini" v-model="form.userName" maxlength="20" placeholder="请输入登陆账户"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>            
                <el-row>
                    <el-col :span=24>
                        <el-form-item label="性别：" prop="sex">
                            <el-radio v-model="form.sex" label="0" ><icon name="男" scale="1.5"/></el-radio>
                            <el-radio v-model="form.sex" label="1"><icon name="女" scale="1.5"/></el-radio>
                        </el-form-item>
                    </el-col>
                    
                </el-row>         
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="所属公司：" prop="choosedTreeNode" class="orgForm" style="position:relative;">
                           <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="form.choosedTreeNode" style="width:100%"></tree-select>
                            <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                                <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                                @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                            </div>
                        </el-form-item>
                           
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="所属部门：" prop="deptCode">
                            <el-select v-model="form.deptCode"  
                                placeholder="请选择部门" 
                                style="width:100%"  
                                clearable
                                filterable     >
                                    <el-option v-for="item in deptreeComp.data" 
                                    :key="item.nodeId"
                                    :label="item.nodeName" 
                                    :value="item.nodeUUid"></el-option>
                                </el-select>   
                          </el-form-item>
                    </el-col>
                   
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="所属角色：" prop="roleIds">
                            <!-- <el-input v-model="form.userName" placeholder="请选择所属角色"></el-input> -->
                            <el-select v-model="form.roleIds" multiple collapse-tags placeholder="请选择角色" style="width:100%">
                                <el-option v-for="item in roleList" :key="item.id" :label="item.displayName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="邮箱：" prop="email">
                            <el-input size="mini" v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    
                    <el-col :span=12>
                        <el-form-item label="电话：" prop="phone">
                            <el-input size="mini" v-model="form.phone" placeholder="请输入电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="手机：" prop="mobilePhone">
                            <el-input size="mini" v-model="form.mobilePhone" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                
             
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="windowShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="save()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style lang="scss">
.createUser{
  .orgForm{
    .el-form-item__content{
      height:28px;
    }
  }
    .chsEqp{
            width:100%;
            .textPromt{float:left;}
            .chsEqp-select{height:26px;line-height: 24px;}
            i{float: right;margin-top: 6px;}
        }
        .editOrgComp-row-tree{
                position:absolute;
                top:40px;
                left:0;
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
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {getRoleSelectList} from 'api/user/roles'
import {createUser,updateUser,getUserInfoById} from 'api/user/user'
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import {mobile, telephone, email} from 'utils/validate'
import {warnMsg,successMsg} from 'utils/messageBox'
export default {
    components:{
        treeSelect,
        tree
    },
    props:{
        pshow: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        pshow(newValue, oldValue){
            this.windowShow = newValue;
            
        },
        windowShow(newValue, oldValue){
            if(this.$refs["ruleForm"])
                this.$refs["ruleForm"].resetFields();   //清空验证

            if(!newValue)  //窗口关闭
            {
                this.form = {
                    id: '',
                    realName: '',
                    userName: '',
                    password: '',
                    checkPass: '',
                    groupJobNum: '',
                    companyJobNum: '',
                    roleIds: [],
                    phone: '',
                    mobilePhone: '',
                    email: '',
                    sex: '0',
                    choosedTreeNode: [],
                    deptCode:"",
                    code:""
                }
                this.treeComp.choosedTreeNodeId = []
                this.$emit("on-show-change",newValue);
            }
        }
    },
    data() {
        return {
            pageType: '',    //insert update
            windowShow: this.pshow,
            form: {
                id: '',
                realName: '',
                userName: '',
                password: '',
                checkPass: '',
                groupJobNum: '',
                companyJobNum: '',
                roleIds: [],
                phone: '',
                mobilePhone: '',
                email: '',
                sex: '0',
                choosedTreeNode: [],
                deptCode:"",
                code:""
            },
            rules: {
                realName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                ],
                userName: [
                    { required: true, message: '请输入登陆账户', trigger: 'blur' },
                ],
                choosedTreeNode: [
                  { required: true, message: '请选择公司'},
                  {validator: this.validatedepartment},

                  ],
                // deptCode: {required: true, message: '请选择部门', trigger: 'change'},
                roleIds: {required: true, message: '请选择角色', trigger: 'change'},
                // password: [
                //     {required: true, message: '请输入密码'},
                //     {validator: this.validatePass}
                // ],
                // checkPass: [
                //     {required: true, message: '请输入确认密码'},
                //     {validator: this.validatePass2}
                // ],
                phone: [
                    // {required: true, message: '请输入电话'},
                    { pattern: telephone, message: "请输入正确格式的电话号码" }
                ],
                mobilePhone: [
                    { pattern: mobile, message: "请输入正确格式的手机号码" }
                ],
                email: [
                    // {required: true, message: '请输入邮箱'},
                    { pattern: email, message: "请输入正确格式的邮箱" }
                ],
                 companyJobNum: [
                    { required: true, message: '请输入公司编号', trigger: 'blur' },
                ],
                 sex: [
                    { required: true, message: '请选择性别', trigger: 'change' },
                ],
            },
            roleList: [],
            treeComp: {
                show: false,
                data: [],
                choosedTreeNodeId: [],  //回显树节点ID
            },
             deptreeComp: {
                data: [],
            },
            
        }
    },
    methods: {
        //单击树选择框控件
        ontreeShowChange(val) {
            this.treeComp.show=val;
        },
        //树数据回调事件
        onNodeClick(clickNode)   //choosedNodeID
        {
            // this.form.parentId = clickNode.nodeId
            this.form.code=clickNode.length > 0 ? clickNode[0].nodeUUid : '';
            this.form.choosedTreeNode = clickNode;
            this.$refs.ruleForm.validateField('choosedTreeNode');
            this.getdeplist("");
        },
        //
        onClickOutSide() {
            if(this.treeComp.show==true){
                this.treeComp.show=false;
                this.$refs.chooseEquNode.iconChange()
            }
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
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result
            })
        },
        //根据公司获取部门
        getdeplist(dep){
            this.form.deptCode="";
            this.deptreeComp.data=[];
            GetDeptUnitList({code:this.form.code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })
             this.form.deptCode=dep;

        },

        //校验密码
        validatePass(rule, value, callback) {
            if (!!value && !!this.form.password) {
                if(!(/(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/.test(this.form.password))) {
                    callback(new Error('要同时含有数字和字母，且长度要在8-16位之间'));
                }else {
                    this.$refs.ruleForm.validateField('checkPass');
                    callback();
                }
            }
        },
        //校验确认密码
        validatePass2(rule, value, callback) {
            if (!!!value) {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        },

        //校验公司
        validatedepartment(rule, value, callback) {
          
          if(this.form.choosedTreeNode.length === 0) {
            console.log('error')
            callback(new Error('请选择公司'));
          }
          else {
            console.log('no error')
            callback();
          }
            
        },

        //获取单个用户
        getUserInfoById(userId) {
            getUserInfoById({id: userId}).then(res => {
                this.form.id = res.result.user.id
                this.form.realName = res.result.user.name
                this.form.companyJobNum = res.result.user.surname
                this.form.groupJobNum = res.result.user.companyWorkNo
                this.form.userName = res.result.user.userName
                this.form.email = res.result.user.emailAddress
                this.form.phone = res.result.user.telNumber
                this.form.mobilePhone = res.result.user.phoneNumber
                this.form.sex = res.result.user.sex
                this.form.roleIds = res.result.roles
                  this.form.code = res.result.user.organizationCode
                this.form.deptCode = res.result.user.deptCode
               
                             
                this.getdeplist(res.result.user.deptCode);
                this.form.choosedTreeNode = res.result.dpts.displayName? [{nodeName:res.result.dpts.displayName}] : []

                this.$nextTick(()=>{
                     this.treeComp.choosedTreeNodeId = [res.result.dpts.id]
                })
            })
        },
        //提交
        save() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    if(this.form.code==="" ||this.form.code===null ||this.form.code===undefined)
                    {
                         warnMsg("请选择公司");
                         return;
                    }
                    if(this.form.deptCode==="" ||this.form.deptCode===null ||this.form.deptCode===undefined)
                    {
                         warnMsg("请选择部门");
                         return;
                    }
                    if(this.pageType == 'insert') {
                        let data = {
                            user: {
                                password: '000000',
                                name: this.form.realName,
                                surname: this.form.companyJobNum,    //工号
                                companyWorkNo: this.form.groupJobNum,
                                userName: this.form.userName,
                                emailAddress: this.form.email,
                                phoneNumber: this.form.mobilePhone,
                                telNumber: this.form.phone,
                                sex: this.form.sex,
                                OrganizationCode:this.form.code,
                                DeptCode:this.form.deptCode
                            },
                            dpts: this.$refs.treeComp.$refs.tree.getCheckedNodes(true, false).map(item => {return {id: item.nodeId.toString()}}),
                            roles: this.form.roleIds,
                        }
                        createUser(data).then(res => {
                            this.windowShow = false
                            this.$emit("on-save-success");
                        })
                    }
                    if(this.pageType == 'update') {
                        let data = {
                            user: {
                                id: this.form.id,
                                name: this.form.realName,
                                surname: this.form.companyJobNum,    //工号
                                companyWorkNo: this.form.groupJobNum,
                                userName: this.form.userName,
                                emailAddress: this.form.email,
                                phoneNumber: this.form.mobilePhone,
                                telNumber: this.form.phone,
                                sex: this.form.sex,
                                OrganizationCode:this.form.code,
                                DeptCode:this.form.deptCode
                            },
                            dpts: this.$refs.treeComp.$refs.tree.getCheckedNodes(true, false).map(item => {return {id: item.nodeId.toString()}}),
                            roles: this.form.roleIds,
                        }
                        updateUser(data).then(res => {
                            this.windowShow = false
                            this.$emit("on-save-success");
                        })
                    }
                }
            })
        },
    }
}
</script>