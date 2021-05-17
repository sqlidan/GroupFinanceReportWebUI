<template>
  <el-select
    size="mini"
    v-model="value"
    :filterable="filterable"
    :placeholder="placeholder"
    style="width:100%"
    :clearable="clearable"
    :disabled="disabled"
    :filter-method="filter"
    v-scroll = "onHandleScroll"
    @change="onChange"
    @clear="onClear"
    @visible-change="onVisibleChange"
  >
    <el-option
      v-for="item in list"
      :key="item[optionValue]"
      :label="item[optionkey]"
      :value="item[optionValue]"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name:'bigDataSelect',
  props: {
    val: {    //下拉框值
      type: String,
      default: ''
    },
    data: {   //数据源
      type: Array,
      default: []
    },
    placeholder: {   //提示信息
      type: String,
      default: '',
    },
    optionkey: {     //下拉列表选项值字段映射
      type:String,
      default: 'id'
    },
    optionValue: {   //下拉列表选项标签字段映射
      type:String,
      default: 'value'
    },
    disabled: {      //禁用状态
      type: Boolean,
      default: false
    },
    clearable: {     //清除状态
      type: Boolean,
      default: true
    },
    filterable: {    //搜索状态
      type: Boolean,
      default: true
    }
  },
  watch: {
    val(newValue, oldValue) {
      if(!this.list.some(item=>item[this.optionValue] === newValue)) {
        let obj = this.data.find(item => item[this.optionValue] === newValue)
        if(obj)
          this.list.unshift(obj)
      }
      this.value = newValue
    },
    data: {
      immediate: true,
      handler:function(newValue, oldValue) {
        
        this.list = newValue.slice(0, 100)
        if(!this.list.some(item=>item[this.optionValue] === this.value)) {
          let obj = this.data.find(item => item[this.optionValue] === this.value)
          if(obj)
            this.list.unshift(obj)
        }
      }
    }
    
  },
  data() {
    return {
      list: [],
      value: this.val,
      page:1,
      filterValue: '',
    }
  },
  methods: {
    onHandleScroll(param) {
      if(this.filterValue)
        return
      this.page++
      this.list = this.data.slice(0,this.page*100)
      if(this.list.filter(item => item[this.optionValue] === this.value).length  == 0) {
        let obj = this.data.find(item => item[this.optionValue] === this.value)
        if(obj)
          this.list.unshift(obj)
      }
    },
    onVisibleChange(val) {
      if(!val) {
        this.filterValue = ''
        this.page = 1
        this.list = this.data.slice(0, 100)
        if(this.list.filter(item => item[this.optionValue] === this.value).length  == 0) {
          let obj = this.data.find(item => item[this.optionValue] === this.value)
          if(obj)
            this.list.unshift(obj)
        }
      }
    },
    onChange(val) {
      this.$emit('update:val', val)
      this.$emit('change', val)
    },
    onClear() {
      this.page = 1
      this.list = this.data.slice(0, 100)
    },
    onblur() {
      if(!this.value) {
        this.page = 1
        this.list = this.data.slice(0, 100)
      }
    },
    filter(value) {
      this.filterValue = value
      if(!value) {
        this.page = 1
        this.list = this.data.slice(0, 100)
        return
      }
      this.list = this.data.filter(item => item[this.optionkey].toUpperCase().includes(value.toUpperCase()))
      
      
    }
  }
}
</script>