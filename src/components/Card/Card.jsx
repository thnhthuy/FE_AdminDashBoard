import { useContext } from "react";
import { SideBarContext } from "@contexts/SideBarContext";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import dataCard from "./constants";
import styles from "./styles.module.scss";
import Input from "@ui/Input/Input";
import classNames from "classnames";
function Card({ children }) {
  const { type } = useContext(SideBarContext);
  const { container } = styles;
  // const cardData = dataCard.find((item) => item.type === type.toLowerCase());

  return <div className={container}>{children}</div>;
}

export default Card;
