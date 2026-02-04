import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { DeleteServicesApi } from "@/features/dashboard/services/Services&Vendor/all.service.ts";

const DeleteServices = ({
  modalClose,
  selectedId,
}: {
  modalClose: (isRender: boolean) => void;
  selectedId: number | null;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const { status, data } = await DeleteServicesApi(selectedId);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
    modalClose(true);
  };

  return (
    <Modal title="Delete Tasks" modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType="red"
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button text="Delete" type={"submit"} />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteServices;
