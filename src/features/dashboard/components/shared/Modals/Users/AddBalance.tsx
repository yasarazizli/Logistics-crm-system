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
import { addBalanceServices } from "@/features/dashboard/services/Users/addbalance.service.ts";

const AddBalance = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    amount: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
  };

  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = () => {
    const file = inputsRef.file.current?.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "amount",
        data: inputsRef.amount.current?.value,
      },
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
    ]);

    const { status, data } = await addBalanceServices(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("workers.modals.create.balance")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.label__balance")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.placeholder__balance",
            )}
            inputRef={inputsRef.amount}
            autoComplete="none"
            required
          />

          <div className={styles.dropzone}>
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
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.add")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default AddBalance;
