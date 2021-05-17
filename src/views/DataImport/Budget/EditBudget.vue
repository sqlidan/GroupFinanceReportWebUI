<template>
    <div class="editbudget">
        <el-dialog :title="pageType === 'insert' ? '新增预算信息' : '编辑预算信息'" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="800px" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-form size="mini" :model="form" ref="ruleForm" :rules="rules" label-width="100px" >
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属公司：" prop="choosedTreeNode" class="orgForm" style="position:relative;">
                            <tree-select ref="chooseEquNode" placeholderName="公司" @on-treeShow-change="ontreeShowChange" :choosedEquipmentNode="form.choosedTreeNode"></tree-select>
                            <div class="editOrgComp-row-tree" v-show="treeComp.show" >
                                <!-- <tree ref='treeComp' :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                                    @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree> -->
                              <tree ref='treeComp' :pCheckStrictly="true" :radio="true" :pTreeDefaultProps="treeComp.treeConfig" :pTreeData="treeComp.data" :pChoosedNode="treeComp.choosedTreeNodeId"
                          @on-nodeChange="onNodeClick" @on-outside-click="onClickOutSide"></tree>  
                            </div>
                        </el-form-item>
                    </el-col>
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
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属年份：" prop="budyear" style="position:relative;">               
                            <el-date-picker v-model="budyear" 
                            type="year" 
                            placeholder="所属年份"     
                            style="width:100%"
                            ></el-date-picker>    
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="预算类别：" prop="budgettype" >
                        <el-select
                        v-model="form.budgetType"
                        placeholder="预算类别"
                        clearable
                        filterable      
                        style="width:100%"    
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
                        <el-form-item label="行号：" prop="linNO">
                            <el-input size="mini" v-model="form.linNO" placeholder="请输入行号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="全年合计：" prop="january">
                             <el-input-number
                              placeholder="全年合计"
                            v-model="form.annualTotal"
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
                  <el-row>
                    <el-col :span="12">
                        <el-form-item label="父级项目名称：" prop="parentProjectName">
                            <el-input size="mini" v-model="form.parentProjectName" placeholder="请输入父级项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目名称：" prop="projectName">
                            <el-input size="mini" v-model="form.parentProjectName" placeholder="请输入父级项目名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>                 
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="1月：">
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.january"
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
                         <el-form-item label="2月：" >
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.february"
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
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="3月：">
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.march"
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
                         <el-form-item label="4月：" >
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.april"
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
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="5月：">
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.may"
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
                         <el-form-item label="6月：" >
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.june"
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
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="7月：">
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.july"
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
                         <el-form-item label="8月：" >
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.august"
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
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="9月：">
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.september"
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
                         <el-form-item label="10月：" >
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.october"
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
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="11月：">
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.november"
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
                         <el-form-item label="12月：" >
                             <el-input-number
                              placeholder="预算金额"
                            v-model="form.december"
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
.editbudget{
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
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import {GetBudgetById,CreateOrUpdateBudget} from 'api/DataImport/Budget'
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
                    linNO: 0,
                    parentProjectName: "",
                    projectName: "",
                    annualTotal: 0,
                    budgetType: "",
                    year: 0,
                    january: 0,
                    february: 0,
                    march: 0,
                    april: 0,
                    may: 0,
                    june: 0,
                    july: 0,
                    august: 0,
                    september: 0,
                    october: 0,
                    november: 0,
                    december: 0,
                    choosedTreeNode: [],
                }
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
            budyear:new Date(),
            form: {
                id: '',
                code: "",
                depCode: "",
                linNO: 0,
                parentProjectName: "",
                projectName: "",
                annualTotal: 0,
                budgetType: "",
                year: 0,
                january: 0,
                february: 0,
                march: 0,
                april: 0,
                may: 0,
                june: 0,
                july: 0,
                august: 0,
                september: 0,
                october: 0,
                november: 0,
                december: 0,
                choosedTreeNode: [],
            },
            rules: {
                // depCode: [
                //     { required: true, message: '请选择部门', trigger: 'blur' },
                // ],
                choosedTreeNode: [
                  { required: true, message: '请选择公司'},
                  {validator: this.validatedepartment},

                  ],
                            
                budgetType: {required: true, message: '请选择预算类别', trigger: 'change'},        
              
                 linNO: [
                    { required: true, message: '请输入行号', trigger: 'blur' },
                ],
            },
            typeList:[],//预算类别
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
        
        },
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


        //获取单个预算
        GetBudgetById(id) {
            GetBudgetById({id: id}).then(res => {
                this.form = res.result;
                var newdd= res.result.year+"-01-01";
                var dd=new Date(newdd);
                this.budyear=dd;           
                this.getdeplist(res.result.depCode);
                this.form.choosedTreeNode = res.result.parentName ? [{nodeName:res.result.parentName}] : []

                this.$nextTick(()=>{
                    this.treeComp.choosedTreeNodeId = [res.result.parentId]
                })

               
                   
               
            })
        },
        //提交
        save() {
              if(this.budyear==="" || this.budyear===null ||this.budyear===undefined)
            {
                warnMsg("请选择年份");
                return;
            }
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    
                    let data=this.form;
                    data.year=this.budyear.getFullYear();                
                    CreateOrUpdateBudget(data).then(res => {
                        this.windowShow = false
                        this.$emit("on-save-success");
                    })
                }
            })
        },
    }
}
</script>