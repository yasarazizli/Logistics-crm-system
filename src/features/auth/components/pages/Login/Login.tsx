import styles from "./Login.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";

import {
  loginInputs,
  loginTabs,
} from "@/features/auth/constants/auth.constant.ts";
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
    console.log("data:", data);
    console.log("status", status);
    if (status === 200) {
      setAuth({
        isAuth: true,
        role: data.role,
        user: data,
      });
      setCookie("allianceToken", data?.token, 15);
      navigate(`/${i18n.language}/home`);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__tabs}>
        <Tabs tabs={loginTabs} active={0} />
      </div>

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

        <Link
          to={`/${i18n.language}/auth/forget`}
          className={styles.login__form__redirect}
        >
          {t("login.buttons.forget")}
        </Link>

        <div className={styles.login__buttons}>
          <Button text={t("login.buttons.sign__in")} type={"submit"} />
          <Button
            type={"button"}
            text={t("login.buttons.quotation")}
            viewType={"dark-green"}
            onClick={() => {
              navigate(`/${i18n.language}/auth/price/quotation`);
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
