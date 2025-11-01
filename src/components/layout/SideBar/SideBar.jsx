import { useContext } from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { TfiClose } from "react-icons/tfi";
import { SideBarContext } from "@/contexts/SideBarContext";
import navigation from "./constants.jsx";
import styles from "./styles.module.scss";

function SideBar() {
  const { container, overlay, sidebar, slideSideBar, boxIcon, nav, active } =
    styles;
  const { isOpen, setIsOpen } = useContext(SideBarContext);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className={container}>
      {isOpen && <div className={overlay} onClick={handleToggle} />}

      <div className={classNames(sidebar, { [slideSideBar]: isOpen })}>
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? `${nav} ${active}` : nav)}
            onClick={handleToggle}
          >
            <div>{item.icon}</div>
            <span>{item.content}</span>
          </NavLink>
        ))}

        {isOpen && (
          <div className={boxIcon}>
            <TfiClose onClick={handleToggle} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
