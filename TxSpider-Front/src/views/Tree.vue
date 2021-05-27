<template style="background-color:black;">
  <v-app id="inspire">
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="#2b90d9" dark>
      <v-btn icon v-on:click="onTitleClicked">
        <v-icon color="white">mdi-home</v-icon>
      </v-btn>
        <v-toolbar-title style="width: 250px" class="ml-0 pl-4">
          <span class="hidden-sm-and-down">TxSpider</span>
        </v-toolbar-title>
        <input v-model="address" placeholder="주소를 입력하세요" class="searchBar" v-on:keyup.enter = "getTreeData(address)"> <!-- 백엔드와 API 연동 필요 -->
        <v-btn icon @click = "getTreeData(address)">
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
            <th scope="cols" class="tableBorder" style="width:300px;">Addr</th>
            <th scope="cols" class="tableBorder" style="width:530px; height:30px;">Txid</th>
            <th scope="cols" class="tableBorder" style="width:130px;">Fee</th>
            <th scope="cols" class="tableBorder" style="width:130px;">Total_input</th>
            <th scope="cols" class="tableBorder" style="width:130px;">Total_output</th>
            <th scope="cols" class="tableBorder" style="width:130px;">Time</th>
            <th scope="cols" style="width:90px;">Warning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"  class="tableBorder" id="addr">37req9bd6V1CjeymXjubvhLZsgxoWVzSz6</th>
            <td class="tableBorder" id="txid">a7fa5c3ba0df9f7d40db18e846f58db72b5be2945fd7f0a9794d78c9355ea016</td>
            <td  class="tableBorder" id="fee">0.00031144 BTC</td>
            <td  class="tableBorder" id="input">0.00577919 BTC</td>
            <td  class="tableBorder" id="output">0.00577919 BTC</td>
            <td class="tableBorder" id="time"></td>
            <td id="warning" style="height:40px;">True</td>
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
      dTreeData: [],
      address:null,
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
  mounted () {
    let treeData = {
      'name': '15h34HXaX7fPPs1UgjLmm1uwUk1Xaa8R28',
      'children':[
        {
          'name': '37req9bd6V1CjeymXjubvhLZsgxoWVzSz6',
          'children':[
            {'name': '3BMEXWfUeh9TaVRLeWd3xLSk7iLW54sTtm',
            'children':[
              {'name': '3BMEXtt8et9fPzDuM62f4S3YRjgK5pAsA7',
              'children':[
                {'name': '3JNzWEq44HtKPp5rMsaZE5Lr8mgpx8TM7P',
                'children':[
                  {'name': '3BMEXYDhp9oijW2CVUjfXMyw47QfN7bT8B'}
                ]}, //20-7-11 06:28
                {'name': '3NEPAv5MmsCgX5X61T7gSjW3U2FFUYqgzT',
                'children':[
                  {'name': '39y1qb6dqw5ep1HG124dbZS7jXb9dpyqNX',
                  'children':[
                    {'name':' 3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5',
                    'children':[
                      {'name': '3FbdN1ZD3urBZAfx3r1cqWegcFZzjLrRyf',
                      'children':[
                        {'name': '34QCtXANXBzc4J7GzdqYRa5w8cuBMm5QvK'},
                        {'name': '3FGyKPu5PsAVCpyde7pczLYFi46KwWwAvA'},
                        {'name': '31mAyNv5w8asjRdjyZzz7ooBTkidiQvTzx'},
                        {'name': '341nPi5MADC2unHT6tygKXKxsQfddPjQFC'},
                      ]},
                      {'name': '34QCtXANXBzc4J7GzdqYRa5w8cuBMm5QvK',
                      'children':[
                        {'name': '3FGyKPu5PsAVCpyde7pczLYFi46KwWwAvA'},
                        {'name': '31mAyNv5w8asjRdjyZzz7ooBTkidiQvTzx'},
                        {'name': '341nPi5MADC2unHT6tygKXKxsQfddPjQFC'},
                      ]},
                      {'name': '3FGyKPu5PsAVCpyde7pczLYFi46KwWwAvA',
                      'children':[
                        {'name': '3FbdN1ZD3urBZAfx3r1cqWegcFZzjLrRyf'},
                        {'name': '34QCtXANXBzc4J7GzdqYRa5w8cuBMm5QvK'},
                        {'name': '31mAyNv5w8asjRdjyZzz7ooBTkidiQvTzx'},
                        {'name': '341nPi5MADC2unHT6tygKXKxsQfddPjQFC'},
                      ]},
                    ]},
                    {'name':' 3KgaqZcbhhRLyHUXrmC6j3rYj31WmfcoaZ',
                    'children':[
                      {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5',
                      'children':[
                        {'name': '3DX86afQFUv5NG9UgzBdCDGTeKKJAkkcu8'},
                        {'name': '35Jnq6Yf3sEbHAP1mmU5PetKmuHPmKLBNs'},
                        {'name': '34Di5hoVWjeeFUGQR2B1Bh9Ri57SsuqaMW'},
                        {'name': '38BPU5bfTC8MKWLBY6xLNtuGYtPNHaLjhx'},
                        {'name': '37hXkrVA1J6sob6GArKKW4AicZXubzR7YG'},
                      ]},
                      {'name': '3BbwZ7JTT5xyzcGSutEToCr4FdjWD6BmbE',
                      'children':[
                        {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5'},
                        {'name': '3CWN3RhW2Mao6sqvcKg5AQd6mEeiMR2fRV'},
                      ]},
                    ]},
                  ]}, //20-7-15 14:52
                  {'name': '3NE2BWMmTSeopWgquvyqAvQQoZsgjfVKrX',
                  'children':[
                    {'name':' 3CXZv9tJ31HkE3UwV3n6BgquGbM6ExabhE',
                    'children':[
                      {'name': '3Bpk6Jrh2NPbvgyo2MwTMpxM1xnmXyZNZf',
                      'children':[
                        {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5'},
                        {'name': '3Nv59WRbg35Hm1BSw9epsrRWQiMqPhfuap'},
                      ]},
                      {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5',
                      'children':[
                        {'name': '3BGFy6x4FDa45HLeXBpjXQCosYqWbP8HAx'},
                        {'name': '3ExhiU5ma2XxXhqLrFjSMP613hHjy9t3ku'},
                        {'name': '3PqYdaGdwrpAaSwTppc9CXQrdUoaXwynjm'},
                        {'name': '3CFNmFhkBgXnkiTKthtZhRqgpHHMrV8tJC'},
                      ]},
                    ]},
                  ]}, //20-7-18 01:20
                  {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5',
                  'children':[
                    {'name': '35V9b5ep78uPRaBdzr3Hfhe4fomWGqSrXW',
                    'children':[
                      {'name': '3KD4m3N2xqnC9PrN81iuGVNyRP7mrdD8rt',
                      'children':[
                        {'name': '3GVabkX55UevMBB5PffVZZraz6TfhRqRaM'},
                        {'name': '3P14ZW96bEgcE54oBDyxiLcQkrrAHX7muv'},
                        {'name': '3PqYdaGdwrpAaSwTppc9CXQrdUoaXwynjm'},
                        {'name': '3PqYdaGdwrpAaSwTppc9CXQrdUoaXwynjm'},
                      ]},
                      {'name': '34rmG49xZkY2TanbXwkwzbYqR1PM1am8PS',
                      'children':[
                        {'name': '3CBfK8JjpeAvNerUhSttJ4Auy61667Cf9z'},
                        {'name': '3P14ZW96bEgcE54oBDyxiLcQkrrAHX7muv'},
                        {'name': '3Bsj9WomWUqb1Yz34kZDd1pFzjYgDjJugz'},
                      ]},
                      {'name': '1AWTqRNtiwMTrWFQqD7Jxpdj9UUsHSknaL',
                      'children':[
                        {'name': '3FGkM8KvuovtUt94qHha2W76zGWnf8a4so'},
                        {'name': '1Fo71UZch5HNBERRjihmD1iVsmyeq3UEej'},
                      ]},
                      {'name': '35QF6ka2p4XrEpjzzv8AA83vqCSnQ2B7T9',
                      'children':[
                        {'name': '36e9G1GgsRqa1itCHNcDGhaPaWXKt9VzVi'},
                        {'name': '3AEsEoEYd5EFtwxCuMdmEZ4g9ccJapMN3Y'},
                      ]},
                      {'name': '3HULabrBRF4YhYekuyatpT52tCNWDSsdxA',
                      'children':[
                        {'name': '3LAzV617Dwg7dNkMebAS8QT9iEUz6tcTEs'},
                        {'name': '32bF3bDSsDqjVJ2qG3qrtv2GEWkDdyGnV2'},
                        {'name': '1BAXYQi4wgCVtDNe6csEJJWfYXquUSuxJe'},
                        {'name': '12ByodQLxcFTG6Va4PMh1Sw8CyegmHQLc1'},
                      ]},
                    ]},
                    {'name': '3JfkiVXbDT4VvAMoxJoozhHPeEcC2ZS4ey',
                    'children':[
                        {'name': '3Hmh3enbVcQwr2FNr74RUVqfWp647DToxV',
                        'children':[
                          {'name': '3DJdBwcZPqjBE9oikJ5otGZW3XUamzJxJy'},
                          {'name': '3BfUzL86Xpq8JhcaBsDBjqYp1ovApzxnku'},
                          {'name': '39k4vKZef6gb6qHPz9bFhHfDXFYRTLpMbB'},
                          {'name': '38K8tmtCD4iroVTLHdo116J79192x8A8f1'},
                        ]},
                        {'name': '3DJdBwcZPqjBE9oikJ5otGZW3XUamzJxJy',
                        'children':[
                          {'name': '3Ega2sTkW1BvEqF6JhtQJYfKe2MxvD6Avd'},
                          {'name': '3LpzHo1Dk42fNgxwwzAfBbat8NZwUE6Prb'},
                          {'name': '368mfun852iBLvkCwkxeaPrb32XTXfjPyc'},
                        ]},
                        {'name': '3BfUzL86Xpq8JhcaBsDBjqYp1ovApzxnku',
                        'children':[
                          {'name': '3BsMs1h7qe56asErE56YRBx9gH7caUyEVr'},
                          {'name': '39C4Aq4J5QPwFStGmxNKiwoQmU5JEtirt4'},
                          {'name': '3BsMs1h7qe56asErE56YRBx9gH7caUyEVr'},
                        ]},
                        {'name': '39k4vKZef6gb6qHPz9bFhHfDXFYRTLpMbB',
                        'children':[
                          {'name': '3KD4m3N2xqnC9PrN81iuGVNyRP7mrdD8rt'},
                          {'name': '34rmG49xZkY2TanbXwkwzbYqR1PM1am8PS'},
                          {'name': '1AWTqRNtiwMTrWFQqD7Jxpdj9UUsHSknaL'},
                        ]},
                    ]},
                    {'name': '3LPgzrdWSi2kUBdBJVpZaR96h6PL2xKqAf',
                    'children':[
                      {'name': '35V9b5ep78uPRaBdzr3Hfhe4fomWGqSrXW'},
                      {'name': '3JfkiVXbDT4VvAMoxJoozhHPeEcC2ZS4ey',
                      'children':[
                        {'name': '3Hmh3enbVcQwr2FNr74RUVqfWp647DToxV'},
                        {'name': '3DJdBwcZPqjBE9oikJ5otGZW3XUamzJxJy'},
                        {'name': '3BfUzL86Xpq8JhcaBsDBjqYp1ovApzxnku'},
                        {'name': '39k4vKZef6gb6qHPz9bFhHfDXFYRTLpMbB'},
                      ]},
                    ]},
                    {'name': '3JieQJT13cJUfCspegEMT5w27SnWfoVt78',
                    'children':[
                      {'name': '37pd8Yzh4LYGpVsbYU4f9We7EcQQYUGhCz',
                      'children':[
                        {'name': '3EEqy6LWntahNDE6k4t3XT5ZxWrLhz6Ghc'},
                        {'name': '18aAMpk5QbeQzkqWFhyLLuAL7mUuVgk8uz'},
                      ]},
                      {'name': '14tWCpGsyMZyZBrRLyW26XR3rB6JVPZEYG',
                      'children':[
                        {'name': '14GGufD3t2osLf1HsAU6obWWHsUvUojFoD'},
                        {'name': '12HKGq89vdkCnUUjjpSWX4BcNaApXdYPrY'},
                        {'name': '3JAubu6wqjp4A3HMPTQJndLmbCeXRyLS2r'},
                        {'name': '3JokqeXHNYSkr7omBWZwvibXigiFM4J28c'},
                      ]},
                    ]},
                    {'name': '3CYYKg9R4x5Ec3fQcsnNDiyyZrT1Drv59E',
                    'children':[
                      {'name': '3FKAaMzQVq53AXjjNgbYmpHRhbuX458o55',
                      'children':[
                        {'name': '3AQtGpnXjCZ3motJn5Hig4KcNGij5fxY4V'},
                        {'name': '1xUcPtg5jTxdjwcqgB1TEfrfpj8pxZLZs'},
                        {'name': '3A2AZSgGjiykyJkFZ5mURJsTV5i81GH5t2'},
                        {'name': '34CEzhuyCGssmzK87vSu44SGPDHn756165'},
                        {'name': '14A2QgmYJkU1ExyVyfEFr3Jjfi3LNyps3T'},
                      ]},
                      {'name': '3QpzZkpQx3dHJq11s7m3Bq9hfBggouAArv',
                      'children':[
                        {'name': '383PQ1BZ1EWt6RXbYWeE6XgJo1FoxpiAp1'},
                        {'name': '32VkjZa3sLdyHDKSfhMakbnJTomgYYfWnK'},
                        {'name': '1GyZ7qkLiMkBc4VVYADskbnCz99tWtzMyz'},
                        {'name': '1FNfGBGh327y8zPnNtDUiNyBjXtUuV2Yci'},
                      ]},
                      {'name': '37muukMPCnGHrJFbEU29NCJ2kdwDoqfD15',
                      'children':[
                        {'name': '3BCa7tTbfoCt5oPncsFCmvHvmr6EAywfdX'},
                        {'name': '3BN9A2DsJV8Q96QbDVd3nTNg6LeqVfJ2tk'},
                        {'name': '17swyrzrj5FKLdoJMtsGPxix3K3L2BjPSr'},
                        {'name': '19XJCfALt2GFRsqbBE7RUt1bNZvH7NfzTC'},
                      ]},
                      {'name': '37vcihG3bLPgyTbypxwSruqQdVk1MPXGes',
                      'children':[
                        {'name': '3LGSrq2y76CUSFhjhPZQ3e4RimLtUFQRHz'},
                        {'name': '3NJ8EFJFhrVDVXw6NpbN66tYP6edDqPV2t'},
                      ]},
                      {'name': '36powhPhrj3vthx2agk31kyNvdyZ6QqBzL',
                      'children':[
                        {'name': '3L5Dm3XZgTe7ADZZJFo2PwxeeujYKWH3Eb'},
                        {'name': '1B9nfJQ98Meee6PipPggHyQ2zLQvLNu1b7'},
                        {'name': '3AsFCwUzGSVE8FBntH1h9MXu8wJrMXPYHM'},
                      ]},
                    ]},
                  ]},
                ]}, //20-7-12 00:58
                {'name': '3MjSP7tt4LBGap9PBMWXbQjbG7SrBphrjv',
                'children':[
                  {'name': '12xjTvg1aqK9Jc46N4cxTLiKnCWnDwD4S9',
                  'children':[
                    {'name': '14m3sd9HCCFJW4LymahJCKMabAxTK4DAqW',
                    'children':[
                      {'name': '1ftuUgzrr5hnVzXnFBDjELvVe69rPtBRi',
                      'children':[
                        {'name': '3JectuPu9XsWR4q1qo8cR3q4PnThRHdR5Z'},
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                      ]},
                      {'name': '1JrS7P4dLMQGAmvHzLJFAQNHWBTWVfBKfw',
                      'children':[
                        {'name': '1F8FmbGnRtrGtS1kmiyjUYTzkAej1pDZ2d'},
                        {'name': '1JFF22EJxyCcSkc2dYar8CNuTbSA2bomBF'},
                      ]},
                      {'name': '3LPgzrdWSi2kUBdBJVpZaR96h6PL2xKqAf',
                      'children':[
                        {'name': '1Luo5gcGZTBKwiyLTMk1JsgrBin9vDFbFc'},
                      ]},
                      {'name': 'bc1q7cyrfmck2ffu2ud3rn5l5a8yv6f0chkp0zpemf'},
                    ]}
                  ]}, //20-7-13 00:01
                ]}, //20-7-13 00:01
              ]}, //20-07-11 02:54
              {'name': '3BMEXtt8et9fPzDuM62f4S3YRjgK5pAsA7',
              'children':[
                {'name': '3NEPAv5MmsCgX5X61T7gSjW3U2FFUYqgzT',
                'children':[
                  {'name': '39y1qb6dqw5ep1HG124dbZS7jXb9dpyqNX',
                  'children':[
                    {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5'},
                    {'name': '3KgaqZcbhhRLyHUXrmC6j3rYj31WmfcoaZ',
                    'children':[
                      {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5',
                      'children':[
                        {'name': '3CUyoaVtFUtrjkUAWmE8hLNSVVUSQ7cgXy'},
                        {'name': '32ipsGm6NHFZFk5NHkXpmUxjNfAFAv15yG'},
                        {'name': '3LnhruNKjSjcsv3jnd6KnJApnbARACV1zc'},
                      ]},
                      {'name': '3BbwZ7JTT5xyzcGSutEToCr4FdjWD6BmbE',
                      'children':[
                        {'name': '3DVcGy2ZQYHgnejkEkYypo6sJZyPzLQTy5'},
                        {'name': '3CWN3RhW2Mao6sqvcKg5AQd6mEeiMR2fRV'},
                      ]},
                    ]},
                  ]}, //20-7-15 14:52
                ]}, //20-7-12 00:58
                {'name': '3MjSP7tt4LBGap9PBMWXbQjbG7SrBphrjv',
                'children':[
                  {'name': '12xjTvg1aqK9Jc46N4cxTLiKnCWnDwD4S9'} //20-7-13 00:01
                ]}, //20-7-13 00:01
                {'name': '1DMZ9PZcR3kgkotVRGA2ZsksJd8m1fMCsE',
                'children':[
                  {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'}, //20-7-14 07:03
                  {'name': '34dehme1m59B6J2HGE55zsAFTZw7zZhEre',
                  'children':[
                    {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
                    'children':[
                      {'name': '32SykZhHqvEUYKbnLuk49jDCYwjMvMJm6Z'},
                      {'name': '13RsAYQCMRTdA8pcdj5iMrjNR2SwruxYiv',
                      'children':[
                        {'name': '37XuhS2tCki9KEjm54Ca5UaFqxu6s2oq1J'},
                        {'name': '14BJTWuQjgeRoKjxmMwZY8sx4sFYNJzrgD'},
                        {'name': '1JnGg6rAc2rkCvEhKK1iVgLHvUkVLY5BiJ'},
                      ]}, 
                    ]}, //20-7-15 03:07
                    {'name': '34Rqar6P4S111n5b8Ft1mSjprec2Sg3AMf',
                    'children':[
                      {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                      {'name': '32D1bmt9CPYSvg8TMM6DeQSyFk3HGffdgW',
                      'children':[
                        {'name': '32PLLZTQU57KJraehkmcWfE2EXGEJh1rFV'},
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                      ]}, 
                    ]}
                  ]}
                ]}, //20-7-14 05:34
                {'name': '1NJupdzyiSTkbZ4UapFcWZv4G7gjUKPtHu',
                'children':[
                  {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'}, //20-7-15 03:07
                  {'name': '3D8mhQsqZwUnpHCDhKprghN12g5hdxn2zg'}
                ]}, //20-7-15 00:41
              ]}, //20-07-11 22:32
              {'name': '3BMEX6p85BSX3KKYjYzFWMmNKFL4hUeHeA',
              'children':[
              {'name': '32CanXFB35uPaP6F6fQX5GWWDqt1KtUTyL'}, //21-03-25 19:21
              {'name': '32JMEnGAeckA6cDwhv79jzzaepjHTtjRQL'}, //21-03-25 21:18
              {'name': '1DPdSceruocoYbCVQrfuqJsuGGUABycxQJ'}, //21-03-25 23;43
              {'name': '3FWWnUSCc851JRX2Dm4WUkKb46uoKXKQrP'}, //21-03-26 03:16
              {'name': '1Ej39kG4vpRsirEKGD57U2FrUFbgPbHYoP',
              'children':[
                {'name': '34pVVtUZSHUiQLc4euEVmwafQHCXRDriUm',
                'children':[
                  {'name': '3DCLD2okDvN9iS8ojWSW6FD3wcKvMjAQzR',
                  'children':[
                    {'name': '161RyqMy2zYqNudYwxgo2LRikQ6MZYYoJ9',
                    'children':[
                      {'name': '1Ky2tfatW57z622bi2iXsn7Gvo4GWddfSx'}, //21-03-25 21:18
                      {'name': '1FcdyYiXCiX5ariZ2m4pXdwrxctopDYb4C'},
                    ]}, //21-03-25 19:21
                    {'name': 'bc1qwv84d76gda984zz9mlqas5zjl5deuma2x85aqu',
                    'children':[
                      {'name': '37ZGGcVHDXTkKaVabnoWhiSN3KPZWhJSpz'}
                    ]}, //21-03-25 21:18
                    {'name': '3MQ1y9pZV3ZHrxQHBC7wTz4nqWUGZF7s8R',
                    'children':[
                      {'name': '3Ck4pCt5HUvpPAEVoNAp8kRr2KK9tZDb1u'}, //21-03-25 19:21
                      {'name': '121ZqPKjcnNwLTEwYUVVUkHmP9jpgj7fvb'}, //21-03-25 21:18
                      {'name': '1EbEYbgP4Fb4bcE42712akDpcLZhsY2cHb'}, //21-03-25 23;43
                      {'name': '1Ht2R62LdDSwCu1RyfXAnZgyaWYrUuzeaS'},
                    ]}, //21-03-25 23;43
                    {'name': 'bc1qwv84d76gda984zz9mlqas5zjl5deuma2x85aqu',
                    'children':[
                      {'name': '39TYpeF3NN4JqXwVxjfwh4xxPWKJK1yR8e'},
                    ]},
                  ]},
                  {'name': 'bc1qh7ukp648en0lrgfjafa4ny04y4eqv4f5gqns5j',
                  'children':[
                    {'name': '3DCLD2okDvN9iS8ojWSW6FD3wcKvMjAQzR',
                    'children':[
                      {'name': '3Ck4pCt5HUvpPAEVoNAp8kRr2KK9tZDb1u'}, //21-03-25 19:21
                      {'name': '121ZqPKjcnNwLTEwYUVVUkHmP9jpgj7fvb'},
                    ]}, //21-03-25 19:21
                    {'name': '3GADhSfTnfwPc9mfcr3MdjEcZ1LZTocPB2'},
                  ]},
                  {'name': 'bc1ql0t9x7ysdmj5vwchcrsxj63xfwyscrctn4dn3l',
                  'children':[
                    {'name': 'bc1qwv84d76gda984zz9mlqas5zjl5deuma2x85aqu'}, //21-03-25 19:21
                    {'name': '3MQ1y9pZV3ZHrxQHBC7wTz4nqWUGZF7s8R'},
                  ]},
                  {'name': 'bc1qh7ukp648en0lrgfjafa4ny04y4eqv4f5gqns5j',
                  'children':[
                    {'name': '3DCLD2okDvN9iS8ojWSW6FD3wcKvMjAQzR',
                    'children':[
                      {'name': '161RyqMy2zYqNudYwxgo2LRikQ6MZYYoJ9'}, //21-03-25 19:21
                      {'name': 'bc1qwv84d76gda984zz9mlqas5zjl5deuma2x85aqu'},
                    ]}, //21-03-25 19:21
                    {'name': '3GADhSfTnfwPc9mfcr3MdjEcZ1LZTocPB2',
                    'children':[
                      {'name': 'bc1qh7ukp648en0lrgfjafa4ny04y4eqv4f5gqns5j'},
                    ]}, //21-03-25 21:18
                    {'name': '34pVVtUZSHUiQLc4euEVmwafQHCXRDriUm'}, //21-03-25 23;43
                    {'name': 'bc1ql0t9x7ysdmj5vwchcrsxj63xfwyscrctn4dn3l',
                    'children':[
                      {'name': 'bc1q505zycunyppneuwcfvjqae4jk5at6t8x80natg'}, //21-03-25 23;43
                      {'name': '1PfJeM9Gt32hhsQbLPzQF77xsmvuM5LEiq'}
                    ]},
                  ]},
                ]}, //21-3-26 04:46
                {'name': 'bc1qh7ukp648en0lrgfjafa4ny04y4eqv4f5gqns5j',
                'children':[
                  {'name': '34pVVtUZSHUiQLc4euEVmwafQHCXRDriUm'},
                ]},
              ]}, //21-03-26 03:44
            ]}, //20-07-12 22:31
              {'name': '3BMEXuuKWij2uafsRydVjkExs1ZQKBUStm',
              'children':[
                {'name': '12SQJeWEa5A99KkVE26bA32FWzDSAC2upP',
                'children':[
                  {'name': '35uVogauDu2wEDAfBVKfYdiCSyjxpMePgJ'}, //20-7-16 13:28
                  {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                ]} //20-7-16 13:14
              ]}, //20-07-15 00:57
              {'name': '3BMEXBbfrJcWGPJwYbtYxwingx5BK61Qob',
              'children':[
                {'name': '33V2D81iVFJgnwFeUjy55LvZGGJBcitSeh',
                'children':[
                  {'name': '12xjTvg1aqK9Jc46N4cxTLiKnCWnDwD4S9',
                  'children':[
                    {'name': '14m3sd9HCCFJW4LymahJCKMabAxTK4DAqW',
                    'children':[
                      {'name': '1Mtyyq6oipGbKmfma9DTx57xDGQheQULNF',
                      'children':[
                        {'name': '3Ddv37phPVFFMrGnU1K7b3Lbv3Kov2hqWk'},
                        {'name': '1HDPqxyyLorLU3hZpsEtrf2epV7VcmhKSL'},
                      ]},
                      {'name': '32TwV1sGDty8yaGhM2ytqRcKUXGmsyJrx8',
                      'children':[
                        {'name': '162vzHUTXkKCKQA6teMtCQVBMdpZpQzZGB'},
                        {'name': '32Lf7VPqbQEdvkhdfyM3WnjVnghdJYSKDn'},
                        {'name': 'bc1qy8fu4juaq8e3rsmc6d2339unc8j0fgnftqhq55'},
                        {'name': '1HB1eBj78xCBPoBvUacmR2KDXFfukrctnc'},
                      ]},
                      {'name': '138pG71MJcmSbzExnoC6fvDvP9jg5gsS36',
                      'children':[
                        {'name': '1AkaLAt4kbD5qUvCxDpNHKAWakVjcU7MFo'},
                        {'name': '3LHgBaVS5F2Z1ihHdskoefpDAxi5F9AYn3'},
                        {'name': '1DwVkz3tLA1vFmK73PGj6MWSfqafNtrQ5v'},
                      ]},
                      {'name': '1LxrPTpbHixVU79p7DDiFLVNyJ1sagRCCW',
                      'children':[
                        {'name': '32TwV1sGDty8yaGhM2ytqRcKUXGmsyJrx8'},
                        {'name': '1HYW3NmfX4sA9V5TcoUZjbjUQyDVyoHRew'},
                      ]},
                    ]},
                  ]}, //20-7-22 11:24
                ]}, //20-7-21 22:33
                {'name': '145wquu52s5e4vgSFx8nB5RyDCPza1rx3u',
                'children':[
                  {'name': '3BMEXsYXteAA5pbG6t4sd4ERshobDHHZqv',
                  'children':[
                    {'name': '3JnRg4PFxKdJ8m2Ddc1wpcqEpzKmAmvpgb',
                    'children':[
                      {'name': 'bc1qvq9nn7j8ctlh33py9y5y4e2640q09fwc3ps4pn',
                      'children':[
                        {'name': '39aujTDUrjjtE44pNNtRMU31Utb6YUDyS5'},
                        {'name': '38BRGfSjvcW1Xrjwza2mqWLdyC5VMVgTX4'},
                        {'name': 'bc1qyee5dzq8yladxwtteqjv5uzmppda40xffg8dat'},
                      ]},
                      {'name': 'bc1qvdaf92s6qhafxf059zz9a40wzt78kdxtt6e259',
                      'children':[
                        {'name': '3FBS4j3kA4hG6yiri52W9egHbCeQUthxB4'},
                        {'name': '3F74QzYLZH7QU8gavcxW5ECRCumLnXgiRp'},
                        {'name': '3Np3pT8SifTA3tK1zXXFWAgMHzfGm6qW1K'},
                        {'name': '3ELPPkQJkX4MnQPz7jgsCh2hYgdyD6a93F'},
                      ]},
                      {'name': 'bc1q6l2jq4w99rd6efzat94txwzennz09j0uxfg7zy',
                      'children':[
                        {'name': 'bc1qqgyn4jq7upnjsv3jsm00dc9hmmdapd9r7tk7wt'},
                        {'name': '1Cr18p9bs2yMtb7dPj1xUXwsrRFkHGoWFa'},
                      ]},
                    ]},
                    {'name': '3BMEX7jLNTkNvkTSXsPme2QUFPnE7cYmZL',
                    'children':[
                      {'name': '34CK1kUa9yzKVhxBP2TGQdVjaknRuYwWyz',
                      'children':[
                        {'name': '32LvhCLMnHsVJJN4UDph3EGncPFVTysaFC'},
                      ]},
                      {'name': '3BMEXR7Y9GmjqwKtqf2rHQboafeQJgivZ5',
                      'children':[
                        {'name': '3BEWE7mxwjjxcEHaRrQaHK8apR4zwDBfNY'},
                        {'name': '1QDoripajNbU5RyoPxBabXhiKcUTovMg25'},
                      ]},
                      {'name': '32Ku9iRkr6obN3GTg9kTWKVoPk2g3dksps',
                      'children':[
                        {'name': '3Gxtyue8hMCh1bfez23r8QsjwDE7V4Zesg'},
                      ]},
                      {'name': '3BMEXWUFWK58CCbEpCS7P8BkBbE62QMC8t',
                      'children':[
                        {'name': '1DJaskyUj3KvZ5ieZ7wPDNJrq7YaTbHbDm'},
                      ]},
                    ]},
                    {'name': '3BMEXeQsGKhrf6Cq5PEx8UX51uwQVmkP8y',
                    'children':[
                      {'name': '3FPx82bajKJJiC5a1ManE6ELmovcQfA7mW',
                      'children':[
                        {'name': '39SSqzvUCEH75Gmgb7iRUVy4L3H7Xmhtmk'},
                        {'name': '3MH6tDeiKfcERwzv2potX2ugeFRwy1rLRz'},
                      ]},
                      {'name': '18UznU413UMLVkYXVH1cPPkxFwbcGM8FnH',
                      'children':[
                        {'name': '3G9MtHZkxrzqRvpn5piZ39kTZovyhgNFSi'},
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                      ]},
                      {'name': '15httjarKXgD51vsxHSVaH2ZycM9Kro7uJ',
                      'children':[
                        {'name': '3Er6EvK1mPK8deeU8Gms1fGYpQuzMkEoco'},
                      ]},
                    ]},
                    {'name': '3BMEXJjp13DiL6H1NU1Wvs3RikEc1Rwc5T',
                    'children':[
                      {'name': '13jLt6y8gFW9L2A5PFvmX91JDttMGsoBeP',
                      'children':[
                        {'name': '3PdKaWwshFBWg6vAauToecqEAFtsuzyxGV'}
                      ]},
                      {'name': '3H1usz1h9vdr1FwJX1zjttYzepkkP5TfMX',
                      'children':[
                        {'name': '39dk7jM6HzQ8aYr8CwC4XSTNke8kXDJaQY'},
                        {'name': '1B5Cz6mUsDRat9BVUq7zAKSw2D4UrvbPik'},
                        {'name': '1B4hVGAbUo8GE7dEvnwJbT8pnd9mLBYN3b'},
                      ]},
                      {'name': '3AMusGPqFWgemfwZgWePkDuH8vYXCdkXYr',
                      'children':[
                        {'name': '3KK8sWwZSdMstFV7C8KEonLrBgBKvgXAji'},
                        {'name': '17ebDeJMx3kW9eGAHEpSgK14DnitYAfXYm'},
                      ]},
                      {'name': '1BVE7fQGEdKXjQUjsKKxtB99pVXGNbA1f',
                      'children':[
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                        {'name': '3LFbd2qzUgK7dtKfQ1MoZAerD5e4XorV9a'},
                      ]},
                      {'name': '15w2JL9Hc4KAh6viipAPFstRBzbPeaLVWi',
                      'children':[
                        {'name': '18TmwD2kWUwkQ4cyJwT6V5xZ7sXB9UdrhH'}
                      ]},
                    ]},
                    {'name': '3BMEX4V6bjHDVnaNs43YYmLZdza8rmiwUA',
                    'children':[
                      {'name': '33HRGqi5K8kHJxC5Dbx3ToSqCRK18Tzk2u',
                      'children':[
                        {'name': '348oPFeR2KeCwr4MYFeUwBuPTfEDC2PR62'}
                      ]},
                      {'name': 'bc1q86e7tq607p5xdp5eevqx9s72tp4hz80lg0t9zp',
                      'children':[
                        {'name': 'bc1q0d5wlsetj9a7z4gtxzn8yrkfwggxauy32cf3r032ls8yzmmnr4xqevr80z'}
                      ]},
                      {'name': '1Myupq37jrPY72nTTeqArbwPWZoyk7KRdQ',
                      'children':[
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                        {'name': '3AtsS9ehqF9TabFYABQSYTrLMtXJrsfzd2'},
                      ]},
                      {'name': '3J6Cm7TojB6GD4FXxKHqsmYApyx1TRCiob',
                      'children':[
                        {'name': '16JZyuUD2ZjFANzh6dL8cz23bdP8do9kVJ'},
                        {'name': '35MLUL1ynVmgAYY6DkaPtwin57TuYceDvj'},
                        {'name': '3LhnZVS7hTNvJri44gSoRRGBXJi9dfvgyQ'},
                      ]},
                      {'name': '1JVrfLVVFDGJ52uUhHQrYuiGdh2PszoF9h',
                      'children':[
                        {'name': '39mKJfQUSdEFD7WtgutQtntMWTYVBiKHnU'},
                      ]},
                    ]},
                  ]}, //20-7-22 23:11
                  {'name': '37nUDtTZbvMuTCVFvB51zff3ZzKjbjmGay',
                  'children':[
                    {'name': '37UBQSabDNRzkxpEFaoGDPuCexZkwYfQkE',
                    'children':[
                      {'name': '3MsQEN8CBrXqbfqNPFWNngS7LsyhULvp4h',
                      'children':[
                        {'name': 'bc1qwjys7jv6d43u74u9zylluy3p2v9amaydr92d9k'},
                        {'name': '1GiLXgUqn8As9nSx2WcDpy7rbXJsjkKtB3'},
                        {'name': '3Nz8p3PtPKx3EVzonHBDguGdgY8HpQykZH'},
                      ]},
                      {'name': '37VacCqrizsgwa7fGNQWP48wnvtV96mPcf',
                      'children':[
                        {'name': '3P89xqnjkpm47cLh5T4h6f36UKeEvwJotA'},
                        {'name': '3CyeRgstmpUHysExqEmEnWfAjMzx2eDDHn'},
                        {'name': '32nhZEqZJW19vGeNqEdskc6uxUynYeZuBP'},
                      ]},
                      {'name': '1GNS3BsdAjVYZnhwb21YnPBVLWykhpEHwo',
                      'children':[
                        {'name': '1JJY1D2hrdQNg3jgwFyKjEH14GMe9khxHh'},
                      ]},
                    ]},
                    {'name': '3KLN8hH3fuydnwkCAWxaWYJdtvan4jgrsB',
                    'children':[
                      {'name': '37UBQSabDNRzkxpEFaoGDPuCexZkwYfQkE',
                      'children':[
                        {'name': '1BCgYgDdrGqRUknY5BqM79whQ42fLAFc97'},
                        {'name': '3AMzsaimNixYTooPfw7S4cBme8s9pcaroz'},
                        {'name': '375Htj6zADisvXDdCEvMSASsTtHYHiJbyt'},
                        {'name': '1NRXAjyCdkpfBoihqEXdK6XqPVMWZsBrvQ'},
                      ]},
                      {'name': '3BMEX7qcKCAXuxxuBuLU6qsHn9v9qZKQtJ',
                      'children':[
                        {'name': '1862W692S7EDeNpCnCBr6S3WmPNBYy2tTp'},
                        {'name': '3BMEXM8ViuNru9R4vbQSNp96kLbcsdtF4w'},
                        {'name': '3BMEXpYgXKSCWwtjFegmStJWBDy4g3RqCU'},
                      ]},
                      {'name': '3EnU6j5NGiUEbE6GjpqFrCLeuxF4T1W4sh',
                      'children':[
                        {'name': '3EC8UPrPcL12sKCp3jZDsBDLQXSveU2efu'},
                        {'name': '1AkP1hocJfTbHGeqo7DZgeJRc28z2G52zE'},
                      ]},
                    ]},
                  ]},
                  {'name': '3P6vtGnMCYjhh7DV3AGodZ6mqEzaucQMWz',
                  'children':[
                    {'name': '1NukruGsWj355Wyyb5KVSPyFH3DXz7G22b',
                    'children':[
                      {'name': '16nd6hKvHo2wQc6PJFKvkA7AAfZazTDnGN',
                      'children':[
                        {'name': 'bc1q9p0h7xsvh7c0nscz4lxgr6jf0umnf4uzu530h8'},
                        {'name': '1AjvivNtveixdJFwCTYjF3dSKHkyGL4Vdt'},
                        {'name': '3PppJrrWEqAc5xyyR1bhgKpDdh787uTXDi'},
                        {'name': '1HYLnspLwsobWBi8FmpNH9kFKVbQ4e4hGh'},
                        {'name': '14GGPgVgeKp5MAvL9WdGL5w6gJ7F7j78Yp'},
                      ]},
                      {'name': '35GGkCyngTwrfNhKyYvznRTTkvhAGP8Hei',
                      'children':[
                        {'name': '13gqv32zJHhA2sktfeZNWcXBbFAYXHChGQ'},
                      ]},
                      {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
                      'children':[
                        {'name': '3KbtA5a6ySqaqW2hKW7f3tgQk1A8YHCPRF'},
                        {'name': '39Tmuu2mvTo9hSfyQ4xwryYSPzHxKdVeZR'},
                        {'name': '3PiXmZb8XC8Cib1csrj5hq2qcWTG9JP7iG'},
                        {'name': '3Q4yuiCbxx64s5FqWzCTwMgsim4LvagUzY'},
                      ]},
                      {'name': '3J8JujeQze5JHLofNzFEzUqnn6BCfLi2if'},
                    ]},
                    {'name': '3Jyc3vWZkUu8PUfqdRyoMmrmhm4JCbknt5',
                    'children':[
                      {'name': '3K3JtLq4BCV1JFQPuvXFNrhcVdgwvxwgy9'},
                      {'name': '3BM8ij7cnHPeerFwGkCcUan7GEGx5Te5TM'},
                      {'name': '1AaJszcGjW44Pv6RE6SbPLaazu2APXrK7U',
                      'children':[
                        {'name': '31n7Q4JQLL8xHmsna2yy1AS3JPe3KKpkTd'},
                        {'name': '3CTv7u9r5SiapuueTtUaZjFTbTsx88Poyr'},
                        {'name': '37TyQ48JReFDYmijWaHH6Sa5ipZRE8FWDa'},
                        {'name': '3Bt2Jce8AVNrt4vSTULDSssBR55VrNiewj'},
                      ]},
                      {'name': '18abbQ9dCDEyKy5JcmFxKURhmYs12ktikz',
                      'children':[
                        {'name': '17ziohvhzpUEPtWqTG9EevJPRPbogW1XCf'},
                      ]},
                    ]},
                    {'name': '1AaJszcGjW44Pv6RE6SbPLaazu2APXrK7U',
                    'children':[
                      {'name': '31n7Q4JQLL8xHmsna2yy1AS3JPe3KKpkTd'},
                      {'name': '3Ctc81ZA8XMmkUDBri1hCwJhynLEsFNaYo',
                      'children':[
                        {'name': 'bc1q2qr7mykz37l6s89fpfp86w42pvxdlm8gct840m'},
                        {'name': 'bc1qdcv7ke9drvwv4nnxssry9wk8n8pejndh6vu9m6'},
                        {'name': '1EUs4HckMV741TqjrdWP9WdJBrwmjS5t9A'},
                        {'name': '3HsdVQBLNYZqtFUDd7DSnC8bxkGMEBUrS8'},
                        {'name': '16TkXK3CuDpsyByerHByWVzwXt2oyGYgkU'},
                      ]},
                      {'name': '34MRXQoBAyqXLcJfe7njAWRdVBmpu1Ay1V',
                      'children':[
                        {'name': '35bdcDad66hAzNe8RRqc9vQPWPcPsb7G4g'},
                        {'name': '31n7Q4JQLL8xHmsna2yy1AS3JPe3KKpkTd'},
                      ]},
                    ]},
                    {'name': '3EqdtdTTZuftKqV6m4ZGFj9KFepesYr9cw',
                    'children':[
                      {'name': '3BM8ij7cnHPeerFwGkCcUan7GEGx5Te5TM',
                      'children':[
                        {'name': '3KbtA5a6ySqaqW2hKW7f3tgQk1A8YHCPRF'},
                        {'name': '39Tmuu2mvTo9hSfyQ4xwryYSPzHxKdVeZR'},
                        {'name': '3PiXmZb8XC8Cib1csrj5hq2qcWTG9JP7iG'},
                        {'name': '3Q4yuiCbxx64s5FqWzCTwMgsim4LvagUzY'},
                      ]},
                      {'name': '18Gi6umH8FTsw8K96F3FuQsjQv64MtojLu',
                      'children':[
                        {'name': '14yGZfrytsa5yM5fsN6tiJFz6sCTZcoars'},
                        {'name': '1MkZJexkwittufCnjv8CPocjSvMP7g83Vn'},
                        {'name': '344rWkqRnhWjUczAudPytPNkU2F4UH72Dk'},
                        {'name': '1DU74gCV2sbhsarBhz4osUejvtfoHcCgL'},
                        {'name': '13BrA9UVRDCqXHvpFKJigHM65A3Cqm7YWb'},
                      ]},
                      {'name': '3ESaNQGuEu3dan7zWDA3asHjGP2KcayMf7',
                      'children':[
                        {'name': '14TDxS9NQhiu1tX4qeFwRkisXn1oDmTuKB'},
                      ]},
                      {'name': '3BMEXp5uTSgfn24nGr1fRhNAEkAuE2qWyq',
                      'children':[
                        {'name': '36jDgQVvohNiMZfGJMJE22sRL77XpgWRSR'},
                        {'name': '3Dgmw9ZKHZUGzUHnMKNbDmBGeJf8bDrJkk'},
                        {'name': '1ZB2AQ9sMPwRJwwnyYDCufKCNfmymX7AE'},
                        {'name': '3Qd25mhcmz1LyNsNASiuSu9SGHod4qP3Zd'},
                      ]},
                    ]},
                  ]}, //20-7-25 00:42
                  {'name': '32Ldob3ganRwCj8j7Jftpx6T1E7MhFSz84',
                  'children':[
                    {'name': '35pch86nqwGWzA9auQtyxi9YcuoLeiNn39',
                    'children':[
                      {'name': '3Lwy4JtD3sC2iEieVRT9AW1fhTLkR2W1Cp',
                      'children':[
                        {'name': '3PmroVRdXLDMXdRy6thkCiG98kMkX8jTNi'},
                        {'name': '1CcDwnAC8FLgRmxNomnMr7ohoMVLiDYMYZ'},
                      ]},
                    ]},
                    {'name': '3Lwy4JtD3sC2iEieVRT9AW1fhTLkR2W1Cp',
                    'children':[
                      {'name': '3PmroVRdXLDMXdRy6thkCiG98kMkX8jTNi',
                      'children':[
                        {'name': '174AXxaADwVU3XEwTh8dWsNBqwRR68NhMZ'},
                        {'name': '38Z1Kk4rihsSoswfTzuDPNLttujgaar7dZ'},
                      ]}, //21-03-26 21:01
                      {'name': '1CcDwnAC8FLgRmxNomnMr7ohoMVLiDYMYZ',
                      'children':[
                        {'name': '13jDidUB8sXQXCfocHqV9YpMepAeXWpaaa'},
                        {'name': '3M1ZV7pZbMkeNq5qMe6wTCYdW3GSkQkwZz'},
                        {'name': '1uG7dwP5uDZSmZGyvLfV1F7rCf91M8zHd'},
                        {'name': '19s4TTDMin9tQEdVFif3AuZg29pwJdmRYw'},
                        {'name': '356jfVwKmi8HzAmqMJ6EW1x1zD8sfxTzir'},
                      ]},
                    ]},
                  ]},
                ]}, //20-7-22 22:11
                {'name': 'bc1qvmfwvacv7cm4uqjyk3d5ynu33hgw28kgts9kzl',
                'children':[
                  {'name': '1DCf51a1XTqhLMjfzuG2Nd7fpEqVUzrxSL',
                  'children':[
                    {'name': '37aFXFWK3Jbs8R32FfAbwBoPyRnVSFhCas',
                    'children':[
                      {'name': '3PaBaSKbd2L7iqPTzoxiVWHw4hREz3VtEN',
                      'children':[
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                        {'name': '39dc3kDTFCkx8kGbPNGpa2CWFbG9zQSuYE'},
                      ]}, //21-03-26 21:01
                      {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                    ]}, //21-03-26 21:01
                    {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
                    'children':[
                      {'name': '33qYRKxmgTxRoejmn2M4XdLa1a1k2wg5k4'}, //21-03-26 21:01
                      {'name': '3Q2uW98YUUh92nzHKosAsd4W5JQwrpPRXQ'},
                    ]}, //21-03-26 18:30
                    {'name': '33zQf81R1Uu2Q713cho6zZxBQkP6GthYhx',
                    'children':[
                      {'name': '34Y92BCwLeAQjU948DJEwUDAFpc1eogxdS',
                      'children':[
                        {'name': '3PPqmrWXg636sjtxzb9W4vXmWKvPFxowti'},
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                      ]}, //21-03-26 21:01
                      {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                    ]},
                  ]} //20-7-25 06:14
                ]}, //20-7-24 22:17
              ]}, //20-07-21 12:30
            ]}, //20-7-10 00:18
            {'name': 'bc1qwv84d76gda984zz9mlqas5zjl5deuma2x85aqu',
            'children':[
              {'name': 'bc1q7a9n9cqy8yg38vyzmrs0vxqhr3f3ejfsqq8lft'}, //21-03-26 21:01
              {'name': '1M2iAbUvDzi9BckJgt2FpJG3dm2puRoDfG'}, //21-03-26 18:30
              {'name': '344J6TRTnN3dGwYdwo8dREHryjp8zTZ3gd'}, //21-03-26 17:22
              {'name': '3GWBGYewQkyoTy7WjjwsgDiGtmXntsRYfs',
              'children':[
                {'name': '3FShBJBia1aWJ5YgGT5XcRf91siPFqBiGb'}, //21-03-26 15:33
                {'name': '1Auz3Rhw58JB1E1YzD4H4kzB8K6kQKbjGL',
                'children':[
                  {'name': '1BMU7kVcqDDGbjnoyU6P4ycmQjEq3LkAZ4'}, //21-03-26 17:26
                  {'name': '3HztEkJCkTLeEB4nc1gMrtRUTc4qNzSK2a',
                  'children':[
                    {'name': '3NtbmvPXyiUTv2udVb3go8ZqPNx6exqpNw',
                    'children':[
                      {'name': '35kQsArScN6W6WQbVztnTnn9cLudueqSSX',
                      'children':[
                        {'name': '387NHeffRgeNFiUH4tMkYtiSgpXnykmJmo'},
                        {'name': '3FsWLmoc3d3uiz73jyeF6eMZNskkPyFLTh'},
                        {'name': '3QjwsU5tiUSW7y2J1qZauoPNFK69MrS9df'},
                      ]}, //21-03-26 21:01
                      {'name': '1MqcoDwZz3DmAxVCbNDbfbmhuKdNg3CiT5',
                      'children':[
                        {'name': '154h7M2sjRhmmMbhTYhyUiqGe4XboEAKiu'},
                      ]}, //21-03-26 18:30
                      {'name': '39MrayfVucCmGEDwiEgnygHFK97ysPp7qU',
                      'children':[
                        {'name': '35aGS19vBzPoGjABfqhzSWqGbEJEAqnWae'},
                        {'name': '1FoPKanHLF7imxw7phmd723rt264JCxkhe'},
                      ]},
                      {'name': '1HaXX952aMwbFn93DNQYpkppGNtVywa8UW',
                      'children':[
                        {'name': '1L7xjFHTp81z3L3nADa335TmJ1UKtgZM4U'},
                      ]}, //21-03-26 18:30
                      {'name': '1GxLaofy6aUiJytktC4tCTUfuFfBSMMTu8',
                      'children':[
                        {'name': 'bc1qfmlxeemyk8a9stz5z4plpqgj4255hcx9jsqvyj'},
                        {'name': '31rfNmts4ucjRy9CXH343rCY8J3WSfDQ73'},
                        {'name': '12pyNh3RjSd2i17HiUDiTJ5t91YAcWWZ9H'},
                      ]},
                    ]}, //21-03-26 21:01
                    {'name': '3ARTUJqNXxPvyuR6gkwYx3mGFV5xpR8nL4',
                    'children':[
                      {'name': '1JLypUj2NBLPWMDtueSMbcKp6F6YbPq7dc',
                      'children':[
                        {'name': '16GdNZRR7ubtXg7ZwAbm1Ai2ny9eAb5ZHb'},
                        {'name': '3PPLmpbU65UT4R3AoXSADphSRuiZ86syB6'},
                      ]}, //21-03-26 21:01
                      {'name': '19Ts96C1tRZMbzP6s6XhHFXYP24uoCJu3B',
                      'children':[
                        {'name': '1BG2dp5pJV6DDbKyMdBr5JXzt2r957LtUb'},
                      ]}, //21-03-26 18:30
                      {'name': '3LFAZB7UCD8CN6h3cgCehT2t33W8jTqcj8',
                      'children':[
                        {'name': '3EQLEZ7nd42WTHJCTuVtiTBdS9PogiXm6T'},
                        {'name': '1NyUgvoxiXFMMn25sXuE3123KwcCSEL77i'},
                        {'name': '3NCahNxKvMSYwEpeUpSd9C9Nkekt9Ziv8e'},
                        {'name': '325JXsAZdcLQPKC1WjoE1HmupEmbbKBz5c'},
                        {'name': '1EatZQyoC3NLJLDsF6CdUsDXCvDbmcWCEe'},
                        {'name': '3BTXrmbApHJb1PruGd2JsXMV3ZvdbnZ4kc'},
                      ]},
                      {'name': '1BMZuertnkU6vRsxXc797iJ5H4oo5HGsRZ',
                      'children':[
                        {'name': '144j4HEsNQbpmedaA8TDUub97WBK2TYu5U'},
                        {'name': '1La4VcUAHCT3QsbW5cpxcEGgVQ3rf8P4cF'},
                        {'name': '18pkvgFkFVLhNMwCvqK2mS1Vre9ZSjDDts'},
                        {'name': '1FEXnWa3y1SBNwyH2xh2Do6RTdfrmgcnXp'},
                        {'name': '3NwcFKUoVwjJBvE2Km78QgntfNXd7GgZnA'},
                      ]},
                    ]}, //21-03-26 18:30
                    {'name': '344J6TRTnN3dGwYdwo8dREHryjp8zTZ3gd',
                    'children':[
                      {'name': '373GifzHRGRBALbtxHNhhQpZ9DqGuet4Dh',
                      'children':[
                        {'name': 'bc1qen3muguknret09qgjltz2u2kgacqpg7tf63pta'},
                        {'name': '32opsCNCaZ2M5Nk1EncKLJbTgA53RUEM3a'},
                        {'name': '3QipWsiseWBaC4dV2FhBy5LVhg9i3PwHRK'},
                      ]},
                      {'name': 'bc1qkf9egw4ff0hqh3wfe4m2jvxdm2zj58c5eattnl'},
                    ]},
                  ]},
                ]},
                {'name': '1LB6MaxuPiXGapSc7yNYCMu765DUyaZKNP'},
                {'name': '199vEa8xsTeqFaH5kEzfN7ShhZuVosU742'},
                {'name': '1MU597VNmJFsBYfunovydKrC49FWo35c4v',
                'children':[
                  {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'}, //21-3-26 19:02
                  {'name': '32A6tnarBiCKsiY9VcJxnmWCDcShgS3bq1',
                  'children':[
                    {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
                    'children':[
                      {'name': '34oqqNs42ZCRr2QGUi22hcXt89Dn4jMjyi',
                      'children':[
                        {'name': '3H189B8PioqtqWGVtiao4jZWxfD7k6ANEc'},
                        {'name': '3PXcttrozcJF2uz6kikATnqJ5F8FEvVeS3'},
                        {'name': '32LJEZnD2nWhxzpALvZJ4SKGvjk1DQbpeV'},
                        {'name': '36LBsjEXMRoTLNnMaNBZDkCzPsaJjd2sVg'},
                      ]}, //21-3-26 19:02
                      {'name': '15AQSdzubwXkLs7YY6KpUUTocPciSdE1eN'},
                    ]},
                    {'name': '3786wbsSRyasMwvW2zgiFL4mpGUbzx843A',
                    'children':[
                      {'name': '3LMAxyRrfR7pGqPpqKzUEesURSgJmETZNu'}, //21-3-26 19:02
                      {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                    ]},
                  ]},
                ]},
              ]}, //21-03-26 15:13
              {'name': '3FnNuja67ogFom5deyWfRE2Vr28XEv8GwC',
              'children':[
                {'name': 'bc1q5k9jcvrak46l2m4ngezz93al8zqej0645vs7qw',
                'children':[//21-3-26 14:25
                  {'name': 'bc1qkzz4cr42mdt6p7qfgv26v3k7l32zsdfcrwljm8'}, 
                  {'name': 'bc1q94zk53xm0vqpnqam53jng78q75zmyt8qvakpn4'},
                  {'name': '37cWkMx6MYp8a7DpXNEr7wQCTCoaRENNNA'},
                  {'name': '14s1XawoZHvZMhVFNM6A6aRVhCpoNoFxUD'},
                  {'name': '1Pvcff9a3xKL4HsLSHwamV3AFETkcj1YJm'},
                ]}, //21-3-26 14:20
              ]}, //21-03-26 14:07
            ]},
            {'name': '32CanXFB35uPaP6F6fQX5GWWDqt1KtUTyL'}, //21-3-25 18:25
            {'name': 'bc1qwv84d76gda984zz9mlqas5zjl5deuma2x85aqu',
            'children':[
              {'name': '32CanXFB35uPaP6F6fQX5GWWDqt1KtUTyL'}, //21-03-25 19:21
              {'name': '32JMEnGAeckA6cDwhv79jzzaepjHTtjRQL'}, //21-03-25 21:18
              {'name': '1DPdSceruocoYbCVQrfuqJsuGGUABycxQJ'},
              {'name': '3FWWnUSCc851JRX2Dm4WUkKb46uoKXKQrP'}, //21-03-26 03:16
              {'name': '1Ej39kG4vpRsirEKGD57U2FrUFbgPbHYoP',
              'children':[
                {'name': '34pVVtUZSHUiQLc4euEVmwafQHCXRDriUm'}, //21-3-26 04:46
                {'name': 'bc1qh7ukp648en0lrgfjafa4ny04y4eqv4f5gqns5j',
                'children':[
                  {'name': '34pVVtUZSHUiQLc4euEVmwafQHCXRDriUm'}, //21-3-26 05:19
                ]},
              ]}, //21-03-26 03:44
            ]},
          ]
        },
        {'name': '1KqrmxbT9EeUdK3gPTZaH7kswsx8k7Kfnx',
        'children':[
          {'name': '3Hksj7vCYPLa5oKua1YBxrbDXpuZzAGcXc',
          'children':[
            {'name': '3EuSgzcJbdSqU2jryBiEfDN9DXeYkxiD1g',
            'children':[
              {'name': '3Cr1SMcfZBUfrB8BMwhifJLMmqraVhVfpY',
              'children':[
                {'name': '19iVhUEvzUERkrKqaGhrAt9QY7NtHxQomC',
                'children':[
                  {'name': '17joX5ydVdqe4S39ukx3uE2qvZCsxmuzUV',
                  'children':[
                    {'name': '1F4mNxMRPdVzdcoaqm6sjpHs4jJLtRgU11'}, //20-8-29 17:42
                    {'name': '3JSxwQu5efMZER3u58Y1pUr9kcMbL2tDq5',
                    'children':[
                        {'name': '3ByKbDxF1iAMRVjBQFBXq6rRhatn3ht62V'},
                        {'name': '13EV17cfgnK4MsxoQwoVqNr3hSqaGJQob2'},
                      ]},
                    {'name': '1725bSdpoj44wT4CNTSaQXUJUc647H9wmg',
                    'children':[
                        {'name': 'bc1qac30pfppv7swd37y3dmwp0a28enzdch7lf0l0p'},
                      ]}, //20-8-29 17:42
                  ]},
                ]}, //20-8-28 14:51
              ]}, //20-8-28 14:29
              {'name': '14WNcZNmC4Tt957JprWeKMZVdTTCiAMMGC',
              'children':[
                {'name': '1PpPhDeM3hhHSiAc1e2U2FpQ92XhF6X9No',
                'children':[
                  {'name': 'bc1q43py8du03tx78rn8v8xv9e97x3xqh08urae2zw',
                  'children':[
                    {'name': 'bc1qmmhqpqr28xegvhdeld8yv2ppstm9lpuak8fpqp',
                    'children':[
                        {'name': 'bc1qmhzkhzwzwwgrtlw4suyypvjxqec7e0cfyd8g8h'},
                        {'name': '39wiEu8JhFqC2M5jtacqgt5qjqX8y7ec76'},
                        {'name': '3L1Gw1zK7deWYb2VZbLmidycnf7g7rDgsf'},
                      ]}, //20-8-29 17:42
                    {'name': 'bc1qxkjg4u20m8avg7d72zq9pdk3pwdmvljqr9522f'},
                    {'name': 'bc1qznslp5drg3pwgvxrsz3je9vrqusqjykffz3fje'}, 
                  ]}, //20-8-29 17:42
                  {'name': '1AGAq7m7stYxwju77WQUgfRvBeGM4VWvUY',
                  'children':[
                    {'name': '14cugy8Fq3RVok7K1n7KWRqXGYApwn1wwh',
                    'children':[
                        {'name': '38kGMudskooDVzXYRCKCdQpiVkHf1d3ZyU'},
                        {'name': '12PieU3dzKtuMXH76HjqZn1UYkcH4nht9L'},
                      ]}, //20-8-29 17:42
                    {'name': '38kGMudskooDVzXYRCKCdQpiVkHf1d3ZyU',
                    'children':[
                        {'name': '34yy29dKHwHVibS9LWB1ZDGgNY4AT8Ke9h'},
                        {'name': '1AzpwYfAdZnAZgFESfgMvVCTHoYhhrksT6'},
                        {'name': '31tYTrRxwqmkbGBmaG3EY3dX2TrasiiTAp'},
                        {'name': '3Ji2YmWnQZJKJcw7ePVzbXhui8kHNWXvsP'},
                        {'name': '1JEnWj5MYnw37EU2wUqoJzMrVAbxdgUkTg'},
                      ]}, 
                  ]},
                ]},
                {'name': '1AGAq7m7stYxwju77WQUgfRvBeGM4VWvUY',
                'children':[
                  {'name': '38kGMudskooDVzXYRCKCdQpiVkHf1d3ZyU',
                  'children':[
                    {'name': '1EWi9DTLwKr9kWgpa4njhfDuh3Tjnw1rQx',
                    'children':[
                        {'name': '1CxRJM6KqHVA3XU3EQM1c1kxEFUNpKjfNw'},
                        {'name': '344SVmSGdpT4iDsNFmZDG5LuqG4fe5koRv'},
                      ]}, //20-8-29 17:42
                    {'name': '17dtw7SMApDHjmGoAFoL7Eyyx3JBURr11s',
                    'children':[
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                        {'name': '35ZixTVXAwpHNBmfRe59e95HrN4hb8UW4a'},
                        {'name': '396QTRH5exCxBd574mJRhFv1ca2L8XVUYF'},
                        {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                      ]},
                  ]}, //20-8-29 17:42
                  {'name': '1PpPhDeM3hhHSiAc1e2U2FpQ92XhF6X9No',
                  'children':[
                    {'name': '1AGAq7m7stYxwju77WQUgfRvBeGM4VWvUY',
                    'children':[
                        {'name': '38nLJTrawFTnMHrD1ZTWrKe4HWPqawYDSM'},
                        {'name': '1S15tiDjypwFuvN2ww56wqyAXvwuvYY2u'},
                        {'name': '3BMEXuszyXTxhrGbWECmTYQCsSaxMCtBLW'},
                        {'name': '16xQ87RgtNMXsZfJBNZAr7bALexq1CkRxL'},
                      ]}, //20-8-29 17:42
                    {'name': 'bc1q43py8du03tx78rn8v8xv9e97x3xqh08urae2zw',
                    'children':[
                        {'name': 'bc1qhccr2qq7pcm6sd3ezn4x68ct7u749w77clmqzu'},
                        {'name': 'bc1qw657g4ygp3323d2wjxg8zge6drj5v8s007jfrc'},
                        {'name': '1GFwnN7QHYjCRkHCink67p9z1NYudmKPmZ'},
                        {'name': 'bc1qlpx4x9nz6hqzf2th2l0r6t9k00078rqrdpuatl'},
                      ]},
                  ]},
                ]},
              ]},
              {'name': '38PzsLJuDuVyizr1W575XGWSSggxnG7Pyp',
              'children':[
                {'name': '19iVhUEvzUERkrKqaGhrAt9QY7NtHxQomC',
                'children':[
                  {'name': '17joX5ydVdqe4S39ukx3uE2qvZCsxmuzUV',
                  'children':[
                    {'name': '1Gbod62PgFD7HmDN7BE8xXLUYdULXU5JQ3'}, //20-8-29 17:42
                    {'name': '1F4mNxMRPdVzdcoaqm6sjpHs4jJLtRgU11'},
                    {'name': '1725bSdpoj44wT4CNTSaQXUJUc647H9wmg'}, //20-8-29 17:42
                    {'name': '3JSxwQu5efMZER3u58Y1pUr9kcMbL2tDq5',
                    },
                  ]}
                ]}, //20-8-28 14:51
              ]},
              {'name': '1oNBhxRT9SxmoVc9UjdWHmLiBJGgRYfE6',
              'children':[
                {'name': '1LAVpW441a4Y7ew5VBUVcrLfmXwjhMmBGN',
                'children':[
                  {'name': '17UkykjEfYom7dRMUR81H6fY37JbiNxE93',
                  'children':[
                    {'name': '1AwYkiviMDaf6iSBB7o7Fs8bWPHDXnWHq8'}, //20-8-29 17:42
                    {'name': '14aKQvCBPDmAmYderX4V8Hkd7yD5Shz6C4'},
                    {'name': '12rmk5ky7nLRwzMYKgJo9y35ebh7fnBfo3'}, //20-8-29 17:42
                    {'name': '16aTqgoWE9nAm5wyThod7hPRkcBxys7npd'},
                  ]},
                ]}, //20-8-29 17:42
                {'name': '17UkykjEfYom7dRMUR81H6fY37JbiNxE93',
                'children':[
                  {'name': '16aTqgoWE9nAm5wyThod7hPRkcBxys7npd',
                  'children':[
                    {'name': '19RJjgJNCrXjgvaqLRe8hMRLQpnP8PerhP'}, //20-8-29 17:42
                    {'name': '1FSNfNyfkXMGKCJxYykVtzKHaLgCzmcVA7'},
                    {'name': '16aTqgoWE9nAm5wyThod7hPRkcBxys7npd'}, //20-8-29 17:42
                    {'name': '1JQv9tT7AVgZftrRbcE1eZUc4NHwt6ixEk'},
                  ]},
                ]},
              ]},
              {'name': '35K6JfiAqVzxLkKkNNkRYTd1dYGKsdcM3d',
              'children':[
                {'name': '14KicBeg9U5VykyajSStYDAWcLiNZycYQu',
                'children':[
                  {'name': '3Qx4ZzZCL2AzKRW3e9DQYsJ7YkqecERNUT'}, //20-8-29 17:42
                  {'name': '13hnYaAncsHATKfofBorngwRTT55DrbTzT',
                  'children':[
                    {'name': '1JHX8aQ7oMoPMMEsntsvmgBhkxeuFKiw2A'}, //20-8-29 17:42
                    {'name': '359y3DnFciBu691U6SvSryyTfxxSpWyKLi'},
                  ]},
                  {'name': '14EfTozp6tsrbRpQba3JEwaNjy2s6pngAK',
                  'children':[
                    {'name': '32wyE9mbDWF5kvmU53uWyMwxgrdg1KiSzq'}, //20-8-29 17:42
                    {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                    {'name': '385EiyPJLpyCmbo68FZoGSSFVBGwg6AiAu'}, //20-8-29 17:42
                    {'name': '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s'},
                  ]},
                ]}, //20-8-29 17:42
                {'name': '3PG6fEnkEvdAbuiCGqhXPj98XCD2pEYo5u'},
              ]},
            ]}, //20-8-28 12:16
            {'name': '3DTVgGkakcLV4aJ1GhMD1p36BGyFafBLVn',
            'children':[
              {'name': '3EuSgzcJbdSqU2jryBiEfDN9DXeYkxiD1g'},
            ]}, //20-8-28 14:15
            {'name': '3EuSgzcJbdSqU2jryBiEfDN9DXeYkxiD1g'},
            {'name': '3DTVgGkakcLV4aJ1GhMD1p36BGyFafBLVn'}, //20-9-30 23:41
          ]}, //20-7-10 09:01
          {'name': '1btd4jUPtMFs4GxCx33ucXYJky7Ti3oaz',
          'children':[
            {'name': '17EBaC9MHJg9WBWVYZX2JDmWDWwcC2XZLo',
            'children':[
              {'name': '13Q5QRfEppEfd8C82wdoefXqVUiNkXbnTS',
              'children':[
                {'name': '1A3DnQB4xAuiTBN2HEyHe1ougSAGyo3nN5',
                'children':[
                  {'name': '1CTF4YaprephHqEgohmQVyAfqNjevWeLt',
                  'children':[
                    {'name': '1M1KaG8gyBQE7M22YgqudH7TdnpJiJ8hfh'}, //20-7-14 06:07
                    {'name': '3EodZVgTGfPC5NTfjRLyd3rb9Tm2DguJ6r'},
                    {'name': '1EECtGr18NX8GVswqRC7ivZbCPoCoVAc9H'},
                  ]}, //20-7-13 10:04
                  {'name': '1NZm9UQW5BUBhjHPVr1HCrp4TpgS9D9rdz',
                  'children':[
                    {'name': '1CTF4YaprephHqEgohmQVyAfqNjevWeLt'}, //20-7-14 06:07
                    {'name': '1CNy6te14Jp1YqUWYgfVf6CpWQ2ZFyuoFJ'},
                  ]},
                ]}, //20-7-14 03;03
              ]}, //20-7-11 20:24
              {'name': '1D4pnpTYTJwWQkYE1vVh8RnP4TUz33gXR1',
              'children':[
                {'name': '1NgSCgvKLmxjoNmiz7igfCXtKkDM64iCKZ',
                'children':[
                  {'name': '1J959sxicHU5Qii9AuyibcoMGoxujxrKBW',
                  'children':[
                    {'name': '12Fnd691EqCfJGJ3kpaeMkoqxtC5eJq3zX'}, //20-7-14 06:07
                    {'name': '1AGAq7m7stYxwju77WQUgfRvBeGM4VWvUY'},
                  ]},
                ]}, //20-7-13 10:04
                {'name': '195Z1yhL3fgitvtmjf3wD9V7Sh1MjyVgGi',
                'children':[
                  {'name': '1J3mvtmnHSz6ZhjPd2cN4n71EFPCfHTQ2L',
                  'children':[
                    {'name': '1Fpaud4c77RiQT3fGki7YjCxgEwKg6M4zV'}, //20-7-14 06:07
                    {'name': '1KR6tE5zBCFRs43yrYPQfmchWvCgACj6Nv'},
                    {'name': '1EQnJngjYX3woimdAvbcuz4ZqX7Qgk22AG'}, //20-7-14 06:07
                    {'name': '121TWEbBPYDUJrB39oZ57hYeD84VHGPcgP'},
                  ]}, //20-7-14 06:07
                  {'name': '14XNkzSawZD1wBTtY4RfVkot5mxNG279E3',
                  'children':[
                    {'name': '12f38TRPfk5Ruiob6ZsmLSiMtzASyLc1Uc'}, //20-7-14 06:07
                    {'name': '1A3WU5LSnU9eF32Ea4q5npiyPUbt7JSnsW'},
                    {'name': '1DVbaxsABHP8sR7pb8gEzSNQSchLHHxum2'}, //20-7-14 06:07
                    {'name': '19rimMbrHT1FnsejHv6ShC9sNyzThRoRe3'},
                  ]},
                  {'name': '1FzEbp3KvRvaL4TLrssEFgVUAQZrTQsFBt'},
                ]}, 
              ]},
            ]}, //20-07-11 01:22
            {'name': '1KRASKDbYFGuoYf3uRz3qo3bv2YRfLxPK6',
            'children':[
              {'name': '19646ekDt1rndq1uVaqTaKwtYeStKkHc7',
              'children':[
                {'name': '16RUWbN1JM5DePevCLwWNVB2vnJ415XFwt',
                'children':[
                  {'name': '1HVPzF5GB47Yr9V9UQ1bqeiQmkb4Y63zBn',
                  'children':[
                    {'name': '1Q5bmZBn9rMRivk8PAmZgGa74U5xbnYKY7'}, //20-7-14 06:07
                    {'name': 'bc1quqsyt6788vckdkpq8q5f7xn9csla6v03hzhqlu'},
                  ]}, //20-7-11 01:28
                  {'name': '14ELbYiwh7HTqQZe1RkLzgCuwZdoqGMRzh',
                  'children':[
                    {'name': '135fGENESjSu5qBGQawVYzR1Hw7pX1Sbeg'}, //20-7-14 06:07
                    {'name': '1DGtiVY9ehch5VRUKF13GMkjTJ8DtXthyd'},
                    {'name': '1MiuJQyL11pEvdeEAPdtffzVDcmE1XrZKV'},
                    {'name': '35twpuEAMwkm68o8zgbdKtwyd3uRC4kdbd'},
                  ]}
                ]}, //20-7-14 06:07
                {'name': '1DGtiVY9ehch5VRUKF13GMkjTJ8DtXthyd',
                'children':[
                  {'name': 'bc1qnm2uctq3ldsd69n25ajf8mn3rngy84puewkv9m',
                  'children':[
                    {'name': '32fgHVWDVFPJANeALaXSwtiZs4Qy4KKr9A'}, //20-7-14 06:07
                    {'name': 'bc1q4gh5506u0tf07am43q9qv4xgj9urayg39hw378'},
                  ]}, //20-7-14 06:07
                  {'name': 'bc1qqvg7m3y5ss60kq9yy0p4a86h9zqj96zv06sj6e',
                  'children':[
                    {'name': '1MuwtCpR5vJWcFLTNfFDtbt2PU8cba3Das'}, //20-7-14 06:07
                    {'name': 'bc1qlaffk6xvnp75d00tghyptr9jer3jehhax4tdny'},
                  ]},
                  {'name': 'bc1qhh7l3jk2enycwhrzu7rltgqpcrkzuhgz956ws6',
                  'children':[
                    {'name': '1Du8hHuKUZrdSySdtfcnsmo6N8s9CnBYCX'}, //20-7-14 06:07
                    {'name': 'bc1quckqnf3thsqnqawhqtqxf5vx09r69a9x9tqr67'},
                  ]},
                ]}, 
              ]}, //20-7-11 01:22
              {'name': '15UdQamNcrLPmXaPfP8JdZ2JdwW43XxysS',
              'children':[
                {'name': '19X8hz6fzNsJF7fZW3mFSVRvFfBfRtABqp',
                'children':[
                  {'name': '3LfeZ6ntye4oq5PxYHpSrRjGr8uyxEpk35',
                  'children':[
                    {'name': '36U7mk1D9j8yxzF2GGvq4PbaMjzqwh6sL9'}, //20-7-14 06:07
                    {'name': '3Daw2pzMKCDkducLJLP3fJq7PNJzBt2yvd'},
                  ]}, //20-7-14 06:07
                  {'name': '1iUiZSqnMXj6vLf1awEDS7QZko3b2d9Xg',
                  'children':[
                    {'name': '3Jr5EiFY849oyvzBbqM6Jcr1cBNi8ic773'},
                  ]},
                  {'name': '32u3mLWLB4e2mVj2gM9E5U3vFmC4S6XyyH',
                  'children':[
                    {'name': '1C6GVzqmsArgXmDpFewtMGGjpYcrkCHJji'}, //20-7-14 06:07
                    {'name': '13oN6sgjiAR5QxAX3LhyAuUq5ycuNb8rRd'},
                  ]},
                ]}, //20-7-11 01:28
                {'name': '1JXzq8aTpyxsCoLGAsqWvnbjE8W9PnydBY',
                'children':[
                  {'name': '19U6w1dmJ5oVjqBqCHS9SDa6rSjJumfg3J',
                  'children':[
                    {'name': '1PPvDXWuBNAv3ZrrUhDobEjvgnQF1bxNaB'}, //20-7-14 06:07
                    {'name': '19646ekDt1rndq1uVaqTaKwtYeStKkHc7'},
                  ]}, //20-7-14 06:07
                  {'name': '19646ekDt1rndq1uVaqTaKwtYeStKkHc7',
                  'children':[
                    {'name': '16RUWbN1JM5DePevCLwWNVB2vnJ415XFwt'}, //20-7-14 06:07
                    {'name': '1DGtiVY9ehch5VRUKF13GMkjTJ8DtXthyd'},
                    {'name': '1HVPzF5GB47Yr9V9UQ1bqeiQmkb4Y63zBn'}, //20-7-14 06:07
                    {'name': '14ELbYiwh7HTqQZe1RkLzgCuwZdoqGMRzh'},
                  ]},
                ]}, 
              ]},
            ]},
          ]},
        ]},
      ]
    }
    this.initSvg(treeData)
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
    getTreeData (address) {
      this.$http.get('data/' + address).then((response)=>{
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

    // dblclickNode (d) {
    //     var addr = d.eq(0).text()
    //     var txid = d.eq(1).text()
    //     var fee = d.eq(2).text()
    //     var input = d.eq(3).text()
    //     var output = d.eq(4).text()
    //     var time = d.eq(5).text()
    //     var warning = d.eq(6).text()

    //     $("#addr").html(addr)
    //     $("#txid").html(txid)
    //     $("#fee").html(fee)
    //     $("#input").html(input)
    //     $("#output").html(output)
    //     $("#time").html(time)
    //     $("#warning").html(warning)
    //   }
    // },
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