import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import Language from "@/components/Language/Language.tsx";
import { CompanyIcon } from "@/assets/icons/shared.vectors.tsx";
import styles from "@/components/Header/Header.module.scss";

const Header = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className={styles.dashboard__header}>
      <div className={styles.buttons}>
        <div className={`${styles.button} ${styles.language}`}>
          <Language />
        </div>

        <div className={styles.special__button}>
          <CompanyIcon />
          <span>{auth.user?.full_name}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
