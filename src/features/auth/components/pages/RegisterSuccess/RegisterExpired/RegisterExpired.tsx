import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "../RegisterSuccess.module.scss";
import { ArrowBackIcon } from "@/assets/images/auth/auth.vector.tsx";
import { resendVerificationEmail } from "@/features/auth/services/auth.service";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error";

const RegisterExpired: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resendLoading, setResendLoading] = useState<boolean>(false);

  const handleResendVerification = async (): Promise<void> => {
    if (!token) return;

    setResendLoading(true);
    try {
      const { status, data } = await resendVerificationEmail(token);
      if (status === 200) {
        toast.success("Verification link has been sent to your email!");
      } else {
        toast.error(errorMessageHandler(data));
      }
    } catch (error: any) {
      toast.error(errorMessageHandler(error.response?.data));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={styles.success}>
      <div className={styles.success__info}>
        <h1 className={styles.success__info__title}>
          Verification link has expired
        </h1>
        <p className={styles.success__info__subtitle}>
          Please request a new verification link.
        </p>

        <div className={styles.resend__link}>
          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            className={styles.resend__link__text}
          >
            {resendLoading
              ? "Sending..."
              : "Click here to request a new verification link"}
          </button>
        </div>
      </div>

      <div className={styles.success__redirect}>
        <ArrowBackIcon />
        <Link to="/en/auth/login">Go back to Login</Link>
      </div>
    </div>
  );
};

export default RegisterExpired;
