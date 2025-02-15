import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { errorMessageHandler } from "@/libs/error.ts";
import { postWorkerCreateRequest } from "@/features/dashboard/services/workers.service.ts";
import { RoleSelectionsConstant } from "@/features/dashboard/constants/selections.constant.tsx";

const CreateWorker = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    role: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm_password: useRef<HTMLInputElement>(null),
    identity_number: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "role",
        data: inputsRef.role.current?.value,
      },
      {
        name: "full_name",
        data: inputsRef.name.current?.value,
      },
      {
        name: "email",
        data: inputsRef.email.current?.value,
      },
      {
        name: "phone",
        data: inputsRef.phone.current?.value,
      },
      {
        name: "password",
        data: inputsRef.password.current?.value,
      },
      {
        name: "confirm_password",
        data: inputsRef.confirm_password.current?.value,
      },
      {
        name: "identity_number",
        data: inputsRef.identity_number.current?.value,
      },
    ]);
    const { status, data } = await postWorkerCreateRequest(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  console.log("workers.modals.create.inputs.full_name");
  return (
    <Modal
      title={t("workers.modals.create.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        {/* Form Inputs */}
        <div className={styles.form__inputs}>
          <SelectOption
            label={"Role"}
            options={RoleSelectionsConstant}
            inputRef={inputsRef.role}
            required
          />

          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.placeholder",
            )}
            inputRef={inputsRef.name}
            autoComplete="none"
            required
          />
          <Input
            type="email"
            label={t("workers.modals.create.inputs.email.label")}
            placeholder={t("workers.modals.create.inputs.email.placeholder")}
            inputRef={inputsRef.email}
            autoComplete="none"
            required
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.phone.label")}
            placeholder={t("workers.modals.create.inputs.phone.placeholder")}
            inputRef={inputsRef.phone}
            autoComplete="none"
            required
          />
          <div className={styles.grid}>
            <Input
              type="password"
              label={t("workers.modals.create.inputs.password.label")}
              placeholder={t(
                "workers.modals.create.inputs.password.placeholder",
              )}
              inputRef={inputsRef.password}
              autoComplete="none"
              required
            />
            <Input
              type="password"
              label={t("workers.modals.create.inputs.confirm_password.label")}
              placeholder={t(
                "workers.modals.create.inputs.confirm_password.placeholder",
              )}
              inputRef={inputsRef.confirm_password}
              autoComplete="none"
              required
            />
          </div>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.identity_number.label")}
            placeholder={t(
              "workers.modals.create.inputs.identity_number.placeholder",
            )}
            inputRef={inputsRef.identity_number}
            autoComplete="none"
            required
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default CreateWorker;
