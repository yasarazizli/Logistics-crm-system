import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { putApprovePrice } from "@/features/dashboard/services/CommercialDirectory/commercial.services.ts";

const ApprovePrice = ({
  modalClose,
  id,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const { status, data } = await putApprovePrice(id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal title={t("cd.modal.confirm")} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default ApprovePrice;
