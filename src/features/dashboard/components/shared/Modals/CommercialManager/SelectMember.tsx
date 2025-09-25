import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import axios from "axios";
import { getCookie } from "@/libs/cookie";

interface Employee {
  id: number;
  full_name: string;
}

interface SelectManagerProps {
  modalClose: () => void;
  id: number;
  onSelect: (full_name: string) => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

const getAllCm = async () => {
  return await axios
    .get(`${apiUrl}/admin/get-all-employee/`, {
      headers: { Authorization: getCookie("allianceToken") },
    })
    .catch((err) => err.response);
};

const putMember = async (formData: FormData, order_id: number) => {
  return await axios
    .put(
      `${apiUrl}/commercial/set-specialist/?order_id=${order_id}`,
      formData,
      {
        headers: { Authorization: getCookie("allianceToken") },
      },
    )
    .catch((err) => err.response);
};

const SelectMember = ({ modalClose, id, onSelect }: SelectManagerProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoader(true);
      const response = await getAllCm();
      if (response?.status === 200) {
        setEmployees(response.data?.employee || []);
      } else {
        toast.error("Menecerləri gətirmək mümkün olmadı!");
      }
      setLoader(false);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setLoader(true);

    const formData = formCreator([
      { name: "specialist_id", data: selectedEmployee },
    ]);

    const { status, data } = await putMember(formData, id);

    if (status === 200) {
      toast.success(errorMessageHandler(data));
      const chosen = employees.find(
        (emp) => emp.id.toString() === selectedEmployee,
      );
      if (chosen) onSelect(chosen.full_name);
    } else {
      toast.error(errorMessageHandler(data));
    }

    setLoader(false);
    modalClose();
  };

  return (
    <Modal title={t("cd.modal.title_2")} modalClose={modalClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form__inputs}>
          <div className={styles.selectWrapper} style={{ marginTop: "10px" }}>
            <label className={styles.label}>{t("cd.modal.label_2")}</label>
            <select
              className={styles.select}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">{t("cd.modal.label_2")}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            onClick={modalClose}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default SelectMember;
