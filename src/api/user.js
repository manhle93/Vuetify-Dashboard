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

export function changePassword(data) {
  return request({
    url: "/changepassword",
    method: "post",
    data
  });
}

export function listUser(params) {
  return request({
    url: "/users",
    method: "get",
    params
  });
}
export function activeUser(data) {
  return request({
    url: "/activeuser",
    method: "post",
    data
  });
}

export function updateUser(data) {
  return request({
    url: "/updateuser",
    method: "post",
    data
  });
}

export function createUser(data) {
  return request({
    url: "/createuser",
    method: "post",
    data
  });
}

export function uploadAvatar(data) {
  return request({
    url: "/uploadavatar",
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data
  });
}
