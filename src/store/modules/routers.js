import {getMenuRole} from "../../api/user";

const state = {
  routes: [], // biến lưu danh sách menu router hiển thị, được truy cập
  access: false, //bien luu quyen truy cap cuar router,
  routerNames: []
};
const mutations = {
  SET_ROUTES: (state, data) => {
    state.routes = data;
  },
  SET_ACCESS: (state, status) => {
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
          let mainRouter = data.find(el => el.children);
          let menu = [];
          response.map(el => {
            const exist = mainRouter.children.find(it => it.name == el.name);
            if (exist) {
              if (exist?.children?.length && el?.children?.length) {
                let children = [];
                el.children.map(it => {
                  let exist2 = exist.children.find(ele => ele.name === it.name);
                  if (exist2) {
                    children.push({
                      ...it,
                      path: mainRouter.path + exist.path + "/" + exist2.path,
                    });
                  }
                });
                menu.push({
                  ...el,
                  path: mainRouter.path + exist.path,
                  children,
                });
              } else
                menu.push({
                  ...el,
                  path: mainRouter.path + exist.path,
                });
            }
          });
          commit("SET_ROUTES", menu);
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },
  checkRoleUser({commit}, name) {
    //Kiem tra quyen truy cap router theo name
    let data = state.routes;
    let parent = data.map(el => el.name);
    let children = [];
    data.forEach(el => {
      if (el.children) {
        el.children.forEach(it => children.push(it.name));
      }
    });
    let newData = [...parent, ...children]; //Mảng chứa toàn bộ name của rouuter
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
