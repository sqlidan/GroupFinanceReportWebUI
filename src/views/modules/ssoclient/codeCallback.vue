<template>
  <div class="chsT">
    <div class="chsT-bg" v-if="tenementList.length > 1">
    </div>
    <div class="chsT-cen" v-if="tenementList.length > 1">
      <el-card shadow="always" v-for="item in tenementList" :key="item.tenantId">
        <div class="el-card-item" style="width:100%;height:100%;"  @click="choosedTenement(item.comCode,item.tenantId)">
          <div class="chsT-item-img"></div>
          <span>{{item.tenantName}}</span>
        </div>
        
      </el-card>
    </div>
  </div>
</template>
<style lang="scss">
.chsT{
  width:100%;
  height:100%;
  

  .chsT-bg{
    background: url('../../../assets/images/bg2.jpg');
    width:100%;
    height:100%;
    position:absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    -webkit-filter: blur(15px);
    -moz-filter: blur(15px);
    -o-filter: blur(15px);
    -ms-filter: blur(15px);
    filter: blur(15px);
    z-index: -1;
  }
  .chsT-cen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-card{
    margin-left:30px;
    
    .el-card__body{
      width: 279px;
      height: 400px;
      background: #b6bac1;
      
      
      cursor: pointer;
      .el-card-item{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .chsT-item-img{
        width:150px;height:150px; border-radius: 50%;
        background: url('../../../assets/bg.jpg');
      }
      span{
        font-size:20px;
        font-weight: 600;
        margin-top:50px;
      }
      &:hover {
        height: 450px;
      }
    }
  }
  
}
</style>
<script>
import { singleLogIn,getTenantByUserCode } from "api/modules/ssoclient/index";
import {setCookie, getCookie, delCookie} from 'utils/cookie'
import {socketClient} from 'utils/commSocketIO'

export default {
  data() {
    return {
      tenementList: []
    }
  },
  methods: {
    choosedTenement(comCode, tenantId) {
      setCookie("Abp.TenantId", tenantId, 360);
      singleLogIn({comCode, tenantId, returnUrl: this.$route.query.redirect_uri}).then(res1 => {
        localStorage.setItem(process.env.LOCAL_STORAGE_TOKEN_KEY || '', res1.result.accessToken);
        setCookie("Abp.AuthToken", res1.result.accessToken, 360);
        setCookie("Abp.userName", res1.result.userRealName, 360);
        setCookie("Abp.userId", res1.result.userId, 360);
        setCookie("Abp.gsWorkNo", res1.result.gsWorkNo, 360);
        setCookie("Abp.jtWorkNo", res1.result.jtWorkNo, 360);
        this.$store.dispatch('setUser',res1.result)
        //socketClient.connect(`ws://10.135.123.51:3000?token=${res1.result.gsWorkNo}`)
        this.$router.push({path: 'dashboard'});
      })
    },
    async loginIn() {
      let res = await getTenantByUserCode({lH_LinkCode: this.$route.query.code,url:this.$route.query.redirect_uri})
    
      this.tenementList = res.result
     
      if(res.result.length === 1) {
        
        setCookie("Abp.TenantId", res.result[0].tenantId, 360);
        let res1 = await singleLogIn({comCode: res.result[0].comCode, tenantId: res.result[0].tenantId, returnUrl: this.$route.query.redirect_uri})
        if(res1.success) {
          localStorage.setItem(process.env.LOCAL_STORAGE_TOKEN_KEY || '', res1.result.accessToken);
          setCookie("Abp.AuthToken", res1.result.accessToken, 360);
          setCookie("Abp.userName", res1.result.userRealName, 360);
          setCookie("Abp.userId", res1.result.userId, 360);
          setCookie("Abp.gsWorkNo", res1.result.gsWorkNo, 360);
          setCookie("Abp.jtWorkNo", res1.result.jtWorkNo, 360);
          this.$store.dispatch('setUser',res1.result)
          
          //socketClient.connect(`ws://10.135.123.51:3000?token=${res1.result.gsWorkNo}`)
          this.$router.push({path: 'dashboard'});
        }
        
      }
      else if(res.result.length > 1) {
        
      }
      else {
        window.location.href = process.env.LOGOUT_URL
      }
    }
  },
    created() {
      console.log(this.$route.query.code)
      //window.location.href = process.env.LOGOUT_URL
      //return
      
      this.loginIn()
        // getTenantByUserCode({lH_LinkCode: this.$route.query.code,url:this.$route.query.redirect_uri}).then(res => {
        //   debugger
        //   if(res.result.length == 0)
        //     window.location.href = process.env.LOGOUT_URL
        //   this.tenementList = res.result
        //   if(res.result.length === 1) {
        //     singleLogIn({comCode: this.$route.query.code, tenantId: res.data[0].tenantId, returnUrl: this.$route.query.redirect_uri}).then(res1 => {
        //       debugger
        //       this.$store.commit('CLEAN_VIEW')
        //       console.log(res1)
        //       localStorage.setItem(process.env.LOCAL_STORAGE_TOKEN_KEY || '', res1.data.accessToken);
        //       setCookie("Abp.TenantId", res.result[0].tenantId, 360);
        //       setCookie("Abp.AuthToken", res1.data.accessToken, 360);
        //       this.$router.push({path: 'dashboard'});
        //     })
        //   }
        //   else if(res.result.length > 1) {
           
        //   }




        //     // if (res.data && res.data.redirectUri && res.data.token) {
        //     //     // localStorage.setItem(process.env.LOCAL_STORAGE_TOKEN_KEY || '', res.data.token);
        //     //     // this.$store.commit('SET_USERIFNO', res.data.userInfo);
        //     //     // this.$store.commit('DEL_ALL_TAG');
        //     //     // this.$store.commit('CLEAR_LOCK');
        //     //     window.location.href = res.data.redirectUri;
        //     // }
        //     // else {
        //     //   
        //     // }
        // }).catch(err=>{
        //   window.location.href = process.env.LOGOUT_URL
        // })
    },
}
</script>




