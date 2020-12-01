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


export const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    redirect: "/dashboard",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
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
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications,
      },
      {
        path: "ui-elements",
        name: "UI Elements",
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
        ],
      },
    ],
  },
  {
    path: "*",
    name: "Error",
    component: Error,
  },
];
