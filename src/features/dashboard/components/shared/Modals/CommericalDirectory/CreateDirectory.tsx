import styles from "@/components/Modal/Modal.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { registerRequest } from "@/features/auth/services/auth.service.ts";
import {
  registerCompanyInputs,
  registerIndividualInputs,
} from "@/features/auth/constants/auth.constant.ts";
import { registerInputsRefModel } from "@/features/auth/models/auth.model.ts";

const CreateDirectory = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

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
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm__password: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    company_name: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "full_name", data: inputRefs.full_name.current?.value },
      { name: "email", data: inputRefs.email.current?.value },
      { name: "password", data: inputRefs.password.current?.value },
      {
        name: "confirm_password",
        data: inputRefs.confirm__password.current?.value,
      },
      { name: "phone", data: inputRefs.phone.current?.value },
      { name: "company_name", data: inputRefs.company_name.current?.value },
    ]);

    const { status, data } = await registerRequest(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.title__user")}
      modalClose={() => modalClose(false)}
    >
      <Tabs tabs={tabs} active={activeTab} />

      <form className={styles.cd} onSubmit={create}>
        {activeTab === 0 &&
          registerCompanyInputs.map((input, index) => (
            <Input
              key={index}
              type={input.type}
              label={t(input.label)}
              placeholder={t(input.placeholder)}
              inputRef={inputRefs[input.inputRefName as keyof typeof inputRefs]}
              icon={input.icon}
              autoComplete="none"
              required
            />
          ))}

        {activeTab === 1 &&
          registerIndividualInputs.map((input, index) => (
            <Input
              key={index}
              type={input.type}
              label={t(input.label)}
              placeholder={t(input.placeholder)}
              inputRef={inputRefs[input.inputRefName as keyof typeof inputRefs]}
              icon={input.icon}
              autoComplete="none"
              required
            />
          ))}

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            viewType="red"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default CreateDirectory;
