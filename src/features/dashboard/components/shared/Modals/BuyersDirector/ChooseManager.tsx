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
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

interface Employee {
  id: number;
  full_name: string;
}

interface SelectManagerProps {
  modalClose: (isRender: boolean) => void;
  id: number;
  onSelect: (employee: Employee) => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

const getAllCm = async (role: string) => {
  return await axios
    .get(`${apiUrl}/admin/get-all-employee/?role=${role}`, {
      headers: { Authorization: getCookie("allianceToken") },
    })
    .catch((err) => err.response);
};

const putManager = async (formData: FormData, userId: number, id: number) => {
  return await axios
    .put(
      `${apiUrl}/commercial/select-review-quotation/?quotation_id=${id}&buyer_manager_id=${userId}`,
      formData,
      {
        headers: { Authorization: getCookie("allianceToken") },
      },
    )
    .catch((err) => err.response);
};

const ChooseManager = ({ modalClose, id, onSelect }: SelectManagerProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoader(true);
      const response = await getAllCm("buyer_manager");
      if (response?.status === 200) {
        setEmployees(response.data?.employee || []);
        console.log(response?.data?.employee);
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
      { name: "manager_id", data: selectedEmployee },
      { name: "role", data: "buyer_manager" },
    ]);

    const { status, data } = await putManager(
      formData,
      Number(selectedEmployee),
      id,
    );

    if (status === 200) {
      toast.success(errorMessageHandler(data));
      const chosen = employees.find(
        (emp) => emp.id.toString() === selectedEmployee,
      );
      if (chosen) onSelect(chosen);
    } else {
      toast.error(errorMessageHandler(data));
    }

    setLoader(false);
    modalClose(true);
  };

  useEffect(() => {
    const fetchRequest = async () => {
      const response = await QuotationData(id);
      if (response.status === 200) {
        const apiData = response?.data;
        console.log(apiData);
      }
    };
    fetchRequest();
  }, []);

  return (
    <Modal title={t("cd.modal.title")} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form__inputs}>
          <div className={styles.selectWrapper} style={{ marginTop: "10px" }}>
            <label className={styles.label}>{t("cd.modal.label")}</label>
            <select
              className={styles.select}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">{t("cd.modal.label")}</option>
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
            viewType="red"
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default ChooseManager;
