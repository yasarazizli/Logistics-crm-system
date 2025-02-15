import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import FileInput from "@/components/FileInput/FileInput.tsx";
import { postAddUserContractRequest } from "@/features/dashboard/services/user.service.ts";
import { clearReferenceInputValues, formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { errorMessageHandler } from "@/libs/error.ts";
import { useTranslation } from "react-i18next";

const AddContract = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { check } = useContext(AuthContext);

  const { setLoader } = useContext(LoaderContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addUserContract = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "file",
        data: inputRef.current?.files?.[0],
      },
    ]);

    const { status, data } = await postAddUserContractRequest(formData, id);
    if (status === 200) {
      check();
      modalClose(true);
      toast.success(errorMessageHandler(data));
      clearReferenceInputValues(inputRef);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.add_contract.title")}
      subtitle={t("users.modals.add_contract.subtitle")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={addUserContract}>
        <div className={styles.form__inputs}>
          <FileInput inputRef={inputRef} name="file" />
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

export default AddContract;
