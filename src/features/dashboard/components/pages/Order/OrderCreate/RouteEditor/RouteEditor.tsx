import styles from "./RouteEditor.module.scss";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import TextArea from "@/components/TextArea/TextArea.tsx";
import RouteItem from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/Route/RouteSection/RouteSection.tsx";
import Button from "@/components/Button/Button.tsx";
import {
  defaultRouteValue,
  expeditors,
} from "@/features/dashboard/constants/order.constant.tsx";
import PackingItem from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/Route/PackingSection/PackingSection.tsx";
import Input from "@/components/Input/Input.tsx";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { AddIcon } from "@/assets/icons/order.vectors.tsx";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import OrderDate from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/OrderDate/OrderDate.tsx";
import OrderMainRoute from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/OrderMainRoute/OrderMainRoute.tsx";

const RouteEditor = ({ order, setOrder }: OrderEditorProps) => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);

  return (
    <div className={`${styles.route__editor} ${darkMode && styles.dark}`}>
      <p className={styles.route__editor__title}>
        {t("order.route_editor.title")}
      </p>

      <section className={styles.section}>
        <OrderDate order={order} setOrder={setOrder} />

        <OrderMainRoute order={order} setOrder={setOrder} />

        <div className={styles.route__list}>
          {order.orderDetail.routes.map((route, index) => {
            if (index === 0) return null;

            return (
              // ----------Route Card----------
              <div className={styles.route__list__item} key={`route_${index}`}>
                {/*/ ----------Route---------- */}
                <RouteItem
                  order={order}
                  setOrder={setOrder}
                  index={index}
                  route={route}
                />

                {/*/ ----------Package---------- */}
                <PackingItem
                  routeIndex={index}
                  order={order}
                  setOrder={setOrder}
                />
              </div>
            );
          })}

          <Button
            icon={AddIcon}
            text={"Add another route"}
            viewType={"dark-green"}
            onClick={() => {
              setOrder((prevState) => {
                const { routes } = prevState.orderDetail;

                const updatedRoutes = [
                  ...routes,
                  {
                    ...defaultRouteValue,
                    priority: routes.length + 1,
                  },
                ];

                return {
                  ...prevState,
                  orderDetail: {
                    ...prevState.orderDetail,
                    routes: updatedRoutes,
                  },
                };
              });
            }}
          />
        </div>

        {["commercial_manager"].includes(auth.role) &&
          order.status === "AwaitingSalesManagerApproval" && (
            <>
              <div className={styles.buyer__detail}>
                <Input
                  label={"Satıcı"}
                  value={order.receiver}
                  onChange={(event) => {
                    setOrder((prevState) => ({
                      ...prevState,
                      receiver: event.target?.value || "",
                    }));
                  }}
                />

                <Input
                  label={"Alıcı"}
                  value={order.shipper}
                  onChange={(event) => {
                    setOrder((prevState) => ({
                      ...prevState,
                      shipper: event.target?.value || "",
                    }));
                  }}
                />

                <SelectOption
                  label={"Expeditor"}
                  value={
                    expeditors.filter(
                      (expeditor) => expeditor.value === order.expeditor,
                    )[0]
                  }
                  options={expeditors}
                  onChange={(option) => {
                    setOrder((prevState) => ({
                      ...prevState,
                      expeditor: String(option.value),
                    }));
                  }}
                />
              </div>
            </>
          )}
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
