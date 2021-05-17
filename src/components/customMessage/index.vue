<template>
  <div class="customMessage">
    <el-dialog
        :title="pTitle"
        v-dialogDrag
        :visible.sync="windowShow"
        width="700px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
      <el-scrollbar class="page-component__scroll">
        <div style="color: #9e2323;line-height: 25px;" v-html="pContentResult"></div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.customMessage{
  .el-card__body{padding: 5px 8px;}
  .el-dialog__body{height:400px;padding:0 10px 10px 10px;}
  .el-dialog__header{padding:10px;}
}
</style>
<script>
export default {
  name: 'customMessage',
  props: {
    pshow: {
      type: Boolean,
      default: false
    },
    pTitle: {
      type: String,
      default: '校验结果'
    },
    pContentResult:{
      type: String,
      default: ''
    }
  },
  watch: {
    pshow(newValue, oldValue) {
      this.windowShow = newValue
    },
    windowShow(newValue, oldValue) {
      if(!newValue){ 
        this.$emit('update:pshow',false)
      }
    },
  },
  data() {
    return {
      windowShow: this.pshow,
      contentResult: ''
    }
  }
}
</script>    