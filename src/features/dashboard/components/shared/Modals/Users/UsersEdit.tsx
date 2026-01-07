import styles from "@/components/Modal/Modal.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import {
  registerCompanyInputs,
  registerIndividualInputs,
} from "@/features/auth/constants/auth.constant.ts";
import { EditUsers } from "@/features/dashboard/services/Users/addbalance.service.ts";

interface CD {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
}

const UsersEdit = ({
  modalClose,
  id,
  user,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  user: CD;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<number>(user.company_name ? 0 : 1);

  const tabs = [
    { name: "register.tabs.company", tab: 0, onClick: () => setActiveTab(0) },
    {
      name: "register.tabs.individual",
      tab: 1,
      onClick: () => setActiveTab(1),
    },
  ];

  const [formValues, setFormValues] = useState({
    full_name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "",
    confirm__password: "",
    company_name: user.company_name || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "full_name", data: formValues.full_name },
      { name: "email", data: formValues.email },
      { name: "password", data: formValues.password },
      { name: "confirm_password", data: formValues.confirm__password },
      { name: "phone", data: formValues.phone },
      { name: "company_name", data: formValues.company_name },
    ]);

    const { status, data } = await EditUsers(formData, id);
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
              value={formValues[input.inputRefName as keyof typeof formValues]}
              onChange={(e) => handleChange(input.inputRefName, e.target.value)}
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
              value={formValues[input.inputRefName as keyof typeof formValues]}
              onChange={(e) => handleChange(input.inputRefName, e.target.value)}
              icon={input.icon}
              autoComplete="none"
              required
            />
          ))}

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default UsersEdit;
