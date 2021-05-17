<template>
    <div class="login">
        <div class="w">

            <div class="register-title">
                <div style="width: 1200px;margin: 0 auto;">
                    <span style="font-size:24px;">全球捷运经营报表系统</span>
                    <el-button round style="float: right;margin-top: 10px;color: #409EFF;" @click="loginUrl">返回登陆</el-button>
                </div>
            </div>
            <div class="register-center">
                <div>
                    <div style="padding: 0 20px;">
                      <div style="margin: 30px auto;width: 200px;">
                        <el-radio-group v-model="tabPosition" @change="switchShow">
                          <el-radio-button label="gs">公司注册</el-radio-button>
                          <el-radio-button label="gr">个人注册</el-radio-button>
                        </el-radio-group>
                      </div>
                      <div style="width: 500px;margin: 0 auto;" v-show="gsShow">
                        <el-form autoComplete="on" :model="registerForm" :rules="registerRules" ref="registerForm" label-width="150px" label-position="right" @submit.native.prevent >
                          <el-form-item label="公司中文全名：" style="position:relative" prop="companyCNName">
                              <el-input :disabled="nameDisabled" size="mini" style="width:70%" v-model="registerForm.companyCNName" @blur="blurText" placeholder="请输入公司中文全名"></el-input>
                            </el-form-item>
                            <el-form-item label="公司中文简称：" style="position:relative" prop="companyCNShortName">
                              <el-input size="mini" style="width:70%" v-model="registerForm.companyCNShortName" placeholder="请输入公司中文简称"></el-input>
                            </el-form-item>
                            <el-form-item label="公司注册地址：" style="position:relative" prop="address">
                              <el-input size="mini" style="width:70%" v-model="registerForm.address" placeholder="请输入公司注册地址"></el-input>
                            </el-form-item>
                            <el-form-item label="公司英文全称：" style="position:relative" prop="companyENName">
                              <el-input size="mini" style="width:70%" v-model="registerForm.companyENName" placeholder="请输入公司英文全称"></el-input>
                            </el-form-item>
                            <el-form-item label="公司英文简称：" style="position:relative" prop="companyENShortName">
                              <el-input size="mini" style="width:70%" v-model="registerForm.companyENShortName" placeholder="请输入公司英文简称"></el-input>
                            </el-form-item>
                            <el-form-item label="电话：" style="position:relative" prop="tel">
                              <el-input size="mini" style="width:70%" v-model="registerForm.tel" placeholder="请输入电话"></el-input>
                            </el-form-item>
                            <el-form-item label="传真：" style="position:relative" prop="fax">
                              <el-input size="mini" style="width:70%" v-model="registerForm.fax" placeholder="请输入传真"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：" style="position:relative" prop="email">
                              <el-input size="mini" style="width:70%" v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="官网：" style="position:relative" prop="webSite">
                              <el-input size="mini" style="width:70%" v-model="registerForm.webSite" placeholder="请输入官网"></el-input>
                            </el-form-item>
                            <el-form-item label="税号：" style="position:relative" prop="taxno">
                              <el-input size="mini" style="width:70%" v-model="registerForm.taxno" placeholder="请输入税号"></el-input>
                            </el-form-item>
                            <el-form-item label="营业执照：" style="position:relative" prop="license">
                              <el-upload
                                class="upload-demo"
                                action="/DBService/api/services/app/Annex/AnnexUpload"
                                ref="upload"
                                :limit="1"
                                :auto-upload="false"
                                :http-request="httpRequest"
                                :show-file-list="true">
                                <el-button slot="trigger" size="small" type="primary">选取附件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                              </el-upload>
                            </el-form-item>
                            <el-form-item label="logo：" style="position:relative" prop="logo">
                              <el-upload
                                class="upload-demo"
                                ref="uploads"
                                action="/DBService/api/services/app/Annex/AnnexUpload"
                                :limit="1"
                                :auto-upload="false"
                                :http-request="httpRequest2"
                                :show-file-list="true">
                                <el-button slot="trigger" size="small" type="primary">选取附件</el-button>
                                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">上传到服务器</el-button>
                              </el-upload>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="onSubmitRigisterGs" :loading="loading">立即注册</el-button>
                            </el-form-item>
                      </el-form>
                      </div>
                      <div style="width: 500px;margin: 0 auto;" v-show="grShow">
                        <el-form autoComplete="on" :model="registerGrForm" :rules="registerGrRules" ref="registerGrForm" label-width="150px" label-position="right" @submit.native.prevent >
                            <el-form-item label="公司中文全名：" style="position:relative" prop="companyCNName">
                              <el-input size="mini" style="width:70%" v-model="registerGrForm.companyCNName" placeholder="请输入公司中文全名"></el-input>
                            </el-form-item>
                            <el-form-item label="用户名：" style="position:relative" prop="userName">
                              <el-input size="mini" style="width:70%" v-model="registerGrForm.userName" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item label="姓：" style="position:relative" prop="surname">
                              <el-input size="mini" style="width:70%" v-model="registerGrForm.surname" placeholder="请输入姓"></el-input>
                            </el-form-item>
                            <el-form-item label="名：" style="position:relative" prop="name">
                              <el-input size="mini" style="width:70%" v-model="registerGrForm.name" placeholder="请输入名"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：" style="position:relative" prop="emailAddress">
                              <el-input size="mini" style="width:70%" v-model="registerGrForm.emailAddress" placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="密码：" style="position:relative" prop="password">
                              <el-input size="mini" style="width:70%" v-model="registerGrForm.password" placeholder="请输入密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-button type="primary" @click="onSubmitRigisterGr" :loading="loading">立即注册</el-button>
                            </el-form-item>
                      </el-form>
                      </div>
                    </div>
                </div>

            </div>
            <div style="height:50px;line-height:50px;width:100%;text-align:center;">
                <span style="font-size:14px;color:#777777;">版本号：1.0.0</span>
            </div>
        </div>
    </div>
