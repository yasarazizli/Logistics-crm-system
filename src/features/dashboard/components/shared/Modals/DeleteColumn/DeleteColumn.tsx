import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";

const DeleteColumn = ({
  modalClose,
}: {
  modalClose: (isConfirm: boolean) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const handleDelete = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    setLoader(false);
    modalClose(true);
  };

  const handleCancel = () => {
    modalClose(false);
  };

  return (
    <Modal title="Delete Column" modalClose={handleCancel}>
      <form className={styles.form} onSubmit={handleDelete}>
        <div className={styles.modal_content}>
          <p>Are you sure you want to delete this column?</p>
        </div>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            onClick={handleCancel}
            viewType="red"
          />
          <Button text="Delete" type="submit" viewType="dark-green" />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteColumn;
