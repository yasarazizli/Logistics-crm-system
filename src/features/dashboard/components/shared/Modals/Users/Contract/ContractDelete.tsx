import Button from "@/components/Button/Button.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";
import { postDeleteUserContractRequest } from "@/features/dashboard/services/user.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";

const ContractDelete = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const deleteContract = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await postDeleteUserContractRequest(id);
    if (status === 200) {
      toast.success(errorMessageHandler(data));
      modalClose(true);
    } else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.contract_delete.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={deleteContract}>
        <div className={styles.form__buttons}>
          <Button
            text={t("users.modals.contract_delete.buttons.reject")}
            viewType={"dark-green"}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button
            viewType={"red"}
            text={t("users.modals.contract_delete.buttons.approve")}
            type={"submit"}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ContractDelete;
