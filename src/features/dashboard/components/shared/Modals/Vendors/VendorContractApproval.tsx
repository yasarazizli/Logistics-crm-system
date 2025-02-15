import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import { postVendorContractApprovalRequest } from "@/features/dashboard/services/vendors.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";

const VendorContractApproval = ({
  vendor,
  modalClose,
}: {
  vendor: VendorModel;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const vendorContractApproval = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await postVendorContractApprovalRequest(vendor.id);
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
      title={t("vendors.modals.contract_verified.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={vendorContractApproval}>
        <p>
          {`${vendor.name} ${t("vendors.modals.contract_verified.subtitle")}`}
        </p>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("vendors.modals.contract_verified.buttons.reject")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
          />
          <Button
            type={"submit"}
            text={t("vendors.modals.contract_verified.buttons.approve")}
            onClick={() => {}}
          />
        </div>
      </form>
    </Modal>
  );
};
export default VendorContractApproval;
