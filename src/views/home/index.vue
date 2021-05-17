<template>
  <div class="page-container">
    <div style="margin-bottom: 15px;">
      <el-row class="echarts-div">
        <div id="chart_example"></div>
      </el-row>
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="12" >
          <div class="echarts-div" id="chart_pie"></div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="echarts-div" id="chart_pie2"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name:'home',
  data() {
    return {}
  },
  mounted() {
    this.lineEchart();
    this.pieEchart();
    this.pieEchart2();
  },
  methods: {
    // 折线图
    lineEchart() {
      let myChart = echarts.init(document.getElementById('chart_example'));
      let option = {
               title: {
          text: ''
        },
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['订舱量', '业务量申请表']
        },
        series: [{
          name: '订舱量', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: [120, 232, 201, 134, 390, 430, 200],
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '业务量申请表',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: [99, 56, 101, 234, 120, 330, 70],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
    }
    myChart.setOption(option, true);
    },
    // 饼状图
    pieEchart() {
      let myChartPie = echarts.init(document.getElementById('chart_pie'));
      let optionPie = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['船期查询', '整拼运价查询', '出口拼箱运价查询']
        },
        series: [
          {
            name: '检验订单地域分布',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '船期查询' },
              { value: 240, name: '整拼运价查询' },
              { value: 149, name: '出口拼箱运价查询' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      }
    myChartPie.setOption(optionPie, true);
    },
    // 饼状图2
    pieEchart2() {
      let myChartPie2 = echarts.init(document.getElementById('chart_pie2'));
      let optionPie2 = {
tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: [
            { name: '订舱量', max: 10000 },
            { name: '业务量', max: 20000 },
            { name: '港口', max: 20000 },
            { name: '整箱', max: 20000 },
            { name: '拼箱', max: 20000 },
            { name: '出口', max: 20000 }
          ]
        },
        legend: {
          left: 'center',
          bottom: '0',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: '一月'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: '二月'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: '三月'
            },
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: '四月'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: '五月'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: '六月'
            },
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: '七月'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: '八月'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: '九月'
            },
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000],
              name: '十月'
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: '十一月'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: '十二月'
            }
          ],
          animationDuration: 2800
        }]
      }
    myChartPie2.setOption(optionPie2, true);
    },
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
.echarts-div{
    box-shadow: 0 2px 5px #ccc;
}
  #chart_example{
    width: 100%;
    height: 350px;
  }
  #chart_pie{
    width: 100%;
    height: 300px;
  }
  #chart_pie2{
    width: 100%;
    height: 300px;
  }
</style>