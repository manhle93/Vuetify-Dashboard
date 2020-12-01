import {getMenuRole} from "../../api/user";

const state = {
  routes: [], // biến lưu danh sách menu router hiển thị, được truy cập
  access: false, //bien luu quyen truy cap cuar router
};
const mutations = {
  SET_ROUTES: (state, data) => {
    state.routes = data;
  },
  SET_ACCESS: (state, status) => {
    console.log(status);
    state.access = status;
  },
};

const actions = {
  setRouters({commit}, data) {
    commit("SET_ROUTES", data);
  },
  setMenus({commit}, data) {
    // Tao menu router
    return new Promise((resolve, reject) => {
      getMenuRole()
        .then(response => {
          console.log("res", response);
          console.log("all", data);
          let mainRouter = data.find(el => el.children);
          console.log(mainRouter.children);
          commit("SET_ROUTES", response);
          // response.map(el => {
          //   const pathParent = mainRouter.children.filter(it => it.name == el.name);
          //   if (pathParent) {
          //     el.path = pathParent.path;
          //   } else {
          //     el.path = null;
          //   }
          //   el.children.map(cr => {
          //    const childPath = mainRouter.children.filter(it => it.name == el.name);
          //   })
          // });
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },
  checkRoleUser({commit}, name) {
    //Kiem tra quyen truy cap router
    let data = state.routes;
    let newData = data.map(el => el.name);
    if (newData.includes(name) || name == "Error") {
      commit("SET_ACCESS", true);
    } else {
      commit("SET_ACCESS", false);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
