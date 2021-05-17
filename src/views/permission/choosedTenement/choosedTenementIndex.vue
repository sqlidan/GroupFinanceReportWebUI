<template>
  <div class="chsT">
    <div class="chsT-bg">
    </div>
    <el-card shadow="always" v-for="item in tenementList" :key="item.tenantId" @click="choosedTenement(item.tenantId)">
      <div class="chsT-item-img"></div>
      <span>{{item.tenantName}}</span>
    </el-card>
    <!-- <el-card shadow="always">
      <div class="chsT-item-img"></div>
      <span>陆海国际物流有限公司</span>
    </el-card>
    <el-card shadow="always">
      <div class="chsT-item-img"></div>
      <span>联合船代有限公司</span>
    </el-card> -->
  </div>
</template>
<style lang="scss">
.chsT{
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: center;

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
  .el-card{
    margin-left:30px;
    
    .el-card__body{
      width: 279px;
      height: 400px;
      background: #b6bac1;
      
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
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
export default {
  data() {
    return {
      tenementList: []
    }
  },
  methods: {
    choosedTenement(tenantId) {
      singleLogIn({lH_LinkCode: this.$route.query.code, tenantId: tenantId, returnUrl: this.$route.query.redirect_uri}).then(res => {
        console.log('登进响应',res)
      })
    }
  },
  created() {
    //,
    
    getTenantByUserCode({lH_LinkCode: this.$route.query.code}).then(res => {
      this.tenementList = res.result
      if(res.result.length == 0)
        window.location.href = process.env.LOGOUT_URL

      if(res.result.length === 1) {
        singleLogIn({lH_LinkCode: this.$route.query.code, tenantId: res.data[0].tenantId, returnUrl: this.$route.query.redirect_uri}).then(res => {
          console.log('登进响应',res)
        })
      }




        // if (res.data && res.data.redirectUri && res.data.token) {
        //     // localStorage.setItem(process.env.LOCAL_STORAGE_TOKEN_KEY || '', res.data.token);
        //     // this.$store.commit('SET_USERIFNO', res.data.userInfo);
        //     // this.$store.commit('DEL_ALL_TAG');
        //     // this.$store.commit('CLEAR_LOCK');
        //     window.location.href = res.data.redirectUri;
        // }
        // else {
        //   
        // }
    });
  },
}
</script>