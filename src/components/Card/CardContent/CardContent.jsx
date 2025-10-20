import classNames from "classnames";
import styles from "./styles.module.scss";
function CardContent({ children, className }) {
  const { container } = styles;
  return <div className={classNames(container, className)}>{children}</div>;
}

export default CardContent;
