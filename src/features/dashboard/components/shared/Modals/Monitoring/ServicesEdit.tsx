import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { formCreator } from "@/libs/form.ts";
import Input from "@/components/Input/Input.tsx";
import { MonitoringServiceEdit } from "@/features/dashboard/services/Monitoring/monitoring.service.ts";

const ServicesEdit = ({
  modalClose,
  id,
  actionType,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  actionType: "agree" | "reject";
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const inputsRef = {
    note: useRef<HTMLInputElement>(null),
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const isApproved = actionType === "agree";

    const formData = formCreator([
      { name: "approved", data: isApproved },
      {
        name: "note",
        data:
          actionType === "reject" ? inputsRef.note.current?.value || "" : "",
      },
    ]);

    const { status, data } = await MonitoringServiceEdit(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  const getModalTitle = () => {
    return actionType === "agree" ? "Agree Services" : "Reject Services";
  };

  return (
    <Modal title={getModalTitle()} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.modal_content}>
          {actionType === "reject" && (
            <Input
              inputRef={inputsRef.note}
              label="Note"
              placeholder="Enter rejection reason"
              type="text"
              required={true}
            />
          )}
        </div>
        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type="button"
            onClick={() => modalClose(false)}
            viewType="red"
          />
          <Button
            text={actionType === "agree" ? "Approve" : "Reject"}
            type="submit"
            viewType="green__light"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ServicesEdit;
