import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { FormEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";
import { getServiceVerifiedContractRequest } from "@/features/dashboard/services/services.service.ts";

const ServiceContractApproval = ({
  service,
  modalClose,
}: {
  service: ServiceModel;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const vendorContractApproval = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await getServiceVerifiedContractRequest(
      service.id,
    );
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
      title={t("services.modals.contract_verified.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={vendorContractApproval}>
        <p>
          {`${service.name} ${t("services.modals.contract_verified.subtitle")}`}
        </p>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("services.modals.contract_verified.buttons.reject")}
            viewType={"dark-green"}
            onClick={() => modalClose(false)}
          />
          <Button
            type={"submit"}
            text={t("services.modals.contract_verified.buttons.approve")}
          />
        </div>
      </form>
    </Modal>
  );
};
export default ServiceContractApproval;
