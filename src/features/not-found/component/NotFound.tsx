import styles from "./NotFound.module.scss";
import notFound from "../../../assets/images/shared/not-found-icon.png";
import Button from "../../../components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.not__found}>
      <div className={styles.not__found__content}>
        <h1 className={styles.not__found__content__title}>404</h1>
        <p className={styles.not__found__content__subtitle}>
          We’re working on it!
        </p>
        <Button
          text={"Home"}
          onClick={() => {
              console.log(`/${i18n.language}/home`)
            navigate(`/${i18n.language}/home`);
          }}
        />
      </div>
      <div className={styles.not__found__img}>
        <img src={notFound} alt="Not Found" />
      </div>
    </div>
  );
};

export default NotFound;
