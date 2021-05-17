/**
 * 弹出框Mixin
 */
export const dialogMixin = {
  props: {
    pshow: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    pshow(newValue, oldValue) {
      this.windowShow = newValue
    },
    windowShow(newValue, oldValue) {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields(); //清空
        this.form.id && (this.form.id = '')
      }

      if(!newValue){ 
        this.$emit('update:pshow',false)
      }
   
    }
  },
  data() {
    return {
      loading: false,
      btnLoading: false,
      windowShow: this.pshow, 
    }
  }
}