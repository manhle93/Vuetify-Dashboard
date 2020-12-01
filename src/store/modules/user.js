import {setToken, getToken, removeToken} from "../../utils/auth";
import {login, me, logout} from "../../api/user";
const state = {
  me: null,
  token: null,
};

const mutations = {
  SET_ME: (state, data) => {
    state.me = data;
  },
  SET_TOKEN: (state, data) => {
    state.token = data;
  },
};

const actions = {
  login({commit}, data) {
    return new Promise((resolve, reject) => {
      const email_username = data.email_username;
      const password = data.password;
      login({email_username: email_username.trim(), password: password})
        .then(response => {
          commit("SET_TOKEN", response.token);
          setToken(response.token);
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },
  getMe({commit}) {
    return new Promise((resolve, reject) => {
      me()
        .then(response => {
          commit("SET_ME", response);
          commit("SET_TOKEN", getToken());
          resolve();
        })
        .catch(error => {
          commit("SET_ME", null);
          commit("SET_TOKEN", null);
          reject(error);
        });
    });
  },
  async logout({commit}){
    try {
      await logout();
      removeToken()
      commit("SET_TOKEN", null);
      commit("SET_ME", null);
    } catch (error) {
      console.log('Không thể đăng xuất')
    }

  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
