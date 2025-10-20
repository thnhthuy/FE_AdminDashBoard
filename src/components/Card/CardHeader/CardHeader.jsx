import styles from "./styles.module.scss";
import classNames from "classnames";

function CardHeader({ children, className }) {
  const { container } = styles;
  return <div className={classNames(container, className)}>{children}</div>;
}

export default CardHeader;
