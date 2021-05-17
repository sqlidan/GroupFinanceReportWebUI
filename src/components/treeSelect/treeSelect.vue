<template>
    <div class="chsEqp" @click="treeShow">
        <!-- <input type="text" class="textPromt" readonly="readonly" v-show="dataChoosedEquipmentNode.length>0?false:true" :placeholder="'请选择'+placeholderName" style="width:160px;"> -->
        <el-input size="mini" :readonly="true" class="txtPromt" v-show="dataChoosedEquipmentNode.length>0?false:true"  :placeholder="'请选择'+placeholderName"></el-input>
        <div class="chsEqp-select" v-show="dataChoosedEquipmentNode.length==0?false:true">
            <span v-if="dataChoosedEquipmentNode.length > 0" class="chsEqp-select-contextBorder">
                
                <span class="chsEqp-select-contextBorder-content">{{dataChoosedEquipmentNode.length>0?dataChoosedEquipmentNode[0][pTreeDefaultProps.name]:""}}</span>
                <span>&nbsp;</span>
                <!-- <i class="el-icon-close "></i> -->
            </span>
            <span v-show="dataChoosedEquipmentNode.length>1" class="chsEqp-select-numBorder"><span class="chsEqp-select-num">+ {{dataChoosedEquipmentNode.length-1}}</span></span>
        </div>
        <i :class="icoFlag" ></i>
    </div>
</template>
<style lang="scss">
    .chsEqp{
        border-radius: 4px;
        cursor: pointer;
        height:28px;
        width:200px;
        line-height: 28px;
        border: 1px solid #dcdfe6;
        display: inline-block;
        text-align: right;
        padding-right: 10px;
        &:hover{border: 1px solid #409EFF; }
        .txtPromt{
          width:160px;border:0;float: left;line-height: 0px;
          .el-input__inner{border:0;height:26px;line-height: 26px;}
        }
        .textPromt{
 
            -webkit-appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border:0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: #606266;
            display: inline-block;
            height: 26px;
            line-height: 26px;
            outline: 0;
            padding: 0 15px;
            -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            width: 100%;
            &::-webkit-input-placeholder{color:#c9cace;font-size:14px;}
            &::-moz-placeholder{color:#c9cace;font-size:14px;}
            &:-ms-input-placeholder{color:#c9cace;font-size:14px;}
        }
        .chsEqp-select{
            width:100%;
            height:40px;
            line-height: 40px;
            display: inline-block;
            float: left;
            text-align:left;
            .chsEqp-select-contextBorder{
            
                background-color: #f4f4f5;
                border-color: #e9e9eb;
                color: #909399;
                margin: 2px 0 2px 6px;
                height: 20px;
                padding: 0 5px;
                line-height: 19px;
                border-width: 1px;
                border-style: solid;
                border-radius: 4px;
                display: inline-block;
                white-space: nowrap;
                font-size: 10px;
                max-width: 100%;
                .el-icon-close{
                    background-color: #909399;
                    color:#fff;
                    border-radius: 50%;
                    text-align: center;
                    position: relative;
                    cursor: pointer;
                    font-size: 12px;
                    height: 16px;
                    width: 16px;
                    line-height: 16px;
                    vertical-align: middle;
                    }
                .chsEqp-select-contextBorder-content{
                    color: #909399;
                    display: inline-block;
                    float: left;
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .chsEqp-select-numBorder{
                background-color: #f4f4f5;
                border-color: #e9e9eb;
                color: #909399;
                margin: 2px 0 2px 6px;
                height: 20px;
                padding: 0 5px;
                line-height: 19px;
                border-width: 1px;
                border-style: solid;
                border-radius: 4px;
                display: inline-block;
                white-space: nowrap;
                font-size: 10px;
                max-width: 100%;
                .chsEqp-select-num{color: #909399;}
            }
        }
        i{
            color: #C0C4CC;
            margin-top:6px;
        }
    }
</style>
<script>

    export default {
        props:{
            choosedEquipmentNode:{
                type:Array,
                default:function(){
                    return [];
                },
            },
            pTreeDefaultProps:{        //element树组件配置   
                type: Object,
                default: function () {
                    return { 
                        name: 'nodeName',

                    }
                }
            },
            placeholderName:{
                type: String,
                default:""
            }
        },
        
        data(){
            return {
                dataChoosedEquipmentNode:this.choosedEquipmentNode,
                icoFlag:"el-icon-arrow-down",
            }
        },
        watch:{
            choosedEquipmentNode:{
                handler:function(val, oldVal){
                    this.dataChoosedEquipmentNode = val;
                },
                deep:true,
            }
        },
        methods:{
            treeShow(){
                if(this.icoFlag=="el-icon-arrow-down")    //显示树
                {
                    this.$emit("on-treeShow-change",true);
                    this.icoFlag="el-icon-arrow-up";
                }
                else    //不显示树
                {
                    this.$emit("on-treeShow-change",false);
                    this.icoFlag="el-icon-arrow-down";
                }
            },
            iconChange(){
                if(this.icoFlag=="el-icon-arrow-down")    //显示树
                {
                    this.icoFlag="el-icon-arrow-up";
                }
                else    //不显示树
                {
                    this.icoFlag="el-icon-arrow-down";
                }
            }
            
        }
    }
</script>

