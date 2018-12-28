// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/'
import axios from 'axios'
import VDistpicker from 'v-distpicker'
import './assets/css/icontFont/iconfont.css'
import 'babel-polyfill'
import Echarts from 'echarts'
import underscore from 'underscore'
Vue.prototype.$echarts = Echarts;
Vue.prototype.$underscore = underscore;

Vue.use(ElementUI);
// Vue.use(Echarts)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App,
    VDistpicker
  },
  template: '<App/>'
})
