<template>
  <div class="app-container">
    <center>
      <div class="filter-container">
        <el-select slot="prepend" v-model="prep_label" filterable placeholder="Corporation" style="width: 300px">
          <el-option
            v-for="item in prep_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="getList()"
        >
          Search
        </el-button>
      </div>
    </center>

    <br>
    <!-- <div>tween-num: {{ numTween }}</div> -->
    <center id="score" style="display: none">
      <div style="margin-top: 30px">
        <span style="font-family: 'Times New Roman',Times,serif;font-size: 30px;color: #2d7cff">
          SCORE
        </span>
      </div>
      <div class="chartNum">
        <div class="box-item">
          <li
            v-for="(item,index) in orderNum"
            :key="index"
            :class="{'number-item': !isNaN(item), 'mark-item': isNaN(item) }"
          >
            <span v-if="!isNaN(item)">
              <i ref="numberItem">0123456789</i>
            </span>
            <span v-else class="comma">{{ item }}</span>
          </li>
        </div>
      </div>
    </center>
    <br>

    <el-table
      id="service"
      v-loading="listLoading"
      :data="service"
      border
      fit
      highlight-current-row
      style="width: 60%;margin: auto;display: none"
    >
      <el-table-column label="Service" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <div>{{ row }}</div>
        </template>
        <!-- <template slot-scope="{ row }">
          <router-link :to="{ name: 'Graph', params:{ node: row}}">{{ row }}</router-link>
        </template> -->
      </el-table-column>
    </el-table>

    <br>
    <br>

    <el-table
      id="product"
      v-loading="listLoading"
      :data="product"
      border
      fit
      highlight-current-row
      style="width: 60%;margin: auto;display: none"
    >
      <el-table-column label="Product" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <div>{{ row }}</div>
        </template>
        <!-- <template slot-scope="{ row }">
          <router-link :to="{ name: 'Graph', params:{ node: row}}">{{ row }}</router-link>
        </template> -->
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import TWEEN from '@tweenjs/tween.js'
import { getCompany, getDetails } from '@/api/analysis'
// import circleProgressbar from 'vue-circleprogressbar'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      orderNum: ['0', '0', '0'],
      listLoading: false,
      prep_label: undefined,
      prep_options: [],
      service: undefined,
      product: undefined
    }
  },
  mounted: function() {
    getCompany().then(res => {
      console.log('load company')
      for (var item of res.data) {
        this.prep_options.push({ value: item, label: item })
      }
    })
  },
  methods: {

    // 设置文字滚动
    setNumberTransform() {
      const numberItems = this.$refs.numberItem
      const numberArr = this.orderNum.filter(item => !isNaN(item))
      console.log(numberItems)
      for (let index = 0; index < numberItems.length; index++) {
        const elem = numberItems[index]
        elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
      }
    },

    // 处理总订单数字
    toOrderNum(num) {
      num = num.toString()
      if (num.length < 3) {
        num = '0' + num
        this.toOrderNum(num)
      } else if (num.length === 3) {
        this.orderNum = num.split('')
      } else {
        this.$message.warning('总量数字过大')
      }
      this.setNumberTransform()
    },

    getList() {
      document.getElementById('service').style.display = 'block'
      document.getElementById('product').style.display = 'block'
      document.getElementById('score').style.display = 'block'
      this.listLoading = true
      console.log(this.prep_label)
      getDetails(this.prep_label).then(res => {
        console.log('get info')
        this.service = res.data.service
        this.product = res.data.products
        this.num = res.data.score
        this.toOrderNum(this.num)
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped lang='scss'>
   /*订单总量滚动数字设置*/
  .box-item {
    position: relative;
    height: 100px;
    font-size: 54px;
    line-height: 41px;
    text-align: center;
    list-style: none;
    color: #2D7CFF;
    writing-mode: vertical-lr;
    text-orientation: upright;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
  /* 默认逗号设置 */
  .mark-item {
    width: 10px;
    height: 100px;
    margin-right: 5px;
    line-height: 10px;
    font-size: 48px;
    position: relative;
    & > span {
      position: absolute;
      width: 100%;
      bottom: 0;
      writing-mode: vertical-rl;
      text-orientation: upright;
    }
  }
  /*滚动数字设置*/
  .number-item {
    width: 41px;
    height: 75px;
    background: url(/images/text-bg-blue.png) no-repeat center center;
    background-size: 100% 100%;
    list-style: none;
    margin-right: 5px;
    border-radius:4px;
    border:1px solid rgba(221,221,221,1);
    & > span {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 100%;
      height: 100%;
      writing-mode: vertical-rl;
      text-orientation: upright;
      overflow: hidden;
      & > i {
        font-style: normal;
        position: absolute;
        top: 11px;
        left: 50%;
        transform: translate(-50%,0);
        transition: transform 1s ease-in-out;
        letter-spacing: 10px;
      }
    }
  }
  .number-item:last-child {
    margin-right: 0;
  }
</style>
