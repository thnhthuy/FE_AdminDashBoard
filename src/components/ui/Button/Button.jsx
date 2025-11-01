import { HiMiniPlus } from "react-icons/hi2";
import styles from "./styles.module.scss";
import classNames from "classnames";
function Button({
  content,
  showIcon = false,
  isPrimary = true,
  btnActive = false,
  onClick,
  onChange,
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
    >
      <div className={showIcon ? appear : hidden}>
        <HiMiniPlus />
      </div>
      <div>{content}</div>
    </button>
  );
}

export default Button;
