import styles from "./styles.module.scss";
import classNames from "classnames";
import Button from "@components/ui/Button/Button";
import { TfiClose } from "react-icons/tfi";
import { useEffect } from "react";

function PopUp({
  isOpen,
  onClose,
  title,
  des,
  confirmText = "Confirm",
  onConfirm,
  children,
}) {
  const {
    popUpWrapper,
    popUpTitle,
    popUpcontent,
    iconClose,
    overlay,
    popUpStyle,
    sliderPopup,
    popUpBottom,
  } = styles;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={popUpWrapper}>
      <div className={overlay} onClick={onClose} />
      <div
        className={classNames(popUpStyle, { [sliderPopup]: isOpen })}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={popUpTitle}>
          <div className={iconClose}>
            <TfiClose onClick={onClose} />
          </div>
          <h4>{title}</h4>
          <p>{des}</p>
        </div>

        <div className={popUpcontent}>{children}</div>

        <div className={popUpBottom}>
          <Button content="Cancel" isPrimary={false} onClick={onClose} />
          <Button content={confirmText} isPrimary={true} onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

export default PopUp;
