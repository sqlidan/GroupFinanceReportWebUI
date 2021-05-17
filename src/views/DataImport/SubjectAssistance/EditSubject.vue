<template>
    <div class="editsubject">
        <el-dialog :title="pageType === 'insert' ? '新增科目辅助余额信息' : '编辑科目辅助余额信息'" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="800px" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-form size="mini" :model="form" ref="ruleForm" :rules="rules" label-width="100px" >
                 <el-row>
                    <el-col :span="24">
                        <el-form-item label="所属公司：" prop="choosedTreeNode" class="orgForm" style="position:relative;">
                            <tree-select ref="chooseEquNode" placeholderName="公司" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="form.choosedTreeNode"></tree-select>
                            <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                                <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                                    @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>
                            </div>
                        </el-form-item>
                    </el-col>
                   
                </el-row>
                <el-row>
                     <el-col :span="12">
                          <el-form-item label="所属部门：" prop="depcode">
                            <el-select v-model="form.depcode"  
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
                    <el-col :span="12">
                        <el-form-item label="所属时间：" prop="budtime" style="position:relative;">               
                            <el-date-picker v-model="form.budtime" 
                            type="month" 
                            placeholder="所属时间"     
                            style="width:100%"
                            ></el-date-picker>    
                        </el-form-item>
                    </el-col>
                   
                  
                </el-row>            
                  <el-row>
                         <el-col :span="12">
                        <el-form-item label="科目编码：" prop="subjectCode">
                            <el-input size="mini" v-model="form.subjectCode" placeholder="请输入科目编码"></el-input>
                        </el-form-item>
                    </el-col>
                      <el-col :span="12">
                      <el-form-item label="科目名称：" prop="subjectName" >
                         <el-input size="mini" v-model="form.subjectName" placeholder="请输入科目名称"></el-input>
                        </el-form-item>
                    </el-col>
                  
                </el-row>                          
                <el-row>
                      <el-col :span="12">
                        <el-form-item label="本期借方：" prop="january">
                             <el-input-number
                              placeholder="本期借方"
                            v-model="form.currentDebit"
                            controls-position="right"
                            :min="0.00"
                            :max="100000000"
                            :precision="2"
                            :step="0.01"
                            clearable
                            style="width: 100%"
                            ></el-input-number>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="12">
                        <el-form-item label="本期贷方：">
                             <el-input-number
                              placeholder="本期贷方"
                            v-model="form.currentLender"
                            controls-position="right"
                            :min="0.00"
                            :max="100000000"
                            :precision="2"
                            :step="0.01"
                            clearable
                            style="width: 100%"
                            ></el-input-number>
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
.editsubject{
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
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import {GetAccountBalanceById,CreateOrUpdateAccountBalance} from 'api/DataImport/SubjectAssistance'
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
                    code: "",
                    depCode: "",        
                    year: 0,
                    month: 0,
                    subjectCode: "",                
                    subjectName: "",                  
                    currentLender: 0,
                    currentDebit: 0,
                    choosedTreeNode: [],              
                }
                var dd=new Date();   
                 this.$set(this.form, 'budtime', dd)
                this.treeComp.choosedTreeNodeId = [];
                 this.deptreeComp.data=[];
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
                code: "",
                depCode: "",        
                year: 0,
                month: 0,
                subjectCode: "",                
                subjectName: "",                  
                currentLender: 0,
                currentDebit: 0 ,
                choosedTreeNode: [],
                budtime:new Date(),
            },
            rules: {
                // depCode: [
                //     { required: true, message: '请选择部门', trigger: 'blur' },
                // ],
                choosedTreeNode: [
                  { required: true, message: '请选择公司'},
                  {validator: this.validatedepartment},

                  ],
                budtime: [
                  { required: true, message: '请选择所属时间'},
                  {validator: this.validatetime},
                  ],
                            
                subjectCode: {required: true, message: '请输入科目编码', trigger: 'blur'},        
              
                 subjectName: [
                    { required: true, message: '请输入科目名称', trigger: 'blur' },
                ],
            },
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
            this.form.choosedTreeNode = clickNode;
            
            this.form.code=clickNode.length > 0 ? clickNode[0].nodeUUid : '';
             this.getdeplist("");
        },
        //
        onClickOutSide() {
            if(this.treeComp.show==true){
                this.treeComp.show=false;
                this.$refs.chooseEquNode.iconChange()
            }
        },
        //获取组织树
        getOrganizationTree() {
            getOrganizatonTreeNoUsers().then(res => {
            if(res.success)
                this.treeComp.data = res.result;         
            })
        },
        //根据公司获取部门
        getdeplist(dep){
            this.form.depcode="";
            this.deptreeComp.data=[];
            GetDeptUnitList({code:this.form.code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })
             this.form.depcode=dep;

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
        //校验时间
        validatetime(rule, value, callback) {
          
          if(this.form.budtime==="" || this.form.budtime===null || this.form.budtime===undefined) {
            console.log('error')
            callback(new Error('请选择所属时间'));
          }
          else {
            console.log('no error')
            callback();
          }
            
        },


        //获取单个科目辅助余额
        GetAccountBalanceById(id) {
            GetAccountBalanceById({id: id}).then(res => {
                this.form = res.result;
                var newdd= res.result.year+"-";
                var month=res.result.month;
                if(month<10)
                {
                    newdd+="0";
                }
                newdd+=month+"-01";
                var dd=new Date(newdd);
                //this.form.budtime=dd;     
                 this.$set(this.form, 'budtime', dd)
      
                this.getdeplist(res.result.depCode);
                this.form.choosedTreeNode = res.result.parentname ? [{nodeName:res.result.parentname}] : []

                this.$nextTick(()=>{
                    this.treeComp.choosedTreeNodeId = [res.result.parentId]
                })

               
                   
               
            })
        },
        //提交
        save() {
                     
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    
                    let data=this.form;
                    data.year=this.form.budtime.getFullYear();    
                    data.month=this.form.budtime.getMonth()+1;              
                    CreateOrUpdateAccountBalance(data).then(res => {
                        this.windowShow = false
                        this.$emit("on-save-success");
                    })
                }
            })
        },
    }
}
</script>