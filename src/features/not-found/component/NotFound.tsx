import styles from "@/features/not-found/component/NotFound.module.scss";
import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/components/layout/AuthLayout.tsx";
import {
  ArrowBackIcon,
  NotFoundIcon,
} from "@/assets/images/auth/auth.vector.tsx";

const NotFound = () => {
  return (
    <AuthLayout>
      <div className={styles.not__found}>
        <div className={styles.not__found__content}>
          <NotFoundIcon />
          <h1 className={styles.not__found__content__title}>404</h1>
          <p className={styles.not__found__content__subtitle}>
            Page you are looking for is not found
          </p>
        </div>
      </div>
      <div className={styles.back}>
        <ArrowBackIcon />
        <Link to="/en/auth/login">Back to Login</Link>
      </div>
    </AuthLayout>
  );
};

export default NotFound;
