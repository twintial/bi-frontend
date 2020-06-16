<template>
  <div class="chart-container">
    <div :id="id" ref="myEchart" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/world.js'
import resize from '@/components/chart/mixins/resize'
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
      data: []
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.myEchart)
    this.chart.showLoading()
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
      const option1 = {
        backgroundColor: '#404a59',
        title: {
          text: '各国的互联网企业数量',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: 'rgba(255,255,255, 0.9)'
          }
        },
        dataRange: {
          show: false,
          min: this.data[this.data.length - 1].value,
          max: this.data[0].value,
          text: ['High', 'Low'],
          realtime: true,
          calculable: true,
          color: ['orangered', 'yellow', 'lightskyblue']
        },
        tooltip: {
          formatter: function(params) {
            return params.data.name + ': ' + params.data.value
          }
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
      this.chart.hideLoading()
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
