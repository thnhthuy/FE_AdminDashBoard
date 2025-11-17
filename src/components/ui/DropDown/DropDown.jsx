import { useState } from "react";
import styles from "./styles.module.scss";

const RecursiveDropdown = ({ categories, className, onSelect }) => {
  const { menu, menuItem, subMenu } = styles;
  return (
    <div className={className}>
      <ul className={menu}>
        {categories.map((cat) => (
          <li key={cat.id} className={menuItem}>
            <span>{cat.name}</span>
            {cat.childCategory && cat.childCategory.length > 0 && (
              <div className={subMenu}>
                <RecursiveDropdown
                  categories={cat.childCategory}
                  onSelect={onSelect}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecursiveDropdown;
