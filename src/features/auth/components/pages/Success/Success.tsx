import styles from "./Success.module.scss";
import {
  ArrowBackIcon,
  SuccessIcon,
} from "@/assets/images/auth/auth.vector.tsx";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { registerVerifyResponse } from "@/features/auth/services/auth.service.ts";
import { toast } from "react-toastify";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const Success = () => {
  const { setLoader } = useContext(LoaderContext);
  const { darkMode } = useContext(ThemeContext);
  const queryParams = new URLSearchParams(location.search);
  const registerVerificationToken = queryParams.get("token");
  const [success, setSuccess] = useState<boolean>(false);

  const registerVerification = async () => {
    const { status, data } = await registerVerifyResponse(
      `${registerVerificationToken}`,
    );

    if (status === 200) {
      setSuccess(true);
    } else {
      toast.error(data.error);
    }

    setLoader(false);
  };

  useEffect(() => {
    if (registerVerificationToken === null) {
      setLoader(false);
    } else {
      setLoader(true);
      registerVerification().catch(() => {});
    }
  }, []);

  return (
    <div className={`${styles.success} ${darkMode && styles.dark}`}>
      <div className={styles.success__info}>
        <SuccessIcon />
        <h1 className={styles.success__info__title}>
          {success ? "" : "Your password has been successfully changed"}
        </h1>
        <p className={styles.success__info__subtitle}>
          {success
            ? "Go back home and login."
            : "Go back home and login with new password."}
        </p>
      </div>

      <div className={styles.success__redirect}>
        <ArrowBackIcon />
        <Link to={"/en/auth/login"}>Back to home</Link>
      </div>
    </div>
  );
};

export default Success;
