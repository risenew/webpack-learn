// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import "babel-polyfill";
// import 'eventsource-polyfill';
// import 'eventsource-polyfill';
// import es6Promise from "babel-polyfill";
// require('es6-promise').polyfill()

import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import Vue from 'vue';
import App from './App';

import ElementUI from 'element-ui';
import axios from '../src/axios/http.js';
import qs from 'qs';
import store from '../src/vuex/index.js';
import './assets/css/style/theme/index.css';
import './assets/css/common.less';
import router from './router/index.js';
import vueBus from 'vue-bus';
// import '../src/assets/icon/iconfont.css';

Vue.config.productionTip = false;
Vue.use(vueBus);
Vue.use(ElementUI);
// Vue.http.options.emulateJSON = true;
// Vue.http.options.crossOrigin = true;
// Vue.http.options.emulateHTTP = true;



// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios;


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  axios,
  template: '<App/>',
  components: {
    App
  }
});

export default vm
