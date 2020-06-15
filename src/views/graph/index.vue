<template>
  <div id="container" style="text-align: center; position:relative;">
    <div class="app-container">
      <el-form ref="form" :model="form" label-width="160px">

        <!--查询类型-->
        <el-form-item label="Query Type">
          <el-col :span="8">
            <el-select v-model="query_type" placeholder="Select Query Type" style="width: 200px" @change="onCurrentType">
              <el-option label="Single Node Query" value="one" />
              <el-option label="Two-Node Query" value="two" />
            </el-select>
          </el-col>

          <!--谓语限制-->
          <el-col :span="8">
            <el-input
              v-model="predicate"
              placeholder="Predicate Limit"
              class="input-with-select"
              style="width: 350px"
            >
              <el-select slot="prepend" v-model="prep_label" filterable placeholder="Label" style="width: 100px">
                <el-option
                  v-for="item in prep_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-input>
          </el-col>

        </el-form-item>

        <!--查询节点-->
        <el-form-item label="Query Node">
          <el-col :span="8">
            <el-input
              v-model="node1"
              placeholder="Node One"
              class="input-with-select"
              style="width: 350px"
            >
              <el-select slot="prepend" v-model="label1" filterable placeholder="Label" style="width: 100px">
                <!--<el-option label="default" value="0"></el-option>
              <el-option label="label1" value="1"></el-option>
              <el-option label="label2" value="2"></el-option>
              <el-option label="label3" value="3"></el-option>-->
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-input>
          </el-col>

          <el-col :span="7">
            <el-input v-model="node2" placeholder="Node Two" class="input-with-select" style="width: 350px" :disabled="isdisabledTwo">
              <el-select slot="prepend" v-model="label2" filterable placeholder="Label" style="width: 100px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-input>
          </el-col>

          <el-col :span="8">
            <el-button icon="el-icon-search" circle @click="search()" />
          </el-col>
        </el-form-item>

        <el-form-item label="Constraint">

          <!--单双向限制-->
          <el-switch
            v-model="direction"
            active-text="Bidirectional"
            inactive-text="Unidirectional"
            active-value="false"
            inactive-value="true"
            style="margin-right:40px"
          />

          <!--跳数限制-->
          <span style="font-size: 14px; color: #303133"><strong>Hop Limit：</strong></span>
          <el-input
            v-model="num"
            size="medium"
            type="number"
            style="margin-left:5px; width: 80px"
            :disabled="isdisabledTwo"
          />

        </el-form-item>

      </el-form>
    </div>
    <svg id="graph" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import qs from 'qs'
import axios from 'axios'

