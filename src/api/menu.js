import request from "../utils/request";

export function getMenuAdmin(params) {
  return request({
    url: "/menudashboard",
    method: "get",
    params
  });
}

export function getParentMenu() {
  return request({
    url: "/parentmenu",
    method: "get",
  });
}

export function editMenu(data) {
  return request({
    url: "/updatemenu",
    method: "put",
    data
  });
}

export function addMenu(data) {
  return request({
    url: "/addmenu",
    method: "post",
    data
  });
}

export function deleteMenu(data) {
  return request({
    url: "/deletemenu",
    method: "delete",
    data
  });
}