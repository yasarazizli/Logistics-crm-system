import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { CityDeleteRequest } from "@/features/dashboard/services/Controls/city.service.ts";

const DeleteCity = ({
  modalClose,
  id,
}: {
  id: number;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const deleteDate = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await CityDeleteRequest(id);
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
      title={t("workers.modals.delete.title__3")}
      subtitle={`${t("workers.modals.delete.subtitle__3")}`}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={deleteDate}>
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
export default DeleteCity;
