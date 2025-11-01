import MyHeader from "@components/layout/Header/Header";
import Body from "@components/layout/Body/Body";
import styles from "./styles.module.scss";
function AdminDashBoard({ children }) {
  const { container } = styles;
  return (
    <div className={container}>
      <MyHeader />
      <Body>{children}</Body>
    </div>
  );
}

export default AdminDashBoard;
