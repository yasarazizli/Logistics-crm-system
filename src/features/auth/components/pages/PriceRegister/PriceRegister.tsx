import styles from "../Register/Register.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";
import {
  registerCompanyInputs,
  registerIndividualInputs,
} from "@/features/auth/constants/auth.constant.ts";
import Input from "@/components/Input/Input.tsx";
import { FormEvent, useRef, useState } from "react";
import Button from "@/components/Button/Button.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerInputsRefModel } from "@/features/auth/models/auth.model.ts";
import { AuthPageIcon } from "@/assets/images/auth/auth.vector.tsx";

const PriceRegister = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { name: "register.tabs.company", tab: 0, onClick: () => setActiveTab(0) },
    {
      name: "register.tabs.individual",
      tab: 1,
      onClick: () => setActiveTab(1),
    },
  ];

  const inputRefs: registerInputsRefModel = {
    full_name: useRef<HTMLInputElement>(null),
    company_name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm__password: useRef<HTMLInputElement>(null),
  };

  const register = async (event: FormEvent) => {
    event.preventDefault();

    const user = {
      company_name: inputRefs.company_name.current?.value || "",
      full_name: inputRefs.full_name.current?.value || "",
      email: inputRefs.email.current?.value || "",
      phone: inputRefs.phone.current?.value || "",
      password: inputRefs.password.current?.value || "",
      confirm_password: inputRefs.confirm__password.current?.value || "",
    };

    localStorage.setItem("priceRegisterUser", JSON.stringify(user));

    navigate(`/${i18n.language}/auth/price/quotation`);
  };

  return (
    <div className={styles.register}>
      <div className={styles.register__logo}>
        <div className={styles.logo}>
          <AuthPageIcon />
        </div>
        <h1 className={styles.register__title}>{t("register.title_2")}</h1>
      </div>

      <div className={styles.register__tabs}>
        <Tabs tabs={tabs} active={activeTab} />
      </div>

      <form
        autoComplete="off"
        onSubmit={register}
        className={`${styles.register__form} ${activeTab === 0 ? styles.company : styles.individual}`}
      >
        {activeTab === 0 &&
          registerCompanyInputs.map((input, index) => (
            <Input
              key={index}
              label={t(input.label)}
              placeholder={t(input.placeholder)}
              icon={input.icon}
              type={input.type}
              onChange={input.onChange}
              autoComplete="off"
              required
              inputRef={inputRefs[input.inputRefName as keyof typeof inputRefs]}
            />
          ))}

        {activeTab === 1 &&
          registerIndividualInputs.map((input, index) => (
            <Input
              key={index}
              label={t(input.label)}
              placeholder={t(input.placeholder)}
              type={input.type}
              icon={input.icon}
              onChange={input.onChange}
              autoComplete="new-password"
              required
              inputRef={inputRefs[input.inputRefName as keyof typeof inputRefs]}
            />
          ))}

        <div className={styles.register__buttons}>
          <Button text={t("register.buttons.next_1")} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default PriceRegister;
