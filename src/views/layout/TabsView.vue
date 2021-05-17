<template>
  <div class='tabs-view-container'>
    <!-- <icon name='收缩' scale='1.3' :toggleClick="toggleSideBar"></icon> &nbsp; -->
    <!-- <span style="cursor:pointer" @click="toIndexPage"><icon name="首页"/></span> -->
    
    <!-- <span style="cursor:pointer"><i style="float: left;font-size:20px;display: block;height: 64px;line-height: 62px;" class="el-icon-s-fold"/></span> -->
    <hamburger :is-active="sidebar.opened" style="padding: 0px 5px 0 0;" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- :is-active="sidebar.opened"  -->
    &nbsp;&nbsp;<el-tag size="small" @click="toIndexPage" style="cursor:pointer">系统首页</el-tag><icon name='竖线'/>
    <el-tag
      v-for="tag in Array.from(visitedViews)"
      :key="tag.path"
      @click="_jump(tag)"
      :closable="true"
      size="small"
      :type="tag.path === $route.path ? 'primary' : 'info' "
      @close='closeViewTabs(tag,$event)'
      style="margin-right:8px;cursor:pointer;">
      {{tag.title}}
    </el-tag>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
   import {setCookie, getCookie, delCookie} from 'utils/cookie'
  import Hamburger from '@/components/Hamburger'
  export default {
    
    computed: {
      ...mapGetters([
        'sidebar',
      ]),
      visitedViews() {
        return this.$store.state.app.visitedViews.slice(-10);
      }
    },
    components: {
      Hamburger
    },
    methods: {
      changeTabsView() {
        location.href = '/dashboard'
      },
      closeViewTabs(view, $event) {
        
        let flag = false;
        this.$store.dispatch('delVisitedViews', view);
        if (this.visitedViews.length > 0) {
          for (let i = 0; i < this.visitedViews.length; i++) {
            if (this.visitedViews[i].name == view.name) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.$router.push({
              path: this.visitedViews[this.visitedViews.length - 1].fullPath
            })
          }
        } else {
          this.$router.push({
            path: '/dashboard'
          })
        }
        $event.preventDefault()
      },
      generateRoute() {
        if (this.$route.name) {
          return this.$route;
        }
        // this.$route.matched[0].path = '/';
        // return this.$route.matched[0];
      },
      toIndexPage() {
        if(getCookie('Abp.SystemUser') === 'true') {
          this.$router.push({
                  path: '/home'
                });
        } else{
          this.$router.push({
                  path: '/dashboard'
                });
        }
      },
      addViewTabs() {
        let flag = false;
        for (let i = 0; i < this.visitedViews.length; i++) {
          if (this.visitedViews[i].name == this.generateRoute().name) {
            if(this.visitedViews[i].path == this.generateRoute().path && this.visitedViews[i].fullPath != this.generateRoute().fullPath){
              this.$store.dispatch('delVisitedViews', this.visitedViews[i]);
              flag = false;
              break;
            }
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.$store.dispatch('addVisitedViews', this.generateRoute())
        }
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      _jump(tag) {
        if (JSON.stringify(tag.aoe) === '{}') {
          this.$router.push({
            path: tag.fullPath,
            query:tag.query,
          })
        }else{
          this.$router.push({
            name: tag.name,
            params: tag.aoe
          })
        }
        
      },
    },
    watch: {
      $route: {
        handler(newName, oldName) {
          this.addViewTabs()
        },
        immediate: true
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 15px;

      .hamburger-container {
        line-height: 60px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color:transparent;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }

    .tabs-view {
      margin-left: 10px;

      span {
        margin: 10px 0;
        background-color: white;
        color: black;
        border: white solid 1px;
      }
    }

    .router-link-active {
      span {
        margin: 10px 0;
        background-color: rgba(64, 158, 255, 0.1);
        color: #409EFF;
        border: rgba(64, 158, 255, 0.1) solid 1px;
      }
    }
  }


</style>
