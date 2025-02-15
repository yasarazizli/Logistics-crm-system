import Button from "@/components/Button/Button.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import Input from "@/components/Input/Input.tsx";
import { ChangeEvent, FormEvent, useContext, useRef } from "react";
import { formCreator, onlyNumberInputValues } from "@/libs/form.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import TextArea from "@/components/TextArea/TextArea.tsx";
import FileInput from "@/components/FileInput/FileInput.tsx";
import { postChangeUserBalanceRequest } from "@/features/dashboard/services/user.service.ts";
import { errorMessageHandler } from "@/libs/error.ts";
import { balanceConstant } from "@/features/dashboard/constants/selections.constant.tsx";
import { useTranslation } from "react-i18next";

const BalanceTransaction = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const inputsRef = {
    type: useRef<HTMLInputElement>(null),
    balance: useRef<HTMLInputElement>(null),
    note: useRef<HTMLInputElement>(null),
    file: useRef<HTMLInputElement>(null),
  };

  const changeUserBalance = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
      {
        name: "balance",
        data: inputsRef.balance.current?.value,
      },
      {
        name: "not",
        data: inputsRef.note.current?.value,
      },
      {
        name: "type",
        data: inputsRef.type.current?.value,
      },
    ]);
    const { status, data } = await postChangeUserBalanceRequest(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    modalClose(true);
    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.balance_transaction.title")}
      subtitle={t("users.modals.balance_transaction.subtitle")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={changeUserBalance}>
        <div className={styles.form__inputs}>
          <SelectOption
            label={t("users.modals.balance_transaction.inputs.transaction")}
            required
            options={balanceConstant}
            inputRef={inputsRef.type}
          />

          <Input
            label={t("users.modals.balance_transaction.inputs.amount")}
            required
            inputRef={inputsRef.balance}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onlyNumberInputValues(event);
            }}
          />

          <TextArea
            label={t("users.modals.balance_transaction.inputs.note")}
            inputRef={inputsRef.note}
          />

          <FileInput
            inputRef={inputsRef.file}
            name={t("users.modals.balance_transaction.inputs.file")}
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
            type={"button"}
          />

          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default BalanceTransaction;
