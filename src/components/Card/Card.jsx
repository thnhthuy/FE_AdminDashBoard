import { useContext } from "react";
import { SideBarContext } from "@contexts/SideBarContext";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import dataCard from "./constants";
import styles from "./styles.module.scss";
import Input from "@ui/Input/Input";
import classNames from "classnames";
function Card({ className, children }) {
  const { container } = styles;
  // const cardData = dataCard.find((item) => item.type === type.toLowerCase());

  return <div className={classNames(container, className)}>{children}</div>;
}

export default Card;
