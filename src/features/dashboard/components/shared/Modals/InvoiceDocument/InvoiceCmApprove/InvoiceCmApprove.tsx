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
import { ApproveDocumentCm } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

const InvoiceApprove = ({
  modalClose,
  id,
  actionType,
  documentType = "invoice",
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  actionType: "agree" | "reject";
  documentType?: "invoice" | "instruction";
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const noteRef = useRef<HTMLInputElement>(null);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "document_type",
        data: documentType,
      },
      {
        name: "note",
        data: actionType === "reject" ? noteRef.current?.value || "" : "",
      },
    ]);

    const { status, data } = await ApproveDocumentCm(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  const getModalTitle = () => {
    if (actionType === "agree") {
      return documentType === "invoice"
        ? "Approve Invoice"
        : "Approve Instruction";
    }
    return "";
  };

  const getConfirmText = () => {
    if (actionType === "agree") {
      return documentType === "invoice"
        ? "Do you want to approve this invoice?"
        : "Do you want to approve this instruction?";
    }
    return "";
  };

  return (
    <Modal title={getModalTitle()} modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={create}>
        <div className={styles.modal_content}>
          <p style={{ paddingBottom: "10px" }}>{getConfirmText()}</p>

          {actionType === "reject" && (
            <Input
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

export default InvoiceApprove;
