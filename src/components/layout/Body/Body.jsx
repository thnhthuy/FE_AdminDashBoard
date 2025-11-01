import { useContext } from "react";
import { SideBarContext } from "@/contexts/SideBarContext";
import SideBar from "@layout/SideBar/SideBar";
import styles from "./styles.module.scss";
import classNames from "classnames";
import Dashboard from "@pages/Dashboard/Dashboard";
import Users from "@pages/Users/Users";
import Products from "@pages/Products/Products";
import Messages from "@pages/Messages/Messages";
import Notifications from "@pages/Notifications/Notifications";
import Reports from "@pages/Reports/Reports";
import AdminInfo from "@pages/AdminInfo/AdminInfo";
import { useMemo } from "react";
function Body({ children }) {
  const { type } = useContext(SideBarContext);
  const { container, sidebarWrapper, contentWrapper } = styles;

  // const renderContent = useMemo(() => {
  //   switch (type) {
  //     case "Dashboard":
  //       return <Dashboard />;
  //     case "Users":
  //       return <Users />;
  //     case "Products":
  //       return <Products />;
  //     case "Messages":
  //       return <Messages />;
  //     case "Notifications":
  //       return <Notifications />;
  //     case "Reports":
  //       return <Reports />;
  //     case "AdminInfo":
  //       return <AdminInfo />;
  //     default:
  //       return <Dashboard />;
  //   }
  // }, [type]);

  return (
    <div className={container}>
      <aside className={sidebarWrapper}>
        <SideBar />
      </aside>
      <div className={contentWrapper}>{children}</div>
    </div>
  );
}

export default Body;
