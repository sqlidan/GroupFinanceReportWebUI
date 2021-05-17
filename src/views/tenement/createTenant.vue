<template>
  <div >
    <el-dialog
      :title="form.id?'编辑租户':'新增租户'"
      v-dialogDrag
      :visible.sync="windowShow"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form size="mini"  v-loading="loading" :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-row>

          <el-col :span="12">
            <el-form-item label="租户名称：" prop="tenancyName">
              <el-input size="mini" maxlength="64"  v-model="form.tenancyName" placeholder="请输入租户名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="名字：" prop="name">
              <el-input size="mini" maxlength="128"  v-model="form.name" placeholder="请输入名字"></el-input>
            </el-form-item>
          </el-col>

           </el-row>

          <el-row>
          <el-col :span="24">
            <el-form-item label="连接字符串：" prop="connectionString">
                <el-input size="mini" maxlength="1024"  v-model="form.connectionString" placeholder="请输入数据库连接字符串"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

         <el-row>
          <el-col :span="24">
            <el-form-item label="管理员邮箱：" prop="adminEmailAddress">
              <el-input size="mini" maxlength="128"  v-model="form.adminEmailAddress" placeholder="请输入管理员邮箱"></el-input>
            </el-form-item>
          </el-col>
          </el-row>

          <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="管理员密码：" prop="adminPassword">
              <el-input type="password" size="mini" maxlength="128" v-model="form.adminPassword" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row> -->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="windowShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTenantForEdit,
  createTenant
} from "api/user/tenant"
import {numbers} from 'utils/validate';
export default {
    name:"createTenant",
  props: {
    pshow: {
      type: Boolean,
      default: false
    },
    atype: undefined
  },
  watch: {
    pshow(newValue, oldValue) {
      this.windowShow = newValue;
    },
    windowShow(newValue, oldValue) {
      if (this.$refs["ruleForm"]) this.$refs["ruleForm"].resetFields() //清空验证

      if (!newValue) {
        //窗口关闭
        this.form = {
          id: "",
          tenancyName: "",
          name: "",
          connectionString: "",
          isActive: Boolean,
          isInTrialPeriod: Boolean,
          remarks: "",
          adminEmailAddress:"",
          adminPassword:"",
        };
        this.$emit("on-show-change", newValue);
      }
    }
  },
  data() {
    return {
      loading:false,
      btnLoading:false,
      windowShow: this.pshow,
      form: {
          id: "",
          tenancyName: "",
          name: "",
          connectionString: "",
          remarks: "",
          adminEmailAddress:"",
          adminPassword:"",
          isActive: Boolean,
          isInTrialPeriod: Boolean
      },
      rules: {
        tenancyName: [
          { required: true, message: "请输入租户名称", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        connectionString:[
           { required: true, message: "请输入数据库连接串", trigger: "blur" }
        ],
        adminEmailAddress:[
           { required: true, message: "请输入管理员邮箱", trigger: "blur" }
        ],
        // adminPassword:[
        //    { required: true, message: "请输入管理员密码", trigger: "blur" },
        //   {validator: this.validatePass}
        // ]
      }
    };
  },
  methods: {
    //获取单个租户
    getOneTenant(id) {
      let _this = this;
      this.loading = true;
      getTenantForEdit({ id: id }).then(res => {
        _this.form.id = res.result.id
        _this.form.tenancyName=res.result.tenancyName
        _this.form.name = res.result.name
        _this.form.connectionString = res.result.connectionString
        this.loading=false
      }).catch(err=>{
        this.loading = false
      });
    },
//校验密码
        validatePass(rule, value, callback) {
            if (!!this.form.adminPassword) {
                if(!/(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}/.test(this.form.adminPassword)) {
                    callback(new Error('要同时含有数字和字母，且长度要在8-16位之间'));
                }else {
                    //this.$refs.ruleForm.validateField('checkPass');
                    callback();
                }
            }
        },
    //提交
    async save() {

      let val = await this.$refs["ruleForm"].validate().catch(e => {})
      if (val) {
        this.btnLoading = true
        let data = {
            id: this.form.id,
            tenancyName:this.form.tenancyName,
            name: this.form.name,
            adminPassword: '000000',//this.form.adminPassword,
            adminEmailAddress:this.form.adminEmailAddress,
            connectionString: this.form.connectionString,
            shouldChangePasswordOnNextLogin:false,
            sendActivationEmail:false,
            isActive:true,
            isInTrialPeriod:true
        }
        createTenant(data).then(res => {
          this.btnLoading = false
          this.windowShow = false
          this.$emit("on-save-success")
        }).catch(err=>{
        this.btnLoading = false
      })
      }
    }
  }
}
</script>
