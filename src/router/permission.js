import Vue from "vue";
import {routes} from "./router";
import VueRouter from "vue-router";
import store from "../store/index";
import {getToken} from "../utils/auth";
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history",
});
const getUserInfo = async () => {
  try {
    let me = store.state.User.me;
    let menus = store.state.routerRole.routes;
    let token = getToken();
    if (token && (!me || !menus)) {
      await store.dispatch("User/getMe");
      await store.dispatch("routerRole/setMenus", routes);
    }
    return true;
  } catch (error) {
    return false;
  }
};
const whiteList = ["/login", "/quenmatkhau", "/matkhaumoi"];

router.beforeEach(async (to, form, next) => {
  store.commit("routerRole/setLoading", true);
  const me = await getUserInfo();
  await store.dispatch("routerRole/checkRoleUser", to.name);
  let hasRole = store.state.routerRole.access;
  const token = getToken();
  if (!me) {
    if (!whiteList.includes(to.path)) {
      next({path: "/login"});
    } else {
      next();
    }
  } else {
    //Có token đăng nhập
    if (token) {
      //Không cho phép truy cập whiteList router
      if (whiteList.includes(to.path)) {
        next({path: "/"});
      } else {
        //Kiểm tra quyền trước khi truy cập
        if (hasRole) {
          next();
        } else {
          next({name: "Error"});
        }
      }
    }
    //Khi không có token đăng nhập
    else {
      //Không cho phép truy cập router nằm ngoài whiteList
      if (!whiteList.includes(to.path)) {
        next({path: "/login"});
        store.commit("routerRole/setLoading", false);
      } else {
        next();
        store.commit("routerRole/setLoading", false);
      }
    }
  }
});
router.afterEach(() => {
  // hide progress bar
  store.commit("routerRole/setLoading", false);
})
export default router;
