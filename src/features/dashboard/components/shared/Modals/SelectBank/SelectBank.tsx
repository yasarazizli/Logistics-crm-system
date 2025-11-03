import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import axios from "axios";
import { getCookie } from "@/libs/cookie";

interface SelectBankProps {
  modalClose: () => void;
  id: number;
  onSelect: (full_name: string) => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

const putMember = async (formData: FormData, order_id: number) => {
  return await axios
    .post(`${apiUrl}/commercial/select-bank/?order_id=${order_id}`, formData, {
      headers: { Authorization: getCookie("allianceToken") },
    })
    .catch((err) => err.response);
};

const SelectBank = ({ modalClose, id, onSelect }: SelectBankProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [selectedBank, setSelectedBank] = useState<string>("");

  const bank = [
    "ABB (RUB)",
    "ABB (USD)",
    "ABB (AZN)",
    "Pasha Bank (USD)",
    "Pasha Bank (RUB)",
    "Pasha Bank (EUR)",
    "Pasha Bank (AZN)",
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBank) return;

    setLoader(true);

    const formData = formCreator([{ name: "bank", data: selectedBank }]);

    const { status, data } = await putMember(formData, id);

    if (status === 200) {
      toast.success(errorMessageHandler(data));
      onSelect(selectedBank);
    } else {
      toast.error(errorMessageHandler(data));
    }

    setLoader(false);
    modalClose();
  };

  return (
    <Modal title="Select Bank" modalClose={modalClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form__inputs}>
          <div className={styles.selectWrapper} style={{ marginTop: "10px" }}>
            <label className={styles.label}>Bank</label>
            <select
              className={styles.select}
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              required
            >
              <option value="">Select Bank</option>
              {bank.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
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

export default SelectBank;
