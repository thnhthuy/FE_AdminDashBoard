import { CiSearch } from "react-icons/ci";
import styles from "./styles.module.scss";
function Input({ content }) {
  const { search, iconSearch } = styles;
  return (
    <div className={search}>
      <div className={iconSearch}>
        <CiSearch />
      </div>
      <input type="text" placeholder={content} />
    </div>
  );
}

export default Input;
