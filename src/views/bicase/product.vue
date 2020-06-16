<template>
  <div class="chart-container">
    <div :id="id" ref="myEchart" :class="className" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import resize from '@/components/chart/mixins/resize'
import echarts from 'echarts'
import { getProducts } from '@/api/business'

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
      chart: null
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.myEchart)
    this.chart.showLoading()
    getProducts().then(response => {
      this.data = response.data
      this.initChart()
    })
    // this.chinaConfigure();
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        title: {
          text: '互联网公司的产品种类统计',
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 25,
            color: '#404a59'
          }
        },
        legend: {
          orient: 'vertical',
          left: '10%',
          top: '8%'
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        xAxis: {
          type: 'category',
          data: this.data.map(value => value.name),
          axisLabel: {
            interval: 0,
            rotate: '45'
          }
        },
        yAxis: { gridIndex: 0 },
        grid: { top: '50%', bottom: '15%' },
        series: [
          {
            type: 'bar',
            data: this.data
          },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{b}: ({d}%)'
            },
            data: this.data
          }
        ]
      }
      const that = this
      this.chart.on('click', function(event) {
        console.log(event.data.name)
        that.$router.push({ name: 'Graph', params: { object: event.data.name }})
      })
      this.chart.hideLoading()
      this.chart.setOption(option)
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

