<!--
<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="这里做知识图谱的查询" type="success">
      <router-view />
    </el-alert>
  </div>
</template>
-->
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px">
      <!--查询类型-->
      <el-form-item label="Query Type">
        <el-select v-model="query_type" placeholder="Select Query Type" @change="onCurrentType" style="width: 180px">
          <el-option label="Single Node Query" value="one"/>
          <el-option label="Two-Node Query" value="two" />
        </el-select>
      </el-form-item>


      <!--查询节点-->
      <el-form-item label="Query Node">
        <el-col :span="8">
          <el-input 
            placeholder="Node One" 
            v-model="node1" 
            class="input-with-select" 
            style="width: 350px">
            <el-select v-model="label1" slot="prepend" placeholder="Label" style='width: 100px'>
            <el-option label="default" value="0"></el-option>
            <el-option label="label1" value="1"></el-option>
            <el-option label="label2" value="2"></el-option>
            <el-option label="label3" value="3"></el-option>
            </el-select>
          </el-input>
        </el-col>

        <el-col :span="7">
          <el-input placeholder="Node Two" v-model="node2" class="input-with-select" style="width: 350px" v-bind:disabled="isdisabledTwo">
            <el-select v-model="label2" slot="prepend" placeholder="Label" style='width: 100px'>
            <el-option label="default" value="0"></el-option>
            <el-option label="label1" value="1"></el-option>
            <el-option label="label2" value="2"></el-option>
            <el-option label="label3" value="3"></el-option>
            </el-select>
          </el-input>
        </el-col>

        <el-col :span="8">
          <el-button icon="el-icon-search" @click="search()" circle></el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="Constraint">
        <el-switch
          v-model="direction"
          active-text="Bidirectional"
          inactive-text="Unidirectional"
          active-value="0"
          inactive-value="1"
          v-bind:disabled="isdisabledTwo"
          style="margin-right:40px"
          ></el-switch>

        <span style="font-size: 14px; color: #303133"><strong>Hop Limit：</strong></span>
        <el-input v-model="num" size="medium" type="number" style="margin-left:5px; width: 80px" v-bind:disabled="isdisabledTwo"/>

      </el-form-item>




    </el-form>
  </div>
</template>


<script>
import { searchOne, searchTwo } from '@/api/search'

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        
      
      },
      node1:'',
      node2: '',
      label1:'',
      label2:'',
      direction: true,
      query_type:'',
      isdisabledTwo:false,
      num:1
    }
  },

  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    onCurrentType(){
      console.log("change type")
      if(this.query_type == 'one'){
        this.isdisabledTwo = true
      }else{
        this.isdisabledTwo = false
      }
    },

    search(){
      this.$message({
        message: this.node1 + ' and ' + this.node2 + ' and ' + this.query_type + ' and ' + this.direction,
      })

      // 单节点查询
      if(this.query_type == 'one'){
        console.log(1)
        searchOne(this.node1).then( response => {
          console.log(response)
        })

      // 双节点查询
      }else if (this.query_type == 'two'){
        console.log(2)
        searchTwo({node1:this.node1, node2:this.node2, nlinks:1}).then( response => {
          console.log(response)
        })

      // 未选择类型
      }else{
        this.$message({
          message: 'Select the query type, please!',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

<style>
  /*.el-select .el-input {
    width: 100px;
  }*/
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }



</style>

