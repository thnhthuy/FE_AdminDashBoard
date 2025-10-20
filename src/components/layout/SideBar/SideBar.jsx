import { SideBarContext } from "@/contexts/SideBarContext";
import { useContext } from "react";
import classNames from "classnames";
import navigation from "./constants.jsx";
import styles from "./styles.module.scss";
import SideBarContent from "@layout/SideBarContent/SideBarContent";
import { TfiClose } from "react-icons/tfi";
function SideBar() {
  const { container, overlay, sidebar, slideSideBar, boxIcon } = styles;
  const { isOpen, setIsOpen, type, setType } = useContext(SideBarContext);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    // <div className={container}>
    //   <div className={classNames(sidebar, { [slideSideBar]: isOpen })}>
    //     {navigation.map((item) => (
    //       <SideBarContent
    //         content={item.content}
    //         icon={item.icon}
    //         onclick={() => setType(item.content)}
    //         active={type === item.content}
    //       />
    //     ))}
    //   </div>
    // </div>
    <div className={container}>
      <div
        className={classNames({
          [overlay]: isOpen,
        })}
        onClick={handleToggle}
      />
      <div
        className={classNames(sidebar, {
          [slideSideBar]: isOpen,
        })}
      >
        {navigation.map((item) => (
          <SideBarContent
            content={item.content}
            icon={item.icon}
            onclick={() => setType(item.content)}
            active={type === item.content}
          />
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
