import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { deleteLawyer } from "@/features/dashboard/services/LawyerUsers/lawyerusers.service.ts";

const DeleteLawyerUser = ({
  modalClose,
  id,
}: {
  id: number;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const DeleteLawyerUser = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await deleteLawyer(id);
    if (status === 200) {
      toast.success(errorMessageHandler(data));
      modalClose(true);
    } else {
      toast.error(errorMessageHandler(data));
      modalClose(false);
    }
    setLoader(false);
  };

  return (
    <Modal
      title={t("workers.modals.delete.lawyer")}
      subtitle={`${t("workers.modals.delete.lawyer__subtitle")}`}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={DeleteLawyerUser}>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("workers.modals.delete.buttons.reject")}
            onClick={() => modalClose(false)}
          />
          <Button
            type={"submit"}
            text={t("workers.modals.delete.buttons.approve")}
            viewType={"red"}
          />
        </div>
      </form>
    </Modal>
  );
};
export default DeleteLawyerUser;
