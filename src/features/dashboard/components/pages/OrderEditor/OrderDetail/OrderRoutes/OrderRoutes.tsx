import Button from "@/components/Button/Button.tsx";
import { AddIcon } from "@/assets/icons/order.vectors.tsx";
import { defaultRouteValue } from "@/features/dashboard/constants/order.constant.tsx";
import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";
import RouteSection
  from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderRoutes/Route/RouteSection/RouteSection.tsx";
import PackingSection
  from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderRoutes/Route/PackingSection/PackingSection.tsx";
import styles from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderDetail.module.scss";

const OrderRoutes = ({ order, setOrder }: OrderEditorProps) => {
  return (
    <div className={styles.route__list}>
      {order.orderDetail.routes.map((route, index) => {
        if (index === 0) return null;

        return (
          // ----------Route Card----------
          <div className={styles.route__list__item} key={`route_${index}`}>
            {/*/ ----------Route---------- */}
            <RouteSection
              order={order}
              setOrder={setOrder}
              index={index}
              route={route}
            />

            {/*/ ----------Package---------- */}
            <PackingSection
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
  );
};

export default OrderRoutes;
