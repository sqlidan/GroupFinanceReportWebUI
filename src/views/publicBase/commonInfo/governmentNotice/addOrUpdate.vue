<template>
  <div class="createUser">
    <el-dialog
      :title="form.id?'编辑公告及规定':'新增公告及规定'"
      v-dialogDrag
      :visible.sync="windowShow"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        size="mini"
        :model="form"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="关区：" prop="customDistrictId">
              <el-select
                v-model="form.customDistrictId"
                placeholder="请选择关区"
                clearable
                style="width:100%;"
                filterable
              >
                <el-option
                  v-for="item in customsList"
                  :key="item.displayText"
                  :label="item.value"
                  :value="item.displayText"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="公告类型：" prop="noticeType">
              <el-select
                v-model="form.noticeType"
                placeholder="请选择公告类型"
                clearable
                style="width:100%;"
                filterable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告编号：" prop="noticeNO">
              <el-input size="mini" v-model="form.noticeNO" maxlength="50" placeholder="请输入公告编号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告摘要：" prop="noticeintro">
              <el-input size="mini" v-model="form.noticeintro" maxlength="50" placeholder="请输入公告摘要"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布日期：" prop="noticeDate">
              <el-date-picker
                size="mini"
                style="width:100%"
                v-model="form.noticeDate"
                type="date"
                placeholder="请选择发布日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="全文：" prop="remarks">
              <el-input
                size="mini"
                v-model="form.fullTest"
                maxlength="5000"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入全文"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件：" prop="filePath">
              <el-input size="mini" v-model="form.filePath" maxlength="500" placeholder="请输入附件地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="windowShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="saveInfo" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.createUser {
  .chsEqp {
    height: 32px;
    width: 100%;
    .textPromt {
      float: left;
      height: 30px;
      line-height: 30px;
    }
    .chsEqp-select {
      height: 30px;
      line-height: 30px;
    }
    i {
      float: right;
      margin-top: 8px;
    }
  }
  .editOrgComp-row-tree {
    position: absolute;
    top: 40px;
    left: 0;
    background-color: #fff;
    z-index: 10;
    padding: 0;
    margin: 0;
    width: 300px;
    height: 450px;
    clear: both;
  }
}
</style>

<script>
import { tableMixin } from "mixin/commTable";
import { parseTime } from "utils/index";
import { getCustomDistrictComboBoxList } from "api/publicBase/baseCustomDistrict";
import { getDicListByDitType } from "api/publicBase/dictionaryMng";

import {
  getOne,
  createOrUpdateInfo
} from "api/publicBase/others/governmentNotice";
import { pickerOptions } from "consts/common";

export default {
  props: {
    pshow: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    pshow(newValue, oldValue) {
      this.windowShow = newValue;
    },

    windowShow(newValue, oldValue) {
      if (this.$refs["ruleForm"]) this.$refs["ruleForm"].resetFields(); //清空验证

      if (!newValue) {
        //窗口关闭
        this.form = {
          id: "",
          noticeType: "",
          customDistrictId: "",
          noticeNO: "",
          noticeDate: "",
          noticeintro: "",
          fullTest: "",
          filePath: ""
        };
        this.$emit("on-show-change", newValue);
      }
    }
  },

  data() {
    return {
      //引用日期快捷组件
      pickerOptions,
      pageType: "",
      windowShow: this.pshow,
      formLoading: false,
      customsList: [],
      typeList: [],
      value: "",
      form: {
        id: "",
        noticeType: "",
        customDistrictId: "",
        noticeNO: "",
        noticeDate: "",
        noticeintro: "",
        fullTest: "",
        filePath: ""
      },
      rules: {
        customDistrictId: [{ required: true, message: "请选择关区" }],
        noticeType: [
          { required: true, message: "请选择公告类型", trigger: "change" }
        ],
        noticeNO: [
          { required: true, message: "请输入公告编号", trigger: "blur" }
        ],
        noticeDate: [
          { required: true, message: "请选择发布日期", trigger: "blur" }
        ],
        noticeintro: [
          { required: true, message: "请输入公告摘要", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    //根据ID 获取港口
    getInfoByID(id) {
      this.formLoading = true;
      getOne({ id: id })
        .then(res => {
          this.form.id = res.result.governmentNoticelistDto.id;
          this.form.noticeType =
            res.result.governmentNoticelistDto.noticeTypeCode + "";
          this.form.customDistrictId =
            res.result.governmentNoticelistDto.customDistrictId + "";
          this.form.noticeNO = res.result.governmentNoticelistDto.noticeNO;
          this.form.noticeDate = res.result.governmentNoticelistDto.noticeDate;
          this.form.noticeintro =
            res.result.governmentNoticelistDto.noticeintro;
          this.form.fullTest = res.result.governmentNoticelistDto.fullTest;
          this.form.filePath = res.result.governmentNoticelistDto.filePath;
          this.formLoading = false;
        })
        .catch(e => {
          this.formLoading = false;
        });
    },

    setCombox() {
      // //获取关区代码下拉列表
      // getCustomDistrictComboBoxList().then(res => {
      //   this.customsList = res.result.customDistrictCode;
      // });

      getDicListByDitType({ TypeCode: "NOTICETYPE" }).then(res => {
        console.log(res.result);
        this.typeList = res.result;
      });
    },

    //保存或修改港口
    saveInfo() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let msg = this.form.id ? "编辑公告及规定" : "新增公告及规定";
          this.formLoading = true;
          let data = {
            id: this.form.id,
            noticeTypeCode: this.form.noticeType,
            customDistrictId: this.form.customDistrictId,
            noticeNO: this.form.noticeNO,
            noticeDate: parseTime(this.form.noticeDate),
            noticeintro: this.form.noticeintro,
            fullTest: this.form.fullTest,
            filePath: this.form.filePath
          };
          createOrUpdateInfo(data,msg)
            .then(res => {
              this.formLoading = false;
              this.windowShow = false;
              this.$emit("on-save-success");
            })
            .catch(e => {
              this.formLoading = false;
            });
        }
      });
    }
  }
};
</script>