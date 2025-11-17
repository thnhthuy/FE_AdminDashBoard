import { useRef } from "react";
import styles from "./styles.module.scss";
import useClickOutside from "@/hooks/useClickOutside";

function ActionMenu({ isOpen, onToggle, onClose, onEdit, onDelete, onView }) {
  const { dropdown, dropdownItems, trigger } = styles;
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => {
    if (isOpen) onClose();
  });

  const handleClickEditButton = () => {
    onEdit();
    onClose();
  };
  const handleClickDeleteButton = () => {
    onDelete();
    onClose();
  };
  const handleClickViewDetailsButton = () => {
    onView();
    onClose();
  };

  return (
    <div className={dropdown} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={trigger}
      >
        ...
      </button>

      {isOpen && (
        <div className={dropdownItems}>
          <button onClick={handleClickEditButton}>Edit</button>
          <button onClick={handleClickViewDetailsButton}>View Details</button>
          <button onClick={handleClickDeleteButton}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
