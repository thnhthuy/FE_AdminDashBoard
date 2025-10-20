import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

function ActionMenu({ isOpen, onToggle, onClose }) {
  const { dropdown, dropdownItems, trigger } = styles;
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={dropdown} ref={menuRef}>
      <button onClick={onToggle} className={trigger}>
        ...
      </button>

      {isOpen && (
        <div className={dropdownItems}>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
