import { useContext } from "react";
import { SideBarContext } from "@/contexts/SideBarContext";
import SideBar from "@layout/SideBar/SideBar";
import styles from "./styles.module.scss";
function Body({ children }) {
  // const { type } = useContext(SideBarContext);
  const { container, sidebarWrapper, contentWrapper } = styles;

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
