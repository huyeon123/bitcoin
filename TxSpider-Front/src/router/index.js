import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';

import transmitter from "@/plugins/fetchTransmitter.js";

import home from '../views/Home.vue';
import pageNotFound from '../views/pageNotFound.vue';
import Tree from '../views/Tree.vue'
// import traceTree from "../components/TreeVII";
//

Vue.use(VueRouter);



const routes = [
  {
    path: '/',
    name: 'index',
    component: home,
    meta: {
      title: "TxSpider"
    }
  },

  {
    path: "*",
    name: "404NotFound",
    component: pageNotFound
  },
  {
    path: "/tree",
    name: "examples",
    component: Tree,
  }
]

const router = new VueRouter({
  mode: "history",
  routes
});

router.originalPage = "/";//로그인 페이지로 강제 이동등의 이유로 다른 페이지로 리다이렉트 되었을 때 원래 가려던 곳을 기억하는 변수

console.log(router);

router.beforeEach(async function (to, from, next) {
  console.log("beforeEach");
  if(to.meta.loginRequired != true){
    next();
    return;
  }

  //인증이 필요한 페이지인가?
  //이미 인증이 되어 있는가?
  if(store.state.isUserInfoGetted == true){
    next();
    return;
  }

  //인증이 되어 있지 않으면 인증을 시도한다.
  console.log("readmin");
  await getUserInfo();

  //인증 결과 확인
  if(store.state.isUserInfoGetted == false){
    router.originalPage = to.fullPath;
    next({ path: '/user/Login_Main' });
    return;
  }

  next();
});


async function getUserInfo(){
      console.log("유저 정보를 요청합니다.");
      try {
        let response = await transmitter("/user/info", "GET", {}, "JSON");
        response = response.user;
        console.log("getUserInfo");
        console.log(response);
        console.log(response.Id);
        console.log(response.PhoneNumber);
        let payload = {
          id: response.Id,
          name: response.Name,
          phoneNumber: response.PhoneNumber,
        };

        store.commit("setUserInfo", payload);
        console.log("유저 정보를 등록했습니다.");
      }catch(e) {
        console.log("http 상태 코드: " + e.httpStatus);
        console.log(e);
        return;
      }
    }

export default router
