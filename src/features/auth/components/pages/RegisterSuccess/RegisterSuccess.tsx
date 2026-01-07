import styles from "../Success/Success.module.scss";
import {
  ArrowBackIcon,
  SuccessIcon,
} from "@/assets/images/auth/auth.vector.tsx";
import { Link, useLocation } from "react-router-dom";

const RegisterSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isVerified = params.get("verified") === "true";

  return (
    <div className={styles.success}>
      <div className={styles.success__info}>
        <SuccessIcon />
        <h1 className={styles.success__info__title}>
          {isVerified
            ? "Your account has been successfully verified!"
            : "Check your inbox for registration link"}
        </h1>
        <p className={styles.success__info__subtitle}>
          You can now go back to login.
        </p>
      </div>

      <div className={styles.success__redirect}>
        <ArrowBackIcon />
        <Link to="/en/auth/login">Go back to Login</Link>
      </div>
    </div>
  );
};

export default RegisterSuccess;
