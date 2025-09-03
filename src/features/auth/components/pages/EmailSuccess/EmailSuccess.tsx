import styles from "./EmailSuccess.module.scss";
import {
  ArrowBackIcon,
  LetterIcon,
} from "@/assets/images/auth/auth.vector.tsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { registerVerifyResponse } from "@/features/auth/services/auth.service.ts";
import { toast } from "react-toastify";

const EmailSuccess = () => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
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
    <div className={styles.success}>
      <div className={styles.success__info}>
        <div className={styles.success__info__logo}>
          <LetterIcon />
        </div>
        <h1 className={styles.success__info__title}>
          {success
            ? "User Tesdiqlendi"
            : "Check your inbox for reset password link"}
        </h1>
        <p className={styles.success__info__subtitle}>
          {success
            ? "User Tesdiqlendi"
            : "We sent you a password reset link to"}
        </p>
      </div>
      <div className={styles.success__redirect}>
        <ArrowBackIcon />
        <Link to={"/en/auth/login"}>{t("register.buttons.redirect")}</Link>
      </div>
    </div>
  );
};

export default EmailSuccess;
