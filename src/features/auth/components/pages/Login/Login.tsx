import styles from "./Login.module.scss";
import { loginInputs } from "@/features/auth/constants/auth.constant.ts";
import Input from "@/components/Input/Input.tsx";
import { AuthPageIcon } from "@/assets/images/auth/auth.vector.tsx";
import { FormEvent, useContext, useRef } from "react";
import Button from "@/components/Button/Button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { loginRequest } from "@/features/auth/services/auth.service.ts";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { setCookie } from "@/libs/cookie.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";

const Login = () => {
  const { t, i18n } = useTranslation();
  const { setLoader } = useContext(LoaderContext);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const inputRefs = {
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "email",
        data: inputRefs.email.current?.value || "",
      },
      {
        name: "password",
        data: inputRefs.password.current?.value || "",
      },
    ]);
    const { data, status } = await loginRequest(formData);
    if (status === 200) {
      setAuth({
        isAuth: true,
        role: data.role,
        user: data,
      });
      setCookie("allianceToken", data?.token, 15);
      switch (data.role) {
        case "lawyer":
          navigate(`/${i18n.language}/lawyer/users`);
          break;
        case "admin":
          navigate(`/${i18n.language}/users`);
          break;
        case "user":
          navigate(`/${i18n.language}/users`);
          break;
        case "accountant":
          navigate(`/${i18n.language}/accountant/users`);
          break;
        case "buyer_manager":
          navigate(`/${i18n.language}/services`);
          break;
        case "commercial_directory":
          navigate(`/${i18n.language}/commercial/directory/users`);
          break;
        case "commercial_manager":
          navigate(`/${i18n.language}/commercial/manager/order`);
          break;
      }
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__tabs}></div>

      <form className={styles.login__form} onSubmit={login}>
        <div className={styles.login__form__head}>
          <div className={styles.head__logo}>
            <AuthPageIcon />
          </div>
          <h1 className={styles.head__title}>{t("login.title")}</h1>
        </div>

        {loginInputs.map((input, index) => (
          <Input
            key={index}
            label={t(input.label)}
            placeholder={t(input.placeholder)}
            icon={input.icon}
            type={input.type}
            required
            inputRef={inputRefs[input.inputRefName as keyof typeof inputRefs]}
          />
        ))}

        <div className={styles.login__form__forget}>
          <Link
            to={`/${i18n.language}/auth/forget`}
            className={styles.login__form__redirect}
          >
            {t("login.buttons.forget")}
          </Link>
        </div>

        <div className={styles.login__buttons}>
          <Button text={t("login.buttons.sign__in")} type={"submit"} />
          <Button
            type={"button"}
            text={t("login.buttons.quotation")}
            viewType={"dark-green"}
            onClick={() => {
              navigate(`/${i18n.language}/auth/price/register`);
            }}
          />
        </div>
        <div className={styles.login__check}>
          <span>Don’t have an account?</span>
          <Link to={`/${i18n.language}/auth/register`}>Sign-up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