export default {
  name: 'Graph',
  data() {
    return {
      data: JSON.parse('{"nodes":[{"id":2233,"name":"Eastern_philosophy","uri":"http://dbpedia.org/resource/Eastern_philosophy","label":"Institution108053576"},{"id":2234,"name":"List_of_sovereign_states","uri":"http://dbpedia.org/resource/List_of_sovereign_states","label":"Thing"},{"id":365,"name":"Georgia_(country)","uri":"http://dbpedia.org/resource/Georgia_(country)","label":"populated place"},{"id":2232,"name":"Languages_of_Asia","uri":"http://dbpedia.org/resource/Languages_of_Asia","label":"grape"},{"id":2235,"name":"Dependent_territories","uri":"http://dbpedia.org/resource/Dependent_territories","label":"populated place"},{"id":169,"name":"Asia","uri":"http://dbpedia.org/resource/Asia","label":"continent"},{"id":2026,"name":"Kaymu","uri":"http://dbpedia.org/resource/Kaymu","label":"organisation"}],"links":[{"source":2026,"target":169,"type":"regionServed","uri":"http://dbpedia.org/ontology/regionServed","label":"Place"},{"source":169,"target":169,"type":"seeAlso","uri":"http://www.w3.org/2000/01/rdf-schema#seeAlso","label":"NULL"},{"source":169,"target":2235,"type":"seeAlso","uri":"http://www.w3.org/2000/01/rdf-schema#seeAlso","label":"NULL"},{"source":169,"target":2232,"type":"language","uri":"http://dbpedia.org/ontology/language","label":"Language"},{"source":169,"target":2234,"type":"seeAlso","uri":"http://www.w3.org/2000/01/rdf-schema#seeAlso","label":"NULL"},{"source":365,"target":169,"type":"seeAlso","uri":"http://www.w3.org/2000/01/rdf-schema#seeAlso","label":"NULL"},{"source":169,"target":2233,"type":"seeAlso","uri":"http://www.w3.org/2000/01/rdf-schema#seeAlso","label":"NULL"}]}'),
      extendData: []
    }
  },
  mounted() {
    this.drawGraph()
  },
  methods: {
    drag(simulation) {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    },
    linkArc(d) {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
      return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
      `
    },
    drawGraph() {
      const data = this.data
      const links = data.links.map(d => Object.create(d))
      const nodes = data.nodes.map(d => Object.create(d))
      const types = Array.from(new Set(links.map(d => d.type)))
      const color = d3.scaleOrdinal(types, d3.schemeCategory10)
      const height = 100
      const width = 300
      const dom = document.getElementById('container')
      console.log(links)
      console.log(nodes)
      console.log(types)

      const legend = d3.select('#container')
        .append('div')
        .attr('class', 'legendContainer clearfix')
        .attr('id', 'graphLegend')
        .style('position', 'absolute')
        .style('text-align', 'left')
        .style('margin-left', '50px')
        .style('top', '50px')
        .selectAll('.legend')
        .data(types)
        .enter()
        .append('div')
        .attr('class', 'legend')

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('x', d3.forceX())
        .force('y', d3.forceY())

      simulation.force('link')
        .distance(function(d) {
          return 45
        })

      const svg = d3.select('#graph')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .style('font', '5px sans-serif')

      const container = svg.append('g')

      container.append('defs').selectAll('marker')
        .data(types)
        .join('marker')
        .attr('id', d => `arrow-${d}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -0.5)
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', color)
        .attr('d', 'M0,-5L10,0L0,5')

      const link = container.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 0.7)
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('stroke', d => color(d.type))
        .attr('id', function(d, i) { return 'edgepath' + i })
        .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location)})`)

      legend.html(function(d, i) {
        const colors = color(d)
        return `<div style="background: ${colors};width: 10px;height: 10px;display: inline-block;"></div><span> ${d}</span>`
      })

      const pathlabels = container.selectAll('.pathLabel')
        .data(links)
        .enter()
        .append('text')
        .attr('x', 20)

      pathlabels.append('title')
        .text(d => {
          const message = 'Type: ' + d.type + '\n' + 'Label: ' + d.label + '\n' + 'URI: ' + d.uri
          return message
        })

      pathlabels.on('click', (d) => {
        window.open(d.uri)
      })

      pathlabels.append('textPath')
        .attr('xlink:href', function(d, i) { return '#edgepath' + i })
        .text(d => d.type)

      const node = container.append('g')
        .attr('fill', 'currentColor')
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .call(this.drag(simulation))

      node.append('title')
        .text(d => {
          const message = 'Name: ' + d.name + '\n' + 'Label: ' + d.label + '\n' + 'URI: ' + d.uri
          return message
        })

      node.append('circle')
        .attr('stroke', 'white')
        .attr('stroke-width', 0)
        .attr('r', 5)

      node.on('click', (d) => {
        this.redrawGraph(d.name)
      })

      const nodeText = node.append('text')
        .attr('x', 8)
        .attr('y', '0.31em')
        .text(d => d.name)
        // .clone(true).lower()
        //   .attr("fill", "none")
        //   .attr("stroke", "white")
        //   .attr("stroke-width", 0);

      nodeText.on('click', (d) => {
        window.open(d.uri)
      })

      simulation.on('tick', () => {
        link.attr('d', this.linkArc)
        node.attr('transform', d => `translate(${d.x},${d.y})`)
      })

      const zoomHandler = d3.zoom()
        .scaleExtent([1 / 5, 2])
        .on('zoom', () => {
          container.attr('transform', d3.event.transform)
        })

      svg.call(zoomHandler)
      container.attr('transform', 'translate(' + 0 + ',' + 0 + ')' + ' scale(' + 0.3 + ')')
    },
    redrawGraph(nodeName) {
      axios.post('http://localhost:8899/basic/extend', qs.stringify({
        'name': nodeName
      }))
        .then(response => {
          const data = JSON.parse(JSON.stringify(response.data.data))
          this.extendData = data
          // console.log(this.extendData);
          // this.data.links = this.processLink(this.extendData.links.concat(this.data.links));
          // this.data.nodes = this.processNode(this.extendData.nodes.concat(this.data.nodes));
          // console.log(this.data.links);
          // console.log(this.data.nodes);
          this.data.links = this.extendData.links
          this.data.nodes = this.extendData.nodes
          document.getElementById('graph').innerHTML = ''
          document.getElementById('graphLegend').remove()
          this.drawGraph()
        // setTimeout(this.drawGraph, 200);
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    processLink(array) {
      const r = []
      const map = []
      for (let x = 0; x < array.length; x++) {
        map.push(-1)
      }
      for (let i = 0; i < array.length; i++) {
        if (map[i] == 0) {
          continue
        }
        if (map[i] == -1) {
          map[i] = 1
        }
        for (let j = i + 1; j < array.length; j++) {
          if ((array[i].source.index == array[j].source.index) && (array[i].target.index == array[j].target.index)) {
            map[j] = 0
          }
        }
      }
      for (let y = 0; y < map.length; y++) {
        if (map[y] == 1) {
          r.push(array[y])
        }
      }
      r.splice(0, 1)
      return r
    },
    processNode(array) {
      const r = []
      for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) { if (array[i].id == array[j].id) j = ++i }
        r.push(array[i])
      }
      return r
    }
  }
}
</script>

<script>
import { searchOne, searchTwo } from '@/api/search'
import { getResource, getPredicate } from '@/api/label'

export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''

      },
      test: true,
      node1: '',
      node2: '',
      predicate: '',
      label1: '',
      label2: '',
      prep_label: '',
      direction: "false",
      query_type: '',
      isdisabledTwo: true,
      num: 1,
      options: [],
      prep_options: [],

      value: ''
    }
  },

  created(){
    console.log("create", this.$route)
    if(this.$route.params.length === 0){
      return
    }
    // 由 resource 搜索界面跳转而来
    if(this.$route.params.node){
      console.log("jump node", this.$route.params.node)
      this.query_type = 'one'
      this.node1 = this.$route.params.node
      this.direction = "false"
      searchOne({ nodeName: this.node1, nodeLabel: this.label1, linkName: this.predicate,
          linkLabel: this.prep_label, isUnidirectional: this.direction }).then(response => {
          console.log(response)
        })

    // 由 predicate 搜索界面跳转而来
    }else if(this.$route.params.predicate){
      console.log("jump predicate", this.$route.params.predicate)
      this.query_type = 'one'
      this.predicate = this.$route.params.predicate
      this.direction = "false"
      searchOne({ nodeName: this.node1, nodeLabel: this.label1, linkName: this.predicate,
          linkLabel: this.prep_label, isUnidirectional: this.direction }).then(response => {
          console.log(response)
        })
    }
  },

  mounted() {
    console.log('mounted')

    // 获取标签
    getResource().then(res => {
      console.log('load resource')
      for (var item of res.data) {
        this.options.push({ value: item, label: item })
      }
    })

    getPredicate().then(res => {
      console.log('load predicate label')
      for (var item of res.data) {
        this.prep_options.push({ value: item, label: item })
      }
    })
  },

  methods: {

    onCurrentType() {
      console.log('change type')
      if (this.query_type === 'one') {
        this.isdisabledTwo = true
      } else {
        this.isdisabledTwo = false
      }
    },

    search() {
      this.$message({
        message: this.node1 + ' and ' + this.node2 + ' and ' + this.query_type + ' and ' + this.direction
      })

      // 单节点查询
      if (this.query_type === 'one') {
        console.log(1)
        console.log({ nodeName: this.node1, nodeLabel: this.label1, linkName: this.predicate,
          linkLabel: this.prep_label, isUnidirectional: this.direction })

        searchOne({ nodeName: this.node1, nodeLabel: this.label1, linkName: this.predicate,
          linkLabel: this.prep_label, isUnidirectional: this.direction }).then(response => {
          console.log(response)
        })

      // 双节点查询
      } else if (this.query_type === 'two') {
        console.log(2)
        searchTwo({ 'nodeName1': this.node1, 'nodeLabel1': this.label1, 'linkName': this.predicate,
          'linkLabel': this.prep_label, 'nodeName2': this.node2, 'nodeLabel2': this.label2,
          'isUnidirectional': this.direction, 'maxLinks': this.num }).then(res => {
          console.log(res)
        })

      // 未选择类型
      } else {
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

