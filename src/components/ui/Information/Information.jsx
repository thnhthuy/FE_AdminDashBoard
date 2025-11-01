import styles from "./styles.module.scss";

function Information({ title, icon, content }) {
  const { box, boxHeader, boxContent } = styles;
  return (
    <div className={box}>
      <div className={boxHeader}>
        {title}
        <span>{icon}</span>
      </div>
      <div className={boxContent}>{content}</div>
    </div>
  );
}

export default Information;
