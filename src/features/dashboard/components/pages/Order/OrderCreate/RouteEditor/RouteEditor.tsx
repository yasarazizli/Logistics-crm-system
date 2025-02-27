import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";

import { ThemeContext } from "@/contexts/ThemeContext.tsx";

import OrderDate from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/OrderDate/OrderDate.tsx";
import OrderMainRoute from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/OrderMainRoute/OrderMainRoute.tsx";
import OrderParticipants from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/OrderParticipants/OrderParticipants.tsx";
import OrderRoutes from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/OrderRoutes/OrderRoutes.tsx";
import TextArea from "@/components/TextArea/TextArea.tsx";

import styles from "./RouteEditor.module.scss";

const RouteEditor = ({ order, setOrder }: OrderEditorProps) => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className={`${styles.route__editor} ${darkMode && styles.dark}`}>
      <p className={styles.route__editor__title}>
        {t("order.route_editor.title")}
      </p>

      <section className={styles.section}>
        <OrderDate order={order} setOrder={setOrder} />

        <OrderParticipants order={order} setOrder={setOrder} />

        <OrderMainRoute order={order} setOrder={setOrder} />

        <OrderRoutes order={order} setOrder={setOrder} />
      </section>

      <section className={styles.section}>
        <TextArea
          placeholder={"Qeyd"}
          value={order.note}
          onChange={(event) => {
            setOrder((prevState) => ({
              ...prevState,
              note: event.target.value,
            }));
          }}
        />
      </section>
    </div>
  );
};

export default RouteEditor;
