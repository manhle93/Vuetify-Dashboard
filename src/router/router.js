import Layout from "@/components/Layout/Layout";

// Pages
import Dashboard from "@/pages/Dashboard/Dashboard";
import Typography from "@/pages/Typography/Typography";
import Tables from "@/pages/Tables/Basic";
import Notifications from "@/pages/Notifications/Notifications";
import Icons from "@/pages/Icons/Icons";
import Charts from "@/pages/Charts/Charts";
import Maps from "@/pages/Maps/Google";
import Error from "@/pages/Error/Error";
import Login from "@/pages/Login/Login";
import Blank from "@/components/Blank/Layout";

export const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "*",
    name: "Error",
    component: Error,
  },

  ///////////////////////
  {
    path: "/",
    redirect: "/dashboard",
    name: "Layout",
    component: Layout,
    children: [
      //Dashboard Router write here
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "users",
        name: "Người dùng",
        component: Blank,
        children: [
          {
            path: "menus",
            component: () => import("@/pages/User/menus/index"),
            name: "Menu",
          },
          {
            path: "role",
            component: () => import("@/pages/User/roles/index"),
            name: "Phân quyền",
          },
          {
            path: "profile",
            component: () => import("@/pages/User/profile/index"),
            name: "Thông tin",
          },
          {
            path: "management",
            component: () => import("@/pages/User/management/index"),
            name: "Quản lý người dùng",
          },
          {
            path: "dienvien",
            component: () => import("@/pages/User/dienvien/index"),
            name: "Diễn viên",
          },
        ],
      },
      {
        path: "ui-elements",
        name: "UI Elements",
        component: Blank, //Component rỗng cho Menu có menu con
        children: [
          {
            path: "icons",
            name: "Icons",
            component: Icons,
          },
          {
            path: "charts",
            name: "Charts",
            component: Charts,
          },
          {
            path: "maps",
            name: "Maps",
            component: Maps,
          },
          {
            path: "notifications",
            name: "Notifications",
            component: Notifications,
          },
          {
            path: "typography",
            name: "Typography",
            component: Typography,
          },
          {
            path: "tables",
            name: "Tables",
            component: Tables,
          },
        ],
      },
    ],
  },
];
