import MyHeader from "@components/layout/Header/Header";
import Body from "@components/layout/Body/Body";
import styles from "./styles.module.scss";
function AdminDashBoard() {
  const { container } = styles;
  return (
    <div className={container}>
      <MyHeader />
      <Body />
    </div>
  );
}

export default AdminDashBoard;
