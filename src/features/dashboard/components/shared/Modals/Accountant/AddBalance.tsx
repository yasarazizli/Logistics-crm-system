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
import { addBalanceAccountant } from "@/features/dashboard/services/Accountant/accountant.service.ts";

const AddBalance = ({
  modalClose,
  id,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = () => {
    const file = inputsRef.file.current?.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const inputsRef = {
    type: useRef<HTMLSelectElement>(null),
    balance: useRef<HTMLInputElement>(null),
    not: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "type", data: inputsRef.type.current?.value },
      { name: "balance", data: inputsRef.balance.current?.value },
      { name: "not", data: inputsRef.not.current?.value },
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
    ]);

    const { status, data } = await addBalanceAccountant(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  const transaction = ["add", "reduce"];

  return (
    <Modal
      title={t("workers.modals.create.add__balance")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("workers.modals.create.inputs.transaction.title")}
            </label>
            <select
              className={styles.select}
              required
              name="transaction"
              ref={inputsRef.type}
            >
              <option value="">
                {t(
                  "workers.modals.create.inputs.transaction.title__placeholder",
                )}
              </option>
              {transaction.map((tran) => (
                <option key={tran} value={tran}>
                  {t(`workers.transaction.${tran}`)}
                </option>
              ))}
            </select>
          </div>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.transaction.title__amount")}
            placeholder={t(
              "workers.modals.create.inputs.transaction.amount__placeholder",
            )}
            inputRef={inputsRef.balance}
            autoComplete="off"
            required
          />
          <Input
            type="text"
            label={t("workers.modals.create.inputs.transaction.title__note")}
            placeholder={t(
              "workers.modals.create.inputs.transaction.note__placeholder",
            )}
            inputRef={inputsRef.not}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.dropzone}>
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <span>
              {t("workers.modals.create.inputs.full_name.label__invoice")}
            </span>
            <label htmlFor="file-upload" className={styles.dropzone__label}>
              {fileName ||
                t(
                  "workers.modals.create.inputs.full_name.placeholder__invoice",
                )}
            </label>
            <input
              type="file"
              id="file-upload"
              ref={inputsRef.file}
              onChange={handleFileChange}
              className={styles.dropzone__input}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
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

export default AddBalance;
