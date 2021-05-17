<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <!-- <div class="flex-left">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <router-link to="/">首页</router-link>
      </div> -->
      <div class="flex-left">
        <tabs-view ref="tabsView"></tabs-view>
      </div>
      <div class="flex-right">
        <el-dropdown class="avatar-container" trigger="click" style="margin-right:55px" >
          <div class="avatar-wrapper">
            <icon name="icon_service" scale="1.4"/>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
            <el-dropdown-item><span @click="onupdatePasswordComp()" style="display:block;">修改密码</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <update-password ref="updatePasswordComp" :pshow.sync="updatePasswordComp.show"  @on-save-success="onSaveSuccess"></update-password>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex';
  // import Levelbar from './Levelbar';
  import TabsView from './TabsView';
  // import topMsg from "./TopMsg";

  import Screenfull from 'components/Screenfull';
  import ErrorLog from 'components/ErrLog';
  import errLogStore from 'store/errLog';
  import todoList from 'components/TodoList';
  import updatePassword from './updatePassword'
  import {LogOut} from 'api/user/tenant'
  export default {
    components: {
//      Levelbar,
      TabsView,
      ErrorLog,
      Screenfull,
      todoList,
      updatePassword
     // topMsg
    },
    inject:['reload'],
    data() {
      return {
        log: errLogStore.state.errLog,
        tenants: [],
        updatePasswordComp: {
                show: false
            }
      }
    },
    created() {

    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut')
          .then(() => {
            //console.log(getToken)
            LogOut().then(res => {
            })
            //location.reload(); // 为了重新实例化vue-router对象 避免bug
            this.$store.commit('CLEAN_VIEW')
            window.location.href = process.env.LOGOUT_URL
            location.reload();
            //this.$router.push({ path: '/login' })
            
          });
      },
         //显示详情页面
    onupdatePasswordComp() {
      this.updatePasswordComp.show = true;
    },
      //修改密码成功
        onSaveSuccess(){
            this.logout()
        },
      //切换租户
      tenantChange(tenant) {
        tenantChange(tenant.id).then(res => {
          if(res.ok) {
            this.$notify({
              title: '租户切换成功',
              message: '您已成功切换到' + tenant.name,
              type: 'success',
              duration: 2000
            });
            //setToken(res.data);
            listByToken(res.data).then(res => {
              this.tenants = res.returndata;
            });

            //this.reload();
            this.$refs.tabsView.changeTabsView();
          }else {
            this.$notify({
              title: '租户切换失败',
              message: res.msg,
              type: 'error',
              duration: 2000
            });
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar-menus {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
  }

  .navbar {
    height: 64px;
    line-height: 64px;
    border-radius: 0 !important;
    outline: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 4px #a3a3a3;

    .flex-left {
      display: flex;
      align-items: center;
      outline: 0;

      .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
      }
    }

    .flex-right {
      outline: 0;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .errLog-container {
        display: block;
        // position: absolute;
        right: 170px;
      }

      .screenfull {
        position: relative;
        display: block;
        right: 124px;
        color: red;
      }

      .top-item {
        display: block;
        right: 150px;
      }

      .todo-container {
        height: 64px;
        display: block;
        // position: absolute;
        right: 150px;
      }

      .avatar-container {
        // height: 50px;
        display: block;
        // position: absolute;
        // right: 35px;

        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
