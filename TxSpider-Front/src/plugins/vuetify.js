// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import colors from 'vuetify/lib/util/colors'
import VueI18n from 'vue-i18n'

Vue.use(Vuetify)
Vue.use(VueI18n)

const messages = {
  en: {
    $vuetify: {
      examplesButton: 'Examples',
      sidebar: {
        title1: {
          value: 'Basic',
          children: {
            title1: {
              value: 'HelloWorld'
            },
            title2: {
              value: 'UpdateEnterExit'
            },
            title3: {
              value: 'GeneralUpdatePatternI'
            },
            title4: {
              value: 'SelectElementAndBindData'
            },
            title5: {
              value: 'SelectInsertRemove'
            }
          }
        },
        title2: {
          value: 'Tree',
          children: {
            title1: {
              value: 'TreeI'
            },
            title2: {
              value: 'TreeII'
            },
            title3: {
              value: 'TreeIII'
            },
            title4: {
              value: 'TreeIV'
            },
            title5: {
              value: 'TreeV'
            },
            title6: {
              value: 'TreeVI'
            },
            title7: {
              value: 'TreeVII'
            },
            title8: {
              value: 'TreeVIII'
            }
          }
        },
        title3: {
          value: 'BarChart',
          children: {
            title1: {
              value: 'BarChartI'
            },
            title2: {
              value: 'BarChartII'
            },
            title3: {
              value: 'BarChartAxis'
            },
            title4: {
              value: 'SimpleBarChart'
            },
            title5: {
              value: 'Scale'
            }
          }
        },
        title4: {
          value: 'Zoom',
          children: {
            title1: {
              value: 'Zoomable'
            },
            title2: {
              value: 'ZoomableText'
            }
          }
        },
        title5: {
          value: 'Force',
          children: {
            title1: {
              value: 'ForceBasedI'
            },
            title2: {
              value: 'ForceBasedII'
            },
            title3: {
              value: 'ForceBasedIII'
            },
            title4: {
              value: 'ForceDirected'
            },
            title5: {
              value: 'ForceLayoutI'
            },
            title6: {
              value: 'ForceLayoutII'
            },
            title7: {
              value: 'ForceLayoutIII'
            }
          }
        },
        title6: {
          value: 'Histogram',
          children: {
            title1: {
              value: 'HistogramI'
            },
            title2: {
              value: 'HistogramII'
            },
            title3: {
              value: 'HistogramIII'
            }
          }
        }
      }
    }
  },
  zh: {
    $vuetify: {
      examplesButton: '??????',
      sidebar: {
        title1: {
          value: '??????',
          children: {
            title1: {
              value: '???????????????'
            },
            title2: {
              value: '????????????????????????'
            },
            title3: {
              value: '??????????????? I'
            },
            title4: {
              value: '???????????????????????????'
            },
            title5: {
              value: '????????????????????????'
            }
          }
        },
        title2: {
          value: '???',
          children: {
            title1: {
              value: '??? I'
            },
            title2: {
              value: '??? II'
            },
            title3: {
              value: '??? III'
            },
            title4: {
              value: '??? IV'
            },
            title5: {
              value: '??? V'
            },
            title6: {
              value: '??? VI'
            },
            title7: {
              value: '??? VII'
            },
            title8: {
              value: '??? VIII'
            }
          }
        },
        title3: {
          value: '?????????',
          children: {
            title1: {
              value: '????????? I'
            },
            title2: {
              value: '????????? II'
            },
            title3: {
              value: '????????? ?????????'
            },
            title4: {
              value: '???????????????'
            },
            title5: {
              value: '?????????'
            }
          }
        },
        title4: {
          value: '??????',
          children: {
            title1: {
              value: '????????????????????????'
            },
            title2: {
              value: '??????,??????????????????'
            }
          }
        },
        title5: {
          value: '????????????',
          children: {
            title1: {
              value: '???????????? I'
            },
            title2: {
              value: '???????????? II'
            },
            title3: {
              value: '???????????? III'
            },
            title4: {
              value: '???????????? ??????'
            },
            title5: {
              value: '???????????? ?????? I'
            },
            title6: {
              value: '???????????? ?????? II'
            },
            title7: {
              value: '???????????? ?????? III'
            }
          }
        },
        title6: {
          value: '?????????',
          children: {
            title1: {
              value: '????????? I'
            },
            title2: {
              value: '????????? II'
            },
            title3: {
              value: '????????? III'
            }
          }
        }
      }
    }
  }
}

let i18nLocale = 'en'

if (sessionStorage.getItem('i18nLocale')) {
  i18nLocale = sessionStorage.getItem('i18nLocale')
}

const i18n = new VueI18n({
  locale: i18nLocale,
  messages
})

const opts = {
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#409eff',
        secondary: '#54a8ff',
        accent: '#9c27b0',
        error: '#f44336',
        warning: '#ff5722',
        info: '#607d8b',
        success: '#4caf50'
      },
      dark: {
        primary: colors.blue.darken1
      }
    }
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
}

const vuetify = new Vuetify(opts)
export { vuetify, i18n }
