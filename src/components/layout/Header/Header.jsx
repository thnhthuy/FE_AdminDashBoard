import { MdExpandMore, MdOutlineDarkMode } from "react-icons/md";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { CiLight, CiSearch } from "react-icons/ci";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { SideBarContext } from "@contexts/SideBarContext";
import Input from "@ui/Input/Input";
import useScrollHandling from "@hooks/useScrollHandling";

function MyHeader() {
  const {
    container,
    containerheader,
    fixedHeader,
    leftheader,
    topHeader,
    centerheader,
    rightheader,
    mode,
    profile,
  } = styles;

  const { isOpen, setIsOpen } = useContext(SideBarContext);
  const [fixedPosition, setFixedPosition] = useState(false);
  const { scrollPosition } = useScrollHandling();

  useEffect(() => {
    setFixedPosition(scrollPosition > 85 ? true : false);
  }, [scrollPosition]);

  return (
    <div
      className={classNames(container, topHeader, {
        [fixedHeader]: fixedPosition,
      })}
    >
      <div className={containerheader}>
        <div className={leftheader}>
          <button onClick={() => setIsOpen(!isOpen)}>
            <AiOutlineAlignLeft />
          </button>
          <div>Shop Zues</div>
        </div>

        {/* <div className={centerheader}>
          <Input content="Search..." />
        </div> */}
        <div className={rightheader}>
          {/* <div className={mode}>
            <MdOutlineDarkMode />
            <CiLight />
          </div> */}
          <div className={profile}>
            <span>
              <img src="" alt="" />
            </span>
            <span>Admin</span>
            <MdExpandMore style={{ paddingTop: "5px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHeader;
