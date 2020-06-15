<template>
  <div id="container" style="text-align: center; position:relative;">
		<svg id="graph" style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
		</svg>
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
    };
  },
  mounted() {
    this.drawGraph();
  },
  methods: {
    drag(simulation) {     
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      
      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    },
    linkArc(d) {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
      return `
        M${d.source.x},${d.source.y}
        A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
      `;
    },
    drawGraph() {
      let data = this.data;
      let links = data.links.map(d => Object.create(d));
      let nodes = data.nodes.map(d => Object.create(d));
      let types = Array.from(new Set(links.map(d => d.type)))
      let color = d3.scaleOrdinal(types, d3.schemeCategory10)
      let height = 100
      let width = 300
      let dom = document.getElementById("container")
      console.log(links)
      console.log(nodes)
      console.log(types)

      let legend = d3.select("#container")
        .append("div")
          .attr("class", "legendContainer clearfix")
          .attr("id", "graphLegend")
          .style("position", "absolute")
          .style("text-align", "left")
          .style("margin-left", "50px")
          .style("top", "50px")
        .selectAll(".legend")
        .data(types)
        .enter()
        .append("div")
          .attr("class", "legend")

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      simulation.force("link")
        .distance(function(d){
            return 45;
        })

      const svg = d3.select("#graph")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "5px sans-serif");

      const container = svg.append("g");

      container.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
          .attr("id", d => `arrow-${d}`)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -0.5)
          .attr("markerWidth", 8)
          .attr("markerHeight", 8)
          .attr("orient", "auto")
        .append("path")
          .attr("fill", color)
          .attr("d", "M0,-5L10,0L0,5");

      const link = container.append("g")
          .attr("fill", "none")
          .attr("stroke-width", 0.7)
        .selectAll("path")
        .data(links)
        .join("path")
          .attr("stroke", d => color(d.type))
          .attr("id", function(d, i){return 'edgepath' + i;})
          .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`)

      legend.html(function (d, i) {
        let colors = color(d)
        return `<div style="background: ${colors};width: 10px;height: 10px;display: inline-block;"></div><span> ${d}</span>`
      })

      const pathlabels = container.selectAll(".pathLabel")
        .data(links)
        .enter()
        .append("text")
          .attr("x", 20);

      pathlabels.append("title")
        .text(d => {
          let message = "Type: " + d.type + "\n" + "Label: " + d.label + "\n" + "URI: " + d.uri;
          return message;
      });

      pathlabels.on("click", (d) => {
        window.open(d.uri);
      });

      pathlabels.append("textPath")
        .attr("xlink:href",function(d, i) {return "#edgepath" + i})
        .text(d => d.type);

      const node = container.append("g")
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
          .call(this.drag(simulation));

      node.append("title")
          .text(d => {
            let message = "Name: " + d.name + "\n" + "Label: " + d.label + "\n" + "URI: " + d.uri;
            return message;
          });

      node.append("circle")
          .attr("stroke", "white")
          .attr("stroke-width", 0)
          .attr("r", 5);

      node.on("click", (d) => {
        this.redrawGraph(d.name);
      });

      const nodeText = node.append("text")
          .attr("x", 8)
          .attr("y", "0.31em")
          .text(d => d.name)
        // .clone(true).lower()
        //   .attr("fill", "none")
        //   .attr("stroke", "white")
        //   .attr("stroke-width", 0);

      nodeText.on("click", (d) => {
        window.open(d.uri);
      });

      simulation.on("tick", () => {
        link.attr("d", this.linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });

      let zoomHandler = d3.zoom()
        .scaleExtent([1 / 5, 2])
        .on("zoom", () => {
          container.attr("transform", d3.event.transform);
        })

      svg.call(zoomHandler);
      container.attr("transform", "translate(" + 0 + ',' + 0 + ")"+ " scale(" + 0.3 + ")");
    },
    redrawGraph(nodeName) {
      axios.post('http://localhost:8899/basic/extend', qs.stringify({
        "name": nodeName
      }))
      .then(response => {
        let data = JSON.parse(JSON.stringify(response.data.data))
        this.extendData = data;
        // console.log(this.extendData);
        // this.data.links = this.processLink(this.extendData.links.concat(this.data.links));
        // this.data.nodes = this.processNode(this.extendData.nodes.concat(this.data.nodes));
        // console.log(this.data.links);
        // console.log(this.data.nodes);
        this.data.links = this.extendData.links;
        this.data.nodes = this.extendData.nodes;
        document.getElementById("graph").innerHTML = "";
        document.getElementById("graphLegend").remove();
        this.drawGraph();
        // setTimeout(this.drawGraph, 200);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    processLink(array) {
      let r = [];
      let map = [];
      for (let x = 0; x < array.length; x++){
        map.push(-1);
      }
      for (let i = 0; i < array.length; i++) {
        if (map[i] == 0){
          continue;
        }
        if (map[i] == -1) {
          map[i] = 1;
        }
        for (let j = i + 1; j < array.length; j++) {
          if ((array[i].source.index == array[j].source.index) && (array[i].target.index == array[j].target.index)) {
            map[j] = 0;
          }
        }
      }
      for (let y = 0; y < map.length; y++) {
        if (map[y] == 1){
          r.push(array[y]);
        }
      }
      r.splice(0, 1);
      return r;
    },
    processNode(array) {
      let r = [];
      for(let i = 0; i < array.length; i++) {
        for(let j = i + 1; j < array.length; j++)
          if (array[i].id == array[j].id) j = ++i;
        r.push(array[i]);
      }
      return r;
    }
  },
};
</script>
