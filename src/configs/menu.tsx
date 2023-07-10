import React from "react";
import type { MenuProps } from "antd";
import { Navigate, RouteObject } from "react-router-dom";
import { APP_PREFIX_PATH, AUTH_PATH } from ".";
import AppLayout from "../pages/AppLayout";
import {
  FaHome,
  FaUser,
  FaChrome,
  FaCookie,
  FaCookieBite,
  FaAd,
  FaUserTie
} from "react-icons/fa";
import Dashboard from "../pages/Dashboard";
import Cookie from "../pages/Cookie";
import User from "../pages/User";
import Extension from "../pages/Extension";

type MenuItem = Required<MenuProps>["items"][number] & {
  path?: string,
  element?: React.ReactNode,
  index?: boolean,
  children?: MenuItem[]
};
const menus: MenuItem[] = [{
  label: "Trang Chủ",
  key: "",
  path: "/",
  element: <Dashboard />,
  icon: <FaHome />
}, {
  label: "Card",
  key: "cookie",
  path: "/cookie",
  icon: <FaCookie />,
  children: [{
    label: "Card",
    key: "cookie_item",
    path: "/",
    element: <Cookie />,
    icon: <FaCookieBite />
  }]
}, {
  label: "Checkout web",
  key: "extension",
  path: "/extension",
  element: <Extension />,
  icon: <FaChrome />
}, {
  label: "User",
  key: "user",
  path: "/user",
  element: <User />,
  icon: <FaUser />
}];
const getRoutes = (): RouteObject[] => {
  let routes: RouteObject[] = [];
  for (let item of menus) {
    let children: RouteObject[] = [];
    if (item.children) {
      for (let child of item.children) {
        children.push({
          element: child.element,
          path: child.path?.replace(/\//gm, ""),
          index: child.key?.toString().endsWith("_item")
        });
      }
    }
    if (children.length > 0) {
      routes.push({
        path: item.path?.replace(/\//gm, ""),
        children
      });
    } else {
      routes.push({
        path: item.path?.replace(/\//gm, ""),
        element: item.element
      });
    }
  }
  return [{
    path: "/*",
    element: <Navigate to={APP_PREFIX_PATH} />
  }, {
    path: AUTH_PATH,
    element: <Navigate to={APP_PREFIX_PATH} />
  }, {
    path: APP_PREFIX_PATH,
    element: <AppLayout />,
    children: routes
  }]
}
export {
  menus,
  getRoutes
}
export default menus;