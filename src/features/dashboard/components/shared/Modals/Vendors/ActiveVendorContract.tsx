import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import FileInput from "@/components/FileInput/FileInput.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import {
  dateToInputFormat,
  getEndDateMinValue,
  handleStartDateChange,
} from "@/libs/date.ts";
import { useTranslation } from "react-i18next";
import { postVendorContractActivateRequest } from "@/features/dashboard/services/vendors.service.ts";
import { ContractLanguageConstant } from "@/features/dashboard/constants/selections.constant.tsx";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
import { errorMessageHandler } from "@/libs/error.ts";

const ActiveVendorVendor = ({
  modalClose,
  vendor,
}: {
  modalClose: (isRender: boolean) => void;
  vendor: VendorModel;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const inputsRef = {
    name: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
    contract_language: useRef<HTMLInputElement>(null),
    contract_start_date: useRef<HTMLInputElement>(null),
    contract_end_date: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
      {
        name: "contract_start_time",
        data: new Date(
          inputsRef.contract_start_date.current?.value || "",
        ).toISOString(),
      },
      {
        name: "contract_end_time",
        data: new Date(
          inputsRef.contract_end_date.current?.value || "",
        ).toISOString(),
      },
      {
        name: "contract_language",
        data: inputsRef.contract_language.current?.value,
      },
    ]);
    const { status, data } = await postVendorContractActivateRequest(
      formData,
      vendor.id,
    );
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal
      title={t("vendors.modals.create.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <div className={styles.grid}>
            <Input
              label={t("vendors.modals.create.inputs.contract_start_date")}
              type="date"
              min={dateToInputFormat(new Date().toISOString())}
              inputRef={inputsRef.contract_start_date}
              onChange={() => handleStartDateChange(inputsRef)}
              required
            />
            <Input
              label={t("vendors.modals.create.inputs.contract_end_date")}
              type="date"
              min={getEndDateMinValue(inputsRef)}
              inputRef={inputsRef.contract_end_date}
              required
            />
          </div>
          <SelectOption
            label={t("vendors.modals.create.inputs.contract_language")}
            required
            inputRef={inputsRef.contract_language}
            options={ContractLanguageConstant}
          />
          <FileInput inputRef={inputsRef.file} required />
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

export default ActiveVendorVendor;
