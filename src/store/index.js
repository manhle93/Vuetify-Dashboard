import Vue from 'vue';
import Vuex from 'vuex';
import routerRole from './modules/routers'
import User from './modules/user'
import confirmBox from './modules/confirmBox'
Vue.use(Vuex);

export default new Vuex.Store({

  namespace: true,
  state: {
    drawer: true
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    }
  },
  actions: {
    TOGGLE_DRAWER({ commit }) {
      commit('toggleDrawer');
    }
  },
  getters: {
    DRAWER_STATE(state) {
      return state.drawer;
    }
  },
  modules: {
    routerRole,
    User,
    confirmBox
  }
});
