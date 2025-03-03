import styles from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderDetail.module.scss";
import SectionHead from "@/components/SectionHead/SectionHead.tsx";
import { OrderDateIcon } from "@/assets/icons/order.vectors.tsx";
import Input from "@/components/Input/Input.tsx";
import { dateToInputFormat } from "@/libs/date.ts";
import { useTranslation } from "react-i18next";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";

const OrderDate = ({ order, setOrder }: OrderEditorProps) => {
  const { t } = useTranslation();

  const selectedDate = (value: string, location: string) => {
    setOrder((prevState) => ({
      ...prevState,
      [`${location}_time`]: new Date(value).toISOString(),
    }));
  };

  return (
    <section className={styles.order__date}>
      <SectionHead
        size={"l"}
        name={t("order.route_editor.order_date.title")}
        icon={OrderDateIcon}
      />

      <div className={styles.grid}>
        <Input
          type={"date"}
          label={t("order.route_editor.order_date.inputs.date_start")}
          value={
            order.start_time === null ? "" : dateToInputFormat(order.start_time)
          }
          onChange={(event) =>
            selectedDate(new Date(event.target.value).toISOString(), "start")
          }
        />
        <Input
          type={"date"}
          label={t("order.route_editor.order_date.inputs.date_end")}
          min={order.start_time}
          value={
            order.end_time === null ? "" : dateToInputFormat(order.end_time)
          }
          onChange={(event) =>
            selectedDate(new Date(event.target.value).toISOString(), "end")
          }
        />
      </div>
    </section>
  );
};

export default OrderDate;
