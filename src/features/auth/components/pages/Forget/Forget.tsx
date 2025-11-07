import styles from "./Forget.module.scss";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  AuthPageIcon,
} from "@/assets/images/auth/auth.vector.tsx";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useRef, useContext } from "react";
import { MailIcon } from "@/assets/icons/shared.vectors.tsx";
import {
  postForgetPasswordRequest,
  postResetPasswordRequest,
} from "@/features/auth/services/auth.service.ts";
import { formCreator } from "@/libs/form.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { errorMessageHandler } from "@/libs/error.ts";
import { toast } from "react-toastify";

const Forget = () => {
  const { setLoader } = useContext(LoaderContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const resetPasswordVerificationToken = queryParams.get("resetToken");

  const inputRefs = {
    mail: useRef<HTMLInputElement | null>(null),
    password: useRef<HTMLInputElement | null>(null),
    confirm_password: useRef<HTMLInputElement | null>(null),
  };

  const postForgetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "email", data: inputRefs.mail.current?.value },
    ]);

    const { data, status } = await postForgetPasswordRequest(formData);

    if (status === 200) {
      toast.success(errorMessageHandler(data));
      navigate(`/${i18n.language}/auth/emailsuccess`);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  const postResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "token", data: resetPasswordVerificationToken },
      { name: "password", data: inputRefs.password.current?.value || "" },
      {
        name: "confirm_password",
        data: inputRefs.confirm_password.current?.value || "",
      },
    ]);

    const { data, status } = await postResetPasswordRequest(formData);

    if (status === 200) {
      toast.success(errorMessageHandler(data));
      navigate(`/${i18n.language}/auth/success`);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <div className={styles.forget}>
      <Link
        to={`/${i18n.language}/auth/login`}
        className={styles.forget__redirect}
      >
        <ArrowLeftIcon /> {t("shared.buttons.back")}
      </Link>

      <div className={styles.forget__head}>
        <div className={styles.head__logo}>
          <AuthPageIcon />
        </div>
        <h1 className={styles.head__title}>
          {!resetPasswordVerificationToken
            ? "Enter your e-mail"
            : "Create your password"}
        </h1>
      </div>

      <div className={styles.forget__info}>
        <p className={styles.forget__info__subtitle}>
          {!resetPasswordVerificationToken
            ? "Enter your e-mail to recieve identification mail."
            : ""}
        </p>
      </div>

      {!resetPasswordVerificationToken && (
        <form className={styles.forget__form} onSubmit={postForgetPassword}>
          <Input
            label={t("shared.inputs.email")}
            placeholder={"example@example.com"}
            type="email"
            required
            icon={MailIcon}
            inputRef={inputRefs.mail}
          />
          <Button text={t("shared.buttons.send")} type={"submit"} />
        </form>
      )}

      {resetPasswordVerificationToken && (
        <form className={styles.forget__form} onSubmit={postResetPassword}>
          <Input
            label={t("shared.inputs.password")}
            placeholder={"********"}
            type="password"
            required
            icon={MailIcon}
            inputRef={inputRefs.password}
          />
          <Input
            label={t("shared.inputs.confirm_password")}
            placeholder={"********"}
            type="password"
            required
            icon={MailIcon}
            inputRef={inputRefs.confirm_password}
          />
          <Button text={"Change password"} type="submit" />
        </form>
      )}
    </div>
  );
};

export default Forget;
