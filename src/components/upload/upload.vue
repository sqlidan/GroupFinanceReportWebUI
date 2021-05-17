<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    action=""
    style="float:left"
    :multiple="uploadMultiple"
    :show-file-list="isShowFileList"
    :accept="pAcceptFormat"
    :limit="pLimit"
    :disabled="uploadDisabled"
    :on-exceed="onExceedCount"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :pIsCheck="pIsCheck"
  >
    <slot>
      <el-button type="primary" style="margin-top:15px;margin-left:10px" icon="el-icon-plus">上传文件</el-button>
    </slot>
  </el-upload>
</template>
<style>
</style>
<script>
export default {
  props: {
    pUploadType: {
      type: Number,
      default: 1 //1文件  2图片
    },
    pIsOss: {
      type: Boolean,
      default: true //true上传服务器  false前台处理文件
    },
    pIsCheck: {
      type: Boolean,
      default: true //验证扩展名 false不验证
    },
    pAcceptFormat: {
      //上传文件的类型
      type: String,
      default: ".xlsx,.pdf,.zip"
    },
    pLimit: {
      //最大上传数
      type: Number,
      default: 100
    },
    uploadDisabled: {
      //上传控件的禁用状态
      type: Boolean,
      default: false
    },
     isShowFileList: {
      //是否显示上传文件列表
      type: Boolean,
      default: false
    },
    uploadMultiple: {
      //是否开户多文件上传
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [], //上传的文件数组
      websocketList: []
    };
  },
  methods: {
    onExceedCount(files, fileList) {
      this.$message({
        type: "error",
        message: `上传文件数量超过${this.pLimit}个`,
        showClose: true
      });
    },

    beforeUpload(file) {
      if(!this.pIsOss) {   //前台处理
        if(this.pIsCheck){
           //判断扩展名
          let ExtensionName = file.name.match(/\.\w+$/)[0];
          if (this.pAcceptFormat.split(",").indexOf(ExtensionName) == -1) {
            this.$message({
              type: "error",
              message: `不支持${ExtensionName}文件上传`,
              showClose: true
            });
            return false;
          }

          this.$emit('onCustomUpload', file)
          return false
        }
        else{
           this.$emit('onCustomUpload', file)
           return false
        }
      }
      else{
        if (this.pAcceptFormat == "*") {
          //没有后缀的文件，需要去后台处理并上传文件，返回文件上传的路径
          var formData = new FormData();
          formData.append("file", file);
          if (file.name.indexOf(".") == -1) {
            // AddFileExtension(formData)
            //   .then(res => {
            //       this.$emit("onUploadSuccess", res.result);
            //       return false;
            //   })
            //   .catch(err => {
            //       return false;
            //   });
          }
          return true;
        } 
        else {
          if(this.pIsCheck){
            let ExtensionName = file.name.match(/\.\w+$/)[0];
            if (this.pAcceptFormat.split(",").indexOf(ExtensionName) == -1) {
              this.$message({
                type: "error",
                message: `不支持${ExtensionName}文件上传`,
                showClose: true
              });
              return false;
            }
          }
        }
      }

    },
    handleSuccess(res, file) {
      if (res.code === "200" && res.ok) {
        console.log('success')
        this.$emit("onUploadSuccess", file);
      }
    }
  }
};
</script>


