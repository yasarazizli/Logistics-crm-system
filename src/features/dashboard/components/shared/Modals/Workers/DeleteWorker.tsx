import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { WorkerModel } from "@/features/dashboard/models/worker.model.ts";
import { postDeleteWorkersRequest } from "@/features/dashboard/services/workers.service.ts";

const DeleteWorker = ({
  worker,
  modalClose,
}: {
  worker: WorkerModel;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const deleteWorkers = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await postDeleteWorkersRequest(worker.id);
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
      title={t("workers.modals.delete.title")}
      subtitle={`${worker.full_name} ${t("workers.modals.delete.subtitle")}`}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={deleteWorkers}>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("workers.modals.delete.buttons.reject")}
            viewType={"dark-green"}
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
export default DeleteWorker;
