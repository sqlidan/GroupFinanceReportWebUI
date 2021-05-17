<template>
  <div class="app-container system">
    <el-card style="margin-left:10px;width:400px">
      <div class="title">
        <span>系统初始化：</span>
      </div>
      <el-form
        size="mini"
        :model="form"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20" style="margin-top:30px;">
          <el-col :span="20">
            <el-form-item label="租户:" prop="tenantId">
              <el-select
                name="tenantId"
                v-model="form.tenantId"
                placeholder="请选择租户"
                style="width: 100%;"
              >
                <el-option
                  v-for="tenant in form.tentList"
                  :key="tenant.value"
                  :value="tenant.value"
                  :label="tenant.displayName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:30px;">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="importCountry" :loading="btnLoading">导入国家信息</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="ImprtShip" :loading="btnLoading">导入船舶基础资料</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:30px;">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="ImportPort" :loading="btnLoading">导入港口信息</el-button>
          </el-col>
           <el-col :span="12">
            <el-button type="primary" size="mini" @click="ImportShipperPackageContrast" :loading="btnLoading">导入包装类型对照表</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:30px;">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="importCtnInfo" :loading="btnLoading">导入箱型信息</el-button>
          </el-col>         
           <el-col :span="12">
            <el-button type="primary" size="mini" @click="ImportPortContrast" :loading="btnLoading">导入港口名称对照表</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:30px;">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="ImportPackageType" :loading="btnLoading">导入包装类型</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="ImportCtnTypeContrast" :loading="btnLoading">导入船公司箱型对照表</el-button>
          </el-col>
         
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss">
.system{
  .title{
   display: inline-block;
    font-weight: 600;
    color: #296ce6;
    font-size:16px;
   
}
.el-card .el-card__body{
  height:500px;
}

}
</style>
<script>
import {getTenantList,} from 'api/user/tenant/index'
import { ImportCtnInfo,ImportCountry,ImportPort,ImprtShip,ImportCtnTypeContrast,ImportPackageType,ImportShipperPackageContrast,ImportPortContrast } from "api/user/systemInitialization";
export default {
  name: "systemIndex",
  props: {},
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        tenantId: "",
        tentList: []
      },
      rules: {
        tenantId: [{ required: true, message: "请选择租戶", trigger: "change" }]
      }
    };
  },
  methods: {
    //获取所有租户
    getTenants() {
      getTenantList().then(res => {
        if (res.success) this.form.tentList = res.result;
      });
    },
    //导入箱型信息
    async importCtnInfo() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportCtnInfo({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
    //导入国家
    async importCountry() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportCountry({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
    //导入港口
    async ImportPort() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportPort({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
    //导入船舶基础资料
    async ImprtShip() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImprtShip({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
     //导入船公司箱型对照表
    async ImportCtnTypeContrast() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportCtnTypeContrast({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
    //导入包装类型
    async ImportPackageType() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportPackageType({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
    //导入包装类型对照表
    async ImportShipperPackageContrast() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportShipperPackageContrast({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
    //导入港口名称对照表
    async ImportPortContrast() {
      let val = await this.$refs["ruleForm"].validate().catch(e => {});
      if (val) {
        this.btnLoading = true;
        ImportPortContrast({TenantId:this.form.tenantId})
          .then(res => {
            this.btnLoading = false;
          })
          .catch(err => {
            this.btnLoading = false;
          });
      }
    },
  },
  created() {
    this.getTenants();
  }
};
</script>