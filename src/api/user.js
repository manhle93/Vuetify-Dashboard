import request from "../utils/request";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "get",
  });
}

export function me() {
  return request({
    url: "/me",
    method: "get",
  });
}

export function getMenuRole() {
  return request({
    url: "/menus",
    method: "get",
  });
}