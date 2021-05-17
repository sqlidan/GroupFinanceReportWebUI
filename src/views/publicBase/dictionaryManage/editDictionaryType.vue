<template>
    <div class="editDicTypeCopm">
        <el-dialog :title="form.id === ''? '新增字典类型信息' : '编辑字典类型信息'" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="576px" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-form size="mini" :model="form" :rules="form.rules" ref="ruleForm" label-width="110px">
            <el-row>
                <el-col :span=18 class="editDicTypeCopm-row1">
                    <el-form-item label="上级字典类型："  prop="choosedTreeNode">
                        <tree-select ref="chooseEquNode" :pTreeDefaultProps="config" placeholderName="上级字典类型" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="choosedTreeNode"></tree-select>
                        <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                            <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.config" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                                @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=18>
                    <el-form-item prop="typeName" label="字典类型名称：">
                        <el-input size="mini" maxlength="20" v-model="form.typeName" placeholder="请输入字典类型名称" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=18>
                    <el-form-item prop="typeCode" label="字典类型编码：">
                        <el-input size="mini"  maxlength="30" v-model="form.typeCode" placeholder="请输入字典类型编码" ></el-input>
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
    .editDicTypeCopm{
        .chsEqp{
            width:100%;
            .textPromt{float:left;}
            .chsEqp-select{height:26px;line-height: 24px;}
            i{float: right;margin-top: 6px;}
        }
        .editDicTypeCopm-row1{
          .el-form-item__content{height:28px;}
        }
        .editOrgComp-row-tree{
                position:absolute;
                top:40px;
                
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
import {getDicTypeTree, createOrUpdateDicType, getSingleDicItem} from 'api/publicBase/dictionaryMng'
export default {
    props:{
        pshow: {
            type: Boolean,
            default: false
        }
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
                this.form.typeCode = ''
                this.form.typeName = ''
                this.form.remarks = ''
                this.form.parentCode = ''
                this.form.id = ''
                this.choosedTreeNode = []

                this.treeComp.data = []
                this.treeComp.choosedTreeNodeId = []
                this.$emit("on-show-change",newValue);
            }
        }
    },
    data(){
        return {
            type: 'insert',
            windowShow: this.pshow,
            form: {
                typeCode: '',
                typeName: '',
                remarks: '',
                parentCode: '',
                id: '',
                rules:{
                    typeCode: [
                        { required: true, message: '请输入字典类型编码', trigger: 'blur' },
                    ],
                    typeName: [
                        { required: true, message: '请输入字典类型名称', trigger: 'blur' },
                    ],
                    // choosedTreeNode: [
                    //     {validator: this.validate}
                    // ]
                    
                },
            },
            
            treeComp: {
                show:false,
                data:[],
                config: {
                    children: "children",
                    label: "typeName",
                    id: "typeCode",
                    pid: "parentCode",
                    uuid: "id",
                    disabled: "disabled",
                    message: "message"
                },
                choosedTreeNodeId:[],  //回显树节点ID
            },
            config:{name:'typeName'},
            choosedTreeNode: []
        }
    },
    components:{
        treeSelect,
        tree
    },
    methods:{
        // validate(rule, value, callback) {
        //     if (this.choosedTreeNode.length ==0) {
        //         //if(!/(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/.test(this.form.password)) {
        //             callback(new Error('要同时含有数字和字母，且长度要在8-16位之间'));
        //         }else {
        //             //this.$refs.ruleForm.validateField('checkPass');
        //             callback();
        //         }
        //     },
        
        //根据ID获取单个字典项
        getSingleDicItem(id) {
            getSingleDicItem({id:id}).then(res=>{
                this.form.id = res.result.id
                this.form.typeCode = res.result.typeCode
                this.form.typeName = res.result.typeName
                this.form.parentCode = res.result.parentCode
                this.choosedTreeNode = res.result.parentName ? [{typeName:res.result.parentName}] : []
                this.$nextTick(()=>{
                        this.treeComp.choosedTreeNodeId = [res.result.parentCode]
                    })
                
            })
        },
        //单击树选择框控件
        ontreeShowChange(val) {
            this.treeComp.show=val;
        },
        //树数据回调事件
        onNodeClick(clickNode)   //choosedNodeID
        {
            this.form.parentCode = clickNode.length > 0 ? clickNode[0].typeCode : ''
            this.choosedTreeNode=clickNode;
        },
        //获取树数据
        getOrganizationTree() {
            getDicTypeTree().then(res => {
            if(res.success)
                this.treeComp.data = res.result
                this.disabledchooseCurOrg(this.treeComp.data)
                this.$nextTick(()=>{
                    this.$refs.treeComp.showTreeChoosedNode()
                })
                
                //
                
                
            })
        },

        //修改当前修改部门树数据不能被选中(A节点上级不能指定A)
        disabledchooseCurOrg(nodes) {
            nodes.forEach(node => {
                if(node.typeCode == this.form.typeCode)
                    node.disabled = true
                if(node.children && node.children.length > 0)
                    return this.disabledchooseCurOrg(node.children)
            });
        },
        

        //根据部门ID获取部门详情
        getOrgDetailById(id) {
            this.form.curOrgId = id
            getOrgDetailById({id:id}).then(res => {
                if(res.success) {
                    this.form.name = res.result.unitName
                    this.form.parentId = res.result.parentId == '' && '-1'
                    this.choosedTreeNode = res.result.parentName ? [{nodeName:res.result.parentName}] : []

                    this.$nextTick(()=>{
                        this.treeComp.choosedTreeNodeId = [res.result.parentId]
                    })
                    
                }
            })
        },
        //
        onClickOutSide() {
            if(this.treeComp.show==true){
                this.treeComp.show=false;
                this.$refs.chooseEquNode.iconChange()
            }
        },
        //提交部门信息
        save() {

            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    let data = {
                        typeCode: this.form.typeCode,
                        typeName: this.form.typeName,
                        parentCode: this.form.parentCode,
                        systemSetting: false,
                        remarks: this.form.remarks,
                        id: this.form.id
                    }
                    //新建
                    if(this.form.id === ''){
                        // let data = {
                        //     parentId: _this.form.parentId,
                        //     displayName: _this.form.name
                        // }
                        createOrUpdateDicType({keyValueType:data}).then(res => {
                            if(res.success)
                            {
                                //关闭信息框，刷新主页面树
                                this.$emit("on-save-success");
                                this.windowShow = false
                                
                            }
                        })
                    }
                    else //修改
                    {
                    
                        createOrUpdateDicType({keyValueType:data}).then(res => {
                            if(res.success)
                            {
                                //关闭信息框，刷新主页面树
                                this.$emit("on-save-success");
                                this.windowShow = false
                                
                            }
                        })
                    }
                    
                }
            })
        },
       

    },
}
</script>