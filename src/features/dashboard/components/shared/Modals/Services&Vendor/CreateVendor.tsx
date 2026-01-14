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
import { createVendor } from "@/features/dashboard/services/Services&Vendor/all.service.ts";

const CreateVendor = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
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
    person_name: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    contract_start_time: useRef<HTMLInputElement>(null),
    contract_end_time: useRef<HTMLInputElement>(null),
    contract_language: useRef<HTMLSelectElement>(null),
    file: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      { name: "person_name", data: inputsRef.person_name.current?.value },
      { name: "phone", data: inputsRef.phone.current?.value },
      { name: "email", data: inputsRef.email.current?.value },
      { name: "name", data: inputsRef.name.current?.value },
      {
        name: "contract_start_time",
        data: inputsRef.contract_start_time.current?.value
          ? new Date(inputsRef.contract_start_time.current.value).toISOString()
          : null,
      },
      {
        name: "contract_end_time",
        data: inputsRef.contract_start_time.current?.value
          ? new Date(inputsRef.contract_start_time.current.value).toISOString()
          : null,
      },
      {
        name: "contract_language",
        data: inputsRef.contract_language.current?.value,
      },
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
    ]);

    const { status, data } = await createVendor(formData);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("services.modals.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Input
              type="text"
              label="Name"
              placeholder="Name"
              inputRef={inputsRef.person_name}
              autoComplete="off"
              required
            />
            <Input
              type="tel"
              label="Phone"
              placeholder="Phone"
              inputRef={inputsRef.phone}
              autoComplete="off"
              required
            />
            <Input
              type="text"
              label="Email"
              placeholder="Email"
              inputRef={inputsRef.email}
              autoComplete="off"
              required
            />
          </div>
          <Input
            type="text"
            label={t("services.modals.create.vendor_label")}
            placeholder={t("services.modals.create.vendor_placeholder")}
            inputRef={inputsRef.name}
            autoComplete="off"
            required
          />
          <Input
            type="date"
            label={t("services.modals.create.started")}
            inputRef={inputsRef.contract_start_time}
            autoComplete="off"
            required
          />
          <Input
            type="date"
            label={t("services.modals.create.ended")}
            inputRef={inputsRef.contract_end_time}
            autoComplete="off"
            required
          />
          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("services.modals.create.vendor_select")}
            </label>
            <select
              className={styles.select}
              required
              name="transaction"
              ref={inputsRef.contract_language}
            >
              <option value="">
                {t("services.modals.create.vendor_select")}
              </option>
              <option value="Azerbaijani">Azerbaijani</option>
              <option value="Russian">Russian</option>
              <option value="English">English</option>
            </select>
          </div>
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
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default CreateVendor;
