<template>
    <div class="templateTree playBill-equ-tree-loading" 
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-background='rgba(255, 255, 255, 0.7)'
    id="equTree" :class="{ hidd: showStyle }">
        <el-scrollbar class="page-component__scroll">
            
            <div class="templateTree-search">
            
                <el-input size="mini" placeholder="请输入关键字" @input="onSearchNode" v-model="searchTreeNode">
                    <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="onSearchNode"></i>
                </el-input>
           
            </div>
            <div class="templateTree-tree">
                <el-tree :data="pTreeData" :show-checkbox="pShowCheckbox" :node-key="pTreeDefaultProps.uuid" ref="tree" 
                :expand-on-click-node="pDisableClickNodeExpend"
                :check-strictly="pCheckStrictly"
                :render-content="renderContent" 
                :filter-node-method="filterNode" 
                :props="pTreeDefaultProps" 
                @check-change="handleClick" 
                @check="onNodeChick"
                @node-click="onNodeClick">
                </el-tree>
            </div>
        </el-scrollbar>
    </div>
</template>
<style lang="scss">
.hidd{display: none;}
    .templateTree{
      .el-tree{font-size: inherit !important;}
      
        //margin-top:10px;
        //width:218px;
        //height:400px;
        width:100%;
        height:100%;
        border:1px solid #eee;
        padding:10px 10px;
        background-color: #fff;
        .el-radio-button__inner{padding:5px 15px;border-radius:0;}
        .el-radio-group{display: block;}
        .tree-message{color:blue;margin-left:10px}
        .el-scrollbar__wrap{overflow: scroll !important;   overflow-x: hidden  !important; }
        .el-input__inner{
            border-color:#dcdfe6 !important;
        }
        .divClassify{
            border:1px solid #4c658e;
            height:24px;
            width:182px;
            div{
                width:60px;
                height:24px;
                line-height: 24px;
                text-align: center;
                float: left;
                cursor: pointer;
                &:nth-child(1){border-right: 1px solid #4c658e; }
                &:nth-child(2){border-right: 1px solid #4c658e;}
            }
            
        }
        .templateTree-search{
            margin-top:10px;width:100%;line-height:0px;
            .el-input__inner{height: 30px;line-height: 30px;}
            .el-input__icon{line-height:normal;}
        }
        .templateTree-tree{
            margin-top:10px;
            width:100%;
        }
    }
</style>
<script>
    export default {
        props:{
            pChoosedNode:{//树回显节点ID
                type : Array,
                default: function () {
                    return []
                }
            },        
            pTreeDefaultProps:{         //element树组件配置     
                type: Object,
                default: function () {
                    return { 
                        children: 'children',
                        label: 'nodeName',
                        id:'nodeId',
                        pid:'nodePid',
                        uuid:'nodeUUid',
                        disabled:'disabled',
                        message:'message'
                    }
                }
            },
            pTreeData:{     //树data
                type : Array,
                default: function () {
                    return []
                }
            },
            pShowCheckbox: {    //树是否可选择   
                type:Boolean,
                default:true
            },    
            pDisableClickNodeExpend: {    //是否禁用单击节点展开或收缩节点   
                type:Boolean,
                default:true
            },   
            pCheckStrictly: {    //父子节点复选框是否不关联  
                type:Boolean,
                default:false
            },    
            radio:{             //是否单选
                type:Boolean,
                default:false
            },

        },
        data(){
            return{
                choosedNodeIDs:[],           //选中节点IDs
                showStyle:false,             //树组件是否显示
       
                searchTreeNode:'',           //搜索树文本
                loading:false,
                searchedNode:[],
            }
        },
        
        watch:{
            pChoosedNode:{
                // immediate:true,
                handler:function(newValue, oldValue){
                    //回显
                    this.showTreeChoosedNode()
                }
            },
        },
        methods:{
            
            onSearchNode(){
                this.searchedNode=[]
                this.$refs.tree.filter(this.searchTreeNode);
                //
                this.setParentDisplayed([...new Set(this.searchedNode)])

                //
                for(let j in this.pTreeData){
                    this.getChildrenNode1(this.pTreeData[j],[...new Set(this.searchedNode)]);
                    
                }
            },
            //树搜索节点
            filterNode(value, data) {

                if(this.pCheckStrictly){  //复选框父子不关联情况正常查询
                    if (!value) return true;
                        return data[this.pTreeDefaultProps.label].indexOf(value) !== -1;
                }

                if (!value) {
                    data.disabled=false;
                    return true;
                }
                if(data[this.pTreeDefaultProps.label]==undefined)
                    {return false;}
                if(data[this.pTreeDefaultProps.label].indexOf(value) !== -1){
                    this.searchedNode.push(data[this.pTreeDefaultProps.pid])
                    data.disabled=false;
                    return true;
                }
                else
                {
                    data.disabled=true;
                    return false;
                }
                
                
            },

            /**获取搜索节点和搜索节点父节点
            * @param searchedNode 搜索的节点
            */
            setParentDisplayed(searchedNode){
                let _this = this
                let aaa=[]
                if(searchedNode.length==0)
                    return;
                // if(searchedNode.includes('-1')||searchedNode.includes('0'))
                //     return;
                if(searchedNode.includes('-1'))
                    searchedNode.splice(searchedNode.indexOf('-1'),1)
                if(searchedNode.includes('0'))
                    searchedNode.splice(searchedNode.indexOf('0'),1)
                searchedNode.forEach(item=>{
                    
                    let node = this.$refs.tree.getNode(item)
                    if(node!=null){
                        aaa.push(node.data[_this.pTreeDefaultProps.pid])
                        this.searchedNode.push(node.data[_this.pTreeDefaultProps.pid])
                    }
                })
                this.setParentDisplayed([...new Set(aaa)])
            },

            /** 递归node参数节点下的searchedNode节点，设置disabled=false
            *@param node 父节点
            *@param searchedNode 搜索的节点和搜索的节点的父级
            */
            getChildrenNode1(node,searchedNode){
                let _this = this
                if(searchedNode.includes(node[_this.pTreeDefaultProps.uuid]))
                    node.disabled=false
                node.children.forEach((item, index)=>{
                    if(item.children==undefined)  //叶子节点
                    {
                        if(searchedNode.indexOf(item[_this.pTreeDefaultProps.uuid].toString())>-1)
                            item.disabled=false;
                    }
                    else
                    {
                        // if(searchedNode.indexOf(item[_this.pTreeDefaultProps.uuid].toString())>-1)
                        //     item.disabled=false;
                        this.getChildrenNode1(item,searchedNode);
                    }
                })
            },


            //禁用单击
            disableNodeById(nodeId){
                for(let item of this.pTreeData){
                    if(item.nodeId == nodeId)
                    {
                        item.disabled = true
                        item.children.map(item=>item.disabled = true)
                    }
                }
            },
            
            //点击节点事件
            onNodeClick(data){
                this.$emit("on-node-click",data)
            },

            isRadio(data) {
                //如果不是单选返回原数据，否则加disabled
                if (!this.radio) {
                    return data
                }else{
                    data.forEach((item)=>{
                        if (item.children.length>0) {
                            item.disabled = true
                            this.isRadio(item.children)
                        }else{
                            item.disabled = false
                        }
                    })
                    return data
                }
            },

            //回显树节点
            showTreeChoosedNode(){
                if(this.$refs.tree){
                    this.$refs.tree.setCheckedKeys([])
                    if(this.pChoosedNode.length>0)
                    {
                        this.choosedNodeIDs=[];
                         for(let j in this.pTreeData){
                            
                            if(this.pCheckStrictly)//父与子节点不关联时不选中子节点
                            { 
                                  //if(this.pChoosedNode.indexOf(this.pTreeData[j][this.pTreeDefaultProps.id].toString())>-1)                                      
                                        this.choosedNodeIDs.push(this.pTreeData[j][this.pTreeDefaultProps.uuid].toString());
                            }
                            else{
                              this.getChildrenNode(this.pTreeData[j]);
                            }
                        }
                        
                        
                        
                        this.$nextTick(function() {                   
                            this.$refs.tree.setCheckedKeys(this.choosedNodeIDs)
                        })
                       
                    }
                }
            },

            //追加树节点信息
            renderContent(h, { node, data, store }) {
                if(data[this.pTreeDefaultProps.message]){
                    return (
                    <span class="custom-tree-node">
                        <span>{data[this.pTreeDefaultProps.label]}</span>
                        <span class="tree-message"  title={data[this.pTreeDefaultProps.message]}>{data[this.pTreeDefaultProps.message]}</span>
                    </span>);
                }else
                {
                    return (
                    <span class="custom-tree-node">
                        <span>{data[this.pTreeDefaultProps.label]}</span>
                        
                    </span>);
                }
                
                
            },


            //当复选框被点击的时候触发
            onNodeChick(data,nodes){
                this.$emit("on-nodeChange",(this.pCheckStrictly && this.radio) ? this.$refs.tree.getCheckedNodes(false,false) :this.$refs.tree.getCheckedNodes(true,false))
            },

            //节点选中状态发生变化时的回调
            handleClick(data, checked, node){
                if (this.radio&&checked == true) {
                    this.$refs.tree.setCheckedNodes([data]);
                }
            },

            


            //根据节点获取所有子节点(递归)
            getChildrenNode(node){            
                if(this.pChoosedNode.indexOf(node[this.pTreeDefaultProps.id].toString())>-1)
                    this.choosedNodeIDs.push(node[this.pTreeDefaultProps.uuid].toString());
                node.children.forEach((item, index)=>{
                    // if(item.children==undefined||item.children.length==0)  //叶子节点
                    // {
                    //     if(this.pChoosedNode.indexOf(item[this.pTreeDefaultProps.id].toString())>-1)
                    //         this.choosedNodeIDs.push(item[this.pTreeDefaultProps.uuid]);
                    // }
                    // else
                    // {
                    //     this.getChildrenNode(item);
                    // }
                    if(this.pChoosedNode.indexOf(item[this.pTreeDefaultProps.id].toString())>-1)
                        this.choosedNodeIDs.push(item[this.pTreeDefaultProps.uuid]);
                    if(item.children && item.children.length > 0) 
                        this.getChildrenNode(item);
                })
            },
            //区域外点击事件
            handleDocumentClick(e) {
                if (!this.$el.contains(e.target)) 
                {
                    let el = this.$parent.$children.filter(item=>item.$el.className==='chsEqp')
                    if(el.length==0)
                        return
                    if(el[0].$el.contains(e.target))
                        return
                    this.$emit('on-outside-click')
                } 
            },
        },
        mounted() {
            console.log("tree-mounted")
            document.addEventListener('click',this.handleDocumentClick)
        },
        created() {
            //console.log("tree-create")
        },

    }
</script>