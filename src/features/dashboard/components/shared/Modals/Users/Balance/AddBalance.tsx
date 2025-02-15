import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import FileInput from "@/components/FileInput/FileInput.tsx";
import { postAddUserBalanceRequest } from "@/features/dashboard/services/user.service.ts";
import {
  clearReferenceInputValues,
  formCreator,
  onlyNumberInputValues,
} from "@/libs/form.ts";
import { toast } from "react-toastify";
import Input from "@/components/Input/Input.tsx";
import { useTranslation } from "react-i18next";

const AddBalance = ({
  modalClose,
}: {
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);
  const inputsRef = {
    file: useRef<HTMLInputElement | null>(null),
    balance: useRef<HTMLInputElement | null>(null),
  };

  const addUserBalance = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "amount",
        data: inputsRef.balance.current?.value || "",
      },
      {
        name: "file",
        data: inputsRef.file.current?.files?.[0],
      },
    ]);
    const { status } = await postAddUserBalanceRequest(formData);
    if (status === 200) {
      modalClose(true);
      clearReferenceInputValues(inputsRef);
      toast.success("User balance added successfully.");
    } else toast.error("User balance added error.");
    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.add_balance.title")}
      subtitle={"users.modals.add_balance.subtitle"}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={addUserBalance}>
        <div className={styles.form__inputs}>
          <Input
            label={t("users.modals.add_balance.inputs.amount")}
            maxLength={10}
            required
            inputRef={inputsRef.balance}
            onChange={(event) => {
              onlyNumberInputValues(event);
            }}
          />
          <FileInput
            inputRef={inputsRef.file}
            name={t("users.modals.inputs.file")}
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

export default AddBalance;
