import { HiMiniPlus } from "react-icons/hi2";
import styles from "./styles.module.scss";
import classNames from "classnames";
function Button({
  content,
  // showIcon = false,
  icon = null,
  isPrimary = true,
  btnActive = false,
  onClick,
  onChange,
  ...props
}) {
  const { btn, appear, hidden, primaryBtn, secondaryBtn, btnItemActive } =
    styles;
  return (
    <button
      onChange={onChange}
      onClick={onClick}
      className={classNames(btn, {
        [primaryBtn]: isPrimary,
        [secondaryBtn]: !isPrimary,
        [btnItemActive]: btnActive,
      })}
      {...props}
    >
      {/* <div className={showIcon ? appear : hidden}>
        <HiMiniPlus />
      </div> */}
      {icon && <div className={appear}>{icon}</div>}
      <div>{content}</div>
    </button>
  );
}

export default Button;
