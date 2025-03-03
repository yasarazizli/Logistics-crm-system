import Input from "@/components/Input/Input.tsx";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import SectionHead from "@/components/SectionHead/SectionHead.tsx";
import { OrderParticipantsIcon } from "@/assets/icons/order.vectors.tsx";
import { useTranslation } from "react-i18next";
import styles from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderDetail.module.scss";

const OrderParticipants = ({ order, setOrder }: OrderEditorProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.order__detail}>
      <SectionHead
        size={"l"}
        name={t("order.route_editor.order_participants.title")}
        icon={OrderParticipantsIcon}
      />

      <div className={styles.grid}>
        <Input
          label={t("order.route_editor.order_participants.receiver")}
          placeholder={t("order.route_editor.order_participants.receiver")}
          value={order.receiver}
          onChange={(event) => {
            setOrder((prevState) => ({
              ...prevState,
              receiver: event.target?.value || "",
            }));
          }}
        />

        <Input
          label={t("order.route_editor.order_participants.shipper")}
          placeholder={t("order.route_editor.order_participants.shipper")}
          value={order.shipper}
          onChange={(event) => {
            setOrder((prevState) => ({
              ...prevState,
              shipper: event.target?.value || "",
            }));
          }}
        />
      </div>
    </div>
  );
};

export default OrderParticipants;
