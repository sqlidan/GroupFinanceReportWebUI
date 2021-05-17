<template>
    <div class="editAccountSubject">
        <el-dialog :title="pageType === 'insert' ? '新增会计科目信息' : '编辑会计科目信息'" 
        v-dialogDrag
        :visible.sync="windowShow" 
        width="800px" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false">
            <el-form size="mini" :model="form" ref="ruleForm" :rules="rules" label-width="100px" >
                 <el-row>
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
                            <el-form-item label="科目类型：" prop="subjectType">
                                <el-input size="mini" v-model="form.subjectType" placeholder="请输入科目类型"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        <el-form-item label="现金分类：" prop="cashClass" >
                            <el-input size="mini" v-model="form.cashClass" placeholder="请输入现金分类"></el-input>
                            </el-form-item>
                        </el-col>
                </el-row>
                 <el-row>
                     <el-col :span="12">
                            <el-form-item label="方向：" prop="direction">
                                 <el-select
                                    v-model="form.direction"
                                    placeholder="方向"
                                    clearable
                                    filterable          
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
                        <el-col :span="12">
                        <el-form-item label="辅助核算：" prop="assistAccounting" >
                            <el-input size="mini" v-model="form.assistAccounting" placeholder="请输入辅助核算"></el-input>
                            </el-form-item>
                        </el-col>
                </el-row>
                 <el-row>
                     <el-col :span="12">
                            <el-form-item label="是否末级：" prop="lastStage">
                                 <el-select
                                    v-model="form.lastStage"
                                    placeholder="是否末级"
                                    filterable          
                                    >
                                    <el-option label="是" :value="true"></el-option>
                                    <el-option label="否" :value="false"></el-option>
                                    </el-select>            
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        <el-form-item label="计量单位：" prop="unit" >
                            <el-input size="mini" v-model="form.unit" placeholder="请输入计量单位"></el-input>
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
.editAccountSubject{
  .orgForm{
    .el-form-item__content{
      height:28px;
    }
  }

}
    
</style>
<script>
import { getDicListByDitType } from "api/publicBase/dictionaryMng";
import {GetAccountById,CreateOrUpdateAccount} from 'api/publicBase/Accountingsubjects'
import {warnMsg,successMsg} from 'utils/messageBox'
export default {
    components:{},
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
                    subjectCode: "",
                    subjectName: "",
                    subjectType: "",
                    cashClass: "",
                    direction: "",
                    assistAccounting: "",
                    lastStage: true,
                    unit :"",                                                
                }
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
                subjectCode: "",
                subjectName: "",
                subjectType: "",
                cashClass: "",
                direction: "",
                assistAccounting: "",
                lastStage: true,
                unit :"", 
            },
            rules: {
                            
                subjectCode: {required: true, message: '请输入科目编码', trigger: 'blur'},        
              
                 subjectName: [
                    { required: true, message: '请输入科目名称', trigger: 'blur' },
                ],
                 lastStage: [
                    { required: true, message: '请选择是否末级', trigger: 'change' },
                ],
            },
            typeList:[]

            
        }
    },
    methods: {
            //添加查询combox
      setComBox() {
        getDicListByDitType({ BaseKeyValueTypeCode: "DIRECTION", Code: "", Name: ""  }).then(res => {
            this.typeList = res.result.comboxs;
        });
        
        },   
        //获取单个会计科目
        GetAccountById(id) {
            GetAccountById({id: id}).then(res => {
                this.form = res.result;
               
            })
        },
        //提交
        save() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    
                    let data=this.form;        
                    CreateOrUpdateAccount(data).then(res => {
                        this.windowShow = false
                        this.$emit("on-save-success");
                    })
                }
            })
        },
    }
}
</script>