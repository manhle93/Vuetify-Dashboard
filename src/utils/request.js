import axios from "axios";
// import store from '@/store'
import {getToken, setToken, removeToken} from "@/utils/auth";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Vue from "vue";
Vue.use(Toast);

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 6000,
});

// Trước request
service.interceptors.request.use(
  config => {
    config.headers["Authorization"] = "Bearer " + getToken();
    config.mode = "no-cors";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Sau request response
service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  async error => {
    if (error.response.data.name == "TokenExpiredError") {
      let result = await service.post("/refresh");    //Refresh token khi hết hạn
      setToken(result.token);
      error.response.headers["Authorization"] = "Bearer " + getToken();
      return service.request(error.response.config);
    }

    else if(error.response.data.name == "JsonWebTokenError"){
        removeToken()
        location.assign("/login");
    }

    else if(error.response.data.message && error.response.data.code != 403) {
        Vue.$toast.error(error.response.data.message, {
            position: "top-center",
            timeout: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
          });
    }
    else return Promise.reject(error);
  }
);

export default service;
