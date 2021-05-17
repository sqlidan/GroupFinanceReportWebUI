<template>
  <div :class="{'has-logo': true}">
    <div class="sidebar-logo-container">
      <transition name="sidebarLogoFade">
  <!--      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">-->
  <!--        <img src="../../../assets/login/logo.png">-->
  <!--        <h1 v-else class="sidebar-title">{{ title }} </h1>-->
  <!--      </router-link>-->
        <router-link key="expand" class="sidebar-logo-link" to="/">
          <h1 class="sidebar-title">全球捷运经营报表系统</h1>
        </router-link>
      </transition>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sideBar">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
    
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        
      >
        <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
      <!-- background-color="#304156" -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
components: { SidebarItem },
computed: {
  ...mapGetters([
    'permission_routers',
    'sidebar'
  ]),
  isCollapse() {
    return !this.sidebar.opened
  }
},
created(){
}

}
</script>
<style  rel="stylesheet/scss" lang="scss">
.sideBar{
  .el-scrollbar__view{height:100%;}

  height:100%;
  .el-scrollbar__wrap{overflow-x: hidden;}

  .el-menu{height: 100%;}
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
}
</style>