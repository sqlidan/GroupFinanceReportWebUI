<template>
	<div>
        <el-table
            :data="data"
            style="width: 100%"
            stripe>
            <el-table-column
            prop="CONTENT"
            label="标题内容"
            width="180"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="SEND_DATE"
            label="时间"
            width="180"
            show-overflow-tooltip>
                <template slot-scope="scope">
                   {{scope.row.SEND_DATE | parseTime}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="100" label="操作"> 
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.TYPE == 'Private'" class="item" effect="dark" content="标记已读" placement="top-start">
                        <el-button size="mini" icon="el-icon-check" circle @click="handleSetReaded(scope.row.ID)"></el-button>
                    </el-tooltip>
                </template> 
            </el-table-column>
        </el-table>
        <slot></slot>
	</div>
</template>

<script>
export default {
    name: 'MessageTable',
    props: {
        data: {
            type: Array
        },
        option: {
            type: Object
        }
    },
    methods: {
        handleSetReaded (id) {
            this.$store.dispatch('SetReadedById', id).then(() => {});
        },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

