<template>
    <div class="editSpecialFee">
        <el-dialog :title="pageType === 'insert' ? '新增特殊费用单据' : '编辑特殊费用单据'" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="800px" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-form size="mini" :model="form" ref="ruleForm" :rules="rules" label-width="100px" >
                 <el-row>
                   <el-row>
                        <el-col :span="12">
                           <el-form-item label="公司：" prop="choosedTreeNode" style="position:relative;" >            
                    
                            <tree-select ref="chooseEquNode" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="form.choosedTreeNode" style="width:100%"></tree-select>
                            <div class="editOrgComp-row-tree" v-show="treeComp.show" >                      
                                <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                                @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                            </div>
                        </el-form-item>
                        </el-col>
                        <el-col :span="12">
                         <el-form-item label="部门：" prop="">
                            <el-select v-model="form.depCode"  
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
                    <el-col :span="12">
                        <el-form-item label="所属时间：" prop="budtime" style="position:relative;">               
                            <el-date-picker v-model="form.budtime" 
                            type="month" 
                            placeholder="所属时间"     
                            style="width:100%"
                            ></el-date-picker>    
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="预算类别：" prop="budgetType" >
                        <el-select
                        v-model="form.budgetType"
                        placeholder="预算类别"
                        clearable
                        filterable      
                        style="width:100%"   
                        @change="getprojectlis" 
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
                </el-row>
                 <el-row>
                    
                        <el-col :span="12">
                         <el-form-item label="科目名称：" prop="linNO" >
                            <el-select v-model="form.linNO"  
                                placeholder="请选择科目" 
                                style="width:100%"  
                                clearable
                                filterable     >
                                    <el-option v-for="item in projectlist" 
                                     :key="item.id"
                                    :label="item.projectName" 
                                    :value="item.linNO"></el-option>
                                </el-select>   
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="金额：" prop="amount" >
                            <!-- <el-input size="mini" v-model="form.amount" placeholder="请输入金额"></el-input> -->
                           <el-input-number
                                placeholder="金额"
                                v-model="form.amount"
                                controls-position="right"
                                :min="0.00"
                                :max="100000000"                               
                                :step="0.01"
                                clearable
                                style="width: 100%"
                                ></el-input-number> 
                            </el-form-item>
                        </el-col>
                </el-row>
                 
                  
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
.editSpecialFee{
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
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import treeSelect from 'components/treeSelect/treeSelect'
import tree from 'components/tree/tree'
import {getOrganizatonTreeNoUsers,GetDeptUnitList} from 'api/user/organization'
import {GetSpecialFeeById,CreateOrUpdateSpecialFee} from 'api/DataMaintenance/SpecialFee'
import {warnMsg,successMsg} from 'utils/messageBox'
import {GetProjectList} from 'api/publicBase/Combox'

export default {
    components:{ treeSelect,
                tree},
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
                    linNO: "",
                    budgetType: "",
                    amount: 0, 
                    budtime:new Date(),
                    choosedTreeNode: [],                                          
                }
                this.$emit("on-show-change",newValue);
            }
        }
    },
    data() {
        return {
            pageType: '',    //insert update
            windowShow: this.pshow,
             projectlist:[],//科目下拉
            form: {
                id: '',
                code: "",
                depCode: "",
                linNO: "",
                budgetType: "",
                amount: 0,             
                choosedTreeNode: [],
                budtime:new Date(),
            },
            rules: {
                            
                linNO: {required: true, message: '请选择科目', trigger: 'change'},              
              
                 amount: [
                    { required: true, message: '请输入金额', trigger: 'blur' },
                ],
                 budgetType: [
                    { required: true, message: '请选择预算类别', trigger: 'change' },
                ],           
                 choosedTreeNode: [
                  { required: true, message: '请选择公司'},
                  {validator: this.validatedepartment},
                  ],
                budtime: [
                  { required: true, message: '请选择所属时间'},
                  {validator: this.validatetime},
                  ],
            },
            typeList:[],
          
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
            //添加查询combox
      setComBox() {
        getDicListByDitType({ BaseKeyValueTypeCode: "BUDGETTYPE", Code: "", Name: ""  }).then(res => {
            this.typeList = res.result.comboxs;
        });
        this.projectlist=[];
        this.form.linNO="";
        
        },   
         getprojectlis(lino){
            this.projectlist=[];
            this.form.linNO=lino;
            if(this.form.budgetType!=="" && this.form.budgetType!==null && this.form.budgetType!==undefined)
            {
                 let data={
                    IsShowParent:false,
                    BudgetType:this.form.budgetType
                    };
                    GetProjectList(data).then(res => {
                    this.projectlist = res.result;
                }); 
            }
           
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
        getdeplist(dep){
            this.form.depCode=dep;
            this.deptreeComp.data=[];
            GetDeptUnitList({code:this.form.code}).then(res => {
            if(res.success)
                this.deptreeComp.data = res.result
            })

        },
        //树数据回调事件
        onNodeClick(clickNode)   //choosedNodeID
        {
            this.form.code = clickNode.length > 0 ? clickNode[0].nodeUUid : ''
            this.form.choosedTreeNode=clickNode;
            this.getdeplist("");
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
        //获取单个特殊费用
        GetSpecialFeeById(id) {
            GetSpecialFeeById({id: id}).then(res => {
                this.form = res.result;
                this.getprojectlis(res.result.linNO);
                var newdd= res.result.year+"-";
                var month=res.result.month;
                if(month<10)
                {
                    newdd+="0";
                }
                newdd+=month+"-01";
                var dd=new Date(newdd);
                // this.form.budtime=dd; 
                 //this.form.budtime=new Date();
                // this.form.budtime.setFullYear(res.result.year);  
                // this.form.budtime.setMonth(res.result.month-1);    
                this.$set(this.form, 'budtime', dd)

               this.getdeplist(res.result.depCode);
                this.form.choosedTreeNode = res.result.parentname? [{nodeName:res.result.parentname}] : []

                this.$nextTick(()=>{
                     this.treeComp.choosedTreeNodeId = [res.result.parentid]
                })
            })
        },
        //提交
        save() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    
                    let data={
                         id: this.form.id,
                        code: this.form.code,
                        depCode: this.form.depCode,
                        linNO: this.form.linNO,
                        budgetType: this.form.budgetType,
                        amount: this.form.amount,    
                    };   
                    data.month= this.form.budtime.getMonth()+1;
                    data.year=this.form.budtime.getFullYear();    
                    CreateOrUpdateSpecialFee(data).then(res => {
                        this.windowShow = false
                        this.$emit("on-save-success");
                    })
                }
            })
        },
    }
}
</script>