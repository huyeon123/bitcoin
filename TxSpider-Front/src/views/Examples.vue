<template style="background-color:black;">
  <v-app id="inspire">
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="#2b90d9" dark>
      <v-btn icon v-on:click="onTitleClicked">
        <v-icon color="white">mdi-home</v-icon>
      </v-btn>
        <v-toolbar-title style="width: 250px" class="ml-0 pl-4">
          <span class="hidden-sm-and-down">TxSpider</span>
        </v-toolbar-title>
        <input v-model="message" placeholder="주소를 입력하세요" class="searchBar" v-on:keyup.enter = "loading"> <!-- 백엔드와 API 연동 필요 -->
        <v-btn icon @click = "loading">
          <v-icon size = "28">mdi-magnify</v-icon>
        </v-btn>
        <v-spacer />
        <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-translate</v-icon>
            <v-icon small>
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item-group
            v-model="selectedItem"
            color="primary"
          >
            <v-list-item>
              <v-list-item-title @click="changeLang('kr')">한국어</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="changeLang('en')">English</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-btn icon @click="changeTheme">
        <v-icon v-if="!dark">mdi-brightness-7</v-icon>
        <v-icon v-else>mdi-brightness-4</v-icon>
      </v-btn>
      <v-btn icon @click="openTab">
        <v-icon size="28">mdi-github</v-icon>
      </v-btn>
      <v-btn icon @click="dialog = true">
        <v-icon size="28">mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title primary-title>Bitcoin Transaction Tracker: TxSpider</v-card-title>
        <v-card-text>Version: v{{version}}</v-card-text>
        <v-card-text>Author: Ajou_CyberSecurity_Team_7</v-card-text>
        <v-card-text>Date of Development: 2021.05.26</v-card-text>
      </v-card>
    </v-dialog>
  <svg class="d3-tree-vii width-100-percent container-border" style="padding-top:70px;" id="txTree">
    <g class="container" />
  </svg>
  <span>
      <table class="detailTable">
        <thead>
          <tr>
            <th scope="cols" class="tableBorder" style="width:300px;"></th>
            <th scope="cols" class="tableBorder" style="width:530px; height:30px;"></th>
            <th scope="cols" class="tableBorder" style="width:130px;"></th>
            <th scope="cols" class="tableBorder" style="width:130px;"></th>
            <th scope="cols" class="tableBorder" style="width:130px;"></th>
            <th scope="cols" class="tableBorder" style="width:130px;"></th>
            <th scope="cols" style="width:90px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"  class="tableBorder" id="addr"></th>
            <td class="tableBorder" id="txid"></td>
            <td  class="tableBorder" id="fee"></td>
            <td  class="tableBorder" id="input"></td>
            <td  class="tableBorder" id="output"></td>
            <td class="tableBorder" id="time"></td>
            <td id="warning" style="height:40px;"></td>
          </tr>
        </tbody>
      </table>
    </span>
  </v-app>
</template>

<script>
import * as d3 from 'd3'

