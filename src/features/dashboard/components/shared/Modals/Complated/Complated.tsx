import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { CompletedRequest } from "@/features/dashboard/services/BuyersManager/manager.service.ts";

interface ComplatedProps {
  modalClose: (isRender: boolean) => void;
  selectedId: number | null;
}

const Complated = ({ modalClose, selectedId }: ComplatedProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const create = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedId) {
      toast.error("No item selected");
      return;
    }

    setLoader(true);

    const { status, data } = await CompletedRequest(selectedId);
    if (status === 200) {
      toast.success("Action completed successfully");
      modalClose(true);
    } else {
      toast.error(errorMessageHandler(data));
    }
    setLoader(false);
  };

  return (
    <Modal
      title="Are you sure you want to confirm this action?"
      modalClose={() => modalClose(false)}
    >
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

export default Complated;
