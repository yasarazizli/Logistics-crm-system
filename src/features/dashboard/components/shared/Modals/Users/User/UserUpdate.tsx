import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import { registerCompanyInputs } from "@/features/auth/constants/auth.constant.ts";
import Input from "@/components/Input/Input.tsx";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { formCreator } from "@/libs/form.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { postAdminUpdateUserRequest } from "@/features/dashboard/services/user.service.ts";

const UserUpdate = ({
  user,
  modalClose,
}: {
  user: UserModel;
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

  const adminUpdateUser = async (event: FormEvent) => {
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
    const { status, data } = await postAdminUpdateUserRequest(
      formData,
      Number(user?.id),
    );

    if (status == 200) {
      modalClose(true);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <Modal title={"Admin Update User"} modalClose={() => modalClose(false)}>
      <form onSubmit={adminUpdateUser}>
        <div className={styles.form__inputs}>
          {registerCompanyInputs.map((input, index) => (
            <Input
              key={index}
              label={t(input.label)}
              placeholder={t(input.placeholder)}
              icon={input.icon}
              type={input.type}
              onChange={input.onChange}
              defaultValue={
                !["password", "confirm__password"].includes(input.inputRefName)
                  ? `${user?.[input.inputRefName as keyof UserModel]}`
                  : ""
              }
              autoComplete="off"
              inputRef={inputsRef[input.inputRefName as keyof typeof inputsRef]}
            />
          ))}
        </div>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default UserUpdate;
