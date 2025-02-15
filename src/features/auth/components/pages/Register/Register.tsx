import styles from "./Register.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";
import {
  registerCompanyInputs,
  registerIndividualInputs,
} from "@/features/auth/constants/auth.constant.ts";
import Input from "@/components/Input/Input.tsx";
import { FormEvent, useContext, useRef, useState } from "react";
import Button from "@/components/Button/Button.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { registerRequest } from "../../../services/auth.service.ts";
import { registerInputsRefModel } from "@/features/auth/models/auth.model.ts";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import { ArrowBackIcon } from "@/assets/icons/auth.vectors.tsx";

const Register = ({
  priceQuotation,
}: {
  priceQuotation?: (inputRefs: registerInputsRefModel) => void;
}) => {
  // React`s
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Contexts
  const { darkMode } = useContext(ThemeContext);
  const { setLoader } = useContext(LoaderContext);

  // States
  const [activeTab, setActiveTab] = useState<number>(0);

  // Constants
  const tabs = [
    {
      name: "register.tabs.company",
      onClick: () => {
        setActiveTab(0);
      },
    },
    {
      name: "register.tabs.individual",
      onClick: () => {
        setActiveTab(1);
      },
    },
  ];

  // Refs
  const inputRefs: registerInputsRefModel = {
    full_name: useRef<HTMLInputElement>(null),
    company_name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm__password: useRef<HTMLInputElement>(null),
    identity_number: useRef<HTMLInputElement>(null),
  };

  // Functions
  const register = async (event: FormEvent) => {
    event.preventDefault();

    if (priceQuotation) {
      priceQuotation(inputRefs);
      return;
    }

    setLoader(true);

    const formData = formCreator([
      {
        name: "full_name",
        data: inputRefs.full_name.current?.value || "",
      },
      {
        name: "email",
        data: inputRefs.email.current?.value || "",
      },
      {
        name: "company_name",
        data: inputRefs.company_name.current?.value || "",
      },
      {
        name: "phone",
        data: inputRefs.phone.current?.value || "",
      },
      {
        name: "password",
        data: inputRefs.password.current?.value || "",
      },
      {
        name: "confirm_password",
        data: inputRefs.confirm__password.current?.value || "",
      },
      {
        name: "password",
        data: inputRefs.password.current?.value || "",
      },
      {
        name: "identity_number",
        data: inputRefs.identity_number.current?.value || "",
      },
    ]);
    const { status } = await registerRequest(formData);

    if (status == 200) {
      navigate(`/${i18n.language}/auth/success`);
    } else toast.error("Failed");

    setLoader(false);
  };

  return (
    <div className={`${styles.register} ${darkMode && styles.dark}`}>
      <h1 className={styles.register__title}>{t("register.title")}</h1>

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
          <Link
            to={`/${i18n.language}/auth/login`}
            className={styles.register__buttons__redirect}
          >
            <ArrowBackIcon />
            {t("register.buttons.redirect")}
          </Link>
          <Button text={t("register.buttons.next")} />
        </div>
      </form>
    </div>
  );
};

export default Register;
