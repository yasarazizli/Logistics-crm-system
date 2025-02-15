import styles from "@/features/dashboard/components/pages/Order/OrderCreate/ClientEditor/ClientEditor.module.scss";
import Input from "@/components/Input/Input.tsx";
import { OrderModel } from "@/features/dashboard/models/order.model.ts";
import { useTranslation } from "react-i18next";

const UserCard = ({ order }: { order: OrderModel }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.user__box}>
      <p className={styles.title}>{t("order.client_editor.user_card.title")}</p>

      <div className={styles.inputs__box}>
        <div className={styles.inputs}>
          <Input
            label={t("order.client_editor.user_card.inputs.name.label")}
            placeholder={t(
              "order.client_editor.user_card.inputs.name.placeholder",
            )}
            value={order?.user?.full_name}
            disabled
          />
          <Input
            label={t("order.client_editor.user_card.inputs.tin.label")}
            placeholder={t(
              "order.client_editor.user_card.inputs.tin.placeholder",
            )}
            value={order?.user?.identity_number}
            disabled
          />
        </div>
        <div className={styles.inputs}>
          <Input
            label={t("order.client_editor.user_card.inputs.phone.label")}
            placeholder={t(
              "order.client_editor.user_card.inputs.phone.placeholder",
            )}
            value={order?.user?.phone}
            disabled
          />
          <Input
            label={t("order.client_editor.user_card.inputs.email.label")}
            placeholder={t(
              "order.client_editor.user_card.inputs.email.placeholder",
            )}
            value={order?.user?.email}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
