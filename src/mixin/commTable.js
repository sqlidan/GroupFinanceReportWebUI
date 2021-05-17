/**
 * 分页变量,分页方法,表格排序,表格序号
 */

export const tableMixin = {
    data: function () {
        return {
            page: {
                currentPage: 1,   //当前页
                pageSize: 50,     //每页显示数
                total: 0,         //列表总数
                pageSelectArr: [10, 30, 50, 100, 200],    //
            },
            table: {
                choosedRow:[],   //复选框选中的节点
                loading:false,   //表格加载状态
                order:{
                    //defaultSort:{prop: 'CreationTime', order: 'descending'},
                    sort:''
                },
                //data: [],
                choosedRowsIndex:[],
            },
            
        }
    },
    methods:{
        getRowKeys(row) {
          return row.id.toString()
        },
        
        //pageSize 改变时会触发
        handleSizeChange(size) {
            this.page.pageSize = size
            this.getTableList()
        },
        //currentPage 改变时会触发
        handleCurrentChange(currentPage) {
            this.page.currentPage = currentPage
            this.getTableList()
        },

        //点击查询按钮之前操作
        onSearchBefore() {
            this.page.currentPage = 1
            this.$refs.table && this.$refs.table.clearSelection()
        },

        //批量删除后查询
        batchDeleteSearch() {
            
            if(this.table.choosedRow.length >= this.page.total%this.page.pageSize) {
                this.page.currentPage = Math.ceil((this.page.total - this.table.choosedRow.length)/this.page.pageSize) || 1
            }
            this.getTableList() 
            if(this.page.total == 0 && this.page.currentPage != 1){
                this.page.currentPage = 1
                this.getTableList() 
            }
            
        },

        //表格计算序号
        countIndex(index) {
            //计算序号，第一页往后接着第一页的累加
            let currentPage = this.page.currentPage-1
            let pageSize = this.page.pageSize
            return currentPage>0?((currentPage*pageSize)+(index+1)):(index+1)
        },

        //表格复选框选择
        onSelectChange(selection){
            
            this.table.choosedRow=selection;
            this.table.choosedRowsIndex = []
            selection.forEach((row,i)=>{
                this.table.choosedRowsIndex.push(row)
            })
        },

        //排序
        sortChange(column, prop, order){
            this.table.order.sort=column.prop ? `${column.prop} ${column.order=='ascending'?'asc':'desc'}` : ''
            this.getTableList()
        },

        //勾选数据行的 Checkbox 时触发的事件
        handleSelectionChange(selection, row) {
          
            this.table.data.forEach((r,i)=>{
                if(r == row){
                   if(this.table.choosedRowsIndex.indexOf(i)==-1){
                        this.table.choosedRowsIndex.push(i)
                    }else{
                        this.table.choosedRowsIndex.splice(this.table.choosedRowsIndex.indexOf(i),1)
                    } 
                }
            })
        },

        //行颜色
        tableRowClassName({row, rowIndex}) {
            
          let color = ''
          this.table.choosedRowsIndex.forEach((choosedRow,i)=>{
            if (row === choosedRow) {
              color =  'selected-row';
            }
          })
          
          return color;
        },
        
        rowColorClass({ row, rowIndex }) {
            if (row.id === "fengexian") {
                return "row-background-black";
            }
            return "";
        },
    }
  }