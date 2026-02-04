import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { updateEmployee } from "@/features/dashboard/services/Employees/employees.service.ts";

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  fin_code: string;
  role: string;
}

const UpdateEmployees = ({
  modalClose,
  id,
  employee,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  employee: Employee;
}) => {
  const { setLoader } = useContext(LoaderContext);
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

  const update = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "role", data: role },
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

    const { status, data } = await updateEmployee(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  const roles = [
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

  const [role, setRole] = useState(employee?.role || "");

  return (
    <Modal
      title={t("workers.modals.create.update__4")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={update}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label__4")}
            placeholder={t("workers.modals.create.inputs.full_name.label__4")}
            inputRef={inputsRef.full_name}
            autoComplete="off"
            required
            defaultValue={employee?.full_name}
          />
          <Input
            type="email"
            label={t("workers.modals.create.inputs.employee.title")}
            placeholder={t("workers.modals.create.inputs.employee.title")}
            inputRef={inputsRef.email}
            autoComplete="off"
            required
            defaultValue={employee?.email}
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
            defaultValue={employee?.phone}
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
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">
                {t("workers.modals.create.inputs.description.label__5")}
              </option>
              {roles.map((role) => (
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
            viewType="red"
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default UpdateEmployees;
