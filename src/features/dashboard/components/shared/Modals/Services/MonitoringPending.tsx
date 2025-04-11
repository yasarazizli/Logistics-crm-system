import Modal from "@/components/Modal/Modal.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Button from "@/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FormEvent, useContext } from "react";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";
import { getServiceMonitoringPendingRequest } from "@/features/dashboard/services/services.service.ts";

const MonitoringPending = ({
  service,
  modalClose,
}: {
  service: ServiceModel;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const vendorContractDelete = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const { status, data } = await getServiceMonitoringPendingRequest(
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
      title={t("services.modals.monitoring_approve.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={vendorContractDelete}>
        <p style={{ color: "#ffffff" }}>
          {`${service.name} ${t("services.modals.monitoring_approve.subtitle")}`}
        </p>
        <div className={styles.form__buttons}>
          <Button
            type={"button"}
            text={t("services.modals.monitoring_approve.buttons.reject")}
            onClick={() => modalClose(false)}
          />
          <Button
            type={"submit"}
            viewType="dark-green"
            text={t("services.modals.monitoring_approve.buttons.approve")}
          />
        </div>
      </form>
    </Modal>
  );
};
export default MonitoringPending;
