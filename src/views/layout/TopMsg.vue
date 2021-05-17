<template>
  <el-popover placement="bottom"
              width="500"
              trigger="hover">
    <meesage-table :data="msgs"
               :option="option"></meesage-table>
    <router-link class="top-mag__menu"
                 :to="{path:'/ucenter/message'}">
      <el-button type="text"
                 size="mini">查看全部</el-button>
    </router-link>
    <div slot="reference"
         class="top-bar__item top-bar__item--show">
      <el-badge :value="(msgs != null && msgs.length>0)?msgs.length:''" :max="99">
        <i class=" el-icon-bell" style="font-size:18px;"></i>
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import MeesageTable from "./MessageTable";
export default {
  name: "top-mag",
  components: {
      MeesageTable
  },
  computed: { 
      ...mapGetters([
          'msgs',
      ])
  },
  created () {
    window.jj=this;
  },
  data () {
    return {
      data: [
        {
          title: '你好新朋友，感谢使用 avue-cli',
          date: '2018-11-23'
        }, {
          title: 'smallwei发来一条私信',
          date: '2018-11-23'
        }],
      option: {
        size: 'mini',
        addBtn: false,
        page: false,
        menu: false,
        header: false,
        column: [{
          width: 200,
          label: '标题内容',
          prop: 'title',
          overHidden: true,
        }, {
          label: '时间',
          prop: 'date'
        }]
      }
    }
  }

}
</script>

<style lang="scss">
.top-mag {
  &__menu {
    float: right;
  }
}
.el-badge {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>