</template>

<script>
import {Message,MessageBox} from 'element-ui';
  import {setCookie, getCookie, delCookie} from 'utils/cookie'
  import {getCompanyRegiste, getUserRegister, getCompanyByCompanyCNName, getAnnexUpload} from 'api/publicBase/register'
  import {englishOrCharacter,english,noEnglish,numbers} from 'utils/validate'; 
  import {warnMsg,successMsg} from 'utils/messageBox'
  //import {getTenantList, IsTenantAvailable} from 'api/user/tenant/index';
  export default {
    components: {},
    name: 'register',
    data() {
      return {
        nameDisabled: false,
        tabPosition: 'gs', // 切换
        gsShow: true,
        grShow: false,
        registerForm: { // 公司注册
          companyCNName: '',
          companyCNShortName: '',
          companyENName: '',
          companyENShortName: '',
          address: '',
          tel: '',
          fax: '',
          email: '',
          webSite: '',
          taxno: '',
          license: '测试',
          logo: '测试'
        },
        registerGrForm: { // 个人注册
          companyCNName: '',
          userName: '',
          surname: '',
          name: '',
          emailAddress: '',
          password: ''
        },
        registerRules: { // 公司注册
          companyCNName: [{required: true,message: '公司中文全名不能为空',trigger: 'blur'}],
          companyCNShortName: [{required: true,message: '公司中文简称不能为空',trigger: 'blur'}],
          companyENName: [{required: true,message: '公司英文全称不能为空',trigger: 'blur'}],
          companyENShortName: [{required: true,message: '公司英文简称不能为空',trigger: 'blur'}],
          address: [{required: true,message: '公司注册地址不能为空',trigger: 'blur'}],
          tel: [{required: true,message: '电话不能为空',trigger: 'blur'}],
          fax: [{required: true,message: '传真不能为空',trigger: 'blur'}],
          email: [{required: true,message: '邮箱不能为空',trigger: 'blur'}],
          taxno: [{required: true,message: '税号不能为空',trigger: 'blur'}],
          license: [{required: true,message: '营业执照不能为空',trigger: 'blur'}],
          logo: [{required: true,message: 'logo不能为空',trigger: 'blur'}]
        },
        registerGrRules: { // 个人注册
          companyCNName: [{required: true,message: '公司中文全名不能为空',trigger: 'blur'}],
          userName: [{required: true,message: '用户名不能为空',trigger: 'blur'}],
          surname: [{required: true,message: '姓不能为空',trigger: 'blur'}],
          name: [{required: true,message: '名不能为空',trigger: 'blur'}],
          emailAddress: [{required: true,message: '邮箱不能为空',trigger: 'blur'}],
          password: [{required: true,message: '密码不能为空',trigger: 'blur'}]
        },
        checked:true,
        loading: false,
        loadingRegister: false,
        showDialog: false,
        tenantForm: {}
      }
    },
    methods: {
      switchShow(value){
        if(value === 'gs'){
          this.gsShow = true
          this.grShow = false
        } else {
          this.gsShow = false
          this.grShow = true
        }
      },
      // 验证公司名是否存在
      blurText() {
        getCompanyByCompanyCNName({companyCNName: this.registerForm.companyCNName}).then(res => {
          if(res.result === false) {
            warnMsg("该公司名已存在，请重新填写")
          }
        })
      },
      // 附件上传
      submitUpload() {
        if(this.registerForm.companyCNName === '') {
          warnMsg("请先填写公司中文全名")
        } else {
         this.$confirm('您是否确定马上上传附件？上传附件后公司中文全名将不可修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if(action === 'confirm'){
          this.$refs.upload.submit();
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
        }
      },
    httpRequest(param){
      this.registerForm.license = param.file.name
      let formData = new FormData();
          formData.append("files", param.file);
          formData.append("bookingCode", this.registerForm.companyCNName);
          getAnnexUpload(formData).then(res => {
            if (res.success) {
              this.nameDisabled = true
              this.$message.success('文件上传成功!');
            }
          })
    },
    submitUpload2() {
        if(this.registerForm.companyCNName === '') {
          warnMsg("请先填写公司中文全名")
        } else {
         this.$confirm('您是否确定马上上传附件？上传附件后公司中文全名将不可修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if(action === 'confirm'){
          this.$refs.uploads.submit();
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
        }
      },
    httpRequest2(param){
      this.registerForm.logo = param.file.name
      let formData = new FormData();
          formData.append("files", param.file);
          formData.append("bookingCode", this.registerForm.companyCNName);
          getAnnexUpload(formData).then(res => {
            if (res.success) {
              this.nameDisabled = true
              this.$message.success('文件上传成功!');
            }
          })
    },
      // 公司注册
      onSubmitRigisterGs() {
        this.loading = true;
        this.$refs["registerForm"].validate(valid => {
          getCompanyByCompanyCNName({companyCNName: this.registerForm.companyCNName}).then(res => {
          if(res.result === false) {
            warnMsg("该公司名已存在，请重新填写")
          } else {
            let data = {
              companyCNName: this.registerForm.companyCNName,
              companyCNShortName: this.registerForm.companyCNShortName,
              companyENName: this.registerForm.companyENName,
              companyENShortName: this.registerForm.companyENShortName,
              address: this.registerForm.address,
              tel: this.registerForm.tel,
              fax: this.registerForm.fax,
              email: this.registerForm.email,
              webSite: this.registerForm.webSite,
              taxno: this.registerForm.taxno,
              license: this.registerForm.logo,
              logo: this.registerForm.logo
            }
              // let formData = new FormData();
              // formData.append('companyCNName', this.registerForm.companyCNName);
              // formData.append('companyCNShortName', this.registerForm.companyCNShortName);
              // formData.append('companyENName', this.registerForm.companyENName);
              // formData.append('companyENShortName', this.registerForm.companyENShortName);
              // formData.append('address', this.registerForm.address);
              // formData.append('tel', this.registerForm.tel);
              // formData.append('fax', this.registerForm.fax);
              // formData.append('email', this.registerForm.email);
              // formData.append('webSite', this.registerForm.webSite);
              // formData.append('taxno', this.registerForm.taxno);
              // formData.append('license', this.registerForm.logo);
              // formData.append('logo', this.registerForm.logo);

              getCompanyRegiste(data).then(res => {
                  if (res.success) {
                    this.loading = false;
                    //跳转到登陆页
                         Message({
                          message: '注册成功！请等待审核！',
                          duration:0,
                          showClose:true,
                          type: 'success'
                        });
                    this.$router.push({
                      path: '/login'
                    });
                  } else {
                    this.loading = false;
                    this.$message({
                      showClose: true,
                      message: res.msg,
                      type: 'error'
                    });
                  }
                })
                .catch(e => {
                  this.formLoading = false;
                });
          }
        })
      });
      },
      loginUrl() {
        this.$router.push({
          path: '/login'
        });
      },
      // 用户注册
      onSubmitRigisterGr() {
          this.$refs["registerForm"].validate(valid => {
            let data = {
              companyCNName: this.registerForm.companyCNName,
              userName: this.registerForm.userName,
              surname: this.registerForm.surname,
              name: this.registerForm.name,
              emailAddress: this.registerForm.emailAddress,
              password: this.registerForm.password
            }
          // let formData = new FormData();
					// formData.append('companyCNName', this.registerForm.companyCNName);
					// formData.append('userName', this.registerForm.userName);
          // formData.append('surname', this.registerForm.surname);
          // formData.append('name', this.registerForm.name);
          // formData.append('emailAddress', this.registerForm.emailAddress);
          // formData.append('password', this.registerForm.password)

          getUserRegister(data).then(res => {
              if (res.success) {
                this.loading = false;
                //跳转到登陆页
                Message({
                  message: '注册成功,请等待审核!',
                  type: 'error',
                  duration: 5 * 1000
                });
                this.$router.push({
                  path: '/login'
                });
              
              } else {
                debugger
                this.loading = false;
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'error'
                });
              }
            })
            .catch(e => {
              this.formLoading = false;
            });
      });
      }
    },
    created() {
      localStorage.clear();
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
   .register{
        width:100%;
        height:100%;
        background-color: #fff;
        position: relative;}
    .w{
        width:100%;
        margin: 0 auto;
    }
    .register-title{
        width:100%;
        height:60px;
        line-height: 60px;
        background-color: #fff;
        border-bottom: 1px dashed #DCDFE6;
    }
    .register-center{
        width:900px;
        margin:0 auto;
    }

</style>
