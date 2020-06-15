<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px">

      <!--查询类型-->
      <el-form-item label="Query Type">
      <el-col :span="8">
        <el-select v-model="query_type" placeholder="Select Query Type" @change="onCurrentType" style="width: 200px">
          <el-option label="Single Node Query" value="one"/>
          <el-option label="Two-Node Query" value="two" />
        </el-select>
        </el-col>

        <!--谓语限制-->
        <el-col :span="8">
          <el-input 
            placeholder="Predicate Limit" 
            v-model="predicate" 
            class="input-with-select" 
            style="width: 350px">
            <el-select v-model="prep_label" slot="prepend" filterable placeholder="Label" style='width: 100px'>
              <el-option v-for="item in prep_options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-col>

      </el-form-item>


      <!--查询节点-->
      <el-form-item label="Query Node">
        <el-col :span="8">
          <el-input 
            placeholder="Node One" 
            v-model="node1" 
            class="input-with-select" 
            style="width: 350px">
            <el-select v-model="label1" slot="prepend" filterable placeholder="Label" style='width: 100px'>
            <!--<el-option label="default" value="0"></el-option>
            <el-option label="label1" value="1"></el-option>
            <el-option label="label2" value="2"></el-option>
            <el-option label="label3" value="3"></el-option>-->
              <el-option v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-col>

        <el-col :span="7">
          <el-input placeholder="Node Two" v-model="node2" class="input-with-select" style="width: 350px" v-bind:disabled="isdisabledTwo">
            <el-select v-model="label2" slot="prepend" filterable placeholder="Label" style='width: 100px'>
             <el-option v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-input>
        </el-col>

        <el-col :span="8">
          <el-button icon="el-icon-search" @click="search()" circle></el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="Constraint">
        
        <!--单双向限制-->
        <el-switch
          v-model="direction"
          active-text="Bidirectional"
          inactive-text="Unidirectional"
          active-value=false
          inactive-value=true
          style="margin-right:40px"
          ></el-switch>

        <!--跳数限制-->
        <span style="font-size: 14px; color: #303133"><strong>Hop Limit：</strong></span>
        <el-input v-model="num" size="medium" type="number" 
        style="margin-left:5px; width: 80px" 
        v-bind:disabled="isdisabledTwo"/>

      </el-form-item>



    </el-form>
  </div>
</template>


<script>
import { searchOne, searchTwo } from '@/api/search'
import { getResource, getPredicate } from '@/api/label'
import { compile } from 'path-to-regexp'

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
      predicate:'',
      label1:'',
      label2:'',
      prep_label:'',
      direction: true,
      query_type:'',
      isdisabledTwo:false,
      num:1,
      options: [],
      prep_options: [],

      value: ''
    }
  },

  mounted(){
    console.log("mounted")

    // 获取标签
    getResource().then( res =>{
      console.log("load resource")
      for(var item of res.data){
        this.options.push({value:item, label:item})
      }
    }),

    getPredicate().then( res =>{
      console.log("load predicate label")
      for(var item of res.data){
        this.prep_options.push({value:item, label:item})
      }
    })

  },

  methods: {

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
        console.log({nodeName:this.node1, nodeLabel: this.label1, linkName: this.predicate, 
                   linkLabel:this.prep_label, isUnidirectional: this.direction})

        searchOne({nodeName:this.node1, nodeLabel: this.label1, linkName: this.predicate, 
                   linkLabel:this.prep_label, isUnidirectional: this.direction}).then( response => {
          console.log(response)
        })

      // 双节点查询
      }else if (this.query_type == 'two'){
        console.log(2)
        searchTwo({"nodeName1":this.node1, "nodeLabel1": this.label1, "linkName": this.predicate, 
                   "linkLabel":this.prep_label, "nodeName2": this.node2, "nodeLabel2":this.label2, 
                   "isUnidirectional": this.direction, "maxLinks":this.num}).then( res => {
          console.log(res)
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