export default {
  data () {
    return {
      index: 0,
      duration: 650,
      // root: null,
      nodes: [],
      links: [],
      dTreeData: null,
      margin: { top: 20, right: 70, bottom: 30, left: 100 },
      selectedNode: null,
      svg: null,
      container: null,
      dialog: false,
      version: '1.0.0'
    }
  },
  computed: {
    treemap () {
      return d3.tree().nodeSize([50, 300])
    }
  },
  created () {
    //테마 코드
    if (localStorage.getItem('themeDark') && localStorage.getItem('themeDark') === 'true') {
      this.$vuetify.theme.dark = true
      this.dark = true
    }
    //자동 라우팅
    if (this.$route.path === '/examples') {
      this.$router.push('/examples/treeVII').catch(err => { }) // eslint-disable-line
    } else {
      this.$router.push(this.$route.path).catch(err => { }) // eslint-disable-line
      const path = this.$route.path
      this.items.forEach((item, key) => {
        if (item.path === path) {
          this.itemActive = key
        } else {
          if (item.children && item.children.length > 0) {
            item.children.forEach((v, k) => {
              if (v.path === path) {
                sessionStorage.setItem('itemActive', key)
                sessionStorage.setItem('subItemActive', k)
              }
            })
          }
        }
      })
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('subItemActive')
    sessionStorage.removeItem('itemActive')
  },
  methods: {
    changeLang (lang) {
      this.$i18n.locale = lang
      sessionStorage.setItem('i18nLocale', lang)
    },
    openTab () {
      window.open('https://github.com/0xsaika/TxSpider', '_blank')
    },
    itemClick (item, key) {
      this.subItemActive = null
      sessionStorage.setItem('itemActive', key)
    },
    subItemClick (item, key) {
      sessionStorage.setItem('subItemActive', key)
      this.$router.push(item.path).catch(err => { }) // eslint-disable-line
    },
    goHome () {
      this.$router.push('/Home').catch(err => { }) // eslint-disable-line
    },
    changeTheme () {
      this.dark = !this.dark
      localStorage.setItem('themeDark', String(this.dark))
      this.$vuetify.theme.dark = this.dark
    },
    onTitleClicked () {
      this.$router.push('/')
      this.navigationTarget = 'hide'
    },
    loading(){
      alert("트랜잭션을 조회중입니다. 잠시만 기다려주세요.")
    },
    getTreeData () {
      this.$http.get("/treedata").then((response)=>{
        this.dTreeData = response.data
        console.log(response)
      },(error)=>{
        alert(error)
      })
    },
    initSvg (treeData) {
      
      let clientWidth = document.body.clientWidth
      let clientHeight = document.body.clientHeight
      this.width = Math.floor(clientWidth * 1.6)
      this.height = clientHeight - 72

      let margin = ({ top: 10, right: 120, bottom: 10, left: 100 })

      let width = this.width

      // let dy = width / 4
      let dx = 30
      this.svg = d3
        .select('svg.d3-tree-vii')
        .attr('viewBox', [-margin.left, -margin.top, width, dx])

      let translateTop = (this.height - 120) / 2


      let transform = d3.zoomIdentity
        .translate(this.margin.left, translateTop)
        .scale(1)
      console.log(transform) // eslint-disable-line
      this.container = this.svg.select('g.container')

      // init zoom behavior, which is both an object and function
      let zoom = d3
        .zoom()
        .scaleExtent([0.1, 8]) //줌 배율
        .on('zoom', function () {
          d3.select('g.container')
            .attr('transform', d3.event.transform)
        })

      this.svg.call(zoom).on('dblclick.zoom', null)
      this.root = this.getRoot(treeData)
      this.root.x0 = 0
      this.root.y0 = 0
      // this.root.descendants().forEach((d, i) => {
      //   d.id = i
      //   d._children = d.children
      //   if (d.depth && d.data.name.length !== 7) d.children = null
      // })

      this.update(this.root)
    },
    getRoot (treeData) {
      let root = d3.hierarchy(treeData, d => {
        return d.children
      })
      root.x0 = this.height / 2
      // root.x0 = 0
      root.y0 = 0
      return root
    },

    dblclickNode (d) {
        var addr = d.eq(0).text()
        var txid = d.eq(1).text()
        var fee = d.eq(2).text()
        var input = d.eq(3).text()
        var output = d.eq(4).text()
        var time = d.eq(5).text()
        var warning = d.eq(6).text()

        $("#addr").html(addr)
        $("#txid").html(txid)
        $("#fee").html(fee)
        $("#input").html(input)
        $("#output").html(output)
        $("#time").html(time)
        $("#warning").html(warning)
      }
    },
    clickNode (d) {
      console.log('clickNode: ', d)
      this.selectedNode = d
      if (d.children) {
        this.$set(d, '_children', d.children)
        d.children = null
      } else {
        this.$set(d, 'children', d._children)
        d._children = null
      }
      this.$nextTick(() => {
        this.update(d)
      })
    },
    diagonal (s, d) {
      return `M ${s.y} ${s.x}
              C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`
    },
    getNodesAndLinks () {
      this.dTreeData = this.treemap(this.root)
      this.nodes = this.dTreeData.descendants()
      this.links = this.dTreeData.descendants().slice(1)
    },
    // 数据与Dom进行绑定
    update (source) {
      // let self = this
      this.getNodesAndLinks()

      this.nodes.forEach(d => {
        d.y = d.depth * 300 //노드 사이 거리
      })
      let node = this.container.selectAll('g.node').data(this.nodes, d => {
        return d.id || (d.id = ++this.index)
      })
      // Enter any new sources at the parent's previous position.
      let nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .on('click', this.clickNode)
        .on('dblclick', this.dblclickNode)
        .attr('transform', () => {
          return 'translate(' + source.y0 + ',' + source.x0 + ')'
        })

      // Add circle for the nodes
      nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style('fill', function (d) {
          // console.log('d fill: ', d)
          return d._children ? '#c9e4ff' : '#fff'
        })
        // add circle selection style
        // .on('click', function (d) {
        //   d3.select(this)
        //     .transition()
        //     .delay(1)
        //     .style('fill', function () {
        //       return '#54a8ff'
        //     })
        //     .style('stroke-width', function () {
        //       return '4px'
        //     })
        //   // self.update(this)
        // })

      nodeEnter
        .append('text')
        .attr('dy', '.35em')
        .attr('x', function (d) {
          return d.children || d._children ? -13 : 13
        })
        .attr('text-anchor', function (d) {
          return d.children || d._children ? 'end' : 'start'
        })
        .text(function (d) { return d.data.name })
        .attr('class', 'update')

      // Transition nodes to their new position.
      let nodeUpdate = nodeEnter
        .merge(node)
        .transition()
        .duration(this.duration)
        .attr('transform', function (d) {
          return 'translate(' + d.y + ',' + d.x + ')'
        })

      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style('fill', function (d) {
          return d._children ? '#c9e4ff' : '#fff'
        })
        .style('stroke-width', function () {
          return '2px'
        })
        .attr('cursor', 'pointer')

      nodeUpdate.select('text').style('fill-opacity', 1)

      // update the text
      node.select('text')
        .attr('dy', '.35em')
        .attr('x', function (d) {
          return d.children || d._children ? -13 : 13
        })
        .attr('text-anchor', function (d) {
          return d.children || d._children ? 'end' : 'start'
        })
        .text(function (d) { return d.data.name.length > 50 ? d.data.name.substring(0, 20) + '...' : d.data.name })

      // Transition exiting nodes to the parent's new position.
      let nodeExit = node
        .exit()
        .transition()
        .duration(this.duration)
        .attr('transform', function () {
          return 'translate(' + source.y + ',' + source.x + ')'
        })
        .remove()

      nodeExit.select('circle').attr('r', 1e-6)

      nodeExit.select('text').style('fill-opacity', 1e-6)

      // *************************** Links section *************************** //
      // Update the links…
      let link = this.container.selectAll('path.link').data(this.links, d => {
        return d.id
      })

      // Enter any new links at the parent's previous position.
      let linkEnter = link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', () => {
          let o = { x: source.x0, y: source.y0 }
          return this.diagonal(o, o)
        })
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('stroke', '#ccc')

      // Transition links to their new position.
      let linkUpdate = linkEnter.merge(link)
      linkUpdate
        .transition()
        .duration(this.duration)
        .attr('d', d => {
          return this.diagonal(d, d.parent)
        })

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(this.duration)
        .attr('d', () => {
          let o = { x: source.x, y: source.y }
          return this.diagonal(o, o)
        })
        .remove()
      // Stash the old positions for transition.
      this.nodes.forEach(d => {
        d.x0 = d.x
        d.y0 = d.y
      })
    }
}

