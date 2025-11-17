import { CiSearch } from "react-icons/ci";
import styles from "./styles.module.scss";
import classNames from "classnames";

function Input({ showIcon = false, icon = <CiSearch />, ...props }) {
  const { search, iconSearch, appear, hidden, hasIcon } = styles;

  return (
    <div className={search}>
      <div
        className={classNames(iconSearch, {
          [appear]: showIcon,
          [hidden]: !showIcon,
        })}
      >
        {icon}
      </div>

      <input
        className={classNames({
          [hasIcon]: showIcon,
        })}
        {...props}
        value={props.value ?? ""}
      />
    </div>
  );
}

export default Input;
