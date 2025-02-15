import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.lds__ripple}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
