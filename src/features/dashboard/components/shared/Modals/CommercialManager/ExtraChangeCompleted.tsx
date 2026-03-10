import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { ExtraChangeConfirm } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

interface ComplatedProps {
  modalClose: (isRender: boolean) => void;
  selectedId: number | null;
}

const ExtraChangeCompleted = ({ modalClose, selectedId }: ComplatedProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const create = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedId) {
      toast.error("No item selected");
      return;
    }

    setLoader(true);

    const { status, data } = await ExtraChangeConfirm(selectedId);
    if (status === 200) {
      toast.success("Action completed successfully");
      modalClose(true);
    } else {
      toast.error(errorMessageHandler(data));
    }
    setLoader(false);
  };

  return (
    <Modal title="Do you want to confirm?" modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType="red"
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text="Yes" type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default ExtraChangeCompleted;
