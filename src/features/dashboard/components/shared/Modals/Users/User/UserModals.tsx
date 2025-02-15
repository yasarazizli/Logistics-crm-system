import React, { FormEvent, useContext, useRef } from "react";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { useTranslation } from "react-i18next";
import { UserModalsProps } from "@/features/dashboard/components/pages/Users/Users.tsx";
import { registerCompanyInputs } from "@/features/auth/constants/auth.constant.ts";
import Input from "@/components/Input/Input.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import {
  postAdminCreateUserRequest,
  postAdminUpdateUserRequest,
} from "@/features/dashboard/services/user.service.ts";
import { errorMessageHandler } from "@/libs/error.ts";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";

const UserModals = ({
  modals,
  setModals,
}: {
  modals: UserModalsProps;
  setModals: React.Dispatch<React.SetStateAction<UserModalsProps>>;
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
      setModals((prevState) => ({
        ...prevState,
        create: false,
      }));
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
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
      Number(modals.update?.id),
    );

    if (status == 200) {
      setModals((prevState) => ({
        ...prevState,
        create: false,
      }));
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  // @ts-ignore
  return (
    <>
      {/* Create Modal */}
      {modals.create && (
        <Modal
          title={t("users.modals.creat_user.title")}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              create: false,
            }));
          }}
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
                  inputRef={
                    inputsRef[input.inputRefName as keyof typeof inputsRef]
                  }
                />
              ))}
            </div>
            <div className={styles.form__buttons}>
              <Button
                text={t("shared.buttons.cancel")}
                viewType={"dark-green"}
                type={"submit"}
                onClick={() => {
                  setModals((prevState) => ({
                    ...prevState,
                    create: false,
                  }));
                }}
              />
              <Button text={t("shared.buttons.save")} />
            </div>
          </form>
        </Modal>
      )}
      {/**/}

      {modals.update && (
        <Modal
          title={"Admin Update User"}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              create: false,
            }));
          }}
        >
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
                  defaultValue={`${modals?.update?.[input.inputRefName as keyof UserModel]}`}
                  autoComplete="off"
                  inputRef={
                    inputsRef[input.inputRefName as keyof typeof inputsRef]
                  }
                />
              ))}
            </div>
            <div className={styles.form__buttons}>
              <Button
                text={t("shared.buttons.cancel")}
                viewType={"dark-green"}
                type={"submit"}
                onClick={() => {
                  setModals((prevState) => ({
                    ...prevState,
                    update: null,
                  }));
                }}
              />
              <Button text={t("shared.buttons.save")} />
            </div>
          </form>
        </Modal>
      )}
      {modals.delete && (
        <Modal
          title={t("vendors.modals.contract_delete.title")}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              delete: null,
            }));
          }}
        >
          <form className={styles.form} onSubmit={() => {}}>
            <div className={styles.form__inputs}>
              <p>{`Salam ${t("vendors.modals.contract_delete.subtitle")}`}</p>
            </div>
            <div className={styles.form__buttons}>
              <Button
                type={"button"}
                text={t("vendors.modals.contract_delete.buttons.reject")}
                viewType={"dark-green"}
                onClick={() => {
                  setModals((prevState) => ({
                    ...prevState,
                    delete: null,
                  }));
                }}
              />
              <Button
                type={"submit"}
                text={t("vendors.modals.contract_delete.buttons.approve")}
                onClick={() => {}}
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UserModals;
