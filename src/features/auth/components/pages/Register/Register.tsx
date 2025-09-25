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
import { AuthPageIcon } from "@/assets/images/auth/auth.vector.tsx";

const Register = ({
  priceQuotation,
}: {
  priceQuotation?: (inputRefs: registerInputsRefModel) => void;
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setLoader } = useContext(LoaderContext);

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

    if (priceQuotation) {
      priceQuotation(inputRefs);
      return;
    }

    setLoader(true);

    const formData = formCreator([
      {
        name: "company_name",
        data: inputRefs.company_name.current?.value || "",
      },
      { name: "full_name", data: inputRefs.full_name.current?.value || "" },
      { name: "email", data: inputRefs.email.current?.value || "" },
      { name: "phone", data: inputRefs.phone.current?.value || "" },
      { name: "password", data: inputRefs.password.current?.value || "" },
      {
        name: "confirm_password",
        data: inputRefs.confirm__password.current?.value || "",
      },
    ]);

    const { status } = await registerRequest(formData);

    if (status === 200) navigate(`/${i18n.language}/auth/registersuccess`);
    else toast.error("Failed");

    setLoader(false);
  };

  return (
    <div className={styles.register}>
      <div className={styles.register__logo}>
        <div className={styles.logo}>
          <AuthPageIcon />
        </div>
        <h1 className={styles.register__title}>{t("register.title")}</h1>
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
          <Button text={t("register.buttons.next")} type={"submit"} />
          <div className={styles.register__buttons__redirect}>
            <span>Already have an account?</span>
            <Link to={`/${i18n.language}/auth/login`}>Sign in</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
