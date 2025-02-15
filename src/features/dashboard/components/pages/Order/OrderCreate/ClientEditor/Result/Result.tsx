import styles from "./Result.module.scss";

const Result = ({ result, setUser }: { result: any; setUser: any }) => {
  return (
    <div
      className={styles.result}
      onClick={() => {
        setUser(result);
      }}
    >
      <div className={styles.result__image}>
        {/*<PersonIcon />*/}
        {/* Icon */}
      </div>
      <div className={styles.result__details}>
        <p className={styles.name}>
          {result.first_name} {result.last_name}
        </p>
        <p className={styles.description}>
          {result.email} | {result.phone || "-"}
        </p>
      </div>
    </div>
  );
};

export default Result;