</script>
<style scoped>
.img-container {
  display: flex;
  padding: 40px 20px;
}
.logo-img {
  width: 45%;
  object-fit: contain;
  margin: 0 5px;
}
.img-d3-padding {
  padding: 4px !important;
}
.searchBar{
  width: 400px;
  color: white;
  font-size: 25px;
  cursor: text;
  -webkit-appearance: none; /* 브라우저별 기본 스타일링 제거 */
  outline: none;
  border-bottom: 1px solid white;
}
input::placeholder{
  color: white;
}
</style>
<style>
.d3-tree-vii circle {
  fill: #fff;
  stroke: #476eda;
  stroke-width: 2px;
}

.d3-tree-vii .node text {
  font: 12px sans-serif;
  width:30px;
}

.d3-tree-vii .link {
  fill: none;
  stroke: rgb(199, 225, 243);
  stroke-width: 2px;
}

.detailTable{
  text-align: center;
  width: auto;
  font-size: 15px;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-top:25px;
  border-collapse: collapse;
}

.detailTable thead{
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  vertical-align: top;
  color: rgb(66, 113, 160);
  border-bottom: 3px solid #036;
}

.tableBorder {
  border-right: 2px solid #036;
  margin-right: 5px;
}
</style>
<style scoped>
.width-100-percent {
  width: 100%;
  /* height: calc(100vh - 74px); */
  height: 85%;
}
</style>