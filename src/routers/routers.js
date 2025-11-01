import { lazy } from "react";

const routers = [
  {
    path: "/",
    Component: lazy(() => import("@pages/Dashboard/Dashboard")),
  },
  {
    path: "/users",
    Component: lazy(() => import("@pages/Users/Users")),
  },
  {
    path: "/products",
    Component: lazy(() => import("@pages/Products/Products")),
  },
  {
    path: "/messages",
    Component: lazy(() => import("@pages/Messages/Messages")),
  },
  {
    path: "/notifications",
    Component: lazy(() => import("@pages/Notifications/Notifications")),
  },
  {
    path: "/reports",
    Component: lazy(() => import("@pages/Reports/Reports")),
  },
  {
    path: "/admin-info",
    Component: lazy(() => import("@pages/AdminInfo/AdminInfo")),
  },
  {
    path: "/order",
    Component: lazy(() => import("@pages/Order/Order")),
  },
];

export default routers;
