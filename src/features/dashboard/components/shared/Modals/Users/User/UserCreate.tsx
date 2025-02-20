import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import { registerCompanyInputs } from "@/features/auth/constants/auth.constant.ts";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { postAdminCreateUserRequest } from "@/features/dashboard/services/user.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";

const UserCreate = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const inputsRef = {
    full_name: useRef<HTMLInputElement>(null),
    company_name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm__password: useRef<HTMLInputElement>(null),
    identity_number: useRef<HTMLInputElement>(null),
  };

  const adminCreateUser = async (event: FormEvent) => {
    event.preventDefault();

    setLoader(true);

    const formData = formCreator([
      {
        name: "full_name",
        data: inputsRef.full_name.current?.value || "",
      },
      {
        name: "email",
        data: inputsRef.email.current?.value || "",
      },
      {
        name: "company_name",
        data: inputsRef.company_name.current?.value || "",
      },
      {
        name: "phone",
        data: inputsRef.phone.current?.value || "",
      },
      {
        name: "password",
        data: inputsRef.password.current?.value || "",
      },
      {
        name: "confirm_password",
        data: inputsRef.confirm__password.current?.value || "",
      },
      {
        name: "identity_number",
        data: inputsRef.identity_number.current?.value || "",
      },
    ]);
    const { status, data } = await postAdminCreateUserRequest(formData);

    if (status == 200) {
      modalClose(true);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.creat_user.title")}
      modalClose={() => modalClose(false)}
    >
      <form onSubmit={adminCreateUser}>
        <div className={styles.form__inputs}>
          {registerCompanyInputs.map((input, index) => (
            <Input
              key={index}
              label={t(input.label)}
              placeholder={t(input.placeholder)}
              icon={input.icon}
              type={input.type}
              onChange={input.onChange}
              autoComplete="off"
              required
              inputRef={inputsRef[input.inputRefName as keyof typeof inputsRef]}
            />
          ))}
        </div>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            type={"submit"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} />
        </div>
      </form>
    </Modal>
  );
};

export default UserCreate;
