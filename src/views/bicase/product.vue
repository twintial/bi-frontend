<template>
  <div class="chart-container">
    <div :id="id" ref="myEchart" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/world.js'
import resize from '@/views/bicase/mixins/resize'
import { getFoundation } from '@/api/business'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      data: [],
      title: '图表',
      placeholder: '用户名/电话',
      find: '2', // 1显示新增按钮，2显示导入按钮，若不显示这两个按钮可以写0或者不写值
      chart: null
    }
  },
  mounted() {
    getFoundation().then(response => {
      this.data = response.data
      this.initChart()
    })
    // this.chinaConfigure();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.myEchart)
      // window.onresize = echarts.init(this.$refs.myEchart).resize
      // 把配置和数据放这里
      var data = [{
        'time': 2020,
        'data': [{
          'name': '美国',
          'value': [1025000, 31.222, '美国']
        },
        {
          'name': '俄国',
          'value': [433412, 13.202, '俄国']
        },
        {
          'name': 'Japan',
          'value': [209071, 6.369, '日本']
        },
        {
          'name': 'Germany',
          'value': [208867, 6.362, '德国']
        },
        {
          'name': 'France',
          'value': [146982, 4.477, '法国']
        },
        {
          'name': 'United Kingdom',
          'value': [124970, 3.807, '英国']
        },
        {
          'name': 'Italy',
          'value': [109260, 3.328, '意大利']
        },
        {
          'name': 'China',
          'value': [91506, 2.787, '中国']
        },
        {
          'name': 'Canada',
          'value': [86303, 2.629, '加拿大']
        },
        {
          'name': 'India',
          'value': [61470, 1.873, '印度']
        }
        ]
      }]

      var option = {
        baseOption: {
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'quinticInOut',
          timeline: {
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true,
            inverse: true,
            playInterval: 5000,
            left: null,
            right: 5,
            top: 20,
            bottom: 20,
            width: 46,
            height: null,
            label: {
              normal: {
                textStyle: {
                  color: '#ddd'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbol: 'none',
            lineStyle: {
              color: '#555'
            },
            checkpointStyle: {
              color: '#bbb',
              borderColor: '#777',
              borderWidth: 1
            },
            controlStyle: {
              showNextBtn: false,
              showPrevBtn: false,
              normal: {
                color: '#666',
                borderColor: '#666'
              },
              emphasis: {
                color: '#aaa',
                borderColor: '#aaa'
              }
            },
            data: data.map(function(ele) {
              return ele.time
            })
          },
          backgroundColor: '#404a59',
          title: {
            text: '互动营销中心全球用户',
            subtext: '单位:人',
            left: 'center',
            top: 'top',
            textStyle: {
              fontSize: 25,
              color: 'rgba(255,255,255, 0.9)'
            }
          },
          // tooltip: {
          //   formatter: function(params) {
          //     if (i in params.data) {
          //       return params.data.value[2] + ': ' + params.data.value[0]
          //     }
          //   }
          // },
          grid: {
            left: '12%',
            right: '45%',
            top: '70%',
            bottom: 20
          },
          xAxis: {},
          yAxis: {},
          // 地图，饼图，直方图
          series: [
            {
              id: 'map',
              type: 'map',
              mapType: 'world',
              top: '10%',
              bottom: '25%',
              left: 10,
              itemStyle: {
                normal: {
                  areaColor: '#323c48',
                  borderColor: '#404a59'
                },
                emphasis: {
                  label: {
                    show: true
                  },
                  areaColor: 'rgba(255,255,255, 0.5)'
                }
              },
              data: []
            },
            {
              id: 'bar',
              type: 'bar',
              tooltip: {
                show: false
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: '#ddd'
                  }
                }
              },
              data: []
            },
            {
              id: 'pie',
              type: 'pie',
              radius: ['8%', '20%'],
              center: ['75%', '85%'],
              roseType: 'radius',
              tooltip: {
                formatter: '{b} {d}%'
              },
              data: [],
              label: {
                normal: {
                  textStyle: {
                    color: '#ddd'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: '#ddd'
                  }
                }
              },
              itemStyle: {
                normal: {
                  borderColor: 'rgba(0,0,0,0.3)',
                  borderSize: 1
                }
              }
            }
          ]
        },
        options: []
      }

      // for (var i = 0; i < data.length; i++) {
      //   // 计算其余国家GDP
      //   var restPercent = 100
      //   var restValue = 0
      //   data[i].data.forEach(function(ele) {
      //     restPercent = restPercent - ele.value[1]
      //   })
      //   restValue = data[i].data[0].value[0] * (restPercent / data[i].data[0].value[1])
      //   console.log(restPercent)
      //   console.log(restValue)
      //   option.options.push({
      //     visualMap: [{
      //       dimension: 0,
      //       left: 10,
      //       itemWidth: 12,
      //       min: data[i].data[9].value[0],
      //       max: data[i].data[0].value[0],
      //       text: ['High', 'Low'],
      //       textStyle: {
      //         color: '#ddd'
      //       },
      //       inRange: {
      //         color: ['lightskyblue', 'yellow', 'orangered', 'red']
      //       }
      //     }],
      //     xAxis: {
      //       type: 'value',
      //       boundaryGap: [0, 0.1],
      //       axisLabel: {
      //         show: false
      //       }
      //     },
      //     yAxis: {
      //       type: 'category',
      //       axisLabel: {
      //         textStyle: {
      //           color: '#ddd'
      //         }
      //       },
      //       data: data[i].data.map(function(ele) {
      //         return ele.value[2]
      //       }).reverse()
      //     },
      //     series: [
      //       {
      //         id: 'map',
      //         data: data[i].data
      //       },
      //       {
      //         id: 'bar',
      //         data: data[i].data.map(function(ele) {
      //           return ele.value[0]
      //         }).sort(function(a, b) {
      //           return a > b
      //         })
      //       },
      //       {
      //         id: 'pie',
      //         data: data[i].data.map(function(ele) {
      //           return {
      //             name: ele.value[2],
      //             value: ele.value
      //           }
      //         }).concat({
      //           name: '其他国家',
      //           value: restValue
      //         })
      //       }
      //     ]
      //   })
      // }

      const option1 = {
        backgroundColor: '#404a59',
        title: {
          text: '互动营销中心全球用户',
          subtext: '单位:人',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: 'rgba(255,255,255, 0.9)'
          }
        },
        dataRange: {
          show: false,
          min: 0,
          max: 1000000,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        tooltip: {
          trigger: 'item'
        },
        geo: {
          map: 'world',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: false,
          silent: true
        },
        series: [
          {
            type: 'map',
            mapType: 'world',
            // zoom: 1.2,
            mapLocation: {
              y: 100
            },
            data: this.data,
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
              },
              emphasis: {
                label: {
                  show: true
                },
                areaColor: 'rgba(255,255,255, 0.5)'
              }
            }
          }
        ]
      }
      this.chart.setOption(option1)
    }
  }
}
</script>

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh);
  }
</style>
