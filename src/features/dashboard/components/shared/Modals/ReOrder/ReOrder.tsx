import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { formCreator } from "@/libs/form.ts";
import {
  ApproveDocument,
  CloneOrder,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

const ReOrder = ({
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
  const noteRef = useRef<HTMLInputElement>(null);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    if (actionType === "agree") {
      const { status, data } = await CloneOrder(id);
      if (status === 200) {
        toast.success(errorMessageHandler(data));
        modalClose(true);
      } else {
        toast.error(errorMessageHandler(data));
        modalClose(false);
      }
    } else {
      const isApproved = false;
      const formData = formCreator([
        { name: "is_approve", data: isApproved },
        {
          name: "note",
          data: noteRef.current?.value || "",
        },
      ]);

      const { status, data } = await ApproveDocument(formData, id);
      if (status === 200) {
        toast.success(errorMessageHandler(data));
        modalClose(true);
      } else {
        toast.error(errorMessageHandler(data));
        modalClose(false);
      }
    }

    setLoader(false);
  };

  const getModalTitle = () => {
    return actionType === "agree"
      ? "Approve Clone Order"
      : "Reject Clone Order";
  };

  const getConfirmText = () => {
    return actionType === "agree"
      ? "Do you want to clone this order?"
      : "Do you want to reject this clone order?";
  };

  return (
    <Modal title={getModalTitle()} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.modal_content}>
          <p style={{ paddingBottom: "10px" }}>{getConfirmText()}</p>

          {actionType === "reject" && (
            <div className={styles.inputGroup}>
              <label htmlFor="note" className={styles.label}>
                Rejection Reason
              </label>
              <input
                id="note"
                type="text"
                placeholder="Enter rejection reason"
                ref={noteRef}
                className={styles.input}
                required={actionType === "reject"}
              />
            </div>
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
            text={actionType === "agree" ? "Clone Order" : "Reject"}
            type="submit"
            viewType={actionType === "agree" ? "green__light" : "red"}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ReOrder;
