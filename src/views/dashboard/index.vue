<template>
  <div class="page-container">
    <!-- <div class="top clearfix">
      <div class="main-div cont-div">
        订单总数：<span>{{ this.num }}</span>
      </div>
      <div class="main-div2 cont-div">
        <p class="main-div2-title">
          <i class="el-icon-bell"></i> 系统消息
          <span class="more">更多>></span>
        </p>
        <div>
          <div></div>
          <div class="main-div2-img">
            <img src="../../assets/images/wuxiaoxi.png" class="img">
          </div>
        </div>
      </div>
      <div class="main-div3 cont-div">
        <div class="main-div3-img">
          <img src="../../assets/images/chahua.png" class="img">
        </div>
        <div class="main-div3-btn">
          <el-button icon="el-icon-shopping-cart-full" plain>指定货订舱</el-button>
          <el-button icon="el-icon-shopping-cart-2" plain>预付货订舱</el-button>
        </div>
      </div>
    </div>
    <div class="bottom clearfix">
      <div class="main2-div">
        <p class="main2-div-title">热门港口</p>
        <div style="padding-top: 20px;">
          <el-row>
          <el-col :span="2" class="col-item-list col-item">青岛港</el-col>
          <el-col :span="2" class="col-item-list col-txt">日本港</el-col>
          <el-col :span="2" class="col-item-list col-item">万船港</el-col>
          <el-col :span="2" class="col-item-list col-txt">青岛大港</el-col>
          <el-col :span="2" class="col-item-list col-item">厦门</el-col>
          <el-col :span="2" class="col-item-list col-txt">巴生港</el-col>
          <el-col :span="2" class="col-item-list col-item">杰贝阿里</el-col>
          <el-col :span="2" class="col-item-list col-txt">高雄</el-col>
          <el-col :span="2" class="col-item-list col-item">宁波</el-col>
          <el-col :span="2" class="col-item-list col-txt">上海</el-col>
          <el-col :span="2" class="col-item-list col-item">拉斯佩齐亚港</el-col>
          <el-col :span="2" class="col-item-list col-txt">富查伊拉</el-col>
        </el-row>
        </div>
      </div>
      <div class="main2-div2">
        <p class="main2-div2-title">
          <i class="el-icon-bell"></i> 待办事项
          <span class="more2">更多>></span>
        </p>
      </div>
    </div> -->
  </div>
</template>
<script>
import {setCookie, getCookie, delCookie} from 'utils/cookie'

export default {
  name: 'dashboard',
  data() {
    return {
      num: '',
      protList: []
    }
  },
  methods: {
 
  },
  created() {
   
  }
}
</script>
<style lang="scss">
.page-container{padding: 20px;min-height: 100vh;}
.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
}
.top{margin-bottom: 15px;}
.cont-div{
  box-shadow: 0 2px 5px #ccc;
  height: 306px;
  box-sizing: border-box;
  float: left;
}
.main-div{width: 29%;font-size: 20px;line-height: 70px;color: #676a6c;padding: 0 20px;}
.main-div2{width: 36%;margin-left: 1%;}
.main-div2-title{line-height: 44px;color: #676a6c;font-size: 14px;box-sizing: border-box;padding: 0 20px;border-bottom: 1px solid #cdcccc;}
.more{color: #0060e2;float: right;}
.main-div2-img{text-align: center;padding-top: 50px;}
.main-div3-img{background: #eef5ff;text-align: center;}
.main-div3-btn{margin-top: 37px;text-align: center;}
.main-div3{width: 33%;margin-left: 1%;}
.main2-div{box-shadow: 0 2px 5px #ccc;box-sizing: border-box;float: left;width: 66%;padding: 20px;}
.main2-div2{box-shadow: 0 2px 5px #ccc;box-sizing: border-box;float: left;width: 33%;margin-left: 1%;}
.main2-div-title{font-size: 20px;font-weight: bold;color: #676a6c;margin-bottom: 15px;}
.main2-div2-title{line-height: 44px;color: #fff;font-size: 14px;box-sizing: border-box;padding: 0 20px;border-bottom: 1px solid #cdcccc;background: #0060e2;}
.more2{color: #fff;float: right;}
</style>
