import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { createEmployee } from "@/features/dashboard/services/Employees/employees.service.ts";

const CreateEmployees = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { auth } = useContext(AuthContext);
  const { t } = useTranslation();

  const inputsRef = {
    role: useRef<HTMLSelectElement>(null),
    full_name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    password_confirm: useRef<HTMLInputElement>(null),
    fin_code: useRef<HTMLInputElement>(null),
  };

  const allRoles = [
    "admin",
    "user",
    "buyer_manager",
    "buyer_directory",
    "commercial_directory",
    "commercial_manager",
    "commercial_specialist",
    "lawyer",
    "accountant",
    "monitoring",
  ];

  const getAllowedRoles = () => {
    if (auth.role === "admin") {
      return allRoles.filter((role) => role !== "admin" && role !== "user");
    }

    return allRoles;
  };

  const allowedRoles = getAllowedRoles();

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const selectedRole = inputsRef.role.current?.value;

    if (selectedRole && !allowedRoles.includes(selectedRole)) {
      toast.error(t("workers.errors.unauthorized_role"));
      setLoader(false);
      return;
    }

    const formData = formCreator([
      { name: "role", data: selectedRole },
      { name: "full_name", data: inputsRef.full_name.current?.value },
      { name: "email", data: inputsRef.email.current?.value },
      { name: "phone", data: inputsRef.phone.current?.value },
      { name: "password", data: inputsRef.password.current?.value },
      {
        name: "password_confirm",
        data: inputsRef.password_confirm.current?.value,
      },
      { name: "fin_code", data: inputsRef.fin_code.current?.value },
    ]);

    const { status, data } = await createEmployee(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.title__4")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label__4")}
            placeholder={t("workers.modals.create.inputs.full_name.label__4")}
            inputRef={inputsRef.full_name}
            autoComplete="off"
            required
          />
          <Input
            type="email"
            label={t("workers.modals.create.inputs.employee.title")}
            placeholder={t("workers.modals.create.inputs.employee.title")}
            inputRef={inputsRef.email}
            autoComplete="off"
            required
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.employee.title__1")}
            placeholder={t(
              "workers.modals.create.inputs.employee.placeholder__1",
            )}
            inputRef={inputsRef.phone}
            autoComplete="off"
            required
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.employee.title__2")}
            placeholder={t(
              "workers.modals.create.inputs.employee.placeholder__2",
            )}
            inputRef={inputsRef.fin_code}
            autoComplete="off"
            required
          />
          <Input
            type="password"
            label={t("workers.modals.create.inputs.employee.title__3")}
            placeholder={t("workers.modals.create.inputs.password.placeholder")}
            inputRef={inputsRef.password}
            autoComplete="new-password"
            required
          />
          <Input
            type="password"
            label={t("workers.modals.create.inputs.employee.title__5")}
            placeholder={t("workers.modals.create.inputs.password.placeholder")}
            inputRef={inputsRef.password_confirm}
            autoComplete="new-password"
            required
          />
          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("workers.modals.create.inputs.description.label__5")}
            </label>
            <select
              className={styles.select}
              required
              name="role"
              ref={inputsRef.role}
            >
              <option value="">
                {t("workers.modals.create.inputs.description.label__5")}
              </option>
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {t(`workers.roles.${role}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

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

export default CreateEmployees;
