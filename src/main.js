import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import * as VueGoogleMaps from "vue2-google-maps";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueRouter from "vue-router";
import router from "./router/permission";
import './app.css'
import confirmBoxPlugin from './plugins/confirmBox';
Vue.use(confirmBoxPlugin, { store })
Vue.use(Toast);
Vue.use(VueRouter);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg",
  },
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  vuetify,
  render: h => h(App),
  store,
});
