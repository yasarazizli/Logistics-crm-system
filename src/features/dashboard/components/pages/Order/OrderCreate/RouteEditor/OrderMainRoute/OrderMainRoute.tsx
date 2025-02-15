import styles from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/RouteEditor.module.scss";
import SectionHead from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/SectionHead/SectionHead.tsx";
import { FullRouteIcon } from "@/assets/icons/order.vectors.tsx";
import RouteLocation from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/RouteLocation/RouteLocation.tsx";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import { useTranslation } from "react-i18next";

const OrderMainRoute = ({ order, setOrder }: OrderEditorProps) => {
  const { t } = useTranslation();

  const selectedLocation = (value: number, name: string) => {
    setOrder((prevState) => {
      const updatedRoutes = prevState.orderDetail.routes.map((route) =>
        route.main === true ? { ...route, [name]: value } : route,
      );

      return {
        ...prevState,
        orderDetail: {
          ...prevState.orderDetail,
          routes: updatedRoutes,
        },
      };
    });
  };

  return (
    <section className={styles.main__route}>
      <SectionHead
        size={"l"}
        name={t("order.route_editor.order_main_route.title")}
        icon={FullRouteIcon}
      />

      <div className={styles.grid}>
        <RouteLocation
          label={t(
            "order.route_editor.order_main_route.inputs.date.loading_place",
          )}
          route={order.orderDetail.routes.find((route) => route.main === true)}
          position={"start"}
          setLocation={(value: number, name: string) => {
            selectedLocation(value, name);
          }}
        />

        <RouteLocation
          label={t(
            "order.route_editor.order_main_route.inputs.date.discharging_place",
          )}
          route={order.orderDetail.routes.find((route) => route.main === true)}
          position={"end"}
          setLocation={(value: number, name: string) => {
            selectedLocation(value, name);
          }}
        />
      </div>
    </section>
  );
};

export default OrderMainRoute;
