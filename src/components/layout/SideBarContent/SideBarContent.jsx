import classNames from "classnames";
import styles from "./styles.module.scss";

function SideBarContent({ content, icon, onclick, active }) {
  const { container, iconSideBar, text, nav, activeStyle } = styles;

  return (
    <div className={container}>
      <div
        className={classNames(nav, { [activeStyle]: active })}
        onClick={onclick}
      >
        <div className={iconSideBar}>{icon}</div>
        <div className={text}>{content}</div>
      </div>
    </div>
  );
}

export default SideBarContent;
