import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext } from "react";
import { postVendorContractDeleteRequest } from "@/features/dashboard/services/vendors.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";

const BasicModal = ({
  vendor,
  modalClose,
}: {
  vendor: VendorModel;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const vendorContractDelete = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await postVendorContractDeleteRequest(vendor.id);
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
      title={t("vendors.modals.contract_delete.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={vendorContractDelete}>
        <p>
          {`${vendor.name} ${t("vendors.modals.contract_delete.subtitle")}`}
        </p>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("vendors.modals.contract_delete.buttons.reject")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
          />
          <Button
            type={"submit"}
            text={t("vendors.modals.contract_delete.buttons.approve")}
            onClick={() => {}}
          />
        </div>
      </form>
    </Modal>
  );
};
export default BasicModal;
