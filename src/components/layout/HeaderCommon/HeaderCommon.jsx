import Button from "@ui/Button/Button";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { SideBarContext } from "@/contexts/SideBarContext";
import { dataHeaderCommon } from "./constans";

function HeaderCommon({ showAddButton = false }) {
  const { container, title } = styles;

  const { type } = useContext(SideBarContext);

  const contentHeader = dataHeaderCommon.find(
    (data) => data.type === type.toLowerCase()
  );

  return (
    <div className={container}>
      <div className={title}>
        {contentHeader && (
          <div>
            <h2>{contentHeader.title}</h2>
            <p>{contentHeader.description}</p>
          </div>
        )}
      </div>
      {showAddButton && (
        <Button
          content={type === "Users" ? "Add User" : "Add Product"}
          showIcon={true}
        />
      )}
    </div>
  );
}

export default HeaderCommon;
