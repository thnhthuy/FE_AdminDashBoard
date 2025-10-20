import { Component } from "react";

const routers = [
  {
    path: "/",
    Component: lazy(() => import("@pages/Dashboard/Dashboard")),
  },
  {
    path: "/Users",
    Component: lazy(() => import("@pages/Users/Users")),
  },
  {
    path: "/Products",
    Component: lazy(() => import("@pages/Products/Products")),
  },
  {
    path: "/Messages",
    Component: lazy(() => import("@pages/Messages/Messages")),
  },
  {
    path: "/Notifications",
    Component: lazy(() => import("@pages/Notifications/Notifications")),
  },
  {
    path: "/Reports",
    Component: lazy(() => import("@pages/Reports/Reports")),
  },
  {
    path: "/AdminInfo",
    Component: lazy(() => import("@pages/AdminInfo/AdminInfo")),
  },
];

export default routers;
