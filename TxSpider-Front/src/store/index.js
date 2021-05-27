import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {//유저의 정보를 저장하는 객체
      id: "",
      name: "",
      phoneNumber: "", //GPA
    },

    isUserInfoGetted: false //유저 정보가 현재 사용 가능한지 나타내는 플래그 변수
  },
  mutations: {
    setUserInfo(state, payload){
      console.log("Setuser "+payload);
      console.log(payload);
      console.log("Setuser "+payload.id);
      console.log("Setuser "+payload.name);
      state.userInfo.id = payload.id;
      state.userInfo.name = payload.name;
      state.userInfo.phoneNumber = payload.phoneNumber;
      state.isUserInfoGetted = true;
    }
  },
  actions: {
  },
  modules: {
  }
})
