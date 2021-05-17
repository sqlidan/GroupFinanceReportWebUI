<template>
  <div >
    <el-dialog
      :title="form.id?'编辑默认费目':'新增默认费目'"
      v-dialogDrag
      :visible.sync="windowShow"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form v-loading="loading" size="mini" :model="form" ref="ruleForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务类型：" prop="busTypeCode">
            <el-select
              v-model="form.busTypeCode"
              clearable
              size="mini"
              filterable
              placeholder="请选择业务类型"
              style="width:100%"
              @change="showFeeItem"
            >
              <el-option
                v-for="item in form.businessTypeCodeList"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="费目：" prop="feeItemId">
            <el-select v-model="form.feeItemId" size="mini" clearable  :multiple="!form.id" collapse-tags filterable placeholder="请选择费目" style="width:100%" >
                <el-option
                        v-for="item in form.feeItemList"
                        :key="item.feeID"
                        :label="item.feeName"
                        :value="item.feeID">
                </el-option>
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form-item label="备注："   prop="remarks">
                    <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入备注"
                    maxlength="500"
                    @input="form.remarks = form.remarks.toUpperCase()"
                    v-model="form.remarks"
                    show-word-limit
                ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
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
  getFeeItemDefaultById,
  createorUpdateFeeItemDefault
} from "api/publicBase/custom/cusFeeItem"
import {
  getFeeItemList
} from "api/publicBase/feeRate"
import { getDicListByDitType } from "api/publicBase/dictionaryMng"
import {mobile,telephone,email} from 'utils/validate'; 
export default {
    name:"createFeeItem",
  props: {
    pshow: {
      type: Boolean,
      default: false
    },
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
          cusId: "",
          busTypeCode: "",
          remarks:"",
          businessTypeCodeList: [],
           feeItemId:[],
           feeItemList: [],
        };
        this.$emit("update:pshow", newValue);
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
          cusId: "",
          busTypeCode: "",
          remarks:"",
          businessTypeCodeList: [],
           feeItemId: this.id ? '' :[],
           feeItemList: [],
      },
      rules: {
        busTypeCode: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        feeItemId: [
          { required: true, message: "请选择费目", trigger: "change"  }
        ],  
      }
    };
  },
  methods: {
    //获取单个联系人信息
    getFeeItemDefaultInfoById(id) {
      let _this = this;
      this.loading = true
      getFeeItemDefaultById({ id: id }).then(res => {
        _this.form.id = res.result.id
        _this.form.cusId=res.result.cusId
        _this.form.busTypeCode=res.result.busTypeCode
        _this.form.feeItemId = res.result.needDefaultFeeItemId
        _this.form.remarks = res.result.remarks
        this.loading=false
        this.getFeeItem()
      }).catch(err=>{
        this.loading = false
      });
    },
    showFeeItem(){
      this.getFeeItem()
    },
     //获取业务类型名称下拉
    getBusinessTypeProcess() {
      getDicListByDitType({ TypeCode: "YEWULEIXING", Code: "", Name: "" }).then(
        res => {
          this.form.businessTypeCodeList = res.result;
        }
      );
    },
      //取费目列表
    getFeeItem() {
      getFeeItemList({bustype: this.form.busTypeCode} ).then(res => {
        this.form.feeItemList = res.result.feeItem
      });
    },
    //提交
    async save() {
  
      let val = await this.$refs["ruleForm"].validate().catch(e => {})
      if (val) {
            this.btnLoading=true
        let data = {
            id: this.form.id,
            ShipperId:this.$route.query.id,
            busTypeCode: this.form.busTypeCode,
            needDefaultFeeItemId: this.form.id?this.form.feeItemId:this.form.feeItemId.join(';'),
            remarks:this.form.remarks   
        }
        createorUpdateFeeItemDefault(data).then(res => {
          this.btnLoading=false
          this.windowShow = false
          this.$emit("on-save-success")
        }).catch(err=>{
        this.btnLoading = false
      })
      }
    }
  },

}
</script>