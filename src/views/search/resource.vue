<template>
  <div class="app-container">
    <center>
      <div class="filter-container">
        <el-input
          v-model="name"
          placeholder="Input resource"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input
          v-model="label"
          placeholder="Input label"
          style="width: 200px;"
          class="filter-item"
        />
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
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="Name" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <!-- 插入跳转
            <a class="link-type" @click="goTo(row)">{{ row.name }}</a>
          -->
          <router-link :to="{ name: 'Graph', params:{ node: row.name}}">{{ row.name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="Label" min-width="300px" align="center">
        <template slot-scope="{ row }">
          <el-tag>{{ row.label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Uri" min-width="400px" align="center">
        <template slot-scope="{ row }">
          <a class="link-type" :href="row.uri" target="_blank">{{ row.uri }}</a>
        </template>
      </el-table-column>
    </el-table>

    <center>
      <pagination
        v-show="total >= 0"
        :total="total"
        :page.sync="base.page"
        :limit.sync="base.limit"
        @pagination="getList"
      />
    </center>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      name: undefined,
      label: undefined,
      total: 0,
      base: {
        page: 1,
        limit: 10
      },
      listQuery: {
        name: this.name,
        label: this.label
      },
      list: undefined
    }
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.label)
      console.log(this.name)
      this.$axios
        .post(
          'http://localhost:8899/search/resource/' +
            this.base.page +
            '/' +
            this.base.limit,
          {
            name: this.name,
            label: this.label
          }
        )
        .then(response => {
          this.list = response.data.data.results
          this.total = parseInt(response.data.data.total)
          console.log(this.list)
          console.log(this.total)
          this.listLoading = false
        })
    },

    goTo(row) {
      this.list[0].name = row.name
    }
  }
}
</script>
